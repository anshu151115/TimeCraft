document.addEventListener("DOMContentLoaded", function () {

    loadProducts();

});


async function loadProducts() {

    const container =
        document.getElementById("productsContainer");


    try {

        const response = await fetch(
            "https://localhost:7126/api/product"
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


            // Only User can add product to cart
            if (isLoggedIn && role === "User") {

                cartButton = `
            <button
                class="add-cart-button"
                onclick="addToCart(${product.id})">

                Add to Cart

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

                ${cartButton}

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
        "https://localhost:7126/api/cart",
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