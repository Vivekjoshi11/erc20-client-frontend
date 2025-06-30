/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useEffect, useState } from "react";
// import { getContract } from "../../lib/contract";
// import { ethers } from "ethers";

// export default function AdminCreditPage() {
//   const [ntts, setNtts] = useState<string[]>([]);
//   const [selected, setSelected] = useState("");
//   const [amount, setAmount] = useState("");
//   const [status, setStatus] = useState("");
//   const [isAdmin, setIsAdmin] = useState(false);

//   // useEffect(() => {
//   //   const init = async () => {
//   //     const provider = new ethers.BrowserProvider(window.ethereum);
//   //     const signer = await provider.getSigner();
//   //     const contract = getContract(signer);
//   //     const owner = await contract.owner();
//   //     const userAddress = await signer.getAddress();
//   //     setIsAdmin(userAddress.toLowerCase() === owner.toLowerCase());

//   //     const all = await contract.getAllNTTs();
//   //     setNtts(all);
//   //   };
//   //   init();
//   // }, []);

//   useEffect(() => {
//   const init = async () => {
//     const provider = new ethers.BrowserProvider(window.ethereum);
//     const signer = await provider.getSigner();
//     const contract = getContract(signer);

//     const userAddress = await signer.getAddress();

//     const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"));
//     const isAdmin = await contract.hasRole(ADMIN_ROLE, userAddress);
//     setIsAdmin(isAdmin);

//     const all = await contract.getAllNTTs();
//     setNtts(all);
//   };
//   init();
// }, []);

//   const credit = async () => {
//     try {
//       if (!selected || !amount) return;
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const contract = getContract(signer);
//       const tx = await contract.adminCreditNTT(selected, ethers.parseUnits(amount, 18));
//       await tx.wait();
//       setStatus("✅ Tokens credited successfully.");
//     } catch (err: any) {
//       console.error(err);
//       setStatus("❌ Error: " + (err.reason || err.message));
//     }
//   };

//   if (!isAdmin) {
//     return <div className="p-6 text-red-500">You must be the admin to access this page.</div>;
//   }

//   return (
//     <div className="p-6 max-w-md mx-auto ">
//       <h2 className="text-xl font-bold mb-4">Admin: Credit Tokens to NTT</h2>
//       <label className="block mb-2">Select NTT Address:</label>
//       <select
//         className="w-full border p-2 rounded mb-4"
//         onChange={(e) => setSelected(e.target.value)}
//         value={selected}
//       >
//         <option value="">-- Select NTT --</option>
//         {ntts.map((addr) => (
//           <option key={addr} value={addr}>
//             {addr}
//           </option>
//         ))}
//       </select>

//       <label className="block mb-2">Amount (CTK):</label>
//       <input
//         type="number"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//         className="w-full border p-2 rounded mb-4"
//         placeholder="Enter amount"
//       />

//       <button
//         onClick={credit}
//         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//       >
//         Credit Tokens
//       </button>

//       {status && <p className="mt-4 text-sm">{status}</p>}
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { getContract } from "../../lib/contract";
import { ethers } from "ethers";

export default function AdminCreditPage() {
  const [ntts, setNtts] = useState<string[]>([]);
  const [selected, setSelected] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const init = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      const userAddress = await signer.getAddress();
      const ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("ADMIN_ROLE"));
      const isAdmin = await contract.hasRole(ADMIN_ROLE, userAddress);
      setIsAdmin(isAdmin);

      const all = await contract.getAllNTTs();
      setNtts(all);
    };
    init();
  }, []);

  const credit = async () => {
    try {
      if (!selected || !amount) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      const tx = await contract.adminCreditNTT(
        selected,
        ethers.parseUnits(amount, 18)
      );
      await tx.wait();
      setStatus("✅ Tokens credited successfully.");
    } catch (err: any) {
      console.error(err);
      setStatus("❌ Error: " + (err.reason || err.message));
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex justify-center items-center h-screen text-red-400 text-lg font-semibold">
        You must be the admin to access this page.
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white px-4">
      <div className="bg-zinc-900 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin: Credit Tokens</h2>

        <label className="block mb-2 text-sm font-medium">Select NTT Address:</label>
        <select
          className="w-full bg-zinc-800 text-white border border-zinc-600 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setSelected(e.target.value)}
          value={selected}
        >
          <option value="">-- Select NTT --</option>
          {ntts.map((addr) => (
            <option key={addr} value={addr}>
              {addr}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-sm font-medium">Amount (CTK):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-zinc-800 text-white border border-zinc-600 p-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter amount"
        />

        <button
          onClick={credit}
          className="w-full bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Credit Tokens
        </button>

        {status && <p className="mt-4 text-sm text-center">{status}</p>}
      </div>
    </div>
  );
}
