const express = require("express");
const Order = require("../models/Order");
const authenticateToken = require("../middleware/auth");

const router = express.Router();

// Create Order
router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      serviceName,
      customerName,
      agent,
      deliveryDate,
      cost,
      paidAmount,
      status,
      username,
      password,
      birthdate,
      moreinfo,
    } = req.body;

    // Ensure the user is authenticated
    const userId = req.user.id; // The ID from the authenticated user

    // Create the order
    const order = new Order({
      serviceName,
      customerName,
      agent,
      deliveryDate,
      cost,
      paidAmount,
      status,
      username,
      password,
      birthdate,
      moreinfo,
      userId, // Assign userId as a foreign key
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Orders for User
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // The ID from the authenticated user

    // Find all orders associated with the user
    const orders = await Order.find({ userId });
    res.status(200).json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch("/:id/status", authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id; // Get the authenticated user's ID

    // Find the order by ID and verify the user
    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      return res.status(404).json({ error: "Order not found or unauthorized" });
    }

    // Update the order fields as necessary
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { ...req.body }, // Update with the new data
      { new: true } // Return the updated order
    );

    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//single order fetch

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id; // Extract order ID from the URL
    const userId = req.user.id; // The authenticated user's ID from the token

    // Find the order by ID and ensure it belongs to the authenticated user
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ error: "Order not found or unauthorized" });
    }

    // Respond with the order details
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    // Get paidAmount from the request body and ensure it's a valid number
    let { paidAmount } = req.body;
    paidAmount = parseFloat(paidAmount);

    if (isNaN(paidAmount)) {
      return res.status(400).json({ error: "Invalid paidAmount value" });
    }

    // Find the order by ID and ensure it belongs to the authenticated user
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ error: "Order not found or unauthorized" });
    }

    // Increment the paid amount with the new value
    order.paidAmount += paidAmount;

    // Save the updated order
    await order.save();

    res.status(200).json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
