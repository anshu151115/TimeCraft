document.addEventListener("DOMContentLoaded", function () {

    const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true";

    const role =
        localStorage.getItem("role");

    const userId =
        localStorage.getItem("userId");


    // Only logged-in User can see orders
    if (
        !isLoggedIn ||
        role !== "User" ||
        !userId
    ) {

        window.location.href = "login.html";

        return;
    }


    loadOrders();

});


async function loadOrders() {

    const userId =
        localStorage.getItem("userId");

    const container =
        document.getElementById(
            "ordersContainer"
        );


    try {

        const response = await fetch(
            `https://localhost:7126/api/order/user/${userId}`
        );


        if (!response.ok) {

            container.innerHTML = `
                <div class="empty-orders">

                    <h2>
                        Unable to load orders
                    </h2>

                    <p>
                        Please try again later.
                    </p>

                </div>
            `;

            return;
        }


        const orders =
            await response.json();


        if (orders.length === 0) {

            container.innerHTML = `
                <div class="empty-orders">

                    <h2>
                        No orders yet
                    </h2>

                    <p>
                        Your purchased watches will appear here.
                    </p>

                    <button
                        onclick="window.location.href='product.html'">

                        Explore Watches

                    </button>

                </div>
            `;

            return;
        }


        container.innerHTML = "";


        orders.forEach(order => {

            const orderCard =
                document.createElement("div");

            orderCard.className =
                "order-card";


            let itemsHtml = "";


            order.orderItems.forEach(item => {

                const itemTotal =
                    item.price * item.quantity;


                itemsHtml += `

                    <div class="order-item">

                        <div class="order-item-image">

                            <img
                                src="${item.product.imageUrl}"
                                alt="${item.product.name}">

                        </div>


                        <div class="order-item-details">

                            <p class="product-brand">
                                ${item.product.brand}
                            </p>

                            <h3>
                                ${item.product.name}
                            </h3>

                            <p>
                                ${item.product.category}
                            </p>

                            <p>
                                Quantity:
                                ${item.quantity}
                            </p>

                            <p>
                                Price:
                                ₹${item.price}
                            </p>

                            <strong>
                                Item Total:
                                ₹${itemTotal}
                            </strong>

                        </div>

                    </div>

                `;
            });


            orderCard.innerHTML = `

                <div class="order-card-header">

                    <div>

                        <p class="order-label">
                            ORDER
                        </p>

                        <h2>
                            TC${order.id}
                        </h2>

                    </div>


                    <div class="order-status">

                        <span>
                            Payment: ${order.paymentStatus}
                        </span>

                        <span>
                            ${order.status}
                        </span>

                    </div>

                </div>


                <div class="order-date">

                    Ordered on:
                    ${formatDate(order.createdAt)}

                </div>


                <div class="order-items">

                    ${itemsHtml}

                </div>


                <div class="order-bottom">

                    <div class="shipping-info">

                        <h3>
                            Shipping Details
                        </h3>

                        <p>
                            ${order.shippingName}
                        </p>

                        <p>
                            ${order.phoneNumber}
                        </p>

                        <p>
                            ${order.shippingAddress}
                        </p>

                        <p>
                            ${order.shippingCity},
                            ${order.shippingState}
                            - ${order.shippingPincode}
                        </p>

                    </div>


                    <div class="order-total">

                        <span>
                            Total Paid
                        </span>

                        <strong>
                            ₹${order.totalAmount}
                        </strong>

                        <button
                            onclick="downloadPaymentSlip(${order.id})">

                            Download Payment Slip

                        </button>

                    </div>

                </div>

            `;


            container.appendChild(orderCard);

        });

    }
    catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="empty-orders">

                <h2>
                    Something went wrong
                </h2>

                <p>
                    Unable to load your orders.
                </p>

            </div>
        `;
    }
}


function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


function downloadPaymentSlip(orderId) {

    window.location.href =
        `https://localhost:7126/api/order/${orderId}/payment-slip`;

}