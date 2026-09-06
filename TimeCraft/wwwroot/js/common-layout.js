document.addEventListener("DOMContentLoaded", async function () {

    // Load Header
    const headerResponse = await fetch("components/header.html");
    const headerHtml = await headerResponse.text();

    const headerContainer = document.getElementById("header-container");

    if (headerContainer) {
        headerContainer.innerHTML = headerHtml;
    }


    // Load Footer
    const footerResponse = await fetch("components/footer.html");
    const footerHtml = await footerResponse.text();

    const footerContainer = document.getElementById("footer-container");

    if (footerContainer) {
        footerContainer.innerHTML = footerHtml;
    }


    // Get login information
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("role");


    // User / Admin visibility
    document.querySelectorAll(".user-only").forEach(element => {

        if (!isLoggedIn || role !== "User") {
            element.style.display = "none";
        }

    });


    document.querySelectorAll(".admin-only").forEach(element => {

        if (!isLoggedIn || role !== "Admin") {
            element.style.display = "none";
        }

    });


    // Login / Logout
    const loginLink = document.getElementById("loginLink");
    const logoutLink = document.getElementById("logoutLink");
    const accountLink = document.getElementById("accountLink");


    if (isLoggedIn) {

        // Hide Login
        if (loginLink) {
            loginLink.style.display = "none";
        }

        // Show Logout
        if (logoutLink) {
            logoutLink.style.display = "block";
        }

        // Account goes to correct dashboard
        if (accountLink) {
            accountLink.href = "my-account.html";
        }

    }
    else {

        // Show Login
        if (loginLink) {
            loginLink.style.display = "block";
        }

        // Hide Logout
        if (logoutLink) {
            logoutLink.style.display = "none";
        }

        // Account goes to login
        if (accountLink) {
            accountLink.href = "login.html";
        }
    }


    // Logout
    if (logoutLink) {

        logoutLink.addEventListener("click", function (event) {

            event.preventDefault();

            localStorage.removeItem("role");
            localStorage.removeItem("isLoggedIn");

            window.location.href = "login.html";
        });

    }

});