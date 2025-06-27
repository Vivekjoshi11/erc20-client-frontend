// import { ethers } from 'ethers';
// import abi from './abi.json';

// const CONTRACT_ADDRESS = '0xe0F577E91dfdF582a007fc7b4ea4D176EA667125'; // Update if redeployed

// export const getContract = async () => {
//   if (!window.ethereum) throw new Error('MetaMask not found');

//   const provider = new ethers.BrowserProvider(window.ethereum);
//   const signer = await provider.getSigner();
//   return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
// };



// import { ethers } from "ethers";
// import abi from "../utils/NTTToken.json";

// const CONTRACT_ADDRESS = "0x205F237cA86B67875f6A48733C8837E1fEc118a6";

// export const getContract = (providerOrSigner: ethers.Provider | ethers.Signer) => {
//   return new ethers.Contract(CONTRACT_ADDRESS, abi, providerOrSigner);
// };

import { ethers } from "ethers";
import abi from "../utils/NTTToken.json";

const CONTRACT_ADDRESS = "0x7ED1a2B26cfA7508Eea906423b29AcE574D613eE";
// const CONTRACT_ADDRESS = "0x3fb4EE3788a6C0d5F868BD8a629f8233fD3c17c1";

export const getContract = (providerOrSigner: ethers.Provider | ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, abi, providerOrSigner);
};



