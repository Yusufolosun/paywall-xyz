interface TransactionVerification {
  verified: boolean;
  txId: string;
  contentId: number;
  creatorAddress: string;
  userAddress: string;
  price: number;
}

export async function verifyStacksTransaction(
  txId: string,
  network: string
): Promise<TransactionVerification> {
  const baseUrl = network === 'testnet'
    ? 'https://api.testnet.hiro.so'
    : 'https://api.hiro.so';

  const response = await fetch(`${baseUrl}/extended/v1/tx/${txId}`);
  
  if (!response.ok) {
    throw new Error('Transaction not found');
  }

  const tx = await response.json();

  if (tx.tx_status !== 'success') {
    return {
      verified: false,
      txId,
      contentId: 0,
      creatorAddress: '',
      userAddress: '',
      price: 0,
    };
  }

  if (tx.tx_type !== 'contract_call') {
    throw new Error('Invalid transaction type');
  }

  const functionName = tx.contract_call?.function_name;
  if (functionName !== 'unlock-content') {
    throw new Error('Invalid contract function');
  }

  const contentId = parseInt(tx.contract_call.function_args[0].repr.replace('u', ''));
  const userAddress = tx.sender_address;
  
  const eventResponse = await fetch(`${baseUrl}/extended/v1/tx/${txId}/events`);
  const events = await eventResponse.json();
  
  let price = 0;
  let creatorAddress = '';

  for (const event of events.events) {
    if (event.event_type === 'stx_transfer_event') {
      price += parseInt(event.stx_transfer_event.amount);
      if (event.stx_transfer_event.recipient !== tx.contract_call.contract_id.split('.')[0]) {
        creatorAddress = event.stx_transfer_event.recipient;
      }
    }
  }

  return {
    verified: true,
    txId,
    contentId,
    creatorAddress,
    userAddress,
    price,
  };
}
