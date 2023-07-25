import { Kryptorena_ABI } from './abi-krytoarena.js';
import { callContractMethod } from './call_contract_method.js';

const token = '0x2377CD39EfBADffc0040DaebE71e3F0d7183E3Bd';

export const callKryptoarenaMethod = (method, args, pKey) =>
  callContractMethod(token, Kryptorena_ABI, method, args, pKey);

export const registerPlayer = async (name, gameToken, pKey) =>
  callKryptoarenaMethod('registerPlayer', [name, gameToken], pKey);

export const createRandomGameToken = async (name, pKey) => callKryptoarenaMethod('createRandomGameToken', [name], pKey);

export const getPlayer = async (address, pKey) => callKryptoarenaMethod('getPlayer', [address], pKey);
