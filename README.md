# NounSwap

Bid, explore, buy, and swap to find your forever Noun.

## Structure
-   [Web](./web): The web app
-   [Indexer](./indexer): Onchain data indexer that powers the web app  
-   [Indexer](./cms): Content management system consumed by the web app

> See the individual folders for more details

## Development

```bash
docker compose up --build
```


# NounSwap Web App

Bid, explore, buy, and swap to find your forever Noun.

## Deployments

* Mainnet: [nounswap.wtf](https://www.nounswap.wtf)    
* Sepolia: [sepolia.nounswap.wtf](https://www.sepolia.nounswap.wtf) 

## Local Development

Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

Populate the `.env` file

Install dependencies
```bash
bun install
```

Start dev server

```bash
bun dev
```

Build for production 
```bash
bun build
```
