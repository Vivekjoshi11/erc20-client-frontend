// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RegisteredERC20 is ERC20, Ownable {
    mapping(address => bool) public isRegistered;
    address[] public registeredUsers;

    constructor(address initialOwner) ERC20("ClientToken", "CTK") Ownable(initialOwner) {}

    // ✅ Anyone can register themselves
    function registerUser() external {
        require(!isRegistered[msg.sender], "Already registered");
        isRegistered[msg.sender] = true;
        registeredUsers.push(msg.sender);
    }

    // ✅ Anyone can mint tokens to themselves (limit per call)
    function mintToSelf(uint256 amount) external {
        require(isRegistered[msg.sender], "Register first");
        require(amount <= 1000 * 10 ** decimals(), "Mint limit per call exceeded");
        _mint(msg.sender, amount);
    }

    // ✅ Allow sending only to registered users
    function transfer(address to, uint256 amount) public override returns (bool) {
        require(isRegistered[to], "Recipient not registered");
        return super.transfer(to, amount);
    }

    function getAllRegisteredUsers() external view returns (address[] memory) {
        return registeredUsers;
    }

    function getUserBalance(address user) external view returns (uint256) {
        return balanceOf(user);
    }
}
