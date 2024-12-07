const mongoose = require("mongoose");

// Define the Order schema
const orderSchema = new mongoose.Schema(
  {
    serviceName: { type: String, required: true },
    customerName: { type: String, required: true },
    agent: { type: String, required: true },
    deliveryDate: { type: Date },
    cost: { type: Number, required: true },
    paidAmount: { type: Number, required: true }, // Paid amount field
    status: { type: String, default: "agreement" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    username: { type: String }, // New field
    password: { type: String }, // New field
    birthdate: { type: Date, required: true }, // New field
    moreInfo: { type: String }, // Optional field for additional info
  },
  { timestamps: true }
);

// Export the model
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
