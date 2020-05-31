const HDwalletprovider = require('truffle-hdwallet-provider');
const Web3= require('web3');

const {interface,bytecode}= require('./compile');

const provider=new HDwalletprovider(
    'fever shrug spatial build chapter roof person error feel unaware buyer quit',
    'https://rinkeby.infura.io/v3/2ae324fcb0d94486b6b022f559475dc7'
);

const web3=new Web3(provider);

const deploy = async () =>{
    const accounts=await web3.eth.getAccounts();
    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data:'0x'+bytecode})
        .send({from:accounts[0]});
    console.log(interface);
    console.log(result.options.address);
};

deploy();