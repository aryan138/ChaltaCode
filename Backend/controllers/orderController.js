const express = require("express");
const crypto = require("crypto");
const order = require("../models/order");
const mail = require("../helper/orderMail");
const Product = require("../models/Product");
const SuperProduct = require("../models/superProduct");
// const superProduct = require("../models/superProduct");

const placeorder = async (req, res) => {
  
  try {

    const { product_id, product_quantity } = req.body;
    const id = req.user._id;
    const admin = req.user.user_admin;
    console.log(id,admin);
  
    if (!product_id || !product_quantity) {
      return res.status(400).json({ message: "Product ID and quantity are required" });
    }
    console.log(product_id, product_quantity);

    //find the superProduct name
    const superProduct = await SuperProduct.findById(product_id);
    if (!superProduct) res.json({
      status:401,
      message:"product not found",
    })
    const product_name = superProduct.name;
    const productId = superProduct.product_id;
    // console.log("product name is :"+product_name);

    const createOrder = await order.create({
      order_id:`profitex${productId}${parseInt(Math.random() * 100)}`,
      product_quantity: product_quantity,
      product_name: product_name
    });
    // console.log("chalra hai yaha tk",createOrder);
  

    // Generate unique tokens for accept/reject links
    const acceptToken = crypto.randomBytes(16).toString("hex");
    const rejectToken = crypto.randomBytes(16).toString("hex");

    createOrder.acceptToken = acceptToken;
    createOrder.rejectToken = rejectToken;
    createOrder.orderFrom = id;
    createOrder.orderTo = admin;
    createOrder.productOrdered_id= product_id;
    await createOrder.save();


    return res.status(200).json({
      message: "success",
      status: 200,
      data: createOrder,
    });
  } catch (err) {
    console.error("Error in placeorder:", err.message);
    return res.status(500).json({
      message: err.message,
    });
  }
};

const acceptOrder = async (req, res) => {
  try {
    const { id, token } = req.params;

    const orderData = await order.findById(id);

    if (!orderData) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (orderData.acceptToken !== token) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    const productName = orderData.product_name;
    const productQuantity = orderData.product_quantity;

    console.log("Product Name from Order:", productName);
    console.log("Order Data Retrieved:", orderData);

    // Check if the product exists in SuperProduct
    const superProductItem = await SuperProduct.findOne({
      name: new RegExp(`^${productName}$`, "i"), // Case-insensitive search
    });

    if (!superProductItem) {
      return res.status(404).json({
        message: `Product "${productName}" not found in SuperProduct`,
      });
    }

    if (superProductItem.stock < productQuantity) {
      return res.status(400).json({
        message: `Insufficient stock in SuperProduct. Available: ${superProductItem.stock}, Requested: ${productQuantity}`,
      });
    }

    // Deduct the ordered quantity from SuperProduct stock
    superProductItem.stock -= productQuantity;
    await superProductItem.save();
    console.log("SuperProduct stock updated:", superProductItem);

    // Check if the product exists in Product
    let productItem = await Product.findOne({ name: productName });

    if (productItem) {
      console.log("Product exists in Product. Updating stock...");
      productItem.stock += productQuantity;
    } else {
      console.log("Product does not exist in Product. Creating new product...");
      const uniqueProductId =` product_${productName}_${Date.now()}`;

      productItem = new Product({
        product_id: uniqueProductId,
        name: productName,
        price: superProductItem.price, // Use price from SuperProduct
        stock: productQuantity,
      });
    }

    await productItem.save();
    console.log("Product saved successfully in Product:", productItem);

    // Update order status
    orderData.status = "accepted";
    await orderData.save();

    res.status(200).json({
      message: "Order accepted, SuperProduct stock deducted, and Product stock updated",
      data: orderData,
    });
  } catch (err) {
    console.error("Error in acceptOrder:", err.message);
    res.status(500).json({
      message: err.message,
    });
  }
};


// Reject Order
const rejectOrder = async (req, res) => {
  try {
    const { id, token } = req.params;

    const orderData = await order.findById(id);

    if (!orderData) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (orderData.rejectToken !== token) {
      return res.status(400).json({
        message: "Invalid or expired token",
      });
    }

    orderData.status = "rejected";
    await orderData.save();

    res.status(200).json({
      message: "Order rejected",
      data: orderData,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Get All Orders
const getOrder = async (req, res) => {
  try {
    const id = req.user._id;
    // const getData = await order.find({orderFrom:id});
    const getData = await order.find({ orderFrom: id }).sort({ updatedAt: -1 });

    console.log(getData);
    res.json({
      status: 200,
      message: "Order Found",
      data: getData,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
const getOrderForAdmin = async (req, res) => {
  try {
    const id = req.user._id;
    // const getData = await order.find({orderTo:id});
    const getData = await order
  .find({ orderTo: id }).populate('orderFrom');


    console.log(getData);
    res.json({
      status: 200,
      message: "Order Found",
      data: getData,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Get Order by ID
const getOrderById = async (req, res) => {
  try {
    const orderData = await order.findById(req.params.id);
    if (!orderData) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    return res.status(200).json({
      message: "Order retrieved successfully",
      data: orderData,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error retrieving order",
      error: err.message,
    });
  }
};

// Update Order
const updateorder = async (req, res) => {
  try {
    console.log("Updating Order begins")
    const {adminOutput,orderId} = req.body;
    console.log(adminOutput,orderId);
    if (adminOutput=='rejected'){
      const updateData = await order.findOneAndUpdate({order_id:orderId}, {status:adminOutput}, {
        new: true,
      });
      if (!updateData){
        return res.status(404).json({
          message:"order not found"
        })
      }
      return res.status(200).json({status: 200,
      message: "Order Updated",
      data: updateData,})
    // console.log("updated order", updateData);
  }
  const Data = await order.findOne({order_id:orderId});
  
  if (!Data) {
    return res.status(400).json({
      message: "order or order not found",
    });
  }
    const productOrdered_id = Data.productOrdered_id;
    const quantityNeeded = Data.product_quantity;
    console.log("product id"+productOrdered_id);
    //check if product under superinventory are greater than quantity ordered
    const superInventoryProduct = await SuperProduct.findOne(productOrdered_id);
    if (!superInventoryProduct){
      res.status(404).json({
        message: "product not found",
      })
    }
    
    const quantityHaving = superInventoryProduct.stock;
    const productId = superInventoryProduct.product_id;
    console.log("aryan1"+quantityHaving,quantityNeeded);
    if (quantityHaving<quantityNeeded){
      console.log("phle nhi dhela chlo mela")
      return res.status(400).json({
        message:"dont have the enough quantity you should reject it"
      })
    }
    //find product in inventory of user if got than update the count else add new product
    const minusValue1 = quantityHaving-quantityNeeded;
    console.log("minus",minusValue1);
    const updatedSuperInventory = await SuperProduct.findOneAndUpdate({product_id:productId},{stock:minusValue1},{new:true})
    // console.log("updatedSuperInventory",updatedSuperInventory);
    const findProductInInventory= await Product.findOne({product_id:productId});
    console.log("aryan2"+findProductInInventory);
    if (!findProductInInventory){
      const newProductInInventory = await Product.create({
        product_id:productId,
        name:superInventoryProduct.name,
        stock:quantityNeeded,
        user:Data.orderFrom,
        price:superInventoryProduct.price

      })
      if (!newProductInInventory){
        return res.status(500).json({message:"error while adding product"})
      }
      const updateData = await order.findOneAndUpdate({order_id:orderId}, {status:adminOutput}, {
        new: true,
      });
      
      if (!updateData) {
        return res.status(400).json({
          message: "error occured while updating order or order not found",
        });
      }
      return res.status(200).json({
        status: 200,
        message: "Order Updated",
        data: updateData,
      })
    }
    const addValue = findProductInInventory.stock+quantityNeeded;
    const updatedInventory = await Product.findOneAndUpdate({product_id:productId},{stock:addValue},{new:true});
    console.log("aryan3"+updatedInventory.stock);
    if (!updatedInventory){
      return res.status(500).json({message:"error while adding product"})
    }
    const updateData = await order.findOneAndUpdate({order_id:orderId}, {status:adminOutput}, {
      new: true,
    });
    
    if (!updateData) {
      return res.status(400).json({
        message: "error occured while updating order or order not found",
      });
    }
    
    return res.json({
      status: 200,
      message: "Order Updated",
      data: updateData,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Delete Order
const deleteorder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const deleteData = await order.findOneAndDelete({ order_id: orderId });

    if (!deleteData) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      status: 200,
      message: "Order Deleted",
      data: deleteData,
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
};

// Clear All Orders
const clearOrders = async (req, res) => {
  try {
    await order.deleteMany({});
    return res.status(200).json({
      message: "All orders have been cleared",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error clearing orders",
      error: err.message,
    });
  }
};

const countOrderForAdmin = async(req,res)=>{
  try {
    const id = req.user._id;
    console.log("id"+id);
    const countOrder = await order.find({ 
      $and: [
        { orderTo: id },
        { status: 'pending' }
      ]
    }).countDocuments();
    
    if (!countOrder){
      return res.status(404).json({success:false,
        message: "Order not found under this admin"}
      )
    }
    return res.status(200).json({success:true,message:"order counted successfully",count:countOrder});
  } catch (error) {
    return res.status(500).json({success:false,message:"Error counting order",error});
  }
}
const countOrderForUser = async(req,res)=>{
  try {
    const id = req.user._id;
    const countOrder = await order.find({ 
      $and: [
        { orderFrom: id },
      ]
    }).countDocuments();
    
    if (!countOrder){
      return res.status(404).json({success:false,
        message: "Order not found under this user"}
      )
    }
    return res.status(200).json({success:true,message:"order counted successfully",count:countOrder});
  } catch (error) {
    return res.status(500).json({success:false,message:"Error counting order",error});
  }
}




module.exports = {
  placeorder,
  getOrder,
  getOrderForAdmin,
  getOrderById,
  updateorder,
  deleteorder,
  acceptOrder,
  rejectOrder,
  clearOrders,
  countOrderForAdmin,
  countOrderForUser
};