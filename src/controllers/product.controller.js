import Product from "../models/Product.js";
import { v2 as cloudinary } from "cloudinary";

// Create Product (Admin)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const images = [];

    // Upload images to Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "ecommerce/products",
          width: 500,    
          height: 500,
          crop: "fill",
          gravity: "auto",
        });
        images.push(result.secure_url); // Cloudinary URL
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      images,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.json({ message: "Products fetched", data: products });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Product By ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product fetched", data: product });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Product (Admin)
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Update fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.category = category || product.category;

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
      const images = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "ecommerce/products",
        });
        images.push(result.secure_url);
      }
      product.images = images;
    }

    await product.save();
    res.json({ message: "Product updated", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete Product (Admin)
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.remove();
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
