import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const Table = ({ data = [], onDelete, onEdit }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto bg-white shadow-lg rounded-2xl border-separate dark:bg-black-800">
        <thead>
          <tr>
            <th className="py-3 px-6 text-left text-s font-semibold text-gray-600 dark:text-white">
              Product ID
            </th>
            <th className="py-3 px-6 text-left text-s font-semibold text-gray-600 dark:text-white">
              Name
            </th>
            <th className="py-3 px-6 text-left text-s font-semibold text-gray-600 dark:text-white">
              Price
            </th>
            <th className="py-3 px-6 text-left text-s font-semibold text-gray-600 dark:text-white">
              Stock
            </th>
            <th className="py-3 px-6 text-left text-s font-semibold text-gray-600 dark:text-white">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
  {data.length > 0 ? (
    data.map((item) => (
      <tr
        className="border-b border-r-2  p-2 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        key={item.product_id}
      >
        <td className="p-2 px-6 dark:text-white">{item.product_id}</td>
        <td className="p-2 px-6 dark:text-white">{item.name}</td>
        <td className="p-2 px-6 dark:text-white">{item.price}</td>
        <td className="p-2 px-6 dark:text-white">{item.stock}</td>
        <td className="p-2 px-6 dark:text-white">
          <button onClick={() => onEdit(item)} className="mr-2 text-blue-500">
            <FaEdit />
          </button>
          <button onClick={() => onDelete(item.product_id)} className="text-red-500">
            <FaTrashAlt />
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" className="text-center py-3 px-6 text-gray-500">
        No data available
      </td>
    </tr>
  )}
</tbody>

      </table>
    </div>
  );
};

export default Table;
