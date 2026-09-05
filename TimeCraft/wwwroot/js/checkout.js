let cartItems = [];

document.addEventListener("DOMContentLoaded", function () {

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

    loadCheckout();
});


async function loadCheckout() {

    const userId =
        localStorage.getItem("userId");

    try {

        const response = await fetch(
            `https://localhost:7126/api/cart/${userId}`
        );

        if (!response.ok) {
            alert("Unable to load cart.");
            return;
        }

        cartItems = await response.json();

        console.log("Cart items:", cartItems);

        if (cartItems.length === 0) {

            alert("Your cart is empty.");

            window.location.href = "product.html";

            return;
        }

        displayCheckout();

    }
    catch (error) {

        console.error(
            "Checkout loading error:",
            error
        );

        alert(
            "Something went wrong while loading checkout."
        );
    }
}


function displayCheckout() {

    const container =
        document.getElementById("checkoutItems");

    const totalElement =
        document.getElementById("checkoutTotal");

    let total = 0;

    container.innerHTML = "";

    cartItems.forEach(item => {

        const product = item.product;

        const itemTotal =
            product.price * item.quantity;

        total += itemTotal;

        container.innerHTML += `
            <div class="checkout-item">

                <span>
                    ${product.name} × ${item.quantity}
                </span>

                <strong>
                    ₹${itemTotal}
                </strong>

            </div>
        `;
    });

    totalElement.innerText =
        `₹${total}`;

    console.log("Checkout total:", total);
}


async function placeOrder() {

    console.log("Pay Now clicked");

    const name =
        document.getElementById(
            "shippingName"
        ).value.trim();

    const phoneNumber =
        document.getElementById(
            "phoneNumber"
        ).value.trim();

    const address =
        document.getElementById(
            "shippingAddress"
        ).value.trim();

    const city =
        document.getElementById(
            "shippingCity"
        ).value.trim();

    const state =
        document.getElementById(
            "shippingState"
        ).value.trim();

    const pincode =
        document.getElementById(
            "shippingPincode"
        ).value.trim();


    if (
        !name ||
        !phoneNumber ||
        !address ||
        !city ||
        !state ||
        !pincode
    ) {

        alert(
            "Please enter all shipping details."
        );

        return;
    }


    const userId =
        localStorage.getItem("userId");


    try {

        const response = await fetch(
            "https://localhost:7126/api/order",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    userId: parseInt(userId),

                    shippingName: name,

                    phoneNumber: phoneNumber,

                    shippingAddress: address,

                    shippingCity: city,

                    shippingState: state,

                    shippingPincode: pincode

                })
            }
        );


        const result =
            await response.json();


        console.log(
            "Order response:",
            result
        );


        if (response.ok) {

            alert(
                "Payment successful! Your order has been placed."
            );

            window.location.href =
                `payment-success.html?orderId=${result.orderId}`;

        }
        else {

            alert(
                result.message ||
                "Unable to place order."
            );
        }

    }
    catch (error) {

        console.error(
            "Payment error:",
            error
        );

        alert(
            "Something went wrong while processing the payment."
        );
    }
}