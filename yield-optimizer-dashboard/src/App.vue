<script setup>
  import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/vue'

  import { mainnet, arbitrum, sepolia } from 'viem/chains'
  import { reconnect } from '@wagmi/core'

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
  const config = defaultWagmiConfig({
    chains,
    projectId,
    metadata
  })

  reconnect(config)
  // 3. Create modal
  createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true // Optional - defaults to your Cloud configuration  
  })
</script>


<template>
  <w3m-button />
</template>


<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
