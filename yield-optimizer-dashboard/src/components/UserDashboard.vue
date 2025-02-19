<script>
import SMAFactoryInterface from '@/contracts/interfaces/SMAFactoryInterface.js';
import SMAAddressProviderInterface from '@/contracts/interfaces/SMAAddressProviderInterface';
import SMAOracleInterface from '@/contracts/interfaces/SMAOracleInterface';
import SMAManagerAdminInterface from '@/contracts/interfaces/SMAManagerAdminInterface';

// Components
import SMAFactory from './items/forms/SMAFactory.vue';
import SMA from './items/forms/SMA.vue';
import SMAView from './items/views/contracts/SMAView.vue';
import SMAOracleView from './items/views/contracts/SMAOracleView.vue';

import { config } from '@/utils/configs/chainConfig.js'

import { getAccount } from '@wagmi/core'

import { ethers } from "ethers";

//import { until } from "@vueuse/core";

console.log("DASH");

export default {
    name: 'Dashboard',
    components: {SMAFactory, SMA, SMAOracleView, SMAView},
    data() {
        return {
            activeBots: [],
            isBusy: false,
            factoryAddress: '',
            oracleAddress: '',
            smaAddress: '',
            showSMA: false,
            showFactory: false,
            fee: '',
            bestRateProtocols: [],
            allowedBaseTokens: [],
        }
    },
    async mounted() {
        this.isBusy = true;

        const dashboardData = await this.fetchData();

        if (!dashboardData) {
            console.error('Dashboard data not found');
            return;
        }
        else {
            this.factoryAddress = dashboardData.factoryAddress;
            this.oracleAddress = dashboardData.oracleAddress;
            this.smaAddress = dashboardData.smaAddress;
            this.showSMA = dashboardData.showSMA;
            this.showFactory = dashboardData.showFactory;
            this.fee = dashboardData.fee;
            this.bestRateProtocols = dashboardData.bestRateProtocols;
            this.allowedBaseTokens = dashboardData.allowedBaseTokens;
        }

        this.isBusy = false;

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

            const smaAddressProviderInterface = new SMAAddressProviderInterface(
                account.chain.name, account.address, config
            );

            let factoryAddress = await smaAddressProviderInterface.getSMAFactoryAddress();
            let oracleAddress = await smaAddressProviderInterface.getOracleAddress();
            let managerAdminAddress = await smaAddressProviderInterface.getManagerAdminAddress();

            let factoryData = await this._fetchFactoryData(account, factoryAddress);
            let oracleData = await this._fetchOracleData(account, oracleAddress, managerAdminAddress);
            
            let showSMA;
            let showFactory;
            if (!factoryData.smaAddress || factoryData.smaAddress == ethers.ZeroAddress) {
                console.error('SMA Address not found');
                smaAddress = '';
                showSMA = false;
                showFactory = true;
            }
            else {
                showSMA = true;
                showFactory = false;
            }

            const dashboardData = {
                factoryAddress: factoryAddress,
                oracleAddress: oracleAddress,
                smaAddress: factoryData.smaAddress,
                fee: oracleData.fee,
                bestRateProtocols: oracleData.bestRateProtocols,
                allowedBaseTokens: oracleData.allowedBaseTokens,
                showSMA: showSMA,
                showFactory: showFactory,
            }

            console.log("GOT DASHBOARD DATA");
            
            return dashboardData;
        },
        async _fetchFactoryData(account, factoryAddress) {
            const smaFactoryInterface = new SMAFactoryInterface(
                    account.chain.name, account.address, config, factoryAddress
            );

            let smaAddress = await smaFactoryInterface.getClientSMAAddress(account.address);
            console.log("SMA ADDRESS: ", smaAddress);

            return {smaAddress: smaAddress};
        },
        async _fetchOracleData(account, oracleAddress, managerAdminAddress) {
            const managerAdminInterface = new SMAManagerAdminInterface(
                    account.chain.name, account.address, config, managerAdminAddress
            );

            const smaOracleInterface = new SMAOracleInterface(
                account.chain.name, account.address, config, oracleAddress
            );

            let allowedBaseTokens = await managerAdminInterface.getBaseTokens();

            let bestRateProtocols = []
            for (let i = 0; i < allowedBaseTokens.length; i++) {
                let bestRateProtocol = await smaOracleInterface.getBestRateProtocolName(allowedBaseTokens[i].tokenAddress);
                bestRateProtocols.push({
                    tokenSymbol: allowedBaseTokens[i].tokenSymbol,
                    tokenAddress: allowedBaseTokens[i].tokenAddress, 
                    bestRateProtocol: bestRateProtocol
                });
            }
            console.log("BEST RATES: ", bestRateProtocols);

            let feeGwei = await smaOracleInterface.getFee();
            console.log("FEE: ", ethers.toBigInt(feeGwei));
            
            let fee = ethers.formatEther(feeGwei);
            console.log("FEE ETHER: ", fee);
            console.log(fee);

            return {fee: fee, bestRateProtocols: bestRateProtocols, allowedBaseTokens: allowedBaseTokens};
        },
    }
}
</script>


<template>
    <div id="dashboard">
        <div class="row" v-if="showSMA">
            <div class="col">
                <div class="card" title="SMA Oracle">
                    <SMAOracleView :contractAddress="oracleAddress" :bestRateProtocols="bestRateProtocols" :deployFee="fee"/>
                </div>
            </div>
        </div>
        <div class="row" v-if="showFactory">
            <div class="col">
                <div class="card" title="Deploy SMA">
                    <SMAFactory :contractAddress="factoryAddress"/>
                </div>
            </div>
        </div>
        <div class="row" v-if="showSMA">
            <div class="col">
                <div class="card" title="SMA">
                    <SMAView :contractAddress="smaAddress" />
                    <SMA :contractAddress="smaAddress" :allowed-base-tokens="allowedBaseTokens"/>
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