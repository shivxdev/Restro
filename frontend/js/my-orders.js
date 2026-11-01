
/* =========================================================
   BITEHUB - MY ORDERS JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =========================================
       ELEMENTS
    ========================================== */

    const ordersContainer =
        document.getElementById("ordersContainer");

    const emptyOrders =
        document.getElementById("emptyOrders");

    const totalOrders =
        document.getElementById("totalOrders");

    const activeOrders =
        document.getElementById("activeOrders");

    const totalSpent =
        document.getElementById("totalSpent");

    const refreshOrders =
        document.getElementById("refreshOrders");

    const cartCount =
        document.getElementById("cartCount");


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


        let count = 0;


        cart.forEach(item => {

            count +=
                Number(item.quantity) || 0;

        });


        if (cartCount) {

            cartCount.textContent =
                count;

        }

    }


    updateCartCount();


    /* =========================================
       LOAD ORDERS
    ========================================== */

    function getOrders() {

        const savedOrders =
            localStorage.getItem(
                "restaurantOrders"
            );


        if (!savedOrders) {

            return [];

        }


        try {

            const orders =
                JSON.parse(
                    savedOrders
                );


            return Array.isArray(orders)
                ? orders
                : [];

        } catch (error) {

            console.error(
                "Unable to read orders:",
                error
            );


            return [];

        }

    }


    /* =========================================
       FORMAT DATE
    ========================================== */

    function formatDate(dateValue) {

        if (!dateValue) {

            return "Recently";

        }


        const date =
            new Date(dateValue);


        if (
            isNaN(
                date.getTime()
            )
        ) {

            return "Recently";

        }


        return date.toLocaleString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    /* =========================================
       STATUS INFORMATION
    ========================================== */

    const statusSteps = [

        {
            key: "pending",
            label: "Order Placed",
            icon: "fa-receipt"
        },

        {
            key: "accepted",
            label: "Accepted",
            icon: "fa-circle-check"
        },

        {
            key: "preparing",
            label: "Preparing",
            icon: "fa-fire-burner"
        },

        {
            key: "delivered",
            label: "Delivered",
            icon: "fa-house"
        }

    ];


    /* =========================================
       STATUS INDEX
    ========================================== */

    function getStatusIndex(status) {

        if (status === "pending") {

            return 0;

        }


        if (status === "accepted") {

            return 1;

        }


        if (status === "preparing") {

            return 2;

        }


        if (status === "delivered") {

            return 3;

        }


        return -1;

    }


    /* =========================================
       TRACKER
    ========================================== */

    function createTracker(status) {

        const currentIndex =
            getStatusIndex(status);


        return `

            <div class="tracker">

                <div class="tracker-line">

                    ${statusSteps.map(
                        (step, index) => {

                            let state = "";

                            if (
                                currentIndex >
                                index
                            ) {

                                state = "done";

                            }


                            if (
                                currentIndex ===
                                index
                            ) {

                                state = "active";

                            }


                            return `

                                <div
                                    class="tracker-step ${state}"
                                >

                                    <div class="tracker-dot">

                                        <i
                                            class="fa-solid ${step.icon}"
                                        ></i>

                                    </div>

                                    <span>
                                        ${step.label}
                                    </span>

                                </div>

                            `;

                        }
                    ).join("")}

                </div>

            </div>

        `;

    }


    /* =========================================
       RENDER ORDER
    ========================================== */

    function renderOrder(order) {

        const items =
            Array.isArray(order.items)
                ? order.items
                : [];


        const itemsHTML =
            items.map(item => {

                return `

                    <div class="order-item">

                        <span>
                            ${item.name}
                        </span>

                        <span class="quantity">
                            × ${item.quantity}
                        </span>

                    </div>

                `;

            }).join("");


        const statusText = {

            pending: "Pending",

            accepted: "Accepted",

            preparing: "Preparing",

            delivered: "Delivered",

            rejected: "Rejected"

        };


        const status =
            statusText[order.status]
            || "Pending";


        const card =
            document.createElement(
                "article"
            );


        card.className =
            "order-card";


        card.innerHTML = `

            <!-- HEADER -->

            <div class="order-header">

                <div class="order-number">

                    <strong>
                        #${order.id}
                    </strong>

                    <span class="order-time">

                        ${formatDate(
                            order.createdAt
                        )}

                    </span>

                </div>


                <span class="status ${order.status}">

                    ${status}

                </span>

            </div>


            <!-- ORDER BODY -->

            <div class="order-body">

                <!-- ITEMS -->

                <div class="order-items">

                    ${itemsHTML}

                </div>


                <!-- ADDRESS -->

                <div>

                    <div
                        class="order-address"
                        style="border:0; padding:0;"
                    >

                        <span>📍</span>

                        <span>
                            ${order.address || "Address not provided"}
                        </span>

                    </div>

                </div>


                <!-- TOTAL -->

                <div class="order-amount">

                    <span>
                        Total Amount
                    </span>

                    <strong>
                        ₹${Number(
                            order.total || 0
                        ).toLocaleString("en-IN")}
                    </strong>

                </div>

            </div>


            <!-- EXTRA INFO -->

            ${
                order.landmark
                    ? `

                        <div class="order-address">

                            🏠

                            <span>
                                Landmark:
                                ${order.landmark}
                            </span>

                        </div>

                    `
                    : ""
            }


            ${
                order.payment
                    ? `

                        <div class="payment-info">

                            <i class="fa-solid fa-credit-card"></i>

                            Payment:
                            ${order.payment}

                        </div>

                    `
                    : ""
            }


            <!-- TRACKER -->

            ${
                order.status === "rejected"

                    ? `

                        <div class="tracker">

                            <div class="status rejected">

                                <i class="fa-solid fa-circle-xmark"></i>

                                This order was rejected by the restaurant.

                            </div>

                        </div>

                    `

                    : createTracker(
                        order.status
                    )
            }

        `;


        return card;

    }


    /* =========================================
       RENDER ALL ORDERS
    ========================================== */

    function renderOrders() {

        const orders =
            getOrders();


        ordersContainer.innerHTML = "";


        /* Stats */

        if (totalOrders) {

            totalOrders.textContent =
                orders.length;

        }


        const active =
            orders.filter(order =>
                order.status === "pending" ||
                order.status === "accepted" ||
                order.status === "preparing"
            );


        if (activeOrders) {

            activeOrders.textContent =
                active.length;

        }


        const spent =
            orders
                .filter(
                    order =>
                        order.status !==
                        "rejected"
                )
                .reduce(
                    (sum, order) =>
                        sum +
                        Number(
                            order.total || 0
                        ),
                    0
                );


        if (totalSpent) {

            totalSpent.textContent =
                `₹${spent.toLocaleString(
                    "en-IN"
                )}`;

        }


        /* Empty */

        if (orders.length === 0) {

            emptyOrders.classList.add(
                "show"
            );

            return;

        }


        emptyOrders.classList.remove(
            "show"
        );


        /* Newest first */

        orders
            .slice()
            .reverse()
            .forEach(order => {

                ordersContainer.appendChild(
                    renderOrder(order)
                );

            });

    }


    /* =========================================
       REFRESH
    ========================================== */

    if (refreshOrders) {

        refreshOrders.addEventListener(
            "click",
            () => {

                renderOrders();

                refreshOrders.innerHTML = `
                    <i class="fa-solid fa-check"></i>
                    Updated
                `;


                setTimeout(() => {

                    refreshOrders.innerHTML = `
                        <i class="fa-solid fa-rotate"></i>
                        Refresh
                    `;

                }, 1000);

            }
        );

    }


    /* =========================================
       AUTO REFRESH
    ========================================== */

    setInterval(() => {

        renderOrders();

    }, 3000);


    /* =========================================
       INITIAL RENDER
    ========================================== */

    renderOrders();

});
