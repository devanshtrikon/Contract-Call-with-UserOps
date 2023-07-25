import { Contract, JsonRpcProvider, ethers } from 'ethers';
import { Client, Presets } from 'userop';
import config from './config.json' assert { type: 'json' };
import creds from './creds.json' assert { type: 'json' };

export const callContractMethod = async (token, abi, method, args, pKey, rpcUrl = config.rpcUrl) => {
  const provider = new JsonRpcProvider(rpcUrl);
  const contract = new Contract(token, abi, provider);

  const paymasterMiddleware = Presets.Middleware.verifyingPaymaster(config.paymaster.rpcUrl, config.paymaster.context);

  const account = await Presets.Builder.SimpleAccount.init(new ethers.Wallet(pKey), rpcUrl, {
    paymasterMiddleware,
  });

  const client = await Client.init(rpcUrl);

  const tx = await client.sendUserOperation(
    account.execute(token, 0, contract.interface.encodeFunctionData(method, args)),
    { onBuild: (op) => console.log('Signed UserOperation:', op) }
  );
  // console.log(`UserOpHash: ${tx.userOpHash}`);
  // console.log('----->', tx);

  console.log('Waiting for transaction...');
  const ev = await tx.wait();

  // console.log('Receipt: ', await ev.getTransactionReceipt());
  console.log(`Transaction hash: ${ev?.transactionHash ?? null}`);
  return ev;
};
