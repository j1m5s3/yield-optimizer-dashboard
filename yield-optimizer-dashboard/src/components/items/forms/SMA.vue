<script>
import { SMAInterface } from '@/contracts/interfaces/SMAInterface.js';
import SMAFactoryInterface from '@/contracts/interfaces/SMAFactoryInterface.js';

import { getAccount } from '@wagmi/core';
import { config } from '@/utils/configs/chainConfig.js';

const smaInterface = new SMAInterface();

export default {
    props: {
        contractAddress: String
    },
    data() {
        return {
            isBusy: false,
            assetAddress: '',
            clientAddress: '',
            smaAddress: this.address,
            amount: 0,
            txnReceipt: null,
        };
    },
    async mounted() {
        console.log("MOUNT");
        //console.log("EVENTS: ", events);
        this.smaAddress = this.contractAddress;
        //const userSMAData = await this.userSMAData();
    },
    methods: {
        async submitTransfer(transferType) {
            console.log("transferType: ", transferType);
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
        },
        async userSMAData() {
            const account = getAccount(config);
            if (!account) {
                console.error('Account not found');
                return;
            }
            console.log(account);

            const smaFactoryInterface = new SMAFactoryInterface(
                    account.chain.name, account.address, config
                );
            
            const smaAddress = await smaFactoryInterface.getClientSMAAddress(account.address);
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