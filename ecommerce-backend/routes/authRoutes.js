const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const name = req.body.name.trim();
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    console.log("========== REGISTER ==========");
    console.log("Name:", name);
    console.log("Email:", email);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("User already exists");

      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    console.log("Saved User ID:", savedUser._id);
    console.log("Saved User Email:", savedUser.email);

    // Verify immediately after saving
    const verifyUser = await User.findOne({ email });

    console.log("Verify User:", verifyUser);

    const totalUsers = await User.countDocuments();

    console.log("Total Users:", totalUsers);
    console.log("==============================");

    res.status(201).json({
      success: true,
      message: "Registration successful",
    });

  } catch (err) {

    console.log("REGISTER ERROR");
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
});

// =====================================
// Login
// =====================================
router.post("/login", async (req, res) => {

  try {

    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    console.log("=========== LOGIN ===========");
    console.log("Email:", email);

    const user = await User.findOne({ email });

    console.log("User Found:", user);

    if (!user) {

      console.log("User NOT Found");

      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });

    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log("Password Match:", isMatch);

    if (!isMatch) {

      console.log("Password Incorrect");

      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });

    }

    const token = jwt.sign(
      { id: user._id },
      "mysecretkey",
      { expiresIn: "1d" }
    );

    console.log("Login Successful");
    console.log("=============================");

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {

    console.log("LOGIN ERROR");
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

});

module.exports = router;