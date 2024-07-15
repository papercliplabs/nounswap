// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {TimelockNFTSwapper} from "../../src/TimelockNFTSwapper.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {MockERC721} from "../mock/MockERC721.sol";
import {TimelockNFTSwapperTestHelper} from "./TimelockNFTSwapperTestHelper.sol";

contract QueueSwapTest is Test, TimelockNFTSwapperTestHelper {
    ////
    // Setup
    ////

    function setUp() public {
        _basicSetup();
    }

    ////
    // Successful Tests
    ////

    function test_queueEvent() public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];

        vm.startPrank(USER_A);
        nft.approve(address(nftSwapper), inputTokenId);
        _expectEventSwapQueued(USER_A, 0, inputTokenId, outputTokenId, block.timestamp + QUEUE_PERIOD);
        nftSwapper.queueSwap{value: QUEUE_FEE}(inputTokenId, outputTokenId);
    }

    function test_swapIdIncrements() public {
        vm.startPrank(USER_A);
        uint256 userAInputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 userAOutputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];
        nft.approve(address(nftSwapper), userAInputTokenId);
        uint256 userASwapId = nftSwapper.queueSwap{value: QUEUE_FEE}(userAInputTokenId, userAOutputTokenId);
        assertEq(userASwapId, 0);
        vm.stopPrank();

        vm.startPrank(USER_B);
        uint256 userBinputTokenId = USER_B_INITIAL_TOKEN_ID;
        uint256 userBOutputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[1];
        nft.approve(address(nftSwapper), userBinputTokenId);
        uint256 userBSwapId = nftSwapper.queueSwap{value: QUEUE_FEE}(userBinputTokenId, userBOutputTokenId);
        assertEq(userBSwapId, 1);
        vm.stopPrank();
    }

    function test_inputTokenQueueAfterExpiry() public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;

        vm.startPrank(USER_A);

        uint256 firstOutputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];
        nft.approve(address(nftSwapper), inputTokenId);
        nftSwapper.queueSwap{value: QUEUE_FEE}(inputTokenId, firstOutputTokenId);

        skip(QUEUE_PERIOD + EXECUTION_GRACE_PERIOD + 1);

        uint256 secondOutputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[1];
        nftSwapper.queueSwap{value: QUEUE_FEE}(inputTokenId, secondOutputTokenId);
    }

    function test_outputTokenQueueAfterExpiry() public {
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];

        vm.startPrank(USER_A);
        uint256 userAInputTokenId = USER_A_INITIAL_TOKEN_ID;
        nft.approve(address(nftSwapper), userAInputTokenId);
        nftSwapper.queueSwap{value: QUEUE_FEE}(userAInputTokenId, outputTokenId);
        vm.stopPrank();

        skip(QUEUE_PERIOD + EXECUTION_GRACE_PERIOD + 1);

        vm.startPrank(USER_B);
        uint256 userBinputTokenId = USER_B_INITIAL_TOKEN_ID;
        nft.approve(address(nftSwapper), userBinputTokenId);
        nftSwapper.queueSwap{value: QUEUE_FEE}(userBinputTokenId, outputTokenId);
        vm.stopPrank();
    }

    function test_feeReceipientBalanceIncreace() public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];

        uint256 feeRecipientBalanceBefore = FEE_RECEIPIENT.balance;

        vm.startPrank(USER_A);
        nft.approve(address(nftSwapper), inputTokenId);
        nftSwapper.queueSwap{value: QUEUE_FEE}(inputTokenId, outputTokenId);

        assertEq(address(FEE_RECEIPIENT).balance, feeRecipientBalanceBefore + QUEUE_FEE);
    }

    ////
    // Reverting Tests
    ////

    function test_reverts_whenInputTokenHasWrongOwner() public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];

        vm.prank(USER_A);
        nft.approve(address(nftSwapper), inputTokenId);

        vm.prank(USER_B);
        _expectRevertWrongNFTOwner(inputTokenId, USER_B, USER_A);
        nftSwapper.queueSwap{value: QUEUE_FEE}(inputTokenId, outputTokenId);
    }

    function test_reverts_whenInputTokenNotApproved() public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];

        vm.prank(USER_A);
        _expectRevertMissingNFTApproval(inputTokenId);
        nftSwapper.queueSwap{value: QUEUE_FEE}(inputTokenId, outputTokenId);
    }

    function test_reverts_whenOutputTokenHasWrongOwner() public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = USER_B_INITIAL_TOKEN_ID;

        vm.prank(USER_A);
        nft.approve(address(nftSwapper), inputTokenId);

        vm.prank(USER_B);
        nft.approve(address(nftSwapper), outputTokenId);

        vm.prank(USER_A);
        _expectRevertWrongNFTOwner(outputTokenId, SWAP_POOL, USER_B);
        nftSwapper.queueSwap{value: QUEUE_FEE}(inputTokenId, outputTokenId);
    }

    function test_reverts_whenOutputTokenNotApproved() public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];

        vm.prank(SWAP_POOL);
        nft.setApprovalForAll(address(nftSwapper), false); // revoke all approvals from swap pool

        vm.startPrank(USER_A);
        nft.approve(address(nftSwapper), inputTokenId);
        _expectRevertMissingNFTApproval(outputTokenId);
        nftSwapper.queueSwap{value: QUEUE_FEE}(inputTokenId, outputTokenId);
    }

    function test_reverts_whenInputTokenInvolvedInPendingSwap() public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;

        vm.startPrank(USER_A);

        uint256 firstOutputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];
        nft.approve(address(nftSwapper), inputTokenId);
        nftSwapper.queueSwap{value: QUEUE_FEE}(inputTokenId, firstOutputTokenId);

        // Immediate
        uint256 secondOutputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[1];
        nft.approve(address(nftSwapper), inputTokenId);
        _expectRevertNFTInvolvedInPendingSwap(inputTokenId, 0);
        nftSwapper.queueSwap{value: QUEUE_FEE}(inputTokenId, secondOutputTokenId);

        skip(QUEUE_PERIOD + EXECUTION_GRACE_PERIOD - 1);

        // Right before expiry
        nft.approve(address(nftSwapper), inputTokenId);
        _expectRevertNFTInvolvedInPendingSwap(inputTokenId, 0);
        nftSwapper.queueSwap{value: QUEUE_FEE}(inputTokenId, secondOutputTokenId);
    }

    function test_reverts_whenOutputTokenInvolvedInPendingSwap() public {
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];

        vm.startPrank(USER_A);
        uint256 userAInputTokenId = USER_A_INITIAL_TOKEN_ID;
        nft.approve(address(nftSwapper), userAInputTokenId);
        nftSwapper.queueSwap{value: QUEUE_FEE}(userAInputTokenId, outputTokenId);
        vm.stopPrank();

        // Immediate
        vm.startPrank(USER_B);
        uint256 userBInputTokenId = USER_B_INITIAL_TOKEN_ID;
        nft.approve(address(nftSwapper), userBInputTokenId);
        _expectRevertNFTInvolvedInPendingSwap(outputTokenId, 0);
        nftSwapper.queueSwap{value: QUEUE_FEE}(userBInputTokenId, outputTokenId);

        skip(QUEUE_PERIOD + EXECUTION_GRACE_PERIOD - 1);

        // Right before expiry
        nft.approve(address(nftSwapper), userBInputTokenId);
        _expectRevertNFTInvolvedInPendingSwap(outputTokenId, 0);
        nftSwapper.queueSwap{value: QUEUE_FEE}(userBInputTokenId, outputTokenId);
    }

    function testFuzz_reverts_whenQueueFeeInvalid(uint256 amount) public {
        vm.assume(amount != QUEUE_FEE);
        vm.assume(amount < type(uint256).max - 2 << 100); // TODO: Weird issue only when fork testing without - EvmError: OverflowPayment
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];

        deal(USER_A, type(uint256).max);
        vm.startPrank(USER_A);
        nft.approve(address(nftSwapper), inputTokenId);
        _expectRevertInsuffucuentFee(QUEUE_FEE, amount);
        nftSwapper.queueSwap{value: amount}(inputTokenId, outputTokenId);
    }

    function test_reverts_whenInvalidFeeRecipient() public {
        TimelockNFTSwapper otherSwapper = new TimelockNFTSwapper({
            nft: nft,
            swapPool: SWAP_POOL,
            feeRecipient_: payable(address(nft)), // Contract without payable fallback
            swapPriceCurveBase_: SWAP_PRICE_CURVE_BASE,
            swapPriceCurveSlope_: SWAP_PRICE_CURVE_SLOPE,
            queueFee: QUEUE_FEE,
            queuePeriod_: QUEUE_PERIOD,
            executionGracePeriod: EXECUTION_GRACE_PERIOD
        });

        // Approve all tokens from swapPool for otherSwapper
        vm.prank(SWAP_POOL);
        nft.setApprovalForAll(address(otherSwapper), true);

        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;

        vm.startPrank(USER_A);
        nft.approve(address(otherSwapper), inputTokenId);
        _expectRevertFailedToSendFeesToFeeRecipient();
        otherSwapper.queueSwap{value: QUEUE_FEE}(inputTokenId, SWAP_POOL_INITIAL_TOKEN_IDS[0]);
        vm.stopPrank();
    }
}
