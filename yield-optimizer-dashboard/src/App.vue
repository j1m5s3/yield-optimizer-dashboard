<script setup>
import UserDashboard from './components/UserDashboard.vue';
import RatesView from './components/items/views/rates/RatesView.vue';

import { createWeb3Modal } from '@web3modal/wagmi/vue';
import { reconnect } from '@wagmi/core'
import { config } from '@/utils/configs/chainConfig.js'
import { useWeb3ModalEvents } from '@web3modal/wagmi/vue';
import { useAccount } from '@wagmi/vue'

import { computed, reactive, ref, watch } from 'vue';

// Reconnect wallet on page refresh
reconnect(config);

// 1. Define constants
const projectId = import.meta.env.VITE_PROJECT_ID;

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true // Optional - defaults to your Cloud configuration  
});

const events = useWeb3ModalEvents();
console.log("EVENTS: ", events);

const acct = useAccount();
const showDashboard = ref(false);
console.log("acct: ", acct);
if (acct) {
  console.log("ACCT");
}

watch(events, (newEvent, oldEvent) => {
  console.log(`EVENTS --> OLD ${oldEvent.data['event']} --> NEW ${newEvent.data['event']}`);
  if (newEvent.data['event'] == "CONNECT_SUCCESS") {
    console.log("EVENTS CONNECTED");
    showDashboard.value = true;
  } else {
    console.log(config.state.status);
    console.log(config.storage);
    showDashboard.value = false;
  }
});

watch(acct.status, (newStatus, oldStatus) => {
  console.log("STATUS");
  console.log("OLD STATUS: ", oldStatus);
  console.log("NEW STATUS: ", newStatus);
  if (newStatus == "connected") {
    showDashboard.value = true;
  } else {
    showDashboard.value = false;
  }
}, { immediate: true });

</script>


<template>
  <div id="app">
    <header>
      <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center">
          <h1>Yield Optimizer Dashboard</h1>
          <w3m-button size="md" />
        </div>
      </div>
    </header>
    <main>
      <div class="container-fluid">
        <div class="row mt-4">
          <div class="col-12">
            <UserDashboard v-model="showDashboard" v-if="showDashboard" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>


<style>
@import './assets/main.css';

#app {
  min-height: 100vh;
  background-color: var(--background-color);
}

main {
  padding-top: 80px;
}

/* Remove the old styles that are now in main.css */
</style>
