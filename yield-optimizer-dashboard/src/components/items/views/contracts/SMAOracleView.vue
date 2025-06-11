<script>
import SMAAddressProviderInterface from '@/contracts/interfaces/SMAAddressProviderInterface';
import SMAOracleInterface from '@/contracts/interfaces/SMAOracleInterface';
import SMAManagerAdminInterface from '@/contracts/interfaces/SMAManagerAdminInterface';

import { getAccount } from '@wagmi/core'

import { config } from '@/utils/configs/chainConfig.js';

import { ethers } from "ethers";

/**
 * * SMAOracleView component
 * * This component is used to display the details of the SMA Oracle contract.
 * * * It shows the oracle address, SMA fee, and the best rate protocols.
 * * * @component
 * * @example
 * * <SMAOracleView contractAddress="0x1234567890abcdef" bestRateProtocols="0xabcdef1234567890" deployFee="0.01" />
 * * @param {String} contractAddress - The address of the SMA Oracle contract.
 * * * @param {Array} bestRateProtocols - The list of best rate protocols.
 * * * @param {String} deployFee - The deployment fee for the SMA Oracle contract.
 * * @returns {Object} - The component object.
 */

// TODO: Consider replacing best rate protocol func call with api call if no account is found
export default {
    props: {
        contractAddress: String,
        bestRateProtocols: Array,
        deployFee: String,
    },
    data() {
        return {
            oracleAddress: this.contractAddress,
            smaFee: this.deployFee,
            bestRateProtocols: this.bestRateProtocols,
            txnReceipt: null,
            isCopied: false,
        };
    },
    methods: {
        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                this.isCopied = true;
                setTimeout(() => {
                    this.isCopied = false;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        },
        getExplorerUrl(hash, isAddress = false) {
            const account = getAccount(config);
            if (!account) return '#';
            
            const chainId = account.chain.id;
            const explorerUrl = config.chains.find(chain => chain.id === chainId)?.blockExplorers?.default?.url;
            return explorerUrl ? `${explorerUrl}/${isAddress ? 'address' : 'tx'}/${hash}` : '#';
        },
        formatAddress(address) {
            if (!address) return '';
            return address;
        },
    },
};
</script>

<template>
    <div id="oracle-view">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-12">
                                    <h2>Oracle Data</h2>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="oracle-address">Oracle Address</label>
                                        <div class="d-flex align-items-center">
                                            <div class="form-control d-flex align-items-center">
                                                <a 
                                                    :href="getExplorerUrl(contractAddress, true)" 
                                                    target="_blank" 
                                                    class="text-primary text-decoration-none"
                                                    style="word-break: break-all;"
                                                >
                                                    {{ formatAddress(contractAddress) }}
                                                </a>
                                            </div>
                                            <button 
                                                class="btn btn-outline-primary btn-sm ms-2 copy-button" 
                                                @click="copyToClipboard(contractAddress)"
                                                :title="isCopied ? 'Copied!' : 'Copy address'"
                                            >
                                                <i :class="['bi', isCopied ? 'bi-check-lg' : 'bi-clipboard']"></i>
                                                <span class="ms-1">{{ isCopied ? 'Copied!' : 'Copy' }}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-4">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="sma-fee">SMA Fee (ETH)</label>
                                        <label id="ETH-units"> 
                                            <input type="text" class="form-control" id="sma-fee" v-model="smaFee" readonly>
                                        </label>                                        
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="best-rate-protocols">Best Rate Protocols</label>
                                        <table class="table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Token Symbol</th>
                                                    <th scope="col">Token Address</th>
                                                    <th scope="col">Best Rate Protocol</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="protocol in bestRateProtocols">
                                                    <td>{{ protocol.tokenSymbol }}</td>
                                                    <td>
                                                        <a 
                                                            :href="getExplorerUrl(protocol.tokenAddress, true)" 
                                                            target="_blank" 
                                                            class="text-primary"
                                                            style="word-break: break-all;"
                                                        >
                                                            {{ formatAddress(protocol.tokenAddress) }}
                                                        </a>
                                                    </td>
                                                    <td>{{ protocol.bestRateProtocol }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#oracle-view {
    color: var(--text-primary);
}

#oracle-view h2 {
    color: var(--text-primary);
    font-weight: 600;
    margin-bottom: 1.5rem;
}

#oracle-view label {
    color: var(--text-primary);
    font-weight: 500;
    margin-bottom: 0.75rem;
    display: block;
}

#oracle-view .form-control {
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    font-size: 1rem;
    padding: 0.75rem;
    margin-top: 0.5rem;
    height: 48px;
}

#oracle-view .form-control:read-only {
    background-color: var(--card-background);
    color: var(--text-primary);
}

#oracle-view .table {
    color: #000000;
    background-color: var(--card-background);
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
}

#oracle-view .table th {
    color: #ffffff;
    font-weight: 600;
    border-bottom: 2px solid var(--border-color);
    padding: 1rem;
    text-align: left;
}

#oracle-view .table td {
    color: #000000;
    border-bottom: 1px solid var(--border-color);
    padding: 1rem;
    font-size: 0.95rem;
}

#oracle-view .table tr:hover {
    background-color: var(--hover-color);
}

#oracle-view .table tr:hover td {
    color: #000000;
}

.form-group {
    margin-bottom: 2rem;
}

.copy-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
    white-space: nowrap;
    height: 48px;
    margin-top: 0.5rem;
    min-width: 100px;
}

.copy-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.copy-button:active {
    transform: translateY(0);
}

.ms-2 {
    margin-left: 0.5rem;
}

.ms-1 {
    margin-left: 0.25rem;
}
</style>