const params =
    new URLSearchParams(
        window.location.search
    );

const orderId =
    params.get("orderId");


document.addEventListener(
    "DOMContentLoaded",
    loadOrder
);


async function loadOrder() {

    if (!orderId) {

        document.getElementById(
            "orderInfo"
        ).innerText =
            "Order information not available.";

        return;
    }


    const response = await fetch(
        `${API_BASE_URL}/api/order/${orderId}`
    );


    if (!response.ok) {

        document.getElementById(
            "orderInfo"
        ).innerText =
            "Unable to load order.";

        return;
    }


    const order =
        await response.json();


    document.getElementById(
        "orderInfo"
    ).innerText =
        `Order #TC${order.id} | Amount Paid: ₹${order.totalAmount}`;
}


function downloadPaymentSlip() {

    if (!orderId) {

        alert("Order ID not found.");

        return;
    }


    window.location.href =
        `${API_BASE_URL}/api/order/${orderId}/payment-slip`;
}