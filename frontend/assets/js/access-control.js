function checkPageAccess() {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
        showNotification("Please log in to access this page.", "error");
        window.location.href = "../index.html";
        return;
    }

    const user = JSON.parse(userData);
    const currentPage = window.location.pathname;

    if (currentPage.includes('admin-panel.html')) {
        if (user.role !== 'admin') {
            showNotification("Access denied. Admin privileges required.", "error");
            window.location.href = "../views/index.html";
            return;
        }
    }

    if (currentPage.includes('dashboard.html')) {
        if (!['admin', 'user'].includes(user.role)) {
            showNotification("Access denied. Please log in.", "error");
            window.location.href = "../views/index.html";
            return;
        }
    }
}