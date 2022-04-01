// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

contract Ownable {	
    // Variable that maintains
    // owner address
    address payable internal _owner;
    uint private ownerFee = 30 ether;

    // Sets the original owner of
    // contract when it is deployed
    constructor() {
        _owner = payable(msg.sender);
    }

    // Publicly exposes who is the
    // owner of this contract
    function owner() public view returns(address){
        return _owner;
    }

    function purchase_ownership() external payable {
        require(msg.value == ownerFee);
        require(msg.sender != _owner);
        _owner.transfer(msg.value);
        _owner = payable(msg.sender);
    }

    // onlyOwner modifier that validates only
    // if caller of function is contract owner,
    // otherwise not
    modifier onlyOwner(){
        require(isOwner(), "Function accessible only by the owner !!");
        _;
    }

    // function for owners to verify their ownership.
    // Returns true for owners otherwise false
    function isOwner() public view returns(bool){
        return payable(msg.sender) == _owner;
    }
}
