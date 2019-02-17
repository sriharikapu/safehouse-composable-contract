

//jshint ignore: start

// contracts
const SafehouseComposable = artifacts.require("./SafehouseComposable.sol");
const SampleNFT = artifacts.require("./SampleNFT.sol");
const SampleERC20 = artifacts.require("./SampleERC20.sol");

// tools for overloaded function calls
const web3Abi = require('web3-eth-abi');
const web3Utils = require('web3-utils');

/**************************************
* Helpers
**************************************/

const logEvent = (func) => {
  const event = func({ _from: web3.eth.coinbase }, { fromBlock: 0, toBlock: 'latest' });
  event.watch(function(error, result){
    console.log('*** EVENT ***' + result.event);
    result.args.forEach((arg) => console.log(arg));
  });
}
const promisify = (inner) => new Promise((resolve, reject) =>
  inner((err, res) => {
    if (err) { reject(err) }
    resolve(res);
  })
);
const getBalance = (account, at) => promisify(cb => web3.eth.getBalance(account, at, cb));
const timeout = ms => new Promise(res => setTimeout(res, ms))
const setupTestTokens = async (numberOfNfts, numberOfERC20s) => {
  let nfts = [];
  let erc20s = [];
  let s = String(i);
  for (var i = 0; i < numberOfNfts; i++) {
    nfts.push((await SampleNFT.new(s, s)));
  }
  for (var i = 0; i < numberOfERC20s; i++) {
    erc20s.push((await SampleERC20.new(s, s)));
  }
  return [nfts, erc20s];
}
/**************************************
* Tests
**************************************/

contract('SafehouseComposable', function(accounts) {

  let composable, sampleNFT, sampleERC20, alice = accounts[0], bob = accounts[1];

  /**************************************
  * NOTE
  *
  * Transferring composables requires a bytes of bytes32 in hex
  * to specify the receiving token index in the composable
  *
  * The following creates bytes of length 32 representing 1, 2 and 3
  **************************************/
  const bytes1 = web3Utils.padLeft(web3Utils.toHex(1), 32);
  const bytes2 = web3Utils.padLeft(web3Utils.toHex(2), 32);
  const bytes3 = web3Utils.padLeft(web3Utils.toHex(3), 32);

  it('should be deployed, Composable', async () => {

    composable = await  SafehouseComposable.deployed();

    /**************************************
    * If you need event logging
    **************************************/

    // logEvent(composable.Received);
    // logEvent(composable.Added);
    // logEvent(composable.TransferChild);


    assert(composable !== undefined, 'Composable was not deployed');
  });

  it('should be deployed, SampleNFT', async () => {
    sampleNFT = await SampleNFT.deployed();
    assert(sampleNFT !== undefined, 'SampleNFT was not deployed');
  });

  it('should be deployed, SampleERC20', async () => {
    sampleERC20 = await SampleERC20.deployed();
    assert(sampleERC20 !== undefined, 'SampleERC20 was not deployed');
  });

  it('should mint a 721 token, Composable', async () => {
    const tokenId = await composable.mint.call(alice, 'https://cachethegame.com/example');
    // assert(tokenId.equals(1), 'Composable 721 token was not created or has wrong tokenId');
    const tx = await composable.mint(alice, 'https://cachethegame.com/example');
    const tx2 = await composable.mint(alice, 'https://cachethegame.com/example');

    // console.log(tx);
    const uri = await composable.tokenURI.call(1);
    console.log(uri);

    const balance = await composable.balanceOf.call(alice);
    console.log(balance);
  });
});

//jshint ignore: end
