export const SMAManagerAdminABI = {
    "abi": [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_admin",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "_allowedPayToken",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "_payPeriod",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_subscriptionFee",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_maxAllowedSMAS",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_smaFeeUSD",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [],
        "name": "MAX_ALLOWED_SMAS",
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
        "name": "SMAs",
        "outputs": [
          {
            "internalType": "address",
            "name": "client",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "sponsor",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "sma",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "timeCreated",
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
            "name": "_tokenAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "_tokenSymbol",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "_protocol",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "_baseToken",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "_decimals",
            "type": "uint8"
          }
        ],
        "name": "addAllowedInterestToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_tokenAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "_tokenSymbol",
            "type": "string"
          },
          {
            "internalType": "uint8",
            "name": "_decimals",
            "type": "uint8"
          }
        ],
        "name": "addAllowedToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_client",
            "type": "address"
          },
          {
            "components": [
              {
                "internalType": "address",
                "name": "client",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "sponsor",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "sma",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "timeCreated",
                "type": "uint256"
              }
            ],
            "internalType": "struct SMAStructs.SMA",
            "name": "_sma",
            "type": "tuple"
          }
        ],
        "name": "addSMA",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "admin",
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
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "allowedBaseTokens",
        "outputs": [
          {
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "tokenSymbol",
            "type": "string"
          },
          {
            "internalType": "uint8",
            "name": "decimals",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "allowedInterestTokens",
        "outputs": [
          {
            "internalType": "address",
            "name": "tokenAddress",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "tokenSymbol",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "protocol",
            "type": "string"
          },
          {
            "internalType": "address",
            "name": "baseToken",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "decimals",
            "type": "uint8"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "allowedPayToken",
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
        "name": "factoryAddress",
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
        "name": "getAllowedBaseTokens",
        "outputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "tokenSymbol",
                "type": "string"
              },
              {
                "internalType": "uint8",
                "name": "decimals",
                "type": "uint8"
              }
            ],
            "internalType": "struct SMAStructs.OperableToken[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getAllowedInterestTokens",
        "outputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "tokenAddress",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "tokenSymbol",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "protocol",
                "type": "string"
              },
              {
                "internalType": "address",
                "name": "baseToken",
                "type": "address"
              },
              {
                "internalType": "uint8",
                "name": "decimals",
                "type": "uint8"
              }
            ],
            "internalType": "struct SMAStructs.InterestTokens[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getFactoryAddress",
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
            "name": "_token",
            "type": "address"
          }
        ],
        "name": "getIsAllowedInterestToken",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_token",
            "type": "address"
          }
        ],
        "name": "getIsAllowedToken",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getMaxAllowedSMAs",
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
        "name": "getPayPeriod",
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
        "name": "getPayToken",
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
            "name": "_client",
            "type": "address"
          }
        ],
        "name": "getSMA",
        "outputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "client",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "sponsor",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "sma",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "timeCreated",
                "type": "uint256"
              }
            ],
            "internalType": "struct SMAStructs.SMA",
            "name": "",
            "type": "tuple"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "getSMAFeeUSD",
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
        "name": "getSubscriptionFee",
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
        "name": "getWalletAdmin",
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
            "name": "",
            "type": "address"
          }
        ],
        "name": "isAllowedInterestToken",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
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
        "name": "isAllowedToken",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "payPeriod",
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
            "name": "_client",
            "type": "address"
          }
        ],
        "name": "removeSMA",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_factoryAddress",
            "type": "address"
          }
        ],
        "name": "setFactoryAddress",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_tokenAddress",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "_isAllowed",
            "type": "bool"
          }
        ],
        "name": "setIsAllowedInterestToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_tokenAddress",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "_isAllowed",
            "type": "bool"
          }
        ],
        "name": "setIsAllowedToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_maxAllowed",
            "type": "uint256"
          }
        ],
        "name": "setMaxAllowedSMAs",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_payPeriod",
            "type": "uint256"
          }
        ],
        "name": "setPayPeriod",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_smaFeeUSD",
            "type": "uint256"
          }
        ],
        "name": "setSMAFeeUSD",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "_subscriptionFee",
            "type": "uint256"
          }
        ],
        "name": "setSubscriptionFee",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "_admin",
            "type": "address"
          }
        ],
        "name": "setWalletAdmin",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "smaFeeUSD",
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
        "name": "subscriptionFee",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ],
      "addresses": {
        "Sepolia": "",
        "arbitrum_mainnet": "",
        "ethereum_mainnet": "",
    }
}