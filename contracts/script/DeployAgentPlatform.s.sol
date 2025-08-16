// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/AgentPlatform.sol"; // Import your contract

contract DeployAgentPlatform is Script {
    function run() external returns (AgentPlatform) {
        // These are the addresses your constructor needs.
        // You MUST replace these with real addresses.
        address tokenAddress = 0xea4808283eFC9140BBea9E5465AEAF102DDA1b85; // Your deployed ERC20 token address
        address adminWallet = 0xaaAbDdC62FBD21D44Bc36021b23612BBA025349C; // The wallet you want fees sent to

        // This is a helper that gets your private key from the .env file
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Start telling Foundry to broadcast transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the contract
        AgentPlatform agentPlatform = new AgentPlatform(tokenAddress, adminWallet);

        // Stop broadcasting
        vm.stopBroadcast();

        // Return the deployed contract instance
        return agentPlatform;
    }
}