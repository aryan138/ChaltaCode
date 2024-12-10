import React, { useState } from "react";
import Card from "components/card";
import CardMenu from "components/card/CardMenu";
import { BsCloudCheck } from "react-icons/bs";
import axios from "axios";
import { toast } from "react-toastify";

const Storage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    minProducts: "",
    inventorySize: "",
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/warehouse/enter-details',{min_val:formData.minProducts,storage:formData.inventorySize},{withCredentials:true});
      if (response.data.success==true){
        toast.success(response.data.message);
      }
      else{
        toast.error(response.data.message);
      }
      handleCloseModal();
    } catch (error) {
      toast.error(error.message);
      return;
    }
    
  };

  return (
    <>
      {/* Storage Card */}
      <Card
        extra={"w-full h-full p-4 cursor-pointer"}
        onClick={handleOpenModal}
      >
        <div className="ml-auto">
          <CardMenu />
        </div>
        {/* Storage Content */}
        <div className="mb-auto flex flex-col items-center justify-center">
          <div className="mt-2 flex items-center justify-center rounded-full bg-lightPrimary p-[26px] text-5xl font-bold text-brand-500 dark:!bg-black-700 dark:text-white">
            <BsCloudCheck />
          </div>
          <h4 className="mb-px mt-3 text-2xl font-bold text-black-700 dark:text-white">
            Your storage
          </h4>
          <p className="px-5 text-center text-base font-normal text-gray-600 md:!px-0 xl:!px-8">
            Supervise your drive space in the easiest way
          </p>
        </div>
        {/* Progress Bar */}
        <div className="flex flex-col">
          <div className="flex justify-between">
            <p className="text-sm font-medium text-gray-600">25.6 GB</p>
            <p className="text-sm font-medium text-gray-600">50 GB</p>
          </div>
          <div className="mt-2 flex h-3 w-full items-center rounded-full bg-lightPrimary dark:!bg-black-700">
            <span className="h-full w-1/2 rounded-full bg-brand-500 dark:!bg-white" />
          </div>
        </div>
      </Card>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-md w-96"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Set Inventory Details
            </h3>
            <form onSubmit={handleSubmit}>
              {/* Minimum Products Input */}
              <div className="mb-4">
                <label
                  htmlFor="minProducts"
                  className="block text-sm font-medium text-gray-600"
                >
                  Minimum Products in Inventory
                </label>
                <input
                  type="number"
                  id="minProducts"
                  name="minProducts"
                  value={formData.minProducts}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-brand-500 focus:ring focus:ring-brand-500"
                  required
                />
              </div>

              {/* Inventory Size Input */}
              <div className="mb-4">
                <label
                  htmlFor="inventorySize"
                  className="block text-sm font-medium text-gray-600"
                >
                  Inventory Size
                </label>
                <input
                  type="number"
                  id="inventorySize"
                  name="inventorySize"
                  value={formData.inventorySize}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:border-brand-500 focus:ring focus:ring-brand-500"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 rounded-md bg-gray-300 text-gray-700 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-brand-500 text-white hover:bg-brand-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Storage;
