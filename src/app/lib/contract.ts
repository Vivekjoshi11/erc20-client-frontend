
import { ethers } from "ethers";
import abi from "../utils/NTTToken.json";

const CONTRACT_ADDRESS = "0x7ED1a2B26cfA7508Eea906423b29AcE574D613eE";
// const CONTRACT_ADDRESS = "0x3fb4EE3788a6C0d5F868BD8a629f8233fD3c17c1";

export const getContract = (providerOrSigner: ethers.Provider | ethers.Signer) => {
  return new ethers.Contract(CONTRACT_ADDRESS, abi, providerOrSigner);
};



