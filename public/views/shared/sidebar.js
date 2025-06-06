class Sidebar {
    constructor() {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.menuItems1 = {
            admin: [
                { icon: 'fas fa-tachometer-alt', text: 'Admin Panel', link: 'admin-panel.html' },
                { icon: 'fas fa-tachometer-alt', text: 'Dashboard', link: 'dashboard.html' },
                { icon: 'fas fa-users', text: 'User Management', link: 'users.html' },
                { icon: 'fas fa-box', text: 'All Packages', link: 'packages.html' },
                { icon: 'fas fa-chart-bar', text: 'Reporting', link: 'reporting.html' },
                
            ],
            user: [
                { icon: 'fas fa-tachometer-alt', text: 'Dashboard', link: 'dashboard.html' },
                { icon: 'fas fa-box', text: 'My Packages', link: 'dashboard.html' },
                { icon: 'fas fa-plus-circle', text: 'Add Package', link: 'add-package.html' },
                { icon: 'fas fa-history', text: 'History', link: 'history.html' },
            ]
        };
        this.menuItems2 = {
            admin: [
                { icon: 'fas fa-cogs', text: 'System Settings', link: 'settings.html' },
                { icon: 'fas fa-bell', text: 'Notifications', link: 'notifications.html' },
                { icon: 'fas fa-lock', text: 'Access Control', link: 'access-control.html' },
                { id: 'logout-btn', icon: 'fas fa-sign-out-alt', text: 'Logout', link: 'index.html' }
            ],
            user: [
                { id: 'profile-btn', icon: 'fas fa-user-cog', text: 'Profile Settings', link: 'profile.html' },
                { id: 'notifications-btn', icon: 'fas fa-bell', text: 'Notifications', link: 'notifications.html' },
                { id: 'security-btn', icon: 'fas fa-lock', text: 'Security', link: 'security.html' },
                { id: 'logout-btn', icon: 'fas fa-sign-out-alt', text: 'Logout', link: 'index.html' }
            ]
        }
    }

    async loadSidebar() {
        try {
            const response = await fetch('../views/shared/sidebar.html');
            const sidebarHtml = await response.text();
            
            document.getElementById('sidebar-container').innerHTML = sidebarHtml;
            
            this.updateUserInfo();
            
            this.generateMenu();
            
            setTimeout(() => {
                this.setupEventListeners();
            }, 100);
            
        } catch (error) {
            console.error('Error loading sidebar:', error);
        }
    }

    updateUserInfo() {
        if (this.user) {
            document.getElementById('user-name').textContent = this.user.name;
            document.getElementById('user-email').textContent = this.user.email;
            if (this.user.role === 'admin') {
                document.getElementById('user-icon').textContent = 'admin_panel_settings';
            } else {
                document.getElementById('user-icon').textContent = 'person';
            }
        }
    }

    generateMenu() {
        const menuItems1 = this.menuItems1[this.user.role] || [];
        const menuItems2 = this.menuItems2[this.user.role] || [];
        const navList1 = document.getElementById('nav-items-1');
        const navList2 = document.getElementById('nav-items-2');
        navList1.innerHTML = menuItems1.map(item => `
            <li>
                <a href="${item.link}" class="nav-link">
                    <i class="${item.icon}"></i>
                    ${item.text}
                </a>
            </li>
        `).join('');

        navList2.innerHTML = menuItems2.map(item => `
            <li>
                <a id="${item.id}" href="${item.link}" class="nav-link">
                    <i class="${item.icon}"></i>
                    ${item.text}
                </a>
            </li>
        `).join('');
    }

    setupEventListeners() {

        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", (e) => {
                e.preventDefault(); 
                logout();
            });
        }
        }
}
