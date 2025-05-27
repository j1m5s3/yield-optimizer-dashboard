// Write the ERC20 interface

import { ERC20ABI } from "../abi/ERC20ABI";

import { readContract, writeContract } from "@wagmi/core";

export class ERC20Interface {
    constructor(network, account, config, address=null) {
        this.config = config;
        this.abi = ERC20ABI.abi;
        this.account = account;

        if (address) {
            this.address = address;
        } else {
            this.address = ERC20ABI.addresses[network];
        }
    }

    // Get the balance of the account
    getBalance = async (address) => {
        const balance = await readContract(this.config, {
            abi: this.abi,
            address: this.address,
            functionName: "balanceOf",
            args: [address]
        });

        return balance;
    }

    getDecimals = async () => {
        let abi = [
            {
                type: 'function',
                name: 'decimals',
                stateMutability: 'view',
                inputs: [],
                outputs: [{ type: 'uint8' }],
            }
        ]

        const decimals = await readContract(this.config, {
            abi: abi,
            address: this.address,
            functionName: "decimals"
        });

        return decimals;
    }

    approve = async (spender, amount) => {
        const tx = await writeContract(this.config, {
            abi: this.abi,
            address: this.address,
            functionName: "approve",
            args: [spender, amount]
        });

        return tx;
    }

    allowance = async (owner, spender) => {
        const allowance = await readContract(this.config, {
            abi: this.abi,
            address: this.address,
            functionName: "allowance",
            args: [owner, spender]
        });

        return allowance;
    }
}

export default ERC20Interface;

