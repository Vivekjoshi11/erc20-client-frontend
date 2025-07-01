
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
interface NTT {
  address: string;
  name: string;
  physicalAddress: string;
  balance: string;
}

export default function AdminTransactionDashboard() {
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [mintedTotal, setMintedTotal] = useState<bigint>(BigInt(0));
  const [revokedTotal, setRevokedTotal] = useState<bigint>(BigInt(0));
    const [ntts, setNtts] = useState<NTT[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        setSigner(signer);

        const contract = getContract(signer);
        const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"));
        const isAdmin = await contract.hasRole(ADMIN_ROLE, address);
        setIsAdmin(isAdmin);

        if (!isAdmin) {
          setLoading(false);
          return;
        }

        const allNTTs = await contract.getAllNTTs();
        const allTxs: Tx[] = [];

        for (const ntt of allNTTs) {
          const nttTxs: Tx[] = await contract.getNTTTransactions(ntt);
          allTxs.push(...nttTxs);
        }

        const sortedTxs = allTxs.sort((a, b) => Number(b.timestamp) - Number(a.timestamp));

        let minted = BigInt(0);
        let revoked = BigInt(0);

        for (const tx of sortedTxs) {
          const type = tx.txType.toLowerCase();

          if (type === "admintontt") {
            minted += BigInt(tx.amount);
          }

          if (type === "ntttoadmin" || type === "ntttoadmin (revoke)") {
            revoked += BigInt(tx.amount);
          }
        }

        setMintedTotal(minted);
        setRevokedTotal(revoked);
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
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

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex justify-center items-center">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black text-red-500 flex items-center justify-center">
        ❌ Access Denied: You are not an Admin.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 py-10 flex justify-center">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-center">🧮 Admin Dashboard - Token and  history</h1>

        <div className="bg-zinc-900 p-6 rounded-xl mb-8 border border-zinc-700">
          <p className="mb-2"><strong>Total Tokens Minted to NTTs:</strong> {ethers.formatUnits(mintedTotal, 18)} CTK</p>
          <p><strong>Total Tokens Revoked from NTTs:</strong> {ethers.formatUnits(revokedTotal, 18)} CTK</p>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-center">📜 All NTT detail and it Transaction History</h2>

       
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
