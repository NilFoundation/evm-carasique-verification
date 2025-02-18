require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");

require('@openzeppelin/hardhat-upgrades');

require("hardhat-deploy");
require('hardhat-deploy-ethers');
require('hardhat-contract-sizer');


import './tasks/minimal_math'
import './tasks/modular-test'
import './tasks/counter'
import './tasks/call_counter'
import './tasks/delegatecall'
import './tasks/indexed_log'
import './tasks/overflow'


const DEFAULT_PRIVATE_KEY = "0x" + "0".repeat(64); // 32 bytes of zeros placeholder to pass config validation

const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;
const SEPOLIA_ALCHEMY_KEY = process.env.SEPOLIA_ALCHEMY_KEY || "";

const PRODUCTION_PRIVATE_KEY = process.env.PRODUCTION_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;
const PRODUCTION_ALCHEMY_KEY = process.env.PRODUCTION_ALCHEMY_KEY || "";

const ETHERSCAN_KEY = "ETHERSCAN_KEY"

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.18",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
            metadata:{
                appendCBOR: false
            }
        },
    },
    namedAccounts: {
        deployer: 0,
    },
    networks: {
        hardhat: {
            gas: "auto",
            mining: {
                auto: false,
                interval: 1000
            }
        },
        sepolia: {
            url: `https://eth-sepolia.g.alchemy.com/v2/${SEPOLIA_ALCHEMY_KEY}`,
            accounts: [SEPOLIA_PRIVATE_KEY]
        },
        production: {
            url: `https://eth-mainnet.g.alchemy.com/v2/${PRODUCTION_ALCHEMY_KEY}`,
            accounts: [PRODUCTION_PRIVATE_KEY]
        },
        localhost: {
            url: "http://127.0.0.1:8545",
            gas: "auto",
            mining: {
                auto: false,
                interval: 1000
            }
        }
    },
    etherscan: {
        apiKey: ETHERSCAN_KEY,
    },
    allowUnlimitedContractSize: true,
};
