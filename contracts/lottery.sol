pragma solidity 0.4.25;

contract lottery{
    address public manager;
    address[] public players;
    
    constructor() public{
        manager=msg.sender;
    }
    
    function entry() public payable{
        require(msg.value > 0.01 ether);
        players.push(msg.sender);
    }
    
    function random() private view returns (uint){
        return uint(keccak256(block.difficulty,now,players));
    }
    
    function pickwinner() public payable restricted{
        uint index=random()%players.length;
        players[index].transfer(address(this).balance);
        players= new address[](0);
    }
    
    modifier restricted(){
        require(msg.sender==manager);
        _;
    }
    
    function getplayers() public view returns(address[]){
        return players;
    }
}