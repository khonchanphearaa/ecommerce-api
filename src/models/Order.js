import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true, /* copied form Porduct.price */
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
    },

    /* Add address */
    totalQuantity: {type: Number, required: true},
    deliveryAddress: {type: String, required: true},
    phoneNumber: {type: String},
    paymentMethod: { type: String, enum: ["BAKONG_KHQR", "CASH", "CARD"], default: "BAKONG_KHQR" },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "SHIPPED", "CANCELLED"],
      default: "PENDING",
    },
    transactionRef: {type: String},
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
