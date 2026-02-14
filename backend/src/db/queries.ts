import pool from './pool';

interface UnlockData {
  txId: string;
  contentId: number;
  creatorAddress: string;
  userAddress: string;
  price: number;
  network: string;
}

export async function saveUnlock(data: UnlockData): Promise<void> {
  const query = `
    INSERT INTO unlocks (tx_id, content_id, creator_address, user_address, price, network)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (tx_id) DO NOTHING
  `;
  
  await pool.query(query, [
    data.txId,
    data.contentId,
    data.creatorAddress,
    data.userAddress,
    data.price,
    data.network,
  ]);
}

interface CreatorAnalytics {
  totalUnlocks: number;
  totalRevenue: string;
  topContent: Array<{ contentId: number; unlocks: number; revenue: string }>;
}

export async function getCreatorAnalytics(
  creatorAddress: string,
  network: string
): Promise<CreatorAnalytics> {
  const totalQuery = `
    SELECT 
      COUNT(*) as total_unlocks,
      SUM(price) as total_revenue
    FROM unlocks
    WHERE creator_address = $1 AND network = $2
  `;

  const totalResult = await pool.query(totalQuery, [creatorAddress, network]);
  
  const topQuery = `
    SELECT 
      content_id,
      COUNT(*) as unlocks,
      SUM(price) as revenue
    FROM unlocks
    WHERE creator_address = $1 AND network = $2
    GROUP BY content_id
    ORDER BY revenue DESC
    LIMIT 10
  `;

  const topResult = await pool.query(topQuery, [creatorAddress, network]);

  const totalRevenueMicroStx = totalResult.rows[0]?.total_revenue || '0';
  const totalRevenueStx = (parseInt(totalRevenueMicroStx) / 1000000).toFixed(6);

  return {
    totalUnlocks: parseInt(totalResult.rows[0]?.total_unlocks || '0'),
    totalRevenue: totalRevenueStx,
    topContent: topResult.rows.map((row) => ({
      contentId: row.content_id,
      unlocks: parseInt(row.unlocks),
      revenue: (parseInt(row.revenue) / 1000000).toFixed(6),
    })),
  };
}
