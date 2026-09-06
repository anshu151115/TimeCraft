async function login() {

    // Clear old errors
    document.getElementById("emailError").innerText = "";
    document.getElementById("passwordError").innerText = "";
    document.getElementById("message").innerText = "";

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;


    const response = await fetch(
        "https://localhost:7126/api/auth/login",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        }
    );


    const result =
        await response.json();


    // Validation errors
    if (
        response.status === 400 &&
        result.errors
    ) {

        if (result.errors.Email) {

            document.getElementById(
                "emailError"
            ).innerText =
                result.errors.Email[0];
        }


        if (result.errors.Password) {

            document.getElementById(
                "passwordError"
            ).innerText =
                result.errors.Password[0];
        }

        return;
    }


    // Login failed
    if (!response.ok) {

        document.getElementById(
            "message"
        ).innerText =
            typeof result === "string"
                ? result
                : "Invalid email or password";

        return;
    }


    // =========================
    // Login Successful
    // =========================

    localStorage.setItem(
        "userId",
        result.userId
    );

    localStorage.setItem(
        "role",
        result.role
    );

    localStorage.setItem(
        "isLoggedIn",
        "true"
    );


    // Both User and Admin go to Home
    window.location.href =
        "home.html";
}