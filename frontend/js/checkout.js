
/* =========================================
   BITEHUB CHECKOUT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    let cart =
        JSON.parse(
            localStorage.getItem("bitehubCart")
        ) || [];


    /* =========================================
       ELEMENTS
    ========================================== */

    const checkoutItems =
        document.getElementById("checkoutItems");

    const subtotalElement =
        document.getElementById("subtotal");

    const deliveryElement =
        document.getElementById("deliveryFee");

    const discountElement =
        document.getElementById("discount");

    const totalElement =
        document.getElementById("total");

    const placeOrderBtn =
        document.getElementById("placeOrderBtn");

    const couponCode =
        document.getElementById("couponCode");

    const applyCoupon =
        document.getElementById("applyCoupon");

    const couponMessage =
        document.getElementById("couponMessage");

    const successOverlay =
        document.getElementById("successOverlay");

    const successOrderId =
        document.getElementById("successOrderId");

    const continueBtn =
        document.getElementById("continueBtn");


    let discount = 0;


    /* =========================================
       CHECK CART
    ========================================== */

    if (cart.length === 0) {

        alert("Your cart is empty.");

        window.location.href =
            "index.html";

        return;
    }


    /* =========================================
       RENDER ORDER
    ========================================== */

    function renderOrder() {

        checkoutItems.innerHTML = "";

        let subtotal = 0;


        cart.forEach(item => {

            const itemTotal =
                Number(item.price) *
                Number(item.quantity);

            subtotal += itemTotal;


            const element =
                document.createElement("div");

            element.className =
                "checkout-item";


            element.innerHTML = `

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div class="checkout-item-info">

                    <strong>
                        ${item.name}
                    </strong>

                    <span>
                        Qty: ${item.quantity}
                    </span>

                </div>

                <div class="checkout-item-price">
                    ₹${itemTotal}
                </div>

            `;


            checkoutItems.appendChild(element);

        });


        const delivery =
            subtotal >= 499 ? 0 : 40;


        const total =
            subtotal +
            delivery -
            discount;


        subtotalElement.textContent =
            `₹${subtotal}`;


        deliveryElement.textContent =
            delivery === 0
                ? "FREE"
                : `₹${delivery}`;


        discountElement.textContent =
            `- ₹${discount}`;


        totalElement.textContent =
            `₹${total}`;


        return {
            subtotal,
            delivery,
            discount,
            total
        };

    }


    renderOrder();


    /* =========================================
       COUPON
    ========================================== */

    applyCoupon.addEventListener(
        "click",
        () => {

            const code =
                couponCode.value
                    .trim()
                    .toUpperCase();


            if (!code) {

                couponMessage.textContent =
                    "Please enter a coupon code.";

                couponMessage.style.color =
                    "#e34e3b";

                return;
            }


            if (code === "WELCOME50") {

                discount = 50;

                couponMessage.textContent =
                    "✓ ₹50 discount applied!";

                couponMessage.style.color =
                    "#20a35a";

                renderOrder();

                return;
            }


            if (code === "BITE10") {

                const subtotal =
                    cart.reduce(
                        (sum, item) =>
                            sum +
                            Number(item.price) *
                            Number(item.quantity),
                        0
                    );


                discount =
                    Math.round(
                        subtotal * 0.10
                    );


                couponMessage.textContent =
                    "✓ 10% discount applied!";

                couponMessage.style.color =
                    "#20a35a";

                renderOrder();

                return;
            }


            discount = 0;

            couponMessage.textContent =
                "Invalid coupon code.";

            couponMessage.style.color =
                "#e34e3b";

            renderOrder();

        }
    );


    /* =========================================
       PAYMENT UI
    ========================================== */

    const paymentOptions =
        document.querySelectorAll(
            ".payment-option"
        );


    paymentOptions.forEach(option => {

        option.addEventListener(
            "click",
            () => {

                paymentOptions.forEach(
                    item =>
                        item.classList.remove(
                            "active"
                        )
                );


                option.classList.add(
                    "active"
                );


                const radio =
                    option.querySelector(
                        "input"
                    );

                radio.checked = true;

            }
        );

    });


    /* =========================================
       ONLY NUMBERS
    ========================================== */

    document
        .getElementById("customerPhone")
        .addEventListener(
            "input",
            event => {

                event.target.value =
                    event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

            }
        );


    document
        .getElementById("pincode")
        .addEventListener(
            "input",
            event => {

                event.target.value =
                    event.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);

            }
        );


    /* =========================================
       PLACE ORDER
    ========================================== */

    placeOrderBtn.addEventListener(
        "click",
        () => {

            const name =
                document
                    .getElementById("customerName")
                    .value
                    .trim();


            const phone =
                document
                    .getElementById("customerPhone")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("customerEmail")
                    .value
                    .trim();


            const address =
                document
                    .getElementById("address")
                    .value
                    .trim();


            const area =
                document
                    .getElementById("area")
                    .value
                    .trim();


            const city =
                document
                    .getElementById("city")
                    .value
                    .trim();


            const pincode =
                document
                    .getElementById("pincode")
                    .value
                    .trim();


            const landmark =
                document
                    .getElementById("landmark")
                    .value
                    .trim();


            const instructions =
                document
                    .getElementById("instructions")
                    .value
                    .trim();


            const payment =
                document.querySelector(
                    'input[name="payment"]:checked'
                ).value;


            /* ---------------------------------
               VALIDATION
            ---------------------------------- */

            if (!name) {

                alert("Please enter your name.");

                return;
            }


            if (!/^[6-9]\d{9}$/.test(phone)) {

                alert(
                    "Please enter a valid 10-digit mobile number."
                );

                return;
            }


            if (!address) {

                alert(
                    "Please enter your house / flat details."
                );

                return;
            }


            if (!area) {

                alert(
                    "Please enter your area / locality."
                );

                return;
            }


            if (!city) {

                alert("Please enter your city.");

                return;
            }


            if (!/^\d{6}$/.test(pincode)) {

                alert(
                    "Please enter a valid 6-digit pincode."
                );

                return;
            }


            /* ---------------------------------
               CALCULATE TOTAL
            ---------------------------------- */

            const summary =
                renderOrder();


            /* ---------------------------------
               GENERATE ORDER ID
            ---------------------------------- */

            const randomNumber =
                Math.floor(
                    1000 +
                    Math.random() * 9000
                );


            const orderId =
                `BH${randomNumber}`;


            /* ---------------------------------
               CREATE ORDER
            ---------------------------------- */

            const order = {

                id: orderId,

                customer: name,

                phone: phone,

                email: email,

                address:
                    `${address}, ${area}, ${city} - ${pincode}`,

                landmark: landmark,

                instructions: instructions,

                paymentMethod: payment,

                items: cart.map(item => ({
                    name: item.name,
                    price: Number(item.price),
                    quantity: Number(item.quantity),
                    image: item.image
                })),

                subtotal:
                    summary.subtotal,

                deliveryFee:
                    summary.delivery,

                discount:
                    summary.discount,

                total:
                    summary.total,

                status: "pending",

                createdAt:
                    new Date().toISOString(),

                time:
                    "Just now"

            };


            /* ---------------------------------
               SAVE ORDER
            ---------------------------------- */

            let existingOrders =
                JSON.parse(
                    localStorage.getItem(
                        "restaurantOrders"
                    )
                ) || [];


            existingOrders.unshift(order);


            localStorage.setItem(
                "restaurantOrders",
                JSON.stringify(existingOrders)
            );


            /* ---------------------------------
               CLEAR CART
            ---------------------------------- */

            localStorage.removeItem(
                "bitehubCart"
            );


            /* ---------------------------------
               SHOW SUCCESS
            ---------------------------------- */

            successOrderId.textContent =
                `#${orderId}`;


            successOverlay.classList.add(
                "show"
            );

        }
    );


    /* =========================================
       CONTINUE
    ========================================== */

    continueBtn.addEventListener(
        "click",
        () => {

            window.location.href =
                "index.html";

        }
    );

});
