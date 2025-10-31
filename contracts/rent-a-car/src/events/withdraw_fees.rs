use soroban_sdk::{Address, Env, Symbol};

pub(crate) fn withdraw_fees(env: &Env, admin: Address, amount: i128) {
    let topics = (Symbol::new(env, "withdraw_fees"), admin.clone());

    env.events().publish(
        topics,
        amount
    );
}