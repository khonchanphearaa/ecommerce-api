import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// Create Order from Cart
export const createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate("items.product");
    if (!cart || cart.items.length === 0)
      return res.status(400).json({ message: "Cart is empty" });

    let totalPrice = 0;
    const orderItems = cart.items.map((item) => {
      totalPrice += item.product.price * item.quantity;
      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price
      };
    });

    const order = await Order.create({
      user: req.userId,
      items: orderItems,
      totalPrice,
    });

    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order created", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


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

    order.status = status || order.status;
    if (isPaid !== undefined) order.isPaid = isPaid;

    await order.save();
    res.json({ message: "Order updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
