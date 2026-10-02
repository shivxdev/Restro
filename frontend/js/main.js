
/* =========================================================
   BITEHUB - MAIN JAVASCRIPT
========================================================= */


/* =========================================================
   CART
========================================================= */

let cart = JSON.parse(
    localStorage.getItem("bitehubCart")
) || [];


/* ================= SAVE CART ================= */

function saveCart() {

    localStorage.setItem(
        "bitehubCart",
        JSON.stringify(cart)
    );

}


/* ================= UPDATE CART COUNT ================= */

function updateCartCount() {

    const cartCount =
        document.querySelector(".cart-count");

    if (!cartCount) return;

    let totalItems = 0;

    cart.forEach((item) => {

        totalItems += Number(item.quantity) || 0;

    });

    cartCount.textContent = totalItems;

}


/* ================= ADD TO CART ================= */

function addToCart(name, price, image) {

    const existingItem = cart.find(
        (item) => item.name === name
    );


    if (existingItem) {

        existingItem.quantity =
            Number(existingItem.quantity) + 1;

    } else {

        cart.push({

            id: Date.now(),

            name: name,

            price: Number(price),

            image: image || "",

            quantity: 1

        });

    }


    saveCart();

    updateCartCount();


    console.log("Added to cart:", name);

    console.log("Current cart:", cart);


    /* Button feedback */

    return true;

}


/* =========================================================
   FOOD CARD ADD BUTTONS
========================================================= */

const addButtons =
    document.querySelectorAll(".add-btn");


addButtons.forEach((button) => {

    button.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();


        /* Find food card */

        const foodCard =
            this.closest(".food-card");


        if (!foodCard) {

            console.error(
                "Food card not found!"
            );

            return;

        }


        /* Food name */

        const nameElement =
            foodCard.querySelector(
                ".food-content h3"
            );


        /* Food price */

        const priceElement =
            foodCard.querySelector(
                ".food-bottom strong"
            );


        if (!nameElement) {

            console.error(
                "Food name not found!"
            );

            return;

        }


        if (!priceElement) {

            console.error(
                "Food price not found!"
            );

            return;

        }


        const foodName =
            nameElement.textContent.trim();


        const priceText =
            priceElement.textContent
                .replace(/[₹,]/g, "")
                .trim();


        const foodPrice =
            parseFloat(priceText);


        if (isNaN(foodPrice)) {

            console.error(
                "Invalid food price:",
                priceText
            );

            return;

        }


        /* Food image */

        let foodImage = "";


        const imageElement =
            foodCard.querySelector(
                ".food-image img"
            );


        if (imageElement) {

            foodImage =
                imageElement.getAttribute("src");

        } else {

            /* If using emoji instead of image */

            const emojiElement =
                foodCard.querySelector(
                    ".food-emoji"
                );


            if (emojiElement) {

                foodImage =
                    emojiElement.textContent.trim();

            }

        }


        /* Add item */

        const added =
            addToCart(
                foodName,
                foodPrice,
                foodImage
            );


        if (added) {

            /* Change + to ✓ */

            const oldContent =
                this.innerHTML;


            this.innerHTML =
                '<i class="fa-solid fa-check"></i>';


            setTimeout(() => {

                this.innerHTML =
                    oldContent;

            }, 800);

        }

    });

});


/* =========================================================
   CART BUTTON
========================================================= */

const cartBtn =
    document.getElementById("cartBtn");


if (cartBtn) {

    cartBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "cart.html";

        }
    );

}


/* =========================================================
   INITIAL CART COUNT
========================================================= */

updateCartCount();


/* =========================================================
   MOBILE MENU
========================================================= */

const mobileMenuBtn =
    document.getElementById(
        "mobileMenuBtn"
    );


const mobileNav =
    document.getElementById(
        "mobileNav"
    );


if (
    mobileMenuBtn &&
    mobileNav
) {

    mobileMenuBtn.addEventListener(
        "click",
        function () {

            mobileNav.classList.toggle(
                "show"
            );


            const icon =
                mobileMenuBtn.querySelector("i");


            if (!icon) return;


            if (
                mobileNav.classList.contains(
                    "show"
                )
            ) {

                icon.classList.remove(
                    "fa-bars"
                );

                icon.classList.add(
                    "fa-xmark"
                );

            } else {

                icon.classList.remove(
                    "fa-xmark"
                );

                icon.classList.add(
                    "fa-bars"
                );

            }

        }
    );

}


/* =========================================================
   PROFILE BUTTON
========================================================= */

const profileBtn =
    document.getElementById(
        "profileBtn"
    );


if (profileBtn) {

    profileBtn.addEventListener(
        "click",
        function () {

            /*
             * Customer login will be connected
             * with profile system later.
             */

            window.location.href =
                "login.html";

        }
    );

}


/* =========================================================
   FAVORITE BUTTONS
========================================================= */

const favoriteButtons =
    document.querySelectorAll(
        ".favorite-btn"
    );


favoriteButtons.forEach((button) => {

    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            const icon =
                this.querySelector("i");


            if (!icon) return;


            if (
                icon.classList.contains(
                    "fa-regular"
                )
            ) {

                icon.classList.remove(
                    "fa-regular"
                );

                icon.classList.add(
                    "fa-solid"
                );

                this.style.color =
                    "#e94d43";

            } else {

                icon.classList.remove(
                    "fa-solid"
                );

                icon.classList.add(
                    "fa-regular"
                );

                this.style.color =
                    "";

            }

        }
    );

});


/* =========================================================
   CATEGORY CLICK
========================================================= */

const categoryCards =
    document.querySelectorAll(
        ".category-card"
    );


categoryCards.forEach((card) => {

    card.addEventListener(
        "click",
        function () {

            const categoryName =
                card.querySelector("h3")
                    ?.textContent
                    .trim() ||
                "Category";


            alert(
                `${categoryName} category will open here.`
            );

        }
    );

});


/* =========================================================
   SEARCH BUTTON
========================================================= */

const searchBtn =
    document.querySelector(
        ".search-btn"
    );


if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        function () {

            const searchTerm =
                prompt(
                    "What food are you looking for?"
                );


            if (
                searchTerm &&
                searchTerm.trim() !== ""
            ) {

                alert(
                    `Searching for "${searchTerm}"...`
                );

            }

        }
    );

}


/* =========================================================
   NEWSLETTER
========================================================= */

const subscribeButton =
    document.querySelector(
        ".subscribe-box button"
    );


const emailInput =
    document.querySelector(
        ".subscribe-box input"
    );


if (
    subscribeButton &&
    emailInput
) {

    subscribeButton.addEventListener(
        "click",
        function () {

            const email =
                emailInput.value.trim();


            if (!email) {

                alert(
                    "Please enter your email address."
                );

                return;

            }


            if (!email.includes("@")) {

                alert(
                    "Please enter a valid email address."
                );

                return;

            }


            alert(
                "Thank you for subscribing! 🎉"
            );


            emailInput.value = "";

        }
    );

}


/* =========================================================
   CLOSE MOBILE MENU
========================================================= */

const mobileLinks =
    document.querySelectorAll(
        ".mobile-nav a"
    );


mobileLinks.forEach((link) => {

    link.addEventListener(
        "click",
        function () {

            if (!mobileNav) return;


            mobileNav.classList.remove(
                "show"
            );


            if (!mobileMenuBtn) return;


            const icon =
                mobileMenuBtn.querySelector("i");


            if (!icon) return;


            icon.classList.remove(
                "fa-xmark"
            );


            icon.classList.add(
                "fa-bars"
            );

        }
    );

});


/* =========================================================
   SIMPLE SCROLL REVEAL
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".category-card, .food-card, .step, .benefit-item"
    );


if (
    "IntersectionObserver" in window
) {

    const revealObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";


                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.1
            }
        );


    revealElements.forEach(
        (element) => {

            element.style.opacity =
                "0";


            element.style.transform =
                "translateY(20px)";


            element.style.transition =
                "opacity 0.6s ease, transform 0.6s ease";


            revealObserver.observe(
                element
            );

        }
    );

}
