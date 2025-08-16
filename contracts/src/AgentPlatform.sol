// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/* ZeroLag Contract (Agent Platform)
 It handles all payments for agents
 */
contract AgentPlatform is Ownable {
    using SafeERC20 for IERC20;

    //  State Variables 
    IERC20 public token;
    
    // Stores the wallet address that will receive all platform fees
    address public adminWallet;
    
    // A counter to generate a new, unique ID for each third-party agent. Starts at 1.
    uint256 public nextAgentId = 1; 
    
    // Mapping to link agent ID to the owner's wallet address.
    mapping(uint256 => address) public agentOwners;
    
    //  Events 
    //  Developer successfully lists a new agent
    event AgentDeployed(address indexed deployer, uint256 indexed agentId);

    // Agent is rented successfully
    event RentalPaid(
        address indexed renter, 
        uint256 indexed agentId, 
        address indexed agentOwner, 
        uint256 totalAmount,
        uint256 platformFee,
        uint256 ownerPayment
    );
    
    //  Custom Errors 
    error InvalidAgentId();
    error ZeroAddress();
    error ZeroAmount();
    
    constructor(address _tokenAddress, address _adminWallet) Ownable(msg.sender) {

        // Checks that provided addresses are not empty or invalid
        if(_tokenAddress == address(0) || _adminWallet == address(0)) {
            revert ZeroAddress(); // Reverts the deployment if an address is invalid
        }
        // Sets the token contract address
        token = IERC20(_tokenAddress);
        // Sets the initial admin wallet address
        adminWallet = _adminWallet;
        // Manually assigns agent ID 0 to the admin wallet for platform-owned agents
        agentOwners[0] = _adminWallet;
    }

    function rentAgent(uint256 _agentId, uint256 _amount) external {
        // A payment of zero is not allowed
        if(_amount == 0) {
            revert ZeroAmount();
        }
        
        uint256 platformFee; // Amount our platform deducts as fee from deployed agents
        uint256 ownerPayment; // Amount to be sent to the owner of deployed agent
        address agentOwner; // Agent owner address
        
        // Handles the logic for platform-owned agents
        if (_agentId == 0) {
            platformFee = _amount; 
            ownerPayment = 0; 
            agentOwner = adminWallet; // The "owner" is the admin
            
            // Transfers the full rental amount from the user to the admin wallet
            token.safeTransferFrom(msg.sender, adminWallet, _amount);
            
        } else { // Handles the logic for third-party agents
            agentOwner = agentOwners[_agentId]; // Looks up the agent's owner from the mapping

            if(agentOwner == address(0)) {
                revert InvalidAgentId();
            }
            
            // Calculates the 15% platform fee
            platformFee = (_amount * 15) / 100;
            // Calculates the owner's 85% share
            ownerPayment = _amount - platformFee;
            
            // Transfers the 15% fee from the user to the admin wallet
            token.safeTransferFrom(msg.sender, adminWallet, platformFee);
            
            // Transfers the 85% share from the user to the agent's owner
            token.safeTransferFrom(msg.sender, agentOwner, ownerPayment);
        }
        
        // Emits an event with all the details of the transaction for frontend
        emit RentalPaid(msg.sender, _agentId, agentOwner, _amount, platformFee, ownerPayment);
    }
    
    function deployAgent(uint256 _deploymentFee) external returns (uint256 agentId) {
        // The deployment fee cannot be zero.
        if(_deploymentFee == 0) {
            revert ZeroAmount();
        }
        
        // Securely transfers the deployment fee from the developer to the admin wallet.
        token.safeTransferFrom(msg.sender, adminWallet, _deploymentFee);
        
        // Assigns the next available ID to this new agent.
        agentId = nextAgentId;
        
        // Stores the developer (msg.sender) as the owner of this new agent ID.
        agentOwners[agentId] = msg.sender;
        
        // Increments the counter so the next agent gets a new ID.
        nextAgentId++;
        
        // Emits an event to notify the frontend that a new agent has been deployed.
        emit AgentDeployed(msg.sender, agentId);
        
        // Returns the new agent ID to the caller (useful for the frontend).
        return agentId;
    }
    

    function setAdminWallet(address _newAdminWallet) external onlyOwner {
        // The new address cannot be the zero address
        if(_newAdminWallet == address(0)) {
            revert ZeroAddress();
        }
        // Updates the admin wallet to the new address
        adminWallet = _newAdminWallet;
        
        // Also updates the owner of platform agents (for agent ID: 0)
        agentOwners[0] = _newAdminWallet;
    }

    //  View Functions 
    // For owner address for specified agentId
    function getAgentOwner(uint256 _agentId) external view returns (address) {
        return agentOwners[_agentId];
    }
    
    // To confirm owner existence for specific agentId
    function agentExists(uint256 _agentId) external view returns (bool) {
        return agentOwners[_agentId] != address(0);
    }
    

    function getPaymentSplit(uint256 _agentId, uint256 _amount) external 
        pure 
        returns (uint256 platformFee, uint256 ownerPayment) {
        
        if (_agentId == 0) {
            return (_amount, 0);
        } else {
            platformFee = (_amount * 15) / 100;
            ownerPayment = _amount - platformFee;
            return (platformFee, ownerPayment);
        }
    }
}