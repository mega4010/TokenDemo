## Features

- **Token Presale** — User-friendly interface for purchasing ELO tokens
- **Wallet Integration** — MetaMask, Rabby, and injected wallets
- **Token Swap** — Swap interface for token exchanges
- **Staking** — Staking UI (planned)
- **NFT Minting** — Mint and view NFTs
- **Transaction Tracking** — Transaction history
- **On-Ramp** — Ramper integration for fiat-to-crypto

## Tech Stack

| Layer      | Technology                        |
| ---------- | --------------------------------- |
| Frontend   | React 17, Material-UI, Ant Design |
| Web3       | ethers.js, web3, Moralis          |
| Backend    | Node.js, Express                  |
| Database   | MongoDB (Mongoose)                |
| Blockchain | Solidity ^0.8.9, Truffle          |
| Auth       | JWT, Passport                     |

## Prerequisites

- Node.js v16 or later
- MetaMask or compatible Web3 wallet

## Installation

```sh
npm install
```

## Running Locally

```sh
npm start
```

This starts:

- **Backend** — Express server on port 8082
- **Frontend** — React dev server on port 3000

Open [http://localhost:3000](http://localhost:3000) to access the application.

### Other Scripts

| Command              | Description                  |
| -------------------- | ---------------------------- |
| `npm run server`   | Run Express backend only     |
| `npm run build`    | Build React for production   |
| `npm run deploy`   | Deploy contracts via Truffle |
| `npm run devchain` | Start local dev chain        |

## Environment Variables

Create a `config.env` file in the project root:

```
ATLAS_URI=<your-mongodb-connection-string>
PORT=8082
TOKEN_KEY=<jwt-secret-key>
```

## API Endpoints

Base path: `/presale`

- `POST /presale/auth/*` — Authentication
- `GET/POST /presale/launchpad/*` — Presale campaign CRUD

## Deployed Contracts (BSC Testnet)

| Contract | Address                                        |
| -------- | ---------------------------------------------- |
| Owner    | `0x5C29099Dc53ddf3b3Fa3a299C48EC1Bff9C59d29` |
| Token    | `0x6154818f854f5009C5CFa47213C68598E9dE02FA` |
| Presale  | `0xDD1C2603315A0C1ad649819A70451D5529F53398` |

## Tokenomics

- **Total Supply:** 1,000,000,000 (1B)
- **Decimals:** 18
- **Distribution:** 10% Presale, 10% DEX, 10% CEX, 25% Staking, 10% Team, 20% Order rewards, 5% Customer rewards, 5% Airdrop
