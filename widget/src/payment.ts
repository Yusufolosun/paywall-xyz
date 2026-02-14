import { openContractCall } from '@stacks/connect';
import { StacksTestnet, StacksMainnet } from '@stacks/network';
import {
  uintCV,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
  PostConditionMode,
  AnchorMode,
} from '@stacks/transactions';

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

  return new Promise((resolve, reject) => {
    openContractCall({
      network,
      contractAddress: contractAddr,
      contractName: contractName,
      functionName: 'unlock-content',
      functionArgs: [uintCV(contentId)],
      postConditions,
      postConditionMode: PostConditionMode.Deny,
      anchorMode: AnchorMode.Any,
      onFinish: (data) => {
        resolve(data.txId);
      },
      onCancel: () => {
        reject(new Error('User cancelled transaction'));
      },
    });
  });
}


