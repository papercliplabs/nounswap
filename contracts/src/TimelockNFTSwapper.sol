// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title TimelockNFTSwapper
/// @author Paperclip Labs
/// @author Michael Gingras
/// @notice A contract to enable permisionless timelocked swapping between NFTs within an ERC721 collection.
///         The desgined use case is for enabling Nounish DAOs to earn revenue by allowing members to swap their governance NFTs by one held in the treasury.
///         The timelock is required to prevent conflict with governance proposals which may interact with the same NFTs.
/// @dev The `swapPool` must approve this contract for it's NFTs
contract TimelockNFTSwapper is Ownable {
    using Math for uint256;

    ////
    // Types
    ////

    /// @notice A queued swap from inputTokenId to outputTokenId
    struct Swap {
        // Address of the swapper
        address swapper;
        // The id of the input NFT involved in the swap
        uint256 inputTokenId;
        // The id of the output NFT involved in the swap
        uint256 outputTokenId;
        // The timestamp when the queue timelock period ends and the swap can be executed
        uint256 queuePeriodEndTimestamp;
        // Whether the swap has been executed
        bool executed;
    }

    /// @notice The swap info used to prevent multiple swaps with the same input or output NFT
    struct SwapInfo {
        // The id of the swap
        uint256 swapId;
        // Whether the swap info exists
        bool exists;
    }

    ////
    // Constants
    ////

    /// @notice The ERC721 that is being swapped
    IERC721 public immutable NFT;

    /// @notice The address which holds the swappable ERC721s
    address public immutable SWAP_POOL;

    /// @notice The fee in Wei to queue a swap
    uint256 public immutable QUEUE_FEE;

    /// @notice The time in seconds after the queue period ends that a swap can be executed before it expires
    uint256 public immutable EXECUTION_GRACE_PERIOD;

    ////
    // Storage
    ////

    /// @notice The address which receives the fees for queing and executing swaps
    address payable public feeRecipient;

    /// @notice The base price of the swap price curve
    uint256 public swapPriceCurveBase;

    /// @notice The slope of the swap price curve
    uint256 public swapPriceCurveSlope;

    /// @notice The queue period in seconds
    uint256 public queuePeriod;

    /// @notice The list of swaps that have been queued
    Swap[] public swaps;

    /// @notice The mapping of input NFTs to their swap info used to prevent multiple swaps with the same input NFT
    mapping(uint256 inputTokenId => SwapInfo swapInfo) _inputTokenSwapInfos;

    /// @notice The mapping of output NFTs to their swap info used to prevent multiple swaps with the same output NFT
    mapping(uint256 outputTokenId => SwapInfo swapInfo) _outputTokenSwapInfos;

    ////
    // Events
    ////

    /// @notice Emitted when a swap is queued
    /// @param swapper The address of the swapper
    /// @param swapId The id of the swap
    /// @param inputTokenId The id of the input NFT involved in the swap
    /// @param outputTokenId The id of the output NFT involved in the swap
    /// @param queuePeriodEndTimestamp The timestamp when the queue timelock period ends and the swap can be executed
    event SwapQueued(
        address indexed swapper,
        uint256 indexed swapId,
        uint256 inputTokenId,
        uint256 outputTokenId,
        uint256 queuePeriodEndTimestamp
    );

    /// @notice Emitted when a swap is executed
    /// @param swapper The address of the swapper
    /// @param swapId The id of the swap
    /// @param inputTokenId The id of the input NFT involved in the swap
    /// @param outputTokenId The id of the output NFT involved in the swap
    /// @param swapFee The fee in Wei paid by the swapper to execute the swap
    event SwapExecuted(
        address indexed swapper, uint256 indexed swapId, uint256 inputTokenId, uint256 outputTokenId, uint256 swapFee
    );

    /// @notice Emitted when the fee recipient is set
    /// @param feeRecipient The address of the fee recipient
    event SetFeeRecipient(address feeRecipient);

    /// @notice Emitted when the swap price curve parameters are set
    /// @param swapPriceCurveBase The base price of the swap price curve
    /// @param swapPriceCurveSlope The slope of the swap price curve
    event SetSwapPriceCurveParameters(uint256 swapPriceCurveBase, uint256 swapPriceCurveSlope);

    /// @notice Emitted when the queue period is set
    /// @param queuePeriod The queue period in seconds
    event SetQueuePeriod(uint256 queuePeriod);

    ////
    // Errors
    ////

    /// @notice Thrown when the required owner of an NFT to queue a swap is not the actual owner
    /// @param tokenId The id of the NFT
    /// @param requiredOwner The required owner of the NFT to queue the swap
    /// @param actualOwner The actual owner of the NFT
    error WrongNFTOwner(uint256 tokenId, address requiredOwner, address actualOwner);

    /// @notice Thrown when this contract is missing approval to spend the NFT to queue a swap
    /// @param tokenId The id of the NFT which is missing approval
    error MissingNFTApproval(uint256 tokenId);

    /// @notice Thrown when the fee provided to is insufficent
    /// @param required The required fee
    /// @param provided The provided fee
    error InsufficentFee(uint256 required, uint256 provided);

    /// @notice Thrown when an NFT is already involved in a pending swap
    /// @param tokenId The id of the NFT involved in a pending swap
    /// @param swapId The id of the pending swap
    error NFTInvolvedInPendingSwap(uint256 tokenId, uint256 swapId);

    /// @notice Thrown when trying to execute a swap that has not been queued (wrong swapId)
    error SwapNeverQueued();

    /// @notice Thrown when trying to execute a swap that is still in the queue period
    /// @param queuePeriodEndTimestamp The timestamp when the queue period ends and the swap can be executed
    error SwapIsInQueuePeriod(uint256 queuePeriodEndTimestamp);

    /// @notice Thrown when trying to execute a swap by someone other than the swapper of the queued swap
    /// @param requiredExecutor The required executor of the swap, which is the swapper when the swap was queued
    error InvalidExecutor(address requiredExecutor);

    /// @notice Thrown when trying to execute a swap that has already been executed
    error SwapAlreadyExecuted();

    /// @notice Thrown when trying to execute a swap that has expired
    /// @param expirationTimestamp The timestamp when the swap expired
    error SwapExpired(uint256 expirationTimestamp);

    /// @notice Thrown when the fees could not be sent to the fee recipient
    error FailedToSendFeesToFeeRecipient();

    ////
    // Modifiers
    ////

    /// @notice Validate that the required owner is the actual owner of the NFT and that this contract is approved to spend the NFT
    /// @param requiredOwner The required owner of the NFT
    /// @param tokenId The id of the NFT
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

    /// @notice Validate that the NFT is not an input in a pending swap
    /// @param tokenId The id of the NFT
    modifier validateNFTIsNotInputInPendingSwap(uint256 tokenId) {
        {
            SwapInfo storage inputTokenSwapInfo = _inputTokenSwapInfos[tokenId];
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

    /// @notice Validate that the NFT is not an output in a pending swap
    /// @param tokenId The id of the NFT
    modifier validateNFTIsNotOutputInPendingSwap(uint256 tokenId) {
        {
            SwapInfo storage outputTokenSwapInfo = _outputTokenSwapInfos[tokenId];
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

    /// @notice TimelockNFTSwapper constructor
    /// @param nft The ERC721 that is being swapped
    /// @param swapPool The address which holds the swappable ERC721s
    /// @param feeRecipient_ The address which receives the fees for queing and executing swaps
    /// @param swapPriceCurveBase_ The base price of the swap price curve
    /// @param swapPriceCurveSlope_ The slope of the swap price curve
    /// @param queueFee The fee in Wei to queue a swap
    /// @param queuePeriod_ time in seconds a swap must be queued before it can be executed
    /// @param executionGracePeriod The time in seconds after the queue period ends that a swap can be executed before it expires
    constructor(
        IERC721 nft,
        address swapPool,
        address payable feeRecipient_,
        uint256 swapPriceCurveBase_,
        uint256 swapPriceCurveSlope_,
        uint256 queueFee,
        uint256 queuePeriod_,
        uint256 executionGracePeriod
    ) Ownable(msg.sender) {
        NFT = nft;
        SWAP_POOL = swapPool;
        QUEUE_FEE = queueFee;
        EXECUTION_GRACE_PERIOD = executionGracePeriod;

        _setFeeRecipient(feeRecipient_);
        _setSwapPriceCurveParameters(swapPriceCurveBase_, swapPriceCurveSlope_);
        _setQueuePeriod(queuePeriod_);
    }

    ////
    // Swap functions
    ////

    /// @notice Queue a swap from inputTokenId to outputTokenId
    /// @dev Emits a `SwapQueued` event
    /// @param inputTokenId The id of the input NFT involved in the swap
    /// @param outputTokenId The id of the output NFT involved in the swap
    /// @return swapId The id of the swap, this is to be used later to call executeSwap
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
            queuePeriodEndTimestamp: block.timestamp + queuePeriod,
            executed: false
        });

        swaps.push(swap);

        _inputTokenSwapInfos[inputTokenId] = SwapInfo({swapId: swapId, exists: true});
        _outputTokenSwapInfos[outputTokenId] = SwapInfo({swapId: swapId, exists: true});

        _sendFeesToRecipient(msg.value);

        emit SwapQueued(swap.swapper, swapId, swap.inputTokenId, swap.outputTokenId, swap.queuePeriodEndTimestamp);

        return swapId;
    }

    /// @notice Execute a swap that has been queued
    /// @dev emits a `SwapExecuted` event
    /// @param swapId The id of the swap to execute
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
        delete _inputTokenSwapInfos[swap.inputTokenId];
        delete _outputTokenSwapInfos[swap.outputTokenId];

        NFT.transferFrom(swap.swapper, SWAP_POOL, swap.inputTokenId); // Swap pool might not be ERC721Receiver
        NFT.safeTransferFrom(SWAP_POOL, swap.swapper, swap.outputTokenId);

        _sendFeesToRecipient(msg.value);

        emit SwapExecuted(swap.swapper, swapId, swap.inputTokenId, swap.outputTokenId, msg.value);
    }

    /// @notice Get the price to swap inputTokenId to outputTokenId
    /// @param inputTokenId The id of the input NFT involved in the swap
    /// @param outputTokenId The id of the output NFT involved in the swap
    function swapPrice(uint256 inputTokenId, uint256 outputTokenId) public view returns (uint256) {
        (, uint256 ageDiffClamped) = inputTokenId.trySub(outputTokenId); // Clamps to 0 on underflow
        return swapPriceCurveBase + swapPriceCurveSlope * ageDiffClamped;
    }

    ////
    // Setter functions
    ////

    /// @notice Set the fee recipient
    /// @param feeRecipient_ The address of the fee recipient
    function setFeeRecipient(address payable feeRecipient_) external onlyOwner {
        _setFeeRecipient(feeRecipient_);
    }

    /// @notice Set the swap price curve parameters
    /// @param swapPriceCurveBase_ The base price of the swap price curve
    /// @param swapPriceCurveSlope_ The slope of the swap price curve
    function setSwapPriceCurveParameters(uint256 swapPriceCurveBase_, uint256 swapPriceCurveSlope_)
        external
        onlyOwner
    {
        _setSwapPriceCurveParameters(swapPriceCurveBase_, swapPriceCurveSlope_);
    }

    /// @notice Set the queue period
    /// @param queuePeriod_ The queue period in seconds
    function setQueuePeriod(uint256 queuePeriod_) external onlyOwner {
        _setQueuePeriod(queuePeriod_);
    }

    ////
    // Internal functions
    ////

    /// @notice Send the fees to the fee recipient
    /// @param value The value in Wei to send to the fee recipient
    function _sendFeesToRecipient(uint256 value) internal {
        (bool sent,) = feeRecipient.call{value: value}("");
        if (!sent) {
            revert FailedToSendFeesToFeeRecipient();
        }
    }

    /// @notice Set the fee recipient
    /// @dev Emits a `SetFeeRecipient` event
    /// @param feeRecipient_ The address of the fee recipient
    function _setFeeRecipient(address payable feeRecipient_) internal {
        feeRecipient = feeRecipient_;
        emit SetFeeRecipient(feeRecipient_);
    }

    /// @notice Set the swap price curve parameters
    /// @dev Emits a `SetSwapPriceCurveParameters` event
    /// @param swapPriceCurveBase_ The base price of the swap price curve
    /// @param swapPriceCurveSlope_ The slope of the swap price curve
    function _setSwapPriceCurveParameters(uint256 swapPriceCurveBase_, uint256 swapPriceCurveSlope_) internal {
        swapPriceCurveBase = swapPriceCurveBase_;
        swapPriceCurveSlope = swapPriceCurveSlope_;
        emit SetSwapPriceCurveParameters(swapPriceCurveBase_, swapPriceCurveSlope_);
    }

    /// @notice Set the queue period
    /// @dev Emits a `SetQueuePeriod` event
    /// @param queuePeriod_ The queue period in seconds
    function _setQueuePeriod(uint256 queuePeriod_) internal {
        queuePeriod = queuePeriod_;
        emit SetQueuePeriod(queuePeriod_);
    }
}
