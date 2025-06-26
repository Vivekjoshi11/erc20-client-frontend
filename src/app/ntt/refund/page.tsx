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
    } catch (err) {
      console.error(err);
      setMessage("❌ Refund failed. Are you a registered NTT?");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">NTT Refund to Admin</h1>
      <ConnectWallet onConnect={setSigner} />
      <input
        type="text"
        placeholder="Amount to refund"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="input my-4"
      />
      <button onClick={handleRefund} className="btn">
        Refund
      </button>
      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
}
