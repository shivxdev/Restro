
/* =========================================
   OWNER LOGIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("ownerLoginForm");
    const phoneInput = document.getElementById("ownerPhone");
    const passwordInput = document.getElementById("ownerPassword");
    const togglePassword = document.getElementById("togglePassword");
    const loginError = document.getElementById("loginError");
    const rememberOwner = document.getElementById("rememberOwner");
    const forgotPassword = document.getElementById("forgotPassword");


    /* =========================================
       ONLY NUMBERS - MOBILE
    ========================================== */

    phoneInput.addEventListener("input", () => {

        phoneInput.value = phoneInput.value.replace(/\D/g, "");

        if (phoneInput.value.length > 10) {
            phoneInput.value = phoneInput.value.slice(0, 10);
        }

    });


    /* =========================================
       ONLY NUMBERS - PASSWORD
    ========================================== */

    passwordInput.addEventListener("input", () => {

        passwordInput.value = passwordInput.value.replace(/\D/g, "");

        if (passwordInput.value.length > 6) {
            passwordInput.value = passwordInput.value.slice(0, 6);
        }

    });


    /* =========================================
       SHOW / HIDE PASSWORD
    ========================================== */

    togglePassword.addEventListener("click", () => {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.textContent = "🙈";

            togglePassword.setAttribute(
                "aria-label",
                "Hide password"
            );

        } else {

            passwordInput.type = "password";

            togglePassword.textContent = "👁";

            togglePassword.setAttribute(
                "aria-label",
                "Show password"
            );

        }

    });


    /* =========================================
       HIDE ERROR
    ========================================== */

    function hideError() {

        loginError.classList.remove("show");

    }


    phoneInput.addEventListener("input", hideError);
    passwordInput.addEventListener("input", hideError);


    /* =========================================
       LOGIN
    ========================================== */

    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const phone = phoneInput.value.trim();
        const password = passwordInput.value.trim();


        /* -----------------------------------------
           MOBILE VALIDATION
        ------------------------------------------ */

        if (!/^[6-9]\d{9}$/.test(phone)) {

            loginError.textContent =
                "Please enter a valid 10-digit mobile number.";

            loginError.classList.add("show");

            phoneInput.focus();

            return;
        }


        /* -----------------------------------------
           PASSWORD VALIDATION
        ------------------------------------------ */

        if (!/^\d{6}$/.test(password)) {

            loginError.textContent =
                "Password must contain exactly 6 digits.";

            loginError.classList.add("show");

            passwordInput.focus();

            return;
        }


        /* -----------------------------------------
           DEMO OWNER CREDENTIALS
           
           CHANGE THESE LATER WHEN BACKEND
           DATABASE LOGIN IS CONNECTED.
        ------------------------------------------ */

        const OWNER_PHONE = "9876543210";
        const OWNER_PASSWORD = "123456";


        /* -----------------------------------------
           CHECK LOGIN
        ------------------------------------------ */

        if (
            phone === OWNER_PHONE &&
            password === OWNER_PASSWORD
        ) {

            const ownerData = {
                phone: phone,
                role: "owner",
                loginTime: new Date().toISOString()
            };


            /* -----------------------------------------
               REMEMBER OWNER
            ------------------------------------------ */

            if (rememberOwner.checked) {

                localStorage.setItem(
                    "owner",
                    JSON.stringify(ownerData)
                );

            } else {

                sessionStorage.setItem(
                    "owner",
                    JSON.stringify(ownerData)
                );

            }


            /* -----------------------------------------
               REDIRECT
            ------------------------------------------ */

            window.location.href = "owner-dashboard.html";

        } else {

            loginError.textContent =
                "Invalid mobile number or password.";

            loginError.classList.add("show");

        }

    });


    /* =========================================
       FORGOT PASSWORD
    ========================================== */

    forgotPassword.addEventListener("click", (event) => {

        event.preventDefault();

        alert(
            "Please contact the restaurant administrator to reset the owner password."
        );

    });

});