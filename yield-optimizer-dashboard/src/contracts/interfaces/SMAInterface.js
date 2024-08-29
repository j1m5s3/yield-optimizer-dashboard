// Local
import { SMAABI } from "../abi/SMAABI";

// External
import { readContract, writeContract } from "@wagmi/core";

export class SMAInterface {
    /*
    * SMAInterface
    *
    * Interface for the SMA contract
    * 
    * This class is used to interact with the SMA contract
    * 
    * @param {WagmiConfig} config - Configuration object
    * @param {string} network - Network name
    */

    constructor(config, network) {
        this.config = config;
        this.abi = SMAABI.abi;
        this.address = SMAABI.addresses[network];
    }

    /*
    * Transfer assets from the client to the SMA
    *
    * @param {string} asset - Asset to transfer
    * @param {number} amount - Amount to transfer
    */
    transferFromClient = async (asset, amount) => {
        const data = await writeContract(
            this.config,
            {
                abi: this.abi,
                address: this.address,
                functionName: "transferFromClient",
                args: [asset, amount]
            }
        );
    }

    /*
    * Transfer assets from the SMA to the client or manager 
    *
    * @param {string} asset - Asset to transfer
    * @param {number} amount - Amount to transfer
    */
    transferFromSMA = async (asset, amount) => {
        const data = await writeContract(
            this.config,
            {
                abi: this.abi,
                address: this.address,
                functionName: "transferFromSMA",
                args: [asset, amount]
            }
        );

        return data;
    }
}