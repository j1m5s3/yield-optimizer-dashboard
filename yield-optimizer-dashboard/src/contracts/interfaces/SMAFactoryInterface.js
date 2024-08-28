import { readContract, writeContract } from "@wagmi/core";

class SMAFactoryInterface {
    abi; // List of functions in the contract
    address; // Address of the contract
    config; // Configuration object (WagmiConfig)

    constructor(config) {
        this.config = config;
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