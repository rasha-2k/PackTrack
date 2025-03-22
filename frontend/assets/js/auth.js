function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("You must be logged in.");
        window.location.href = "index.html";
    } else {
        // Wait for the page to fully load before accessing user data
        setTimeout(() => {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) {
                alert("User data is missing.");
                window.location.href = "index.html";
            }
        }, 100);
    }
}


function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) logoutBtn.addEventListener("click", logout);
});
