const role = localStorage.getItem("role");
const isLoggedIn = localStorage.getItem("isLoggedIn");

const currentPage = window.location.pathname;

if (isLoggedIn !== "true") {
    window.location.href = "login.html";
}

if (currentPage.includes("admin-dashboard") && role !== "Admin") {
    window.location.href = "home.html";
}

if (currentPage.includes("user-dashboard") && role !== "User") {
    window.location.href = "home.html";
}


function logout() {

    localStorage.removeItem("role");
    localStorage.removeItem("isLoggedIn");

    window.location.href = "login.html";
}