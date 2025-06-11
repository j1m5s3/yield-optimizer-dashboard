<script>
import { SMAInterface } from '@/contracts/interfaces/SMAInterface.js';
import { ERC20Interface } from '@/contracts/interfaces/ERC20Interface.js';
import { SMAFactoryInterface } from '@/contracts/interfaces/SMAFactoryInterface.js';
import { getTransactionHistory } from '@/utils/apis/DataApi.js';

import { ethers } from 'ethers';
import { getAccount, getBalance, getTransactionReceipt } from '@wagmi/core';
import { config } from '@/utils/configs/chainConfig.js';

// Add debounce utility
function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
}

export default {
    props: {
        contractAddress: String,
        allowedBaseTokens: Array,
        allowedInterestTokens: Array,
    },
    data() {
        return {
            isBusy: false,
            // Header properties
            isCopied: false,
            // Transfer section properties
            transferAssetAddress: '',
            transferAmount: 0,
            transferMaxAmount: 0,
            transferDirection: 'toClient',
            isTransferLoading: false,
            isTransferCollapsed: false,
            // Invest section properties
            investAssetAddress: '',
            fromProtocol: '',
            toProtocol: '',
            isInvestLoading: false,
            isInvestCollapsed: false,
            investError: '',
            // Active Management properties
            isActiveManagement: false,
            isActiveManagementCollapsed: false,
            isActiveManagementLoading: false,
            // Balances section properties
            isBalancesCollapsed: false,
            balances: [],
            isFetchingBalances: false,
            // Transactions section properties
            isTransactionsCollapsed: false,
            transactions: [],
            isFetchingTransactions: false,
            // Common properties
            clientAddress: '',
            smaAddress: this.contractAddress,
            allowedBaseTokens: this.allowedBaseTokens,
            allowedInterestTokens: this.allowedInterestTokens,
            txnReceipt: null,
            isFetchingBalance: false,
            // Cache for token decimals
            tokenDecimalsCache: new Map(),
        };
    },
    computed: {
        availableProtocols() {
            // Get unique protocols from allowedInterestTokens
            const protocols = new Set(this.allowedInterestTokens.map(token => token.protocol));
            return Array.from(protocols).sort();
        },
        availableToProtocols() {
            // Get protocols that are different from the selected fromProtocol
            return this.availableProtocols.filter(protocol => protocol !== this.fromProtocol);
        },
        availableInvestAssets() {
            // Get all tokens (base and interest) that have a total balance > 0
            const allTokens = [...this.allowedBaseTokens, ...this.allowedInterestTokens];
            return allTokens.filter(token => {
                const balance = this.balances.find(b => b.address === token.tokenAddress);
                return balance && (balance.smaBalance + balance.clientBalance) > 0;
            });
        },
        availableTransferAssets() {
            // Get all tokens that have a balance > 0 in either SMA or client wallet
            const allTokens = [...this.allowedBaseTokens, ...this.allowedInterestTokens];
            return allTokens.filter(token => {
                const balance = this.balances.find(b => b.address === token.tokenAddress);
                if (!balance) return false;
                
                // For transfers to client, check SMA balance
                // For transfers to SMA, check client balance
                return this.transferDirection === 'toClient' 
                    ? balance.smaBalance > 0 
                    : balance.clientBalance > 0;
            });
        },
        isBaseToken() {
            return this.allowedBaseTokens.some(token => token.tokenAddress === this.investAssetAddress);
        }
    },
    methods: {
        // Add debounced refresh methods
        debouncedRefreshBalances: debounce(function() {
            this.fetchAllBalances();
        }, 1000),

        debouncedRefreshTransactions: debounce(function() {
            this.fetchTransactions();
        }, 1000),

        // Add method to get decimals with caching
        async getTokenDecimals(tokenAddress) {
            if (this.tokenDecimalsCache.has(tokenAddress)) {
                return this.tokenDecimalsCache.get(tokenAddress);
            }

            const account = getAccount(config);
            if (!account) {
                console.error('Account not found');
                return 18; // Default to 18 decimals if account not found
            }

            const erc20Interface = new ERC20Interface(
                account.chain.name,
                account.address,
                config,
                tokenAddress
            );

            try {
                const decimals = await erc20Interface.getDecimals();
                this.tokenDecimalsCache.set(tokenAddress, decimals);
                return decimals;
            } catch (error) {
                console.error('Error fetching decimals:', error);
                return 18; // Default to 18 decimals on error
            }
        },
        async waitForTransactionConfirmation(txHash) {
            console.log("txHash: ", txHash);
            // if (!txHash) return null;
            
            let receipt = null;
            let attempts = 0;
            const maxAttempts = 60; // 1 minute timeout
            
            while (!receipt && attempts < maxAttempts) {
                try {
                    console.log(`Waiting for transaction confirmation (attempt ${attempts + 1}/${maxAttempts})...`);
                    console.log("txHash");
                    console.log(txHash);
                    receipt = await getTransactionReceipt(config, {
                        hash: txHash
                    });
                    console.log("receipt");
                    console.log(receipt);
                    if (receipt) {
                        console.log('Transaction confirmed:', receipt);
                        return receipt;
                    }
                } catch (error) {
                    console.log('Transaction not yet confirmed, retrying...');
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
                attempts++;
            }
            
            if (!receipt) {
                throw new Error('Transaction confirmation timeout');
            }
            
            return receipt;
        },
        async submitTransfer() {
            const account = getAccount(config);
            if (!account) {
                console.error('Account not found');
                return;
            }

            const smaInterface = new SMAInterface(
                account.chain.name, account.address, config, this.smaAddress
            );

            const erc20Interface = new ERC20Interface(
                account.chain.name, account.address, config, this.transferAssetAddress
            );

            let decimals = await erc20Interface.getDecimals();
            console.log('Token decimals:', decimals);
            console.log('Original transfer amount:', this.transferAmount);
            let transferAmount = ethers.parseUnits(this.transferAmount.toString(), decimals);
            console.log('Parsed transfer amount:', transferAmount.toString());

            this.isTransferLoading = true;
            try {
                if (this.transferDirection === 'toClient') {
                    console.log("transferring to client");
                    console.log(this.transferAssetAddress, transferAmount);
                    this.txnReceipt = await smaInterface.transferFromSMA(this.transferAssetAddress, transferAmount);
                } else {
                    const allowance = await erc20Interface.allowance(account.address, this.smaAddress);

                    if (allowance < transferAmount) {
                        await erc20Interface.approve(this.smaAddress, transferAmount);
                    }

                    this.txnReceipt = await smaInterface.transferFromClient(this.transferAssetAddress, transferAmount);
                }

                await this.waitForTransactionConfirmation(this.txnReceipt);
            } catch (error) {
                console.error('Error transferring:', error);
                throw error;
            } finally {
                this.isTransferLoading = false;
                this.txnReceipt = null;
                this.fetchAllBalances();
                this.fetchTransactions();
                this.resetForm();
            }
        },
        async invest(asset, fromProto, toProto) {
            console.log("invest: ", asset, fromProto, toProto);

            const account = getAccount(config);
            if (!account) {
                console.error('Account not found');
                return;
            }
            console.log(account);

            const smaInterface = new SMAInterface(
                account.chain.name, account.address, config, this.smaAddress
            );

            this.isBusy = true;
            this.txnReceipt = await smaInterface.invest(asset, fromProto, toProto);
            
            if (this.txnReceipt) {
                let receipt = null;
                while (!receipt) {
                    try{
                        receipt = await getTransactionReceipt(config, {
                            hash: this.txnReceipt
                        });
                    } catch (error) {
                        console.log("Waiting for transaction confirmation");
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                }
            }
            this.isBusy = false;
            this.txnReceipt = null;
        },
        fetchMaxBalance() {
            if (!this.transferAssetAddress) {
                console.error('No asset selected');
                return;
            }

            this.isFetchingBalance = true;
            const account = getAccount(config);
            if (!account) {
                console.error('Account not found');
                return;
            }
            console.log("fetching max balance");
            try {
                let rawTransferAmount = 0;
                console.log(this.transferDirection);
                console.log(this.transferAssetAddress);
                if (this.transferDirection === 'toClient') {
                    // If transferring to client, get SMA balance
                    for (let i = 0; i < this.balances.length; i++) {
                        console.log(this.balances[i].address);
                        console.log(this.transferAssetAddress);
                        if (this.balances[i].address == this.transferAssetAddress) {
                            this.transferMaxAmount = this.balances[i].smaBalance;
                            break;
                        }
                    }
                } else {
                    // If transferring to SMA, get wallet balance
                    for (let i = 0; i < this.balances.length; i++) {
                        if (this.balances[i].address == this.transferAssetAddress) {
                            this.transferMaxAmount = this.balances[i].clientBalance;
                            break;
                        }
                    }
                }
                this.transferAmount = this.transferMaxAmount;
            } catch (error) {
                console.error('Error fetching balance:', error);
            } finally {
                this.isFetchingBalance = false;
            }
        },
        async submitInvest() {
            if (!this.investAssetAddress || !this.fromProtocol || !this.toProtocol) {
                console.log(this.investAssetAddress, this.fromProtocol, this.toProtocol);
                console.error('Missing required fields');
                return;
            }

            // Check if the asset has a balance in the SMA
            const assetBalance = this.balances.find(b => b.address === this.investAssetAddress);
            if (!assetBalance || assetBalance.smaBalance <= 0) {
                this.investError = `Please transfer ${assetBalance?.symbol || 'the selected asset'} to your SMA before investing.`;
                return;
            }

            const account = getAccount(config);
            if (!account) {
                console.error('Account not found');
                return;
            }

            const smaInterface = new SMAInterface(
                account.chain.name, account.address, config, this.smaAddress
            );

            this.isInvestLoading = true;
            this.investError = ''; // Clear any previous errors
            try {
                console.log("investing");
                console.log(this.investAssetAddress, this.fromProtocol, this.toProtocol);
                this.txnReceipt = await smaInterface.invest(
                    this.investAssetAddress,
                    this.fromProtocol,
                    this.toProtocol
                );

                await this.waitForTransactionConfirmation(this.txnReceipt);
            } catch (error) {
                console.error('Error investing:', error);
                this.investError = 'Failed to process investment. Please try again.';
                throw error;
            } finally {
                this.isInvestLoading = false;
                this.txnReceipt = null;
            }
        },
        async toggleActiveManagement() {
            const account = getAccount(config);
            if (!account) {
                console.error('Account not found');
                return;
            }

            const smaInterface = new SMAInterface(
                account.chain.name, account.address, config, this.smaAddress
            );

            this.isActiveManagementLoading = true;
            try {
                this.txnReceipt = await smaInterface.setActiveManagement(!this.isActiveManagement);
                await this.waitForTransactionConfirmation(this.txnReceipt);
                this.isActiveManagement = !this.isActiveManagement;
            } catch (error) {
                console.error('Error toggling active management:', error);
                throw error;
            } finally {
                this.isActiveManagementLoading = false;
                this.txnReceipt = null;
            }
        },
        resetForm() {
            // Reset transfer section
            this.transferAmount = 0;
            this.transferAssetAddress = '';
            this.transferMaxAmount = 0;
            this.transferDirection = 'toClient';
            // Reset invest section
            this.investAssetAddress = '';
            this.fromProtocol = '';
            this.toProtocol = '';
            this.txnReceipt = null;
            console.log('reset');
        },
        async fetchAllBalances() {
            if (this.isFetchingBalances) return;
            
            this.isFetchingBalances = true;
            const account = getAccount(config);
            if (!account) {
                console.error('Account not found');
                return;
            }

            const smaInterface = new SMAInterface(
                account.chain.name, account.address, config, this.smaAddress
            );

            let timeCreated = await smaInterface.getTimeCreated();
            console.log("timeCreated: ", Number(timeCreated));

            let smaBalances = await smaInterface.getAssetBalances();
            console.log(smaBalances);

            try {
                const allTokens = [
                    ...this.allowedBaseTokens.map(token => ({ ...token, type: 'base' })),
                    ...this.allowedInterestTokens.map(token => ({ ...token, type: 'interest' }))
                ];

                console.log(allTokens);

                // Create a Map of token addresses to balances for O(1) lookup
                const smaBalanceMap = new Map(smaBalances.map(b => [b.tokenAddress, b.tokenBalance]));

                const balancePromises = allTokens.map(async (token) => {
                    // Get SMA balance from map, defaulting to 0 if not found
                    const smaBalance = ethers.toBigInt(smaBalanceMap.get(token.tokenAddress) || 0);
                    console.log(smaBalance, token.tokenAddress);

                    let erc20balance = await getBalance(config, {address: account.address, token: token.tokenAddress});
                    let clientBalance = erc20balance.value;
                    clientBalance = ethers.toBigInt(clientBalance);

                    // Use cached decimals
                    const decimals = await this.getTokenDecimals(token.tokenAddress);

                    console.log(token.tokenAddress, token.tokenSymbol, smaBalance, clientBalance, decimals);

                    return {
                        symbol: token.tokenSymbol,
                        address: token.tokenAddress,
                        type: token.type,
                        smaBalance: Number(ethers.formatUnits(smaBalance, decimals)),
                        rawSmaBalance: smaBalance,
                        clientBalance: Number(ethers.formatUnits(clientBalance, decimals)),
                        rawClientBalance: clientBalance,
                        decimals: decimals
                    };
                });
                this.balances = await Promise.all(balancePromises);
                console.log(this.balances);
            } catch (error) {
                console.error('Error fetching balances:', error);
            } finally {
                this.isFetchingBalances = false;
            }
        },
        async fetchTransactions() {
            if (this.isFetchingTransactions) return;
            
            this.isFetchingTransactions = true;
            const account = getAccount(config);
            if (!account) {
                console.error('Account not found');
                return;
            }

            const smaInterface = new SMAInterface(
                account.chain.name, account.address, config, this.smaAddress
            );

            try {
                let timeCreated = await smaInterface.getTimeCreated();
                console.log("timeCreated: ", Number(timeCreated));

                let response = await getTransactionHistory({
                    address: this.smaAddress,
                    timestamp: Number(timeCreated),
                    chain_id: account.chain.id
                });
                let txnHistory = response.transactions;
                console.log("txnHistory: ", txnHistory);
                
                // Map API response to transaction objects with formatted amounts
                this.transactions = await Promise.all(txnHistory.map(async tx => {
                    // Use cached decimals
                    const decimals = await this.getTokenDecimals(tx.token_address);
                    
                    return {
                        type: tx.type,
                        hash: tx.hash,
                        timestamp: Number(tx.timestamp),
                        tokenSymbol: tx.token_symbol,
                        amount: Number(ethers.formatUnits(tx.amount, decimals)),
                        from: tx.from,
                        to: tx.to,
                        tokenAddress: tx.token_address,
                        status: 'success'
                    };
                }));

                // Sort transactions by timestamp (newest first)
                this.transactions.sort((a, b) => b.timestamp - a.timestamp);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                this.isFetchingTransactions = false;
            }
        },
        getTokenSymbol(address) {
            const token = this.allowedBaseTokens.find(t => t.tokenAddress === address);
            return token ? token.tokenSymbol : 'Unknown';
        },
        formatTimestamp(timestamp) {
            return new Date(timestamp * 1000).toLocaleString();
        },
        formatAmount(amount) {
            return amount.toFixed(6);
        },
        getTransactionTypeClass(type) {
            return type === 'Transfer' ? 'badge-transfer' : 'badge-invest';
        },
        getStatusClass(status) {
            switch (status.toLowerCase()) {
                case 'success':
                    return 'badge-success';
                case 'pending':
                    return 'badge-pending';
                case 'failed':
                    return 'badge-failed';
                default:
                    return '';
            }
        },
        getExplorerUrl(hash, isAddress = false) {
            const account = getAccount(config);
            if (!account) return '#';
            
            const chainId = account.chain.id;
            const explorerUrl = config.chains.find(chain => chain.id === chainId)?.blockExplorers?.default?.url;
            console.log("explorerUrl: ", explorerUrl);
            return explorerUrl ? `${explorerUrl}/${isAddress ? 'address' : 'tx'}/${hash}` : '#';
        },
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
        formatAddress(address, full = false) {
            if (!address) return '';
            return full ? address : `${address.slice(0, 6)}...${address.slice(-4)}`;
        },
        formatHash(hash) {
            if (!hash) return '';
            return `${hash.slice(0, 8)}...${hash.slice(-4)}`;
        }
    },
    async mounted() {
        await Promise.all([
            this.fetchAllBalances(),
            this.fetchTransactions()
        ]);
    },
    watch: {
        txnReceipt: {
            handler: async function() {
                await Promise.all([
                    this.debouncedRefreshBalances(),
                    this.debouncedRefreshTransactions()
                ]);
            },
            deep: true
        },
        investAssetAddress: {
            immediate: true,
            handler(newValue) {
                if (!newValue) {
                    this.fromProtocol = '';
                    return;
                }

                // Check if it's a base token
                if (this.isBaseToken) {
                    this.fromProtocol = 'init';
                    return;
                }

                // Find the corresponding interest token and set its protocol
                const interestToken = this.allowedInterestTokens.find(
                    token => token.tokenAddress === newValue
                );
                
                if (interestToken) {
                    this.fromProtocol = interestToken.protocol;
                } else {
                    this.fromProtocol = 'init';
                }
            }
        }
    }
};

</script>

<template>
    <div class="sma-form">
        <!-- SMA Header -->
        <div class="sma-header">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h2 class="mb-2">Separately Managed Account</h2>
                    <div class="d-flex align-items-center">
                        <code class="contract-address">
                            <a 
                                :href="getExplorerUrl(smaAddress, true)" 
                                target="_blank" 
                                class="text-primary"
                                style="word-break: break-all;"
                            >
                                {{ formatAddress(smaAddress, true) }}
                            </a>
                        </code>
                        <button 
                            class="btn btn-outline-primary btn-sm ms-2 copy-button" 
                            @click="copyToClipboard(smaAddress)"
                            :title="isCopied ? 'Copied!' : 'Copy address'"
                        >
                            <i :class="['bi', isCopied ? 'bi-check-lg' : 'bi-clipboard']"></i>
                            <span class="ms-1">{{ isCopied ? 'Copied!' : 'Copy' }}</span>
                        </button>
                    </div>
                </div>
                <div class="sma-status">
                    <span class="badge badge-success">
                        <i class="bi bi-circle-fill me-1"></i>
                        Active
                    </span>
                </div>
            </div>
        </div>

        <!-- Balances Section -->
        <div class="section">
            <div class="section-header" @click="isBalancesCollapsed = !isBalancesCollapsed" style="cursor: pointer;">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <h3 class="mb-0">Balances</h3>
                        <button 
                            class="btn btn-outline-primary btn-sm ms-3 refresh-btn" 
                            @click.stop="debouncedRefreshBalances"
                            :disabled="isFetchingBalances"
                            title="Refresh balances"
                        >
                            <img 
                                src="../../../assets/bootstrap-reboot.svg" 
                                class="refresh-icon" 
                                :class="{ 'spinning': isFetchingBalances }"
                                alt="Refresh"
                            />
                        </button>
                    </div>
                    <i :class="['fas', isBalancesCollapsed ? 'fa-chevron-down' : 'fa-chevron-up']"></i>
                </div>
            </div>
            <div class="collapse" :class="{ 'show': !isBalancesCollapsed }">
                <div class="section-body">
                    <div class="table-responsive">
                        <div v-if="isFetchingBalances" class="loading-container">
                            <div class="spinner-container">
                                <img 
                                    src="../../../assets/bootstrap-reboot.svg" 
                                    class="refresh-icon spinning" 
                                    alt="Loading"
                                />
                                <span class="loading-text">Loading balances...</span>
                            </div>
                        </div>
                        <table v-else class="table">
                            <thead>
                                <tr>
                                    <th>Token</th>
                                    <th>Type</th>
                                    <th class="text-end">SMA Balance</th>
                                    <th class="text-end">Client Balance</th>
                                    <th class="text-end">Total Balance</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="balance in balances" :key="balance.address">
                                    <td>
                                        <a 
                                            :href="getExplorerUrl(balance.address, true)" 
                                            target="_blank" 
                                            class="text-primary"
                                        >
                                            {{ balance.symbol }}
                                        </a>
                                    </td>
                                    <td>
                                        <span :class="['badge', balance.type === 'base' ? 'badge-primary' : 'badge-secondary']">
                                            {{ balance.type }}
                                        </span>
                                    </td>
                                    <td class="text-end">{{ balance.smaBalance.toFixed(6) }}</td>
                                    <td class="text-end">{{ balance.clientBalance.toFixed(6) }}</td>
                                    <td class="text-end">{{ (balance.smaBalance + balance.clientBalance).toFixed(6) }}</td>
                                </tr>
                                <tr v-if="balances.length === 0">
                                    <td colspan="5" class="text-center">No balances found</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <!-- Transfer Section -->
        <div class="section">
            <div class="section-header" @click="isTransferCollapsed = !isTransferCollapsed" style="cursor: pointer;">
                <div class="d-flex justify-content-between align-items-center">
                    <h3 class="mb-0">Transfer Assets</h3>
                    <i :class="['fas', isTransferCollapsed ? 'fa-chevron-down' : 'fa-chevron-up']"></i>
                </div>
            </div>
            <div class="collapse" :class="{ 'show': !isTransferCollapsed }">
                <div class="section-body">
                    <form action="#" @submit.prevent="submitTransfer" @reset="resetForm" v-if="!isBusy">
                        <div class="row mb-4">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="transfer-direction">Transfer Direction</label>
                                    <select 
                                        class="form-control" 
                                        id="transfer-direction" 
                                        v-model="transferDirection"
                                        required
                                    >
                                        <option value="toClient">From SMA </option>
                                        <option value="fromClient">To SMA</option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="transfer-asset-select">Select Asset</label>
                                    <select 
                                        class="form-control" 
                                        id="transfer-asset-select" 
                                        v-model="transferAssetAddress"
                                        required
                                    >
                                        <option value="">Select an asset</option>
                                        <option 
                                            v-for="token in availableTransferAssets" 
                                            :key="token.tokenAddress" 
                                            :value="token.tokenAddress"
                                        >
                                            {{ token.tokenSymbol }} ({{ transferDirection === 'toClient' 
                                                ? balances.find(b => b.address === token.tokenAddress)?.smaBalance.toFixed(6) 
                                                : balances.find(b => b.address === token.tokenAddress)?.clientBalance.toFixed(6) }})
                                        </option>
                                    </select>
                                    <small class="form-text text-muted" v-if="availableTransferAssets.length === 0">
                                        No assets available for transfer
                                    </small>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="transfer-amount">Amount</label>
                                    <div class="input-group">
                                        <input 
                                            type="number" 
                                            class="form-control" 
                                            id="transfer-amount" 
                                            v-model="transferAmount"
                                            min="0"
                                            step="0.000001"
                                            required
                                        >
                                        <div class="input-group-append">
                                            <button 
                                                type="button" 
                                                class="btn btn-outline-secondary max-button" 
                                                @click="fetchMaxBalance"
                                                :disabled="!transferAssetAddress || isFetchingBalance"
                                            >
                                                Max
                                            </button>
                                        </div>
                                    </div>
                                    <small class="form-text text-muted" v-if="transferMaxAmount > 0">
                                        Maximum available: {{ transferMaxAmount }}
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="button-group">
                                    <button 
                                        type="submit" 
                                        class="btn btn-primary me-2"
                                        :disabled="isTransferLoading"
                                    >
                                        <span v-if="isTransferLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        {{ isTransferLoading ? 'Processing...' : 'Transfer' }}
                                    </button>
                                    <button 
                                        type="reset" 
                                        class="btn btn-secondary"
                                        :disabled="isTransferLoading"
                                    >
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Invest Section -->
        <div class="section">
            <div class="section-header" @click="isInvestCollapsed = !isInvestCollapsed" style="cursor: pointer;">
                <div class="d-flex justify-content-between align-items-center">
                    <h3 class="mb-0">Invest Assets</h3>
                    <i :class="['fas', isInvestCollapsed ? 'fa-chevron-down' : 'fa-chevron-up']"></i>
                </div>
            </div>
            <div class="collapse" :class="{ 'show': !isInvestCollapsed }">
                <div class="section-body">
                    <div v-if="investError" class="alert alert-warning mb-4" role="alert">
                        <i class="fas fa-exclamation-triangle me-2"></i>
                        {{ investError }}
                    </div>
                    <form action="#" @submit.prevent="submitInvest" v-if="!isBusy">
                        <div class="row mb-4">
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="invest-asset-select">Select Asset</label>
                                    <select 
                                        class="form-control" 
                                        id="invest-asset-select" 
                                        v-model="investAssetAddress"
                                        required
                                    >
                                        <option value="">Select an asset</option>
                                        <option 
                                            v-for="token in availableInvestAssets" 
                                            :key="token.tokenAddress" 
                                            :value="token.tokenAddress"
                                        >
                                            {{ token.tokenSymbol }} ({{ balances.find(b => b.address === token.tokenAddress)?.smaBalance.toFixed(6) || '0' }})
                                        </option>
                                    </select>
                                    <small class="form-text text-muted" v-if="availableInvestAssets.length === 0">
                                        No assets available for investment
                                    </small>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="from-protocol">From Protocol</label>
                                    <select 
                                        class="form-control" 
                                        id="from-protocol" 
                                        v-model="fromProtocol"
                                        required
                                        :disabled="isBaseToken"
                                    >
                                        <option value="">Select protocol</option>
                                        <option 
                                            v-for="protocol in availableProtocols" 
                                            :key="protocol" 
                                            :value="protocol"
                                        >
                                            {{ protocol }}
                                        </option>
                                    </select>
                                    <small class="form-text text-muted" v-if="isBaseToken">
                                        Base tokens don't have a source protocol
                                    </small>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-group">
                                    <label for="to-protocol">To Protocol</label>
                                    <select 
                                        class="form-control" 
                                        id="to-protocol" 
                                        v-model="toProtocol"
                                        required
                                    >
                                        <option value="">Select protocol</option>
                                        <option 
                                            v-for="protocol in availableToProtocols" 
                                            :key="protocol" 
                                            :value="protocol"
                                        >
                                            {{ protocol }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-12">
                                <div class="button-group">
                                    <button 
                                        type="submit" 
                                        class="btn btn-primary"
                                        :disabled="isInvestLoading"
                                    >
                                        <span v-if="isInvestLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        {{ isInvestLoading ? 'Processing...' : 'Invest' }}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <!-- Active Management Section -->
        <div class="section">
            <div class="section-header" @click="isActiveManagementCollapsed = !isActiveManagementCollapsed" style="cursor: pointer;">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <h3 class="mb-0">Active Management</h3>
                        <span :class="['status-indicator ms-2', isActiveManagement ? 'status-active' : 'status-inactive']"></span>
                    </div>
                    <i :class="['fas', isActiveManagementCollapsed ? 'fa-chevron-down' : 'fa-chevron-up']"></i>
                </div>
            </div>
            <div class="collapse" :class="{ 'show': !isActiveManagementCollapsed }">
                <div class="section-body">
                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <p class="management-description">
                                    When enabled, an automated bot will actively manage your assets within the SMA, optimizing yields and rebalancing positions based on market conditions.
                                </p>
                                <button 
                                    class="btn toggle-button" 
                                    :class="isActiveManagement ? 'btn-danger' : 'btn-success'"
                                    @click="toggleActiveManagement"
                                    :disabled="isActiveManagementLoading"
                                >
                                    <span v-if="isActiveManagementLoading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    {{ isActiveManagementLoading ? 'Processing...' : (isActiveManagement ? 'DISABLE' : 'ENABLE') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Transactions Section -->
        <div class="section">
            <div class="section-header" @click="isTransactionsCollapsed = !isTransactionsCollapsed" style="cursor: pointer;">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="d-flex align-items-center">
                        <h3 class="mb-0">Transaction History</h3>
                        <button 
                            class="btn btn-outline-primary btn-sm ms-3 refresh-btn" 
                            @click.stop="debouncedRefreshTransactions"
                            :disabled="isFetchingTransactions"
                            title="Refresh transactions"
                        >
                            <img 
                                src="../../../assets/bootstrap-reboot.svg" 
                                class="refresh-icon" 
                                :class="{ 'spinning': isFetchingTransactions }"
                                alt="Refresh"
                            />
                        </button>
                    </div>
                    <i :class="['fas', isTransactionsCollapsed ? 'fa-chevron-down' : 'fa-chevron-up']"></i>
                </div>
            </div>
            <div class="collapse" :class="{ 'show': !isTransactionsCollapsed }">
                <div class="section-body">
                    <div class="table-responsive">
                        <div v-if="isFetchingTransactions" class="loading-container">
                            <div class="spinner-container">
                                <img 
                                    src="../../../assets/bootstrap-reboot.svg" 
                                    class="refresh-icon spinning" 
                                    alt="Loading"
                                />
                                <span class="loading-text">Loading transactions...</span>
                            </div>
                        </div>
                        <table v-else class="table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Token</th>
                                    <th class="text-end">Amount</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Status</th>
                                    <th>Time</th>
                                    <th>Hash</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="tx in transactions" :key="tx.hash">
                                    <td>
                                        <span :class="['badge', getTransactionTypeClass(tx.type)]">
                                            {{ tx.type }}
                                        </span>
                                    </td>
                                    <td>{{ tx.tokenSymbol }}</td>
                                    <td class="text-end">{{ formatAmount(tx.amount) }}</td>
                                    <td>
                                        <a 
                                            :href="getExplorerUrl(tx.from, true)" 
                                            target="_blank" 
                                            class="text-primary"
                                        >
                                            {{ formatAddress(tx.from) }}
                                        </a>
                                    </td>
                                    <td>
                                        <a 
                                            :href="getExplorerUrl(tx.to, true)" 
                                            target="_blank" 
                                            class="text-primary"
                                        >
                                            {{ formatAddress(tx.to) }}
                                        </a>
                                    </td>
                                    <td>
                                        <span :class="['badge', getStatusClass(tx.status)]">
                                            {{ tx.status }}
                                        </span>
                                    </td>
                                    <td>{{ formatTimestamp(tx.timestamp) }}</td>
                                    <td>
                                        <a 
                                            :href="getExplorerUrl(tx.hash)" 
                                            target="_blank" 
                                            class="text-primary"
                                        >
                                            {{ formatHash(tx.hash) }}
                                        </a>
                                    </td>
                                </tr>
                                <tr v-if="transactions.length === 0">
                                    <td colspan="8" class="text-center">No transactions found</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.sma-form {
    margin-top: 0;
}

.sma-header {
    padding: 1.5rem;
    margin-bottom: 0;
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
}

.section {
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    border-top: none;
}

.section:first-of-type {
    border-top: 1px solid var(--border-color);
}

.section:last-of-type {
    border-bottom-left-radius: 1rem;
    border-bottom-right-radius: 1rem;
}

.section-header {
    padding: 1rem;
    background-color: var(--card-background);
    border-bottom: 1px solid var(--border-color);
    transition: background-color 0.2s ease;
}

.section-header:hover {
    background-color: var(--hover-color);
}

.section-body {
    padding: 1.5rem;
}

h2, h3 {
    color: var(--text-primary);
    font-weight: 600;
    margin: 0;
}

h2 {
    font-size: 1.5rem;
}

h3 {
    font-size: 1.25rem;
}

.card {
    border-radius: 0;
    margin: 0;
    border-top: none;
}

.card:first-of-type {
    border-top: 1px solid var(--border-color);
}

.card-header {
    padding: 1rem;
    margin: 0;
    border-bottom: 1px solid var(--border-color);
}

.card-body {
    padding: 1.5rem;
}

.row {
    margin: 0;
}

.form-group {
    margin-bottom: 1rem;
}

.form-group label {
    color: var(--text-primary);
    font-weight: 500;
    margin-bottom: 0.75rem;
    display: block;
}

.form-control {
    background-color: var(--card-background);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    font-size: 1rem;
    padding: 0.375rem 0.75rem;
    height: 36px;
    width: 100%;
    box-sizing: border-box;
}

.form-control:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 0.2rem rgba(52, 101, 164, 0.25);
}

select.form-control {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1em;
    padding-right: 2.5rem;
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

.btn-secondary {
    background-color: var(--border-color);
    border: none;
}

.btn-secondary:hover {
    background-color: var(--hover-color);
    transform: translateY(-1px);
}

.input-group {
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    align-items: stretch;
    width: 100%;
    box-sizing: border-box;
}

.input-group .form-control {
    position: relative;
    flex: 1 1 auto;
    width: 1%;
    min-width: 0;
    margin-bottom: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    height: 36px;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    border: 1px solid var(--border-color);
    background-color: var(--card-background);
    color: var(--text-primary);
    box-sizing: border-box;
}

.input-group-append {
    display: flex;
    margin-left: -1px;
    box-sizing: border-box;
}

.max-button {
    position: relative;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    user-select: none;
    border: 1px solid var(--border-color);
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    background-color: var(--card-background);
    color: var(--text-primary);
    min-width: 60px;
    height: 36px;
    box-sizing: border-box;
    margin: 0;
}

.max-button:hover:not(:disabled) {
    background-color: var(--hover-color);
    color: var(--text-primary);
}

.max-button:disabled {
    color: var(--text-secondary);
    background-color: var(--card-background);
    border-color: var(--border-color);
    cursor: not-allowed;
}

.form-text {
    color: var(--text-secondary);
    margin-top: 0.5rem;
    font-size: 0.875rem;
}

.btn-outline-secondary {
    color: var(--text-primary);
    border-color: var(--border-color);
    background-color: var(--card-background);
}

.btn-outline-secondary:hover {
    background-color: var(--hover-color);
    color: var(--text-primary);
}

.btn-outline-secondary:disabled {
    color: var(--text-secondary);
    background-color: var(--card-background);
    border-color: var(--border-color);
}

.form-check-input {
    width: 3em;
    height: 1.5em;
    margin-top: 0.25em;
    vertical-align: top;
    background-color: var(--card-background);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    border: 1px solid var(--border-color);
    appearance: none;
    transition: background-position .15s ease-in-out;
}

.form-check-input:checked {
    background-color: var(--primary-color);
    border-color: var(--primary-color);
}

.form-check-input:focus {
    border-color: var(--primary-color);
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(52, 101, 164, 0.25);
}

.form-check-label {
    color: var(--text-primary);
    margin-left: 0.5rem;
    font-weight: 500;
}

.mt-4 {
    margin-top: 1.5rem;
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

.card-header:hover {
    background-color: var(--hover-color);
}

.card-header h3 {
    margin: 0;
    color: var(--text-primary);
    font-weight: 600;
}

.collapse {
    transition: all 0.3s ease;
}

.fas {
    color: var(--text-primary);
    transition: transform 0.3s ease;
}

.fa-chevron-down {
    transform: rotate(0deg);
}

.fa-chevron-up {
    transform: rotate(180deg);
}

.mb-0 {
    margin-bottom: 0;
}

.table {
    color: var(--text-primary);
    margin-bottom: 0;
}

.table th {
    font-weight: 600;
    border-bottom: 2px solid var(--border-color);
    padding: 0.75rem;
}

.table td {
    padding: 0.75rem;
    border-bottom: 1px solid var(--border-color);
    vertical-align: middle;
}

.table tbody tr:last-child td {
    border-bottom: none;
}

.btn-link {
    color: var(--text-primary);
    text-decoration: none;
    padding: 0.25rem 0.5rem;
}

.btn-link:hover {
    color: var(--primary-color);
}

.btn-link:disabled {
    color: var(--text-secondary);
    cursor: not-allowed;
}

.fa-spin {
    animation: fa-spin 1s infinite linear;
}

@keyframes fa-spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

.text-end {
    text-align: right;
}

.text-center {
    text-align: center;
}

.badge {
    padding: 0.5em 0.75em;
    font-size: 0.75em;
    font-weight: 600;
    border-radius: 0.25rem;
}

.badge-transfer {
    background-color: var(--primary-color);
    color: white;
}

.badge-invest {
    background-color: var(--secondary-color);
    color: white;
}

.badge-success {
    background-color: #28a745;
    color: white;
}

.badge-pending {
    background-color: #ffc107;
    color: #212529;
}

.badge-failed {
    background-color: #dc3545;
    color: white;
}

.text-primary {
    color: var(--primary-color) !important;
    text-decoration: none;
}

.text-primary:hover {
    color: var(--secondary-color) !important;
}

.fa-external-link-alt {
    font-size: 0.875rem;
}

.mb-4 {
    margin-bottom: 1.5rem;
}

.mb-2 {
    margin-bottom: 0.5rem;
}

.ms-2 {
    margin-left: 0.5rem;
}

.me-1 {
    margin-right: 0.25rem;
}

.contract-address {
    background-color: var(--card-background);
    padding: 0.5rem 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    color: var(--text-primary);
    border: 1px solid var(--border-color);
    word-break: break-all;
    max-width: 600px;
}

.sma-status .badge {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
}

.sma-status .bi-circle-fill {
    font-size: 0.625rem;
}

.status-indicator {
    display: inline-block;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.status-active {
    background-color: #28a745;
    box-shadow: 0 0 10px rgba(40, 167, 69, 0.5);
}

.status-inactive {
    background-color: #dc3545;
    box-shadow: 0 0 10px rgba(220, 53, 69, 0.5);
}

.toggle-button {
    padding: 0.5rem 2rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: all 0.3s ease;
}

.toggle-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.toggle-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.management-description {
    color: var(--text-secondary);
    font-size: 0.875rem;
    margin-bottom: 1rem;
    line-height: 1.5;
}

.refresh-btn {
    padding: 0.25rem 0.5rem;
    min-width: 32px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.refresh-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.refresh-icon {
    width: 16px;
    height: 16px;
    transition: transform 0.3s ease;
}

.spinning {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    width: 100%;
}

.spinner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.loading-text {
    color: var(--text-secondary);
    font-size: 0.875rem;
}
</style>