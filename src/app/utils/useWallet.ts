/* eslint-disable @typescript-eslint/no-unused-vars */
// hooks/useWallet.ts
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Web3Provider } from "@ethersproject/providers";

export default function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<Web3Provider | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const ethProvider = new Web3Provider(window.ethereum);
      setProvider(ethProvider);
      ethProvider.send("eth_accounts", []).then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      });
    }
  }, []);

  const connect = async () => {
    if (provider) {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    }
  };

  return { account, connect, provider };
}
