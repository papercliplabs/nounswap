#!/bin/bash
export NOUNDERS=0x2573c60a6d127755aa2dc85e342f7da2378a0cc5 
export ANVIL_0=0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
export NOUNS_TOKEN=0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03
export NOUNS_DOA_PROXY=0x6f3E6272A167e8AcCb32072d08E0957F9c79223d

cast rpc anvil_impersonateAccount $NOUNDERS
cast send $NOUNS_TOKEN \
  --unlocked \
  --from $NOUNDERS \
  "safeTransferFrom(address,address,uint256)" \
  $NOUNDERS $ANVIL_0 900

cast send $NOUNS_TOKEN \
  --unlocked \
  --from $NOUNDERS \
  "safeTransferFrom(address,address,uint256)" \
  $NOUNDERS $ANVIL_0 890

cast send $NOUNS_TOKEN \
  --unlocked \
  --from $NOUNDERS \
  "safeTransferFrom(address,address,uint256)" \
  $NOUNDERS $ANVIL_0 860

cast send $NOUNS_TOKEN \
  --unlocked \
  --from $NOUNDERS \
  "safeTransferFrom(address,address,uint256)" \
  $NOUNDERS $ANVIL_0 820
