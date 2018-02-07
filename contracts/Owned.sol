pragma solidity ^0.4.6;

contract Owned {
    
    address public owner;
    
    event LogNewOwner(address sender, address oldOwner, address newOwner);
    
    modifier onlyOwner { 
        if(msg.sender != owner) throw;
        _; 
    }
    
    function Owned() {
        owner = msg.sender;
    }
    
    function changeOwner(address newOwner)
        onlyOwner
        returns(bool success)
    {
        LogNewOwner(msg.sender, owner, newOwner);
        owner = newOwner;
        return true;
    }
    
}