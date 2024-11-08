import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputField from "components/fields/InputField";
 // Adjust the path if necessary
 

const AddBranch = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  
  const navigate = useNavigate();


  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/order/placeorder",
        data,
        { withCredentials: true }
      );
      if (response.data.status === 200) {
        alert("Order placed successfully!");
        // onOrderSuccess();
        onClose();
        navigate('/admin/order-tables');
        window.location.reload();
        
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-full h-full">
      <h3 className="text-lg font-bold text-navy-700 mb-4">Add a New Branch</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Branch Name"
          placeholder="Enter Branch name"
          {...register("branch_name", { required: "Branch name is required" })}
          error={errors.product_name?.message}
        />
        <BranchLocationSelectField
          label="Branch Location"
          placeholder="Select branch location"
          register={register("branch_location", { required: "Branch location is required" })}
          error={errors.branch_location?.message}
        />

        <SelectField
          label="Branch Type"
          options={[
            { value: "Franchised", label: "Franchised" },
            { value: "Owned", label: "Owned" },
          ]}
          register={register("branch_type", { required: "Branch type is required" })}
          error={errors.branch_type?.message}
        />



        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="mr-4 inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-brand-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            Submit Order
          </button>
        </div>
      </form>
    </div>
  );
};



const SelectField = ({ label, placeholder, options, register, error }) => (
  <div className="input-field">
    <label className="input-label font-semibold text-sm mx-3">{label}</label>
    <select
      {...register}
      className={`input-select ${error ? 'input-error' : ''} w-full h-auto py-3 border border-gray-200 text-gray-400 px-1 text-sm rounded-xl ` }
    >lg
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <span className="input-error-message">{error}</span>}
  </div>
);
const BranchLocationSelectField = ({ label, placeholder, register, error }) => (
  <div className="input-field">
    <label className="input-label font-semibold text-sm mx-3">{label}</label>
    <select
      {...register}
      className={`input-select ${error ? 'input-error' : ''} w-full h-auto py-3 border border-gray-200 text-gray-400 px-1 text-sm rounded-xl`}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      <option value="Andhra Pradesh">Andhra Pradesh</option>
      <option value="Arunachal Pradesh">Arunachal Pradesh</option>
      <option value="Assam">Assam</option>
      <option value="Bihar">Bihar</option>
      <option value="Chhattisgarh">Chhattisgarh</option>
      <option value="Goa">Goa</option>
      <option value="Gujarat">Gujarat</option>
      <option value="Haryana">Haryana</option>
      <option value="Himachal Pradesh">Himachal Pradesh</option>
      <option value="Jharkhand">Jharkhand</option>
      <option value="Karnataka">Karnataka</option>
      <option value="Kerala">Kerala</option>
      <option value="Madhya Pradesh">Madhya Pradesh</option>
      <option value="Maharashtra">Maharashtra</option>
      <option value="Manipur">Manipur</option>
      <option value="Meghalaya">Meghalaya</option>
      <option value="Mizoram">Mizoram</option>
      <option value="Nagaland">Nagaland</option>
      <option value="Odisha">Odisha</option>
      <option value="Punjab">Punjab</option>
      <option value="Rajasthan">Rajasthan</option>
      <option value="Sikkim">Sikkim</option>
      <option value="Tamil Nadu">Tamil Nadu</option>
      <option value="Telangana">Telangana</option>
      <option value="Tripura">Tripura</option>
      <option value="Uttar Pradesh">Uttar Pradesh</option>
      <option value="Uttarakhand">Uttarakhand</option>
      <option value="West Bengal">West Bengal</option>
      <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
      <option value="Chandigarh">Chandigarh</option>
      <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
      <option value="Lakshadweep">Lakshadweep</option>
      <option value="Delhi">Delhi</option>
      <option value="Puducherry">Puducherry</option>
      <option value="Ladakh">Ladakh</option>
      <option value="Jammu and Kashmir">Jammu and Kashmir</option>
    </select>
    {error && <span className="input-error-message">{error}</span>}
  </div>
);

export default AddBranch;
