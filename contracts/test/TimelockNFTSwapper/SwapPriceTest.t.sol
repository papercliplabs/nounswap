// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {TimelockNFTSwapper} from "../../src/TimelockNFTSwapper.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {MockERC721} from "../mock/MockERC721.sol";
import {TimelockNFTSwapperTestHelper} from "./TimelockNFTSwapperTestHelper.sol";
import {Math} from "@openzeppelin/contracts/utils/math/Math.sol";

contract SwapPriceTest is Test, TimelockNFTSwapperTestHelper {
    using Math for uint256;

    ////
    // Setup
    ////

    function setUp() public {
        _setupDeal();
        _setupNft();

        // must call _deploySwapperWithSlopeParams to setup the nftSwapper
    }

    ////
    // Helpers
    ////

    function _deploySwapperWithSlopeParams(uint256 swapPriceCurveBase, uint256 swapPriceCurveSlope) internal {
        nftSwapper = new TimelockNFTSwapper({
            nft: nft,
            swapPool: SWAP_POOL,
            feeRecipient_: FEE_RECEIPIENT,
            swapPriceCurveBase_: swapPriceCurveBase,
            swapPriceCurveSlope_: swapPriceCurveSlope,
            queueFee: QUEUE_FEE,
            queuePeriod_: QUEUE_PERIOD,
            executionGracePeriod: EXECUTION_GRACE_PERIOD
        });
    }

    ////
    // Successful Tests
    ////

    function testFuzz_swapPrice(
        uint256 swapPriceCurveBase,
        uint256 swapPriceCurveSlope,
        uint256 inputTokenId,
        uint256 outputTokenId
    ) public {
        _deploySwapperWithSlopeParams(swapPriceCurveBase, swapPriceCurveSlope);

        uint256 clampedDiff = inputTokenId > outputTokenId ? inputTokenId - outputTokenId : 0;

        (bool slopeComponentSuccess, uint256 slopeComponent) = swapPriceCurveSlope.tryMul(clampedDiff);
        (bool swapPriceSuccess, uint256 expectedPrice) = swapPriceCurveBase.tryAdd(slopeComponent);

        if (!slopeComponentSuccess || !swapPriceSuccess) {
            // Overflow
            vm.expectRevert();
            nftSwapper.swapPrice(inputTokenId, outputTokenId);
        } else {
            uint256 actualPrice = nftSwapper.swapPrice(inputTokenId, outputTokenId);
            assertEq(actualPrice, expectedPrice);
        }
    }
}
