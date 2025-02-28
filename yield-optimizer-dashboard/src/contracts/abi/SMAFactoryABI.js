export const SMAFactoryABI = {
    "abi": [
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_smaAddressProvider",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "internalType": "address",
              "name": "_sma",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "address",
              "name": "_client",
              "type": "address"
            },
            {
              "indexed": true,
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "name": "SMACreated",
          "type": "event"
        },
        {
          "inputs": [],
          "name": "NUM_SMAS_DEPLOYED",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "name": "USER_TO_SMA_MAPPING",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_prospectiveClient",
              "type": "address"
            }
          ],
          "name": "deploySMA",
          "outputs": [],
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "_client",
              "type": "address"
            }
          ],
          "name": "getClientSMAAddress",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "getNumSMAsDeployed",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "smaAddressProvider",
          "outputs": [
            {
              "internalType": "address",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ],
    "addresses": {
        "Sepolia": "0x50D0777c4A6b9039f18ce44FE8d3090Bc2D9612C",
        "arbitrum_mainnet": "",
        "ethereum_mainnet": "",
    }
}