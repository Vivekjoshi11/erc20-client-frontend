
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
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = getContract(provider);
       
        const txList = await contract.getNTTTransactions(nttAddress);
setTxs([...txList].reverse()); 

      } catch (err) {
        console.error("Failed to fetch transaction history", err);
      }
    };

    if (nttAddress) fetchTx();
  }, [nttAddress]);

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-center">📜 NTT Transaction History</h1>

        <p className="text-sm text-gray-400 mb-6 text-center">
          Total Transactions: <span className="font-medium text-white">{txs.length}</span>
        </p>

        {txs.length === 0 ? (
          <p className="text-center text-gray-500">No transactions found.</p>
        ) : (
          <ul className="space-y-4">
            {txs.map((tx, idx) => (
              <li
                key={idx}
                className="bg-zinc-900 p-4 rounded-xl shadow border border-zinc-700"
              >
                <div className="mb-1"><strong>Type:</strong> {tx.txType}</div>
                <div className="mb-1"><strong>From:</strong> {tx.from}</div>
                <div className="mb-1"><strong>To:</strong> {tx.to}</div>
                <div className="mb-1"><strong>Amount:</strong> {ethers.formatUnits(tx.amount, 18)} CTK</div>
                <div className="mb-1"><strong>Time:</strong> {new Date(Number(tx.timestamp) * 1000).toLocaleString()}</div>
                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
