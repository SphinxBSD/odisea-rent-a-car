use soroban_sdk::{contracttype};

#[derive(Debug, Clone)]
#[contracttype]
pub struct RentalFee {
    pub available_to_withdraw: i128,
}