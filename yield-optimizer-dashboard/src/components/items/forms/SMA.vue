<script>
import { SMAInterface } from '@/contracts/interfaces/SMAInterface.js';

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