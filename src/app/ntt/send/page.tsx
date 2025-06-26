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
    } catch (err) {
      console.error(err);
      setMessage("❌ Transaction failed. Make sure this wallet is a registered NTT.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">NTT Pay to User</h1>
      <ConnectWallet onConnect={setSigner} />
      <div className="grid gap-4 mt-4">
        <input
          type="text"
          placeholder="User Wallet Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Amount to send"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input"
        />
        <button onClick={handleSend} className="btn">
          Send Tokens
        </button>
        {message && <p className="text-center text-sm mt-2">{message}</p>}
      </div>
    </div>
  );
}
