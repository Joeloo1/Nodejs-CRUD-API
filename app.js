const express = require("express");
const morgan = require("morgan");

const productRouter = require("./routes/productrouter");

const app = express();

app.use(morgan("tiny"));

app.use(express.json());

app.use("/api/v1/products", productRouter);

module.exports = app;
