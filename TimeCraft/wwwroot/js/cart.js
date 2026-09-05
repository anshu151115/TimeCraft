document.addEventListener(
    "DOMContentLoaded",
    function () {

        const isLoggedIn =
            localStorage.getItem("isLoggedIn") === "true";

        const userId =
            localStorage.getItem("userId");


        if (!isLoggedIn || !userId) {

            window.location.href = "login.html";

            return;
        }


        loadCart();

    }
);


async function loadCart() {

    const userId =
        localStorage.getItem("userId");


    const response = await fetch(
        `https://localhost:7126/api/cart/${userId}`
    );


    if (!response.ok) {

        document.getElementById("cartItems").innerHTML =
            "<p>Unable to load cart.</p>";

        return;
    }


    const cartItems = await response.json();


    const container =
        document.getElementById("cartItems");


    container.innerHTML = "";


    if (cartItems.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <h2>Your cart is empty</h2>

                <p>
                    Discover a watch you love and add it to your cart.
                </p>

                <button
                    onclick="window.location.href='product.html'">

                    Explore Watches

                </button>

            </div>

        `;


        updateSummary([]);

        return;
    }


    cartItems.forEach(item => {

        const product = item.product;


        const itemTotal =
            product.price * item.quantity;


        const card =
            document.createElement("div");


        card.className = "cart-item";


        card.innerHTML = `

            <div class="cart-image">

                <img
                    src="${product.imageUrl}"
                    alt="${product.name}"
                >

            </div>


            <div class="cart-item-details">

                <p class="product-brand">
                    ${product.brand}
                </p>

                <h2>
                    ${product.name}
                </h2>

                <p class="cart-category">
                    ${product.category}
                </p>

                <p class="cart-price">
                    ₹${product.price}
                </p>


                <div class="quantity-area">

                    <span>Quantity</span>

                    <div class="quantity-control">

                        <button
                            onclick="
                                changeQuantity(
                                    ${item.id},
                                    ${item.quantity - 1}
                                )">

                            −

                        </button>


                        <span>
                            ${item.quantity}
                        </span>


                        <button
                            onclick="
                                changeQuantity(
                                    ${item.id},
                                    ${item.quantity + 1}
                                )">

                            +

                        </button>

                    </div>

                </div>


                <p class="item-total">

                    Item Total:
                    <strong>₹${itemTotal}</strong>

                </p>


                <button
                    class="remove-cart-button"
                    onclick="removeFromCart(${item.id})">

                    Remove

                </button>

            </div>

        `;


        container.appendChild(card);

    });


    updateSummary(cartItems);

}


function updateSummary(cartItems) {

    let total = 0;

    let itemCount = 0;


    cartItems.forEach(item => {

        total +=
            item.product.price * item.quantity;

        itemCount += item.quantity;

    });


    document.getElementById(
        "cartTotal"
    ).innerText = `₹${total}`;


    document.getElementById(
        "cartItemCount"
    ).innerText = itemCount;

}


async function changeQuantity(
    cartItemId,
    quantity
) {

    if (quantity < 1) {

        return;

    }


    const response = await fetch(
        `https://localhost:7126/api/cart/${cartItemId}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                quantity: quantity
            })
        }
    );


    const result = await response.json();


    if (!response.ok) {

        alert(
            result.message ||
            "Unable to update quantity"
        );

        return;
    }


    loadCart();

}


async function removeFromCart(cartItemId) {

    const confirmed =
        confirm(
            "Remove this watch from your cart?"
        );


    if (!confirmed) {

        return;

    }


    const response = await fetch(
        `https://localhost:7126/api/cart/${cartItemId}`,
        {
            method: "DELETE"
        }
    );


    if (response.ok) {

        loadCart();

    }
    else {

        alert(
            "Unable to remove watch from cart."
        );

    }

}


function checkout() {

    alert(
        "Checkout will be implemented in the next step."
    );

}