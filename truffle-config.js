module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 1000
    }
  },
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      gas: 8000000,
      network_id: "*" // Match any network id
    }
  }
};
