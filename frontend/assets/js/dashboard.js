// Chart configuration variables
let activityChart;
let statusChart;
const isDarkMode = document.body.classList.contains('dark');
const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
const DataPointBorderColor = isDarkMode ? '#ffffff' : '#000000'; 

function getChartOptions(isDarkMode) {
    const textColor = isDarkMode ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
    const gridColor = isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
    const DataPointBorderColor = isDarkMode ? '#ffffff' : '#000000';
    const fontFamily = 'Inter';

    return {
        responsive: true,
        maintainAspectRatio: false,
        data: {
            datasets: [
                {
                    pointBorderColor: DataPointBorderColor,
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
                grid: { color: gridColor },
                ticks: { color: textColor, font: { family: fontFamily, size: 12, weight: 500 } }
            }
        }
    };
}

async function updateChartData(period) {
    const range = period.toLowerCase();
    const url = `http://localhost:8080/PackTrack/backend/api/deliveries/activity.php?range=${range}`;

    try {
        const res = await fetch(url);
        const rawData = await res.json();

        if (!Array.isArray(rawData)) {
            console.error('Invalid data format:', rawData);
            return;
        }

        // Sort data by week number
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


function updateChartsTheme() {
    const isDarkMode = document.body.classList.contains('dark');
    const textColor = isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)';
    const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const fontSettings = { family: 'Inter', size: 12, weight: 500 };

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
        activityChart.data.datasets[0].pointBorderColor = DataPointBorderColor;
        activityChart.data.datasets[1].pointBorderColor = DataPointBorderColor;
        activityChart.update();
    }

    if (statusChart) {
        statusChart.options.plugins.legend.labels.color = textColor;
        statusChart.options.plugins.legend.labels.font = fontSettings;
        statusChart.options.plugins.tooltip = tooltipSettings;
        statusChart.update();
    }
}

// Initialize charts and event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set up chart period selector
    const chartActions = document.querySelectorAll('.chart-action');
    for (const action of chartActions) {
        action.addEventListener('click', function() {
            for (const btn of chartActions) {
                btn.classList.remove('active');
            }
            
            this.classList.add('active');
            updateChartData(this.textContent.trim());
            console.log('Chart period changed to:', this.textContent.trim());
        });
    }

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
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                console.log('Searching for:', this.value);
            }
        });
    }

    // Add package button 
    const addPackageBtn = document.querySelector('.btn-add-package');
    if (addPackageBtn) {
        addPackageBtn.addEventListener('click', () => {
            console.log('Add package clicked');
        });
    }

    // Package action buttons
    const packageActions = document.querySelectorAll('.package-action');
    for (const action of packageActions) {
        action.addEventListener('click', function(e) {
            e.preventDefault();
            const trackingNumberEl = this.closest('tr')?.querySelector('.tracking-number');
            if (trackingNumberEl) {
                console.log('View package details:', trackingNumberEl.textContent);
            }
        });
    }

    // Initialize charts
    initializeCharts();
});


function initializeCharts() {
    // Activity Chart
    fetch('http://localhost:8080/PackTrack/backend/api/deliveries/activity.php')
        .then(response => response.json())
        .then(data => {
            if (!data || !Array.isArray(data)) {
                console.error('Invalid data format for activity chart:', data);
                return;
            }

            const options = getChartOptions(isDarkMode);
            const labels = data.map(item => item.label);
            const received = data.map(item => item.received);
            const delivered = data.map(item => item.delivered);

            const ctx = document.getElementById('activityChart');
            if (!ctx) return;

            activityChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Received',
                            data: received,
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            tension: 0.4,
                            fill: true,
                            borderWidth: 2,
                            pointRadius: 4,
                            pointBackgroundColor: '#3b82f6',
                            pointBorderColor: DataPointBorderColor,
                            pointBorderWidth: 2,
                            pointHoverRadius: 6,
                            pointHoverBackgroundColor: '#3b82f6',
                            pointHoverBorderColor: DataPointBorderColor,
                            pointHoverBorderWidth: 2
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
                    ]
                },
                options: {
                    ...options,
                    scales: {
                        x: {
                            beginAtZero: true,
                            grid: { color: gridColor },
                            ticks: { color: textColor, font: { family: 'Inter', size: 12, weight: 500 } }
                        },
                        y: {
                            beginAtZero: true,
                            grid: { color: gridColor },
                            ticks: { color: textColor, font: { family: 'Inter', size: 12, weight: 500 } }
                        }
                    }
                }
            });
        })
        .catch(err => console.error('Error fetching delivery activity data:', err));

    // Status Chart
    fetch('http://localhost:8080/PackTrack/backend/api/deliveries/status.php')
        .then(response => response.json())
        .then(data => {
            if (!data || typeof data !== 'object') {
                console.error('Invalid data format for status chart:', data);
                return;
            }
            
            const options = getChartOptions(isDarkMode);
            const labels = data.map(item => item.status);
            const values = data.map(item => item.count);

            const ctx = document.getElementById('statusChart');
            if (!ctx) return;

            statusChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        data: values,
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
                        ...options.plugins,
                        legend: {
                            ...options.plugins.legend,
                            position: 'bottom'
                        }
                    },
                    scales: false
                }
            });
        })
        .catch(err => console.error('Error fetching delivery status data:', err));
}

