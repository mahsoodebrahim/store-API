require("dotenv").config();
require("express-async-errors");
const express = require("express");

const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandleMiddleware = require("./middleware/error-handler");

const app = express();

// Middleware
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>');
});

app.use("/api/v1/products", productsRouter);

app.use(notFoundMiddleware);
app.use(errorHandleMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
