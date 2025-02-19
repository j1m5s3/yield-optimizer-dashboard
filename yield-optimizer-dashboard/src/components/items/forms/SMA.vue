<script>
import { SMAInterface } from '@/contracts/interfaces/SMAInterface.js';
import SMAFactoryInterface from '@/contracts/interfaces/SMAFactoryInterface.js';

import { getAccount } from '@wagmi/core';
import { config } from '@/utils/configs/chainConfig.js';

export default {
    props: {
        contractAddress: String,
        allowedBaseTokens: Array,
    },
    data() {
        return {
            isBusy: false,
            assetAddress: '',
            clientAddress: '',
            smaAddress: this.contractAddress,
            allowedBaseTokens: this.allowedBaseTokens,
            amount: 0,
            txnReceipt: null,
        };
    },
    methods: {
        async submitTransfer(transferType) {
            console.log("transferType: ", transferType);

            const account = getAccount(config);
            if (!account) {
                console.error('Account not found');
                return;
            }
            console.log(account);

            const smaInterface = new SMAInterface(
                account.chain.name, account.address, config, this.smaAddress
            );

            this.isBusy = true;
            if (transferType === 'toClient') {
                this.txnReceipt = await smaInterface.transferFromSMA(this.assetAddress, this.amount);
            } else {
                this.txnReceipt = await smaInterface.transferFromClient(this.assetAddress, this.amount);
            }
            this.isBusy = false;
        },
        resetForm() {
            this.amount = 0;
            this.assetAddress = '';
            console.log('reset');
        }
    },
};

</script>

<template>
    <form action="#" @submit.prevent="" @reset="resetForm" v-if="!isBusy">
        <button type="submit" variant="primary" @click="submitTransfer('toClient')">Transfer From</button>
        <button type="submit" variant="primary" @click="submitTransfer('fromClient')">Transfer To</button>
        <button type="reset" variant="danger">Reset</button>
    </form>
</template>