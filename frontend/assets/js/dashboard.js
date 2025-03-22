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


/*=========================== charts ===========================*/
// Global chart variables
let activityChart;
let statusChart;

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Check saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark');
        dayNightToggle.querySelector('i').classList.remove('fa-moon');
        dayNightToggle.querySelector('i').classList.add('fa-sun');
    } else {
        document.body.classList.remove('dark');
        dayNightToggle.querySelector('i').classList.remove('fa-sun');
        dayNightToggle.querySelector('i').classList.add('fa-moon');
    }
    
    // Initialize Charts
    initCharts();
    
    // Chart period buttons (Week, Month, Year)
    const chartActions = document.querySelectorAll('.chart-action');
    for (const action of chartActions) {
        action.addEventListener('click', function() {
            // Remove active class from all buttons
            for (const btn of chartActions) {
                btn.classList.remove('active');
            }
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update chart data based on selected period
            updateChartData(this.textContent.trim());
        });
    }
    
    // Mobile sidebar toggle
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const sidebar = document.querySelector('.sidebar');
    
    // If there's a mobile toggle button, add event listeners
    const mobileToggle = document.querySelector('.mobile-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        });
    }
    
    // Close sidebar when clicking overlay
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
});

// Initialize Charts
function initCharts() {
    const isDarkMode = document.body.classList.contains('dark');
    const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Activity Chart
    const activityCtx = document.getElementById('activityChart').getContext('2d');
    activityChart = new Chart(activityCtx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [
                {
                    label: 'Received',
                    data: [7, 5, 8, 4],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Delivered',
                    data: [4, 6, 3, 7],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: textColor,
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                },
                tooltip: { 
                    enabled: true,
                    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    titleColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
                    bodyColor: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 6
                }
            },
            scales: {
                x: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                },
                y: {
                    grid: {
                        color: gridColor
                    },
                    ticks: {
                        color: textColor
                    }
                }
            }
        }
    });

    // Status Chart
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Delivered', 'In Transit', 'Out for Delivery', 'Delayed'],
            datasets: [{
                data: [15, 8, 5, 1],
                backgroundColor: [
                    '#10b981',
                    '#3b82f6',
                    '#f59e0b',
                    '#ef4444'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: textColor,
                        padding: 20,
                        font: {
                            family: 'Inter',
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    titleColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
                    bodyColor: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 6
                }
            },
            cutout: '70%'
        }
    });
}

// Update Charts Theme
function updateChartsTheme() {
    const isDarkMode = document.body.classList.contains('dark');
    const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    
    // Update Activity Chart theme
    if (activityChart) {
        // Update legend colors
        activityChart.options.plugins.legend.labels.color = textColor;
        
        // Update tooltip colors
        activityChart.options.plugins.tooltip.backgroundColor = isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)';
        activityChart.options.plugins.tooltip.titleColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
        activityChart.options.plugins.tooltip.bodyColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
        
        // Update axis colors
        activityChart.options.scales.x.grid.color = gridColor;
        activityChart.options.scales.x.ticks.color = textColor;
        activityChart.options.scales.y.grid.color = gridColor;
        activityChart.options.scales.y.ticks.color = textColor;
        
        // Update the chart
        activityChart.update();
    }
    
    // Update Status Chart theme
    if (statusChart) {
        // Update legend colors
        statusChart.options.plugins.legend.labels.color = textColor;
        
        // Update tooltip colors
        statusChart.options.plugins.tooltip.backgroundColor = isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)';
        statusChart.options.plugins.tooltip.titleColor = isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
        statusChart.options.plugins.tooltip.bodyColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
        
        // Update the chart
        statusChart.update();
    }
}

// Update Chart Data based on selected period (Week, Month, Year)
function updateChartData(period) {
    let labels = [];
    let receivedData = [];
    let deliveredData = [];
    
    switch(period) {
        case 'Week':
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            receivedData = [2, 1, 3, 1, 2, 0, 1];
            deliveredData = [1, 2, 1, 2, 1, 0, 0];
            break;
        case 'Month':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            receivedData = [7, 5, 8, 4];
            deliveredData = [4, 6, 3, 7];
            break;
        case 'Year':
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            receivedData = [23, 19, 27, 21, 24, 28, 30, 25, 31, 29, 32, 24];
            deliveredData = [18, 17, 24, 19, 22, 25, 27, 22, 28, 26, 29, 21];
            break;
    }
    
    // Update Activity Chart data
    activityChart.data.labels = labels;
    activityChart.data.datasets[0].data = receivedData;
    activityChart.data.datasets[1].data = deliveredData;
    activityChart.update();
}

// assets/js/script.js
// General app functionality
document.addEventListener('DOMContentLoaded', () => {
    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                // Handle search
                console.log('Searching for:', this.value);
                // Implement search functionality here
            }
        });
    }
    
    // Add package button
    const addPackageBtn = document.querySelector('.btn-add-package');
    if (addPackageBtn) {
        addPackageBtn.addEventListener('click', () => {
            // Navigate to add package page or open modal
            console.log('Add package clicked');
            // Implement navigation or modal here
        });
    }
    
    // Package action buttons
    const packageActions = document.querySelectorAll('.package-action');
    for (const action of packageActions) {
        action.addEventListener('click', function(e) {
            e.preventDefault();
            const trackingNumber = this.closest('tr').querySelector('.tracking-number').textContent;
            console.log('View package details:', trackingNumber);
            // Implement package details view here
        });
    }
});