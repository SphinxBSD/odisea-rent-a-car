use crate::{
    events,
    interfaces::contract::RentACarContractTrait,
    methods::{public, token::token::token_transfer},
    storage::{
        admin::{has_admin, read_admin, write_admin}, car::{has_car, read_car, remove_car, write_car}, contract_balance::{read_contract_balance, write_contract_balance}, rental::write_rental, rental_fee::{has_rental_fee, read_rental_fee, write_rental_fee}, structs::{car::Car, rental::Rental, rental_fee::RentalFee}, token::write_token, types::{car_status::CarStatus, errors::Error}
    },
};
use soroban_sdk::{contract, contractimpl, Address, Env};

#[contract]
pub struct RentACarContract;

#[contractimpl]
impl RentACarContractTrait for RentACarContract {
    fn __constructor(env: &Env, admin: Address, token: Address) -> Result<(), Error> {
        if admin == token {
            return Err(Error::AdminTokenConflict);
        }

        if has_admin(&env) {
            return Err(Error::ContractInitialized);
        }

        let rental_fee = RentalFee{
            available_to_withdraw: 0
        };

        write_admin(env, &admin);
        write_token(env, &token);
        write_rental_fee(env, &rental_fee);

        events::contract::contract_initialized(env, admin, token);

        Ok(())
    }

    fn add_car(env: &Env, owner: Address, price_per_day: i128) -> Result<(), Error> {
        let admin = read_admin(env)?;
        admin.require_auth();

        if price_per_day <= 0 {
            return Err(Error::AmountMustBePositive);
        }

        if has_car(env, &owner) {
            return Err(Error::CarAlreadyExist);
        }

        let car = Car {
            price_per_day,
            car_status: CarStatus::Available,
            available_to_withdraw: 0,
        };

        write_car(env, &owner, &car);

        events::add_car::car_added(env, owner, price_per_day);
        Ok(())
    }

    fn get_car_status(env: &Env, owner: Address) -> Result<CarStatus, Error> {
        public::get_car_status::get_car_status(env, &owner)
    }

    fn rental(
        env: &Env,
        renter: Address,
        owner: Address,
        total_days_to_rent: u32,
        amount: i128,
        rental_fee: i128,
    ) -> Result<(), Error> {
        // VALIDACIONES
        renter.require_auth();

        if amount <= 0 {
            return Err(Error::AmountMustBePositive);
        }

        if total_days_to_rent == 0 {
            return Err(Error::RentalDurationCannotBeZero);
        }

        if renter == owner {
            return Err(Error::SelfRentalNotAllowed);
        }

        let mut car = read_car(env, &owner)?;

        if car.car_status != CarStatus::Available {
            return Err(Error::CarAlreadyRented);
        }

        // LOGICA
        // let total_amount = amount + rental_fee;
        let total_amount = match amount.checked_add(rental_fee) {
            Some(rental_fee) => rental_fee,
            None => return Err(Error::OverflowError),
        };
        
        let mut fee = read_rental_fee(env)?;
        fee.available_to_withdraw = fee
            .available_to_withdraw
            .checked_add(rental_fee)
            .ok_or(Error::OverflowError)?;
        
        token_transfer(&env, &renter, &env.current_contract_address(), &total_amount)?;

        car.car_status = CarStatus::Rented;
        car.available_to_withdraw = car
            .available_to_withdraw
            .checked_add(amount)
            .ok_or(Error::OverflowError)?;

        let rental = Rental {
            total_days_to_rent,
            amount
        };

        let mut contract_balance = read_contract_balance(&env);

        contract_balance = contract_balance
            .checked_add(total_amount)
            .ok_or(Error::OverflowError)?;

        // ALMACENAMIENTO
        write_contract_balance(&env, &contract_balance);
        write_car(env, &owner, &car);
        write_rental(env, &renter, &owner, &rental);
        write_rental_fee(env, &fee);
        // Aqui deberia existir un "write_fee"

        // EVENTOS
        events::rental::rented(env, renter, owner, total_days_to_rent, amount);

        // RESULTADO
        Ok(())
    }

    fn remove_car(env: &Env, owner: Address) -> Result<(), Error> {
        let admin = read_admin(env)?;
        admin.require_auth();

        if !has_car(env, &owner) {
            return Err(Error::CarNotFound);
        }

        remove_car(env, &owner);

        events::remove_car::car_removed(env, owner);
        Ok(())
    }

    fn payout_owner(env: &Env, owner: Address, amount: i128) -> Result<(), Error> {
        owner.require_auth();

        if amount <= 0 {
            return Err(Error::AmountMustBePositive);
        }

        let mut car = read_car(&env, &owner)?;

        if amount > car.available_to_withdraw {
            return Err(Error::InsufficientBalance);
        }

        if car.car_status != CarStatus::Returned {
            return Err(Error::CarStillRented);
        }

        let mut contract_balance = read_contract_balance(&env);

        if amount > contract_balance {
            return Err(Error::BalanceNotAvailableForAmountRequested);
        }

        token_transfer(&env, &env.current_contract_address(), &owner, &amount)?;

        car.available_to_withdraw = car
            .available_to_withdraw
            .checked_sub(amount)
            .ok_or(Error::UnderFlowError)?;
        contract_balance = contract_balance
            .checked_sub(amount)
            .ok_or(Error::UnderFlowError)?;

        write_car(&env, &owner, &car);
        write_contract_balance(&env, &contract_balance);

        events::payout_owner::payout_owner(env, owner, amount);

        Ok(())
    }

    // funcion para retirar fees del contrato por parte del admin
    /*
    Retirar
     */
    fn withdraw_fees(env: &Env) -> Result<(), Error> {
        let admin = read_admin(env)?;
        admin.require_auth();

        if !has_rental_fee(env) {
            return Err(Error::RentalFeeNotFound);
        }

        let fee = read_rental_fee(env)?;

        if fee.available_to_withdraw == 0 {
            return Err(Error::NoFeeForWithdrawal);
        }

        let mut contract_balance = read_contract_balance(&env);

        if fee.available_to_withdraw > contract_balance {
            return Err(Error::BalanceNotAvailableForAmountRequested);
        }

        token_transfer(&env, &env.current_contract_address(), &admin, &fee.available_to_withdraw)?;

        contract_balance = contract_balance
            .checked_sub(fee.available_to_withdraw)
            .ok_or(Error::UnderFlowError)?;

        write_contract_balance(&env, &contract_balance);

        events::withdraw_fees::withdraw_fees(env, admin, fee.available_to_withdraw);

        Ok(())
    }

    fn return_car(
        env: &Env,
        renter: Address,
        owner: Address
    ) -> Result<(), Error> {
        renter.require_auth();
        
        let mut car = read_car(env, &owner)?;

        if car.car_status != CarStatus::Rented {
            return Err(Error::CarNotRented);
        }

        car.car_status = CarStatus::Returned;

        write_car(env, &owner, &car);

        Ok(())
    }
}