// "use client";

// import { useEffect, useState } from "react";
// import { getContract } from "../../lib/contract";
// import { ethers } from "ethers";
// import ConnectWallet from "../../components/ConnectWallet";

// interface NTT {
//   address: string;
//   name: string;
//   physicalAddress: string;
//   balance: string;
// }

// export default function RegisterNTT() {
//   const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
//   const [name, setName] = useState("");
//   const [physicalAddress, setPhysicalAddress] = useState("");
//   const [wallet, setWallet] = useState("");
//   const [initial, setInitial] = useState("");
//   const [ntts, setNtts] = useState<NTT[]>([]);

//   const fetchNTTs = async () => {
//     try {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const contract = getContract(provider);
//       const addresses: string[] = await contract.getAllNTTs();
//       const details = await Promise.all(
//         addresses.map(async (addr: string) => {
//           const [name, physical, balance] = await contract.getNTTDetails(addr);
//           return {
//             address: addr,
//             name,
//             physicalAddress: physical,
//             balance: ethers.formatUnits(balance, 18),
//           };
//         })
//       );
//       setNtts(details);
//     } catch (error) {
//       console.error("Error fetching NTTs:", error);
//     }
//   };

//   const handleRegister = async () => {
//     if (!signer) return;
//     const contract = getContract(signer);
//     const tx = await contract.registerNTT(
//       name,
//       physicalAddress,
//       wallet,
//       ethers.parseUnits(initial, 18)
//     );
//     await tx.wait();
//     alert("NTT Registered");
//     fetchNTTs();
//   };

//   useEffect(() => {
//     fetchNTTs();
//   }, []);

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Register NTT</h1>
//       <ConnectWallet onConnect={setSigner} />
//       <div className="grid grid-cols-1 gap-4 mt-4">
//         <input
//           placeholder="NTT Name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="input"
//         />
//         <input
//           placeholder="Physical Address"
//           value={physicalAddress}
//           onChange={(e) => setPhysicalAddress(e.target.value)}
//           className="input"
//         />
//         <input
//           placeholder="Wallet Address"
//           value={wallet}
//           onChange={(e) => setWallet(e.target.value)}
//           className="input"
//         />
//         <input
//           placeholder="Initial Tokens"
//           value={initial}
//           onChange={(e) => setInitial(e.target.value)}
//           className="input"
//         />
//         <button onClick={handleRegister} className="btn mt-2">
//           Register
//         </button>
//       </div>

//       <h2 className="text-xl font-semibold mt-10 mb-2">Registered NTTs</h2>
//       <div className="space-y-4">
//         {ntts.map((ntt) => (
//           <div
//             key={ntt.address}
//             className="border rounded p-4 shadow bg-black"
//           >
//             <p><strong>Name:</strong> {ntt.name}</p>
//             <p><strong>Wallet:</strong> {ntt.address}</p>
//             <p><strong>Address:</strong> {ntt.physicalAddress}</p>
//             <p><strong>Balance:</strong> {ntt.balance} CTK</p>
//             <a
//               href={`/history/${ntt.address}`}
//               className="text-blue-600 underline mt-1 inline-block"
//             >
//               View Transaction History
//             </a>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


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

  const handleRegister = async () => {
    if (!signer) return;
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
      alert("NTT Registered");
      setName("");
      setPhysicalAddress("");
      setWallet("");
      setInitial("");
      fetchNTTs();
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNTT = async (nttAddress: string) => {
    if (!signer) return;
    if (!confirm("Are you sure you want to remove this NTT? Tokens will be returned to admin.")) return;

    try {
      setLoading(true);
      const contract = getContract(signer);
      const tx = await contract.removeNTT(nttAddress);
      await tx.wait();
      alert("NTT removed successfully");
      fetchNTTs();
    } catch (err) {
      console.error("Remove failed:", err);
      alert("Failed to remove NTT");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNTTs();
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register NTT</h1>
      <ConnectWallet onConnect={setSigner} />
      <div className="grid grid-cols-1 gap-4 mt-4">
        <input
          placeholder="NTT Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
        <input
          placeholder="Physical Address"
          value={physicalAddress}
          onChange={(e) => setPhysicalAddress(e.target.value)}
          className="input"
        />
        <input
          placeholder="Wallet Address"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          className="input"
        />
        <input
          placeholder="Initial Tokens"
          value={initial}
          onChange={(e) => setInitial(e.target.value)}
          className="input"
        />
        <button
          onClick={handleRegister}
          className="btn mt-2"
          disabled={loading}
        >
          {loading ? "Processing..." : "Register"}
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-10 mb-2">Registered NTTs</h2>
      <div className="space-y-4">
        {ntts.map((ntt) => (
          <div
            key={ntt.address}
            className="border rounded p-4 shadow bg-black"
          >
            <p><strong>Name:</strong> {ntt.name}</p>
            <p><strong>Wallet:</strong> {ntt.address}</p>
            <p><strong>Address:</strong> {ntt.physicalAddress}</p>
            <p><strong>Balance:</strong> {ntt.balance} CTK</p>
            <a
              href={`/history/${ntt.address}`}
              className="text-blue-600 underline mt-1 inline-block"
            >
              View Transaction History
            </a>
            <button
              onClick={() => handleDeleteNTT(ntt.address)}
              className="mt-2 text-red-500 underline"
            >
              Remove NTT
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
