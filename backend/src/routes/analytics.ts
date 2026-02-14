import { Router, Request, Response } from 'express';
import { getCreatorAnalytics } from '../db/queries';

const router = Router();

router.get('/creator/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const { network = 'testnet' } = req.query;

    if (!address) {
      return res.status(400).json({ error: 'Missing creator address' });
    }

    const analytics = await getCreatorAnalytics(address, network as string);

    res.json({
      creatorAddress: address,
      totalUnlocks: analytics.totalUnlocks,
      totalRevenue: analytics.totalRevenue,
      topContent: analytics.topContent,
      network,
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message });
  }
});

export default router;
