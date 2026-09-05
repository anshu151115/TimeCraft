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

            const card =
                document.createElement("div");

            card.className = "product-card";


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

                    <div class="product-bottom">

                        <span class="product-price">
                            ₹${product.price}
                        </span>

                        <button
                            class="add-cart-button"
                            onclick="addToCart(${product.id})">
                            Add to Cart
                        </button>

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


function addToCart(productId) {

    alert(
        "Cart functionality will be added in the next step."
    );

}