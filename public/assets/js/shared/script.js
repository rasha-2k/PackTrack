
document.addEventListener("DOMContentLoaded", () => {

    /*=========================== Load loading screen ===========================*/
    const loadEl = document.getElementById('loader');
    if (!loadEl) {
        console.warn("#load element not found");
    } else {

        const state = document.readyState;
        if (state === 'interactive') {
            loadEl.style.display = "flex";
            fetch('/public/views/shared/loading.html')
                .then(response => response.text())
                .then(html => {
                    loadEl.innerHTML = html;
                    const scripts = loadEl.querySelectorAll("script");

                    scripts.forEach(oldScript => {
                        const newScript = document.createElement("script");
                        if (oldScript.src) {
                            newScript.src = oldScript.src; 
                        } else {
                            newScript.textContent = oldScript.textContent; 
                        }
                        document.body.appendChild(newScript);
                    });
                });
        }
        window.addEventListener('loader', () => {
            setTimeout(() => {
                loadEl.style.display = "none";
            }, 2000);
        });
    }

    /*=========================== Toggle between login and register forms ===========================*/
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginBtn = document.getElementById('show-login');
    const registerBtn = document.getElementById('show-register');
    const linkToLogin = document.getElementById('link-to-login');

    if (loginBtn && registerBtn) {

        function showLogin() {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            loginBtn.classList.add('active');
            registerBtn.classList.remove('active');
            loginForm.classList.add('animated', 'fadeIn');
            setTimeout(() => {
                loginForm.classList.remove('animated', 'fadeIn');
            }, 500);
        }

        function showRegister() {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            registerBtn.classList.add('active');
            loginBtn.classList.remove('active');
            registerForm.classList.add('animated', 'fadeIn');
            setTimeout(() => {
                registerForm.classList.remove('animated', 'fadeIn');
            }, 500);
        }

        loginBtn.addEventListener('click', showLogin);
        registerBtn.addEventListener('click', showRegister);
    }
    /*=========================== Show/Hide Admin Secret Field ===========================*/
    const registerRole = document.getElementById("register-role");
    const adminSecretGroup = document.getElementById("admin-secret-group");
    if (registerRole && adminSecretGroup) {

        registerRole.addEventListener("change", () => {
            adminSecretGroup.style.display = registerRole.value === "admin" ? "block" : "none";
        });
    }
    /*=========================== Password visibility toggle ===========================*/
    const passwordToggles = document.querySelectorAll('.password-toggle');
    for (const toggle of passwordToggles) {
        toggle.addEventListener('click', () => {
            const passwordField = toggle.previousElementSibling;
            const icon = toggle.querySelector('i');

            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                passwordField.type = 'password';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    }


    loadAddPackageModal();
});

function loadAddPackageModal() {
    const btn = document.getElementById('showAddPackageModalBtn');
    const container = document.getElementById('addPackageModalContainer');

    // If either the button or container is not found, exit early
    if (!btn || !container) {
        console.debug('Add package modal elements not found');
        return;
    }

    btn.addEventListener('click', async () => {
        if (!container.innerHTML.trim()) {
            const response = await fetch('/public/views/shared/add-package-modal.html');
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
            if (statusValue === 'Delayed') {
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
                    const response = await fetch('/app/handlers/add-package.php', {
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

