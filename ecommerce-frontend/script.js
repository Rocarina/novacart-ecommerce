// Backend API URL
const API = "http://localhost:3000";

// Authentication Token
let token = localStorage.getItem("token") || "";

// ==========================================
// Check Login Status
// ==========================================

window.onload = function () {

    if (token) {

        document.getElementById("registerSection").style.display = "none";
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("storeSection").style.display = "block";

        loadProducts();
        loadCart();

    } else {

        document.getElementById("registerSection").style.display = "block";
        document.getElementById("loginSection").style.display = "block";
        document.getElementById("storeSection").style.display = "none";

    }

};

// ==========================================
// Register User
// ==========================================

async function registerUser() {

    const name = document.getElementById("registerName").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

    if (!name || !email || !password) {
        alert("Please fill all the fields.");
        return;
    }

    try {

        const res = await axios.post(`${API}/auth/register`, {
            name,
            email,
            password
        });

        alert(res.data.message || "Registration Successful!");

        document.getElementById("registerName").value = "";
        document.getElementById("registerEmail").value = "";
        document.getElementById("registerPassword").value = "";

    } catch (err) {

        console.log(err);

        alert(
            err.response?.data?.message ||
            "Registration failed."
        );

    }

}

// ==========================================
// Login User
// ==========================================

async function loginUser() {

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (!email || !password) {

        alert("Please enter email and password.");

        return;

    }

    try {

        const res = await axios.post(`${API}/auth/login`, {
            email,
            password
        });

        token = res.data.token;

        localStorage.setItem("token", token);

        alert("Login Successful!");

        document.getElementById("registerSection").style.display = "none";
        document.getElementById("loginSection").style.display = "none";
        document.getElementById("storeSection").style.display = "block";

        document.getElementById("loginEmail").value = "";
        document.getElementById("loginPassword").value = "";

        loadProducts();
        loadCart();

    } catch (err) {

        console.log(err);

        alert(
            err.response?.data?.message ||
            "Invalid email or password."
        );

    }

}

// ==========================================
// Logout User
// ==========================================

function logoutUser() {

    localStorage.removeItem("token");

    token = "";

    document.getElementById("registerSection").style.display = "block";
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("storeSection").style.display = "none";

    alert("Logged out successfully!");

}

// ==========================================
// Load Products
// ==========================================

async function loadProducts() {

    try {

        const search = document.getElementById("search").value.trim();
        const category = document.getElementById("category").value;

        let url = `${API}/products?`;

        if (search) {
            url += `search=${encodeURIComponent(search)}&`;
        }

        if (category !== "All") {
            url += `category=${encodeURIComponent(category)}`;
        }

        const res = await axios.get(url);

        const productList = document.getElementById("productList");

        productList.innerHTML = "";

        if (res.data.length === 0) {

            productList.innerHTML = `
                <h2 style="grid-column:1/-1;text-align:center;color:#64748b;">
                    No products found.
                </h2>
            `;

            return;
        }

        res.data.forEach(product => {

            productList.innerHTML += `

                <div class="product">

                    <img src="${product.image}" alt="${product.name}">

                    <div class="product-content">

                        <span class="category">
                            ${product.category}
                        </span>

                        <h3>${product.name}</h3>

                        <p>${product.description}</p>

                        <div class="price">
                            ₹${product.price}
                        </div>

                        <span class="stock">
                            ${product.stock} Available
                        </span>

                        <button onclick="addToCart('${product._id}')">

                            <i class="fa-solid fa-cart-shopping"></i>

                            Add to Cart

                        </button>

                    </div>

                </div>

            `;

        });

    }

    catch (err) {

        console.log(err);

        alert("Unable to load products.");

    }

}

// ==========================================
// Add Product To Cart
// ==========================================

async function addToCart(productId) {

    if (!token) {

        alert("Please login first.");

        return;

    }

    try {

        const res = await axios.post(

            `${API}/cart/add`,

            {

                productId

            },

            {

                headers:{

                    Authorization:token

                }

            }

        );

        alert(res.data.message || "Product added to cart!");

        loadCart();

    }

    catch(err){

        console.log(err);

        alert(

            err.response?.data?.message ||

            "Could not add product."

        );

    }

}

// ==========================================
// Increase Quantity
// ==========================================

async function increaseQuantity(productId) {

    try {

        await axios.put(
            `${API}/cart/increase/${productId}`,
            {},
            {
                headers: {
                    Authorization: token
                }
            }
        );

        loadCart();

    } catch (err) {
        alert("Unable to increase quantity.");
    }

}

// ==========================================
// Decrease Quantity
// ==========================================

async function decreaseQuantity(productId) {

    try {

        await axios.put(
            `${API}/cart/decrease/${productId}`,
            {},
            {
                headers: {
                    Authorization: token
                }
            }
        );

        loadCart();

    } catch (err) {
        alert("Unable to decrease quantity.");
    }

}

// ==========================================
// Remove Item
// ==========================================

async function removeItem(productId) {

    try {

        await axios.delete(
            `${API}/cart/remove/${productId}`,
            {
                headers: {
                    Authorization: token
                }
            }
        );

        loadCart();

    } catch (err) {
        alert("Unable to remove item.");
    }

}

// ==========================================
// Load Cart
// ==========================================

async function loadCart() {

    if (!token) return;

    try {

        const res = await axios.get(`${API}/cart`, {

            headers: {
                Authorization: token
            }

        });

        const cart = document.getElementById("cart");

        cart.innerHTML = "";

        // Empty Cart
        if (!res.data.products || res.data.products.length === 0) {

            cart.innerHTML = `

                <div class="empty-cart">

                    <i class="fa-solid fa-cart-shopping"
                    style="font-size:60px;color:#94a3b8;"></i>

                    <h2>Your Cart is Empty</h2>

                    <p>Looks like you haven't added anything yet.</p>

                </div>

            `;

            return;

        }

        let total = 0;

        res.data.products.forEach(item => {

            const subtotal = item.product.price * item.quantity;

            total += subtotal;

            cart.innerHTML += `

                <div class="cart-item">

                    <div class="cart-details">

                        <h3>${item.product.name}</h3>

                        <p><strong>Category:</strong> ${item.product.category}</p>

                        <p><strong>Price:</strong> ₹${item.product.price}</p>

                        <div class="qty-controls">

                            <button onclick="decreaseQuantity('${item.product._id}')">−</button>

                            <span>${item.quantity}</span>

                            <button onclick="increaseQuantity('${item.product._id}')">+</button>

                            <button class="remove-btn"
                                onclick="removeItem('${item.product._id}')">

                                🗑 Remove

                            </button>

                        </div>

                    </div>

                    <div class="cart-price">

                        ₹${subtotal}

                    </div>

                </div>

            `;

        });

        cart.innerHTML += `

            <div class="cart-total">

                Grand Total

                <br><br>

                ₹${total}

            </div>

        `;

    }

    catch (err) {

        console.log(err);

        alert("Could not load cart.");

    }

}

// ==========================================
// Open Checkout Modal
// ==========================================

function showCheckoutForm() {

    const cart = document.getElementById("cart");

    if (cart.innerHTML.includes("Your Cart is Empty")) {

        alert("Your cart is empty!");

        return;

    }

    document.getElementById("checkoutModal").style.display = "flex";

}

// ==========================================
// Close Checkout Modal
// ==========================================

function closeCheckout() {

    document.getElementById("checkoutModal").style.display = "none";

}

// ==========================================
// Place Order
// ==========================================

async function placeOrder() {

    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const city = document.getElementById("customerCity").value.trim();
    const pincode = document.getElementById("customerPincode").value.trim();
    const address = document.getElementById("customerAddress").value.trim();
    const payment = document.getElementById("paymentMethod").value;

    if (
        !name ||
        !email ||
        !phone ||
        !city ||
        !pincode ||
        !address ||
        !payment
    ) {

        alert("Please fill all checkout details.");

        return;

    }

    try {

        const res = await axios.post(

            `${API}/cart/checkout`,

            {},

            {

                headers:{

                    Authorization:token

                }

            }

        );

        const orderId = "NC" + Math.floor(Math.random() * 900000 + 100000);

        document.querySelector(".modal-content").innerHTML = `

            <div class="success-card">

                <i class="fa-solid fa-circle-check"
                   style="font-size:80px;color:#22c55e;margin-bottom:20px;"></i>

                <h2>Order Placed Successfully!</h2>

                <p>

                    Thank you for shopping with
                    <strong>NovaCart</strong>

                </p>

                <br>

                <p><strong>Order ID:</strong> ${orderId}</p>

                <p><strong>Name:</strong> ${name}</p>

                <p><strong>Email:</strong> ${email}</p>

                <p><strong>Phone:</strong> ${phone}</p>

                <p>

                    <strong>Delivery Address</strong>

                    <br>

                    ${address}

                    <br>

                    ${city} - ${pincode}

                </p>

                <p>

                    <strong>Payment Method:</strong>

                    ${payment}

                </p>

                <br>

                <h3 style="color:#16a34a;">

                    Estimated Delivery:
                    3-5 Business Days

                </h3>

                <br>

                <button
                    class="primaryBtn"
                    onclick="continueShopping()">

                    Continue Shopping

                </button>

            </div>

        `;

        loadCart();

    }

    catch(err){

        console.log(err);

        alert(

            err.response?.data?.message ||

            "Could not place order."

        );

    }

}

// ==========================================
// Continue Shopping
// ==========================================

function continueShopping() {

    location.reload();

}

// ==========================================
// Close Modal When Clicking Outside
// ==========================================

window.onclick = function(event) {

    const modal = document.getElementById("checkoutModal");

    if (event.target === modal) {

        closeCheckout();

    }

};

// ==========================================
// Search Products on Enter Key
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    const search = document.getElementById("search");

    if (search) {

        search.addEventListener("keypress", function(event) {

            if (event.key === "Enter") {

                loadProducts();

            }

        });

    }

});