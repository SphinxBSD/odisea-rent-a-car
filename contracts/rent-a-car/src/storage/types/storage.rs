use soroban_sdk::{contracttype, Address};

#[derive(Clone)]
#[contracttype]

pub enum DataKey {
    Admin,                      // direccion del administrador del contrato
    Token,                      // direccion del token de pago aceptado
    ContractBalance,
    Car(Address),               // auto asociado a un owner
    Rental(Address, Address)    // registro de alquiler entre renter y owner
}