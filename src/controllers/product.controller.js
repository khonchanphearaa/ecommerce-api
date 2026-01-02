import Product from "../models/Product.js";
import { v2 as cloudinary } from "cloudinary";

// Create Product (Admin)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    const images = req.files.map(file => file.path); // cloudinary URLs

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      stock,
      category,
      images,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error(error);  // Make sure you see the error in terminal
    res.status(500).json({ message: error.message });
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
    product.price = price ? Number(price) : product.price;
    product.stock = stock !== undefined ? stock : product.stock;
    product.category = category || product.category;

    // Upload new images if provided
    if (req.files && req.files.length > 0) {
      // Deleted old image
      for(const oldUrl of product.images){
        const parts = oldUrl.split('/');
        const filename = parts[parts.length - 1]; // acb123.jpg
        const publicId = `ecommerce/products/${filename.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
      }
      // Replace a new image upload
      product.images = req.files.map(file => file.path);
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
    if(!product) return res.status(404).json({message: "Product not found"});

    // Delete all image form cloudinary
    for(const url of product.images){
      const parts = url.split('/');
      const filename = parts[parts.length -1 ];
      const publicId = `ecommerce/products/${filename.split('.')[0]}`;
      await cloudinary.uploader.destroy(publicId);
    }

    // await product.remove();
    await Product.deleteOne({ _id: req.params.id });
    res.json({message: "Product deleted!"});
  } catch (error) {
    console.error(error);
    res.status(500).json({message: "Server error"});
    
  }
};
