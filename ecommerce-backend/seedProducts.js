require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    // Remove existing products
    await Product.deleteMany();

    const products = [
      // Electronics
        {
            name: "Wireless Mouse",
            description: "Ergonomic wireless mouse with USB receiver",
            price: 799,
            category: "Electronics",
            image: "https://novacart-ecommerce-7yvk.onrender.com/images/Wireless_Mouse.png",
            stock: 50
        },
        {
            name: "Bluetooth Headphones",
            description: "Noise cancelling wireless headphones",
            price: 2499,
            category: "Electronics",
            image: "https://novacart-ecommerce-7yvk.onrender.com/images/Bluetooth_Headphone.png",
            stock: 30
        },

        // Fashion
        {
            name: "Men's T-Shirt",
            description: "100% Cotton Regular Fit T-Shirt",
            price: 599,
            category: "Fashion",
            image: "http://localhost:3000/images/Men's_t-shirt.png",
            stock: 70
        },
        {
            name: "Running Shoes",
            description: "Comfortable lightweight sports shoes",
            price: 2999,
            category: "Fashion",
            image: "https://novacart-ecommerce-7yvk.onrender.com/images/Running_shoes.png",
            stock: 25
        },

        // Books
        {
            name: "Atomic Habits",
            description: "Build good habits and break bad ones",
            price: 499,
            category: "Books",
            image: "https://novacart-ecommerce-7yvk.onrender.com/images/Atomic_habits.jpg",
            stock: 40
        },
        {
            name: "Clean Code",
            description: "A Handbook of Agile Software Craftsmanship",
            price: 899,
            category: "Books",
            image: "https://novacart-ecommerce-7yvk.onrender.com/images/Clean_code.jpg",
            stock: 20
        },

        // Home
        {
            name: "Table Lamp",
            description: "LED Study Table Lamp",
            price: 899,
            category: "Home",
            image: "https://novacart-ecommerce-7yvk.onrender.com/images/Table_lamp.png",
            stock: 30
        },
        {
            name: "Wall Clock",
            description: "Modern Decorative Wall Clock",
            price: 699,
            category: "Home",
            image: "https://novacart-ecommerce-7yvk.onrender.com/images/Wall_clock.png",
            stock: 18
        },

        // Grocery
        {
            name: "Basmati Rice",
            description: "Premium Quality Basmati Rice 5kg",
            price: 699,
            category: "Grocery",
            image: "https://novacart-ecommerce-7yvk.onrender.com/images/Basmati_Rice.png",
            stock: 60
        },
        {
            name: "Olive Oil",
            description: "Extra Virgin Olive Oil 1L",
            price: 999,
            category: "Grocery",
            image: "https://novacart-ecommerce-7yvk.onrender.com/images/Olive_oil.jpg",
            stock: 35
        }
    ];

    await Product.insertMany(products);

    console.log("==================================");
    console.log("10 Products Added Successfully!");
    console.log("==================================");

    mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
    mongoose.connection.close();
  });