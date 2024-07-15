// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {TimelockNFTSwapper} from "../../src/TimelockNFTSwapper.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {MockERC721} from "../mock/MockERC721.sol";
import {TimelockNFTSwapperTestHelper} from "./TimelockNFTSwapperTestHelper.sol";

contract SettersTest is Test, TimelockNFTSwapperTestHelper {
    ////
    // Setup
    ////

    function setUp() public {
        _basicSetup();
    }

    ////
    // Successful Tests
    ////

    function test_setFeeRecipient(address payable newRecipient) public {
        vm.prank(DEPLOYER);
        nftSwapper.setFeeRecipient(newRecipient);
        assertEq(nftSwapper.feeRecipient(), newRecipient);
    }

    function test_setSwapPriceCurveParameters(uint256 newBase, uint256 newSlope) public {
        vm.prank(DEPLOYER);
        nftSwapper.setSwapPriceCurveParameters(newBase, newSlope);
        assertEq(nftSwapper.swapPriceCurveBase(), newBase);
        assertEq(nftSwapper.swapPriceCurveSlope(), newSlope);
    }

    function test_setQueuePeriod(uint256 newQueuePeriod) public {
        vm.prank(DEPLOYER);
        nftSwapper.setQueuePeriod(newQueuePeriod);
        assertEq(nftSwapper.queuePeriod(), newQueuePeriod);
    }

    function test_renounceOwnershiop() public {
        vm.prank(DEPLOYER);
        nftSwapper.renounceOwnership();
        assertEq(nftSwapper.owner(), address(0));
    }

    ////
    // Reverting Tests
    ////

    function testFail_setFeeRecipient_reverts_whenNotOwner() public {
        vm.prank(USER_B);
        nftSwapper.setFeeRecipient(payable(USER_B));
    }

    function testFail_setSwapPriceCurveParameters_reverts_whenNotOwner() public {
        vm.prank(USER_B);
        nftSwapper.setSwapPriceCurveParameters(1, 1);
    }

    function testFail_setQueuePeriod_reverts_whenNotOwner() public {
        vm.prank(USER_B);
        nftSwapper.setQueuePeriod(1);
    }
}
