async function signup() {

    // Clear old errors
    document.getElementById("nameError").innerText = "";
    document.getElementById("emailError").innerText = "";
    document.getElementById("passwordError").innerText = "";
    document.getElementById("message").innerText = "";

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("https://localhost:7126/api/auth/signup", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password
        })
    });

    const result = await response.json();

    // Validation errors
    if (response.status === 400 && result.errors) {

        if (result.errors.Name) {
            document.getElementById("nameError").innerText =
                result.errors.Name[0];
        }

        if (result.errors.Email) {
            document.getElementById("emailError").innerText =
                result.errors.Email[0];
        }

        if (result.errors.Password) {
            document.getElementById("passwordError").innerText =
                result.errors.Password[0];
        }

        return;
    }

    // Other error
    if (!response.ok) {
        document.getElementById("message").innerText =
            result.message || "Signup failed";

        return;
    }

    // Success
    document.getElementById("message").innerText =
        "Signup successful!";

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}