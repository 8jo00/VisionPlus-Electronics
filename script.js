// Slideshow Functionality
let currentSlide = 0;
const slides = document.querySelectorAll(".slideshow-container img");

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

setInterval(nextSlide, 3000); // Change slide every 3 seconds

// Initialize slideshow
showSlide(currentSlide);

// Search Functionality
function handleSearch(event) {
    if (event.key === "Enter") {
        const searchTerm = document.getElementById("search").value.trim();
        if (searchTerm) {
            window.location.href = `tvs.html?search=${encodeURIComponent(searchTerm)}`;
        }
    }
}
// Cart Functionality
let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// Function to add items to the cart
function addToCart(itemName, price) {
    cartItems.push({ name: itemName, price: price });
    console.log(`Added ${itemName} to cart for $${price} BZD`);

    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartCount();
}

// Function to remove items from the cart
function removeFromCart(index) {
    cartItems.splice(index, 1);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    loadCartItems();
    updateCartCount();
}

// Function to update the cart count in the UI
function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = cartItems.length;
    }
}

// Function to handle search functionality
function handleSearch(event) {
    if (event.key === "Enter") {
        const searchTerm = document.getElementById("search").value.trim();
        if (searchTerm) {
            // Redirect to the jewelry page with the search term as a query parameter
            window.location.href = `tvs.html?search=${encodeURIComponent(searchTerm)}`;
        }
    }
}

// Function to filter products based on the search term
function filterProducts() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get("search");

    if (searchTerm) {
        const products = document.querySelectorAll(".product");
        products.forEach((product) => {
            const productName = product.getAttribute("data-name").toLowerCase();
            if (productName.includes(searchTerm.toLowerCase())) {
                product.style.display = "block"; // Show matching products
            } else {
                product.style.display = "none"; // Hide non-matching products
            }
        });
    }
}

// Initialize search functionality on the jewelry page
if (window.location.pathname.includes("tvs.html")) {
    filterProducts();
}

// Initialize search functionality on the contact page
if (window.location.pathname.includes("contact.html")) {
    const searchInput = document.getElementById("search");
    if (searchInput) {
        searchInput.addEventListener("keyup", handleSearch);
    }
}

// Function to load cart items and display them on the cart page
function loadCartItems() {
    const cartItemsList = document.getElementById("cart-items-list");
    const subtotalElement = document.getElementById("subtotal");
    const gstElement = document.getElementById("gst");
    const totalElement = document.getElementById("total");

    let subtotal = 0;

    if (cartItemsList) {
        cartItemsList.innerHTML = "";
    }

    cartItems.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            ${item.name} - $${item.price.toFixed(2)}
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        if (cartItemsList) {
            cartItemsList.appendChild(listItem);
        }
        subtotal += item.price;
    });

    const gst = subtotal * 0.125;
    const total = subtotal + gst;

    if (subtotalElement) {
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    }
    if (gstElement) {
        gstElement.textContent = `$${gst.toFixed(2)}`;
    }
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}

// Function to handle payment form submission
function handlePayment() {
    const paymentForm = document.getElementById("payment-form");
    if (paymentForm) {
        paymentForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Check if the cart is empty
            if (cartItems.length === 0) {
                alert("Your cart is empty. Please add items before proceeding to payment.");
                return;
            }

            // Validate payment form fields
            const cardholderName = document.getElementById("cardholder-name");
            const cardNumber = document.getElementById("card-number");
            const expirationDate = document.getElementById("expiration-date");
            const cvv = document.getElementById("cvv");

            // Check if all fields are filled
            let isValid = true;

            if (!cardholderName.value.trim()) {
                cardholderName.classList.add("invalid");
                isValid = false;
            } else {
                cardholderName.classList.remove("invalid");
            }

            if (!cardNumber.value.trim()) {
                cardNumber.classList.add("invalid");
                isValid = false;
            } else {
                cardNumber.classList.remove("invalid");
            }

            if (!expirationDate.value.trim()) {
                expirationDate.classList.add("invalid");
                isValid = false;
            } else {
                expirationDate.classList.remove("invalid");
            }

            if (!cvv.value.trim()) {
                cvv.classList.add("invalid");
                isValid = false;
            } else {
                cvv.classList.remove("invalid");
            }

            if (!isValid) {
                return; // Stop submission if any field is invalid
            }

            // Show confirmation modal
            const confirmationModal = document.querySelector(".modal");
            if (confirmationModal) {
                confirmationModal.style.display = "flex";
            }
        });
    }
}

// Function to handle the confirmation modal
function handleConfirmationModal() {
    const confirmationModal = document.querySelector(".modal");
    const confirmPaymentButton = document.getElementById("confirm-payment");
    const cancelPaymentButton = document.getElementById("cancel-payment");

    if (confirmPaymentButton) {
        confirmPaymentButton.addEventListener("click", function () {
            // Hide confirmation modal
            if (confirmationModal) {
                confirmationModal.style.display = "none";
            }

            // Display verification message
            const verificationMessage = document.querySelector(".verification-message");
            if (verificationMessage) {
                verificationMessage.innerHTML = `
                    <h3>Your purchase has been made!</h3>
                    <p>Thank you for shopping with us. Your order has been successfully processed.</p>
                `;
                verificationMessage.style.display = "block";
            }

            // Clear cart after payment
            localStorage.removeItem("cartItems");
            cartItems = [];
            updateCartCount();
            loadCartItems();

            // Redirect to home page after 5 seconds
            setTimeout(() => {
                window.location.href = "index.html";
            }, 5000);
        });
    }

    if (cancelPaymentButton) {
        cancelPaymentButton.addEventListener("click", function () {
            // Hide confirmation modal
            if (confirmationModal) {
                confirmationModal.style.display = "none";
            }
        });
    }
}

// Initialize all functionality when the page loads
document.addEventListener("DOMContentLoaded", function () {
    // Update cart count
    updateCartCount();

    // Load cart items on the cart page
    if (window.location.pathname.includes("cart.html")) {
        loadCartItems();
    }

    // Handle payment form submission
    handlePayment();

    // Handle confirmation modal
    handleConfirmationModal();

    // Filter products on the jewelry page
    if (window.location.pathname.includes("tvs.html")) {
        filterProducts();
    }

    // Initialize search functionality on the contact page
    if (window.location.pathname.includes("contact.html")) {
        const searchInput = document.getElementById("search");
        if (searchInput) {
            searchInput.addEventListener("keyup", handleSearch);
        }
    }
});



