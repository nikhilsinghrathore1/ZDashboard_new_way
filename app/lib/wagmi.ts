// File: app/lib/wagmi.ts

import { http, createConfig } from 'wagmi'
import { polygon, mainnet, sepolia, polygonAmoy } from 'wagmi/chains'
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

// 1. Get a WalletConnect Project ID
// Go to https://cloud.walletconnect.com/ and create a project to get a project ID.
const projectId = '81bd965ef6722331a6c12ed6611a18a4' // <-- PASTE YOURS HERE
const alchemyAmoyRpcUrl = 'https://polygon-amoy.g.alchemy.com/v2/MK9bHqOG9dtRpYA4qM4Gk';


// 2. Create wagmi config
export const config = createConfig({
  chains: [mainnet, polygon, sepolia, polygonAmoy], // The chains you want to support
  connectors: [
    walletConnect({ projectId }),
    injected(), // Handles browser-injected wallets like MetaMask
    metaMask(),
    safe(),
  ],
  transports: {
    // A transport is how your app communicates with the blockchain.
    // We use the http transport here.
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [sepolia.id]: http(),
    [polygonAmoy.id]: http(alchemyAmoyRpcUrl),

  },
})