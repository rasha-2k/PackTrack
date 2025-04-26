/*=========================== charts ===========================*/
let deliveryStatusChart;
let deliveryTrendChart;
let packageCategoryChart
let statusByTimeChart

document.addEventListener('DOMContentLoaded', () => {
    initGeneralFunctionalities();

    if (deliveryStatusChart) {
        deliveryStatusChart.destroy();
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

function initAdminCharts() {
    const isDarkMode = document.body.classList.contains('dark');
    const DataPointBorderColor = isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
    const options = getChartOptions(isDarkMode);

    const deliveryStatusCtx = document.getElementById('deliveryStatusChart').getContext('2d');
    deliveryStatusChart = new Chart(deliveryStatusCtx, {
        type: 'bar',
        data: {
            labels: ['Received', 'Delivered', 'Delayed', 'Canceled'],
            datasets: [{
                data: [5, 8, 3, 1],
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
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    data: [20, 40, 37, 59, 31, 25, 35, 45, 88, 50, 60, 45],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
                }]
        },
        options: {
            ...options,
            plugins: {
                legend: {
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
            labels: ['Fragile', 'Non-Fragile', 'Perishable', 'Heavy'],
            datasets: [{
                data: [25, 35, 20, 20],
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
            labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
            datasets: [{
                label: 'Received',
                data: [5, 8, 7, 6, 9, 4],
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
                data: [2, 4, 4, 3, 6, 3],
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
                data: [14, 4, 8, 6, 5, 2],
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
                data: [4, 7, 9, 5, 6, 8],
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
            ...options
        }
    });


    function updateDeliveryStatusChart(timePeriod) {
        let newData = [];
        if (timePeriod === 'Daily') {
            newData = [5, 2, 3, 1];
        } else if (timePeriod === 'Weekly') {
            newData = [15, 8, 5, 1];
        } else {
            newData = [60, 40, 30, 20];
        }

        deliveryStatusChart.data.datasets[0].data = newData;
        deliveryStatusChart.update();
    }
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


    function updateStatusByTimeChart(week) {
        let newData = [[4, 8, 7, 3, 6, 2], [2, 4, 7, 9, 6, 3], [4, 7, 9, 4, 5, 8,], [3, 6, 8, 5, 7, 4]];
        if (week === 1) {
            newData = [[6, 7, 8, 4, 5, 6], [3, 1, 2, 4, 3, 1], [7, 6, 5, 3, 4, 3], [2, 4, 5, 3, 6, 7]];
        } else if (week === 2) {
            newData = [[5, 8, 2, 5, 6, 8], [8, 2, 4, 5, 3, 1], [6, 2, 4, 5, 3, 1], [4, 5, 6, 7, 8, 9]];
        } else {
            newData = [[6, 9, 8, 5, 7, 4], [4, 3, 2, 1, 5, 6], [7, 8, 9, 6, 5, 4], [3, 2, 1, 4, 5, 6]];
        }

        statusByTimeChart.data.datasets[0].data = newData[0];
        statusByTimeChart.data.datasets[1].data = newData[1];
        statusByTimeChart.data.datasets[2].data = newData[2];
        statusByTimeChart.data.datasets[3].data = newData[3];
        statusByTimeChart.update();
    }
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


    function updateDeliveryTrendChart(period) {
        let newLabels = [];
        let newData = [];

        if (period === 'Week') {
            newLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            newData = [10, 12, 9, 14, 16, 8, 7];
        } else if (period === 'Year') {
            newLabels = ['2021', '2022', '2023', '2024'];
            newData = [157, 443, 500, 829];
        } else {
            newLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            newData = [20, 40, 37, 59, 31, 25, 35, 45, 88, 50, 60, 45];
        }

        deliveryTrendChart.data.labels = newLabels;
        deliveryTrendChart.data.datasets[0].data = newData;
        deliveryTrendChart.update();
    }
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

    function updatePackageCategoryChart(category) {
        let newData = [];
        if (category === 'Fragile') {
            newData = [80, 20];
        } else {
            newData = [25, 35, 20, 20];
        }

        packageCategoryChart.data.datasets[0].data = newData;
        packageCategoryChart.update();
    }
    document.getElementById('categoryFragileButton').addEventListener('click', () => {
        updatePackageCategoryChart('Fragile');
        setActiveButton('categoryFragileButton');
    });
    document.getElementById('categoryAllButton').addEventListener('click', () => {
        updatePackageCategoryChart('All Categories');
        setActiveButton('categoryAllButton');
    });

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

    if (deliveryTrendChart) {
        deliveryTrendChart.options.plugins.legend.labels.color = textColor;
        deliveryTrendChart.options.plugins.tooltip = tooltipSettings;
        deliveryTrendChart.options.scales.x.grid.color = gridColor;
        deliveryTrendChart.options.scales.x.ticks.color = textColor;
        deliveryTrendChart.options.scales.y.grid.color = gridColor;
        deliveryTrendChart.options.scales.y.ticks.color = textColor;
        deliveryTrendChart.data.datasets[0].pointBorderColor = DataPointBorderColor;
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


