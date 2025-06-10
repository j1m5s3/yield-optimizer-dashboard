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
    * @param {string} account - Account address
    * @param {string} address - Address of the contract
    */

    constructor(network, account, config, address=null) {
        this.config = config;
        this.abi = SMAABI.abi;
        this.account = account;

        if (address) {
            this.address = address;
        } else {
            this.address = SMAABI.addresses[network];
        }
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

        return data;
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

    /*
    * Get the balance of an asset in the SMA 
    * 
    * @param {string} asset - Asset to get the balance of
    */
    getAssetBalance = async (asset) => {
        const data = await readContract(
            this.config,
            {
                abi: this.abi,
                address: this.address,
                functionName: "getAssetBalance",
                args: [asset]
            }
        );

        return data;
    }

    /**
     * Get all asset balances in the SMA
     */
    getAssetBalances = async () => {
        const data = await readContract(
            this.config,
            {
                abi: this.abi,
                address: this.address,
                functionName: "getAssetBalances",
                args: []
            }
        );

        return data;
    }

    invest = async (asset, fromProto, toProto) => {
        console.log("invest: ", asset, fromProto, toProto);
        const data = await writeContract(
            this.config,
            {
                abi: this.abi,
                address: this.address,
                functionName: "invest",
                args: [asset, fromProto, toProto]
            }
        );

        return data;
    }

    setActiveManagement = async (active) => {
        const data = await writeContract(
            this.config,
            {
                abi: this.abi,
                address: this.address,
                functionName: "setActiveManagement",
                args: [active]
            }
        );

        return data;
    }

    getTimeCreated = async () => {
        const data = await readContract(
            this.config,
            {
                abi: this.abi,
                address: this.address,
                functionName: "timeCreated",
            }
        );

        return data;
    }

}

export default SMAInterface;