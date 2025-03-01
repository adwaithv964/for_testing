document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Toggle
    const hamburger = document.createElement('button');
    hamburger.classList.add('hamburger');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    if (navbar && navLinks) {
        navbar.insertBefore(hamburger, navLinks);
        console.log('Hamburger button added to navbar');
    } else {
        console.error('Navbar or nav-links not found in DOM');
    }

    if (hamburger) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.classList.toggle('active');
                hamburger.classList.toggle('open');
                console.log('Hamburger clicked, nav-links toggled');
            } else {
                console.error('nav-links not found when toggling');
            }
        });

        // Use touchend for mobile tap, avoiding preventDefault to ensure click works
        hamburger.addEventListener('touchend', (e) => {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks) {
                navLinks.classList.toggle('active');
                hamburger.classList.toggle('open');
                console.log('Hamburger touched, nav-links toggled');
            } else {
                console.error('nav-links not found on touch');
            }
        });

        // Optional: Log touchstart for debugging (no preventDefault)
        hamburger.addEventListener('touchstart', (e) => {
            console.log('Hamburger touch started');
        });
    } else {
        console.error('Hamburger button not created or found');
    }

    // Fetch products
    async function fetchProducts() {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const products = await response.json();
            console.log('Products received:', products); // Log products for debugging
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    function displayProducts(products) {
        const productList = document.querySelector('.product-list');
        if (!products || products.length === 0) {
            productList.innerHTML = '<p>No products available.</p>';
            return;
        }
        productList.innerHTML = products.map(product => `
            <div class="product-item" data-product='${JSON.stringify(product)}'>
                <img src="${product.image_url || ''}" alt="${product.name || 'Unknown Product'}">
                <p>${product.name || 'Unnamed Product'}</p>
                <p class="price">₹${product.price || '0.00'}</p>
                <button class="view-btn" data-product-id="${product.id || ''}">View</button>
            </div>
        `).join('');
        // Add click handlers to View buttons after rendering
        addViewButtonHandlers();
    }

    // Handle navigation links in the header
    function setupNavigationLinks() {
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1); // Get section ID (e.g., "store")
                const section = document.getElementById(sectionId) || document.querySelector(`[name="${sectionId}"]`);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    alert(`Section ${sectionId} not found. Coming soon!`);
                }
            });
        });
    }

    // Handle search bar and button functionality
    function setupSearchBar() {
        const searchBar = document.querySelector('.search-bar');
        const searchBtn = document.querySelector('.search-btn');

        if (!searchBar || !searchBtn) {
            console.error('Search bar or button not found in the DOM');
            return;
        }

        searchBar.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterProducts(searchTerm);
        });

        searchBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const searchTerm = e.target.value.toLowerCase();
                filterProducts(searchTerm);
            }
        });

        searchBtn.addEventListener('click', () => {
            const searchTerm = searchBar.value.toLowerCase();
            filterProducts(searchTerm);
        });
    }

    // Filter products based on search term
    let cachedProducts = [];
    function filterProducts(searchTerm) {
        if (cachedProducts.length === 0) {
            fetchProducts().then(products => {
                cachedProducts = products;
                applyFilter(searchTerm);
            });
        } else {
            applyFilter(searchTerm);
        }
    }

    // Apply filter to displayed products
    function applyFilter(searchTerm) {
        const productItems = document.querySelectorAll('.product-item');
        productItems.forEach(item => {
            const product = JSON.parse(item.getAttribute('data-product') || '{}');
            const productName = product.name ? product.name.toLowerCase() : '';
            if (productName.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Search Pop-up for Mobile
    const searchIcon = document.querySelector('.search-icon');
    const searchPopup = document.createElement('div');
    searchPopup.classList.add('search-popup');
    searchPopup.innerHTML = `
        <input type="text" placeholder="Search" class="search-bar">
        <button class="search-popup-close">✕</button>
    `;
    document.body.appendChild(searchPopup);

    if (searchIcon) {
        searchIcon.addEventListener('click', (e) => {
            e.preventDefault();
            searchPopup.classList.toggle('active');
            console.log('Search icon clicked, popup toggled');
        });

        searchIcon.addEventListener('touchend', (e) => {
            searchPopup.classList.toggle('active');
            console.log('Search icon touched, popup toggled');
        });

        searchIcon.addEventListener('touchstart', (e) => {
            console.log('Search icon touch started');
        });
    }

    const searchPopupClose = searchPopup.querySelector('.search-popup-close');
    if (searchPopupClose) {
        searchPopupClose.addEventListener('click', (e) => {
            e.preventDefault();
            searchPopup.classList.remove('active');
            console.log('Search popup closed');
        });

        searchPopupClose.addEventListener('touchend', (e) => {
            searchPopup.classList.remove('active');
            console.log('Search popup closed via touch');
        });

        searchPopupClose.addEventListener('touchstart', (e) => {
            console.log('Search popup close touch started');
        });
    }

    // Handle cart button/icon functionality
    const cartElement = document.querySelector('.cart-icon') || document.querySelector('.cart-btn');
    if (cartElement) {
        cartElement.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'cart.html';
            console.log('Cart clicked, navigating to cart.html');
        });

        cartElement.addEventListener('touchend', (e) => {
            window.location.href = 'cart.html';
            console.log('Cart touched, navigating to cart.html');
        });

        cartElement.addEventListener('touchstart', (e) => {
            console.log('Cart touch started');
        });
    }

    // Handle Shop Now button in the hero slider
    function setupShopNowButton() {
        const shopNowBtn = document.querySelector('.shop-now-btn');
        if (shopNowBtn) {
            shopNowBtn.addEventListener('click', () => {
                const productsSection = document.querySelector('.featured-products');
                if (productsSection) {
                    productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } else {
                    alert('Products section not found. Please check the page structure.');
                }
            });
        }
    }

    // Handle View buttons for products (add to cart)
    function addViewButtonHandlers() {
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productItem = e.target.closest('.product-item');
                const product = JSON.parse(productItem.getAttribute('data-product'));
                addToCart(product);
                alert(`Added ${product.name} to cart!`);
            });

            button.addEventListener('touchend', (e) => {
                const productItem = e.target.closest('.product-item');
                const product = JSON.parse(productItem.getAttribute('data-product'));
                addToCart(product);
                alert(`Added ${product.name} to cart!`);
            });
        });
    }

    // Add product to cart (using localStorage for simplicity)
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Handle newsletter submission
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            try {
                const response = await fetch('http://localhost:5000/api/newsletter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                alert(data.message);
                newsletterForm.reset();
            } catch (error) {
                console.error('Error subscribing:', error);
                alert(`Subscription failed. Please try again. Details: ${error.message}`);
            }
        });
    }

    // Initial fetch and setup
    fetchProducts();
    setupNavigationLinks();
    setupSearchBar();
    setupShopNowButton();

    // Handle Back to Top button functionality
    function setupBackToTop() {
        const backToTopBtn = document.querySelector('.back-to-top');
        if (backToTopBtn) {
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

            backToTopBtn.addEventListener('touchend', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        } else {
            console.error('Back to Top button not found in the DOM');
        }
    }

    setupBackToTop();

    // Existing slideshow code
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.dots');
    let currentSlide = 0;
    let slideInterval;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    // Function to show a specific slide
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            dots[i].classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
                dots[i].classList.add('active');
            }
        });
    }

    // Function to go to a specific slide
    function goToSlide(index) {
        currentSlide = index;
        showSlide(currentSlide);
        resetInterval();
    }

    // Function to go to the next slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
        resetInterval();
    }

    // Function to go to the previous slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
        resetInterval();
    }

    // Auto-slide every 5 seconds
    function startInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    // Reset the interval when manually navigating
    function resetInterval() {
        clearInterval(slideInterval);
        startInterval();
    }

    // Event listeners for slideshow buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
        prevBtn.addEventListener('touchend', prevSlide);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
        nextBtn.addEventListener('touchend', nextSlide);
    }

    // Start the slideshow
    showSlide(0);
    startInterval();
});