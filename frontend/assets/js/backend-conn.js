
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
            alert("All fields are required.");
            return;
        }
        
        const data = { name, email, password, role};

        // Only attach adminSecretKey if role is admin
        if (role === 'admin') {
            data.adminSecret = adminSecret;
        }
        try {
            const response = await fetch("http://localhost/PackTrack/backend/auth/register.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            if (result.success) {
                alert(result.message || "Registered successfully!");

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
        const role = document.getElementById('login-role').value;

        if (!email || !password) {
            alert("Email and password are required.");
            return;
        }
        const data = { email, password, role };

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
                localStorage.setItem("user", JSON.stringify(result.user));
                console.log("Token:", result.token);
                console.log("User:", JSON.stringify(result.user));
                // Redirect based on role
                if (result.user.role === "admin") {
                window.location.href = "admin-dashboard.html";
                } else {
                window.location.href = "user-dashboard.html";
                }
            } else {
                alert(result.message || "Login failed");
            }

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    });
});

