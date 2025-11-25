const express = require("express");
const morgan = require("morgan");

const productRouter = require("./routes/productrouter");
const globalErrorHandler = require('./controller/errorController');
const AppError = require("./utils/appError");

const app = express();

app.use(morgan("tiny"));

app.use(express.json());

app.use("/api/v1/products", productRouter);

// HANDLING unhandled routes 
app.use( (req, res, next) => {
   next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
});

app.use(globalErrorHandler);

module.exports = app;
