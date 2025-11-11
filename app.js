const express = require("express");
const morgan = require("morgan");

const productRouter = require("./routes/productrouter");

const app = express();

app.use(morgan("tiny"));

app.use(express.json());

app.use("/api/v1/products", productRouter);

// HANDLING unhandled routes 
app.use('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server`
    })
})

module.exports = app;
