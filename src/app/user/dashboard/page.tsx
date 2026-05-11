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
    <div className="min-h-screen px-4 py-10 flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            User Dashboard: History
          </h2>
          <p className="text-muted-foreground">Wallet Address: {userAddress}</p>
        </div>

        {/* 🔢 TOTAL BALANCE */}
        {!loading && txSummary.length > 0 && (
          <div className="bg-card p-6 rounded-xl shadow-lg border border-border mb-8 text-center">
            <div className="text-2xl font-semibold text-green-400">
              💰 Total Balance: {ethers.formatUnits(totalBalance, 18)} CTK
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center">
            <div className="animate-pulse text-muted-foreground">Loading transaction summary...</div>
          </div>
        ) : txSummary.length === 0 ? (
          <div className="text-center text-muted-foreground">No transactions found.</div>
        ) : (
          <div className="space-y-6">
            {txSummary.map((tx, idx) => (
              <div key={idx} className="bg-card p-6 rounded-xl shadow-lg border border-border hover:shadow-xl transition-shadow duration-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div><span className="font-semibold text-accent">NTT Name:</span> {tx.name}</div>
                  <div><span className="font-semibold text-accent">Received:</span> {ethers.formatUnits(tx.received, 18)} CTK</div>
                  <div><span className="font-semibold text-accent">Sent:</span> {ethers.formatUnits(tx.sent, 18)} CTK</div>
                </div>
                <div className="mb-4">
                  <span className="font-semibold text-accent">Net Balance:</span>
                  <span className={tx.net >= 0 ? "text-green-400" : "text-red-400"}>
                    {ethers.formatUnits(tx.net, 18)} CTK
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  <span className="font-semibold">Address:</span> {tx.ntt}
                </div>

                <details className="group">
                  <summary className="cursor-pointer text-accent hover:text-accent-foreground font-semibold list-none flex items-center gap-2">
                    <span>View Transactions ({tx.transactions.length})</span>
                    <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="mt-4 space-y-3">
                    {[...tx.transactions].reverse().map((t, i) => (
                      <div
                        key={i}
                        className="bg-muted p-4 rounded-lg border border-border"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div><strong>Type:</strong> {t.txType}</div>
                          <div><strong>Amount:</strong> {ethers.formatUnits(t.amount, 18)} CTK</div>
                          <div><strong>From:</strong> {t.from}</div>
                          <div><strong>To:</strong> {t.to}</div>
                          <div className="md:col-span-2"><strong>Time:</strong> {new Date(Number(t.timestamp) * 1000).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

