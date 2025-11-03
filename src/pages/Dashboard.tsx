import { CarsList } from "../components/CarList";
import { CreateCarForm } from "../components/CreateCarForm";
import StellarExpertLink from "../components/StellarExpertLink";
import { ICar } from "../interfaces/car";
import { CarStatus } from "../interfaces/car-status";
import { IRentACarContract } from "../interfaces/contract";
import { CreateCar } from "../interfaces/create-car";
import { UserRole } from "../interfaces/user-role";
import { useStellarAccounts } from "../providers/StellarAccountProvider";
import { stellarService } from "../services/stellar.service";
import { walletService } from "../services/wallet.service";
import useModal from "../utils/hooks/useModal";
import { ONE_XLM_IN_STROOPS } from "../utils/xlm-in-stroops";

export default function Dashboard() {
  const { hashId, cars, walletAddress, setCars, setHashId, selectedRole } =
    useStellarAccounts();
  const { showModal, openModal, closeModal } = useModal();

  const handleCreateCar = async (formData: CreateCar) => {
    const { brand, model, color, passengers, pricePerDay, ac, ownerAddress } =
      formData;
    const contractClient =
      await stellarService.buildClient<IRentACarContract>(walletAddress);

    const addCarResult = await contractClient.add_car({
      owner: ownerAddress,
      price_per_day: pricePerDay * ONE_XLM_IN_STROOPS,
    });
    const xdr = addCarResult.toXDR();

    const signedTx = await walletService.signTransaction(xdr);
    const txHash = await stellarService.submitTransaction(signedTx.signedTxXdr);

    const newCar: ICar = {
      brand,
      model,
      color,
      passengers,
      pricePerDay,
      ac,
      ownerAddress,
      status: CarStatus.AVAILABLE,
    };

    setCars((prevCars) => [...prevCars, newCar]);
    setHashId(txHash as unknown as string);
    closeModal();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section with Gradient Accent */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-blue-600 to-orange-500 p-8 shadow-2xl">
          <div className="absolute inset-0 bg-white opacity-5"></div>
          <div className="relative flex justify-between items-center">
            <div>
              <h1
                className="text-4xl font-bold text-white mb-2"
                data-test="dashboard-title"
              >
                Cars Catalog
              </h1>
              <p className="text-emerald-50 text-sm">
                Manage your fleet with ease
              </p>
            </div>
            {selectedRole === UserRole.ADMIN && (
              <button
                onClick={openModal}
                className="group relative px-8 py-4 bg-white text-emerald-700 font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover:opacity-10 transition-opacity"></span>
                <span className="relative flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Car
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Cars List Section */}
        <div className="relative">
          {/* Decorative Background Elements */}
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          {/* <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div> */}
          <div
            className="absolute top-1/2 left-1/2 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Content */}
          <div className="relative">{cars && <CarsList cars={cars} />}</div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="relative animate-in fade-in zoom-in duration-300">
              <CreateCarForm
                onCreateCar={handleCreateCar}
                onCancel={closeModal}
              />
            </div>
          </div>
        )}

        {/* Transaction Link */}
        {hashId && (
          <div className="mt-8 flex justify-center">
            <div className="inline-block bg-white rounded-xl shadow-lg border-2 border-emerald-100 p-4 hover:shadow-xl transition-shadow duration-300">
              <StellarExpertLink url={hashId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
