const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const auth = require("../middleware/auth");

// GET Products with Search & Filter
router.get("/", async (req, res) => {
  try {
    const { search, category } = req.query;

    let filter = {};

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (category && category !== "All") {
      filter.category = category;
    }

    const products = await Product.find(filter).sort({
      createdAt: -1,
    });

    res.json(products);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// GET Single Product
router.get("/:id", async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ADD Product
router.post("/", auth, async (req, res) => {
  try {

    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: req.body.image,
      stock: req.body.stock,
    });

    const newProduct = await product.save();

    res.status(201).json(newProduct);

  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// UPDATE Product
router.put("/:id", auth, async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    Object.assign(product, req.body);

    const updatedProduct = await product.save();

    res.json(updatedProduct);

  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// DELETE Product
router.delete("/:id", auth, async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product deleted successfully",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;