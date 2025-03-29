/*=========================== connect registration form to backend ===========================*/
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("#register-form form");

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = document.getElementById("register-name").value.trim();
        const email = document.getElementById("register-email").value.trim();
        const password = document.getElementById("register-password").value.trim();
        const role = document.getElementById('register-role').value;
        const adminSecret = role === 'admin' ? document.getElementById('admin-secret').value : '';

        if (!name || !email || !password || !role) {
            showNotification("All fields are required.", "error");
            return;
        }

        const data = { name, email, password, role };
        if (role === 'admin') {
            data.adminSecret = adminSecret;
        }

        try {
            //! docker: fetch "http://localhost:8080/PackTrack/backend/auth/register.php"
            //! local: fetch "http://localhost/PackTrack/backend/auth/register.php"
            const response = await fetch("http://localhost:8080/PackTrack/backend/auth/register.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            console.log('Registration response:', result);

            if (result.success) {
                console.log("Registered User:", result.user);
                console.log("Role Received:", result.user?.role);

                showNotification(`Registration successful! Welcome, ${result.user.name}`, "success");
                localStorage.setItem("token", result.token);
                localStorage.setItem("user", JSON.stringify(result.user));

                setTimeout(() => {
                    if (result.user.role === "admin") {
                        window.location.href = "../views/admin-panel.html";
                    } else {
                        window.location.href = "../views/dashboard.html";
                    }
                }, 1000);
            } else {
                showNotification(result.message || "Registration failed", "error");
            }
        } catch (err) {
            console.error('Registration error:', err);
            showNotification(`Error: ${err.message}`, "error");
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
        const role = document.getElementById('login-role').value;

        if (!email || !password) {
            showNotification("Email and password are required.", "error");
            return;
        }
        const data = { email, password, role };

        try {
            //! docker: fetch "http://localhost:8080/PackTrack/backend/auth/login.php"
            //! local: fetch "http://localhost/PackTrack/backend/auth/login.php"
            const response = await fetch("http://localhost:8080/PackTrack/backend/auth/login.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.success) {
                showNotification(`Login successful! Welcome, ${result.user.name}`, "success");

                localStorage.setItem("token", result.token);
                localStorage.setItem("user", JSON.stringify(result.user));

                setTimeout(() => {
                    if (result.user.role === "admin") {
                        window.location.href = "../views/admin-panel.html";
                    } else {
                        window.location.href = "../views/dashboard.html";
                    }
                }, 1000);
            } else {
                showNotification(result.message || "Login failed", "error");
            }
        } catch (err) {
            showNotification(`Error: ${err.message}`, "error");
        }
    });
});
