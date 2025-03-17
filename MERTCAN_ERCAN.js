(() => {
    // Configuration
    const config = {
        productListUrl: 'https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json',
        localStorageKey: 'lcwaikiki_product_carousel',
        favoritesKey: 'lcwaikiki_favorites',
        carouselTitle: 'You Might Also Like'
    };

    // Product data and favorites
    let products = [];

    // Initialize the carousel
    const init = () => {
        // Check if we're on a product page
        if (!document.querySelector('.product-detail')) {
            return;
        }

        // Get products data
        getProducts().then(() => {
            buildHTML();
            buildCSS();
            setEvents();
        });
    };

    // Get products from API or local storage
    const getProducts = async () => {
        // Try to get products from local storage first
        const storedData = localStorage.getItem(config.localStorageKey);

        if (storedData) {
            products = JSON.parse(storedData);
            return;
        }

        // If not in local storage, fetch from API
        try {
            const response = await fetch(config.productListUrl);
            products = await response.json();

            // Store in local storage for future use
            localStorage.setItem(config.localStorageKey, JSON.stringify(products));
        } catch (error) {
            console.error('Error fetching products:', error);
            products = [];
        }
    };

    // Get favorite products from local storage
    const getFavorites = () => {
        const favorites = localStorage.getItem(config.favoritesKey);
        return favorites ? JSON.parse(favorites) : [];
    };

    // Save favorite products to local storage
    const saveFavorite = (productId, isFavorite) => {
        let favorites = getFavorites();

        if (isFavorite) {
            if (!favorites.includes(productId)) {
                favorites.push(productId);
            }
        } else {
            favorites = favorites.filter(id => id !== productId);
        }

        localStorage.setItem(config.favoritesKey, JSON.stringify(favorites));
    };

    // Build HTML structure
    const buildHTML = () => {
        const favorites = getFavorites();

        const productItems = products.map(product => {
            const isFavorite = favorites.includes(product.id);

            return `
                <div class="carousel-item">
                    <div class="product-card">
                        <div class="product-image-container">
                            <a href="${product.url}" target="_blank">
                                <img src="${product.img}" alt="${product.name}" class="product-image">
                            </a>
                            <button class="favorite-button ${isFavorite ? 'active' : ''}" data-product-id="${product.id}">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="heart-icon">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </button>
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">${product.name}</h3>
                            <p class="product-price">${product.price}</p>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        const html = `
            <div class="product-carousel-container">
                <h2 class="carousel-title">${config.carouselTitle}</h2>
                <div class="carousel-wrapper">
                    <button class="carousel-arrow prev-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                        </svg>
                    </button>
                    <div class="carousel-items">
                        ${productItems}
                    </div>
                    <button class="carousel-arrow next-arrow">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;

        document.querySelector('.product-detail').insertAdjacentHTML('afterend', html);
    };

    // Build CSS styles
    const buildCSS = () => {
        const css = `
            .product-carousel-container {
                margin: 30px 0;
                padding: 0 15px;
                font-family: 'Roboto', Arial, sans-serif;
                max-width: 1200px;
                margin-left: auto;
                margin-right: auto;
            }

            .carousel-title {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 20px;
                color: #333;
                padding-left: 10px;
            }

            .carousel-wrapper {
                position: relative;
                display: flex;
                align-items: center;
            }

            .carousel-items {
                display: flex;
                overflow-x: hidden;
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
                gap: 10px;
                width: 100%;
                padding: 5px 0;
            }

            .carousel-item {
                flex: 0 0 auto;
                width: calc(16.666% - 8px);
                transition: transform 0.3s ease;
            }

            .product-card {
                border-radius: 0;
                overflow: hidden;
                transition: box-shadow 0.3s ease;
                background-color: #fff;
            }

            .product-card:hover {
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .product-image-container {
                position: relative;
                overflow: hidden;
                aspect-ratio: 3/4;
            }

            .product-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
            }

            .product-card:hover .product-image {
                transform: scale(1.05);
            }

            .favorite-button {
                position: absolute;
                top: 10px;
                right: 10px;
                background: white;
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                z-index: 1;
                padding: 0;
            }

            .heart-icon {
                width: 18px;
                height: 18px;
                fill: transparent;
                stroke: #999;
                stroke-width: 1.5;
                transition: all 0.2s ease;
            }

            .favorite-button.active .heart-icon {
                fill: #0047ba;
                stroke: #0047ba;
            }

            .product-info {
                padding: 10px 5px;
            }

            .product-name {
                font-size: 13px;
                font-weight: 400;
                margin: 0 0 5px;
                color: #333;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                line-height: 1.3;
                height: 34px;
            }

            .product-price {
                font-size: 14px;
                font-weight: 700;
                color: #0047ba;
                margin: 0;
            }

            .carousel-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 36px;
                height: 36px;
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 2;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                transition: all 0.2s ease;
            }

            .carousel-arrow:hover {
                background: #f5f5f5;
            }

            .carousel-arrow svg {
                width: 20px;
                height: 20px;
                fill: #333;
            }

            .prev-arrow {
                left: -18px;
            }

            .next-arrow {
                right: -18px;
            }

            /* Responsive styles */
            @media (max-width: 1200px) {
                .carousel-item {
                    width: calc(20% - 8px);
                }
            }

            @media (max-width: 992px) {
                .carousel-item {
                    width: calc(25% - 8px);
                }
            }

            @media (max-width: 768px) {
                .carousel-item {
                    width: calc(33.333% - 7px);
                }

                .carousel-arrow {
                    width: 32px;
                    height: 32px;
                }

                .prev-arrow {
                    left: -16px;
                }

                .next-arrow {
                    right: -16px;
                }
            }

            @media (max-width: 576px) {
                .carousel-item {
                    width: calc(50% - 5px);
                }

                .carousel-arrow {
                    width: 28px;
                    height: 28px;
                }

                .carousel-arrow svg {
                    width: 16px;
                    height: 16px;
                }

                .prev-arrow {
                    left: -14px;
                }

                .next-arrow {
                    right: -14px;
                }
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.classList.add('carousel-style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    };

    // Set up event listeners
    const setEvents = () => {
        // Carousel navigation
        const carouselItems = document.querySelector('.carousel-items');
        const prevArrow = document.querySelector('.prev-arrow');
        const nextArrow = document.querySelector('.next-arrow');

        if (prevArrow && nextArrow && carouselItems) {
            prevArrow.addEventListener('click', () => {
                const scrollAmount = carouselItems.clientWidth * 0.8;
                carouselItems.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            });

            nextArrow.addEventListener('click', () => {
                const scrollAmount = carouselItems.clientWidth * 0.8;
                carouselItems.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            });
        }

        // Favorite buttons
        const favoriteButtons = document.querySelectorAll('.favorite-button');
        favoriteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productId = button.getAttribute('data-product-id');
                const isActive = button.classList.toggle('active');
                saveFavorite(productId, isActive);
            });
        });
    };

    // Check if jQuery is available, if not, load it
    const loadJQuery = () => {
        return new Promise((resolve) => {
            if (window.jQuery) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
            script.onload = resolve;
            document.head.appendChild(script);
        });
    };

    // Start the application when DOM is loaded
    const start = () => {
        loadJQuery().then(() => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init);
            } else {
                init();
            }
        });
    };

    // Execute the start function
    start();
})();