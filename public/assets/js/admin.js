/*=========================== charts ===========================*/
let deliveryOverviewChart;
let deliveryTrendChart;
let packageCategoryChart
let statusByTimeChart

document.addEventListener('DOMContentLoaded', () => {
    initGeneralFunctionalities();

    if (deliveryOverviewChart) {
        deliveryOverviewChart.destroy();
    }
    if (deliveryTrendChart) {
        deliveryTrendChart.destroy();
    }
    if (packageCategoryChart) {
        packageCategoryChart.destroy();
    }
    if (statusByTimeChart) {
        statusByTimeChart.destroy();
    }

    initAdminCharts();
});

function initGeneralFunctionalities() {
    // Mobile sidebar toggle
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const sidebar = document.querySelector('.sidebar');
    const mobileToggle = document.querySelector('.mobile-toggle');

    if (mobileToggle && sidebar && sidebarOverlay) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        });

        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });
    }

    // Initialize Add Package Modal
    if (typeof loadAddPackageModal === 'function') {
        loadAddPackageModal();
    }

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') {
                console.log('Searching for:', this.value);
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault()
            const searchInput = document.querySelector('.search-bar input');
            if (searchInput) {
                searchInput.focus();
            }
        }
    });

}

async function fetchChartData(endpoint, params = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const response = await fetch(`../../backend/api/admin/charts/${endpoint}?${queryString}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching chart data:', error);
        return null;
    }
}

function initAdminCharts() {
    const isDarkMode = document.body.classList.contains('dark');
    const DataPointBorderColor = isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
    const options = getChartOptions(isDarkMode);

    const deliveryOverviewCtx = document.getElementById('deliveryOverviewChart').getContext('2d');
    deliveryOverviewChart = new Chart(deliveryOverviewCtx, {
        type: 'bar',
        data: {
            labels: ['Received', 'Delivered', 'Delayed', 'Cancelled'],
            datasets: [{
                data: [0, 0, 0, 0],
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
            }]
        },
        options: {
            ...options,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    const deliveryTrendCtx = document.getElementById('deliveryTrendChart').getContext('2d');
    deliveryTrendChart = new Chart(deliveryTrendCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Deliveries', data: [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBorderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                pointHoverBorderColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                pointBorderWidth: 2,
                pointHoverBorderWidth: 2,
                pointHoverRadius: 6,
                pointBackgroundColor: '#3b82f6',
                pointHoverBackgroundColor: '#3b82f6',
            },
            {
                label: 'Canceled',
                data: [],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBorderColor: DataPointBorderColor,
                pointHoverBorderColor: DataPointBorderColor,
                pointBorderWidth: 2,
                pointHoverBorderWidth: 2,
                pointHoverRadius: 6,
                pointBackgroundColor: '#ef4444',
                pointHoverBackgroundColor: '#ef4444',
            },
            {
                label: 'Received',
                data: [],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBorderColor: DataPointBorderColor,
                pointHoverBorderColor: DataPointBorderColor,
                pointBorderWidth: 2,
                pointHoverBorderWidth: 2,
                pointHoverRadius: 6,
                pointBackgroundColor: '#10b981',
                pointHoverBackgroundColor: '#10b981',
            },
            {
                label: 'Delayed',
                data: [],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBorderColor: DataPointBorderColor,
                pointHoverBorderColor: DataPointBorderColor,
                pointBorderWidth: 2,
                pointHoverBorderWidth: 2,
                pointHoverRadius: 6,
                pointBackgroundColor: '#f59e0b',
                pointHoverBackgroundColor: '#f59e0b',
            }

            ]
        },
        options: {
            ...options,
            plugins: {
                ...options.plugins,
                legend: {
                    ...options.plugins.legend,
                    display: false
                },
                tooltip: {
                    padding: 12,
                    cornerRadius: 6,
                }
            }
        }
    });

    const packageCategoryCtx = document.getElementById('packageCategoryChart').getContext('2d');
    packageCategoryChart = new Chart(packageCategoryCtx, {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
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
            ...options,
            cutout: '50%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: options.plugins.legend.labels.color,
                    }
                }
            },
            scales: false
        }
    });

    const statusByTimeCtx = document.getElementById('statusByTimeChart').getContext('2d');
    statusByTimeChart = new Chart(statusByTimeCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Received',
                data: [],
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: '#10b981',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBorderColor: DataPointBorderColor,
                pointHoverBorderColor: DataPointBorderColor,
                pointBorderWidth: 2,
                pointHoverBorderWidth: 2,
                pointHoverRadius: 6,
                pointBackgroundColor: '#10b981',
                pointHoverBackgroundColor: '#10b981',
            }, {
                label: 'Delivered',
                data: [],
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderColor: '#3b82f6',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBorderColor: DataPointBorderColor,
                pointHoverBorderColor: DataPointBorderColor,
                pointBorderWidth: 2,
                pointHoverBorderWidth: 2,
                pointHoverRadius: 6,
                pointBackgroundColor: '#3b82f6',
                pointHoverBackgroundColor: '#3b82f6',
            },
            {
                label: 'Delayed',
                data: [],
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                borderColor: '#f59e0b',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBorderColor: DataPointBorderColor,
                pointHoverBorderColor: DataPointBorderColor,
                pointBorderWidth: 2,
                pointHoverBorderWidth: 2,
                pointHoverRadius: 6,
                pointBackgroundColor: '#f59e0b',
                pointHoverBackgroundColor: '#f59e0b',
            },
            {
                label: 'Canceled',
                data: [],
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderColor: '#ef4444',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBorderColor: DataPointBorderColor,
                pointHoverBorderColor: DataPointBorderColor,
                pointBorderWidth: 2,
                pointHoverBorderWidth: 2,
                pointHoverRadius: 6,
                pointBackgroundColor: '#ef4444',
                pointHoverBackgroundColor: '#ef4444',
            }]
        },
        options: {
            ...options,
            plugins: {
                ...options.plugins,
                legend: {
                    ...options.plugins.legend,
                    display: true
                },
                tooltip: {
                    padding: 12,
                    cornerRadius: 6,
                }
            },
        }
    });    // Initial data load
    updatedeliveryOverviewChart();
    updateStatusByTimeChart('month');
    updateDeliveryTrendsChart('month');
    updatePackageCategoryChart('month');

    document.getElementById('timeWeek1Button').addEventListener('click', () => {
        updateStatusByTimeChart('week');
        setActiveButton('timeWeek1Button');
    });
    document.getElementById('timeWeek2Button').addEventListener('click', () => {
        updateStatusByTimeChart('month');
        setActiveButton('timeWeek2Button');
    });
    document.getElementById('timeWeek3Button').addEventListener('click', () => {
        updateStatusByTimeChart('year');
        setActiveButton('timeWeek3Button');
    });

    // document.getElementById('trendWeekButton').addEventListener('click', () => {
    //     updateDeliveryTrendsChart('week');
    //     setActiveButton('trendWeekButton');
    // });
    document.getElementById('trendMonthButton').addEventListener('click', () => {
        updateDeliveryTrendsChart('month');
        setActiveButton('trendMonthButton');
    });
    document.getElementById('trendYearButton').addEventListener('click', () => {
        updateDeliveryTrendsChart('year');
        setActiveButton('trendYearButton');
    });

    document.getElementById('categoryFragileButton').addEventListener('click', () => {
        updatePackageCategoryChart('week');
        setActiveButton('categoryFragileButton');
    });
    document.getElementById('categoryAllButton').addEventListener('click', () => {
        updatePackageCategoryChart('month');
        setActiveButton('categoryAllButton');
    });
}

async function updatedeliveryOverviewChart() {
    const data = await fetchChartData('delivery-overview.php');
    if (data) {
        const statusData = data.data;
        deliveryOverviewChart.data.datasets[0].data = [
            statusData.received || 0,
            statusData.delivered || 0,
            statusData.delayed || 0,
            statusData.cancelled || 0
        ];
        deliveryOverviewChart.update();
    }
}

async function updateStatusByTimeChart(period) {
    const data = await fetchChartData('status-by-time.php', { mode: period });
    if (data) {
        const timeData = data.data;
        statusByTimeChart.data.labels = timeData.labels;
        statusByTimeChart.data.datasets[0].data = timeData.received;
        statusByTimeChart.data.datasets[1].data = timeData.delivered;
        statusByTimeChart.data.datasets[2].data = timeData.delayed;
        statusByTimeChart.data.datasets[3].data = timeData.canceled;
        statusByTimeChart.update();
    }
}

async function updateDeliveryTrendsChart(period) {
    const data = await fetchChartData('delivery-trends.php', { range: period });
    if (data && data.data) {
        const trendData = data.data;
        deliveryTrendChart.data.labels = trendData.labels; 
        const isDarkMode = document.body.classList.contains('dark');
        const DataPointBorderColor = isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
        deliveryTrendChart.data.datasets = [
            {
                label: 'Total Packages',
                data: trendData.total,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBorderWidth: 2,
                pointHoverBorderWidth: 2,
                pointHoverRadius: 6,
                pointBackgroundColor: '#3b82f6',
                pointHoverBackgroundColor: '#3b82f6',
                pointBorderColor: DataPointBorderColor,
                pointHoverBorderColor: DataPointBorderColor,
            }, {
                label: 'Delivered',
                data: trendData.delivered,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBorderWidth: 2,
                pointHoverBorderWidth: 2,
                pointHoverRadius: 6,
                pointBackgroundColor: '#10b981',
                pointHoverBackgroundColor: '#10b981',
                pointBorderColor: DataPointBorderColor,
                pointHoverBorderColor: DataPointBorderColor,
            }, {
                label: 'Received',
                data: trendData.received,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBorderWidth: 2,
                pointHoverBorderWidth: 2,
                pointHoverRadius: 6,
                pointBackgroundColor: '#f59e0b',
                pointHoverBackgroundColor: '#f59e0b',
                pointBorderColor: DataPointBorderColor,
                pointHoverBorderColor: DataPointBorderColor,
            }, {
                label: 'Delayed',
                data: trendData.delayed,
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBorderWidth: 2,
                pointHoverBorderWidth: 2,
                pointHoverRadius: 6,
                pointBackgroundColor: '#ef4444',
                pointHoverBackgroundColor: '#ef4444',
                pointBorderColor: DataPointBorderColor,
                pointHoverBorderColor: DataPointBorderColor,
            }
        ];
        deliveryTrendChart.update();
    }
}

async function updatePackageCategoryChart(period) {
    const data = await fetchChartData('categories.php', { mode: period });
    if (data) {
        const categoryData = data.data;
        packageCategoryChart.data.labels = categoryData.labels;
        packageCategoryChart.data.datasets[0].data = categoryData.counts;
        packageCategoryChart.update();
    }
}

function updateAdminChartsTheme() {
    const isDarkMode = document.body.classList.contains('dark');
    const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const legendColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    const DataPointBorderColor = isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';

    const tooltipSettings = {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
        bodyColor: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
    };

    if (deliveryOverviewChart) {
        deliveryOverviewChart.options.plugins.legend.labels.color = textColor;
        deliveryOverviewChart.options.plugins.tooltip = tooltipSettings;
        deliveryOverviewChart.options.scales.x.grid.color = gridColor;
        deliveryOverviewChart.options.scales.x.ticks.color = textColor;
        deliveryOverviewChart.options.scales.y.grid.color = gridColor;
        deliveryOverviewChart.options.scales.y.ticks.color = textColor;
        deliveryOverviewChart.options.plugins.legend.labels.strokeStyle = legendColor;
        deliveryOverviewChart.update();
    }

    if (deliveryTrendChart) {
        deliveryTrendChart.options.plugins.legend.labels.color = textColor;
        deliveryTrendChart.options.plugins.tooltip = tooltipSettings;
        deliveryTrendChart.options.scales.x.grid.color = gridColor;
        deliveryTrendChart.options.scales.x.ticks.color = textColor;
        deliveryTrendChart.options.scales.y.grid.color = gridColor;
        deliveryTrendChart.options.scales.y.ticks.color = textColor;
        deliveryTrendChart.data.datasets[0].pointBorderColor = DataPointBorderColor;
        deliveryTrendChart.data.datasets[1].pointBorderColor = DataPointBorderColor;
        deliveryTrendChart.data.datasets[2].pointBorderColor = DataPointBorderColor;
        deliveryTrendChart.data.datasets[3].pointBorderColor = DataPointBorderColor;
        deliveryTrendChart.update();
    }

    if (packageCategoryChart) {
        packageCategoryChart.options.plugins.legend.labels.color = textColor;
        packageCategoryChart.options.plugins.tooltip = tooltipSettings;
        packageCategoryChart.update();
    }

    if (statusByTimeChart) {
        statusByTimeChart.options.plugins.legend.labels.color = textColor;
        statusByTimeChart.options.plugins.tooltip = tooltipSettings;
        statusByTimeChart.options.scales.x.grid.color = gridColor;
        statusByTimeChart.options.scales.x.ticks.color = textColor;
        statusByTimeChart.options.scales.y.grid.color = gridColor;
        statusByTimeChart.options.scales.y.ticks.color = textColor;
        statusByTimeChart.data.datasets[0].pointBorderColor = DataPointBorderColor;
        statusByTimeChart.data.datasets[1].pointBorderColor = DataPointBorderColor;
        statusByTimeChart.data.datasets[2].pointBorderColor = DataPointBorderColor;
        statusByTimeChart.data.datasets[3].pointBorderColor = DataPointBorderColor;
        statusByTimeChart.data.datasets[0].pointHoverBorderColor = DataPointBorderColor;
        statusByTimeChart.data.datasets[1].pointHoverBorderColor = DataPointBorderColor;
        statusByTimeChart.data.datasets[2].pointHoverBorderColor = DataPointBorderColor;
        statusByTimeChart.data.datasets[3].pointHoverBorderColor = DataPointBorderColor;
        statusByTimeChart.update();
    }
}

function getChartOptions(isDarkMode) {
    const textColor = isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
    const gridColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const DataPointBorderColor = isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
    const fontFamily = 'Inter';
    return {
        responsive: true,
        maintainAspectRatio: false,
        data: {
            datasets: [
                {
                    pointBorderColor: DataPointBorderColor,
                    pointHoverBorderColor: DataPointBorderColor,
                }
            ]
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: textColor,
                    padding: 20,
                    font: { family: fontFamily, size: 12, weight: 500 }
                }
            },
            tooltip: {
                backgroundColor: isDarkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
                titleColor: isDarkMode ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                bodyColor: isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                padding: 12,
                cornerRadius: 6,
                titleFont: { family: fontFamily, size: 13, weight: 600 },
                bodyFont: { family: fontFamily, size: 12, weight: 500 }
            }
        },
        scales: {
            x: {
                grid: { color: gridColor },
                ticks: { color: textColor, font: { family: fontFamily, size: 12, weight: 500 } }
            },
            y: {
                beginAtZero: true,
                grid: { color: gridColor },
                ticks: { color: textColor, font: { family: fontFamily, size: 12, weight: 500 } }
            }
        }
    };
}

function setActiveButton(buttonId) {
    const clickedButton = document.getElementById(buttonId);
    const chartType = clickedButton.getAttribute('data-chart-type');

    const sameChartButtons = document.querySelectorAll(`[data-chart-type="${chartType}"]`);
    for (const button of sameChartButtons) {
        button.classList.remove('active');
    }
    clickedButton.classList.add('active');
}


