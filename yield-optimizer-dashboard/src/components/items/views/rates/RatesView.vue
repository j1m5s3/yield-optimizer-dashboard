<script>
import { getLiveRates, getHistoricalRates } from '@/utils/apis/RatesApi';
import { unpackHistRates, ratesXY } from '@/utils/helpers/RatesHelpers.js';
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
} from 'chart.js';

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
            selectedTokens: [],
            protocols: [],
            selectedProtocols: [],
            tokenRGBA: {},
            protocolsRGBA: {},
            selectedChain: 'ARBITRUM',
            dataOptions: ['LIVE', 'HISTORICAL'],
            histTimeRangeOptions: ['1D', '1W', '1M'],
            timesUpdated: 0,
            selectedTimeRange: '1D',
            selectedData: 'LIVE',
            selectedToken: 'USDC',
            selectedProtocol: 'AAVE',
            isBusy: false,
        }
    },
    async mounted() {
        let live_payload = { chain_name: this.selectedChain };
        let hist_payload = { chain_name: this.selectedChain, time_range_option: this.selectedTimeRange };

        this.isBusy = true;
        const res_live = await getLiveRates(live_payload);
        const res_hist = await getHistoricalRates(hist_payload);

        this.loadChains();
        this.loadTokens();
        this.loadProtocols();
        this.loadRGBA();

        this.liveRates = res_live.rates;
        this.historicalRates = res_hist;

        this.setChartData(res_hist);

        this.isBusy = false;
    },
    methods: {
        async refreshRates() {
            let live_payload = { chain_name: this.selectedChain };

            this.isBusy = true;
            if (this.selectedTokens.length > 0) {
                live_payload['token_symbols'] = JSON.stringify(this.selectedTokens);
            }
            if (this.selectedProtocols.length > 0) {
                live_payload['protocols'] = JSON.stringify(this.selectedProtocols);
            }
            console.log("PAYLOAD: ", live_payload);

            const live_res = await getLiveRates(live_payload);

            this.liveRates = live_res.rates;

            this.isBusy = false;

        },
        async refreshHistoricalRates() {
            let hist_payload = { chain_name: this.selectedChain, time_range_option: this.selectedTimeRange };

            this.isBusy = true;
            console.log("PAYLOAD: ", payload);

            const hist_res = await getHistoricalRates(hist_payload);
            this.historicalRates = hist_res;

            if ((this.selectedTokens.length > 0) && (this.selectedProtocols.length > 0)) {
                this.updateChartData();
            }

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
                            let axisVals = ratesXY(unpackedRate.timestamp, unpackedRate.rate);

                            let chartDataset = {
                                label: `${token} - ${protocol}`,
                                data: axisVals,
                                borderColor: this.tokenRGBA[token],
                                backgroundColor: this.protocolsRGBA[protocol],
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
        updateChartData() {
            let protocols;
            let tokens;

            if (this.selectedProtocols.length > 0) {
                protocols = this.selectedProtocols;
            } else {
                protocols = this.protocols;
            }

            if (this.selectedTokens.length > 0) {
                tokens = this.selectedTokens;
            } else {
                tokens = this.tokens;
            }

            console.log("UPDATE CHART DATA: ", protocols, tokens);
            let datasets = [];
            for (let protocolIndex = 0; protocolIndex < protocols.length; protocolIndex++) {
                let protocol = protocols[protocolIndex];
                for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex++) {
                    let token = tokens[tokenIndex];

                    let unpackedRates = unpackHistRates(this.historicalRates, protocol, token);
                    console.log("UNPACKED RATES: ", unpackedRates);
                    if (unpackedRates.length > 0) {
                        for (let unpackedRatesIndex = 0; unpackedRatesIndex < unpackedRates.length; unpackedRatesIndex++) {
                            let unpackedRate = unpackedRates[unpackedRatesIndex];
                            let axisVals = ratesXY(unpackedRate.timestamp, unpackedRate.rate);

                            let chartDataset = {
                                label: `${token} - ${protocol}`,
                                data: axisVals,
                                borderColor: this.tokenRGBA[token],
                                backgroundColor: this.protocolsRGBA[protocol],
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
            this.timesUpdated += 1;
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

                this.protocolsRGBA = ratesIdentifiers['protocol_rgba'];
                console.log("PROTOCOL RGBA LOADED: ", this.protocolsRGBA);
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
            if (this.selectedTokens.includes(event.target.value)) {
                this.selectedTokens = this.selectedTokens.filter(token => token !== event.target.value);
            } else {
                this.selectedTokens.push(event.target.value);
            }
            console.log("SELECTED TOKENS: ", this.selectedTokens);

            if (this.selectedData == 'HISTORICAL') {
                this.updateChartData();
            } else {
                this.refreshRates();
            }
        },
        onSelectedDataChange(event) {
            console.log("DATA CHANGE: ", event.target.value);
            this.selectedData = event.target.value;
            this.refreshRates();
        },
        onSelectedProtocolChange(event) {
            console.log("PROTOCOL CHANGE: ", event.target.value);
            this.selectedProtocol = event.target.value;
            if (this.selectedProtocols.includes(event.target.value)) {
                this.selectedProtocols = this.selectedProtocols.filter(protocol => protocol !== event.target.value);
            } else {
                this.selectedProtocols.push(event.target.value);
            }
            console.log("SELECTED PROTOCOLS: ", this.selectedProtocols);
            if (this.selectedData == 'HISTORICAL') {
                this.updateChartData();
            } else {
                this.refreshRates();
            }
        },
        onSelectedTimeRangeChange(event) {
            console.log("TIME RANGE CHANGE: ", event.target.value);
            this.selectedTimeRange = event.target.value;
            this.refreshRates();
        },
        addChainTag(newChain) {
            console.log("NEW CHAIN TAG: ", newChain);
            this.chains.push(newChain);
            this.selectedChains.push(newChain);

            console.log("CHAINS: ", this.chains);
            console.log("SELECTED CHAINS: ", this.selectedChains);
        }
    }
}
</script>

<template>
    <h1>Supply Rates</h1>
    <div id="options-container" class="container-fluid">
        <div id="data-options-multi-select" class="row">
            <div class="col">
                <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown"
                    data-bs-auto-close="outside" aria-expanded="false">
                    Tokens
                </button>
                <ul class="dropdown-menu" v-bind:value="selectedToken" @change="onTokenChange">
                    <li class="list-group-item" v-for="(token, index) in tokens" :key="index" :value="token">
                        <input class="form-check-input me-1" type="checkbox" :value="token" id="tokenCheckbox">
                        <label class="form-check-label" for="tokenCheckBox">{{ token }}</label>
                    </li>
                </ul>
            </div>
            <div class="col">
                <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown"
                    data-bs-auto-close="outside" aria-expanded="false">
                    Protocols
                </button>
                <ul class="dropdown-menu" v-bind:value="selectedProtocol" @change="onSelectedProtocolChange">
                    <li class="list-group-item" v-for="(protocol, index) in protocols" :key="index" :value="protocol">
                        <input class="form-check-input me-1" type="checkbox" :value="protocol" id="protocolCheckbox">
                        <label class="form-check-label" for="protocolCheckbox">{{ protocol }}</label>
                    </li>
                </ul>
            </div>
            <div id="chainSelect" class="col">
                <select class="dropdown" v-bind:value="selectedChain" @change="onChainChange">
                    <option v-for="(chain, index) in chains" :key="index" :value="chain">{{ chain }}</option>
                </select>
            </div>
            <div class="col">
                <select class="dropdown" v-bind:value="selectedData" @change="onSelectedDataChange">
                    <option v-for="(option, index) in dataOptions" :key="index" :value="option">{{ option }}</option>
                </select>
            </div>
            <div v-if="selectedData == 'HISTORICAL'" class="col">
                <select class="dropdown" v-bind:value="selectedTimeRange" @change="onSelectedTimeRangeChange">
                    <option v-for="(timeRange, index) in histTimeRangeOptions" :key="index" :value="timeRange">{{
                        timeRange
                    }}</option>
                </select>
            </div>
        </div>
    </div>

    <div id="data-container" class="container-fluid">
        <div id="data-row" class="row">
            <div v-if="isBusy" id="data-spinner" class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <div class="col-lg">
                <div v-if="!isBusy">
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
                        <Line :data="chartData" :key="timesUpdated" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.table {
    font-size: 10px;
}

/*
canvas {

    width: 700px !important;
    height: 500px !important;

}
*/
#data-row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
}

h1 {
    padding: 1rem;
}

ul {
    background-color: gray;
}

select {
    border-radius: 5px;
    padding: 5px;
    margin: 5px;
}

input[type="checkbox"] {
    margin-left: 5px;
}
</style>