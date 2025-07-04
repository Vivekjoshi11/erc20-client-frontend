/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getContract } from "../../lib/contract";
import { ethers } from "ethers";

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

interface AggregatedTx {
  ntt: string;
  name: string;
  received: bigint;
  sent: bigint;
  net: bigint;
  transactions: any[];
}


export default function UserDashboard() {
  const [userAddress, setUserAddress] = useState("");
  const [txSummary, setTxSummary] = useState<AggregatedTx[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalBalance, setTotalBalance] = useState<bigint>(BigInt(0)); // NEW STATE

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setUserAddress(address);

        const contract = getContract(provider);
        const allNTTs: string[] = await contract.getAllNTTs();

        const summary: AggregatedTx[] = [];
        let total = BigInt(0); // NEW ACCUMULATOR

        for (const nttAddr of allNTTs) {
          const txs = await contract.getNTTTransactions(nttAddr);
          let received = BigInt(0);
          let sent = BigInt(0);
          const filtered: any[] = [];

          for (const tx of txs) {
            const from = tx.from.toLowerCase();
            const to = tx.to.toLowerCase();
            const user = address.toLowerCase();
            const type = tx.txType;

            const isUserToNTT = type === "userToNTT" && from === user && to === nttAddr.toLowerCase();
            const isNTTToUser = type === "nttToUser" && to === user && from === nttAddr.toLowerCase();

            if (isUserToNTT || isNTTToUser) {
              if (isUserToNTT) sent += BigInt(tx.amount);
              if (isNTTToUser) received += BigInt(tx.amount);
              filtered.push(tx);
            }
          }

          if (filtered.length > 0) {
            const net = received - sent;
            total += net; // ACCUMULATE USER BALANCE

            try {
              const [name] = await contract.getNTTDetails(nttAddr);
              summary.push({ ntt: nttAddr, name, received, sent, net, transactions: filtered });
            } catch {
              summary.push({ ntt: nttAddr, name: "Unknown NTT", received, sent, net, transactions: filtered });
            }
          }
        }

        setTxSummary(summary);
        setTotalBalance(total); // SET TOTAL BALANCE
      } catch (err) {
        console.error("Error loading user dashboard:", err);
      }
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl">
        {/* <h2 className="text-3xl font-bold mb-6 text-center">User Dashboard: History</h2> */}
        <h2 className="text-3xl font-bold text-center mb-1">User Dashboard: History</h2>
<p className="text-center text-zinc-400 mb-6">User Wallet address: {userAddress}</p>


        {/* 🔢 TOTAL BALANCE */}
        {!loading && txSummary.length > 0 && (
          <div className="text-center text-lg font-semibold mb-6 text-green-400">
            💰 Total Balance Across All NTTs: {ethers.formatUnits(totalBalance, 18)} CTK
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-400">Loading your transaction summary...</p>
        ) : txSummary.length === 0 ? (
          <p className="text-center text-gray-400">No transactions found with any NTT yet.</p>
        ) : (
          <ul className="space-y-6">
            {txSummary.map((tx, idx) => (
              <li key={idx} className="bg-zinc-900 p-6 rounded-xl shadow-md text-sm border border-zinc-700">
                <div className="mb-2"><span className="font-medium">NTT Name:</span> {tx.name}</div>
                <div className="mb-2"><span className="font-medium">NTT Address:</span> {tx.ntt}</div>
                <div className="mb-2"><span className="font-medium">Total Received:</span> {ethers.formatUnits(tx.received, 18)} CTK</div>
                <div className="mb-2"><span className="font-medium">Total Sent:</span> {ethers.formatUnits(tx.sent, 18)} CTK</div>
                <div className="mb-2"><span className="font-medium">Net Balance:</span> {ethers.formatUnits(tx.net, 18)} CTK</div>

                <details className="mt-4">
                  <summary className="cursor-pointer text-blue-400 hover:underline">
                    View Transactions ({tx.transactions.length})
                  </summary>
                  <ul className="mt-3 space-y-3">
                    {[...tx.transactions].reverse().map((t, i) => (
                      <li
                        key={i}
                        className="bg-zinc-800 p-3 rounded-lg border border-zinc-700"
                      >
                        <div><strong>Type:</strong> {t.txType}</div>
                        <div><strong>From:</strong> {t.from}</div>
                        <div><strong>To:</strong> {t.to}</div>
                        <div><strong>Amount:</strong> {ethers.formatUnits(t.amount, 18)} CTK</div>
                        <div><strong>Time:</strong> {new Date(Number(t.timestamp) * 1000).toLocaleString()}</div>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

