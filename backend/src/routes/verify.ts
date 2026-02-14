import { Router, Request, Response } from 'express';
import { verifyStacksTransaction } from '../utils/stacks';
import { saveUnlock } from '../db/queries';

const router = Router();


interface VerifyRequest {
  txId: string;
  network: string;
}



router.post('/transaction', async (req: Request, res: Response) => {
  try {
    const { txId, network } = req.body as VerifyRequest;

    if (!txId || !network) {
      return res.status(400).json({ error: 'Missing txId or network' });
    }

    const verification = await verifyStacksTransaction(txId, network);

    if (!verification.verified) {
      return res.json({ verified: false });
    }

    await saveUnlock({
      txId: verification.txId,
      contentId: verification.contentId,
      creatorAddress: verification.creatorAddress,
      userAddress: verification.userAddress,
      price: verification.price,
      network,
    });

    res.json({
      verified: true,
      contentId: verification.contentId,
      txId: verification.txId,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

export = router;

