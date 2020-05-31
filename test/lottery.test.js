const assert=require('assert');
const ganache=require('ganache-cli');
const Web3=require('web3');
const web3=new Web3(ganache.provider());

const {interface,bytecode}=require('../compile');


let accounts;
let lottery;

beforeEach(async ()=>{
    accounts=await web3.eth.getAccounts();
    console.log(accounts);
    lottery= await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data:bytecode})
        .send({from:accounts[0],gas:'1000000'});
});

describe('lottery',()=>{
    it("deploys contract",()=>{
        assert.ok(lottery.options.address);
    });

    it("allows account to enter" ,async ()=>{
        await lottery.methods.entry().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });
        const players=await lottery.methods.getplayers().call({
            from:accounts[0]
        });
        assert.equal(accounts[0],players[0]);
        assert.equal(1,players.length);
    });

    it("allows more accounts to enter" ,async ()=>{
        await lottery.methods.entry().send({
            from: accounts[0],
            value: web3.utils.toWei('0.02','ether')
        });
        await lottery.methods.entry().send({
            from: accounts[1],
            value: web3.utils.toWei('0.02','ether')
        });
        await lottery.methods.entry().send({
            from: accounts[2],
            value: web3.utils.toWei('0.02','ether')
        });
        const players=await lottery.methods.getplayers().call({
            from:accounts[0]
        });
        assert.equal(accounts[0],players[0]);
        assert.equal(accounts[1],players[1]);
        assert.equal(accounts[2],players[2]);
        assert.equal(3,players.length);
    });

    it('requires min amount',async()=>{
        try{
            await lottery.methods.entry().send({
                from:accounts[0],
                value:0
            });
            assert(false);
        }catch(err){
            assert(err);
        }
    
    });

    it('only manager can call pickwinner', async ()=>{
        try{
            await lottery.methods.pickwinner().send({
                from:accounts[1]
            });
            assert(false);

        }catch(err){
            assert(err);
        }
    });

    it('winner gets the money',async ()=>{
        await lottery.methods.entry().send({
            from:accounts[0],
            value:web3.utils.toWei('2','ether')
        });
        
        const initialbal=await web3.eth.getBalance(accounts[0]);
        //console.log(initialbal);
        await lottery.methods.pickwinner().send({
            from:accounts[0]
        });

        const finalbal = await web3.eth.getBalance(accounts[0]);

        const difference=finalbal-initialbal;
        //console.log(difference)
        assert(difference>web3.utils.toWei('1.8','ether'));
    });
});