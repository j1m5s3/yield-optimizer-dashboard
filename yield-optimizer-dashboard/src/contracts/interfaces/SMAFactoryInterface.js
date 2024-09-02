// Local
import { SMAFactoryABI } from "../abi/SMAFactoryABI";

// External
import { readContract, writeContract } from "@wagmi/core";

class SMAFactoryInterface {
    /*
    * SMAFactoryInterface
    * 
    * Interface for the SMAFactory contract
    * 
    * This class is used to interact with the SMAFactory contract
    * 
    * @param {WagmiConfig} config - Configuration object
    * @param {string} network - Network name
    */
   
    abi; // List of functions in the contract
    address; // Address of the contract
    config; // Configuration object (wagmiConfig)
    account; // Account address

    constructor(network, account,config) {
        this.abi = SMAFactoryABI.abi;
        this.address = SMAFactoryABI.addresses[network];
        this.config = config;
        this.account = account;
    }

    // Get the maximum number of SMAs allowed
    getMaxAllowedSMA = async () => {
        const data = await readContract(
            this.config,
            {
                abi: this.abi, 
                address: this.address, 
                functionName: "getMaxAllowedSMA"
            }
        );

        return data;
    }

    // Get the address of the SMA contract for a given client
    getClientSMAAddress = async (clientAddress) => {
        const data = await readContract(
            this.config,
            {
                abi: this.abi, 
                address: this.address, 
                functionName: "getClientSMAAddress",
                args: [clientAddress]
            }
        );

        return data;
    }

    // Deploy an SMA contract for a given client
    deploySMA = async (prospectiveClientAddress) => {
        const data = await writeContract(
            this.config,
            {
                abi: this.abi, 
                address: this.address, 
                functionName: "deploySMA",
                args: [prospectiveClientAddress],
                account: this.account
            }
        );

        return data;
    }
}

export default SMAFactoryInterface;