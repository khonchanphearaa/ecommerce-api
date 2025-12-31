import mongoose from "mongoose";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Create Order from Cart
export const createOrder = async(req, res) =>{
  const session = await mongoose.startSession();
  session.startTransaction();

  try {

    /* Add address & phoneNumber owner */
    const { deliveryAddress, phoneNumber, paymentMethod } = req.body;
    
    if(!deliveryAddress || !phoneNumber){
      return res.status(400).json({message: "Delivery address and phone number are required!"});
    }

    const cart = await Cart.findOne({user: req.userId})
    .populate("items.product")
    .session(session);

    if(!cart || cart.items.length === 0){
      return res.status(400).json({message: "Cart is empty"});
    }
    let totalPrice = 0;
    let totalQuantity = 0
    const orderItems = [];

    /* Validation stock & calculate price */
    for(const item of cart.items){
      const product = await Product.findById(item.product._id).session(session);

      if(!product){
        throw new Error("Product not found!");
      }
      
      if(item.quantity > product.stock){
        throw new Error(`Not enough stock for ${product.name}`);
      }

      /* Push item to array */
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
      
      totalPrice += product.price * item.quantity;
      totalQuantity += item.quantity;
    }

    /* Create order */
    const order = await Order.create(
      [
        {
          user: req.userId,
          items: orderItems,
          totalPrice,
          totalQuantity,
          deliveryAddress,
          phoneNumber,
          paymentMethod: paymentMethod || "BAKONG_KHQR",
          status: "PENDING",
          isPaid: false
          
        }
      ],
      {session}
    );
    
    /* Clear the cart */
    await Cart.deleteOne({user: req.userId}).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Order created sucessfully.",
      order: order[0]
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(500).json({message: error.message});
  }
}


// Get User Orders
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).populate("items.product");
    res.json({ message: "Orders fetched", orders });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order fetched", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, isPaid } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!["PAID", "SHIPPED", "CANCELLED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    order.status = status;

    if (status === "PAID") {
      order.isPaid = true;
      order.paidAt = new Date();
    }

    await order.save();
    res.json({ message: "Order updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
