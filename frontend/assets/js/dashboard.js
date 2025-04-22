

/*=========================== charts ===========================*/
let activityChart;
let statusChart;

document.addEventListener('DOMContentLoaded', () => {
    initCharts();

    const chartActions = document.querySelectorAll('.chart-action');
    for (const action of chartActions) {
        action.addEventListener('click', function () {
            for (const btn of chartActions) {
                btn.classList.remove('active');
            }
            this.classList.add('active');

            updateChartData(this.textContent.trim());
        });
    }

    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const sidebar = document.querySelector('.sidebar');

    const mobileToggle = document.querySelector('.mobile-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        });
    }

    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
});

function initCharts() {
    const isDarkMode = document.body.classList.contains('dark');
    const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

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
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#3b82f6',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2
                },
                {
                    label: 'Delivered',
                    data: [4, 6, 3, 7],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#10b981',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 2
                }
            ]
        },
        options: {
            ...commonChartOptions,
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
        }
    });

    const statusCtx = document.getElementById('statusChart').getContext('2d');
    statusChart = new Chart(statusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Delivered', 'In Transit', 'Out for Delivery', 'Delayed'],
            datasets: [{
                data: [15, 8, 5, 1],
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
}

function updateChartsTheme() {
    const isDarkMode = document.body.classList.contains('dark');
    const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    const fontSettings = {
        family: 'Inter',
        size: 12,
        weight: 500
    };

    const tooltipSettings = {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
        bodyColor: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
        titleFont: { ...fontSettings, size: 13, weight: 600 },
        bodyFont: fontSettings
    };

    if (activityChart) {
        activityChart.options.plugins.legend.labels.color = textColor;
        activityChart.options.plugins.legend.labels.font = fontSettings;
        activityChart.options.plugins.tooltip = tooltipSettings;
        activityChart.options.scales.x.grid.color = gridColor;
        activityChart.options.scales.x.ticks.color = textColor;
        activityChart.options.scales.x.ticks.font = fontSettings;
        activityChart.options.scales.y.grid.color = gridColor;
        activityChart.options.scales.y.ticks.color = textColor;
        activityChart.options.scales.y.ticks.font = fontSettings;
        activityChart.update();
    }

    if (statusChart) {
        statusChart.options.plugins.legend.labels.color = textColor;
        statusChart.options.plugins.legend.labels.font = fontSettings;
        statusChart.options.plugins.tooltip = tooltipSettings;
        statusChart.update();
    }
}

function updateChartData(period) {
    let newlabels = [];
    let receivedData = [];
    let deliveredData = [];

    switch (period) {
        case 'month':
            newlabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            receivedData = [2, 1, 3, 1, 2, 0, 1];
            deliveredData = [1, 2, 1, 2, 1, 0, 0];
            break;
        case 'week':
            newlabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            receivedData = [7, 5, 8, 4];
            deliveredData = [4, 6, 3, 7];
            break;
        case 'year':
            newlabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            receivedData = [23, 19, 27, 21, 24, 28, 30, 25, 31, 29, 32, 24];
            deliveredData = [18, 17, 24, 19, 22, 25, 27, 22, 28, 26, 29, 21];
            break;
    }

    activityChart.data.labels = newlabels;
    activityChart.data.datasets[0].data = receivedData;
    activityChart.data.datasets[1].data = deliveredData;
    activityChart.update();
}

document.getElementById('monthButton').addEventListener('click', () => {
    updateChartData('month');
    setActiveButton('monthButton');
});

document.getElementById('weekButton').addEventListener('click', () => {
    updateChartData('week');
    setActiveButton('weekButton');
});

document.getElementById('yearButton').addEventListener('click', () => {
    updateChartData('year');
    setActiveButton('yearButton');
});

function setActiveButton(buttonId) {
    for (const button of document.querySelectorAll('.chart-action')) {
        button.classList.remove('active');
    }
    document.getElementById(buttonId).classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('keyup', function (e) {
            if (e.key === 'Enter') {
                console.log('Searching for:', this.value);
            }
        });
    }

    const addPackageBtn = document.querySelector('.btn-add-package');
    if (addPackageBtn) {
        addPackageBtn.addEventListener('click', () => {
            console.log('Add package clicked');
        });
    }

    const packageActions = document.querySelectorAll('.package-action');
    for (const action of packageActions) {
        action.addEventListener('click', function (e) {
            e.preventDefault();
            const trackingNumber = this.closest('tr').querySelector('.tracking-number').textContent;
            console.log('View package details:', trackingNumber);
        });
    }
});