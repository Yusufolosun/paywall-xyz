# PayWall.xyz Deployment Guide

## Smart Contract Deployment

### Prerequisites
- Clarinet CLI installed
- Stacks testnet STX for deployment fees
- Testnet wallet configured

### Deploy to Testnet

```bash
cd contracts
clarinet integrate
```

Contract will be deployed to testnet with address format:
`ST[ADDRESS].paywall-v1`

### Verify Deployment

Check contract on Stacks Explorer:
```
https://explorer.hiro.so/txid/[TX_ID]?chain=testnet
```

## Widget Configuration

Update widget initialization with deployed contract address:

```javascript
new PaywallWidget({
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.paywall-v1',
  network: 'testnet'
}).init();
```

## Backend Deployment

### Environment Variables

Create `.env` file:
```
STACKS_NETWORK=testnet
STACKS_API_URL=https://api.testnet.hiro.so
DATABASE_URL=postgresql://localhost/paywall
PORT=3000
```

### Database Setup

```bash
cd backend
psql -U postgres -d paywall -f src/db/schema.sql
```

### Start Server

```bash
npm run build
npm start
```

Server will run on http://localhost:3000

## CDN Distribution

Build widget for production:

```bash
cd widget
npm run build
```

Upload `dist/paywall.js` to CDN or hosting service.

## Testing Deployment

1. Open demo/index.html in browser
2. Click unlock button on paywalled content
3. Connect Stacks wallet (testnet mode)
4. Approve transaction
5. Verify content unlocks after confirmation

## Deployed URLs

- **Smart Contract**: `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.paywall-v1`
- **Landing Page**: [Your deployment URL]
- **Demo Blog**: [Your deployment URL]/demo
- **API Server**: http://localhost:3000
