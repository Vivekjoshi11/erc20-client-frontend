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
        className="px-6 py-3 bg-accent hover:bg-accent/80 text-accent-foreground font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
        onClick={connect}
      >
        {address ? `Connected: ${address.slice(0, 6)}...` : "Connect Wallet"}
      </button>
    </div>
  );
}
