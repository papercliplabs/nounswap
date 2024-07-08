// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {NFTSwapper} from "../src/NFTSwapper.sol";

contract NFTSwapperScript is Script {
    NFTSwapper public nftSwapper;

    function setUp() public {}

    function run() public {
        // vm.startBroadcast();

        // counter = new Counter();

        // vm.stopBroadcast();
    }
}
