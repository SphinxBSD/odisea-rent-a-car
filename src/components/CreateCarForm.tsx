import { useState } from "react";
import { CreateCar } from "../interfaces/create-car";
import Modal from "./Modal";

interface CreateCarFormProps {
  onCreateCar: (formData: CreateCar) => Promise<void>;
  onCancel: () => void;
}

export const CreateCarForm = ({
  onCreateCar,
  onCancel,
}: CreateCarFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateCar>({
    brand: "",
    model: "",
    color: "",
    passengers: 1,
    pricePerDay: 0,
    ac: false,
    ownerAddress: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onCreateCar(formData);
    } catch (error) {
      console.error("Error creating car:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Create New Car" closeModal={onCancel}>
      <div className="bg-gradient-to-br from-white via-emerald-50/30 to-blue-50/30 rounded-lg px-8 pb-2">
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            {/* Brand */}
            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Brand
              </label>
              <input
                id="brand"
                name="brand"
                type="text"
                value={formData.brand}
                onChange={handleChange}
                className="block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 px-4 py-2.5 text-gray-900"
                placeholder="e.g., Toyota"
              />
            </div>

            {/* Model */}
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Model
              </label>
              <input
                id="model"
                name="model"
                type="text"
                value={formData.model}
                onChange={handleChange}
                className="block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 px-4 py-2.5 text-gray-900"
                placeholder="e.g., Camry"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Color */}
            <div>
              <label
                htmlFor="color"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Color
              </label>
              <input
                id="color"
                name="color"
                type="text"
                value={formData.color}
                onChange={handleChange}
                className="block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 px-4 py-2.5 text-gray-900"
                placeholder="e.g., Silver"
              />
            </div>

            {/* Passengers */}
            <div>
              <label
                htmlFor="passengers"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Passengers
              </label>
              <input
                id="passengers"
                name="passengers"
                type="number"
                min="1"
                max="10"
                value={formData.passengers}
                onChange={handleChange}
                className="block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 px-4 py-2.5 text-gray-900"
              />
            </div>
          </div>

          {/* Price per Day */}
          <div>
            <label
              htmlFor="pricePerDay"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Price per Day ($)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                $
              </span>
              <input
                id="pricePerDay"
                name="pricePerDay"
                type="number"
                min="0"
                value={formData.pricePerDay}
                onChange={handleChange}
                className="block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 pl-8 pr-4 py-2.5 text-gray-900"
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Owner Address */}
          <div>
            <label
              htmlFor="ownerAddress"
              className="block text-sm font-bold text-gray-700 mb-2"
            >
              Owner Address
            </label>
            <input
              id="ownerAddress"
              name="ownerAddress"
              type="text"
              value={formData.ownerAddress}
              onChange={handleChange}
              className="block w-full rounded-lg border-2 border-gray-200 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 px-4 py-2.5 text-gray-900 font-mono text-sm"
              placeholder="G..."
            />
          </div>

          {/* Air Conditioning */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4 border-2 border-emerald-100">
            <div className="flex items-center">
              <input
                id="ac"
                name="ac"
                type="checkbox"
                checked={formData.ac}
                onChange={handleChange}
                className="h-5 w-5 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="ac"
                className="ml-3 block text-sm font-semibold text-gray-700 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Air Conditioning Available
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 pb-6">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2.5 border-2 border-gray-300 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 cursor-pointer"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 border-2 border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:transform-none cursor-pointer"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
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
                  Create Car
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
