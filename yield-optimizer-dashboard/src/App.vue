<script setup>
import UserDashboard from './components/UserDashboard.vue';
import RatesView from './components/items/views/rates/RatesView.vue';

import { createWeb3Modal } from '@web3modal/wagmi/vue';
import { reconnect } from '@wagmi/core'
import { config } from '@/utils/configs/chainConfig.js'
import { useWeb3ModalEvents } from '@web3modal/wagmi/vue';
import { useAccount } from '@wagmi/vue'
import { useLocalStorage } from '@vueuse/core';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

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
const hasSeenRatesTour = useLocalStorage('has-seen-rates-tour', false);
const hasSeenSMATour = useLocalStorage('has-seen-sma-tour', false);
const tour = ref(null);

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

const initRatesTour = () => {
  tour.value = new Shepherd.Tour({
    useModalOverlay: false,
    defaultStepOptions: {
      classes: 'shepherd-theme-custom',
      scrollTo: true,
      cancelIcon: {
        enabled: true
      }
    }
  });

  tour.value.addStep({
    id: 'rates-welcome',
    text: '<div class="tour-text">Welcome to the Yield Optimizer Dashboard! Let me show you how to explore and compare different yield opportunities.</div>',
    attachTo: {
      element: '.rates-view',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Skip',
        action: tour.value.cancel
      },
      {
        text: 'Start Tour',
        action: tour.value.next
      }
    ]
  });

  tour.value.addStep({
    id: 'rates-overview',
    text: '<div class="tour-text">This table shows current rates across different protocols and assets. You can see APY, TVL, and other key metrics to help you make informed decisions.</div>',
    attachTo: {
      element: '.rates-table',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Back',
        action: tour.value.back
      },
      {
        text: 'Next',
        action: tour.value.next
      }
    ]
  });

  tour.value.addStep({
    id: 'rates-filters',
    text: '<div class="tour-text">Use these filters to narrow down your search. Select specific assets, protocols, or sort by different metrics to find the best opportunities.</div>',
    attachTo: {
      element: '.rates-filters',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Back',
        action: tour.value.back
      },
      {
        text: 'Next',
        action: tour.value.next
      }
    ]
  });

  tour.value.addStep({
    id: 'rates-historical',
    text: '<div class="tour-text">Toggle the historical view to see how rates have changed over time. This helps you understand trends and make better investment decisions.</div>',
    attachTo: {
      element: '.historical-toggle',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Back',
        action: tour.value.back
      },
      {
        text: 'Finish',
        action: () => {
          hasSeenRatesTour.value = true;
          tour.value.complete();
        }
      }
    ]
  });

  tour.value.start();
};

watch(currentView, (newView) => {
  if (newView === 'rates' && !hasSeenRatesTour.value) {
    setTimeout(() => {
      initRatesTour();
    }, 1000);
  }
});

const initSMATour = () => {
  tour.value = new Shepherd.Tour({
    useModalOverlay: false,
    defaultStepOptions: {
      classes: 'shepherd-theme-custom',
      scrollTo: true,
      cancelIcon: {
        enabled: true
      }
    }
  });

  // Oracle Data Section
  tour.value.addStep({
    id: 'sma-oracle-welcome',
    text: '<div class="tour-text">Welcome to the SMA Dashboard! Let me show you the key information and features available.</div>',
    attachTo: {
      element: '.sma-form',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Skip',
        action: tour.value.cancel
      },
      {
        text: 'Start Tour',
        action: tour.value.next
      }
    ]
  });

  tour.value.addStep({
    id: 'sma-fee',
    text: '<div class="tour-text">The SMA Fee shows the cost to deploy a new SMA. This is a one-time fee that covers the smart contract deployment and setup costs.</div>',
    attachTo: {
      element: '#sma-fee',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Back',
        action: tour.value.back
      },
      {
        text: 'Next',
        action: tour.value.next
      }
    ]
  });

  tour.value.addStep({
    id: 'best-rate-protocol',
    text: '<div class="tour-text">The Best Rate Protocol shows which protocol currently offers the highest yield for each asset. This helps you make informed investment decisions.</div>',
    attachTo: {
      element: '#best-rate-protocols',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Back',
        action: tour.value.back
      },
      {
        text: 'Next',
        action: tour.value.next
      }
    ]
  });

  tour.value.addStep({
    id: 'manage-subscription',
    text: '<div class="tour-text">The Manage Subscription fee covers the cost of active management via a bot. This fee enables automated optimization of your investments across protocols.</div>',
    attachTo: {
      element: '#subFee',
      on: 'bottom'
    },
    buttons: [
      {
        text: 'Back',
        action: tour.value.back
      },
      {
        text: 'Next',
        action: tour.value.next
      }
    ]
  });

  // SMA Functions Section
  tour.value.addStep({
    id: 'sma-balances',
    text: '<div class="tour-text">The Balances section shows your current holdings in both your SMA and wallet, including any investment derivatives. You can see your total balance for each asset and refresh the data at any time.</div>',
    attachTo: {
      element: '.section:has(h3:contains("Balances"))',
      on: 'bottom'
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        const balancesSection = document.querySelector('.section:has(h3:contains("Balances"))');
        if (balancesSection) {
          const collapseElement = balancesSection.querySelector('.collapse');
          if (collapseElement) {
            collapseElement.classList.add('show');
            balancesSection.querySelector('.section-header').click();
          }
        }
        setTimeout(resolve, 300); // Wait for animation
      });
    },
    buttons: [
      {
        text: 'Back',
        action: tour.value.back
      },
      {
        text: 'Next',
        action: tour.value.next
      }
    ]
  });

  tour.value.addStep({
    id: 'sma-transfer',
    text: '<div class="tour-text">The Transfer Assets section allows you to move assets between your wallet and SMA. You can easily deposit or withdraw funds with real-time balance updates.</div>',
    attachTo: {
      element: '.section:has(h3:contains("Transfer Assets"))',
      on: 'bottom'
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        const transferSection = document.querySelector('.section:has(h3:contains("Transfer Assets"))');
        if (transferSection) {
          const collapseElement = transferSection.querySelector('.collapse');
          if (collapseElement) {
            collapseElement.classList.add('show');
            transferSection.querySelector('.section-header').click();
          }
        }
        setTimeout(resolve, 300); // Wait for animation
      });
    },
    buttons: [
      {
        text: 'Back',
        action: tour.value.back
      },
      {
        text: 'Next',
        action: tour.value.next
      }
    ]
  });

  tour.value.addStep({
    id: 'sma-invest',
    text: '<div class="tour-text">The Invest Assets section enables one-click investment across different protocols. Select an asset and choose the source and destination protocols to optimize your yields.</div>',
    attachTo: {
      element: '.section:has(h3:contains("Invest Assets"))',
      on: 'bottom'
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        const investSection = document.querySelector('.section:has(h3:contains("Invest Assets"))');
        if (investSection) {
          const collapseElement = investSection.querySelector('.collapse');
          if (collapseElement) {
            collapseElement.classList.add('show');
            investSection.querySelector('.section-header').click();
          }
        }
        setTimeout(resolve, 300); // Wait for animation
      });
    },
    buttons: [
      {
        text: 'Back',
        action: tour.value.back
      },
      {
        text: 'Next',
        action: tour.value.next
      }
    ]
  });

  tour.value.addStep({
    id: 'sma-active-management',
    text: '<div class="tour-text">Active Management allows you to enable or disable automated optimization of your investments. When enabled, the system will automatically rebalance your positions for optimal yields.</div>',
    attachTo: {
      element: '.section:has(h3:contains("Active Management"))',
      on: 'bottom'
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        const managementSection = document.querySelector('.section:has(h3:contains("Active Management"))');
        if (managementSection) {
          const collapseElement = managementSection.querySelector('.collapse');
          if (collapseElement) {
            collapseElement.classList.add('show');
            managementSection.querySelector('.section-header').click();
          }
        }
        setTimeout(resolve, 300); // Wait for animation
      });
    },
    buttons: [
      {
        text: 'Back',
        action: tour.value.back
      },
      {
        text: 'Next',
        action: tour.value.next
      }
    ]
  });

  tour.value.addStep({
    id: 'sma-transactions',
    text: '<div class="tour-text">The Transaction History section provides a complete record of all activities within your SMA. Track transfers, investments, and management actions to monitor your SMA\'s performance.</div>',
    attachTo: {
      element: '.section:has(h3:contains("Transaction History"))',
      on: 'bottom'
    },
    beforeShowPromise: () => {
      return new Promise((resolve) => {
        const transactionsSection = document.querySelector('.section:has(h3:contains("Transaction History"))');
        if (transactionsSection) {
          const collapseElement = transactionsSection.querySelector('.collapse');
          if (collapseElement) {
            collapseElement.classList.add('show');
            transactionsSection.querySelector('.section-header').click();
          }
        }
        setTimeout(resolve, 300); // Wait for animation
      });
    },
    buttons: [
      {
        text: 'Back',
        action: tour.value.back
      },
      {
        text: 'Finish',
        action: () => {
          hasSeenSMATour.value = true;
          tour.value.complete();
        }
      }
    ]
  });

  tour.value.start();
};

watch(currentView, (newView) => {
  if (newView === 'sma' && !hasSeenSMATour.value) {
    setTimeout(() => {
      initSMATour();
    }, 1000);
  }
});

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

/* Enhanced Shepherd Tour Theme */
.shepherd-theme-custom {
  --shepherd-theme-primary: var(--primary-color);
  --shepherd-text-color: var(--text-primary);
  --shepherd-bg: var(--card-background);
  --shepherd-border-radius: 0.5rem;
  --shepherd-border: 1px solid var(--border-color);
  --shepherd-box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.shepherd-content {
  border-radius: 0.5rem;
  box-shadow: var(--shepherd-box-shadow);
  background: var(--card-background);
  border: 2px solid var(--primary-color);
  padding: 1.5rem;
  max-width: 400px;
  z-index: 1000;
}

.tour-text {
  color: var(--text-primary);
  font-size: 1.125rem;
  line-height: 1.6;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.shepherd-button {
  background: var(--primary-color);
  border: none;
  border-radius: 0.25rem;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0.5rem;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.shepherd-button:hover {
  background: var(--hover-color);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.shepherd-button:not(:disabled) {
  cursor: pointer;
}

.shepherd-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.shepherd-cancel-icon {
  color: var(--text-primary);
  font-size: 1.5rem;
  opacity: 0.8;
}

/* Tour Arrow */
.shepherd-arrow {
  border-width: 8px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.shepherd-arrow:before {
  border-width: 8px;
}
</style>
