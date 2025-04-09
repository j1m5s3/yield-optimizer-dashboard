<script>
import SMAAddressProviderInterface from '@/contracts/interfaces/SMAAddressProviderInterface';
import SMAOracleInterface from '@/contracts/interfaces/SMAOracleInterface';
import SMAManagerAdminInterface from '@/contracts/interfaces/SMAManagerAdminInterface';

import { getAccount } from '@wagmi/core'

import { config } from '@/utils/configs/chainConfig.js';

import { ethers } from "ethers";

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
                    <h1>Oracle</h1>
                </div>
            </div>
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
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group
                                    ">
                                        <label for="sma-fee">SMA Fee (ETH)</label>
                                        <label id="ETH-units">
                                            ETH: 
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