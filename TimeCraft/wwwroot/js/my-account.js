document.addEventListener("DOMContentLoaded", function () {
    loadProfile();

    document
        .getElementById("profileForm")
        .addEventListener("submit", updateProfile);

    document
        .getElementById("passwordForm")
        .addEventListener("submit", changePassword);
});


async function loadProfile() {

    const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true";

    const userId =
        localStorage.getItem("userId");

    //  logged-in users/admin can access account
    if (!isLoggedIn || !userId) {
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(
            `https://localhost:7126/api/auth/profile/${userId}`
        );

        if (!response.ok) {
            alert("Unable to load profile.");
            return;
        }

        const user = await response.json();

        document.getElementById("name").value =
            user.name;

        document.getElementById("email").value =
            user.email;

    } catch (error) {

        console.error(error);

        alert("Something went wrong while loading profile.");
    }
}


async function updateProfile(event) {

    event.preventDefault();

    const userId =
        localStorage.getItem("userId");

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    if (name === "" || email === "") {
        alert("Name and email are required.");
        return;
    }

    try {

        const response = await fetch(
            `https://localhost:7126/api/auth/profile/${userId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email
                })
            }
        );

        const result =
            await response.json();

        if (response.ok) {

            alert("Profile updated successfully.");

        } else {

            alert(
                result.message ||
                "Unable to update profile."
            );
        }

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");
    }
}


async function changePassword(event) {

    event.preventDefault();

    const userId =
        localStorage.getItem("userId");

    const currentPassword =
        document.getElementById("currentPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;


    if (newPassword !== confirmPassword) {

        alert("New password and confirm password do not match.");

        return;
    }


    if (newPassword.length < 6) {

        alert("New password must be at least 6 characters.");

        return;
    }


    try {

        const response = await fetch(
            `https://localhost:7126/api/auth/change-password/${userId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    currentPassword: currentPassword,
                    newPassword: newPassword
                })
            }
        );

        const result =
            await response.json();


        if (response.ok) {

            alert("Password changed successfully.");

            // Clear password fields
            document.getElementById("currentPassword").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("confirmPassword").value = "";

        } else {

            alert(
                result.message ||
                "Unable to change password."
            );
        }

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");
    }
}