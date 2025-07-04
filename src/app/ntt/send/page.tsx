/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { getContract } from "../../lib/contract";
import { ethers } from "ethers";
import ConnectWallet from "../../components/ConnectWallet";

export default function NTTPayToUser() {
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!signer || !recipient || !amount) return;
    try {
      const contract = getContract(signer);
      const tx = await contract.nttPayToUser(
        recipient,
        ethers.parseUnits(amount, 18)
      );
      await tx.wait();
      setMessage("✅ Payment successful");
      setRecipient("");
      setAmount("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Transaction failed. Ensure the wallet is a User, not an NTT.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6">💸 NTT Pay to User</h1>

        <ConnectWallet onConnect={setSigner} />

        <div className="grid gap-4 mt-6">
          <input
            type="text"
            placeholder="User Wallet Address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="bg-zinc-800 text-white p-3 rounded border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Amount to Send"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-zinc-800 text-white p-3 rounded border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            disabled={!recipient || !amount}
            className="bg-blue-600 text-white font-semibold py-3 px-6 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            Send Tokens
          </button>

          {message && (
            <p className="text-sm mt-2 text-center text-gray-300">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
