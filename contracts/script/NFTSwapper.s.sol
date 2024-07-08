// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {TimelockNFTSwapper} from "../src/TimelockNFTSwapper.sol";

contract TimelockNFTSwapperScript is Script {
    TimelockNFTSwapper public nftSwapper;

    function setUp() public {}

    function run() public {
        // vm.startBroadcast();

        // counter = new Counter();

        // vm.stopBroadcast();
    }
}
