const express = require("express");
const productcontroller = require("./../controller/productcontroller");

const router = express.Router();

router
  .route("/")
  .get(productcontroller.getAllProduct)
  .post(productcontroller.createProduct);

router
  .route("/:id")
  .get(productcontroller.getProduct)
  .patch(productcontroller.updateProduct)
  .delete(productcontroller.deleteProduct);

module.exports = router;
