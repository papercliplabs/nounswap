// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {TimelockNFTSwapper} from "../../src/TimelockNFTSwapper.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {MockERC721} from "../mock/MockERC721.sol";

abstract contract TimelockNFTSwapperTestHelper is Test {
    IERC721 public nft;
    TimelockNFTSwapper public nftSwapper;

    // Addresses
    address constant NOUNS_TREASURY = address(0xb1a32FC9F9D8b2cf86C068Cae13108809547ef71);
    address constant NOUNS_NFT_ADDRESS = address(0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03);

    address constant DEPLOYER = address(1);
    address constant USER_A = address(2);
    address constant USER_B = address(3);
    address constant SWAP_POOL = NOUNS_TREASURY; // So we can run tests on mainnet fork (on non-fork doesn't matter)
    address payable constant FEE_RECEIPIENT = payable(address(5));

    uint256 constant INITIAL_DEAL_AMOUNT = 10000 ether;

    // NFT token IDs
    uint256 constant USER_A_INITIAL_TOKEN_ID = 0;
    uint256 constant USER_B_INITIAL_TOKEN_ID = 1;
    uint256[] SWAP_POOL_INITIAL_TOKEN_IDS = [2, 3, 4, 5];

    // Price params
    uint256 constant SWAP_PRICE_CURVE_BASE = 0.25 ether;
    uint256 constant SWAP_PRICE_CURVE_SLOPE = 0.01 ether;
    uint256 constant QUEUE_FEE = 0.01 ether;

    // Timelock Timing
    uint256 constant QUEUE_PERIOD = 10 days;
    uint256 constant EXECUTION_GRACE_PERIOD = 10 days;

    // Expected events
    event SwapQueued(
        address indexed swapper,
        uint256 indexed swapId,
        uint256 inputTokenId,
        uint256 outputTokenId,
        uint256 queuePeriodEndTimestamp
    );
    event SwapExecuted(
        address indexed swapper, uint256 indexed swapId, uint256 inputTokenId, uint256 outputTokenId, uint256 swapFee
    );

    // Expected errors
    error WrongNFTOwner(uint256 tokenId, address requiredOwner, address actualOwner);
    error MissingNFTApproval(uint256 tokenId);
    error InsufficentFee(uint256 required, uint256 provided);
    error NFTInvolvedInPendingSwap(uint256 tokenId, uint256 swapId);
    error SwapNeverQueued();
    error SwapIsInQueuePeriod(uint256 queuePeriodEndTimestamp);
    error InvalidExecutor(address requiredExecutor);
    error SwapAlreadyExecuted();
    error SwapExpired(uint256 expirationTimestamp);
    error FailedToSendFeesToFeeRecipient();

    ////
    // Setup Helpers
    ////

    function _basicSetup() internal {
        _setupDeal();

        _setupNft();

        // Deploy swapper
        vm.prank(DEPLOYER);
        nftSwapper = new TimelockNFTSwapper({
            nft: nft,
            swapPool: SWAP_POOL,
            feeRecipient_: FEE_RECEIPIENT,
            swapPriceCurveBase_: SWAP_PRICE_CURVE_BASE,
            swapPriceCurveSlope_: SWAP_PRICE_CURVE_SLOPE,
            queueFee: QUEUE_FEE,
            queuePeriod_: QUEUE_PERIOD,
            executionGracePeriod: EXECUTION_GRACE_PERIOD
        });

        // Approve all tokens from swapPool for swapper
        vm.prank(SWAP_POOL);
        nft.setApprovalForAll(address(nftSwapper), true);
    }

    function _setupDeal() internal {
        // Give users ETH
        deal(DEPLOYER, INITIAL_DEAL_AMOUNT);
        deal(USER_A, INITIAL_DEAL_AMOUNT);
        deal(USER_B, INITIAL_DEAL_AMOUNT);
    }

    function _forceTransferNFT(address to, uint256 tokenId) internal {
        address owner = nft.ownerOf(tokenId);

        vm.prank(owner);
        nft.transferFrom(owner, to, tokenId);
    }

    function _setupNft() internal {
        try vm.activeFork() {
            // Using a fork (passed in --fork-url)
            nft = IERC721(NOUNS_NFT_ADDRESS);

            // Force transfer all NFT's used in tests
            _forceTransferNFT(USER_A, USER_A_INITIAL_TOKEN_ID);
            _forceTransferNFT(USER_B, USER_B_INITIAL_TOKEN_ID);
            for (uint256 i = 0; i < SWAP_POOL_INITIAL_TOKEN_IDS.length; i++) {
                _forceTransferNFT(SWAP_POOL, SWAP_POOL_INITIAL_TOKEN_IDS[i]);
            }
        } catch (bytes memory) {
            // Not using a fork (didn't pass in --fork-url)

            // Deploy NFT
            vm.startPrank(DEPLOYER);
            MockERC721 mockNft = new MockERC721();
            nft = IERC721(address(mockNft));

            // Seed users and swap pool with NFTs
            mockNft.mint(USER_A, USER_A_INITIAL_TOKEN_ID);
            mockNft.mint(USER_B, USER_B_INITIAL_TOKEN_ID);
            for (uint256 i = 0; i < SWAP_POOL_INITIAL_TOKEN_IDS.length; i++) {
                mockNft.mint(SWAP_POOL, SWAP_POOL_INITIAL_TOKEN_IDS[i]);
            }
            vm.stopPrank();
        }
    }

    ////
    // Event Helpers
    ////

    function _expectEventSwapQueued(
        address swapper,
        uint256 swapId,
        uint256 inputTokenId,
        uint256 outputTokenId,
        uint256 queuePeriodEndTimestamp
    ) internal {
        vm.expectEmit(true, true, true, true);
        emit SwapQueued(swapper, swapId, inputTokenId, outputTokenId, queuePeriodEndTimestamp);
    }

    function _expectEventSwapExecuted(
        address swapper,
        uint256 swapId,
        uint256 inputTokenId,
        uint256 outputTokenId,
        uint256 swapFee
    ) internal {
        vm.expectEmit(true, true, true, true);
        emit SwapExecuted(swapper, swapId, inputTokenId, outputTokenId, swapFee);
    }

    ////
    // Error Helpers
    ////

    function _expectRevertWrongNFTOwner(uint256 tokenId, address requiredOwner, address owner) internal {
        vm.expectRevert(abi.encodeWithSelector(WrongNFTOwner.selector, tokenId, requiredOwner, owner));
    }

    function _expectRevertMissingNFTApproval(uint256 tokenId) internal {
        vm.expectRevert(abi.encodeWithSelector(MissingNFTApproval.selector, tokenId));
    }

    function _expectRevertInsuffucuentFee(uint256 required, uint256 provided) internal {
        vm.expectRevert(abi.encodeWithSelector(InsufficentFee.selector, required, provided));
    }

    function _expectRevertNFTInvolvedInPendingSwap(uint256 tokenId, uint256 swapId) internal {
        vm.expectRevert(abi.encodeWithSelector(NFTInvolvedInPendingSwap.selector, tokenId, swapId));
    }

    function _expectRevertSwapNeverQueued() internal {
        vm.expectRevert(abi.encodeWithSelector(SwapNeverQueued.selector));
    }

    function _expectRevertInvalidExecutor(address requiredExecutor) internal {
        vm.expectRevert(abi.encodeWithSelector(InvalidExecutor.selector, requiredExecutor));
    }

    function _expectRevertSwapIsInQueuePeriod(uint256 queuePeriodEndTimestamp) internal {
        vm.expectRevert(abi.encodeWithSelector(SwapIsInQueuePeriod.selector, queuePeriodEndTimestamp));
    }

    function _expectRevertSwapAlreadyExecuted() internal {
        vm.expectRevert(abi.encodeWithSelector(SwapAlreadyExecuted.selector));
    }

    function _expectRevertSwapExpired(uint256 expirationTimestamp) internal {
        vm.expectRevert(abi.encodeWithSelector(SwapExpired.selector, expirationTimestamp));
    }

    function _expectRevertFailedToSendFeesToFeeRecipient() internal {
        vm.expectRevert(abi.encodeWithSelector(FailedToSendFeesToFeeRecipient.selector));
    }
}
