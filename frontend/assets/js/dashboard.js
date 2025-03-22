/*=========================== dashboard connection ===========================*/
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (!token || !userData) {
        alert("Unauthorized access. Please log in first.");
        window.location.href = "index.html";
        return;
    }

    const user = JSON.parse(userData);
    const welcomeText = document.getElementById("welcome-message");
    welcomeText.innerHTML = `Hello, <strong>${user.name}</strong>! You are now logged in.`;

    const logoutBtn = document.getElementById("logout-btn");
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        alert("You have been logged out.");
        window.location.href = "index.html";
    });
});
