/* =========================================================
   BITEHUB - CUSTOMER AUTHENTICATION
   FRONTEND VALIDATION
========================================================= */


/* ================= HELPERS ================= */

function showError(element, message) {

    if (!element) return;

    element.textContent = message;
    element.classList.add("show");
}


function hideError(element) {

    if (!element) return;

    element.textContent = "";
    element.classList.remove("show");
}


function isValidMobile(mobile) {

    return /^[6-9]\d{9}$/.test(mobile);

}


function isValidPassword(password) {

    return /^\d{6}$/.test(password);

}


/* ================= ONLY NUMBERS ================= */

const numberInputs = document.querySelectorAll(
    'input[type="tel"], input[inputmode="numeric"]'
);

numberInputs.forEach((input) => {

    input.addEventListener("input", () => {

        input.value = input.value.replace(/\D/g, "");

    });

});


/* =========================================================
   PASSWORD TOGGLE
========================================================= */

function setupPasswordToggle(buttonId, inputId) {

    const button = document.getElementById(buttonId);
    const input = document.getElementById(inputId);

    if (!button || !input) return;

    button.addEventListener("click", () => {

        const icon = button.querySelector("i");

        if (input.type === "password") {

            input.type = "text";

            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");

        } else {

            input.type = "password";

            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");

        }

    });

}


setupPasswordToggle(
    "loginPasswordToggle",
    "loginPassword"
);

setupPasswordToggle(
    "registerPasswordToggle",
    "registerPassword"
);

setupPasswordToggle(
    "confirmPasswordToggle",
    "confirmPassword"
);


/* =========================================================
   LOGIN
========================================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const mobile =
            document.getElementById("loginMobile").value.trim();

        const password =
            document.getElementById("loginPassword").value.trim();

        const errorBox =
            document.getElementById("loginError");

        hideError(errorBox);


        /* Mobile validation */

        if (!isValidMobile(mobile)) {

            showError(
                errorBox,
                "Please enter a valid 10-digit mobile number."
            );

            return;
        }


        /* Password validation */

        if (!isValidPassword(password)) {

            showError(
                errorBox,
                "Password must contain exactly 6 digits."
            );

            return;
        }


        /*
         * TEMPORARY LOGIN
         *
         * Backend will replace this in the next phase.
         */

        const demoUser = {

            name: "BiteHub Customer",

            mobile: mobile

        };


        localStorage.setItem(
            "bitehubCustomer",
            JSON.stringify(demoUser)
        );


        alert("Login successful! 🎉");


        /*
         * Profile page will be connected
         * after we create it.
         */

        window.location.href = "profile.html";

    });

}


/* =========================================================
   REGISTER
========================================================= */

const registerForm =
    document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", (event) => {

        event.preventDefault();


        const name =
            document.getElementById("registerName")
                .value.trim();

        const mobile =
            document.getElementById("registerMobile")
                .value.trim();

        const password =
            document.getElementById("registerPassword")
                .value.trim();

        const confirmPassword =
            document.getElementById("confirmPassword")
                .value.trim();

        const terms =
            document.getElementById("terms").checked;

        const errorBox =
            document.getElementById("registerError");

        hideError(errorBox);


        /* Name */

        if (name.length < 2) {

            showError(
                errorBox,
                "Please enter your full name."
            );

            return;
        }


        /* Mobile */

        if (!isValidMobile(mobile)) {

            showError(
                errorBox,
                "Please enter a valid 10-digit mobile number."
            );

            return;
        }


        /* Password */

        if (!isValidPassword(password)) {

            showError(
                errorBox,
                "Password must contain exactly 6 digits."
            );

            return;
        }


        /* Confirm password */

        if (password !== confirmPassword) {

            showError(
                errorBox,
                "Passwords do not match."
            );

            return;
        }


        /* Terms */

        if (!terms) {

            showError(
                errorBox,
                "Please accept the Terms & Conditions."
            );

            return;
        }


        /*
         * TEMPORARY CUSTOMER DATA
         *
         * Real database registration
         * will be connected later.
         */

        const customer = {

            name: name,

            mobile: mobile,

            password: password

        };


        localStorage.setItem(
            "bitehubCustomer",
            JSON.stringify(customer)
        );


        alert(
            "Account created successfully! 🎉"
        );


        window.location.href = "profile.html";

    });

}


/* =========================================================
   FORGOT PASSWORD
========================================================= */

const forgotPassword =
    document.getElementById("forgotPassword");

if (forgotPassword) {

    forgotPassword.addEventListener("click", (event) => {

        event.preventDefault();

        alert(
            "Forgot password / OTP verification will be added with the backend."
        );

    });

}