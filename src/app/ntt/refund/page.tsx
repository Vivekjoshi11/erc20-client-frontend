


"use client";

import { useState } from "react";
import { getContract } from "../../lib/contract";
import { ethers } from "ethers";
import ConnectWallet from "../../components/ConnectWallet";

export default function NTTRefundToAdmin() {
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleRefund = async () => {
    if (!signer || !amount) return;
    try {
      const contract = getContract(signer);
      const tx = await contract.nttRefundAdmin(ethers.parseUnits(amount, 18));
      await tx.wait();
      setMessage("✅ Tokens refunded to Admin");
      setAmount("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Refund failed. Are you a registered NTT?");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900 p-6 rounded-xl border border-zinc-700 shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">↩️ NTT Refund to Admin</h1>

        <ConnectWallet onConnect={setSigner} />

        <input
          type="number"
          placeholder="Amount to refund"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-zinc-800 text-white p-3 rounded border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-6"
        />

        <button
          onClick={handleRefund}
          disabled={!amount}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition disabled:opacity-50"
        >
          Refund
        </button>

        {message && (
          <p className="text-sm text-center mt-4 text-gray-300">{message}</p>
        )}
      </div>
    </div>
  );
}
