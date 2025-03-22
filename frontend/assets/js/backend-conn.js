
/*=========================== connect registration form to backend ===========================*/
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("#register-form form");

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("register-name").value.trim();
        const email = document.getElementById("register-email").value.trim();
        const password = document.getElementById("register-password").value.trim();

        const data = { name, email, password };

        try {
            const response = await fetch("http://localhost/PackTrack/backend/auth/register.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.success) {
                alert(result.message || "Registered successfully!");
                // Optionally, switch to login form
                document.getElementById("show-login").click();
            } else {
                alert(result.message || "Registration failed");
            }

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    });
});

/*=========================== connect login form to backend ===========================*/

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#login-form form");

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value.trim();

        const data = { email, password };

        try {
            const response = await fetch("http://localhost/PackTrack/backend/auth/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.success) {
                alert(`Login successful! Welcome, ${result.user.name}`);
                // Save token to localStorage
                localStorage.setItem("token", result.token);
                // Redirect to dashboard.html or wherever you want
                window.location.href = "dashboard.html";
            } else {
                alert(result.message || "Login failed");
            }

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    });
});
