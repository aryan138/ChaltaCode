const express = require("express");
const crypto = require("crypto");
const order = require("../models/order");
const mail = require("../helper/orderMail");
const Inventory = require("../models/inventory");
const BranchInventory = require("../models/inventoryBranch");

// Place Order
const placeorder = async (req, res) => {
  try {
    const inputData = req.body;
    const {branch_id} = req.user;
    if (!inputData) {
      return res.status(400).json({
        message: "failed",
        status: "400",
        error: "Please provide details",
      });
    }

    const {product_name,product_quantity} = inputData;
    const productName = product_name;
    const productQuantity = product_quantity;

    if (!productName || !productQuantity) {
      return res.status(400).json({
        message: "failed",
        status: "400",
        error: "please fill the empty fields",
      });
    }

    const createOrder = await order.create({
      product_name: productName,
      product_quantity: productQuantity,
    });
    createOrder.order_id = `profitex-${createOrder._id}`;
    createOrder.branch_id = branch_id;

    // Generate unique tokens for accept/reject links
    const acceptToken = crypto.randomBytes(16).toString("hex");
    const rejectToken = crypto.randomBytes(16).toString("hex");

    createOrder.acceptToken = acceptToken;
    createOrder.rejectToken = rejectToken;
    await createOrder.save();

    const baseUrl = req.protocol + "://" + req.get("host");
    const acceptUrl = `${baseUrl}/order/accept/${createOrder._id}/${acceptToken}`;
    const rejectUrl = `${baseUrl}/order/reject/${createOrder._id}/${rejectToken}`;

    const recipientEmail = "amansharma11753@gmail.com";
    const mailContent = `
            <div style="width:94%; padding:3%; padding-top:0.6%; background: linear-gradient(to right, #050321, #000000);">
                <h1 style="font-size: 70px; color: #ffffff; text-align:center ">Profitex</h1>
                <p style="font-size: 16px; line-height: 1.5; color: #ffffff;">
                    Profitex is an advanced smart billing management system designed to streamline and optimize your business operations. With its intuitive dashboard, Profitex provides a comprehensive overview of your financial health, enabling you to track key metrics at a glance. The system's powerful order tables simplify order management, allowing you to efficiently process and monitor transactions.
                </p>
                <p style="font-size: 16px; line-height: 1.5; color: #ffffff;">
                    Profitex's robust inventory management tools ensure that you keep accurate track of stock levels, reducing the risk of overstocking or stockouts. Additionally, the seamless invoicing feature automates the billing process, generating precise invoices and minimizing errors. By integrating these essential functions into a single platform, Profitex enhances efficiency, reduces administrative burdens, and supports smarter business decisions.
                </p>
                <p style="font-size: 18px; font-weight: bold; color: #ffffff;">New order placed:</p>
                <p style="font-size: 16px; color: #ffffff;">
                    <strong>Product Name:</strong> ${productName}
                </p>
                <p style="font-size: 16px; color: #ffffff;">
                    <strong>Product Quantity:</strong> ${productQuantity}
                </p>
                <p style="font-size: 16px; margin-top: 20px;">
                    <a href="${acceptUrl}" style="display: inline-block; padding: 10px 20px; color: white; background-color: green; text-decoration: none; border-radius: 5px;">Accept Order</a>
                </p>
                <p style="font-size: 16px; margin-top: 10px;">
                    <a href="${rejectUrl}" style="display: inline-block; padding: 10px 20px; color: white; background-color: red; text-decoration: none; border-radius: 5px;">Reject Order</a>
                </p>
            </div>    
        `;

    // Send email
    await mail.SendMail(recipientEmail, "New Order", mailContent);

    console.log(createOrder);

    return res.status(200).json({
      message: "success",
      status: 200,
      data: createOrder,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// Get All Orders
const getOrder = async (req, res) => {
  try {
    console.log("reqrest", req.user);
    const {branch_id} = req.user;
    const getData = await order.find({branch_id:branch_id});
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
    const id = req.params.id;
    const inputData = req.body;
    const updateData = await order.findByIdAndUpdate(id, inputData, {
      new: true,
    });
    if (!updateData) {
      return res.status(404).json({
        message: "Order not found",
      });
    }
    res.json({
      status: 200,
      message: "Order Updated",
      data: updateData,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Delete Order
const deleteorder = async (req, res) => {
  try {
    const id = req.params.id;
    const deleteData = await order.findByIdAndDelete(id);
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
    res.status(500).send(err.message);
  }
};

const acceptOrder = async (req, res) => {
  try {
    const { id, token } = req.params;
    console.log(`Accepting order with ID: ${id} and Token: ${token}`);

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

    let inventoryItem = await Inventory.findOne({
      item_name: productName,
    });

    if (inventoryItem) {
      inventoryItem.item_quantity += productQuantity;
    } else {
      inventoryItem = new Inventory({
        item_id: `inventory_${productName}`,
        item_quantity: productQuantity,
        inventoryBranch: null,
      });
    }

    await inventoryItem.save();

    //        ye code superInventory ka h
    //         const adminInventory = await AdminInventory.findOne({ item_name: productName });
    //         if (!adminInventory || adminInventory.item_quantity < productQuantity) {
    //             return res.status(400).json({
    //                 message: "Not enough inventory in admin's stock"
    //             });
    //         }

    //         // Subtract
    //         adminInventory.item_quantity -= productQuantity;
    //         await adminInventory.save();

    orderData.status = "accepted";
    await orderData.save();

    console.log(`Order status updated to accepted for ID: ${id}`);

    res.status(200).json({
      message: "Order accepted and inventory updated",
      data: orderData,
    });
  } catch (err) {
    console.error(`Error accepting order: ${err.message}`);
    res.status(500).json({
      message: err.message,
    });
  }
};

// Reject order
const rejectOrder = async (req, res) => {
  try {
    const { id, token } = req.params;
    console.log(`Rejecting order with ID: ${id} and Token: ${token}`);
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

    console.log(`Order status updated to rejected for ID: ${id}`);

    res.status(200).json({
      message: "Order rejected",
      data: orderData,
    });
  } catch (err) {
    console.error(`Error rejecting order: ${err.message}`);
    res.status(500).json({
      message: err.message,
    });
  }
};

const clearOrders = async (req, res) => {
  try {
    await order.deleteMany({});
    res.status(200).json({
      message: "All orders have been cleared",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error clearing orders",
      error: err.message,
    });
  }
};

module.exports = {
  placeorder,
  getOrder,
  getOrderById,
  updateorder,
  deleteorder,
  acceptOrder,
  rejectOrder,
  clearOrders,
};
