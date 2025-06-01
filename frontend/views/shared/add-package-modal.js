
function smoothUpdateCharts(chartsData) {
    try {
        // === update activity chart ===
        const ActivityLabels = chartsData.activity.map(entry => entry.label);
        const delivered = chartsData.activity.map(entry => entry.delivered);
        const received = chartsData.activity.map(entry => entry.received);

        activityChart.data.labels = ActivityLabels;
        activityChart.data.datasets[0].data = received;
        activityChart.data.datasets[1].data = delivered;
        activityChart.update();


        // === update status chart ===
        const StatusLabels = chartsData.status.map(entry => entry.status);
        const StatusCounts = chartsData.status.map(entry => entry.count);

        statusChart.data.labels = StatusLabels;
        statusChart.data.datasets[0].data = StatusCounts;
        statusChart.update();

    } catch (err) {
        showNotification("Chart update failed", "error");
        console.error('Chart update failed', err);
    }
}
