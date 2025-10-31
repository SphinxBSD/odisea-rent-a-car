use soroban_sdk::{Address, Env};

use crate::storage::{structs::rental_fee::RentalFee, types::{errors::Error, storage::DataKey}};

pub(crate) fn has_rental_fee(env: &Env) -> bool {
    env.storage().instance().has(&DataKey::RentalFee)
}

pub(crate) fn write_rental_fee(env: &Env, rental_fee: &RentalFee) {
    env.storage().instance().set(&DataKey::RentalFee, rental_fee);
}

pub(crate) fn read_rental_fee(env: &Env) -> Result<RentalFee, Error>  {
    env.storage().instance().get(&DataKey::RentalFee).
    ok_or(Error::RentalFeeNotFound)
}