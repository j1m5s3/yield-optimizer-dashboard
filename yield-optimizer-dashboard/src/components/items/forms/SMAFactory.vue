<script>
import SMAFactoryInterface from '@/contracts/interfaces/SMAFactoryInterface.js';
import { getAccount } from '@wagmi/core'

import { config } from '@/utils/configs/chainConfig.js'

//v-if="!isBusy"
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
            try {
                this.isBusy = true;
                const account = getAccount(config);
                if (!account) {
                    console.error('Account not found');
                    return;
                }
                console.log(account);
                const smaFactoryInterface = new SMAFactoryInterface(
                    account.chain.name, account.address, config
                );

               //debugger;
                this.txnReceipt = await smaFactoryInterface.deploySMA(account.address);
                console.log(this.txnReceipt);
                this.isBusy = false;
            } catch (error) {
                console.error(error);
                this.isBusy = false;
            }
        },
        resetForm() {
            console.log('reset');
        },
    },
};

</script>

<template>
    <form @submit="submitForm" @reset="resetForm" v-if="!isBusy">
        <button type="submit" variant="primary"> Deploy SMA </button>
    </form>
</template>