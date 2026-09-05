document.addEventListener("DOMContentLoaded", function () {

    const role = localStorage.getItem("role");
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    // Only Admin can access this page
    if (isLoggedIn !== "true" || role !== "Admin") {
        window.location.href = "login.html";
        return;
    }

    loadProducts();


    const form = document.getElementById("productForm");

    form.addEventListener("submit", async function (event) {

        event.preventDefault();


        const editId =
            form.dataset.editId;


        const formData = new FormData();


        formData.append(
            "Name",
            document.getElementById("name").value
        );

        formData.append(
            "Brand",
            document.getElementById("brand").value
        );

        formData.append(
            "Category",
            document.getElementById("category").value
        );

        formData.append(
            "Description",
            document.getElementById("description").value
        );

        formData.append(
            "Price",
            document.getElementById("price").value
        );

        formData.append(
            "Stock",
            document.getElementById("stock").value
        );


        const image =
            document.getElementById("image").files[0];


        if (image) {

            formData.append("Image", image);

        }


        let url =
            "https://localhost:7126/api/product";

        let method = "POST";


        // Editing
        if (editId) {

            url =
                `https://localhost:7126/api/product/${editId}`;

            method = "PUT";

        }


        const response = await fetch(url, {
            method: method,
            body: formData
        });


        const result = await response.json();


        const message =
            document.getElementById("productMessage");


        if (!response.ok) {

            message.innerText =
                result.message || "Operation failed";

            return;
        }


        message.innerText =
            editId
                ? "Watch updated successfully!"
                : "Watch added successfully!";


        form.reset();

        delete form.dataset.editId;


        document.querySelector(
            ".product-form-card h2"
        ).innerText = "Add New Watch";


        document.querySelector(
            "#productForm .primary-button"
        ).innerText = "Add Watch";


        document.getElementById("image").required = true;


        loadProducts();

    });

});


async function loadProducts() {

    const response = await fetch(
        "https://localhost:7126/api/product"
    );

    const products = await response.json();

    const container =
        document.getElementById("adminProducts");

    container.innerHTML = "";


    products.forEach(product => {

        const card = document.createElement("div");

        card.className = "admin-product-card";


        card.innerHTML = `

        <img
            src="${product.imageUrl}"
            alt="${product.name}"
        >

        <div class="admin-product-info">

            <p class="product-brand">
                ${product.brand}
            </p>

            <h3>
                ${product.name}
            </h3>

            <p class="product-category">
                ${product.category}
            </p>

            <p>
                ${product.description || ""}
            </p>

            <p class="product-price">
                ₹${product.price}
            </p>

            <p>
                Stock: ${product.stock}
            </p>

            <div class="admin-product-actions">

                <button
                    class="edit-button"
                    onclick="editProduct(${product.id})">
                    Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deleteProduct(${product.id})">
                    Delete
                </button>

            </div>

        </div>
    `;


        container.appendChild(card);

    });

}


async function editProduct(id) {

    const response = await fetch(
        `https://localhost:7126/api/product/${id}`
    );


    if (!response.ok) {

        alert("Unable to load product");

        return;
    }


    const product = await response.json();


    document.getElementById("name").value =
        product.name;

    document.getElementById("brand").value =
        product.brand;

    document.getElementById("category").value =
        product.category;

    document.getElementById("description").value =
        product.description || "";

    document.getElementById("price").value =
        product.price;

    document.getElementById("stock").value =
        product.stock;


    // Store product ID
    document.getElementById("productForm")
        .dataset.editId = id;


    // Image is not required while editing
    document.getElementById("image").required = false;


    document.querySelector(
        ".product-form-card h2"
    ).innerText = "Edit Watch";


    document.querySelector(
        "#productForm .primary-button"
    ).innerText = "Update Watch";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}

async function deleteProduct(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this watch?");


    if (!confirmDelete) {
        return;
    }


    const response = await fetch(
        `https://localhost:7126/api/product/${id}`,
        {
            method: "DELETE"
        }
    );


    if (response.ok) {

        loadProducts();

    }
    else {

        alert("Unable to delete product");

    }

}