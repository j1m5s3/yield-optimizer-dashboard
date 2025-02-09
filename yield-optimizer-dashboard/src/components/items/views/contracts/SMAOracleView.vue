<script>
import SMAAddressProviderInterface from '@/contracts/interfaces/SMAAddressProviderInterface';
import SMAOracleInterface from '@/contracts/interfaces/SMAOracleInterface';
import SMAManagerAdminInterface from '@/contracts/interfaces/SMAManagerAdminInterface';

import { getAccount } from '@wagmi/core'

import { config } from '@/utils/configs/chainConfig.js';

import { ethers } from "ethers";

// TODO: Consider replacing best rate protocol func call with api call if no account is found
export default {
    data() {
        return {
            isBusy: false,
            clientAddress: '',
            oracleAddress: '',
            managerAdminAddress: '',
            smaFee: '',
            bestRateProtocols: [],
            txnReceipt: null,
        };
    },
    async mounted() {
        let addresses = await this.setAddresses();

        this.oracleAddress = addresses.oracle;
        this.managerAdminAddress = addresses.managerAdmin;

        let oracleData = await this.getOracleData();
        this.smaFee = oracleData.fee;
        this.bestRateProtocols = oracleData.bestRateProtocols;
    },
    methods: {
        async setAddresses() {
            const account = getAccount(config);
            if (!account) {
                console.error('Account not found');
                return {oracle: ''};
            }
            console.log(account);

            const smaAddressProviderInterface = new SMAAddressProviderInterface(
                account.chain.name, account.address, config
            );

            let oracleAddress = await smaAddressProviderInterface.getOracleAddress();
            if (!oracleAddress) {
                console.error('SMA Address not found');
                oracleAddress = '';
            }

            let managerAdminAddress = await smaAddressProviderInterface.getManagerAdminAddress();
            if (!managerAdminAddress) {
                console.error('Manager Admin Address not found');
                managerAdminAddress = '';
            }

            return {oracle: oracleAddress, managerAdmin: managerAdminAddress};
        },
        async getOracleData() {
            try {
                this.isBusy = true;
                const account = getAccount(config);
                if (!account || this.oracleAddress === '') {
                    console.error('Account not found');
                    return;
                }
                console.log(account);

                const managerAdminInterface = new SMAManagerAdminInterface(
                    account.chain.name, account.address, config, this.managerAdminAddress
                );

                let allowedBaseTokens = await managerAdminInterface.getBaseTokens();
                console.log("ALLOWED TOKENS: ", allowedBaseTokens);
                let tokenInfo = [];
                for (let i = 0; i < allowedBaseTokens.length; i++) {
                    tokenInfo.push({tokenAddress: allowedBaseTokens[i].tokenAddress, tokenSymbol: allowedBaseTokens[i].tokenSymbol});
                }

                const smaOracleInterface = new SMAOracleInterface(
                    account.chain.name, account.address, config, this.oracleAddress
                );

                let bestRateProtocols = []
                for (let i = 0; i < tokenInfo.length; i++) {
                    let bestRateProtocol = await smaOracleInterface.getBestRateProtocolName(tokenInfo[i].tokenAddress);
                    bestRateProtocols.push({
                        tokenSymbol: tokenInfo[i].tokenSymbol,
                        tokenAddress: tokenInfo[i].tokenAddress, 
                        bestRateProtocol: bestRateProtocol
                    });
                }
                console.log("BEST RATES: ", bestRateProtocols);

                let feeGwei = await smaOracleInterface.getFee();
                console.log("FEE: ", ethers.toBigInt(feeGwei));
                
                let fee = ethers.formatEther(feeGwei);
                console.log("FEE ETHER: ", fee);

                console.log(fee);
                this.isBusy = false;

                return {fee: fee, bestRateProtocols: bestRateProtocols};
            } catch (error) {
                console.error(error);
                this.isBusy = false;
                return {fee: '', bestRateProtocols: []};
            }
        },
    },
};
</script>

<template>
    <div id="oracle-view">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h1>Oracle</h1>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-12">
                                    <h2>Oracle Data</h2>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="oracle-address">Oracle Address</label>
                                        <input type="text" class="form-control" id="oracle-address" v-model="oracleAddress" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group
                                    ">
                                        <label for="manager-admin-address">Manager Admin Address</label>
                                        <input type="text" class="form-control" id="manager-admin-address" v-model="managerAdminAddress" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group
                                    ">
                                        <label for="sma-fee">SMA Fee (ETH)</label>
                                        <input type="text" class="form-control" id="sma-fee" v-model="smaFee" readonly>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="best-rate-protocols">Best Rate Protocols</label>
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Token Symbol</th>
                                                    <th scope="col">Token Address</th>
                                                    <th scope="col">Best Rate Protocol</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="protocol in bestRateProtocols">
                                                    <td>{{ protocol.tokenSymbol }}</td>
                                                    <td>{{ protocol.tokenAddress }}</td>
                                                    <td>{{ protocol.bestRateProtocol }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
