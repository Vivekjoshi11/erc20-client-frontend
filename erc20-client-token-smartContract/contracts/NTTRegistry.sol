// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NTTToken is ERC20, Ownable {
    struct NTT {
        string name;
        string physicalAddress;
        address wallet;
        bool isRegistered;
    }

    struct Transaction {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
        string txType; // "userToNTT", "nttToUser", "adminToNTT", "nttToAdmin"
    }

    mapping(address => NTT) public ntts;
    mapping(address => Transaction[]) public nttTransactions;
    address[] public allNTTs;

    // Events for off-chain tracking
    event NTTRegistered(address indexed wallet, string name, string physicalAddress, uint256 initialTokens);
    event TransactionRecorded(address indexed from, address indexed to, uint256 amount, uint256 timestamp, string txType);

    constructor(address initialOwner) ERC20("ClientToken", "CTK") Ownable(initialOwner) {
        // Mint 100,000 tokens to admin
        _mint(initialOwner, 100000 * 10 ** decimals());
    }

    modifier onlyNTT() {
        require(ntts[msg.sender].isRegistered, "Only NTT can call");
        _;
    }

    function registerNTT(
        string memory name,
        string memory addr,
        address wallet,
        uint256 initialTokens
    ) external onlyOwner {
        require(!ntts[wallet].isRegistered, "Already registered");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(addr).length > 0, "Address cannot be empty");
        require(wallet != address(0), "Invalid wallet address");

        ntts[wallet] = NTT({
            name: name,
            physicalAddress: addr,
            wallet: wallet,
            isRegistered: true
        });

        allNTTs.push(wallet);
        if (initialTokens > 0) {
            _mint(wallet, initialTokens);
        }

        nttTransactions[wallet].push(Transaction({
            from: msg.sender,
            to: wallet,
            amount: initialTokens,
            timestamp: block.timestamp,
            txType: "adminToNTT"
        }));

        emit NTTRegistered(wallet, name, addr, initialTokens);
        emit TransactionRecorded(msg.sender, wallet, initialTokens, block.timestamp, "adminToNTT");
    }

    function userPayToNTT(address nttAddress, uint256 amount) external {
        require(ntts[nttAddress].isRegistered, "NTT not found");
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _transfer(msg.sender, nttAddress, amount);

        nttTransactions[nttAddress].push(Transaction({
            from: msg.sender,
            to: nttAddress,
            amount: amount,
            timestamp: block.timestamp,
            txType: "userToNTT"
        }));

        emit TransactionRecorded(msg.sender, nttAddress, amount, block.timestamp, "userToNTT");
    }

    function nttPayToUser(address to, uint256 amount) external onlyNTT {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Insufficient NTT balance");
        require(to != address(0), "Invalid recipient address");

        _transfer(msg.sender, to, amount);

        nttTransactions[msg.sender].push(Transaction({
            from: msg.sender,
            to: to,
            amount: amount,
            timestamp: block.timestamp,
            txType: "nttToUser"
        }));

        emit TransactionRecorded(msg.sender, to, amount, block.timestamp, "nttToUser");
    }

    function adminCreditNTT(address nttAddress, uint256 amount) external onlyOwner {
        require(ntts[nttAddress].isRegistered, "NTT not found");
        require(amount > 0, "Amount must be greater than zero");

        _mint(nttAddress, amount);

        nttTransactions[nttAddress].push(Transaction({
            from: msg.sender,
            to: nttAddress,
            amount: amount,
            timestamp: block.timestamp,
            txType: "adminToNTT"
        }));

        emit TransactionRecorded(msg.sender, nttAddress, amount, block.timestamp, "adminToNTT");
    }

    function nttRefundAdmin(uint256 amount) external onlyNTT {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        _transfer(msg.sender, owner(), amount);

        nttTransactions[msg.sender].push(Transaction({
            from: msg.sender,
            to: owner(),
            amount: amount,
            timestamp: block.timestamp,
            txType: "nttToAdmin"
        }));

        emit TransactionRecorded(msg.sender, owner(), amount, block.timestamp, "nttToAdmin");
    }

    function getNTTTransactions(address nttAddr) external view returns (Transaction[] memory) {
        require(ntts[nttAddr].isRegistered, "NTT not found");
        return nttTransactions[nttAddr];
    }

    function getNTTBalance(address nttAddr) external view returns (uint256) {
        require(ntts[nttAddr].isRegistered, "NTT not found");
        return balanceOf(nttAddr);
    }

    function getAllNTTs() external view returns (address[] memory) {
        return allNTTs;
    }

    function getNTTDetails(address wallet) external view returns (string memory, string memory, uint256) {
        require(ntts[wallet].isRegistered, "NTT not found");
        NTT memory ntt = ntts[wallet];
        return (ntt.name, ntt.physicalAddress, balanceOf(wallet));
    }
}