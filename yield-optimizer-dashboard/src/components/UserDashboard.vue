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
            isOracleSectionCollapsed: false,
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
            this.allowedInterestTokens = dashboardData.allowedInterestTokens;
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
                allowedInterestTokens: managerAdminData.allowedInterestTokens,
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
            let allowedInterestTokens = await managerAdminInterface.getAllowedInterestTokens();

            console.log("ALLOWED BASE TOKENS: ", allowedBaseTokens);
            console.log("ALLOWED INTEREST TOKENS: ", allowedInterestTokens);

            return {subFee: fee, allowedBaseTokens: allowedBaseTokens, allowedInterestTokens: allowedInterestTokens};
        },
        async handleSMACreated(event) {
            console.log('SMA Created:', event);
            this.smaAddress = event.smaAddr;
            this.showSMA = true;
            this.showFactory = false;
            
            // Refresh dashboard data to get updated information
            await this.fetchData();
            
            // Refresh the page after a short delay to ensure all data is updated
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        },
    }
}
</script>


<template>
    <div id="dashboard">
        <div class="row" v-if="showFactory || showSMA">
            <div class="col">
                <div class="card no-bottom-border">
                    <div class="card-header" @click="isOracleSectionCollapsed = !isOracleSectionCollapsed" style="cursor: pointer;">
                        <div class="d-flex justify-content-between align-items-center">
                            <h3 class="mb-0">SMA Fees and Rates</h3>
                            <i :class="['bi', isOracleSectionCollapsed ? 'bi-chevron-down' : 'bi-chevron-up']"></i>
                        </div>
                    </div>
                    <div class="collapse" :class="{ 'show': !isOracleSectionCollapsed }">
                        <div class="card-body">
                            <SMAOracleView :contractAddress="oracleAddress" :bestRateProtocols="bestRateProtocols" :deployFee="fee"/>
                            <SMAManagerAdminView :contractAddress="managerAdminAddress" :subFee="subFee"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" v-if="showFactory">
            <div class="col">
                <div class="card">
                    <SMAFactory 
                        :contractAddress="factoryAddress" 
                        :sma-fee="fee"
                        @sma-created="handleSMACreated"
                    />
                </div>
            </div>
        </div>
        <div class="row" v-if="showSMA">
            <div class="col">
                <div class="card no-bottom-border">
                    <SMAView :contractAddress="smaAddress" />
                    <SMA :contractAddress="smaAddress" :allowed-base-tokens="allowedBaseTokens" :allowed-interest-tokens="allowedInterestTokens"/>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <div class="footer">
                    <div class="social-links">
                        <a href="https://www.linkedin.com/in/your-profile" target="_blank" class="social-link linkedin" title="LinkedIn">
                            <img src="@/assets/linkedin.svg" alt="LinkedIn" class="social-icon">
                        </a>
                        <a href="https://github.com/your-username" target="_blank" class="social-link github" title="GitHub">
                            <img src="@/assets/github.svg" alt="GitHub" class="social-icon">
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#dashboard {
    margin: 2rem;
    border-radius: 1rem;
}

#sma-form {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
}

.card {
    box-shadow: var(--shadow);
    font-weight: 500;
    color: var(--text-primary);
    margin: 0 2rem 2rem 0;
    background-color: var(--card-background);
    width: 100%;
    border: 1px solid var(--border-color);
    transition: all 0.3s ease;
}

.card:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
}

.card-header {
    background-color: var(--card-background);
    border-bottom: 1px solid var(--border-color);
    padding: 1.25rem;
    transition: all 0.2s ease;
    width: 100%;
    cursor: pointer;
}

.card-header:hover {
    background-color: var(--hover-color);
}

.card-body {
    width: 100%;
    padding: 1.5rem;
}

.collapse {
    transition: all 0.3s ease;
}

.bi {
    color: var(--text-primary);
    transition: transform 0.3s ease;
    font-size: 1.25rem;
}

.bi-chevron-down {
    transform: rotate(0deg);
}

.bi-chevron-up {
    transform: rotate(180deg);
}

h3 {
    color: var(--text-primary);
    font-weight: 600;
    margin: 0;
    font-size: 1.25rem;
}

.row {
    margin-bottom: 2rem;
}

.row:last-child {
    margin-bottom: 0;
}

/* Add smooth transitions for all interactive elements */
.btn, .form-control, .card, .collapse {
    transition: all 0.3s ease;
}

/* Add hover effects for interactive elements */
.btn:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow);
}

.form-control:focus {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
    border-color: var(--primary-color);
}

/* Add loading state styles */
.is-loading {
    opacity: 0.7;
    pointer-events: none;
}

/* Add responsive padding */
@media (max-width: 768px) {
    #dashboard {
        margin: 1rem;
    }
    
    .card {
        margin: 0 0 1rem 0;
    }
}

.no-bottom-border {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
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
    width: 24px;
    height: 24px;
    filter: var(--icon-filter);
    transition: all 0.3s ease;
}

.social-link:hover .social-icon {
    filter: brightness(0) invert(1);
}
</style>