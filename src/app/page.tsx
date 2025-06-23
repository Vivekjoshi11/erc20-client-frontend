/* eslint-disable react-hooks/exhaustive-deps */

"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getContract } from "./utils/contract";

// Interface for registered users to store address and balance
interface RegisteredUser {
  address: string;
  balance: string;
}

export default function Home() {
  const [account, setAccount] = useState<string>("");
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [balance, setBalance] = useState<string>("0");
  const [transferTo, setTransferTo] = useState<string>("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [totalMinted, setTotalMinted] = useState<string>("0"); // New state for total minted tokens

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } else {
      alert("MetaMask not detected");
    }
  };

  const registerUser = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.registerUser();
      await tx.wait();
      alert("Registered successfully!");
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  const mintTokens = async () => {
    try {
      const contract = await getContract();
      const amount = ethers.parseUnits("100", 18); // Mint 100 tokens
      const tx = await contract.mintToSelf(amount);
      await tx.wait();
      alert("Minted 100 tokens!");
      fetchBalance();
      fetchTotalSupply(); // Update total supply after minting
    } catch (err) {
      console.error(err);
      alert("Minting failed");
    }
  };

  const fetchBalance = async () => {
    try {
      const contract = await getContract();
      const result = await contract.getUserBalance(account);
      setBalance(ethers.formatUnits(result, 18));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const contract = await getContract();
      const addresses: string[] = await contract.getAllRegisteredUsers();
      // Fetch balance for each user
      const detailedUsers: RegisteredUser[] = await Promise.all(
        addresses.map(async (addr: string) => {
          const userBalance = await contract.getUserBalance(addr);
          return {
            address: addr,
            balance: ethers.formatUnits(userBalance, 18),
          };
        })
      );
      setRegisteredUsers(detailedUsers);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTotalSupply = async () => {
    try {
      const contract = await getContract();
      const result = await contract.totalSupply();
      setTotalMinted(ethers.formatUnits(result, 18));
    } catch (err) {
      console.error(err);
    }
  };

  const transferTokens = async () => {
    try {
      const contract = await getContract();
      const amount = ethers.parseUnits(transferAmount, 18);
      const tx = await contract.transfer(transferTo, amount);
      await tx.wait();
      alert("Transfer successful");
      fetchBalance();
      fetchUsers(); // Update user balances after transfer
    } catch (err) {
      console.error(err);
      alert("Transfer failed");
    }
  };

  const addTokenToMetaMask = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: "0xe0F577E91dfdF582a007fc7b4ea4D176EA667125", // Your token address
              symbol: "CTK",
              decimals: 18,
              image: "https://cryptologos.cc/logos/ethereum-eth-logo.png", // Optional
            },
          },
        });
      }
    } catch (error) {
      console.error("Failed to add token to MetaMask:", error);
    }
  };

  useEffect(() => {
    if (account) {
      fetchBalance();
      fetchUsers();
      fetchTotalSupply(); // Fetch total supply on account connection
    }
  }, [account]);

  return (
    <main className="p-6 font-mono bg-gray-900 min-h-screen text-white">
      <h1 className="text-xl font-bold mb-4">🚀 Client Token Dashboard</h1>

      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 px-4 py-2 rounded text-white"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="space-y-4">
          <p>
            Connected as: <span className="font-semibold">{account}</span>
          </p>
          <p>
            Your Balance: <span className="text-green-400">{balance} CTK</span>
          </p>
          <p>
            Total Tokens Minted:{" "}
            <span className="text-blue-400">{totalMinted} CTK</span>
          </p>

          <div className="space-x-2">
            <button
              onClick={registerUser}
              className="bg-yellow-500 px-4 py-2 rounded text-black"
            >
              Register
            </button>
            <button
              onClick={mintTokens}
              className="bg-green-600 px-4 py-2 rounded text-white"
            >
              Mint 100 Tokens
            </button>
            <button
              onClick={addTokenToMetaMask}
              className="bg-indigo-600 px-4 py-2 rounded text-white"
            >
              Add CTK to MetaMask
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">💸 Transfer Tokens</h2>
            <input
              type="text"
              placeholder="Recipient address"
              value={transferTo}
              onChange={(e) => setTransferTo(e.target.value)}
              className="p-2 rounded bg-gray-800 text-white mr-2"
            />
            <input
              type="text"
              placeholder="Amount"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              className="p-2 rounded bg-gray-800 text-white mr-2"
            />
            <button
              onClick={transferTokens}
              className="bg-purple-500 px-4 py-2 rounded text-white"
            >
              Transfer
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-bold">👥 Registered Users</h2>
            <ul className="list-disc ml-6">
              {registeredUsers.map((user, idx) => (
                <li key={idx}>
                  {user.address} - {user.balance} CTK
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}