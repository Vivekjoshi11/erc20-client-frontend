// import { ethers } from "ethers";
// import abiData from "./abi.json";

// const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;

// export const getContract = () => {
//   if (typeof window === "undefined") throw new Error("Window is undefined");
//   const { ethereum } = window as any;
//   if (!ethereum) throw new Error("MetaMask not installed");
//   const provider = new ethers.providers.Web3Provider(ethereum);
//   const signer = provider.getSigner();
//   const contract = new ethers.Contract(CONTRACT_ADDRESS, abiData.abi, signer);
//   return contract;
// };


import { ethers } from "ethers";
import abiData from "./abi.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
// export const CONTRACT_ADDRESS = "0xe0F577E91dfdF582a007fc7b4ea4D176EA667125";


export const getContract = async () => {
  if (typeof window === "undefined") throw new Error("Window is undefined");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(CONTRACT_ADDRESS, abiData.abi, signer);
  return contract;
};
