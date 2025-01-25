<script>
import { SMAFactoryInterface } from '@/contracts/interfaces/SMAFactoryInterface.js';
import { useAccount } from '@wagmi/vue'

export default {
    data() {
        return {
            isBusy: false,
            clientAddress: '',
            txnReceipt: null,
        };
    },
    async mounted() {
        const userSMAData = await this.userSMAData();
    },
    methods: {
        async smaFactory() {
            const account = useAccount(config);
            if (!account) {
                console.error('Account not found');
                return;
            }
            console.log(account);

            const smaFactoryInterface = new SMAFactoryInterface(
                    account.chain.name, account.address, config
                );
            
            const smaAddress = await smaFactoryInterface.getClientSMAAddress(account.address);
        },
        resetForm() {
            console.log('reset');
        },
    },
};
</script>

<template>
    <div id="factory-view">
        <div class="container">
        </div>
    </div>

</template>