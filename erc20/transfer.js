import { Contract, JsonRpcProvider, ethers, parseUnits } from 'ethers';
import { Client, Presets } from 'userop';
import config from '../config.json' assert { type: 'json' };
import { ERC20_ABI } from '../data/abi.js';

export const transferERC20 = async (token, from, to, value, spenderKey) => {
  const provider = new JsonRpcProvider(config.rpcUrl);
  const erc20 = new Contract(token, ERC20_ABI, provider);

  const amount = parseUnits(value);
  console.log(`
    ---> Transaction will transfer ${value} ETH 
    \n\t From: ${from} 
    \n\t To: ${to}
    `);

  const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(config.paymaster.rpcUrl, config.paymaster.context);

  const account = await Presets.Builder.SimpleAccount.init(new ethers.Wallet(spenderKey), config.rpcUrl, {
    paymasterMiddleware,
  });

  const client = await Client.init(config.rpcUrl);

  const tx = await client.sendUserOperation(
    account.execute(token, 0, erc20.interface.encodeFunctionData('transferFrom', [from, to, amount])),
    { onBuild: (op) => console.log('Signed UserOperation:', op) }
  );
  console.log(`UserOpHash: ${tx.userOpHash}`);

  console.log('Waiting for transaction...');
  const ev = await tx.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
};
