const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

// Calculate Cart Total
async function calculateTotal(cart) {
  let total = 0;

  for (const item of cart.products) {
    const product = await Product.findById(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }

  cart.totalPrice = total;
}

// Get Cart
router.get("/", auth, async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate("products.product");

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        products: [],
        totalPrice: 0,
      });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add Product
router.post("/add", auth, async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        products: [],
      });
    }

    const item = cart.products.find(
      p => p.product.toString() === productId
    );

    if (item) {
      item.quantity++;
    } else {
      cart.products.push({
        product: productId,
        quantity: 1,
      });
    }

    await calculateTotal(cart);
    await cart.save();

    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Increase Quantity
router.put("/increase/:productId", auth, async (req, res) => {
  try {

    const cart = await Cart.findOne({ user: req.user.id });

    const item = cart.products.find(
      p => p.product.toString() === req.params.productId
    );

    if (!item)
      return res.status(404).json({ message: "Item not found" });

    item.quantity++;

    await calculateTotal(cart);
    await cart.save();

    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Decrease Quantity
router.put("/decrease/:productId", auth, async (req, res) => {
  try {

    const cart = await Cart.findOne({ user: req.user.id });

    const index = cart.products.findIndex(
      p => p.product.toString() === req.params.productId
    );

    if (index === -1)
      return res.status(404).json({ message: "Item not found" });

    cart.products[index].quantity--;

    if (cart.products[index].quantity <= 0) {
      cart.products.splice(index, 1);
    }

    await calculateTotal(cart);
    await cart.save();

    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove Item
router.delete("/remove/:productId", auth, async (req, res) => {
  try {

    const cart = await Cart.findOne({ user: req.user.id });

    cart.products = cart.products.filter(
      p => p.product.toString() !== req.params.productId
    );

    await calculateTotal(cart);
    await cart.save();

    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Checkout
router.post("/checkout", auth, async (req, res) => {
  try {

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    cart.products = [];
    cart.totalPrice = 0;

    await cart.save();

    res.json({
      message: "Order placed successfully!",
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;