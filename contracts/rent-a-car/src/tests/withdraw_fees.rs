use crate::{
    storage::{admin::read_admin, contract_balance::read_contract_balance, rental_fee::read_rental_fee},
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

#[test]
pub fn test_withdraw_fees_cannot_withdraw_twice() {
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
    let rental_fee = 10_i128;
  
    let (_, token_admin, _) = token;
  
    let amount_mint = 10_000_i128;
    token_admin.mint(&renter, &amount_mint);
  
    // Add car and create rental to generate fees
    contract.add_car(&owner, &price_per_day);
    contract.rental(&renter, &owner, &total_days, &amount, &rental_fee);
  
    let contract_balance_before = env.as_contract(&contract.address, || read_contract_balance(&env));
    assert_eq!(contract_balance_before, amount + rental_fee);
  
    // First withdrawal should succeed
    contract.withdraw_fees();
    
    let contract_balance_after_first = env.as_contract(&contract.address, || read_contract_balance(&env));
    assert_eq!(contract_balance_after_first, amount);
    
    // Verify fee.available_to_withdraw is now 0
    let fee = env.as_contract(&contract.address, || read_rental_fee(&env)).unwrap();
    assert_eq!(fee.available_to_withdraw, 0);
  
    // Second withdrawal attempt should fail with NoFeeForWithdrawal error
    let result = contract.try_withdraw_fees();
    assert!(result.is_err());
    
    // Verify the contract balance hasn't changed (no additional withdrawal occurred)
    let contract_balance_after_second = env.as_contract(&contract.address, || read_contract_balance(&env));
    assert_eq!(contract_balance_after_second, amount);
    
    // Verify admin balance to ensure they only received the fee once
    let (token_client, _, _) = token;
    let admin_balance = token_client.balance(&admin);
    assert_eq!(admin_balance, rental_fee);
}