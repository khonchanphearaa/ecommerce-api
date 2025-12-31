import dotenv from "dotenv";
dotenv.config(); // MUST be at the top

import Payment from "../models/Payment.js"
import Order from "../models/Order.js";
import Product from "../models/Product.js"
import mongoose from "mongoose";
import QRCode from "qrcode";


/* Utility to generate KHQR string */
const generateKHQR = (amount) => {
  const baseQR = process.env.ABA_STATIC_KHQR;

  const khrAmount = Math.round(amount); // no decimals
  const amountStr = khrAmount.toString();

  const amountField = `54${amountStr.length.toString().padStart(2, "0")}${amountStr}`;

  return baseQR.replace("5802KH", `${amountField}5802KH`);
};


export const createBakongPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if(order.isPaid || order.status !== "PENDING"){
      return res.status(400).json({message: "Order already paid or invalid"});
    }

    /* Prevent duplicate payment */
    const existingPayment = await Payment.findOne({
      order: orderId,
      status: "PENDING",
    });

    if(existingPayment){
      return res.json({
        message: "Payment alreay exists",
        paymentId: existingPayment._id,
        khqrString: existingPayment.khqrString,
      });
    }

    // const khqrString = process.env.ABA_STATIC_KHQR; // ✅ SAFE
    const khqrString = generateKHQR(order.totalPrice);
    const payment = await Payment.create({
      user: order.user,
      order: order._id,
      amount: order.totalPrice,
      paymentMethod: "BAKONG_KHQR",
      khqrString,
      status: "PENDING",
    });

    res.json({
      message: "Scan with ABA / Bakong",
      amount: order.totalPrice,
      khqrString,
      paymentId: payment._id,
    });
  } catch (err) {
    res.status(500).json({ message: "Payment failed" });
  }
};


// Example: safer manual confirmation
export const confirmBakongPayment = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { paymentId, transactionRef } = req.body;

    const payment = await Payment.findById(paymentId)
      .populate("order")
      .session(session);

    if (!payment)
      return res.status(404).json({ message: "Payment not found" });

    if (payment.status === "PAID")
      return res.status(400).json({ message: "Already paid" });

    const order = payment.order;

    if (order.isPaid)
      return res.status(400).json({ message: "Order already paid" });

    // Re-check stock safely
    for (const item of order.items) {
      const product = await Product.findById(item.product).session(session);

      if (!product || product.stock < item.quantity) {
        throw new Error("Insufficient stock");
      }

      product.stock -= item.quantity;
      await product.save({ session });
    }

    payment.status = "PAID";
    payment.transactionRef = transactionRef;
    await payment.save({ session });

    order.status = "PAID";
    order.isPaid = true;
    order.paidAt = new Date();
    await order.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.json({ message: "Payment confirmed successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};


export const getKHQRImage = async (req, res) => {
  try {
    const { khqrString, paymentId } = req.body;

    let qrString = khqrString;

    if (!qrString && paymentId) {
      const payment = await Payment.findById(paymentId);
      if (!payment) return res.status(404).json({ message: "Payment not found" });
      qrString = payment.khqrString;
    }

    if (!qrString) return res.status(400).json({ message: "khqrString is required" });

    const qrDataUrl = await QRCode.toDataURL(qrString);

    res.json({ message: "QR code generated", qrDataUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to generate QR code" });
  }
};


