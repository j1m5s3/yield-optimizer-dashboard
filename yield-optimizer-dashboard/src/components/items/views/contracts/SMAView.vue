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
            assetAddresses: [],
            clientAddress: '',
            smaAddress: this.address,
        };
    },
    async mounted() {
        console.log("MOUNT");
        //console.log("EVENTS: ", events);
        this.smaAddress = await this.getWalletBalances();
        //const userSMAData = await this.userSMAData();
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

            const clientAddress = await smaInterface.getClientAddress();
            if (!clientAddress) {
                console.error('Client Address not found');
                return;
            }

            this.clientAddress = clientAddress;
            console.log("Client Address: ", this.clientAddress);

            const rawAssetBalances = await smaInterface.getAssetBalances();
            if (!assetBalances) {
                console.error('Asset Balances not found');
                return;
            }

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
    <div>
        <div v-if="isBusy" class="loader">Loading...</div>
        <div v-else>
            <div v-for="asset in assetAddresses" :key="asset.address">
                <p>{{ asset.symbol }}: {{ asset.balance }}</p>
            </div>
        </div>
    </div>