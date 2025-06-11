<script>
import SMAFactoryInterface from '@/contracts/interfaces/SMAFactoryInterface.js';
import { watchContractEvent, getTransaction, getTransactionReceipt } from '@wagmi/core';
import { getAccount } from '@wagmi/core'

import { config } from '@/utils/configs/chainConfig.js'

import { ethers } from "ethers";

//v-if="!isBusy"
export default {
    props: {
        contractAddress: String,
        smaFee: String
    },
    data() {
        return {
            isBusy: false,
            clientAddress: '',
            smaFactoryAddress: this.contractAddress,
            smaFee: this.smaFee,
            txnReceipt: null,
            isDeploying: false,
            unwatch: null,
        };
    },
    methods: {
        async submitForm() {
            try {
                this.isDeploying = true;
                const account = getAccount(config);
                if (!account) {
                    console.error('Account not found');
                    return;
                }

                const smaFactoryInterface = new SMAFactoryInterface(
                    account.chain.name, account.address, config, this.smaFactoryAddress
                );

                let feeGwei = ethers.parseEther(this.smaFee);
                this.txnReceipt = await smaFactoryInterface.deploySMA(account.address, feeGwei);
                console.log(this.txnReceipt);

                // Wait for transaction confirmation
                if (this.txnReceipt) {
                    console.log("Waiting for transaction confirmation for SMA deployment");
                    
                    // Poll for transaction receipt
                    let receipt = null;
                    while (!receipt) {
                        try {
                            receipt = await getTransactionReceipt(config, {
                                hash: this.txnReceipt
                            });
                            if (receipt) {
                                console.log("Transaction receipt received:", receipt);
                                
                                console.log(ethers.id('SMACreated(address,address,uint256)'));
                                console.log(receipt.logs[0].topics[0]);

                                // Get the SMACreated event from the receipt
                                const smaCreatedEvent = receipt.logs[0].topics[0] == ethers.id('SMACreated(address,address,uint256)')
                                
                                if (smaCreatedEvent) {
                                    let rawSmaAddr = receipt.logs[0].topics[1];
                                    let smaAddr = ethers.AbiCoder.defaultAbiCoder().decode(["address"], rawSmaAddr)[0];
                                    console.log(smaAddr);
                                    let rawClientAddr = receipt.logs[0].topics[2];
                                    let clientAddr = ethers.AbiCoder.defaultAbiCoder().decode(["address"], rawClientAddr)[0];
                                    console.log(clientAddr);
                                    let rawTimestamp = receipt.logs[0].topics[3];
                                    let timestamp = ethers.AbiCoder.defaultAbiCoder().decode(["uint256"], rawTimestamp)[0];
                                    console.log(timestamp);
                                    
                                    this.$emit('sma-created', {
                                        smaAddr,
                                        clientAddr,
                                        timestamp
                                    });
                                }
                            }
                        } catch (error) {
                            console.log("Waiting for transaction receipt...");
                            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before next attempt
                        }
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                this.isDeploying = false;
            }
        },
        resetForm() {
            console.log('reset');
        },
    },
    // beforeUnmount() {
    //     // Clean up event watcher when component is destroyed
    //     if (this.unwatch) {
    //         this.unwatch();
    //     }
    // },
};

</script>

<template>
    <div class="sma-form">
        <div class="section">
            <div class="section-header">
                <div class="d-flex justify-content-between align-items-center">
                    <h3 class="mb-0">Deploy New SMA</h3>
                </div>
            </div>
            <div class="section-body">
                <form @submit.prevent="submitForm" @reset="resetForm" v-if="!isBusy">
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <p class="deploy-description">
                                    Deploy a new Separately Managed Account (SMA) with the specified fee structure.
                                </p>
                                <div class="button-group">
                                    <button 
                                        type="submit" 
                                        class="btn btn-primary"
                                        :disabled="isDeploying"
                                    >
                                        <span v-if="isDeploying" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        {{ isDeploying ? 'Deploying...' : 'Deploy SMA' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.sma-form {
    margin-top: 0;
}

.section {
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
}

.section-header {
    padding: 1rem;
    background-color: #1a365d;
    border-bottom: 1px solid var(--border-color);
    transition: background-color 0.2s ease;
}

.section-header:hover {
    background-color: #2c5282;
}

.section-body {
    padding: 1.5rem;
}

h3 {
    color: white;
    font-weight: 600;
    margin: 0;
    font-size: 1.25rem;
}

.deploy-description {
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin-bottom: 1rem;
    line-height: 1.5;
}

.button-group {
    margin-top: 1rem;
}

.btn {
    padding: 0.75rem 1.5rem;
    font-weight: 500;
}

.btn-primary {
    background-color: var(--primary-color);
    border: none;
}

.btn-primary:hover {
    background-color: var(--secondary-color);
    transform: translateY(-1px);
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.spinner-border {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    vertical-align: text-bottom;
    border: 0.2em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spinner-border .75s linear infinite;
}

@keyframes spinner-border {
    to { transform: rotate(360deg); }
}

.me-2 {
    margin-right: 0.5rem;
}
</style>