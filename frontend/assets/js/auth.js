// Function to check if the user is authenticated
function checkAuth() {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "/PackTrack/frontend/views/errors/403.html";
        // alert("You must be logged in.");
        // return false;
    }

    try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            window.location.href = "/PackTrack/frontend/views/errors/403.html";
            // alert("User data is missing.");
            // return false;
        }
        return true;
    } catch (error) {
        console.error("Error parsing user data:", error);
        window.location.href = "../index.html";
        return false;
    }
}

async function checkPageAccess(page) {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!user) return;

    try{
        const response = await fetch('/PackTrack/backend/api/check-access.php', {
            method: 'POST',
            body: JSON.stringify({ page }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 403 || response.status === 401 ) {
            window.location.href = "/PackTrack/frontend/views/errors/403.html";
        } else if (response.ok){
            return await response.json();
        } else {
            console.error('Unexpected response:', response.statusText);
        }
    } catch (error) {
        console.error('Error checking page access:', error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const user = await checkAuth();
    if (!user) return;

    const currentPage = window.location.pathname;
    
    if (currentPage.includes("admin-panel")) {
        if (user.role !== 'admin') {
            await checkPageAccess('admin-panel');
        }
    }
    if (currentPage.includes("dashboard")) {
        if (!['admin', 'user'].includes(user.role)) {
            await checkPageAccess('dashboard');
        }
    }

});

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
            e.preventDefault();
            logout();
        });
    }
});
