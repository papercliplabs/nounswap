// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {TimelockNFTSwapper} from "../../src/TimelockNFTSwapper.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {MockERC721} from "../mock/MockERC721.sol";
import {TimelockNFTSwapperTestHelper} from "./TimelockNFTSwapperTestHelper.sol";

contract ConstructorTest is Test, TimelockNFTSwapperTestHelper {
    ////
    // Setup
    ////

    function setUp() public {
        _basicSetup();
    }

    ////
    // Successful Tests
    ////

    function test_constructor() public view {
        assertEq(address(nftSwapper.NFT()), address(nft));
        assertEq(nftSwapper.SWAP_POOL(), SWAP_POOL);
        assertEq(nftSwapper.feeRecipient(), FEE_RECEIPIENT);
        assertEq(nftSwapper.swapPriceCurveBase(), SWAP_PRICE_CURVE_BASE);
        assertEq(nftSwapper.swapPriceCurveSlope(), SWAP_PRICE_CURVE_SLOPE);
        assertEq(nftSwapper.QUEUE_FEE(), QUEUE_FEE);
        assertEq(nftSwapper.queuePeriod(), QUEUE_PERIOD);
        assertEq(nftSwapper.EXECUTION_GRACE_PERIOD(), EXECUTION_GRACE_PERIOD);
    }
}
