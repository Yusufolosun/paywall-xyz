# PayWall.xyz

Drop-in JavaScript widget for content monetization using Stacks blockchain micropayments.

## Quick Start

Add 3 lines of code to your website:

```html
<script src="https://cdn.paywall.xyz/widget.js"></script>
<div data-paywall-id="1" data-paywall-price="0.5">
  Premium content here
</div>
```

Initialize the widget:

```javascript
new PaywallWidget({
  contractAddress: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.paywall-v1',
  network: 'testnet'
}).init();
```

## Features

- Instant unlock with Stacks wallet (Hiro, Xverse, Leather)
- No accounts or subscriptions required
- 90% revenue share to content creators
- Blockchain-verified transactions
- localStorage caching for unlocked content
- Responsive design with customizable styling

## Installation

**Via CDN:**
```html
<script src="https://cdn.paywall.xyz/widget.js"></script>
```

**Via NPM:**
```bash
npm install @paywall/widget
```

## Documentation

See [landing/docs.html](landing/docs.html) for complete API reference and integration guide.

## Demo

Try the [demo blog](demo/index.html) to see PayWall.xyz in action.

## Project Structure

```
paywall-xyz/
├── contracts/          # Clarity smart contracts
├── widget/            # JavaScript widget source
├── backend/           # Express API server
├── landing/           # Landing page and documentation
└── demo/              # Working demo blog
```

## Development

```bash
# Install dependencies
cd widget && npm install
cd ../backend && npm install

# Run tests
cd contracts && clarinet test

# Build widget
cd widget && npm run build

# Start backend
cd backend && npm run dev
```

## Smart Contract

**Testnet:** `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.paywall-v1`

Functions:
- `register-content` - Register content with pricing
- `unlock-content` - Pay to unlock content (90/10 revenue split)
- `has-access` - Check if user has access

## API Endpoints

**Verify Transaction:**
```
POST /api/verify/transaction
Body: { txId: string, network: string }
```

**Creator Analytics:**
```
GET /api/analytics/creator/:address?network=testnet
```

## License

MIT

## Contributing

Open source contributions welcome. Please submit pull requests to the main repository.
