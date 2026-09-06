document.addEventListener("DOMContentLoaded", function () {

    loadWishlist();

});


async function loadWishlist() {

    const container =
        document.getElementById("wishlistContainer");

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

        const response = await fetch(
            `https://localhost:7126/api/wishlist/${userId}`
        );


        if (!response.ok) {

            container.innerHTML =
                "<p>Unable to load wishlist.</p>";

            return;
        }


        const wishlist =
            await response.json();


        if (wishlist.length === 0) {

            container.innerHTML = `

                <div class="empty-wishlist">

                    <div class="empty-heart">
                        ♡
                    </div>

                    <h2>
                        Your wishlist is empty
                    </h2>

                    <p>
                        Save your favourite watches here.
                    </p>

                    <a href="product.html">
                        Explore Watches
                    </a>

                </div>

            `;

            return;
        }


        container.innerHTML = "";


        wishlist.forEach(item => {

            const product =
                item.product;


            const card =
                document.createElement("div");

            card.className =
                "wishlist-card";


            card.innerHTML = `

                <div class="wishlist-image">

                    <img
                        src="${product.imageUrl}"
                        alt="${product.name}"
                    >

                </div>


                <div class="wishlist-details">

                    <p class="product-brand">
                        ${product.brand}
                    </p>

                    <h2>
                        ${product.name}
                    </h2>

                    <p class="product-category">
                        ${product.category}
                    </p>

                    <p class="wishlist-price">
                        ₹${product.price}
                    </p>


                    <div class="wishlist-actions">

                        <button
                            class="wishlist-cart-button"
                            onclick="addWishlistToCart(
                                ${product.id}
                            )">

                            Add to Cart

                        </button>


                        <button
                            class="wishlist-remove-button"
                            onclick="removeFromWishlist(
                                ${item.id}
                            )">

                            Remove

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
            "<p>Something went wrong while loading wishlist.</p>";

    }

}


async function removeFromWishlist(id) {

    try {

        const response = await fetch(
            `https://localhost:7126/api/wishlist/${id}`,
            {
                method: "DELETE"
            }
        );


        if (response.ok) {

            alert("Removed from wishlist.");

            loadWishlist();

        }

    }
    catch (error) {

        console.error(error);

        alert("Unable to remove from wishlist.");

    }

}


async function addWishlistToCart(productId) {

    const userId =
        localStorage.getItem("userId");


    try {

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


        const result =
            await response.json();


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
    catch (error) {

        console.error(error);

        alert("Something went wrong.");

    }

}