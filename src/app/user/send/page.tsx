"use client";

import { useEffect, useState } from "react";
import { getContract } from "../../lib/contract";
import { ethers } from "ethers";
import ConnectWallet from "../../components/ConnectWallet";

interface NTT {
  address: string;
  name: string;
  physicalAddress: string;
  balance: string;
}

export default function UserPayToNTT() {
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [ntts, setNtts] = useState<NTT[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [amount, setAmount] = useState("");

  const fetchNTTs = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = getContract(provider);
      const addresses: string[] = await contract.getAllNTTs();
      const details = await Promise.all(
        addresses.map(async (addr: string) => {
          const [name, physical, balance] = await contract.getNTTDetails(addr);
          return {
            address: addr,
            name,
            physicalAddress: physical,
            balance: ethers.formatUnits(balance, 18),
          };
        })
      );
      setNtts(details);
    } catch (err) {
      console.error("Failed to fetch NTTs", err);
    }
  };

  const handlePay = async () => {
    if (!signer || !selected || !amount) return;
    const contract = getContract(signer);
    const tx = await contract.userPayToNTT(
      selected,
      ethers.parseUnits(amount, 18)
    );
    await tx.wait();
    alert("✅ Payment successful!");
    fetchNTTs();
  };

  useEffect(() => {
    fetchNTTs();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <div className="bg-zinc-900 w-full max-w-2xl rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">Pay to Registered NTT</h1>
        <ConnectWallet onConnect={setSigner} />

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium">Select NTT</label>
          <select
            className="w-full bg-zinc-800 border border-zinc-600 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">-- Select NTT --</option>
            {ntts.map((ntt) => (
              <option key={ntt.address} value={ntt.address}>
                {ntt.name} ({ntt.address.slice(0, 6)}...)
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium">Amount (CTK)</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-600 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handlePay}
            className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Pay NTT
          </button>
        </div>
      </div>

      <div className="w-full max-w-2xl mt-10">
        <h2 className="text-2xl font-semibold mb-4">Registered NTTs</h2>
        <div className="space-y-4">
          {ntts.map((ntt) => (
            <div
              key={ntt.address}
              className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 shadow-md"
            >
              <p><strong>Name:</strong> {ntt.name}</p>
              <p><strong>Wallet:</strong> {ntt.address}</p>
              <p><strong>Physical Address:</strong> {ntt.physicalAddress}</p>
              <p><strong>Balance:</strong> {ntt.balance} CTK</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
