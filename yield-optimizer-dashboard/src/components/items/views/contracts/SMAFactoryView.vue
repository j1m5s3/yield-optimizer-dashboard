<script>
import { SMAFactoryInterface } from '@/contracts/interfaces/SMAFactoryInterface.js';

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
        },
        resetForm() {
            console.log('reset');
        },
    },
};
</script>