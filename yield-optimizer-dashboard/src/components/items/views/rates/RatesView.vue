<template>
  <div class="rates-view">
    <div v-if="isBusy" class="loading-spinner">
      <div class="spinner"></div>
    </div>
    <div v-else class="rates-table-container">
      <table class="rates-table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Protocol</th>
            <th>APY (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(rate, index) in liveRates" :key="index">
            <td>{{ rate.token }}</td>
            <td>{{ rate.protocol }}</td>
            <td>{{ rate.rate.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
    name: 'RatesView',
    data() {
        return {
            liveRates: [],
            isBusy: false,
            tokens: ['USDC', 'USDT', 'DAI'],
            protocols: ['AAVE', 'COMPOUND', 'LIDO']
        }
    },
    async mounted() {
        this.isBusy = true;
        try {
            this.liveRates = this.generateDummyRates();
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            this.isBusy = false;
        }
    },
    methods: {
        generateDummyRates() {
            const rates = [];
            this.tokens.forEach(token => {
                this.protocols.forEach(protocol => {
                    // Generate base rate between 2% and 8%
                    const baseRate = 2 + Math.random() * 6;
                    // Add some random variation
                    const variation = (Math.random() - 0.5) * 0.5;
                    rates.push({
                        token,
                        protocol,
                        rate: baseRate + variation
                    });
                });
            });
            return rates;
        }
    }
}
</script>

<style scoped>
.rates-view {
    padding: 1rem;
}

.loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.rates-table-container {
    background-color: var(--background-color);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    overflow: hidden;
}

.rates-table {
    width: 100%;
    border-collapse: collapse;
}

.rates-table th,
.rates-table td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
}

.rates-table th {
    background-color: var(--background-color);
    font-weight: 600;
    color: var(--text-primary);
}

.rates-table td {
    color: var(--text-secondary);
}

.rates-table tr:last-child td {
    border-bottom: none;
}

.rates-table tr:hover {
    background-color: var(--hover-color);
}
</style>