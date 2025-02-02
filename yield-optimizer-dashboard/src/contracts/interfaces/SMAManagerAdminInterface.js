// Local
import { SMAManagerAdminABI } from "../abi/SMAManagerAdminABI";

// External
import { readContract } from "@wagmi/core";

class SMAManagerAdminInterface {
    /*
    * SMAManagerAdminInterface
    * 
    * Interface for the SMAManagerAdmin contract
    * 
    * This class is used to interact with the SMAManagerAdmin contract
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
        this.abi = SMAManagerAdminABI.abi;
        this.config = config;
        this.account = account;

        if (address) {
            this.address = address;
        } else {
            this.address = SMAManagerAdminABI.addresses[network];
        }
    }

    getBaseTokens = async () => {
        const data = await readContract(
            this.config,
            {
                abi: this.abi, 
                address: this.address, 
                functionName: "getAllowedBaseTokens"
            }
        );

        return data;
    }

    getAllowedInterestTokens = async () => {
        const data = await readContract(
            this.config,
            {
                abi: this.abi, 
                address: this.address, 
                functionName: "getAllowedInterestTokens"
            }
        );

        return data;
    }
}