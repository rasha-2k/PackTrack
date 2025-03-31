
document.addEventListener("DOMContentLoaded", () => {
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
    } else {
        console.log("loginBtn or registerBtn not found");
    }
    /*=========================== Show/Hide Admin Secret Field ===========================*/
    const registerRole = document.getElementById("register-role");
    const adminSecretGroup = document.getElementById("admin-secret-group");
    if (registerRole && adminSecretGroup) {

        registerRole.addEventListener("change", () => {
            adminSecretGroup.style.display = registerRole.value === "admin" ? "block" : "none";
        });
    } else {
        console.log("registerRole or adminSecretGroup not found");
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
});

document.onreadystatechange = () => {
    const state = document.readyState;
    if (state === 'interactive') {
        document.getElementById('load').style.display = "block";
        fetch('/PackTrack/frontend/views/shared/loading.html')
            .then(response => response.text())
            .then(html => {
                document.getElementById('load').innerHTML = html;
            });
    } else if (state === 'complete') {
        setTimeout(() => {
            document.getElementById('load').style.display = "none";
        }, 2000);
    }
};
