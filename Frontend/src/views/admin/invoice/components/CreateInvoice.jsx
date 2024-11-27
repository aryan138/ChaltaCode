// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { PlusIcon, TrashIcon, UploadIcon } from '@heroicons/react/outline';
// import { toast } from 'react-toastify';
// import axios from 'axios';

// // API Client with Axios
// const api = axios.create({
//   baseURL: 'http://localhost:3000/',
//   withCredentials: true // Important for sending cookies
// });

// const CreateInvoice = () => {
//   const [products, setProducts] = useState([]);
//   const [customer, setCustomer] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: ''
//   });
//   const [items, setItems] = useState([
//     { product: '', quantity: 1, unitPrice: 0, totalPrice: 0 }
//   ]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [logo, setLogo] = useState(null);
//   const logoInputRef = useRef(null);
//   const navigate = useNavigate();

//   // Fetch products from inventory
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await api.get('http://localhost:3000/products/getall');
        
//         if (response.data && response.data.products) {
//           setProducts(response.data.products);
//         } else {
//           toast.error('Unexpected product data format');
//           console.error('Unexpected product response:', response.data);
//         }
//       } catch (error) {
//         console.error('Error fetching products', error);
//         toast.error('Failed to fetch products');
//       }
//     };
//     fetchProducts();
//   }, []);

//   // Handle logo upload
//   const handleLogoUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setLogo(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Update item when product or quantity changes
//   const updateItem = (index, field, value) => {
//     const newItems = [...items];
//     newItems[index][field] = value;

//     // If product is selected, set unit price
//     if (field === 'product') {
//       const selectedProduct = products.find(p => p._id === value);
//       if (selectedProduct) {
//         newItems[index].unitPrice = selectedProduct.price;
//         newItems[index].maxQuantity = selectedProduct.stock;
//       } else {
//         newItems[index].unitPrice = 0;
//         newItems[index].maxQuantity = 1;
//       }
//     }

//     // Validate quantity
//     if (field === 'quantity') {
//       const parsedQuantity = parseInt(value);
//       const maxQuantity = newItems[index].maxQuantity || 1;
      
//       newItems[index].quantity = Math.min(
//         Math.max(1, parsedQuantity || 1), 
//         maxQuantity
//       );
//     }

//     // Calculate total price for the item
//     newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice;

//     // Calculate total amount
//     const newTotalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);

//     setItems(newItems);
//     setTotalAmount(newTotalAmount);
//   };

//   // Add new item row
//   const addItem = () => {
//     setItems([
//       ...items, 
//       { product: '', quantity: 1, unitPrice: 0, totalPrice: 0 }
//     ]);
//   };

//   // Remove item row
//   const removeItem = (index) => {
//     const newItems = items.filter((_, i) => i !== index);
//     setItems(newItems);
    
//     // Recalculate total amount
//     const newTotalAmount = newItems.reduce((sum, item) => sum + item.totalPrice, 0);
//     setTotalAmount(newTotalAmount);
//   };

//   // Validate form before submission
//   const validateForm = () => {
//     // Check if customer details are filled
//     if (!customer.name) {
//       toast.error('Customer name is required');
//       return false;
//     }

//     // Check if items are valid
//     if (items.length === 0) {
//       toast.error('Please add at least one item');
//       return false;
//     }

//     // Check if all items have a product selected
//     const invalidItems = items.some(item => !item.product);
//     if (invalidItems) {
//       toast.error('Please select a product for all items');
//       return false;
//     }

//     // Check if quantities are valid
//     const invalidQuantities = items.some(item => {
//       const product = products.find(p => p._id === item.product);
//       return !product || item.quantity > product.stock;
//     });
//     if (invalidQuantities) {
//       toast.error('Invalid product quantities or insufficient stock');
//       return false;
//     }

//     return true;
//   };

//   // Submit invoice
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validate form
//     if (!validateForm()) {
//       return;
//     }

//     try {
//       // Prepare invoice data
//       const invoiceData = {
//         customer: {
//           name: customer.name,
//           email: customer.email || '',
//           phone: customer.phone || '',
//           address: customer.address || ''
//         },
//         items: items.map(item => ({
//           product: item.product,
//           quantity: item.quantity,
//           unitPrice: item.unitPrice,
//           totalPrice: item.totalPrice
//         })),
//         subtotal: totalAmount,
//         totalAmount: totalAmount,
//         status: 'DRAFT'
//       };

//       // Send invoice creation request
//       const response = await api.post('/invoices/create-invoice', invoiceData);

//       // Show success message
//       toast.success('Invoice created successfully');

//       // Navigate to invoices list
//       navigate('//invoice');
//     } catch (error) {
//       console.error('Error creating invoice', error);
      
//       // Handle specific error messages
//       const errorMessage = error.response?.data?.message || 'Failed to create invoice';
//       toast.error(errorMessage);
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-3xl font-bold text-gray-800">Create Invoice</h2>
        
//         {/* Logo Upload */}
//         <div className="flex items-center">
//           <input
//             type="file"
//             ref={logoInputRef}
//             onChange={handleLogoUpload}
//             accept="image/*"
//             className="hidden"
//           />
//           <button
//             type="button"
//             onClick={() => logoInputRef.current.click()}
//             className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//           >
//             <UploadIcon className="h-5 w-5 mr-2" />
//             Upload Logo
//           </button>
//           {logo && (
//             <img 
//               src={logo} 
//               alt="Company Logo" 
//               className="ml-4 h-16 w-16 object-contain"
//             />
//           )}
//         </div>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Customer Details Grid */}
//         <div className="grid grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Customer Name *
//             </label>
//             <input
//               type="text"
//               placeholder="Enter customer name"
//               value={customer.name}
//               onChange={(e) => setCustomer({...customer, name: e.target.value})}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           {/* Other customer input fields remain the same */}
//         </div>

//         {/* Invoice Items Table */}
//         <div className="bg-gray-50 p-4 rounded-md">
//           <div className="grid grid-cols-6 gap-4 mb-4 font-semibold text-gray-700">
//             <div className="col-span-3">Product</div>
//             <div>Quantity</div>
//             <div>Unit Price</div>
//             <div>Total Price</div>
//             <div>Actions</div>
//           </div>

//           {items.map((item, index) => (
//             <div key={index} className="grid grid-cols-6 gap-4 mb-3 items-center">
//               <div className="col-span-3">
//                 <select
//                   value={item.product}
//                   onChange={(e) => updateItem(index, 'product', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 >
//                   <option value="">Select Product</option>
//                   {products.map(product => (
//                     <option key={product._id} value={product._id}>
//                       {product.name} (Stock: {product.stock})
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <input
//                   type="number"
//                   value={item.quantity}
//                   onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
//                   min="1"
//                   max={products.find(p => p._id === item.product)?.stock || 1}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <input
//                   type="number"
//                   value={item.unitPrice}
//                   readOnly
//                   className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <input
//                   type="number"
//                   value={item.totalPrice}
//                   readOnly
//                   className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
//                 />
//               </div>
//               <div>
//                 <button 
//                   type="button"
//                   onClick={() => removeItem(index)}
//                   className="text-red-500 hover:bg-red-50 p-2 rounded-full"
//                 >
//                   <TrashIcon className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>
//           ))}

//           <button 
//             type="button"
//             onClick={addItem}
//             className="flex items-center text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md"
//           >
//             <PlusIcon className="h-5 w-5 mr-2" />
//             Add Item
//           </button>
//         </div>

//         {/* Total Amount and Submit */}
//         <div className="flex justify-between items-center">
//           <div className="text-2xl font-bold text-gray-800">
//             Total Amount: ${totalAmount.toFixed(2)}
//           </div>
//           <button 
//             type="submit"
//             className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//           >
//             Create Invoice
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateInvoice;


