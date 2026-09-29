/* =========================================================
   BITEHUB - MAIN JAVASCRIPT
========================================================= */


/* ================= MOBILE MENU ================= */

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileNav = document.getElementById("mobileNav");

if (mobileMenuBtn && mobileNav) {

    mobileMenuBtn.addEventListener("click", () => {

        mobileNav.classList.toggle("show");

        const icon = mobileMenuBtn.querySelector("i");

        if (mobileNav.classList.contains("show")) {

            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });

}


/* ================= CART ================= */

let cartCount = 0;

const cartCountElement = document.querySelector(".cart-count");

const addButtons = document.querySelectorAll(".add-btn");

addButtons.forEach((button) => {

    button.addEventListener("click", () => {

        cartCount++;

        if (cartCountElement) {
            cartCountElement.textContent = cartCount;
        }

        /* Small button animation */

        button.style.transform = "scale(1.2)";

        setTimeout(() => {
            button.style.transform = "";
        }, 150);

    });

});


/* ================= FAVORITE BUTTON ================= */

const favoriteButtons = document.querySelectorAll(".favorite-btn");

favoriteButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const icon = button.querySelector("i");

        if (icon.classList.contains("fa-regular")) {

            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");

            button.style.color = "#e94d43";

        } else {

            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");

            button.style.color = "";

        }

    });

});


/* ================= CART BUTTON ================= */

const cartBtn = document.getElementById("cartBtn");

if (cartBtn) {

    cartBtn.addEventListener("click", () => {

        if (cartCount === 0) {

            alert("Your cart is empty!");

        } else {

            alert(`You have ${cartCount} item(s) in your cart.`);

        }

    });

}


/* ================= PROFILE BUTTON ================= */

const profileBtn = document.getElementById("profileBtn");

if (profileBtn) {

    profileBtn.addEventListener("click", () => {

        /*
         * Later this will check login status
         * and redirect to profile/login page.
         */

        alert("Customer login will be connected in Phase 2.");

    });

}


/* ================= CATEGORY CLICK ================= */

const categoryCards = document.querySelectorAll(".category-card");

categoryCards.forEach((card) => {

    card.addEventListener("click", () => {

        const categoryName =
            card.querySelector("h3")?.textContent || "Category";

        alert(`${categoryName} category will open here.`);

    });

});


/* ================= SEARCH BUTTON ================= */

const searchBtn = document.querySelector(".search-btn");

if (searchBtn) {

    searchBtn.addEventListener("click", () => {

        const searchTerm = prompt("What food are you looking for?");

        if (searchTerm && searchTerm.trim() !== "") {

            alert(`Searching for "${searchTerm}"...`);

        }

    });

}


/* ================= NEWSLETTER ================= */

const subscribeButton =
    document.querySelector(".subscribe-box button");

const emailInput =
    document.querySelector(".subscribe-box input");

if (subscribeButton && emailInput) {

    subscribeButton.addEventListener("click", () => {

        const email = emailInput.value.trim();

        if (!email) {

            alert("Please enter your email address.");

            return;
        }

        if (!email.includes("@")) {

            alert("Please enter a valid email address.");

            return;
        }

        alert("Thank you for subscribing! 🎉");

        emailInput.value = "";

    });

}


/* ================= CLOSE MOBILE MENU ================= */

const mobileLinks =
    document.querySelectorAll(".mobile-nav a");

mobileLinks.forEach((link) => {

    link.addEventListener("click", () => {

        mobileNav.classList.remove("show");

        const icon = mobileMenuBtn.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");

    });

});


/* ================= SIMPLE SCROLL REVEAL ================= */

const revealElements = document.querySelectorAll(
    ".category-card, .food-card, .step, .benefit-item"
);

const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.1
    }
);


revealElements.forEach((element) => {

    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition =
        "opacity 0.6s ease, transform 0.6s ease";

    revealObserver.observe(element);

});