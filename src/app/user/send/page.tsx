"use client";

import { useCallback, useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [roleAllowed, setRoleAllowed] = useState<boolean | null>(null); // null means "not checked yet"

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

  const checkRole = useCallback(async (signer: ethers.JsonRpcSigner) => {
    try {
      const contract = getContract(signer);
      const address = await signer.getAddress();

      const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"));
      const USER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("USER_ROLE"));
      const NTT_ROLE = ethers.keccak256(ethers.toUtf8Bytes("NTT_ROLE"));

      const isAdmin = await contract.hasRole(ADMIN_ROLE, address);
      const isUser = await contract.hasRole(USER_ROLE, address);
      const isNTT = await contract.hasRole(NTT_ROLE, address);

      if (isAdmin || isUser) {
        setRoleAllowed(true);
        fetchNTTs();
      } else if (isNTT) {
        setRoleAllowed(false);
      } else {
        setRoleAllowed(false);
      }
    } catch (err) {
      console.error("Failed to check role:", err);
      setRoleAllowed(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (signer) {
      checkRole(signer);
    }
  }, [signer, checkRole]);

  // Render logic
  if (loading || roleAllowed === null) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <div className="animate-pulse text-muted-foreground mb-4">Connecting Wallet...</div>
          <ConnectWallet onConnect={setSigner} />
        </div>
      </div>
    );
  }

  if (!roleAllowed) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="bg-card p-8 rounded-xl shadow-lg border border-border text-center">
          <div className="text-red-400 text-xl mb-2">❌ Access Denied</div>
          <p className="text-muted-foreground">Only Users or Admins can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="bg-card w-full max-w-2xl rounded-xl shadow-lg p-8 border border-border mb-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          Pay to Registered NTT
        </h1>
        <ConnectWallet onConnect={setSigner} />

        <div className="mt-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-accent mb-2">Select NTT</label>
            <select
              className="w-full bg-muted border border-border text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition"
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
          </div>

          <div>
            <label className="block text-sm font-semibold text-accent mb-2">Amount (CTK)</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-muted border border-border text-foreground p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition"
            />
          </div>

          <button
            onClick={handlePay}
            className="w-full bg-accent text-accent-foreground font-semibold px-4 py-3 rounded-xl hover:bg-accent/80 transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            Pay NTT
          </button>
        </div>
      </div>

      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-6 text-center">Registered NTTs</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ntts.map((ntt) => (
            <div
              key={ntt.address}
              className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200"
            >
              <h3 className="font-semibold text-accent mb-2">{ntt.name}</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Wallet:</span> {ntt.address.slice(0, 10)}...</p>
                <p><span className="font-medium">Physical:</span> {ntt.physicalAddress}</p>
                <p><span className="font-medium">Balance:</span> {ntt.balance} CTK</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
