import { Contract, JsonRpcProvider } from 'ethers';
import { Kryptorena_ABI as abi } from './kryptoarena/abi-krytoarena.js';
const token = '0x2377CD39EfBADffc0040DaebE71e3F0d7183E3Bd';

export const callReadMethod = async () => {
  const rpcUrl = 'https://api.stackup.sh/v1/node/0655424e553e067be1c0ee1c4ac793bdd268da4820c8ee29766280c91b48faa4';
  const provider = new JsonRpcProvider(rpcUrl);
  const contract = new Contract(token, abi, provider);
  const data = await contract.isPlayer('0xAd852132451724738A94b9661466f872a817FdC4');

  console.log(data);
};
