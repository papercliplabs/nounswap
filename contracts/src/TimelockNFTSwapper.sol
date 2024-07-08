// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

contract TimelockNFTSwapper {
    using Math for uint256;

    ////
    // Types
    ////

    struct Swap {
        address swapper;
        uint256 inputTokenId;
        uint256 outputTokenId;
        uint256 queuePeriodEndTimestamp;
        bool executed;
    }

    struct SwapInfo {
        uint256 swapId;
        bool exists;
    }

    ////
    // Constants
    ////

    IERC721 public immutable NFT;
    address public immutable SWAP_POOL;
    address payable public immutable FEE_RECEIPIENT;
    uint256 public immutable SWAP_PRICE_CURVE_BASE;
    uint256 public immutable SWAP_PRICE_CURVE_SLOPE;
    uint256 public immutable QUEUE_FEE;
    uint256 public immutable QUEUE_PERIOD;
    uint256 public immutable EXECUTION_GRACE_PERIOD;

    ////
    // Storage
    ////

    Swap[] public swaps;
    mapping(uint256 inputTokenId => SwapInfo swapInfo) public inputTokenSwapInfos;
    mapping(uint256 outputTokenId => SwapInfo swapInfo) public outputTokenSwapInfos;

    ////
    // Events
    ////

    event SwapQueued(
        address indexed swapper,
        uint256 indexed swapId,
        uint256 inputTokenId,
        uint256 outputTokenId,
        uint256 queueFee,
        uint256 queuePeriodEndTimestamp
    );
    event SwapExecuted(
        address indexed swapper, uint256 indexed swapId, uint256 inputTokenId, uint256 outputTokenId, uint256 swapFee
    );

    ////
    // Errors
    ////

    error WrongNFTOwner(uint256 tokenId, address requiredOwner, address actualOwner);
    error MissingNFTApproval(uint256 tokenId);
    error InsufficentFee(uint256 required, uint256 provided);
    error NFTInvolvedInPendingSwap(uint256 tokenId, uint256 swapId);
    error SwapNeverQueued();
    error SwapIsInQueuePeriod(uint256 queuePeriodEndTimestamp);
    error InvalidExecutor(address requied);
    error SwapAlreadyExecuted();
    error SwapExpired(uint256 expirationTimestamp);
    error FailedToSendFeesToFeeRecipient();

    ////
    // Modifiers
    ////

    modifier validateCorrectOwnerAndAuthorizedToSpendNFT(address requiredOwner, uint256 tokenId) {
        {
            address owner = NFT.ownerOf(tokenId);
            if (owner != requiredOwner) {
                revert WrongNFTOwner(tokenId, requiredOwner, owner);
            }

            bool authorized = NFT.isApprovedForAll(owner, address(this)) || (NFT.getApproved(tokenId) == address(this));
            if (!authorized) {
                revert MissingNFTApproval(tokenId);
            }
        }
        _;
    }

    modifier validateNFTIsNotInputInPendingSwap(uint256 tokenId) {
        {
            SwapInfo storage inputTokenSwapInfo = inputTokenSwapInfos[tokenId];
            if (inputTokenSwapInfo.exists) {
                Swap storage inputSwap = swaps[inputTokenSwapInfo.swapId];
                if (
                    !inputSwap.executed
                        && block.timestamp < (inputSwap.queuePeriodEndTimestamp + EXECUTION_GRACE_PERIOD)
                ) {
                    revert NFTInvolvedInPendingSwap(tokenId, inputTokenSwapInfo.swapId);
                }
            }
        }
        _;
    }

    modifier validateNFTIsNotOutputInPendingSwap(uint256 tokenId) {
        {
            SwapInfo storage outputTokenSwapInfo = outputTokenSwapInfos[tokenId];
            if (outputTokenSwapInfo.exists) {
                Swap storage outputSwap = swaps[outputTokenSwapInfo.swapId];
                if (
                    !outputSwap.executed
                        && block.timestamp < (outputSwap.queuePeriodEndTimestamp + EXECUTION_GRACE_PERIOD)
                ) {
                    revert NFTInvolvedInPendingSwap(tokenId, outputTokenSwapInfo.swapId);
                }
            }
        }
        _;
    }

    ////
    // Constructor
    ////

    constructor(
        IERC721 nft,
        address swapPool,
        address payable feeRecipient,
        uint256 swapPriceCurveBase,
        uint256 swapPriceCurveSlope,
        uint256 queueFee,
        uint256 queuePeriod,
        uint256 executionGracePeriod
    ) {
        NFT = nft;
        SWAP_POOL = swapPool;
        FEE_RECEIPIENT = feeRecipient;
        SWAP_PRICE_CURVE_BASE = swapPriceCurveBase;
        SWAP_PRICE_CURVE_SLOPE = swapPriceCurveSlope;
        QUEUE_FEE = queueFee;
        QUEUE_PERIOD = queuePeriod;
        EXECUTION_GRACE_PERIOD = executionGracePeriod;
    }

    ////
    // External functions
    ////

    function queueSwap(uint256 inputTokenId, uint256 outputTokenId)
        external
        payable
        validateCorrectOwnerAndAuthorizedToSpendNFT(msg.sender, inputTokenId)
        validateCorrectOwnerAndAuthorizedToSpendNFT(SWAP_POOL, outputTokenId)
        validateNFTIsNotInputInPendingSwap(inputTokenId)
        validateNFTIsNotOutputInPendingSwap(outputTokenId)
        returns (uint256)
    {
        if (msg.value != QUEUE_FEE) {
            revert InsufficentFee(QUEUE_FEE, msg.value);
        }

        uint256 swapId = swaps.length;
        Swap memory swap = Swap({
            swapper: msg.sender,
            inputTokenId: inputTokenId,
            outputTokenId: outputTokenId,
            queuePeriodEndTimestamp: block.timestamp + QUEUE_PERIOD,
            executed: false
        });

        swaps.push(swap);

        inputTokenSwapInfos[inputTokenId] = SwapInfo({swapId: swapId, exists: true});
        outputTokenSwapInfos[outputTokenId] = SwapInfo({swapId: swapId, exists: true});

        sendFeesToRecipient(msg.value);

        emit SwapQueued(
            swap.swapper, swapId, swap.inputTokenId, swap.outputTokenId, msg.value, swap.queuePeriodEndTimestamp
        );

        return swapId;
    }

    function executeSwap(uint256 swapId) external payable {
        if (swapId >= swaps.length) {
            revert SwapNeverQueued();
        }

        Swap storage swap = swaps[swapId];

        if (swap.executed) {
            revert SwapAlreadyExecuted();
        }

        if (block.timestamp < swap.queuePeriodEndTimestamp) {
            revert SwapIsInQueuePeriod(swap.queuePeriodEndTimestamp);
        }

        uint256 expirationTimestamp = swap.queuePeriodEndTimestamp + EXECUTION_GRACE_PERIOD;
        if (block.timestamp > expirationTimestamp) {
            revert SwapExpired(expirationTimestamp);
        }

        if (swap.swapper != msg.sender) {
            revert InvalidExecutor(swap.swapper);
        }

        uint256 price = swapPrice(swap.inputTokenId, swap.outputTokenId);
        if (msg.value != price) {
            revert InsufficentFee(price, msg.value);
        }

        swap.executed = true;

        // Clean up mappings - not necessairy but give a gas refund
        delete inputTokenSwapInfos[swap.inputTokenId];
        delete outputTokenSwapInfos[swap.outputTokenId];

        NFT.transferFrom(swap.swapper, SWAP_POOL, swap.inputTokenId); // Swap pool might not be ERC721Receiver
        NFT.safeTransferFrom(SWAP_POOL, swap.swapper, swap.outputTokenId);

        sendFeesToRecipient(msg.value);

        emit SwapExecuted(swap.swapper, swapId, swap.inputTokenId, swap.outputTokenId, msg.value);
    }

    ////
    // Public functions
    ////

    function swapPrice(uint256 inputTokenId, uint256 outputTokenId) public view returns (uint256) {
        (, uint256 ageDiffClamped) = inputTokenId.trySub(outputTokenId); // Clamps to 0 on underflow
        return SWAP_PRICE_CURVE_BASE + SWAP_PRICE_CURVE_SLOPE * ageDiffClamped;
    }

    ////
    // Private functions
    ////

    function sendFeesToRecipient(uint256 value) private {
        (bool sent,) = FEE_RECEIPIENT.call{value: value}("");
        if (!sent) {
            revert FailedToSendFeesToFeeRecipient();
        }
    }
}
