<script setup>
import UserDashboard from './components/UserDashboard.vue';
import RatesView from './components/items/views/rates/RatesView.vue';

import { createWeb3Modal } from '@web3modal/wagmi/vue';
import { reconnect } from '@wagmi/core'
import { config } from '@/utils/configs/chainConfig.js'
import { useWeb3ModalEvents } from '@web3modal/wagmi/vue';
import { useAccount } from '@wagmi/vue'
import { useLocalStorage } from '@vueuse/core';

import { ref, watch } from 'vue';

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

const acct = useAccount();
const showDashboard = ref(false);
const currentView = ref('rates');
const isLoading = ref(false);

// Debug connection status
console.log('Initial account status:', acct.status);
console.log('Initial account address:', acct.address);

watch(events, (newEvent, oldEvent) => {
  console.log('Web3Modal event:', newEvent.data['event']);
  if (newEvent.data['event'] == "CONNECT_SUCCESS") {
    showDashboard.value = true;
  } else if (newEvent.data['event'] == "DISCONNECT_SUCCESS") {
    showDashboard.value = false;
  }
});

watch(acct.status, (newStatus, oldStatus) => {
  console.log('Account status changed:', { oldStatus, newStatus });
  console.log('Current account address:', acct.address);
  if (newStatus == "connected") {
    showDashboard.value = true;
  } else {
    showDashboard.value = false;
  }
}, { immediate: true });

const handleViewChange = async (view) => {
  isLoading.value = true;
  currentView.value = view;
  // Add a small delay to ensure smooth transition
  await new Promise(resolve => setTimeout(resolve, 300));
  isLoading.value = false;
};

</script>


<template>
  <div id="app">
    <header>
      <div class="container-fluid">
        <div class="d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center">
            <img src="./assets/robot_trading_logo_cropped.png" alt="Logo" class="header-logo me-3" />
            <h1>Yield Optimizer Dashboard</h1>
          </div>
          <div class="d-flex align-items-center gap-3">
            <div class="nav-tabs">
              <button 
                class="nav-tab" 
                :class="{ active: currentView === 'rates' }"
                @click="handleViewChange('rates')"
              >
                <span class="tab-icon">📊</span>
                <span class="tab-label">Rates</span>
              </button>
              <button 
                class="nav-tab" 
                :class="{ active: currentView === 'sma' }"
                @click="handleViewChange('sma')"
              >
                <span class="tab-icon">🤖</span>
                <span class="tab-label">SMA</span>
              </button>
            </div>
            <w3m-button size="md" />
          </div>
        </div>
      </div>
    </header>
    <main>
      <div class="container-fluid">
        <div class="row mt-4">
          <div class="col-12">
            <div class="content-area">
              <div v-if="isLoading" class="view-loading">
                <div class="spinner"></div>
              </div>
              <div v-else>
                <RatesView v-if="currentView === 'rates'" />
                <template v-if="currentView === 'sma'">
                  <UserDashboard v-if="showDashboard" />
                  <div v-else class="connect-message">
                    <div class="message-content">
                      <span class="message-icon">🔒</span>
                      <h2>Connect Your Wallet</h2>
                      <p>Please connect your wallet to access the SMA dashboard</p>
                    </div>
                  </div>
                </template>
              </div>
            </div>
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

.header-logo {
  height: 40px;
  width: 40px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--border-color);
  padding: 2px;
  background-color: var(--background-color);
}

header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
}

.nav-tabs {
  display: flex;
  gap: 0.5rem;
}

.nav-tab {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: transparent;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.nav-tab:hover {
  background-color: var(--hover-color);
}

.nav-tab.active {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.view-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.connect-message {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background-color: var(--background-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.message-content {
  text-align: center;
  padding: 2rem;
}

.message-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.message-content h2 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.message-content p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .header-logo {
    height: 32px;
    width: 32px;
  }
  
  header h1 {
    font-size: 1.25rem;
  }

  .message-content {
    padding: 1rem;
  }

  .message-icon {
    font-size: 2rem;
  }

  .message-content h2 {
    font-size: 1.25rem;
  }
}

</style>
