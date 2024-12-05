const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const orderRoutes = require("./routes/orders");
const dbURI = process.env.MONGO_URI;

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://ordermanager-client.vercel.app", // Frontend URL
    methods: "GET,POST,PUT,DELETE, PATCH",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);

// Root Route to check if server is up and connected
app.get("/", (req, res) => {
  res.send("Server is up and running, connected to MongoDB.");
});

// MongoDB Connection
mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

// Set the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
