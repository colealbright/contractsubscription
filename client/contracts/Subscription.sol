//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Ownable.sol";

contract Subscription is Ownable {
    uint16 private subscriptionDays;
    uint private subscriptionFee = 1 ether;
    mapping (address => uint256) public ownerToSubscription;


    constructor(uint16 _subscriptionDays) {
        subscriptionDays = _subscriptionDays;
    }

    function getSubscriptionTime() external view returns (uint256) {
        return ownerToSubscription[msg.sender];
    }

    function setSubscriptionDays(uint16 newDays) external onlyOwner {
        subscriptionDays = newDays;
    }

    function setSubscriptionFee(uint fee) external onlyOwner {
        subscriptionFee = fee;
    }

    function getSubscriptionDays() public view returns (uint16){
        return subscriptionDays;
    }

    function getSubscriptionFee() public view returns (uint){
        return subscriptionFee;
    }

    function buySubscription(uint256 currentTime) external payable {
        require(msg.value == subscriptionFee);
        _owner.transfer(msg.value);
        ownerToSubscription[msg.sender] = currentTime + (86400*uint256(subscriptionDays));
    }

    function changeSubscription(uint256 newTime) external {
        ownerToSubscription[msg.sender] = newTime;
    }

    function hasSubscription() external view returns (bool){
        return ownerToSubscription[msg.sender] >= block.timestamp;
    }
}
