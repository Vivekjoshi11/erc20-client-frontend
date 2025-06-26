import { ethers } from 'ethers';
import abi from './abi.json';

const CONTRACT_ADDRESS = '0xe0F577E91dfdF582a007fc7b4ea4D176EA667125'; // Update if redeployed

export const getContract = async () => {
  if (!window.ethereum) throw new Error('MetaMask not found');

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
};