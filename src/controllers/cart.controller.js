import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Get User Cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate("items.product");
    if (!cart) return res.json({ message: "Cart is empty", items: [] });
    res.json({ message: "Cart fetched", items: cart.items });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add Item to Cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      cart = await Cart.create({ user: req.userId, items: [{ product: productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    res.json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Cart Item
export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ message: "Product not in cart" });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.json({ message: "Cart item updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Remove Item from Cart
export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    res.json({ message: "Cart item removed", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
