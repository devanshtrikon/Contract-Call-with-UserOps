import creds from './creds.json' assert { type: 'json' };
import { createRandomGameToken, registerPlayer, getPlayer, callKryptoarenaMethod } from './kryptoarena.js';
import crypto from 'node:crypto';

const token = '0x8d97f95A4EeD5D011Ec99b204561bb282E0d137A'; // Trikon Test token

const spender = '0xA0292F9C8f62922D8B21396af9da4f2D3C8530AB'; // Spender Smart Wallet

const from = '0xAd852132451724738A94b9661466f872a817FdC4'; // Wallet with TT Balance
const to = '0xa11117731b07ACD1963DdDdcB541c365DD4DA085'; // EOA Destination

// await approveERC20(token, spender, '0.1', creds.wallet.privateKey);

// await transferERC20(token, from, to, '0.1', creds.spender.privateKey);

// const data = await getPlayer(creds.wallet.address, creds.wallet.privateKey);

// const data = await registerPlayer('TestPlayer2', 'TestToken2', pKey);

// const data = await createRandomGameToken('TestToken2', creds.wallet.privateKey);

const pKey = crypto.randomBytes(32).toString('hex');
const ev = await callKryptoarenaMethod('createBattle', ['TestPlayer'], creds.wallet.privateKey);
console.log('Data: ', ev);
console.log('Decoded: ', ev.decode(ev.data));
console.log('Receipt: ', await ev.getTransactionReceipt());
