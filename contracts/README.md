# NounSwap Contracts

Smart contracts that allow anyone to swap their Noun with the Nouns treasury, built using [Foundry](https://book.getfoundry.sh/).

# Development

Copy `.env.example` to `.env`

```bash
cp .env.example .env
```

Populate the `.env` file

Build

```bash
forge build
```

Test

```bash
forge test
```

Format

```bash
forge fmt
```

Gas snapshot

```bash
forge snapshot
```

Deploy

```bash
forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```
