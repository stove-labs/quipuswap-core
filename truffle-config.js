require("dotenv").config();
require("ts-node").register({
  files: true,
});

const { alice } = require("./scripts/sandbox/accounts");

module.exports = {
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  contracts_directory: "./contracts/main",
  networks: {
    development: {
      host: "http://localhost",
      port: 8732,
      network_id: "*",
      secretKey: alice.sk,
      type: "tezos",
    },
    delphinet: {
      host: "https://delphinet.smartpy.io",
      port: 443,
      network_id: "*",
      secretKey: alice.sk,
      type: "tezos",
    },
    edonet: {
      host: "https://testnet-tezos.giganode.io",
      port: 443,
      network_id: "*",
      secretKey: alice.sk,
      type: "tezos",
    },
    florence: {
      host: "https://api.tez.ie/rpc/florencenet",
      port: 443,
      network_id: "*",
      secretKey: alice.sk,
      type: "tezos",
    },
    mainnet: {
      host: "https://mainnet.smartpy.io",
      port: 443,
      network_id: "*",
      type: "tezos",
    },
    zeronet: {
      host: "https://zeronet.smartpy.io",
      port: 443,
      network_id: "*",
      type: "tezos",
    },
  },
};
