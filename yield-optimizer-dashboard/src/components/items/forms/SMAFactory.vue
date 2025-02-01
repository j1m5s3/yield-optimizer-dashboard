<script>
import SMAFactoryInterface from '@/contracts/interfaces/SMAFactoryInterface.js';
import SMAAddressProviderInterface from '@/contracts/interfaces/SMAAddressProviderInterface';

import { getAccount } from '@wagmi/core'

import { config } from '@/utils/configs/chainConfig.js'

//v-if="!isBusy"
export default {
    data() {
        return {
            isBusy: false,
            clientAddress: '',
            smaFactoryAddress: '',
            smaAddress: '',
            txnReceipt: null,
        };
    },
    async mounted() {
        let addresses = await this.setAddresses();

        this.smaFactoryAddress = addresses.factoryAddress;
        this.smaAddress = addresses.sma;
    },
    methods: {
        async submitForm() {
            try {
                this.isBusy = true;
                const account = getAccount(config);
                if (!account || this.smaAddress !== '') {
                    console.error('Account not found');
                    return;
                }
                console.log(account);

                const smaFactoryInterface = new SMAFactoryInterface(
                    account.chain.name, account.address, config, this.smaFactoryAddress
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
        async getAddresses() {
            const account = getAccount(config);
            if (!account) {
                console.error('Account not found');
                return {factoryAddress: '', sma: ''};
            }
            console.log(account);

            const smaAddressProviderInterface = new SMAAddressProviderInterface(
                account.chain.name, account.address, config
            );
            const smaFactoryAddress = await smaAddressProviderInterface.getSMAFactoryAddress();

            const smaFactoryInterface = new SMAFactoryInterface(
                    account.chain.name, account.address, config, smaFactoryAddress
            );

            const smaAddress = await smaFactoryInterface.getClientSMAAddress(account.address);
            
            return {factoryAddress: smaFactoryAddress, sma: smaAddress};
        },
        resetForm() {
            console.log('reset');
        },
    },
};

</script>

<template>
    <form @submit="submitForm" @reset="resetForm" v-if="!isBusy">
        <div id="sma-deploy-row" class="row">
            <div class="col">
                <button type="submit" variant="primary"> Deploy SMA </button>
            </div>
            <div class="col">
                <p>Deploy a new SMA</p>
            </div>
        </div>
    </form>
</template>

<style scoped>
#sma-deploy-row {
    margin: 20px;
    border-radius: 10px;
}

button {
    border-radius: 10px;
    background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 4px 2px;
    cursor: pointer;
    width: 100%;
    padding: 10px 24px;
}

/* Add a hover effect */
button:hover {
    background-color: #45a049;
}

</style>