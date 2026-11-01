
/* =========================================================
   BITEHUB - CUSTOMER PROFILE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =========================================
       ELEMENTS
    ========================================== */

    const profileName =
        document.getElementById("profileName");

    const avatarLetter =
        document.getElementById("avatarLetter");

    const fullName =
        document.getElementById("fullName");

    const mobile =
        document.getElementById("mobile");

    const email =
        document.getElementById("email");

    const house =
        document.getElementById("house");

    const area =
        document.getElementById("area");

    const city =
        document.getElementById("city");

    const pincode =
        document.getElementById("pincode");

    const landmark =
        document.getElementById("landmark");

    const profileForm =
        document.getElementById("profileForm");

    const addressForm =
        document.getElementById("addressForm");

    const passwordForm =
        document.getElementById("passwordForm");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const cartCount =
        document.getElementById("cartCount");


    /* =========================================
       CUSTOMER DATA
    ========================================== */

    let customer =
        JSON.parse(
            localStorage.getItem(
                "bitehubCustomer"
            )
        ) || null;


    /* =========================================
       BACKWARD COMPATIBILITY
       If old login used "customer"
    ========================================== */

    if (!customer) {

        const oldCustomer =
            localStorage.getItem("customer");


        if (oldCustomer) {

            try {

                customer =
                    JSON.parse(
                        oldCustomer
                    );

            } catch (error) {

                customer = null;

            }

        }

    }


    /* =========================================
       DEFAULT CUSTOMER
    ========================================== */

    if (!customer) {

        customer = {

            name: "",

            mobile: "",

            email: "",

            password: "",

            address: {

                house: "",

                area: "",

                city: "",

                pincode: "",

                landmark: ""

            }

        };

    }


    /* =========================================
       SAVE CUSTOMER
    ========================================== */

    function saveCustomer() {

        localStorage.setItem(
            "bitehubCustomer",
            JSON.stringify(customer)
        );


        /*
         * Also keep old customer key updated
         * if other BiteHub pages use it.
         */

        localStorage.setItem(
            "customer",
            JSON.stringify(customer)
        );

    }


    /* =========================================
       LOAD PROFILE
    ========================================== */

    function loadProfile() {

        fullName.value =
            customer.name || "";


        mobile.value =
            customer.mobile || "";


        email.value =
            customer.email || "";


        if (customer.address) {

            house.value =
                customer.address.house || "";


            area.value =
                customer.address.area || "";


            city.value =
                customer.address.city || "";


            pincode.value =
                customer.address.pincode || "";


            landmark.value =
                customer.address.landmark || "";

        }


        updateProfileHeader();

    }


    /* =========================================
       PROFILE HEADER
    ========================================== */

    function updateProfileHeader() {

        const name =
            customer.name ||
            "Customer";


        profileName.textContent =
            name.split(" ")[0];


        const letter =
            name
                .trim()
                .charAt(0)
                .toUpperCase() ||
            "U";


        avatarLetter.textContent =
            letter;

    }


    /* =========================================
       CART COUNT
    ========================================== */

    function updateCartCount() {

        const cart =
            JSON.parse(
                localStorage.getItem(
                    "bitehubCart"
                )
            ) || [];


        let total = 0;


        cart.forEach(item => {

            total +=
                Number(item.quantity) || 0;

        });


        if (cartCount) {

            cartCount.textContent =
                total;

        }

    }


    updateCartCount();


    /* =========================================
       PERSONAL INFORMATION
    ========================================== */

    if (profileForm) {

        profileForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const name =
                    fullName.value.trim();


                const phone =
                    mobile.value.trim();


                const userEmail =
                    email.value.trim();


                if (!name) {

                    alert(
                        "Please enter your full name."
                    );

                    return;

                }


                if (
                    !/^[0-9]{10}$/.test(phone)
                ) {

                    alert(
                        "Please enter a valid 10-digit mobile number."
                    );

                    return;

                }


                if (
                    userEmail &&
                    !userEmail.includes("@")
                ) {

                    alert(
                        "Please enter a valid email address."
                    );

                    return;

                }


                customer.name =
                    name;


                customer.mobile =
                    phone;


                customer.email =
                    userEmail;


                saveCustomer();

                updateProfileHeader();


                alert(
                    "Personal details saved successfully! ✅"
                );

            }
        );

    }


    /* =========================================
       ADDRESS
    ========================================== */

    if (addressForm) {

        addressForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const pin =
                    pincode.value.trim();


                if (
                    pin &&
                    !/^[0-9]{6}$/.test(pin)
                ) {

                    alert(
                        "Please enter a valid 6-digit pincode."
                    );

                    return;

                }


                customer.address = {

                    house:
                        house.value.trim(),

                    area:
                        area.value.trim(),

                    city:
                        city.value.trim(),

                    pincode:
                        pin,

                    landmark:
                        landmark.value.trim()

                };


                saveCustomer();


                alert(
                    "Delivery address saved successfully! 📍"
                );

            }
        );

    }


    /* =========================================
       PASSWORD
    ========================================== */

    if (passwordForm) {

        passwordForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const currentPassword =
                    document.getElementById(
                        "currentPassword"
                    ).value.trim();


                const newPassword =
                    document.getElementById(
                        "newPassword"
                    ).value.trim();


                const confirmPassword =
                    document.getElementById(
                        "confirmPassword"
                    ).value.trim();


                if (
                    !/^[0-9]{6}$/.test(newPassword)
                ) {

                    alert(
                        "New password must contain exactly 6 digits."
                    );

                    return;

                }


                /*
                 * If an existing password is stored,
                 * verify it.
                 */

                if (
                    customer.password &&
                    currentPassword !==
                        customer.password
                ) {

                    alert(
                        "Current password is incorrect."
                    );

                    return;

                }


                if (
                    newPassword !==
                    confirmPassword
                ) {

                    alert(
                        "New passwords do not match."
                    );

                    return;

                }


                customer.password =
                    newPassword;


                saveCustomer();


                passwordForm.reset();


                alert(
                    "Password updated successfully! 🔐"
                );

            }
        );

    }


    /* =========================================
       PASSWORD SHOW / HIDE
    ========================================== */

    const passwordToggles =
        document.querySelectorAll(
            ".password-toggle"
        );


    passwordToggles.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const targetId =
                    button.dataset.target;


                const input =
                    document.getElementById(
                        targetId
                    );


                if (!input) return;


                const icon =
                    button.querySelector("i");


                if (
                    input.type === "password"
                ) {

                    input.type =
                        "text";


                    icon.classList.remove(
                        "fa-eye"
                    );

                    icon.classList.add(
                        "fa-eye-slash"
                    );

                } else {

                    input.type =
                        "password";


                    icon.classList.remove(
                        "fa-eye-slash"
                    );

                    icon.classList.add(
                        "fa-eye"
                    );

                }

            }
        );

    });


    /* =========================================
       LOGOUT
    ========================================== */

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            () => {

                const confirmLogout =
                    confirm(
                        "Are you sure you want to logout?"
                    );


                if (!confirmLogout) {

                    return;

                }


                localStorage.removeItem(
                    "customer"
                );


                /*
                 * Keep bitehubCustomer because
                 * it contains saved profile data.
                 */

                window.location.href =
                    "login.html";

            }
        );

    }


    /* =========================================
       AVATAR BUTTON
    ========================================== */

    const avatarEdit =
        document.getElementById(
            "avatarEdit"
        );


    if (avatarEdit) {

        avatarEdit.addEventListener(
            "click",
            () => {

                alert(
                    "Profile photo upload will be added later."
                );

            }
        );

    }


    /* =========================================
       INITIAL LOAD
    ========================================== */

    loadProfile();

});
