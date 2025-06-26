/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { getContract } from "../../lib/contract";
import { ethers } from "ethers";

interface AggregatedTx {
  from: string;
  total: bigint;
  name: string;
}

export default function UserDashboard() {
  const [userAddress, setUserAddress] = useState("");
  const [receivedMap, setReceivedMap] = useState<AggregatedTx[]>([]);
  const [loading, setLoading] = useState(true);

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

        const received: { [from: string]: bigint } = {};

        for (const nttAddr of allNTTs) {
          const txs = await contract.getNTTTransactions(nttAddr);
          for (const tx of txs) {
            if (
              tx.txType === "nttToUser" &&
              tx.to.toLowerCase() === address.toLowerCase()
            ) {
              if (!received[nttAddr]) received[nttAddr] = BigInt(0);
              received[nttAddr] += tx.amount;
            }
          }
        }

        const aggregated: AggregatedTx[] = [];

for (const [from, total] of Object.entries(received)) {
  try {
    const [name] = await contract.getNTTDetails(from);
    aggregated.push({ from, total, name });
  } catch (err) {
    console.error(`Failed to get name for NTT: ${from}`, err);
    aggregated.push({ from, total, name: "Unknown NTT" });
  }
}


        setReceivedMap(aggregated);
      } catch (err) {
        console.error("Error loading user dashboard:", err);
      }
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🎯 User Dashboard</h2>
      {loading ? (
        <p>Loading your transaction summary...</p>
      ) : receivedMap.length === 0 ? (
        <p>No tokens received from any NTT yet.</p>
      ) : (
        <ul className="space-y-3">
          {receivedMap.map((tx, idx) => (
            <li
              key={idx}
              className="bg-black-100 p-3 rounded shadow-sm text-sm break-all"
            >
                <div>
  <strong>From NTT:</strong> {tx.name} 
</div>

              <div><strong>From NTT address:</strong> {tx.from}</div>
              <div>
                <strong>Total Received:</strong>{" "}
                {ethers.formatUnits(tx.total, 18)} CTK
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
