<script>
import { SMAInterface } from '@/contracts/interfaces/SMAInterface.js';

import { getAccount } from '@wagmi/core';
import { config } from '@/utils/configs/chainConfig.js';

import { ethers } from "ethers";

export default {
    props: {
        contractAddress: String
    },
    data() {
        return {
            isBusy: false,
            smaAddress: this.contractAddress,
            assetBalances: [],
        };
    },
    async mounted() {
        console.log("MOUNT");
        this.isBusy = true;
        this.assetBalances = await this.getWalletBalances();
        this.isBusy = false;
    },
    methods: {
        async getWalletBalances() {
            const account = getAccount(config);
            if (!account) {
                console.error('Account not found');
                return;
            }
            console.log(account);
            
            const smaInterface = new SMAInterface(
                account.chain.name, account.address, config, this.smaAddress
            );

            const rawAssetBalances = await smaInterface.getAssetBalances();
            if (!rawAssetBalances) {
                console.error('Asset Balances not found');
                return;
            }
            console.log("Raw Asset Balances: ", rawAssetBalances);

            let assetBalances = [];
            for (let i = 0; i < rawAssetBalances.length; i++) {
                if (rawAssetBalances[i].tokenSymbol == 'USDC') {
                    assetBalances.push({
                    address: rawAssetBalances[i].tokenAddress,
                    symbol: rawAssetBalances[i].tokenSymbol,
                    balance: ethers.formatEther(rawAssetBalances[i].balance) / 10 ** 6 
                });
                }
                assetBalances.push({
                    address: rawAssetBalances[i].tokenAddress,
                    symbol: rawAssetBalances[i].tokenSymbol,
                    balance: ethers.formatEther(rawAssetBalances[i].balance)
                });
            }
            return assetBalances;
        },
    },
}
</script>
<template>
    <form action="#" @submit.prevent="" @reset="resetForm" v-if="!isBusy">
        <div class="form-group">
            <label for="smaAddress">SMA Address</label>
            <input type="text" class="form-control" id="smaAddress" v-model="smaAddress" readonly>
        </div>
        <div class="form-group" v-for="asset in assetBalances" :key="asset.address">
            <label for="assetAddress">Asset Address</label>
            <input type="text" class="form-control" id="assetAddress" v-model="asset.address" readonly>
            <label for="assetSymbol">Asset Symbol</label>
            <input type="text" class="form-control" id="assetSymbol" v-model="asset.symbol" readonly>
            <label for="assetBalance">Asset Balance</label>
            <input type="text" class="form-control" id="assetBalance" v-model="asset.balance" readonly>
        </div>
    </form>
</template>