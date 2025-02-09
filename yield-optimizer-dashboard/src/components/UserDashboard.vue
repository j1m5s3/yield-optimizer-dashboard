<script>
import SMAFactoryInterface from '@/contracts/interfaces/SMAFactoryInterface.js';

// Components
import SMAFactory from './items/forms/SMAFactory.vue';
import SMA from './items/forms/SMA.vue';
import SMAOracleView from './items/views/contracts/SMAOracleView.vue';

import { config } from '@/utils/configs/chainConfig.js'

import { getAccount } from '@wagmi/core'

//import { until } from "@vueuse/core";

console.log("DASH");

export default {
    name: 'Dashboard',
    components: {SMAFactory, SMA, SMAOracleView},
    data() {
        return {
            activeBots: [],
            isBusy: false,
            smaAddress: '',
            showSMA: false,
            showFactory: false,
        }
    },
    async mounted() {
        const dashboardData = await this.fetchData();

        this.smaAddress = dashboardData.smaAddress;
        this.showSMA = dashboardData.showSMA;
        this.showFactory = dashboardData.showFactory;
    },
    methods: {
        async fetchData() {
            // Fetch data from API and contracts
            const account = getAccount(config);
            if (!account) {
                console.error('Account not found');
                return;
            }
            console.log(account);
            //await until(account.isConnected).toBe(true);

            const smaFactoryInterface = new SMAFactoryInterface(
                    account.chain.name, account.address, config
            );

            let smaAddress = await smaFactoryInterface.getClientSMAAddress(account.address);
            let showSMA = true;
            let showFactory = false;
            if (!smaAddress) {
                console.error('SMA Address not found');
                smaAddress = '';
                showSMA = false;
                showFactory = true;
            }

            const dashboardData = {
                smaAddress: smaAddress,
                showSMA: showSMA,
                showFactory: showFactory,
            }

            console.log("GOT DASHBOARD DATA");
            
            return dashboardData;
        },
    }
}
</script>


<template>
    <div id="dashboard">
        <div class="row" v-if="showSMA">
            <div class="col">
                <div class="card" title="SMA Oracle">
                    <SMAOracleView />
                </div>
            </div>
        </div>
        <div class="row" v-if="showFactory">
            <div class="col">
                <div class="card" title="Deploy SMA">
                    <SMAFactory/>
                </div>
            </div>
        </div>
        <div class="row" v-if="showSMA">
            <div class="col">
                <div class="card" title="SMA">
                    <SMA :contractAddress="smaAddress" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#dashboard {
    margin: 20px;
    border-radius: 10px;
}

.card {
    border: 10px solid #000; /* Black border */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Drop shadow */
    font-weight: bold; /* Bold text */
    color: white; /* White text */
}
</style>