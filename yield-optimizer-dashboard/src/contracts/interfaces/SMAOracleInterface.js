import { SMAOracleABI } from '../abi/SMAOracleABI.js';

// External
import { readContract } from '@wagmi/core';

class SMAOracleInterface {
    /*
    * SMAOracleInterface
    * 
    * Interface for the SMAOracle contract
    * 
    * This class is used to interact with the SMAOracle contract
    * 
    * @param {WagmiConfig} config - Configuration object
    * @param {string} network - Network name
    * @param {string} account - Account address
    * @param {string} address - Address of the contract
    */

    abi; // List of functions in the contract
    address; // Address of the contract
    config; // Configuration object (wagmiConfig)
    account; // Account address

    constructor(network, account, config, address=null) {
        this.abi = SMAOracleABI.abi;
        this.config = config;
        this.account = account;

        if (address) {
            this.address = address;
        } else {
            this.address = SMAOracleABI.addresses[network];
        }
    }

    // Get best rate protocol name
    getBestRateProtocolName = async (asset) => {
        const data = await readContract(
            this.config,
            {
                abi: this.abi, 
                address: this.address, 
                functionName: "getBestRateProtocol",
                args: [asset]
            }
        );

        return data;
    }

    // Get fee
    getFee = async () => {
        const data = await readContract(
            this.config,
            {
                abi: this.abi, 
                address: this.address, 
                functionName: "fee"
            }
        );

        return data;
    }
}

