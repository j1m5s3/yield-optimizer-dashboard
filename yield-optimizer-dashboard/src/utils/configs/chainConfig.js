//import { http, createConfig } from '@wagmi/vue'
import { defaultWagmiConfig } from '@web3modal/wagmi/vue'
import { mainnet, sepolia, arbitrum } from '@wagmi/vue/chains'

/*
export const config = createConfig({
  chains: [mainnet, sepolia, arbitrum],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [arbitrum.id]: http(),
  },
})
  */

// 1. Define constants
const projectId = import.meta.env.VITE_PROJECT_ID

// 2. Create wagmiConfig
const metadata = {
    name: 'Yield Optimizer Dashboard',
    description: 'Dashboard for Defi Yield Optimizer',
    url: 'http://localhost:5173/', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [mainnet, arbitrum, sepolia]
export const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata
});