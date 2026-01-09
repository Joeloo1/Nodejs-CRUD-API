const { client } = require("../Config/redis");
const AppError = require("../utils/appError");
const Product = require("./../models/productmodel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

// GET ALL PROSUCTS
exports.getAllProduct = catchAsync(async (req, res) => {
  // Build a unique cache key
  const cacheKey = `products:all:${JSON.stringify(req.query)}`;
  // check Redis if the products are cached already
  const cachedProducts = await client.get(cacheKey);

  if (cachedProducts) {
    const products = JSON.parse(cachedProducts);

    return res.status(200).json({
      status: "Success",
      source: "cache",
      result: products.length,
      data: {
        products,
      },
    });
  }
  const features = new APIFeatures(Product.find().select("-reviews"), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const products = await features.query;

  // store result in cache
  await client.setEx(cacheKey, 3600, JSON.stringify(products));

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

  await client.del("products:all");

  res.status(200).json({
    status: "Success",
    data: {
      product: newProduct,
    },
  });
});

// GET PRODUCT
exports.getProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const cacheKey = `products:${id}`;

  const cachedProduct = await client.get(cacheKey);

  if (cachedProduct) {
    return res.status(200).json({
      status: "Success",
      source: "cache",
      data: {
        product: JSON.parse(cachedProduct),
      },
    });
  }
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  await client.setEx(cacheKey, 3600, JSON.stringify(products));

  res.status(200).json({
    status: "Success",
    data: {
      product,
    },
  });
});

// UPDATE PRODUCT
exports.updateProduct = catchAsync(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await client.del(`products:${req.params.id}`);
  await client.del(`products:all`);

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

  await client.del(`products:${req.params.id}`);
  await client.del(`products:all`);

  res.status(200).json({
    status: "Success",
    data: null,
  });
});
