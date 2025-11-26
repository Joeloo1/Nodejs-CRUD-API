const Product = require("./../models/productmodel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require('./../utils/catchAsync')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

// GET ALL PROSUCTS
exports.getAllProduct = catchAsync(async (req, res) => {
    const features = new APIFeatures(Product.find().select('-reviews'), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const products = await features.query;

    res.status(200).json({
      status: "Success",
      result: products.length,
      data: {
        products,
      },
    });
});

// CREATE PRODUCT
exports.createProduct = catchAsync(async (req, res) => {
    const newProduct = await Product.create(req.body);

    res.status(200).json({
      status: "Success",
      data: {
        product: newProduct,
      },
    });
});

// GET PRODUCT
exports.getProduct = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);

    res.status(200).json({
      status: "Success",
      data: {
        product,
      },
    });
});

// UPDATE PRODUCT
exports.updateProduct = catchAsync( async (req, res) => {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "Success",
      data: {
        product,
      },
    });
});

// DELETE PRODUCT
exports.deleteProduct = catchAsync(async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: "Success",
      data: null,
    });
});
