<template>
  <div class="rates-view">
    <div class="view-header">
      <div class="d-flex justify-content-between align-items-center">
        <h2>Rates Overview</h2>
        <div class="view-toggle">
          <span class="toggle-label">Show Historical</span>
          <div class="form-check form-switch">
            <input 
              class="form-check-input" 
              type="checkbox" 
              id="viewToggle" 
              v-model="showHistorical"
            >
          </div>
        </div>
      </div>
    </div>

    <div class="filters mb-4">
      <div class="filter-group">
        <h4 class="filter-title">Assets</h4>
        <div class="filter-options">
          <div v-for="asset in availableAssets" :key="asset" class="form-check">
            <input 
              class="form-check-input" 
              type="checkbox" 
              :id="`asset-${asset}`"
              v-model="selectedAssets"
              :value="asset"
            >
            <label class="form-check-label" :for="`asset-${asset}`">
              {{ asset }}
            </label>
          </div>
        </div>
      </div>
      <div class="filter-group">
        <h4 class="filter-title">Protocols</h4>
        <div class="filter-options">
          <div v-for="protocol in availableProtocols" :key="protocol" class="form-check">
            <input 
              class="form-check-input" 
              type="checkbox" 
              :id="`protocol-${protocol}`"
              v-model="selectedProtocols"
              :value="protocol"
            >
            <label class="form-check-label" :for="`protocol-${protocol}`">
              {{ protocol }}
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="current-rates">
      <h3 class="section-title">Current Rates</h3>
      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
      </div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Token</th>
            <th>Protocol</th>
            <th class="text-end">APY (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rate in filteredCurrentRates" :key="`${rate.token}-${rate.protocol}`">
            <td>{{ rate.token }}</td>
            <td>{{ rate.protocol }}</td>
            <td class="text-end">{{ rate.apy.toFixed(2) }}</td>
          </tr>
          <tr v-if="filteredCurrentRates.length === 0">
            <td colspan="3" class="text-center">No rates available</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showHistorical" class="historical-rates">
      <h3 class="section-title">Historical Rates</h3>
      <div class="time-intervals mb-3">
        <button 
          v-for="interval in timeIntervals" 
          :key="interval.value"
          class="interval-btn"
          :class="{ active: selectedInterval === interval.value }"
          @click="changeInterval(interval.value)"
        >
          {{ interval.label }}
        </button>
      </div>
      <div v-if="isLoading" class="loading-container">
        <div class="spinner"></div>
      </div>
      <div v-else class="chart-container">
        <Line
          :data="filteredChartData"
          :options="chartOptions"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default {
  name: 'RatesView',
  components: {
    Line
  },
  data() {
    return {
      isLoading: false,
      showHistorical: false,
      selectedInterval: '30d',
      timeIntervals: [
        { label: '24H', value: '24h' },
        { label: '7D', value: '7d' },
        { label: '30D', value: '30d' },
        { label: '90D', value: '90d' },
        { label: '1Y', value: '1y' }
      ],
      currentRates: [
        { token: 'USDC', protocol: 'Aave', apy: 3.45 },
        { token: 'USDC', protocol: 'Compound', apy: 3.12 },
        { token: 'ETH', protocol: 'Aave', apy: 4.23 },
        { token: 'ETH', protocol: 'Compound', apy: 3.98 },
        { token: 'ETH', protocol: 'Lido', apy: 4.56 },
        { token: 'ETH', protocol: 'Rocket Pool', apy: 4.32 },
        { token: 'ETH', protocol: 'StakeWise', apy: 4.18 }
      ],
      selectedAssets: ['USDC', 'ETH'],
      selectedProtocols: ['Aave', 'Compound', 'Lido', 'Rocket Pool', 'StakeWise'],
      chartData: {
        labels: [],
        datasets: []
      },
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#FFFFFF',
              font: {
                size: 12,
                weight: '500'
              },
              generateLabels: (chart) => {
                const datasets = chart.data.datasets;
                return datasets.map((dataset, i) => {
                  const [asset, protocol] = dataset.label.split(' - ');
                  return {
                    text: dataset.label,
                    fillStyle: this.getAssetBackgroundColor(asset),
                    strokeStyle: this.getProtocolColor(protocol),
                    lineWidth: 2,
                    hidden: !chart.isDatasetVisible(i),
                    index: i
                  };
                });
              }
            }
          },
          title: {
            display: true,
            text: 'Historical APY Rates',
            color: '#FFFFFF',
            font: {
              size: 16,
              weight: '600'
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'APY (%)',
              color: '#FFFFFF'
            },
            ticks: {
              color: '#FFFFFF'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Date',
              color: '#FFFFFF'
            },
            ticks: {
              color: '#FFFFFF'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    };
  },
  computed: {
    availableAssets() {
      return [...new Set(this.currentRates.map(rate => rate.token))];
    },
    availableProtocols() {
      return [...new Set(this.currentRates.map(rate => rate.protocol))];
    },
    filteredCurrentRates() {
      return this.currentRates.filter(rate => 
        this.selectedAssets.includes(rate.token) && 
        this.selectedProtocols.includes(rate.protocol)
      );
    },
    filteredChartData() {
      if (!this.chartData.datasets) return this.chartData;
      
      return {
        ...this.chartData,
        datasets: this.chartData.datasets.filter(dataset => {
          // Extract asset and protocol from the dataset label
          const [asset, protocol] = dataset.label.split(' - ');
          return this.selectedAssets.includes(asset) && 
                 this.selectedProtocols.includes(protocol);
        })
      };
    }
  },
  watch: {
    showHistorical(newValue) {
      if (newValue) {
        this.generateHistoricalData();
      }
    }
  },
  methods: {
    changeInterval(interval) {
      this.selectedInterval = interval;
      this.generateHistoricalData();
    },
    generateHistoricalData() {
      let days;
      let interval;
      
      switch(this.selectedInterval) {
        case '24h':
          days = 24;
          interval = 'hour';
          break;
        case '7d':
          days = 7;
          interval = 'day';
          break;
        case '30d':
          days = 30;
          interval = 'day';
          break;
        case '90d':
          days = 90;
          interval = 'day';
          break;
        case '1y':
          days = 365;
          interval = 'week';
          break;
        default:
          days = 30;
          interval = 'day';
      }

      // Generate dates based on interval
      const dates = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        if (interval === 'hour') {
          date.setHours(date.getHours() - (days - 1 - i));
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (interval === 'week') {
          date.setDate(date.getDate() - (days - 1 - i) * 7);
          return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        } else {
          date.setDate(date.getDate() - (days - 1 - i));
          return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
      });

      // Generate dummy data for each asset-protocol combination
      const datasets = [];
      
      // Get all available protocols for the selected assets
      const availableProtocolsForAssets = this.currentRates
        .filter(rate => this.selectedAssets.includes(rate.token))
        .map(rate => rate.protocol)
        .filter((protocol, index, self) => self.indexOf(protocol) === index);

      // Only use protocols that are both available and selected
      const protocolsToUse = availableProtocolsForAssets.filter(protocol => 
        this.selectedProtocols.includes(protocol)
      );

      this.selectedAssets.forEach(asset => {
        protocolsToUse.forEach(protocol => {
          const baseRate = Math.random() * 2 + 2; // Random base rate between 2-4%
          const data = dates.map(() => {
            // Add some random variation to the base rate
            const variation = (Math.random() - 0.5) * 0.5;
            return (baseRate + variation).toFixed(2);
          });

          datasets.push({
            label: `${asset} - ${protocol}`,
            data: data,
            borderColor: this.getProtocolColor(protocol),
            pointBackgroundColor: this.getAssetBackgroundColor(asset),
            pointBorderColor: this.getAssetBackgroundColor(asset),
            tension: 0.4,
            fill: false
          });
        });
      });

      this.chartData = {
        labels: dates,
        datasets: datasets
      };
    },
    getProtocolColor(protocol) {
      const colors = {
        'Aave': '#B6509E',
        'Compound': '#00D395',
        'Lido': '#00A3FF',
        'Rocket Pool': '#FF6B6B',
        'StakeWise': '#4ECDC4'
      };
      return colors[protocol] || '#000000';
    },
    getAssetBackgroundColor(asset) {
      const colors = {
        'USDC': '#2775CA',  // Blue
        'ETH': '#627EEA',   // Light Blue
        'USDT': '#26A17B',  // Green
        'DAI': '#F5AC37',   // Orange
        'WBTC': '#F7931A'   // Bitcoin Orange
      };
      return colors[asset] || '#000000';
    }
  }
};
</script>

<style scoped>
.rates-view {
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.view-header {
  margin-bottom: 1.5rem;
}

.view-header h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 600;
}

.section-title {
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.view-toggle {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.toggle-label {
  color: var(--text-primary);
  font-size: 0.875rem;
}

.form-switch {
  padding-left: 2.5rem;
}

.form-check-input {
  width: 2.5rem;
  height: 1.25rem;
  margin-left: -2.5rem;
  background-color: var(--border-color);
  border-color: var(--border-color);
}

.form-check-input:checked {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.filters {
  display: flex;
  gap: 2rem;
  padding: 1rem;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
}

.filter-group {
  flex: 1;
}

.filter-title {
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.form-check {
  display: flex;
  align-items: center;
  margin: 0;
}

.form-check-input {
  width: 1rem;
  height: 1rem;
  margin: 0;
  margin-right: 0.5rem;
  background-color: var(--card-background);
  border: 1px solid var(--border-color);
}

.form-check-input:checked {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.form-check-label {
  color: var(--text-primary);
  font-size: 0.875rem;
  margin: 0;
  cursor: pointer;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.current-rates {
  margin-bottom: 2rem;
}

.table {
  color: var(--text-primary);
  margin-bottom: 0;
}

.table th {
  font-weight: 600;
  border-bottom: 2px solid var(--border-color);
  padding: 0.75rem;
}

.table td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border-color);
  vertical-align: middle;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.loading-container {
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

.historical-rates {
  border-top: 1px solid var(--border-color);
  padding-top: 2rem;
}

.chart-container {
  height: 400px;
  position: relative;
}

.time-intervals {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

.interval-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background-color: var(--card-background);
  color: var(--text-primary);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
}

.interval-btn:hover {
  background-color: var(--hover-color);
}

.interval-btn.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.mb-3 {
  margin-bottom: 1rem;
}
</style>