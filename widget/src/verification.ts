export async function verifyTransaction(txId: string, network: string): Promise<boolean> {
  const baseUrl = network === 'testnet' 
    ? 'https://api.testnet.hiro.so'
    : 'https://api.hiro.so';

  const maxAttempts = 30;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch(`${baseUrl}/extended/v1/tx/${txId}`);
      const data = await response.json();

      if (data.tx_status === 'success') {
        return true;
      }

      if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
        return false;
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      attempts++;
    }
  }

  return false;
}

