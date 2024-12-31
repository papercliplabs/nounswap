# NounSwap Web App

NounSwap web app built using [Nextjs](https://nextjs.org)

## Deployments

| Type       | Mainnet                                                  | Sepolia                                                                  |
| ---------- | -------------------------------------------------------- | ------------------------------------------------------------------------ |
| Production | [nounswap.wtf](https://www.nounswap.wtf)                 | [sepolia.nounswap.wtf](https://www.sepolia.nounswap.wtf)                 |
| Staging    | [staging.nounswap.wtf](https://www.staging.nounswap.wtf) | [staging.sepolia.nounswap.wtf](https://www.staging.sepolia.nounswap.wtf) |

## Local Development

Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

Populate the `.env` file

Install dependencies

```bash
pnpm install
```

Start dev server

```bash
pnpm dev
```

Build for production 

```bash
pnpm build
```
