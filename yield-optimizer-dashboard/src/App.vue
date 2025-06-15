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
        <div class="header-content">
          <div class="header-left">
            <img src="./assets/robot_trading_logo_cropped.png" alt="Logo" class="header-logo me-3" />
            <h1>Yield Optimizer Dashboard</h1>
          </div>
          <div class="header-right">
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
              <a 
                href="https://pam-2.gitbook.io/pam-docs" 
                target="_blank"
                class="nav-tab"
              >
                <span class="tab-icon">📚</span>
                <span class="tab-label">Docs</span>
              </a>
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
    <footer class="footer">
      <div class="container-fluid">
        <div class="social-links">
          <a 
            href="https://www.linkedin.com/in/james-lynch-14645911a" 
            target="_blank" 
            class="social-link linkedin"
            title="Connect on LinkedIn"
          >
            <img 
              src="./assets/linkedin.svg" 
              alt="LinkedIn"
              class="social-icon"
            />
          </a>
          <a 
            href="https://github.com/j1m5s3" 
            target="_blank" 
            class="social-link github"
            title="View on GitHub"
          >
            <img 
              src="./assets/github.svg" 
              alt="GitHub"
              class="social-icon"
            />
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>


<style>
@import './assets/main.css';

#app {
  min-height: 100vh;
  background-color: var(--background-color);
}

main {
  padding-top: 100px;
}

header {
  background-color: var(--card-background);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
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
  white-space: nowrap;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-tab:hover {
  background-color: var(--hover-color);
  text-decoration: none;
  color: var(--text-primary);
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
  main {
    padding-top: 120px;
  }

  header {
    padding: 0.75rem 0;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .header-left {
    justify-content: center;
  }

  .header-right {
    justify-content: center;
    flex-direction: column;
    gap: 0.75rem;
  }

  .header-logo {
    height: 32px;
    width: 32px;
  }
  
  header h1 {
    font-size: 1.25rem;
  }

  .nav-tabs {
    width: 100%;
    justify-content: center;
  }

  .nav-tab {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }

  .message-content {
    padding: 1rem;
  }

  .message-icon {
    font-size: 2.5rem;
  }

  .message-content h2 {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  main {
    padding-top: 140px;
  }

  header {
    padding: 0.5rem 0;
  }

  .header-content {
    gap: 0.5rem;
  }

  .header-logo {
    height: 28px;
    width: 28px;
  }

  header h1 {
    font-size: 1.125rem;
  }

  .nav-tab {
    padding: 0.375rem 0.5rem;
    font-size: 0.875rem;
  }
}

.footer {
  margin-top: 2rem;
  padding: 1rem;
  text-align: center;
  border-top: 1px solid var(--border-color);
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
}

.social-link:hover {
  transform: translateY(-2px);
}

.social-link.linkedin:hover {
  background-color: #0077b5;
  box-shadow: 0 0 15px rgba(0, 119, 181, 0.5);
  border-color: #0077b5;
}

.social-link.github:hover {
  background-color: #2ea44f;
  box-shadow: 0 0 15px rgba(46, 164, 79, 0.5);
  border-color: #2ea44f;
}

.social-icon {
  width: 20px;
  height: 20px;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.social-link:hover .social-icon {
  opacity: 1;
}

@media (max-width: 768px) {
  .footer {
    margin-top: 1rem;
    padding: 0.75rem;
  }

  .social-links {
    gap: 1.5rem;
  }

  .social-link {
    width: 36px;
    height: 36px;
  }

  .social-icon {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 480px) {
  .footer {
    margin-top: 0.75rem;
    padding: 0.5rem;
  }

  .social-links {
    gap: 1rem;
  }

  .social-link {
    width: 32px;
    height: 32px;
  }

  .social-icon {
    width: 16px;
    height: 16px;
  }
}

</style>
