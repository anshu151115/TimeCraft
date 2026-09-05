document.addEventListener(
    "DOMContentLoaded",
    function () {

        const isLoggedIn =
            localStorage.getItem("isLoggedIn") === "true";

        const role =
            localStorage.getItem("role");


        // Only Admin can access this page
        if (!isLoggedIn || role !== "Admin") {

            window.location.href = "login.html";

            return;
        }


        loadOrders();

    }
);


async function loadOrders() {

    const container =
        document.getElementById(
            "adminOrdersContainer"
        );


    try {

        const response = await fetch(
            "https://localhost:7126/api/order"
        );


        if (!response.ok) {

            container.innerHTML = `
                <div class="empty-admin-orders">

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
                <div class="empty-admin-orders">

                    <h2>
                        No orders yet
                    </h2>

                    <p>
                        Paid customer orders will appear here.
                    </p>

                </div>
            `;

            return;
        }


        container.innerHTML = "";


        orders.forEach(order => {

            const card =
                document.createElement("div");

            card.className =
                "admin-order-card";


            let itemsHtml = "";


            order.orderItems.forEach(item => {

                const itemTotal =
                    item.price * item.quantity;


                itemsHtml += `

                    <div class="admin-order-item">

                        <div class="admin-order-image">

                            <img
                                src="${item.product.imageUrl}"
                                alt="${item.product.name}">

                        </div>


                        <div class="admin-order-product">

                            <p class="product-brand">
                                ${item.product.brand}
                            </p>

                            <h3>
                                ${item.product.name}
                            </h3>

                            <p>
                                Category:
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


            card.innerHTML = `

                <div class="admin-order-header">

                    <div>

                        <p class="order-label">
                            ORDER
                        </p>

                        <h2>
                            TC${order.id}
                        </h2>

                        <p>
                            ${formatDate(order.createdAt)}
                        </p>

                    </div>


                    <div class="admin-payment-status">

                        <span>
                            Payment: ${order.paymentStatus}
                        </span>

                    </div>

                </div>


                <div class="admin-customer-section">

                    <div>

                        <h3>
                            Customer
                        </h3>

                        <p>
                            ${order.shippingName}
                        </p>

                        <p>
                            ${order.phoneNumber}
                        </p>

                    </div>


                    <div>

                        <h3>
                            Shipping Address
                        </h3>

                        <p>
                            ${order.shippingAddress}
                        </p>

                        <p>
                            ${order.shippingCity},
                            ${order.shippingState}
                            -
                            ${order.shippingPincode}
                        </p>

                    </div>

                </div>


                <div class="admin-order-products">

                    <h3>
                        Products
                    </h3>

                    ${itemsHtml}

                </div>


                <div class="admin-order-footer">

                    <div>

                        <span>
                            Order Status
                        </span>

                        <select
                            onchange="updateOrderStatus(
                                ${order.id},
                                this.value
                            )">

                            <option
                                value="Confirmed"
                                ${order.status === "Confirmed"
                    ? "selected"
                    : ""}>
                                Confirmed
                            </option>

                            <option
                                value="Packed"
                                ${order.status === "Packed"
                    ? "selected"
                    : ""}>
                                Packed
                            </option>

                            <option
                                value="Shipped"
                                ${order.status === "Shipped"
                    ? "selected"
                    : ""}>
                                Shipped
                            </option>

                            <option
                                value="Out for Delivery"
                                ${order.status === "Out for Delivery"
                    ? "selected"
                    : ""}>
                                Out for Delivery
                            </option>

                            <option
                                value="Delivered"
                                ${order.status === "Delivered"
                    ? "selected"
                    : ""}>
                                Delivered
                            </option>

                        </select>

                    </div>


                    <div class="admin-order-total">

                        <span>
                            Total Paid
                        </span>

                        <strong>
                            ₹${order.totalAmount}
                        </strong>

                    </div>


                    <button
                        class="admin-slip-button"
                        onclick="
                            downloadPaymentSlip(
                                ${order.id}
                            )
                        ">

                        Download Payment Slip

                    </button>

                </div>

            `;


            container.appendChild(card);

        });

    }
    catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="empty-admin-orders">

                <h2>
                    Something went wrong
                </h2>

                <p>
                    Unable to load orders.
                </p>

            </div>
        `;
    }
}


async function updateOrderStatus(
    orderId,
    status
) {

    try {

        const response = await fetch(
            `https://localhost:7126/api/order/${orderId}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );


        const result =
            await response.json();


        if (!response.ok) {

            alert(
                result.message ||
                "Unable to update order status."
            );

            return;
        }


        alert(
            "Order status updated successfully."
        );

    }
    catch (error) {

        console.error(error);

        alert(
            "Something went wrong while updating status."
        );
    }
}


function downloadPaymentSlip(orderId) {

    window.location.href =
        `https://localhost:7126/api/order/${orderId}/payment-slip`;

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