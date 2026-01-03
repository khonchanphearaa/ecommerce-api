// src/models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "KHR",   /* Cambodia Reil */
    },

    paymentMethod: {
      type: String,
      enum: ["BAKONG_KHQR", "CASH"],
      default: "BAKONG_KHQR",
    },

    /* Generated QR data */
    khqrString:{type: String},

    /* Optional: customer/bank transcation reference */
    transactionRef: {type: String},
    stripePaymentIntentId: {
      type: String,
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
