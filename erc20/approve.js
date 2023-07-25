import { Contract, JsonRpcProvider, ethers, parseUnits } from 'ethers';
import { Client, Presets } from 'userop';
import config from './config.json' assert { type: 'json' };
import { ERC20_ABI } from './abi.js';

export const approveERC20 = async (token, spender, value, fromKey) => {
  const provider = new JsonRpcProvider(config.rpcUrl);
  const erc20 = new Contract(token, ERC20_ABI, provider);

  const amount = parseUnits(value);
  console.log(`---> Transaction will approve ${spender} of transfer up to ${value} ETH`);

  const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(config.paymaster.rpcUrl, config.paymaster.context);

  const account = await Presets.Builder.SimpleAccount.init(new ethers.Wallet(fromKey), config.rpcUrl, {
    paymasterMiddleware,
  });

  const client = await Client.init(config.rpcUrl);

  const tx = await client.sendUserOperation(
    account.execute(token, 0, erc20.interface.encodeFunctionData('approve', [spender, amount])),
    { onBuild: (op) => console.log('Signed UserOperation:', op) }
  );
  console.log(`UserOpHash: ${tx.userOpHash}`);

  console.log('Waiting for transaction...');
  const ev = await tx.wait();
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
};
