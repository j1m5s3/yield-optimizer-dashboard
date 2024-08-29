<script>
import { SMAFactoryInterace } from '@/contracts/interfaces/SMAFactoryInterface.js';

const smaFactoryInterface = new SMAFactoryInterace();

export default {
    data() {
        return {
            isBusy: false,
            clientAddress: '',
            txnReceipt: null,
        };
    },
    methods: {
        async submitForm() {
            this.isBusy = true;
            this.txnReceipt = await smaFactoryInterface.deploySMA(this.clientAddress);
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