document.addEventListener("DOMContentLoaded", function () {

    loadProducts();
    setupSearch();

});


async function loadProducts(search = "") {

    const container =
        document.getElementById("productsContainer");


    try {

        const response = await fetch(
            `${API_BASE_URL}/api/product?search=${encodeURIComponent(search)}`
        );


        if (!response.ok) {

            container.innerHTML =
                "<p>Unable to load watches.</p>";

            return;
        }


        const products = await response.json();


        if (products.length === 0) {

            container.innerHTML = `

                <div class="empty-products">

                    <h2>No watches available</h2>

                    <p>
                        New watches will be added soon.
                    </p>

                </div>

            `;

            return;
        }


        container.innerHTML = "";


        products.forEach(product => {

            const card = document.createElement("div");

            card.className = "product-card";


            const isLoggedIn =
                localStorage.getItem("isLoggedIn") === "true";

            const role =
                localStorage.getItem("role");


            let cartButton = "";
            let wishlistButton = "";


            // Only User can add product to cart
            if (isLoggedIn && role === "User") {

                cartButton = `
            <button
                class="add-cart-icon"
                onclick="addToCart(${product.id})"
                aria-label="Add to Cart">
                <svg viewBox="0 0 24 24">
                    <path d="M3 4h2l2 13h11l2-9H6"></path>
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="17" cy="21" r="1"></circle>
                </svg>
            </button>
        `;

                wishlistButton = `
            <button
                class="wishlist-button"
                onclick="addToWishlist(this, ${product.id})"
                aria-label="Add to Wishlist">
                <svg viewBox="0 0 24 24">
                    <path d="M20.8 8.7c0 5.5-8.8 10.3-8.8 10.3S3.2 14.2 3.2 8.7
                         C3.2 5.5 6.8 3.5 9.4 5.6L12 8l2.6-2.4
                         C17.2 3.5 20.8 5.5 20.8 8.7z"></path>
                </svg>
            </button>
       `;
            }
            else if (!isLoggedIn) {

                cartButton = `
        <button
            class="add-cart-button"
            onclick="window.location.href='login.html'">
            Login to Add to Cart
        </button>
    `;

            }


            card.innerHTML = `

        <div class="product-image-container">

            <img
                src="${product.imageUrl}"
                alt="${product.name}"
                class="product-image"
            >

        </div>


        <div class="product-details">

            <p class="product-brand">
                ${product.brand}
            </p>

            <h2>
                ${product.name}
            </h2>

            <p class="product-category">
                ${product.category}
            </p>

            <p class="product-description">
                ${product.description || ""}
            </p>

            <p class="product-stock">
                ${product.stock > 0
                    ? "In Stock"
                    : "Out of Stock"}
            </p>


            <div class="product-bottom">

                <span class="product-price">
                    ₹${product.price}
                </span>

                <div class="product-actions">

                    ${wishlistButton}

                    ${cartButton}

                </div>


            </div>

        </div>
    `;


            container.appendChild(card);

        });

    }
    catch (error) {

        console.error(error);

        container.innerHTML =
            "<p>Something went wrong while loading watches.</p>";

    }

}

function setupSearch() {

    document.addEventListener("keydown", function (event) {

        if (event.key !== "Enter") {
            return;
        }

        const searchInput =
            document.getElementById("searchInput");

        if (!searchInput) {
            return;
        }

        const search =
            searchInput.value.trim();

        if (search === "") {
            loadProducts();
            return;
        }

        loadProducts(search);
    });
}

async function addToCart(productId) {

    const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true";

    const role =
        localStorage.getItem("role");

    const userId =
        localStorage.getItem("userId");


    // Only logged-in User can add to cart
    if (!isLoggedIn || role !== "User" || !userId) {

        window.location.href = "login.html";

        return;
    }


    const response = await fetch(
        `${API_BASE_URL}/api/cart`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                userId: parseInt(userId),
                productId: productId,
                quantity: 1
            })
        }
    );


    const result = await response.json();


    if (response.ok) {

        alert("Watch added to cart!");

    }
    else {

        alert(
            result.message ||
            "Unable to add watch to cart."
        );

    }
}


async function addToWishlist(buttonOrId, maybeId) {

    // Normalize parameters: support both (element, id) and (id)
    let button = null;
    let productId;

    if (typeof buttonOrId === "object") {
        button = buttonOrId;
        productId = maybeId;
    }
    else {
        productId = buttonOrId;
    }

    const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true";

    const role =
        localStorage.getItem("role");

    const userId =
        localStorage.getItem("userId");

    if (!isLoggedIn || role !== "User" || !userId) {

        window.location.href = "login.html";

        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/wishlist`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: parseInt(userId), productId: productId })
        });

        const result = await response.json();

        if (response.ok) {

            // Toggle active state on the button to reflect added wishlist
            if (button) {
                button.classList.add("active");
            }

            alert("Watch added to wishlist!");

        }
        else {

            alert(result.message || "Unable to add watch to wishlist.");

        }

    }
    catch (error) {

        console.error(error);

        alert("Something went wrong.");
    }
}