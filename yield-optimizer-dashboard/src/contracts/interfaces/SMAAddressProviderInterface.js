// Local
import { SMAAddressProviderABI } from "../abi/SMAAddressProviderABI";

// External
import { readContract } from "@wagmi/core";

class SMAAddressProviderInterface {
    /*
    * SMAAddressProviderInterface
    * 
    * Interface for the SMAAddressProvider contract
    * 
    * This class is used to interact with the SMAAddressProvider contract
    * 
    * @param {WagmiConfig} config - Configuration object
    * @param {string} network - Network name
    */

    abi; // List of functions in the contract
    address; // Address of the contract
    config; // Configuration object (wagmiConfig)
    account; // Account address

    constructor(network, account, config, address=null) {
        this.abi = SMAAddressProviderABI.abi;
        this.config = config;
        this.account = account;

        if (address) {
            this.address = address;
        } else {
            this.address = SMAAddressProviderABI.addresses[network];
        }
    }

    // Get SMA factory address
    getSMAFactoryAddress = async () => {
        const data = await readContract(
            this.config,
            {
                abi: this.abi, 
                address: this.address, 
                functionName: "getSMAFactory"
            }
        );

        return data;
    }

    // Get oracle address
    getOracleAddress = async () => {
        const data = await readContract(
            this.config,
            {
                abi: this.abi, 
                address: this.address, 
                functionName: "getOracle"
            }
        );

        return data;
    }

    // Get manager admin address
    getManagerAdminAddress = async () => {
        const data = await readContract(
            this.config,
            {
                abi: this.abi, 
                address: this.address, 
                functionName: "getSMAManagerAdmin"
            }
        );

        return data;
    }

}