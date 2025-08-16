'use client';

import { useWatchContractEvent } from 'wagmi';
import { agentPlatformAddress } from '../contracts/addresses';
import AgentPlatformABI from '../contracts/AgentPlatform.json';

export const BlockchainListener = () => {
    // Listener for when a new agent is deployed
    useWatchContractEvent({
        address: agentPlatformAddress,
        abi: AgentPlatformABI.abi,
        eventName: 'AgentDeployed',
        onLogs(logs) {
            console.log('🎉 Event: AgentDeployed!', logs[0].args);
            const { deployer, agentId } = logs[0].args;
            
            // === CALL YOUR BACKEND API HERE ===
            // Tell your database that this 'deployer' now owns 'agentId'
            // fetch('/api/agent-deployed', { ... });
        },
    });

    // Listener for when a rental is paid
    useWatchContractEvent({
        address: agentPlatformAddress,
        abi: AgentPlatformABI.abi,
        eventName: 'RentalPaid',
        onLogs(logs) {
            console.log('💵 Event: RentalPaid!', logs[0].args);
            const { renter, agentId } = logs[0].args;

            // === CALL YOUR BACKEND API HERE ===
            // Record the successful rental payment in your database
            // fetch('/api/rental-paid', { ... });
        },
    });

    return null; // This component doesn't render anything
};