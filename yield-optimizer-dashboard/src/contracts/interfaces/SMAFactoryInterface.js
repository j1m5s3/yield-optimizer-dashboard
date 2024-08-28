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
    */
   
    abi; // List of functions in the contract
    address; // Address of the contract
    config; // Configuration object (WagmiConfig)

    constructor(config, network) {
        this.config = config;
        this.abi = SMAFactoryABI.abi;
        this.address = SMAFactoryABI.addresses[network];
    }

    readSMACount = async () => {
        const data = await readContract(
            this.config,
            {
                abi: this.abi, 
                address: this.address, 
                functionName: "readSMACount"
            }
        );

        return data;
    }
}