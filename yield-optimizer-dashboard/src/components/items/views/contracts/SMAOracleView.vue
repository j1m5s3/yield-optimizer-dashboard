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
        };
    }
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
                                        <input type="text" class="form-control" id="oracle-address"
                                            v-model="oracleAddress" readonly>
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
                                                    <td>{{ protocol.tokenAddress }}</td>
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
</style>