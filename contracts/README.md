## NounSwap Contracts

Contracts specific to NounSwap built using [Foundry](https://book.getfoundry.sh). Note that NounSwap web app also leverages the [Nouns core contracts](https://github.com/nounsDAO/nouns-monorepo/tree/master/packages/nouns-contracts).

Contract specs can be found [here](./specs/)

## Deployments

### Mainnet

| Name                 | Address |
| -------------------- | ------- |
| Nouns NFTSwapper.sol | TODO    |

### Sepolia

| Name                 | Address |
| -------------------- | ------- |
| Nouns NFTSwapper.sol | TODO    |

## Development

Build
```bash
forge build
```

Test
```bash
forge test
```

Run tests on Ethereum mainnet fork with the real DAO
```bash
# Specifying --fork-block-number provides caching, without will always run at tip and hit RPC (slower)
forge test -vvv --fork-url $RPC_URL --fork-block-number $FORK_BLOCK_NUMBER
```

Format
```bash
forge fmt
```

Gas Snapshot
```bash
forge snapshot
```

Test coverage summary
```bash
force coverage --report summary
```

Test coverage lcov
```bash
force coverage --report lcov
```

Deploy
```bash
# TODO
```
