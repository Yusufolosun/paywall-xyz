import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  standardPrincipalCV,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
} from '@stacks/transactions';
import { StacksTestnet, StacksMainnet } from '@stacks/network';

export async function unlockContent(
  contentId: number,
  price: number,
  contractAddress: string,
  networkType: 'testnet' | 'mainnet'
): Promise<string> {
  const network = networkType === 'testnet' ? new StacksTestnet() : new StacksMainnet();
  const [contractAddr, contractName] = contractAddress.split('.');

  const priceInMicroStx = Math.floor(price * 1000000);

  const postConditions = [
    makeStandardSTXPostCondition(
      contractAddr,
      FungibleConditionCode.LessEqual,
      priceInMicroStx
    ),
  ];

  const txOptions = {
    contractAddress: contractAddr,
    contractName: contractName,
    functionName: 'unlock-content',
    functionArgs: [uintCV(contentId)],
    senderKey: '', // Will be filled by wallet
    validateWithAbi: true,
    network,
    postConditions,
    postConditionMode: PostConditionMode.Deny,
    anchorMode: AnchorMode.Any,
  };

  const transaction = await makeContractCall(txOptions);
  const txId = await broadcastTransaction(transaction, network);

  return txId;
}

