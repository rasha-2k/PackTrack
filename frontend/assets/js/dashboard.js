// Chart configuration variables
let activityChart;
let statusChart;
document.addEventListener('DOMContentLoaded', () => {
    initGeneralFunctionalities();
    initButtons();
    initializeCharts();
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

function initButtons() {
    // Set up chart period selector
    const chartActions = document.querySelectorAll('.chart-action');
    for (const action of chartActions) {
        action.addEventListener('click', function () {
            for (const btn of chartActions) {
                btn.classList.remove('active');
            }

            this.classList.add('active');
            updateStatusChartOptions(this.textContent.trim());
        });
    }

    // Package action buttons
    const packageActions = document.querySelectorAll('.package-action');
    for (const action of packageActions) {
        action.addEventListener('click', function (e) {
            e.preventDefault();
            const trackingNumberEl = this.closest('tr')?.querySelector('.tracking-number');
            if (trackingNumberEl) {
                console.log('View package details:', trackingNumberEl.textContent);
            }
        });
    }
}

// Chart configuration
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
                beginAtZero: true,
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

function initializeCharts() {
    const isDarkMode = document.body.classList.contains('dark');
    const activityCtx = document.getElementById('activityChart');
    const statusCtx = document.getElementById('statusChart');

    const options = getChartOptions(isDarkMode);

    if (activityChart) activityChart.destroy();
    if (statusChart) statusChart.destroy();

    if (activityCtx) {
        activityChart = new Chart(activityCtx, {
            type: 'line',
            data: { labels: [], datasets: [] },
            options: {
                ...options,
            }
        });
    }

    if (statusCtx) {
        statusChart = new Chart(statusCtx, {
            type: 'doughnut',
            data: { labels: [], datasets: [] },
            options: {
                ...options,
                cutout: '50%',
                plugins: {
                    ...options.plugins,
                    legend: {
                        ...options.plugins.legend,
                        position: 'bottom'
                    }
                },
                scales: false
            }
        });
    }

    updateCharts();
}

function updateChartsTheme() {
    const isDarkMode = document.body.classList.contains('dark');
    const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const DataPointBorderColor = isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';

    const tooltipSettings = {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)',
        bodyColor: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)',
    };

    if (activityChart) {
        activityChart.options.plugins.legend.labels.color = textColor;
        activityChart.options.plugins.tooltip = tooltipSettings;
        activityChart.options.scales.x.grid.color = gridColor;
        activityChart.options.scales.x.ticks.color = textColor;
        activityChart.options.scales.y.grid.color = gridColor;
        activityChart.options.scales.y.ticks.color = textColor;
        activityChart.data.datasets[0].pointBorderColor = DataPointBorderColor;
        activityChart.data.datasets[1].pointBorderColor = DataPointBorderColor;
        activityChart.data.datasets[0].pointHoverBorderColor = DataPointBorderColor;
        activityChart.data.datasets[1].pointHoverBorderColor = DataPointBorderColor;
        activityChart.update();
    }

    if (statusChart) {
        statusChart.options.plugins.legend.labels.color = textColor;
        statusChart.options.plugins.tooltip = tooltipSettings;
        statusChart.update();
    }
}

function updateCharts() {
    updateActivityChart();
    updateStatusChart();
}

function updateActivityChart() {
    const isDarkMode = document.body.classList.contains('dark');
    const options = getChartOptions(isDarkMode);
    const DataPointBorderColor = isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';

    fetch('../../backend/api/dashboard/package-activity.php')
        .then(res => res.json())
        .then(data => {
            if (!Array.isArray(data)) {
                console.error('Invalid activity data format', data);
                return;
            }

            const labels = data.map(d => d.label);
            const received = data.map(d => d.received);
            const delivered = data.map(d => d.delivered);

            activityChart.data.labels = labels;
            activityChart.data.datasets = [
                {
                    label: 'Received',
                    data: received,
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
                },
                {
                    label: 'Delivered',
                    data: delivered,
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: '#10b981',
                    pointBorderColor: DataPointBorderColor,
                    pointBorderWidth: 2,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#10b981',
                    pointHoverBorderColor: DataPointBorderColor,
                    pointHoverBorderWidth: 2
                }
            ];
            activityChart.options = options;
            activityChart.update();
        })
        .catch(err => console.error('Failed to load activity chart data:', err));
}

function updateStatusChart() {

    const isDarkMode = document.body.classList.contains('dark');
    const options = getChartOptions(isDarkMode);

    fetch('../../backend/api/dashboard/package-status.php')
        .then(res => res.json())
        .then(data => {
            if (!Array.isArray(data)) {
                console.error('Invalid status data format', data);
                return;
            }

            const labels = data.map(d => d.status);
            const values = data.map(d => d.count);

            statusChart.data.labels = labels;
            statusChart.data.datasets = [
                {
                    data: values,
                    backgroundColor: [
                        'rgba(100, 100, 100, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderColor: [
                        'rgba(100, 100, 100, 1)',
                        'rgba(16, 185, 129, 1)',
                        'rgba(59, 130, 246, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(239, 68, 68, 1)'
                    ],
                    borderWidth: 1,
                    borderRadius: 5,
                    hoverOffset: 10
                }
            ];
            statusChart.options = {
                ...options,
                cutout: '50%',
                plugins: {
                    ...options.plugins,
                    legend: {
                        ...options.plugins.legend,
                        position: 'bottom'
                    }
                },
                scales: false
            }
            statusChart.update();
        })
        .catch(err => console.error('Failed to load status chart data:', err));
}

async function updateStatusChartOptions(period) {

    let range;

    if (typeof period === 'string') {
        if (period.trim() === '') {
            range = 'month';
        } else {
            range = period.toLowerCase();
        }
    } else {
        console.error('period is not a string:', period);
        range = 'month';
    }

    const url = `../../backend/api/dashboard/package-activity.php?range=${range}`;

    try {
        const res = await fetch(url);
        const rawData = await res.json();

        if (!Array.isArray(rawData)) {
            console.error('Invalid data format:', rawData);
            return;
        }

        rawData.sort((a, b) => {
            const getStartWeek = item => {
                if (!item.label || typeof item.label !== 'string') return 0;
                const match = item.label.match(/\d+/);
                return match ? Number.parseInt(match[0]) : 0;
            };
            return getStartWeek(a) - getStartWeek(b);
        });

        const labels = rawData.map(item => item.label);
        const received = rawData.map(item => item.received);
        const delivered = rawData.map(item => item.delivered);

        if (!Array.isArray(labels) || !Array.isArray(received) || !Array.isArray(delivered)) {
            console.error('Invalid data format after parsing:', { labels, received, delivered });
            return;
        }

        activityChart.data.labels = labels;
        activityChart.data.datasets[0].data = received;
        activityChart.data.datasets[1].data = delivered;
        activityChart.update();
    } catch (err) {
        console.error('Error fetching data for activity chart:', err);
    }
}

