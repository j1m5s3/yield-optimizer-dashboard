<script>
import { SMAInterface } from '@/contracts/interfaces/SMAInterface.js';
import SMAFactoryInterface from '@/contracts/interfaces/SMAFactoryInterface.js';
import { getAccount } from '@wagmi/core'

import { config } from '@/utils/configs/chainConfig.js'

const smaInterface = new SMAInterface();

export default {
    data() {
        return {
            isBusy: false,
            assetAddress: '',
            clientAddress: '',
            amount: 0,
            txnReceipt: null,
        };
    },
    async mounted() {
        const userSMAData = await this.userSMAData();
    },
    methods: {
        async submitTransfer(transferType) {
            this.isBusy = true;

            if (transferType === 'toClient') {
                this.txnReceipt = await smaInterface.transferFromSMA(this.assetAddress, this.amount);
            } else {
                this.txnReceipt = await smaInterface.transferFromClient(this.assetAddress, this.amount);
            }
            this.isBusy = false;
        },
        resetForm() {
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
    <b-form @submit="submitForm" @reset="resetForm" v-if="!isBusy">
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    <b-spinner v-else></b-spinner>
</template>