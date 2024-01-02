use anyhow::Error;
use anyhow::Result as AnyhowResult;
use ethers::prelude::*;
use ethers::utils::format_ether;
use ethers_contract::Multicall;
use graphql_client::{GraphQLQuery, Response};
use serde_derive::{Deserialize, Serialize};
use std::env;
use std::sync::Arc;

#[tokio::main]
async fn main() -> AnyhowResult<(), Error> {
    // Load .env file
    dotenv::dotenv().ok();

    let provider = Arc::new(Provider::<Http>::try_from(env::var("MAINNET_RPC_URL")?)?);

    let escrow_noun_ids = get_escrow_noun_ids().await?;

    let doa_owned_escrow_noun_ids =
        filter_for_doa_owned_escrow_noun_ids(Arc::clone(&provider), escrow_noun_ids).await?;

    let call = generate_call(Arc::clone(&provider), doa_owned_escrow_noun_ids).await?;

    println!("{:?}", call.calldata().unwrap());
    println!("{:?}", call.tx);

    let gas_estimate = call.estimate_gas().await?;
    let gas_price_wei = provider.get_gas_price().await?;
    let txn_fee_eth = format_ether(gas_estimate * gas_price_wei);

    println!("Txn fee ETH: {txn_fee_eth} - gas: {gas_estimate}, gas_price: {gas_price_wei}");

    Ok(())
}

// Can't go directly to U256 since this is big endian and U256 is little
#[derive(Serialize, Deserialize, Debug, GraphQLQuery)]
#[graphql(
    schema_path = "schema.json",
    query_path = "query.graphql",
    response_derives = "Debug, Serialize, Deserialize"
)]
pub struct NounsForAccountQuery;

async fn get_escrow_noun_ids() -> AnyhowResult<Vec<U256>, Error> {
    let request_body = NounsForAccountQuery::build_query(nouns_for_account_query::Variables {
        address: "0x44d97d22b3d37d837ce4b22773aad9d1566055d9".to_string(),
    });
    let client = reqwest::Client::new();
    let res = client
        .post("https://api.thegraph.com/subgraphs/name/nounsdao/nouns-subgraph")
        .json(&request_body)
        .send()
        .await?;
    let response_body: Response<nouns_for_account_query::ResponseData> = res.json().await?;

    let mut noun_ids: Vec<U256> = response_body
        .data
        .expect("Subgraph query error")
        .account
        .unwrap()
        .nouns
        .iter()
        .map(|n| U256::from_dec_str(&n.id).unwrap())
        .collect();

    noun_ids.sort();

    println!(
        "ESCROW NOUN COUNT: {:?} - ID's: {:?}",
        noun_ids.len(),
        noun_ids
    );

    Ok(noun_ids)
}

async fn filter_for_doa_owned_escrow_noun_ids(
    provider: Arc<Provider<Http>>,
    escrow_noun_ids: Vec<U256>,
) -> AnyhowResult<Vec<U256>, Error> {
    abigen!(
        NounsForkEscrow,
        r#"[
            function currentOwnerOf(uint256 tokenId) public view returns (address)
        ]"#,
    );

    let fork_escrow_contract = NounsForkEscrow::new(
        "0x44d97D22B3d37d837cE4b22773aAd9d1566055D9".parse::<Address>()?,
        Arc::clone(&provider),
    );

    let mut multicall = Multicall::new(Arc::clone(&provider), None).await?;

    for id in escrow_noun_ids.clone() {
        multicall.add_call(fork_escrow_contract.current_owner_of(id), false);
    }

    let multicall_resp: Vec<Address> = multicall.call_array().await?;

    let mut filtered_noun_ids = Vec::new();
    for (i, addr) in multicall_resp.iter().enumerate() {
        if addr.eq(&"0x6f3e6272a167e8accb32072d08e0957f9c79223d".parse::<Address>()?) {
            filtered_noun_ids.push(escrow_noun_ids[i]);
        }
    }

    println!(
        "FILTERED NOUN COUNT: {:?} - ID's: {:?}",
        filtered_noun_ids.len(),
        filtered_noun_ids
    );

    Ok(filtered_noun_ids)
}

async fn generate_call(
    provider: Arc<Provider<Http>>,
    noun_ids: Vec<U256>,
) -> AnyhowResult<FunctionCall<Arc<Provider<Http>>, Provider<Http>, ()>, Error> {
    abigen!(
        NounsDOAProxy,
        r#"[
            function withdrawDAONounsFromEscrowToTreasury(uint256[] calldata tokenIds) external
        ]"#,
    );

    let doa_contract = NounsDOAProxy::new(
        "0x6f3e6272a167e8accb32072d08e0957f9c79223d".parse::<Address>()?,
        Arc::clone(&provider),
    );

    let mut call = doa_contract.withdraw_dao_nouns_from_escrow_to_treasury(noun_ids);

    // From executor
    call = call.from("0xb1a32fc9f9d8b2cf86c068cae13108809547ef71".parse::<Address>()?);

    Ok(call)
}
