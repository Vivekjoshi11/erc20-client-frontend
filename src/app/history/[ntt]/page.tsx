/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getContract } from "../../lib/contract";
import { useParams } from "next/navigation";
import { ethers } from "ethers";

export default function NTTTransactionHistory() {
  const params = useParams();
  const nttAddress = params.ntt as string;
  const [txs, setTxs] = useState<any[]>([]);

  useEffect(() => {
    const fetchTx = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = getContract(provider);
      const txList = await contract.getNTTTransactions(nttAddress);
      setTxs(txList);
    };
    if (nttAddress) fetchTx();
  }, [nttAddress]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">NTT Transaction History</h1>
      <ul className="space-y-2">
        <p className="text-sm mb-2">Total Transactions: {txs.length}</p>
        {txs.map((tx, idx) => (
          <li key={idx} className="p-2 bg-black-100 rounded">
            <div><strong>Type:</strong> {tx.txType}</div>
            <div><strong>From:</strong> {tx.from}</div>
            <div><strong>To:</strong> {tx.to}</div>
            <div><strong>Amount:</strong> {ethers.formatUnits(tx.amount, 18)}</div>
            <div><strong>Time:</strong> {new Date(Number(tx.timestamp) * 1000).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
