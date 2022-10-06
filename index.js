const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
  console.log("Connected to database Successfully");
});

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.listen(3001, () => {
  console.log("Hello Bharat, Backend is running successfully");
});

// Bharat Sharma
