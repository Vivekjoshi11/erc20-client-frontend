// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import { useEffect, useState } from "react";
// import { getContract } from "../../lib/contract";
// import { ethers } from "ethers";

// interface AggregatedTx {
//   from: string;
//   total: bigint;
//   name: string;
// }

// export default function UserDashboard() {
//   const [userAddress, setUserAddress] = useState("");
//   const [receivedMap, setReceivedMap] = useState<AggregatedTx[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       setLoading(true);
//       try {
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         const signer = await provider.getSigner();
//         const address = await signer.getAddress();
//         setUserAddress(address);

//         const contract = getContract(provider);
//         const allNTTs: string[] = await contract.getAllNTTs();

//         const received: { [from: string]: bigint } = {};

//         for (const nttAddr of allNTTs) {
//           const txs = await contract.getNTTTransactions(nttAddr);
//           for (const tx of txs) {
//             if (
//               tx.txType === "nttToUser" &&
//               tx.to.toLowerCase() === address.toLowerCase()
//             ) {
//               if (!received[nttAddr]) received[nttAddr] = BigInt(0);
//               received[nttAddr] += tx.amount;
//             }
//           }
//         }

//         const aggregated: AggregatedTx[] = [];

// for (const [from, total] of Object.entries(received)) {
//   try {
//     const [name] = await contract.getNTTDetails(from);
//     aggregated.push({ from, total, name });
//   } catch (err) {
//     console.error(`Failed to get name for NTT: ${from}`, err);
//     aggregated.push({ from, total, name: "Unknown NTT" });
//   }
// }


//         setReceivedMap(aggregated);
//       } catch (err) {
//         console.error("Error loading user dashboard:", err);
//       }
//       setLoading(false);
//     };

//     load();
//   }, []);

//   return (
//     <div className="p-6 max-w-2xl mx-auto">
//       <h2 className="text-xl font-bold mb-4">🎯 User Dashboard</h2>
//       {loading ? (
//         <p>Loading your transaction summary...</p>
//       ) : receivedMap.length === 0 ? (
//         <p>No tokens received from any NTT yet.</p>
//       ) : (
//         <ul className="space-y-3">
//           {receivedMap.map((tx, idx) => (
//             <li
//               key={idx}
//               className="bg-black-100 p-3 rounded shadow-sm text-sm break-all"
//             >
//                 <div>
//   <strong>From NTT:</strong> {tx.name} 
// </div>

//               <div><strong>From NTT address:</strong> {tx.from}</div>
//               <div>
//                 <strong>Total Received:</strong>{" "}
//                 {ethers.formatUnits(tx.total, 18)} CTK
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { getContract } from "../../lib/contract";
import { ethers } from "ethers";

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

        for (const nttAddr of allNTTs) {
          const txs = await contract.getNTTTransactions(nttAddr);
          let received = 0n;
          let sent = 0n;
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
            try {
              const [name] = await contract.getNTTDetails(nttAddr);
              summary.push({
                ntt: nttAddr,
                name,
                received,
                sent,
                net: received - sent,
                transactions: filtered,
              });
            } catch (e) {
              summary.push({
                ntt: nttAddr,
                name: "Unknown NTT",
                received,
                sent,
                net: received - sent,
                transactions: filtered,
              });
            }
          }
        }

        setTxSummary(summary);
      } catch (err) {
        console.error("Error loading user dashboard:", err);
      }
      setLoading(false);
    };

    load();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🎯 User Dashboard</h2>
      {loading ? (
        <p>Loading your transaction summary...</p>
      ) : txSummary.length === 0 ? (
        <p>No transactions found with any NTT yet.</p>
      ) : (
        <ul className="space-y-4">
          {txSummary.map((tx, idx) => (
            <li key={idx} className="bg-black-100 p-4 rounded shadow-sm text-sm">
              <div><strong>NTT Name:</strong> {tx.name}</div>
              <div><strong>NTT Address:</strong> {tx.ntt}</div>
              <div><strong>Total Received:</strong> {ethers.formatUnits(tx.received, 18)} CTK</div>
              <div><strong>Total Sent:</strong> {ethers.formatUnits(tx.sent, 18)} CTK</div>
              <div><strong>Net Balance:</strong> {ethers.formatUnits(tx.net, 18)} CTK</div>
              <details className="mt-2">
                <summary className="cursor-pointer">View Transactions ({tx.transactions.length})</summary>
                <ul className="mt-2 space-y-2">
                  {tx.transactions.map((t, i) => (
                    <li key={i} className="border rounded p-2">
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
  );
}
