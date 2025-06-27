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
    alert("Payment successful");
    fetchNTTs();
  };

  useEffect(() => {
    fetchNTTs();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Pay to Registered NTT</h1>
      <ConnectWallet onConnect={setSigner} />

      <div className="mt-4 space-y-4">
        <select
          className="input"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="">Select NTT</option>
          {ntts.map((ntt) => (
            <option key={ntt.address} value={ntt.address}>
              {ntt.name} ({ntt.address.slice(0, 6)}...)
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Amount to send"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input"
        />

        <button onClick={handlePay} className="btn">
          Pay NTT
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-10 mb-2">NTTs</h2>
      <div className="space-y-4">
        {ntts.map((ntt) => (
          <div key={ntt.name} className="border rounded p-4 shadow bg-black">
            <p><strong>Name:</strong> {ntt.name}</p>
            <p><strong>Wallet:</strong> {ntt.address}</p>
            <p><strong>Address:</strong> {ntt.physicalAddress}</p>
            <p><strong>Balance:</strong> {ntt.balance} CTK</p>
          </div>
        ))}
      </div>
    </div>
  );
}
