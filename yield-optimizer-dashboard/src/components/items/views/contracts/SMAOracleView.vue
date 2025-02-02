<script>
import SMAAddressProviderInterface from '@/contracts/interfaces/SMAAddressProviderInterface';
import SMAOracleInterface from '@/contracts/interfaces/SMAOracleInterface';
import SMAManagerAdminInterface from '@/contracts/interfaces/SMAManagerAdminInterface';

import { getAccount } from '@wagmi/core'

import { config } from '@/utils/configs/chainConfig.js'
import { get } from '@vueuse/core';

// TODO: Consider replacing best rate protocol func call with api call if no account is found
export default {
    data() {
        return {
            isBusy: false,
            clientAddress: '',
            oracleAddress: '',
            managerAdminAddress: '',
            smaFee: '',
            bestRateProtocols: [],
            txnReceipt: null,
        };
    },
    async mounted() {
        let addresses = await this.setAddresses();

        this.oracleAddress = addresses.oracle;
        this.managerAdminAddress = addresses.managerAdmin;
    },
    methods: {
        async setAddresses() {
            const account = getAccount(config);
            if (!account) {
                console.error('Account not found');
                return {oracle: ''};
            }
            console.log(account);

            const smaAddressProviderInterface = new SMAAddressProviderInterface(
                account.chain.name, account.address, config
            );

            let oracleAddress = await smaAddressProviderInterface.getOracleAddress();
            if (!oracleAddress) {
                console.error('SMA Address not found');
                oracleAddress = '';
            }

            let managerAdminAddress = await smaAddressProviderInterface.getManagerAdminAddress();
            if (!managerAdminAddress) {
                console.error('Manager Admin Address not found');
                managerAdminAddress = '';
            }

            return {oracle: oracleAddress, managerAdmin: managerAdminAddress};
        },
        async getOracleData() {
            try {
                this.isBusy = true;
                const account = getAccount(config);
                if (!account || this.oracleAddress === '') {
                    console.error('Account not found');
                    return;
                }
                console.log(account);

                const managerAdminInterface = new SMAManagerAdminInterface(
                    account.chain.name, account.address, config, this.managerAdminAddress
                );

                let allowedBaseTokens = await managerAdminInterface.getBaseTokens();

                const smaOracleInterface = new SMAOracleInterface(
                    account.chain.name, account.address, config, this.oracleAddress
                );

                const fee = await smaOracleInterface.getFee();
                console.log(oracleData);
                this.isBusy = false;
            } catch (error) {
                console.error(error);
                this.isBusy = false;
            }
        },
    },
};
</script>
