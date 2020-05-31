const path=require('path');
const fs=require('fs');
const solc=require('solc');

const lotterypath=path.resolve(__dirname,'contracts','lottery.sol');
const source=fs.readFileSync(lotterypath,'utf8');
console.log(solc.compile(source,1).contracts);
