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
        <div class="form-container">
            <div class="form-group">
                <div class="d-flex align-items-center">
                    Oracle Address
                    <a 
                        :href="getExplorerUrl(oracleAddress, true)" 
                        target="_blank" 
                        class="text-primary text-decoration-none ms-2"
                    >
                        <img 
                            src="../../../../assets/link.svg" 
                            class="link-icon" 
                            alt="External link"
                        />
                    </a>
                </div>
            </div>
            <div class="form-group">
                <div class="d-flex align-items-center mb-2">
                    <label for="sma-fee" class="mb-0">SMA Fee (ETH)</label>
                    <button 
                        class="btn btn-link btn-sm ms-2 help-btn" 
                        data-bs-toggle="tooltip" 
                        data-bs-placement="right"
                        title="The fee charged for deploying a new Separately Managed Account. This fee covers the gas costs and protocol maintenance."
                        @click.stop
                    >
                        <img 
                            src="../../../../assets/info-circle.svg" 
                            class="info-icon" 
                            alt="Info"
                        />
                    </button>
                </div>
                <label id="ETH-units"> 
                    <input type="text" class="form-control" id="sma-fee" v-model="smaFee" readonly>
                </label>                                        
            </div>
            <div class="form-group">
                <div class="d-flex align-items-center mb-2">
                    <label for="best-rate-protocols" class="mb-0">Best Rate Protocols</label>
                    <button 
                        class="btn btn-link btn-sm ms-2 help-btn" 
                        data-bs-toggle="tooltip" 
                        data-bs-placement="right"
                        title="The protocols offering the highest yields for each supported token. These rates are updated in real-time to ensure optimal returns."
                        @click.stop
                    >
                        <img 
                            src="../../../../assets/info-circle.svg" 
                            class="info-icon" 
                            alt="Info"
                        />
                    </button>
                </div>
                <div class="table-container">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Token Symbol</th>
                                <th scope="col">Best Rate Protocol</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="protocol in bestRateProtocols">
                                <td>
                                    <a 
                                        :href="getExplorerUrl(protocol.tokenAddress, true)" 
                                        target="_blank"
                                    >
                                        {{ protocol.tokenSymbol }}
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
</template>

<style scoped>
#oracle-view {
    color: var(--text-primary);
    padding: 1rem;
}

.form-container {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

#oracle-view label {
    color: var(--text-primary);
    font-weight: 500;
    margin-bottom: 0.75rem;
    display: block;
    font-size: 0.875rem;
}

#oracle-view .form-control {
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    font-size: 0.875rem;
    padding: 0.75rem;
    margin-top: 0.5rem;
    height: 42px;
}

#oracle-view .form-control:read-only {
    background-color: var(--card-background);
    color: var(--text-primary);
}

.table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0 -1rem;
    padding: 0 1rem;
    width: calc(100% + 2rem);
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
}

#oracle-view .table {
    color: var(--text-primary);
    background-color: var(--card-background);
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    font-size: 0.875rem;
    margin-top: 1rem;
    min-width: 400px;
}

#oracle-view .table th {
    color: var(--text-primary);
    font-weight: 600;
    border-bottom: 2px solid var(--border-color);
    padding: 0.75rem;
    text-align: left;
    font-size: 0.8125rem;
    white-space: nowrap;
}

#oracle-view .table th:nth-child(1) {
    width: 35%;
}

#oracle-view .table th:nth-child(2) {
    width: 65%;
}

#oracle-view .table td {
    color: var(--text-primary);
    border-bottom: 1px solid var(--border-color);
    padding: 0.75rem;
    font-size: 0.8125rem;
}

#oracle-view .table td:nth-child(1) {
    color: #000000;
}

#oracle-view .table td:nth-child(1) a {
    color: var(--primary-color);
    text-decoration: none;
}

#oracle-view .table td:nth-child(1) a:hover {
    text-decoration: underline;
}

#oracle-view .table td:nth-child(2) {
    color: #000000;
}

#oracle-view .table tr:hover {
    background-color: var(--hover-color);
}

#oracle-view .table tr:hover td {
    color: var(--text-primary);
}

#oracle-view .table tr:hover td:nth-child(1),
#oracle-view .table tr:hover td:nth-child(2) {
    color: #000000;
}

.form-group {
    margin-bottom: 1.5rem;
}

.help-btn {
    padding: 0.25rem 0.5rem;
    min-width: 32px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.help-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-icon {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
}

.link-icon {
    width: 16px;
    height: 16px;
    opacity: 1;
    filter: invert(32%) sepia(98%) saturate(1234%) hue-rotate(202deg) brightness(97%) contrast(101%);
}

@media (max-width: 768px) {
    .form-container,
    .table-container {
        max-width: 600px;
    }

    #oracle-view label {
        font-size: 0.8125rem;
    }

    #oracle-view .form-control {
        font-size: 0.8125rem;
        height: 38px;
        padding: 0.625rem;
    }

    #oracle-view .table {
        font-size: 0.8125rem;
    }

    #oracle-view .table th {
        font-size: 0.75rem;
        padding: 0.625rem;
    }

    #oracle-view .table td {
        font-size: 0.75rem;
        padding: 0.625rem;
    }
}

@media (max-width: 480px) {
    .form-container,
    .table-container {
        max-width: 100%;
    }

    #oracle-view label {
        font-size: 0.75rem;
    }

    #oracle-view .form-control {
        font-size: 0.75rem;
        height: 36px;
        padding: 0.5rem;
    }

    #oracle-view .table {
        font-size: 0.75rem;
    }

    #oracle-view .table th {
        font-size: 0.6875rem;
        padding: 0.5rem;
    }

    #oracle-view .table td {
        font-size: 0.6875rem;
        padding: 0.5rem;
    }
}
</style>