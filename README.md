# NounSwap

Bid, explore, buy, and swap to find your forever Noun.

## Structure
-   [Web](./apps/web/): The web app
-   [Indexer](./apps/indexer/): Onchain data indexer that powers the web app  

> See the individual folders for more details

## Development

1. For each app, copy the `.env.example` to `.env.local` and populate the environment variables. 

2. Start all apps
```bash
docker compose up --build
```
