/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";

export default function ConnectWallet({
  onConnect,
}: {
  onConnect: (signer: ethers.JsonRpcSigner) => void;
}) {
  const [address, setAddress] = useState<string | null>(null);

  const connect = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      setAddress(accounts[0]);
      onConnect(signer);
    } else {
      alert("MetaMask not detected");
    }
  };

  return (
    <div className="p-4">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={connect}
      >
        {address ? `Connected: ${address.slice(0, 6)}...` : "Connect Wallet"}
      </button>
    </div>
  );
}
