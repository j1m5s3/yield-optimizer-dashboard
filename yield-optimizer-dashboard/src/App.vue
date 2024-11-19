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
      <div class="wrapper">
        <h1>Yield Optimizer Dashboard</h1>
      </div>
    </header>
    <main>
      <div class="container-fluid">
        <div id="w3-button" class="row justify-content-end">
          <div clss="col-2"></div>
          <div class="col-2">
            <w3m-button size="sm" />
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="card" title="Rates">
              <RatesView />
            </div>
          </div>
        </div>
        <div class="row">
          <UserDashboard v-model="showDashboard" v-if="showDashboard" />
        </div>
      </div>
    </main>
  </div>
</template>


<style scoped>
header {
  line-height: 1.5;
  z-index: 9;
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
    position: fixed;
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

main {
  padding-top: 4rem;
}

w3m-button {
  padding: 1rem;
}
</style>
