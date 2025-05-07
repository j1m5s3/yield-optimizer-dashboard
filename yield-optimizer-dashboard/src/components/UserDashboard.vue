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
import SMAManagerAdminView from './items/views/contracts/SMAManagerAdminView.vue';

import { config } from '@/utils/configs/chainConfig.js'

import { getAccount } from '@wagmi/core'

import { ethers } from "ethers";

//import { until } from "@vueuse/core";

console.log("DASH");

export default {
    name: 'Dashboard',
    components: {SMAFactory, SMA, SMAOracleView, SMAView, SMAManagerAdminView},
    data() {
        return {
            activeBots: [],
            isBusy: false,
            factoryAddress: '',
            oracleAddress: '',
            managerAdminAddress: '',
            smaAddress: '',
            showSMA: false,
            showFactory: false,
            fee: '',
            subFee: '',
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
            this.managerAdminAddress = dashboardData.managerAdminAddress;
            this.smaAddress = dashboardData.smaAddress;
            this.showSMA = dashboardData.showSMA;
            this.showFactory = dashboardData.showFactory;
            this.fee = dashboardData.fee;
            this.subFee = dashboardData.subFee;
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
            let managerAdminData = await this._fetchManagerAdminData(account, managerAdminAddress);
            let oracleData = await this._fetchOracleData(
                account, oracleAddress, managerAdminData.allowedBaseTokens
            );
            
            let showSMA;
            let showFactory;
            if (!factoryData.smaAddress || factoryData.smaAddress == ethers.ZeroAddress) {
                console.error('SMA Address not found');
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
                managerAdminAddress: managerAdminAddress,
                smaAddress: factoryData.smaAddress,
                fee: oracleData.fee,
                subFee: managerAdminData.subFee,
                bestRateProtocols: oracleData.bestRateProtocols,
                allowedBaseTokens: managerAdminData.allowedBaseTokens,
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
        async _fetchOracleData(account, oracleAddress, allowedBaseTokens) {
            const smaOracleInterface = new SMAOracleInterface(
                account.chain.name, account.address, config, oracleAddress
            );

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
        async _fetchManagerAdminData(account, managerAdminAddress) {
            const managerAdminInterface = new SMAManagerAdminInterface(
                    account.chain.name, account.address, config, managerAdminAddress
            );

            let subFee = await managerAdminInterface.getSubscriptionFee();
            console.log("SUBSCRIPTION FEE: ", subFee);
            let formattedFee = ethers.formatEther(subFee);
            let fee = formattedFee * 10**18;
            let allowedBaseTokens = await managerAdminInterface.getBaseTokens();

            console.log("ALLOWED BASE TOKENS: ", allowedBaseTokens);

            return {subFee: fee, allowedBaseTokens: allowedBaseTokens};
        },
    }
}
</script>


<template>
    <div id="dashboard">
        <div class="row" v-if="showFactory">
            <div class="col">
                <div class="card" title="SMA Fees and Rates">
                    <SMAOracleView :contractAddress="oracleAddress" :bestRateProtocols="bestRateProtocols" :deployFee="fee"/>
                    <SMAManagerAdminView :contractAddress="managerAdminAddress" :subFee="subFee"/>
                </div>
            </div>
        </div>
        <div class="row" v-if="showFactory">
            <div class="col">
                <div class="card" title="Deploy SMA">
                    <SMAFactory :contractAddress="factoryAddress" :sma-fee="fee"/>
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

#sma-form {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
}

.card {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Drop shadow */
    font-weight: bold; /* Bold text */
    color: white; /* White text */
    margin: 0 2rem 0 0;
    background-color: gray;
}
</style>