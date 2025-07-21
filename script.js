// DOM Elements
const productContainer = document.getElementById('product-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const cartIcon = document.querySelector('.cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');
const checkoutBtn = document.querySelector('.checkout-btn');

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
    updateCart();

    // Add event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', filterProducts);
    });

    cartIcon.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    checkoutBtn.addEventListener('click', checkout);

    // Contact form submission
    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        e.target.reset();
    });

    // Newsletter form submission
    document.getElementById('newsletter-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for subscribing to our newsletter!');
        e.target.reset();
    });
});

// Display products
function displayProducts(productsToDisplay) {
    productContainer.innerHTML = '';

    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.category = product.category;

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${product.id}">BUY NOW</button>
                </div>
            </div>
        `;

        productContainer.appendChild(productCard);
    });

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Filter products by category
function filterProducts(e) {
    const filter = e.target.dataset.filter;

    // Update active button
    filterButtons.forEach(button => {
        button.classList.remove('active');
        if (button.dataset.filter === filter) {
            button.classList.add('active');
        }
    });

    // Filter products
    if (filter === 'all') {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === filter);
        displayProducts(filteredProducts);
    }
}

// Add to cart
function addToCart(e) {
    const productId = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === productId);

    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showAddToCartFeedback();
}

// Update cart UI
function updateCart() {
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        cartTotal.textContent = '0';
    } else {
        let total = 0;

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="decrease-quantity" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" data-id="${item.id}">+</button>
                    </div>
                    <div class="remove-item" data-id="${item.id}">Remove</div>
                </div>
            `;

            cartItemsContainer.appendChild(cartItem);
        });

        cartTotal.textContent = total.toFixed(2);

        // Add event listeners to quantity buttons
        document.querySelectorAll('.decrease-quantity').forEach(button => {
            button.addEventListener('click', decreaseQuantity);
        });

        document.querySelectorAll('.increase-quantity').forEach(button => {
            button.addEventListener('click', increaseQuantity);
        });

        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', removeItem);
        });
    }
}

// Toggle cart modal
function toggleCart() {
    cartModal.style.display = cartModal.style.display === 'block' ? 'none' : 'block';
}

// Decrease item quantity
function decreaseQuantity(e) {
    const productId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === productId);

    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }

    updateCart();
}

// Increase item quantity
function increaseQuantity(e) {
    const productId = parseInt(e.target.dataset.id);
    const item = cart.find(item => item.id === productId);
    item.quantity += 1;
    updateCart();
}

// Remove item from cart
function removeItem(e) {
    const productId = parseInt(e.target.dataset.id);
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    alert(`Thank you for your purchase! Total: $${cartTotal.textContent}`);
    cart = [];
    updateCart();
    toggleCart();
}

// Show feedback when adding to cart
function showAddToCartFeedback() {
    const feedback = document.createElement('div');
    feedback.className = 'add-to-cart-feedback';
    feedback.textContent = 'Item added to cart!';
    document.body.appendChild(feedback);

    setTimeout(() => {
        feedback.classList.add('show');
    }, 10);

    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(feedback);
        }, 300);
    }, 2000);
}

// Add some styles for the feedback
const feedbackStyles = document.createElement('style');
feedbackStyles.textContent = `
    .add-to-cart-feedback {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        opacity: 0;
        transition: opacity 0.3s;
        z-index: 1000;
    }
    
    .add-to-cart-feedback.show {
        opacity: 1;
    }
`;
document.head.appendChild(feedbackStyles);