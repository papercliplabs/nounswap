// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {TimelockNFTSwapper} from "../../src/TimelockNFTSwapper.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {MockERC721} from "../mock/MockERC721.sol";
import {TimelockNFTSwapperTestHelper} from "./TimelockNFTSwapperTestHelper.sol";

contract ExecuteSwapTest is Test, TimelockNFTSwapperTestHelper {
    ////
    // Setup
    ////

    function setUp() public {
        _basicSetup();
    }

    ////
    // Helpers
    ////

    function _queueAndWaitThroughQueuePeriod(uint256 inputTokenId, uint256 outputTokenId) private returns (uint256) {
        nft.approve(address(nftSwapper), inputTokenId);
        uint256 swapId = nftSwapper.queueSwap{value: QUEUE_FEE}(inputTokenId, outputTokenId);
        skip(QUEUE_PERIOD + 1);

        return swapId;
    }

    function _executeSwapAndCheckEventAndBalances(uint256 swapId, uint256 inputTokenId, uint256 outputTokenId)
        internal
    {
        uint256 feeRecipientBalanceBefore = FEE_RECEIPIENT.balance;

        uint256 swapPrice = nftSwapper.swapPrice(inputTokenId, outputTokenId);

        (, address msgSender,) = vm.readCallers(); // Current prank caller
        _expectEventSwapExecuted(msgSender, swapId, inputTokenId, outputTokenId, swapPrice);

        nftSwapper.executeSwap{value: swapPrice}(swapId);

        assertEq(nft.ownerOf(inputTokenId), SWAP_POOL);
        assertEq(nft.ownerOf(outputTokenId), msgSender);
        assertEq(address(FEE_RECEIPIENT).balance, feeRecipientBalanceBefore + swapPrice);
    }

    ////
    // Successful Tests
    ////

    function test_executeBasic() public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];

        vm.startPrank(USER_A);
        uint256 swapId = _queueAndWaitThroughQueuePeriod(inputTokenId, outputTokenId);

        _executeSwapAndCheckEventAndBalances(swapId, inputTokenId, outputTokenId);
    }

    function test_sequentialSwaps() public {
        uint256 userAInputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];

        vm.startPrank(USER_A);
        uint256 swapId1 = _queueAndWaitThroughQueuePeriod(userAInputTokenId, outputTokenId);
        _executeSwapAndCheckEventAndBalances(swapId1, userAInputTokenId, outputTokenId);

        // Do the reverse swap
        uint256 swapId2 = _queueAndWaitThroughQueuePeriod(outputTokenId, userAInputTokenId);
        _executeSwapAndCheckEventAndBalances(swapId2, outputTokenId, userAInputTokenId);
        vm.stopPrank();

        // Another user does a swap
        vm.startPrank(USER_B);
        uint256 swapId3 = _queueAndWaitThroughQueuePeriod(USER_B_INITIAL_TOKEN_ID, outputTokenId);
        _executeSwapAndCheckEventAndBalances(swapId3, USER_B_INITIAL_TOKEN_ID, outputTokenId);
    }

    function test_parallelSwaps() public {
        uint256 userAInputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 userAOutputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];
        uint256 userBInputTokenId = USER_B_INITIAL_TOKEN_ID;
        uint256 userBOutputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[1];

        // Kickoff 2 queues together
        vm.startPrank(USER_A);
        nft.approve(address(nftSwapper), userAInputTokenId);
        uint256 userASwapId = nftSwapper.queueSwap{value: QUEUE_FEE}(userAInputTokenId, userAOutputTokenId);
        vm.stopPrank();

        vm.startPrank(USER_B);
        nft.approve(address(nftSwapper), userBInputTokenId);
        uint256 userBSwapId = nftSwapper.queueSwap{value: QUEUE_FEE}(userBInputTokenId, userBOutputTokenId);
        vm.stopPrank();

        // Wait through queue period
        skip(QUEUE_PERIOD + 1);

        // Execute USER_B
        vm.startPrank(USER_B);
        _executeSwapAndCheckEventAndBalances(userBSwapId, userBInputTokenId, userBOutputTokenId);
        vm.stopPrank();

        // Execute USER_A
        vm.startPrank(USER_A);
        _executeSwapAndCheckEventAndBalances(userASwapId, userAInputTokenId, userAOutputTokenId);
        vm.stopPrank();
    }

    ////
    // Reverting Tests
    ////

    function test_reverts_whenSwapNeverQueued() public {
        vm.startPrank(USER_A);
        _expectRevertSwapNeverQueued();
        nftSwapper.executeSwap(100);
    }

    function testFail_reverts_whenInputTokenRemovesApproval() public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];

        vm.startPrank(USER_A);
        uint256 swapId = _queueAndWaitThroughQueuePeriod(inputTokenId, outputTokenId);

        nft.approve(address(0), inputTokenId); // Revoke input token approval before execute
        uint256 swapPrice = nftSwapper.swapPrice(inputTokenId, outputTokenId);
        // This revert is from ERC721 contract
        nftSwapper.executeSwap{value: swapPrice}(swapId);
    }

    function testFail_reverts_whenInputTokenTransferedOwnershipAfterQueue() public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];
        uint256 swapPrice = nftSwapper.swapPrice(inputTokenId, outputTokenId);

        vm.startPrank(USER_A);
        uint256 swapId = _queueAndWaitThroughQueuePeriod(inputTokenId, outputTokenId);
        nft.transferFrom(USER_A, USER_B, inputTokenId);
        vm.stopPrank();

        // Even if USER_B were to approve it
        vm.prank(USER_B);
        nft.approve(address(nftSwapper), inputTokenId);

        // USER_A is the queuer, USER_B would fail for InvalidExecutor (other tests)
        vm.prank(USER_A);
        // This revert is from ERC721 contract
        nftSwapper.executeSwap{value: swapPrice}(swapId);
    }

    function testFail_reverts_whenOutputTokenRemovesApporoval() public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];
        uint256 swapPrice = nftSwapper.swapPrice(inputTokenId, outputTokenId);

        vm.prank(USER_A);
        uint256 swapId = _queueAndWaitThroughQueuePeriod(inputTokenId, outputTokenId);

        vm.prank(SWAP_POOL);
        nft.setApprovalForAll(address(nftSwapper), false); // Revoke output token approval before execute

        vm.prank(USER_A);
        nftSwapper.executeSwap{value: swapPrice}(swapId);
    }

    function testFail_reverts_whenOutputTokenTransferedOwnershipAfterQueue() public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];
        uint256 swapPrice = nftSwapper.swapPrice(inputTokenId, outputTokenId);

        vm.startPrank(USER_A);
        uint256 swapId = _queueAndWaitThroughQueuePeriod(inputTokenId, outputTokenId);
        vm.stopPrank();

        vm.prank(SWAP_POOL);
        nft.transferFrom(SWAP_POOL, USER_B, outputTokenId);

        // Even if USER_B were to approve it
        vm.prank(USER_B);
        nft.approve(address(nftSwapper), outputTokenId);

        vm.prank(USER_A);
        // This revert is from ERC721 contract
        nftSwapper.executeSwap{value: swapPrice}(swapId);
    }

    function test_reverts_whenExecutorIsNotQueuer() public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];

        vm.startPrank(USER_A);
        uint256 swapId = _queueAndWaitThroughQueuePeriod(inputTokenId, outputTokenId);
        vm.stopPrank();

        uint256 swapPrice = nftSwapper.swapPrice(inputTokenId, outputTokenId);

        vm.startPrank(USER_B);
        _expectRevertInvalidExecutor(USER_A);
        nftSwapper.executeSwap{value: swapPrice}(swapId);
    }

    function test_reverts_whenQueuePeriodNotFinished() public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];
        uint256 expectQueuePeriodEnd = block.timestamp + QUEUE_PERIOD;

        vm.startPrank(USER_A);
        nft.approve(address(nftSwapper), inputTokenId);
        uint256 swapId = nftSwapper.queueSwap{value: QUEUE_FEE}(inputTokenId, outputTokenId);

        uint256 swapPrice = nftSwapper.swapPrice(inputTokenId, outputTokenId);

        // Immediate
        _expectRevertSwapIsInQueuePeriod(expectQueuePeriodEnd);
        nftSwapper.executeSwap{value: swapPrice}(swapId);

        // 1 second before queue period ends
        skip(QUEUE_PERIOD - 1);
        _expectRevertSwapIsInQueuePeriod(expectQueuePeriodEnd);
        nftSwapper.executeSwap{value: swapPrice}(swapId);
    }

    function test_reverts_whenExpired() public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];
        uint256 expectedExpirationTimestamp = block.timestamp + QUEUE_PERIOD + EXECUTION_GRACE_PERIOD;
        uint256 swapPrice = nftSwapper.swapPrice(inputTokenId, outputTokenId);

        vm.startPrank(USER_A);
        uint256 swapId = _queueAndWaitThroughQueuePeriod(inputTokenId, outputTokenId);

        skip(EXECUTION_GRACE_PERIOD);
        _expectRevertSwapExpired(expectedExpirationTimestamp);
        nftSwapper.executeSwap{value: swapPrice}(swapId);
    }

    function test_reverts_whenAlreadyExecuted() public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];

        vm.startPrank(USER_A);
        uint256 swapId = _queueAndWaitThroughQueuePeriod(inputTokenId, outputTokenId);

        _executeSwapAndCheckEventAndBalances(swapId, inputTokenId, outputTokenId);

        uint256 swapPrice = nftSwapper.swapPrice(inputTokenId, outputTokenId);
        _expectRevertSwapAlreadyExecuted();
        nftSwapper.executeSwap{value: swapPrice}(swapId);
    }

    function testFuzz_reverts_whenWrongSwapPrice(uint256 amount) public {
        uint256 inputTokenId = USER_A_INITIAL_TOKEN_ID;
        uint256 outputTokenId = SWAP_POOL_INITIAL_TOKEN_IDS[0];
        uint256 swapPrice = nftSwapper.swapPrice(inputTokenId, outputTokenId);
        vm.assume(amount != swapPrice);
        vm.assume(amount < type(uint256).max - 2 << 100); // TODO: Weird issue only when fork testing without - EvmError: OverflowPayment

        vm.startPrank(USER_A);
        uint256 swapId = _queueAndWaitThroughQueuePeriod(inputTokenId, outputTokenId);

        deal(USER_A, type(uint256).max);

        _expectRevertInsuffucuentFee(swapPrice, amount);
        nftSwapper.executeSwap{value: amount}(swapId);
    }
}
