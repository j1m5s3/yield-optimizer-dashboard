// Write the ERC20 interface

import { ERC20ABI } from "../abi/ERC20ABI";

import { readContract, writeContract } from "@wagmi/core";
import contractCache from '@/utils/cache/ContractCache';

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

    // Get the balance of the account with caching
    getBalance = async (address) => {
        const cacheKey = contractCache.generateKey(this.address, 'balanceOf', [address]);
        const cachedValue = contractCache.get(cacheKey);
        
        if (cachedValue) {
            return cachedValue;
        }

        const balance = await readContract(this.config, {
            abi: this.abi,
            address: this.address,
            functionName: "balanceOf",
            args: [address]
        });

        contractCache.set(cacheKey, balance);
        return balance;
    }

    // Get decimals with caching
    getDecimals = async () => {
        const cacheKey = contractCache.generateKey(this.address, 'decimals');
        const cachedValue = contractCache.get(cacheKey);
        
        if (cachedValue) {
            return cachedValue;
        }

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

        contractCache.set(cacheKey, decimals);
        return decimals;
    }

    // Write operations don't use cache
    approve = async (spender, amount) => {
        const tx = await writeContract(this.config, {
            abi: this.abi,
            address: this.address,
            functionName: "approve",
            args: [spender, amount]
        });

        // Clear cache after write operation
        contractCache.clear();
        return tx;
    }

    // Get allowance with caching
    allowance = async (owner, spender) => {
        const cacheKey = contractCache.generateKey(this.address, 'allowance', [owner, spender]);
        const cachedValue = contractCache.get(cacheKey);
        
        if (cachedValue) {
            return cachedValue;
        }

        const allowance = await readContract(this.config, {
            abi: this.abi,
            address: this.address,
            functionName: "allowance",
            args: [owner, spender]
        });

        contractCache.set(cacheKey, allowance);
        return allowance;
    }
}

export default ERC20Interface;

