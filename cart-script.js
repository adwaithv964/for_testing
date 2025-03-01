document.addEventListener('DOMContentLoaded', () => {
    // Load cart from localStorage
    function loadCart() {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        displayCart(cart);
        updateTotal(cart);
    }

    // Display cart items
    function displayCart(cart) {
        const cartItems = document.querySelector('.cart-items');
        if (!cart || cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty.</p>';
            return;
        }
        cartItems.innerHTML = cart.map((product, index) => `
            <div class="cart-item">
                <img src="${product.image_url || ''}" alt="${product.name || 'Unknown Product'}">
                <div class="cart-item-details">
                    <p>${product.name || 'Unnamed Product'}</p>
                    <p class="price">₹${product.price || '0.00'}</p>
                </div>
                <button class="remove-btn" data-index="${index}">Remove</button>
            </div>
        `).join('');
        // Add click handlers to Remove buttons
        addRemoveButtonHandlers();
    }

    // Update total price
    function updateTotal(cart) {
        const total = cart.reduce((sum, product) => sum + (parseFloat(product.price) || 0), 0);
        document.getElementById('cart-total').textContent = total.toFixed(2);
    }

    // Handle Remove buttons
    function addRemoveButtonHandlers() {
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                cart.splice(index, 1); // Remove item from cart
                localStorage.setItem('cart', JSON.stringify(cart));
                displayCart(cart);
                updateTotal(cart);
            });
        });
    }

    // Handle Clear Cart button
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    clearCartBtn.addEventListener('click', () => {
        localStorage.removeItem('cart');
        displayCart([]);
        updateTotal([]);
    });

    // Handle Continue Shopping button
    const continueShoppingBtn = document.querySelector('.continue-shopping-btn');
    continueShoppingBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Handle Back to Top button functionality
    function setupBackToTop() {
        const backToTopBtn = document.querySelector('.back-to-top');
        if (!backToTopBtn) {
            console.error('Back to Top button not found in the DOM');
            return;
        }

        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) { // Show button after scrolling 300px down
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        // Scroll to top when button is clicked
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Initial load and setup
    loadCart();
    setupBackToTop(); // Initialize the Back to Top button
});