<script>
import { getLiveRates, getHistoricalRates } from '@/utils/apis/RatesApi';
import { unpackHistRates } from '@/utils/helpers/RatesHelpers.js';
import ratesIdentifiers from '@/utils/constants/ratesIdentifiers.json';

import { Line } from 'vue-chartjs';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

export default {
    name: 'RatesView',
    components: { Line },
    data() {
        return {
            liveRates: [],
            historicalRates: [],
            chartData: {
                labels: [],
                datasets: []
            },
            chartConfig: {
                type: 'line',
                data: {},
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                }
            },
            chains: [],
            tokens: [],
            protocols: [],
            tokenRGBA: {},
            selectedChain: 'ARBITRUM',
            dataOptions: ['LIVE', 'HISTORICAL'],
            histTimeRangeOptions: ['1D', '1W', '1M'],
            selectedTimeRange: '1D',
            selectedData: 'LIVE',
            selectedToken: '',
            selectedProtocol: '',
            isBusy: false,
        }
    },
    async mounted() {
        let live_payload = {};
        let hist_payload = {};

        if (this.selectedToken != '') {
            live_payload = { chain_name: this.selectedChain, token_symbol: this.selectedToken };
        } else {
            live_payload = { chain_name: this.selectedChain };
        }

        hist_payload = { chain_name: this.selectedChain, time_range_option: this.selectedTimeRange };

        this.isBusy = true;
        const res_live = await getLiveRates(live_payload);
        const res_hist = await getHistoricalRates(hist_payload);

        this.loadChains();
        this.loadTokens();
        this.loadProtocols();
        this.loadRGBA();

        this.liveRates = res_live.rates;
        this.historicalRates = res_hist.rates;

        this.setChartData(res_hist);

        this.isBusy = false;
    },
    methods: {
        async refreshRates() {
            let payload = {};

            if (this.selectedToken != '') {
                payload = { chain_name: this.selectedChain, token_symbol: this.selectedToken };
            } else {
                payload = { chain_name: this.selectedChain };
            }
            this.isBusy = true;
            const res = await getLiveRates(payload);

            this.liveRates = res.rates;
            this.isBusy = false;
        },
        setChartData(rawHistData) {
            console.log("RAW HISTORICAL DATA: ", rawHistData);

            let timestamps = [];
            for (let tsIndex = 0; tsIndex < rawHistData.timestamps.length; tsIndex++) {
                let ts = rawHistData.timestamps[tsIndex];
                timestamps.push(new Date(ts * 1000).toLocaleString('en-US', {
                    year: 'numeric', month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                    timeZoneName: 'short'
                }));
            }
            console.log("TIMESTAMPS: ", timestamps);
            this.chartData.labels = timestamps;

            let datasets = [];
            for (let protocolIndex = 0; protocolIndex < this.protocols.length; protocolIndex++) {
                let protocol = this.protocols[protocolIndex];
                for (let tokenIndex = 0; tokenIndex < this.tokens.length; tokenIndex++) {
                    let token = this.tokens[tokenIndex];

                    let unpackedRates = unpackHistRates(rawHistData, protocol, token);
                    console.log("UNPACKED RATES: ", unpackedRates);
                    if (unpackedRates.length > 0) {
                        for (let unpackedRatesIndex = 0; unpackedRatesIndex < unpackedRates.length; unpackedRatesIndex++) {
                            let unpackedRate = unpackedRates[unpackedRatesIndex];
                            
                            let chartDataset = {
                            label: `${token} - ${protocol}`,
                            data: unpackedRate.rate,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: this.tokenRGBA[token],
                            fill: false,
                            tension: 0.4
                        }
                            datasets.push(chartDataset);
                        }
                    }
                }
            }

            this.chartData.datasets = datasets;
            console.log("CHART DATA: ", this.chartData);

            this.chartConfig.data = this.chartData;
        },
        loadChains() {
            try {
                ratesIdentifiers['chains'].forEach((chain) => {
                    this.chains.push(chain);
                });
                console.log("CHAINS LOADED: ", this.chains);
            } catch (error) {
                console.error(error);
            }
        },
        loadTokens() {
            try {
                ratesIdentifiers['token_symbols'].forEach((token) => {
                    this.tokens.push(token);
                });
                console.log("TOKENS LOADED: ", this.tokens);
            } catch (error) {
                console.error(error);
            }
        },
        loadProtocols() {
            try {
                ratesIdentifiers['protocols'].forEach((protocol) => {
                    this.protocols.push(protocol);
                });
                console.log("PROTOCOLS LOADED: ", this.protocols);
            } catch (error) {
                console.error(error);
            }
        },
        loadRGBA() {
            try {
                this.tokenRGBA = ratesIdentifiers['token_rgba'];
                console.log("TOKEN RGBA LOADED: ", this.tokenRGBA);
            } catch (error) {
                console.error(error);
            }
        },
        onChainChange(event) {
            console.log("CHAIN CHANGE: ", event.target.value);
            this.selectedChain = event.target.value;
            this.refreshRates();
        },
        onTokenChange(event) {
            console.log("TOKEN CHANGE: ", event.target.value);
            this.selectedToken = event.target.value;
            this.refreshRates();
        },
        onSelectedDataChange(event) {
            console.log("DATA CHANGE: ", event.target.value);
            this.selectedData = event.target.value;
            this.refreshRates();
        },
        onSelectedProtocolChange(event) {
            console.log("PROTOCOL CHANGE: ", event.target.value);
            this.selectedProtocol = event.target.value;
            this.refreshRates();
        },
        onSelectedTimeRangeChange(event) {
            console.log("TIME RANGE CHANGE: ", event.target.value);
            this.selectedTimeRange = event.target.value;
            this.refreshRates();
        }
    }
}
</script>

<template>
    <div id="data-options-select" class="row">
        <h1>Live Rates</h1>
        <div id="chainSelect" class="col">
            <select class="dropdown" v-bind:value="selectedChain" @change="onChainChange">
                <option value="">-- Chain --</option>
                <option v-for="(chain, index) in chains" :key="index" :value="chain.value">{{ chain }}</option>
            </select>
        </div>
        <div class="col">
            <select class="dropdown" v-bind:value="selectedToken" @change="onTokenChange">
                <option value="">-- Token --</option>
                <option v-for="(token, index) in tokens" :key="index" :value="token.value">{{ token }}</option>
            </select>
        </div>
        <div class="col">
            <select class="dropdown" v-bind:value="selectedData" @change="onSelectedDataChange">
                <option v-for="(option, index) in dataOptions" :key="index" :value="option">{{ option }}</option>
            </select>
        </div>
        <div class="col">
            <select class="dropdown" v-bind:value="selectedProtocol" @change="onSelectedProtocolChange">
                <option value="">-- Protocol --</option>
                <option v-for="(protocol, index) in protocols" :key="index" :value="protocol">{{ protocol }}</option>
            </select>
        </div>
        <div class="col">
            <select class="dropdown" v-bind:value="selectedTimeRange" @change="onSelectedTimeRangeChange">
                <option v-for="(timeRange, index) in histTimeRangeOptions" :key="index" :value="timeRange">{{ timeRange
                    }}</option>
            </select>
        </div>
    </div>

    <div class="row">
        <div v-if="isBusy" class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
        <div v-else>
            <table v-if="selectedData == 'LIVE'" class="table table-dark table-hover table-sm">
                <thead>
                    <tr>
                        <th scope="col">Symbol</th>
                        <th scope="col">Protocol</th>
                        <th scope="col">Supply APR %</th>
                        <th scope="col">Supply APY %</th>
                        <th scope="col">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    <tr scope="row" v-for="rate in liveRates" :key="rate.symbol">
                        <td>{{ rate.token_symbol }}</td>
                        <td>{{ rate.protocol }}</td>
                        <td>{{ rate.supply_apr.toFixed(3) }}</td>
                        <td>{{ rate.supply_apy.toFixed(3) }}</td>
                        <td>{{ new Date(rate.timestamp * 1000).toLocaleString('en-US', {
                            year: 'numeric', month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                            second: 'numeric',
                            timeZoneName: 'short'
                        }) }}</td>
                    </tr>
                </tbody>
            </table>
            <div id="hist-data" v-else-if="selectedData == 'HISTORICAL'">
                <Line :data="chartData" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.table {
    font-size: 10px;
}
</style>