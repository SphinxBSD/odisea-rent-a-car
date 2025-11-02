use crate::{
    storage::{admin::{ read_admin}, contract_balance::read_contract_balance},
    tests::config::{contract::ContractTest, utils::get_contract_events},
};
use soroban_sdk::{testutils::Address as _, Address, vec, Symbol, IntoVal};

#[test]
pub fn test_withdraw_fees_successfully() {
    let ContractTest {
        env,
        contract,
        token,
        ..
    } = ContractTest::setup();

    env.mock_all_auths();

    let owner = Address::generate(&env);
    let renter = Address::generate(&env);
    let admin = env.as_contract(&contract.address, || read_admin(&env)).unwrap();

    let price_per_day = 1500_i128;
    let total_days = 3;
    let amount = 4500_i128;
    let rental_fee=10_i128;

    let (_, token_admin, _) = token;

    let amount_mint = 10_000_i128;
    token_admin.mint(&renter, &amount_mint);

    contract.add_car(&owner, &price_per_day);
    contract.rental(&renter, &owner, &total_days, &amount, &rental_fee);

    let contract_balance = env.as_contract(&contract.address, || read_contract_balance(&env));
    assert_eq!(contract_balance, amount + rental_fee);


    contract.withdraw_fees();
    let contract_events = get_contract_events(&env, &contract.address);
    let contract_balance = env.as_contract(&contract.address, || read_contract_balance(&env));
    assert_eq!(contract_balance, amount);

    assert_eq!(
        contract_events,
        vec![
            &env,
            (
                contract.address.clone(),
                vec![
                    &env,
                    *Symbol::new(&env, "withdraw_fees").as_val(),
                    admin.clone().into_val(&env),
                ],
                rental_fee.into_val(&env)
            )
        ]
    );
}
