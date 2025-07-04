/* eslint-disable react-hooks/exhaustive-deps */
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

export default function RegisterNTT() {
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [name, setName] = useState("");
  const [physicalAddress, setPhysicalAddress] = useState("");
  const [wallet, setWallet] = useState("");
  const [initial, setInitial] = useState("");
  const [ntts, setNtts] = useState<NTT[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
    } catch (error) {
      console.error("Error fetching NTTs:", error);
    }
  };

  const checkAdminRole = async () => {
    if (!signer) return;
    try {
      const contract = getContract(signer);
      const address = await signer.getAddress();
      const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"));
      const hasRole = await contract.hasRole(ADMIN_ROLE, address);
      setIsAdmin(hasRole);
    } catch (err) {
      console.error("Error checking admin role:", err);
    }
  };

  const handleRegister = async () => {
    if (!signer || !isAdmin) return;
    try {
      setLoading(true);
      const contract = getContract(signer);
      const tx = await contract.registerNTT(
        name,
        physicalAddress,
        wallet,
        ethers.parseUnits(initial, 18)
      );
      await tx.wait();
      alert("✅ NTT Registered");
      setName("");
      setPhysicalAddress("");
      setWallet("");
      setInitial("");
      fetchNTTs();
    } catch (err) {
      console.error("Registration failed:", err);
      alert("❌ Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNTT = async (nttAddress: string) => {
    if (!signer || !isAdmin) return;
    if (!confirm("Are you sure you want to remove this NTT? Tokens will be returned to admin.")) return;

    try {
      setLoading(true);
      const contract = getContract(signer);
      const tx = await contract.removeNTT(nttAddress);
      await tx.wait();
      alert("✅ NTT removed successfully");
      fetchNTTs();
    } catch (err) {
      console.error("Remove failed:", err);
      alert("❌ Failed to remove NTT");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNTTs();
  }, []);

  useEffect(() => {
    if (signer) {
      checkAdminRole();
    }
  }, [signer]);

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">📋 Register NTT</h1>
        <ConnectWallet onConnect={setSigner} />

        {!isAdmin && signer && (
          <p className="text-red-500 mt-4 text-center">
            You are not authorized to register or remove NTTs.
          </p>
        )}

        {isAdmin && (
          <div className="grid grid-cols-1 gap-4 mt-6 bg-zinc-900 p-6 rounded-xl shadow-lg border border-zinc-700">
            <input
              placeholder="NTT Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-800 text-white p-2 rounded border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              placeholder="Physical Address"
              value={physicalAddress}
              onChange={(e) => setPhysicalAddress(e.target.value)}
              className="bg-zinc-800 text-white p-2 rounded border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              placeholder="Wallet Address"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="bg-zinc-800 text-white p-2 rounded border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              placeholder="Initial Tokens"
              value={initial}
              onChange={(e) => setInitial(e.target.value)}
              className="bg-zinc-800 text-white p-2 rounded border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleRegister}
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Processing..." : "Register"}
            </button>
          </div>
        )}

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-center">🏢 Registered NTTs</h2>
        <div className="space-y-6">
          {ntts.map((ntt) => (
            <div
              key={ntt.address}
              className="bg-zinc-900 p-5 rounded-xl border border-zinc-700 shadow-md"
            >
              <p><strong>Name:</strong> {ntt.name}</p>
              <p><strong>Wallet:</strong> {ntt.address}</p>
              <p><strong>Address:</strong> {ntt.physicalAddress}</p>
              <p><strong>Balance:</strong> {ntt.balance} CTK</p>
              <a
                href={`/history/${ntt.address}`}
                className="text-blue-500 underline mt-2 inline-block"
              >
                View Transaction History
              </a>
              {isAdmin && (
                <button
                  onClick={() => handleDeleteNTT(ntt.address)}
                  className="text-red-500 underline mt-2 block"
                >
                  Remove NTT
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
