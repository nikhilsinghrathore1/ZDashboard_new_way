// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";

// NEW: Import the Polygon Amoy testnet from wagmi/chains
import { polygon, polygonAmoy } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// 1. Create a wagmi config
const config = createConfig({
  // NEW: Add polygonAmoy to the list of supported chains
  chains: [polygon, polygonAmoy], 
  connectors: [
    injected(),
  ],
  transports: {
    // NEW: Add a transport for both mainnet and the amoy testnet
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
});

// 2. Create a QueryClient
const queryClient = new QueryClient();

// 3. Create the provider component
export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}