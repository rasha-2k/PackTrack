document.addEventListener("DOMContentLoaded", () => {
    setupForm("#register-form form", "register");
    setupForm("#login-form form", "login");
});

//! docker: fetch "http://localhost:8080/app/auth/register.php"
//! local: fetch "http://localhost/app/auth/register.php"
const API_BASE_URL = "http://localhost:8080/app/auth";

async function setupForm(formSelector, action) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = getFormData(action);
        if (!formData) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${action}.php`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            console.log(`${action} response:`, result);

            if (!response.ok || !result.success) {
                showNotification(result.message || `Error: ${response.status}`, "error");
                return;
            }
            handleSuccess(result);
        } catch (err) {
            console.error(`${action} error:`, err);
            showNotification("A server error occurred.", "error");
            window.location.href = "/public/views/errors/500.html";
        }
    });
}

function getFormData(action) {
    const email = document.getElementById(`${action}-email`)?.value.trim();
    const password = document.getElementById(`${action}-password`)?.value.trim();
    const role = document.getElementById(`${action}-role`)?.value;

    if (!email || !password) {
        showNotification("Email and password are required.", "error");
        return null;
    }

    const data = { email, password, role };
    
    if (action === "register") {
        const name = document.getElementById("register-name")?.value.trim();
        if (!name || !role) {
            showNotification("All fields are required.", "error");
            return null;
        }
        data.name = name;
        if (role === "admin") {
            data.adminSecret = document.getElementById("admin-secret")?.value;
        }
    }

    return data;
}

function handleSuccess(result) {
    showNotification(`Welcome, ${result.user.name}!`, "success");

    localStorage.setItem("token", result.token);
    localStorage.setItem("user", JSON.stringify(result.user));

    
    setTimeout(() => {
        window.location.href = result.user.role === "admin"
            ? "../views/admin-panel.html"
            : "../views/dashboard.html";
    }, 1000);
}
