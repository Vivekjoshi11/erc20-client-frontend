// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract NTTToken is ERC20, AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant NTT_ROLE = keccak256("NTT_ROLE");

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
    mapping(address => mapping(address => Transaction[])) public userToNTTTransactions;

    address[] public allNTTs;
    address public mainAdmin;

    event NTTRegistered(address indexed wallet, string name, string physicalAddress, uint256 initialTokens);
    event TransactionRecorded(address indexed from, address indexed to, uint256 amount, uint256 timestamp, string txType);

    constructor(address initialAdmin) ERC20("ClientToken", "CTK") {
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(ADMIN_ROLE, initialAdmin);
        mainAdmin = initialAdmin;
        _mint(initialAdmin, 100000 * 10 ** decimals());
    }

    modifier onlyNTT() {
        require(hasRole(NTT_ROLE, msg.sender), "Only NTT can call");
        _;
    }

    function registerNTT(string memory name, string memory addr, address wallet, uint256 initialTokens) external onlyRole(ADMIN_ROLE) {
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
        _grantRole(NTT_ROLE, wallet);

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

        Transaction memory txRecord = Transaction({
            from: msg.sender,
            to: nttAddress,
            amount: amount,
            timestamp: block.timestamp,
            txType: "userToNTT"
        });

        nttTransactions[nttAddress].push(txRecord);
        userToNTTTransactions[msg.sender][nttAddress].push(txRecord);

        emit TransactionRecorded(msg.sender, nttAddress, amount, block.timestamp, "userToNTT");
    }

    function nttPayToUser(address to, uint256 amount) external onlyNTT {
        require(amount > 0, "Amount must be greater than zero");
        require(balanceOf(msg.sender) >= amount, "Insufficient NTT balance");
        require(to != address(0), "Invalid recipient address");
        require(!ntts[to].isRegistered, "Cannot send to another NTT");

        _transfer(msg.sender, to, amount);

        Transaction memory txRecord = Transaction({
            from: msg.sender,
            to: to,
            amount: amount,
            timestamp: block.timestamp,
            txType: "nttToUser"
        });

        nttTransactions[msg.sender].push(txRecord);
        userToNTTTransactions[to][msg.sender].push(txRecord);

        emit TransactionRecorded(msg.sender, to, amount, block.timestamp, "nttToUser");
    }

    function adminCreditNTT(address nttAddress, uint256 amount) external onlyRole(ADMIN_ROLE) {
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

        _transfer(msg.sender, mainAdmin, amount);

        nttTransactions[msg.sender].push(Transaction({
            from: msg.sender,
            to: mainAdmin,
            amount: amount,
            timestamp: block.timestamp,
            txType: "nttToAdmin"
        }));

        emit TransactionRecorded(msg.sender, mainAdmin, amount, block.timestamp, "nttToAdmin");
    }

    function removeNTT(address wallet) external onlyRole(ADMIN_ROLE) {
        require(ntts[wallet].isRegistered, "NTT not found");

        uint256 balance = balanceOf(wallet);
        if (balance > 0) {
            _transfer(wallet, mainAdmin, balance);

            nttTransactions[wallet].push(Transaction({
                from: wallet,
                to: mainAdmin,
                amount: balance,
                timestamp: block.timestamp,
                txType: "nttToAdmin (revoke)"
            }));

            emit TransactionRecorded(wallet, mainAdmin, balance, block.timestamp, "nttToAdmin (revoke)");
        }

        _revokeRole(NTT_ROLE, wallet);
        delete ntts[wallet];

        for (uint256 i = 0; i < allNTTs.length; i++) {
            if (allNTTs[i] == wallet) {
                allNTTs[i] = allNTTs[allNTTs.length - 1];
                allNTTs.pop();
                break;
            }
        }
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

    function getUserToNTTTransactions(address user, address ntt) external view returns (Transaction[] memory) {
        return userToNTTTransactions[user][ntt];
    }

    function getUserNetBalanceWithNTT(address user, address ntt) external view returns (int256) {
        Transaction[] memory txs = userToNTTTransactions[user][ntt];
        int256 net = 0;

        for (uint256 i = 0; i < txs.length; i++) {
            if (txs[i].from == user) {
                net -= int256(txs[i].amount);
            } else if (txs[i].to == user) {
                net += int256(txs[i].amount);
            }
        }

        return net;
    }
}
