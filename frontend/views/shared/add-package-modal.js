document.addEventListener('DOMContentLoaded', () => {
    loadAddPackageModal();
});

function loadAddPackageModal() {
    const btn = document.getElementById('showAddPackageModalBtn');
    const container = document.getElementById('addPackageModalContainer');

    btn.addEventListener('click', async () => {
        if (!container.innerHTML.trim()) {
            const response = await fetch('/frontend/views/shared/add-package-modal.html');
            const html = await response.text();
            container.innerHTML = html;

            attachModalCloseLogic();
        }

        openModal();
    });

    function openModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalContent = document.getElementById('modalContent');
        if (modalOverlay && modalContent) {
            modalOverlay.classList.remove('hidden');
            modalOverlay.classList.add('flex');
            modalOverlay.style.opacity = '0';
            modalContent.style.transform = 'scale(0.95)';
            setTimeout(() => {
                modalOverlay.style.opacity = '1';
                modalContent.style.transform = 'scale(1)';
            }, 200);
        }

        const statusSelect = document.getElementById('status');
        const deliveredAtWrapper = document.getElementById('deliveredAtWrapper');
        const receivedAtWrapper = document.getElementById('receivedAtWrapper');
        const expectedDeliveryDateWrapper = document.getElementById('expectedDeliveryDateWrapper');

        function updateDateFields() {
            const statusValue = statusSelect.value;

            // Reset all fields first
            deliveredAtWrapper.style.display = 'none';
            receivedAtWrapper.style.display = 'none';
            expectedDeliveryDateWrapper.style.display = 'none';

            // Show deliveredAtWrapper for Delivered, Delayed, or Received
            if (statusValue === 'Delivered' || statusValue === 'Delayed') {
                deliveredAtWrapper.style.display = 'block';
                expectedDeliveryDateWrapper.style.display = 'block';
            }

            // Show receivedAtWrapper if status is Received or Delayed
            if (statusValue === 'Received') {
                deliveredAtWrapper.style.display = 'block';
                receivedAtWrapper.style.display = 'block';
            }
            if(statusValue === 'Delayed')
            {
                deliveredAtWrapper.style.display = 'block';
            }

            if (statusValue === 'Canceled' || statusValue === 'Pending') {
                deliveredAtWrapper.style.display = 'none';
            }
        }

        if (statusSelect) {
            statusSelect.addEventListener('change', updateDateFields);
        }

        updateDateFields();
    }

    function closeModal() {
        const modalOverlay = document.getElementById('modalOverlay');
        const modalContent = document.getElementById('modalContent');
        if (modalOverlay && modalContent) {
            modalOverlay.style.opacity = '0';
            modalContent.style.transform = 'scale(0.95)';
            setTimeout(() => {
                modalOverlay.classList.add('hidden');
                modalOverlay.classList.remove('flex');
            }, 200);
        }
    }

    function attachModalCloseLogic() {
        const closeBtn = document.getElementById('closeModalBtn');
        const modalOverlay = document.getElementById('modalOverlay');

        if (closeBtn) {
            closeBtn.addEventListener('click', closeModal);
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    closeModal();
                }
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
                closeModal();
            }
        });



        const packageForm = document.getElementById('packageForm');
        if (packageForm) {
            packageForm.addEventListener('submit', async e => {
                e.preventDefault();

                const data = {
                    courier_service: document.getElementById('courier_service').value.trim(),
                    origin: document.getElementById('origin').value.trim(),
                    destination: document.getElementById('destination').value.trim(),
                    status: document.getElementById('status').value.trim(),
                    delivered_at: document.getElementById('delivered_at').value || null,
                    expected_delivery_date: document.getElementById('expected_delivery_date').value || null,
                    received_at: document.getElementById('received_at').value || null,
                    category: document.getElementById('category').value.trim() || null
                };


                const token = localStorage.getItem('token');

                try {
                    const response = await fetch('../../backend/handlers/add-package.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(data)
                    }).then(response => response.json())
                        .then(result => {
                            if (result.success) {
                                smoothUpdateCharts(result.charts);
                                packageForm.reset();
                                closeModal();
                                showNotification("Package added successfully!", "success");
                            } else {
                                showNotification(`Error: ${result.message}`, "error");
                            }
                        })


                } catch (err) {
                    showNotification("Something went wrong!", "error");
                    console.error(err);
                }
            });
        }
    }
}



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
