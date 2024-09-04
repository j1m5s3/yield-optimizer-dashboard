<script setup>
  import UserDashboard from './components/UserDashboard.vue';
  import { createWeb3Modal } from '@web3modal/wagmi/vue';

  import { reconnect } from '@wagmi/core'

  import { config } from '@/utils/configs/chainConfig.js'

  // Reconnect wallet on page refresh
  reconnect(config)

  // 1. Define constants
  const projectId = import.meta.env.VITE_PROJECT_ID

  // 3. Create modal
  createWeb3Modal({
    wagmiConfig: config,
    projectId,
    enableAnalytics: true // Optional - defaults to your Cloud configuration  
  })

  
</script>


<template>
  <div id="app">
    <header>
      <div class="wrapper">
        <h1>Yield Optimizer Dashboard</h1>
        <w3m-button size="sm"/>
      </div>
    </header>
    <main>
      <UserDashboard />
    </main>
  </div>
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
