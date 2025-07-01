
"use client";

import { useEffect, useState } from "react";
import { getContract } from "../../lib/contract";
import { ethers } from "ethers";

interface Tx {
  txType: string;
  from: string;
  to: string;
  amount: bigint;
  timestamp: number;
}

export default function NTTTransactionHistory() {
  const [txs, setTxs] = useState<Tx[]>([]);
  const [isNTT, setIsNTT] = useState(false);
  const [nttAddress, setNttAddress] = useState("");
  const [nttName, setNttName] = useState("Unknown NTT");
  const [finalBalance, setFinalBalance] = useState<bigint>(BigInt(0));
  const [received, setReceived] = useState<bigint>(BigInt(0));
  const [sentToUsers, setSentToUsers] = useState<bigint>(BigInt(0));
  const [sentToAdmin, setSentToAdmin] = useState<bigint>(BigInt(0));
  const [revoked, setRevoked] = useState<bigint>(BigInt(0));
  const [visibleCount, setVisibleCount] = useState(2);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTx = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const wallet = await signer.getAddress();
        setNttAddress(wallet);

        const contract = getContract(signer);
        const allNTTs: string[] = await contract.getAllNTTs();

        const isValidNTT = allNTTs.map((a) => a.toLowerCase()).includes(wallet.toLowerCase());
        setIsNTT(isValidNTT);

        if (!isValidNTT) {
          setLoading(false);
          return;
        }

        const [name] = await contract.getNTTDetails(wallet);
        setNttName(name);

        const txList = await contract.getNTTTransactions(wallet);
        const reversed = [...txList].reverse();
        setTxs(reversed);

        let totalReceived = BigInt(0);
        let totalToUsers = BigInt(0);
        let totalToAdmin = BigInt(0);
        let totalRevoked = BigInt(0);

        for (const tx of reversed) {
          const from = tx.from.toLowerCase();
          const to = tx.to.toLowerCase();
          const type = tx.txType.toLowerCase();

          if ((type.includes("usertontt") || type.includes("admintontt")) && to === wallet.toLowerCase()) {
            totalReceived += BigInt(tx.amount);
          }

          if (type.includes("ntttouser") && from === wallet.toLowerCase()) {
            totalToUsers += BigInt(tx.amount);
          }

          if (type.startsWith("ntttoadmin") && from === wallet.toLowerCase()) {
            totalToAdmin += BigInt(tx.amount);

            if (type.includes("revoke")) {
              totalRevoked += BigInt(tx.amount);
            }
          }
        }

        setReceived(totalReceived);
        setSentToUsers(totalToUsers);
        setSentToAdmin(totalToAdmin);
        setRevoked(totalRevoked);

        const onChainBalance = await contract.balanceOf(wallet);
        setFinalBalance(onChainBalance);
      } catch (err) {
        console.error("Failed to fetch transaction history", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTx();
  }, []);

  const exportToCSV = () => {
    const csv = [
      ["Type", "From", "To", "Amount", "Time"],
      ...txs.map((t) => [
        t.txType,
        t.from,
        t.to,
        ethers.formatUnits(t.amount, 18),
        new Date(Number(t.timestamp) * 1000).toLocaleString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ntt_transactions_${nttAddress}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  if (!isNTT) {
    return <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">❌ Access Denied: You are not a registered NTT.</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white py-10 px-4 flex justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-4 text-center">📜 NTT Transaction History</h1>

        <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl mb-6 text-sm">
          <p><strong>NTT Name:</strong> {nttName}</p>
          <p><strong>Total Received:</strong> {ethers.formatUnits(received, 18)} CTK</p>
          <p><strong>Total Sent:</strong> {ethers.formatUnits(sentToUsers + sentToAdmin, 18)} CTK</p>
          <p className="ml-4 text-sm text-gray-400">↳ To Users: {ethers.formatUnits(sentToUsers, 18)} CTK</p>
          <p className="ml-4 text-sm text-gray-400">↳ To Admin: {ethers.formatUnits(sentToAdmin, 18)} CTK</p>
          <p className="ml-6 text-sm text-orange-400">🔁 Revoked Back to Admin: {ethers.formatUnits(revoked, 18)} CTK</p>
          <p className="text-green-400 mt-4 text-lg">
            <strong>Final Balance:</strong> {ethers.formatUnits(finalBalance, 18)} CTK
          </p>
          <button onClick={exportToCSV} className="mt-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">
            Export to CSV
          </button>
        </div>

        {txs.length === 0 ? (
          <p className="text-center text-gray-500">No transactions found.</p>
        ) : (
          <>
            <ul className="space-y-4">
              {txs.slice(0, visibleCount).map((tx, idx) => (
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

            {visibleCount < txs.length && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 5)}
                  className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
                >
                  Show More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
