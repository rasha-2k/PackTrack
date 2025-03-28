/*=========================== admin connection ===========================*/
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
        showNotification("Unauthorized access. Please log in first.", "error");
        window.location.href = "index.html";
        return;
    }

    const user = JSON.parse(userData);
    console.log('User data:', user);



});

/*=========================== charts ===========================*/
// Global chart variables
let deliveryStatusChart;
let deliveryTrendChart;
let packageCategoryChart
let statusByTimeChart

// Initialize Admin Dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Charts
    initAdminCharts();

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
function initAdminCharts() {
    const isDarkMode = document.body.classList.contains('dark');
    const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const legendColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';

    // Common chart options for consistent styling
    const commonChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: textColor,
                    padding: 20,
                    font: {
                        color: textColor,
                        family: 'Inter',
                        size: 12,
                        weight: 500
                    }
                }
            },
            tooltip: {
                backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                titleColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
                bodyColor: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 6,
                titleFont: {
                    family: 'Inter',
                    size: 13,
                    weight: 600
                },
                bodyFont: {
                    family: 'Inter',
                    size: 12,
                    weight: 500
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: {
                    color: gridColor
                },
                ticks: {
                    color: textColor,
                    font: {
                        family: 'Inter',
                        size: 12,
                        weight: 500
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: gridColor
                },
                ticks: {
                    color: textColor,
                    font: {
                        family: 'Inter',
                        size: 12,
                        weight: 500
                    }
                }
            }
        }
    };

    const deliveryStatusCtx = document.getElementById('deliveryStatusChart').getContext('2d');
    deliveryStatusChart = new Chart(deliveryStatusCtx, {
        type: 'bar',
        data: {
            labels: ['Delivered', 'In Transit', 'Out for Delivery', 'Delayed'],
            datasets: [{
                label: 'Number of Deliveries',
                data: [15, 8, 5, 1],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)', // Green for Delivered
                    'rgba(59, 130, 246, 0.8)', // Blue for In Transit
                    'rgba(245, 158, 11, 0.8)', // Orange for Out for Delivery
                    'rgba(239, 68, 68, 0.8)'   // Red for Delayed
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 1,
                borderRadius: 5,
            }]
        },
        options: {
            ...commonChartOptions,
            plugins: {
                ...commonChartOptions.plugins,
                legend: {
                    ...commonChartOptions.plugins.legend,
                    display: true,
                    labels: {
                        color: textColor,
                        generateLabels: (chart) => {
                            const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                            for (const label of labels) {
                                label.fillStyle = 'rgba(59, 130, 246, 0.1)';
                                label.strokeStyle = textColor;
                            }
                            return labels;
                        }
                    }
                }
            }
        }
    });

    // Update data for Delivery Status by Time chart (Week 1, 2, 3)
    function updateStatusByTimeChart(week) {
        let newData = [0, 0, 0, 0, 0];
        if (week === 1) {
            newData = [4, 7, 6, 5, 8]; // Example week 1 data
        } else if (week === 2) {
            newData = [5, 8, 7, 6, 9]; // Default week 2 data
        } else {
            newData = [6, 9, 8, 7, 10]; // Week 3 data example
        }

        statusByTimeChart.data.datasets[0].data = newData;
        statusByTimeChart.update();
    }

    // Add event listeners for Delivery Status by Time buttons
    document.getElementById('timeWeek1Button').addEventListener('click', () => {
        updateStatusByTimeChart(1);
        setActiveButton('timeWeek1Button');
    });
    document.getElementById('timeWeek2Button').addEventListener('click', () => {
        updateStatusByTimeChart(2);
        setActiveButton('timeWeek2Button');
    });
    document.getElementById('timeWeek3Button').addEventListener('click', () => {
        updateStatusByTimeChart(3);
        setActiveButton('timeWeek3Button');
    });


    // Update data for Delivery Status chart (Daily, Weekly, Monthly)
    function updateDeliveryStatusChart(timePeriod) {
        let newData = [];
        if (timePeriod === 'Daily') {
            newData = [5, 2, 3, 1]; // Example daily data
        } else if (timePeriod === 'Weekly') {
            newData = [15, 8, 5, 1]; // Default weekly data
        } else {
            newData = [60, 40, 30, 20]; // Monthly data example
        }

        deliveryStatusChart.data.datasets[0].data = newData;
        deliveryStatusChart.update();
    }

    // Add event listeners for Delivery Status buttons
    document.getElementById('statusDailyButton').addEventListener('click', () => {
        updateDeliveryStatusChart('Daily');
        setActiveButton('statusDailyButton');
    });
    document.getElementById('statusWeeklyButton').addEventListener('click', () => {
        updateDeliveryStatusChart('Weekly');
        setActiveButton('statusWeeklyButton');
    });
    document.getElementById('statusMonthlyButton').addEventListener('click', () => {
        updateDeliveryStatusChart('Monthly');
        setActiveButton('statusMonthlyButton');
    });

    // Chart 2: Line Chart for Delivery Trends
    const deliveryTrendCtx = document.getElementById('deliveryTrendChart').getContext('2d');
    deliveryTrendChart = new Chart(deliveryTrendCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Default week data
            datasets: [{
                label: 'Number of Deliveries',
                data: [10, 12, 9, 14, 16, 8, 7], // Week data
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 3,
                pointBackgroundColor: '#3b82f6',
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#3b82f6',
            }]
        },
        options: {
            ...commonChartOptions
        }
    });

    // Update data for Delivery Trend chart (Week, Month, Year)
    function updateDeliveryTrendChart(period) {
        let newLabels = [];
        let newData = [];

        if (period === 'Week') {
            newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            newData = [10, 12, 9, 14, 16, 8, 7]; // Week data
        } else if (period === 'Month') {
            newLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            newData = [50, 60, 70, 80]; // Month data
        } else {
            newLabels = ['2023', '2024'];
            newData = [300, 500]; // Year data
        }

        deliveryTrendChart.data.labels = newLabels;
        deliveryTrendChart.data.datasets[0].data = newData;
        deliveryTrendChart.update();
    }

    // Add event listeners for Delivery Trend buttons
    document.getElementById('trendWeekButton').addEventListener('click', () => {
        updateDeliveryTrendChart('Week');
        setActiveButton('trendWeekButton');
    });
    document.getElementById('trendMonthButton').addEventListener('click', () => {
        updateDeliveryTrendChart('Month');
        setActiveButton('trendMonthButton');
    });
    document.getElementById('trendYearButton').addEventListener('click', () => {
        updateDeliveryTrendChart('Year');
        setActiveButton('trendYearButton');
    });

    // Chart 3: Doughnut Chart for Package Category Distribution
    const packageCategoryCtx = document.getElementById('packageCategoryChart').getContext('2d');
    packageCategoryChart = new Chart(packageCategoryCtx, {
        type: 'pie',
        data: {
            labels: ['Fragile', 'Non-Fragile', 'Perishable', 'Heavy'],
            datasets: [{
                data: [25, 35, 20, 20], // Default all categories
                backgroundColor: [
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    'rgba(16, 185, 129, 1)',
                    'rgba(59, 130, 246, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 1,
                borderRadius: 5,
                hoverOffset: 10
            }]
        },
        options: {
            ...commonChartOptions,
            cutout: '50%',
            plugins: {
                ...commonChartOptions.plugins,
                legend: {
                    ...commonChartOptions.plugins.legend,
                    position: 'bottom'
                }
            },
            scales: false
        }
    });

    // Update data for Package Category chart (Fragile vs All Categories)
    function updatePackageCategoryChart(category) {
        let newData = [];
        if (category === 'Fragile') {
            newData = [80, 20]; // Example data for Fragile
        } else {
            newData = [25, 35, 20, 20]; // Default all categories
        }

        packageCategoryChart.data.datasets[0].data = newData;
        packageCategoryChart.update();
    }

    // Add event listeners for Package Category buttons
    document.getElementById('categoryFragileButton').addEventListener('click', () => {
        updatePackageCategoryChart('Fragile');
        setActiveButton('categoryFragileButton');
    });
    document.getElementById('categoryAllButton').addEventListener('click', () => {
        updatePackageCategoryChart('All Categories');
        setActiveButton('categoryAllButton');
    });

    // Chart 4: Stacked Area Chart for Delivery Status by Time (Week)
    const statusByTimeCtx = document.getElementById('statusByTimeChart').getContext('2d');
    statusByTimeChart = new Chart(statusByTimeCtx, {
        type: 'line',
        data: {
            labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            datasets: [{
                label: 'Delivered',
                data: [5, 8, 7, 6, 9],
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: '#10b981',
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 3,
                pointBackgroundColor: '#10b981',
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#10b981',
            }, {
                label: 'In Transit',
                data: [3, 2, 3, 4, 5],
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: '#3b82f6',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#3b82f6',
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#3b82f6',
            },
            {
                label: 'Out for Delivery',
                data: [1, 3, 2, 1, 2],
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderColor: '#f59e0b',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#f59e0b',
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#f59e0b',
            },
            {
                label: 'Delayed',
                data: [1, 1, 1, 1, 1],
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: '#ef4444',
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#ef4444',
                pointHoverRadius: 5,
                pointHoverBackgroundColor: '#ef4444',
            }]
        },
        options: {
            ...commonChartOptions,
            plugins: {
                ...commonChartOptions.plugins,
                tooltip: {
                    ...commonChartOptions.plugins.tooltip,
                    intersect: false,
                    mode: 'index'
                }
            },
            scales: {
                x: {
                    ...commonChartOptions.scales.x,
                    stacked: true
                },
                y: {
                    ...commonChartOptions.scales.y,
                    stacked: true
                }
            }
        }
    });
}

// Update Charts Theme
function updateAdminChartsTheme() {
    const isDarkMode = document.body.classList.contains('dark');
    const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const legendColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';

    // Common font settings
    const fontSettings = {
        family: 'Inter',
        size: 12,
        weight: 500
    };

    // Common tooltip settings
    const tooltipSettings = {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
        bodyColor: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        titleFont: { ...fontSettings, size: 13, weight: 600 },
        bodyFont: fontSettings
    };

    // Update Delivery Status Chart theme
    if (deliveryStatusChart) {
        deliveryStatusChart.options.plugins.legend.labels.color = textColor;
        deliveryStatusChart.options.plugins.tooltip = tooltipSettings;
        deliveryStatusChart.options.scales.x.grid.color = gridColor;
        deliveryStatusChart.options.scales.x.ticks.color = textColor;
        deliveryStatusChart.options.scales.y.grid.color = gridColor;
        deliveryStatusChart.options.scales.y.ticks.color = textColor;
        deliveryStatusChart.options.plugins.legend.labels.strokeStyle = legendColor;
        deliveryStatusChart.update();
    }

    // Update Delivery Trend Chart theme
    if (deliveryTrendChart) {
        deliveryTrendChart.options.plugins.legend.labels.color = textColor;
        deliveryTrendChart.options.plugins.legend.labels.font = fontSettings;
        deliveryTrendChart.options.plugins.tooltip = tooltipSettings;
        deliveryTrendChart.options.scales.x.grid.color = gridColor;
        deliveryTrendChart.options.scales.x.ticks.color = textColor;
        deliveryTrendChart.options.scales.x.ticks.font = fontSettings;
        deliveryTrendChart.options.scales.y.grid.color = gridColor;
        deliveryTrendChart.options.scales.y.ticks.color = textColor;
        deliveryTrendChart.options.scales.y.ticks.font = fontSettings;
        deliveryTrendChart.update();
    }



    // Update Package Category Chart theme
    if (packageCategoryChart) {
        packageCategoryChart.options.plugins.legend.labels.color = textColor;
        packageCategoryChart.options.plugins.legend.labels.font = fontSettings;
        packageCategoryChart.options.plugins.tooltip = tooltipSettings;
        packageCategoryChart.update();
    }

    // Update Status by Time Chart theme
    if (statusByTimeChart) {
        statusByTimeChart.options.plugins.legend.labels.color = textColor;
        statusByTimeChart.options.plugins.legend.labels.font = fontSettings;
        statusByTimeChart.options.plugins.tooltip = tooltipSettings;
        statusByTimeChart.options.scales.x.grid.color = gridColor;
        statusByTimeChart.options.scales.x.ticks.color = textColor;
        statusByTimeChart.options.scales.x.ticks.font = fontSettings;
        statusByTimeChart.options.scales.y.grid.color = gridColor;
        statusByTimeChart.options.scales.y.ticks.color = textColor;
        statusByTimeChart.options.scales.y.ticks.font = fontSettings;
        statusByTimeChart.update();
    }
}

// Update Chart Data based on selected period (Week, Month, Year)
function updateAdminChartData(period) {
    let labels = [];
    let newUsersData = [];
    let activeUsersData = [];

    switch (period) {
        case 'Week':
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            newUsersData = [5, 7, 8, 6, 5, 4, 3];
            activeUsersData = [4, 6, 7, 8, 6, 5, 4];
            break;
        case 'Month':
            labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            newUsersData = [30, 45, 50, 55];
            activeUsersData = [20, 30, 35, 40];
            break;
        case 'Year':
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            newUsersData = [120, 140, 150, 160, 180, 200, 210, 220, 230, 240, 250, 260];
            activeUsersData = [100, 120, 130, 140, 150, 170, 180, 190, 200, 210, 220, 230];
            break;
    }

    // Update User Stats Chart data
    userStatsChart.data.labels = labels;
    userStatsChart.data.datasets[0].data = newUsersData;
    userStatsChart.data.datasets[1].data = activeUsersData;
    userStatsChart.update();
}

// Update the setActiveButton function to use data attributes
function setActiveButton(buttonId) {
    const clickedButton = document.getElementById(buttonId);
    const chartType = clickedButton.getAttribute('data-chart-type');

    // Only target buttons of the same chart type
    const sameChartButtons = document.querySelectorAll(`[data-chart-type="${chartType}"]`);
    for (const button of sameChartButtons) {
        button.classList.remove('active');
    }
    clickedButton.classList.add('active');
}
