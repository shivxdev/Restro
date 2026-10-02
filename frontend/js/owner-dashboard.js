
/* =========================================
   BITEHUB - OWNER DASHBOARD JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ELEMENTS
    ========================================= */

    const ordersContainer =
        document.getElementById("ordersContainer");

    const emptyState =
        document.getElementById("emptyState");

    const totalOrders =
        document.getElementById("totalOrders");

    const pendingOrders =
        document.getElementById("pendingOrders");

    const acceptedOrders =
        document.getElementById("acceptedOrders");

    const todayRevenue =
        document.getElementById("todayRevenue");

    const sidebarOrderCount =
        document.getElementById("sidebarOrderCount");

    const searchOrders =
        document.getElementById("searchOrders");

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const logoutBtn =
        document.getElementById("logoutBtn");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const sidebar =
        document.getElementById("sidebar");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");

    const todayDate =
        document.getElementById("todayDate");


    /* =========================================
       CURRENT FILTER
    ========================================== */

    let currentFilter = "all";


    /* =========================================
       LOAD ORDERS FROM CHECKOUT
    ========================================== */

    let orders = [];


    function loadOrders() {

        const savedOrders =
            localStorage.getItem("restaurantOrders");


        if (!savedOrders) {

            orders = [];

            return;

        }


        try {

            orders =
                JSON.parse(savedOrders) || [];


            /* Make sure orders is an array */

            if (!Array.isArray(orders)) {

                orders = [];

            }

        } catch (error) {

            console.error(
                "Unable to load restaurant orders:",
                error
            );

            orders = [];

        }


        /* Normalize orders */

        orders =
            orders.map(order => {

                return {

                    ...order,

                    id:
                        order.id ||
                        `BH${Date.now()}`,

                    customer:
                        order.customer ||
                        "Guest Customer",

                    phone:
                        order.phone ||
                        "Not provided",

                    email:
                        order.email ||
                        "",

                    address:
                        order.address ||
                        "Address not provided",

                    landmark:
                        order.landmark ||
                        "",

                    instructions:
                        order.instructions ||
                        "",

                    status:
                        order.status ||
                        "pending",

                    items:
                        Array.isArray(order.items)
                            ? order.items
                            : [],

                    total:
                        Number(order.total) || 0

                };

            });

    }


    loadOrders();


    /* =========================================
       SAVE ORDERS
    ========================================== */

    function saveOrders() {

        localStorage.setItem(
            "restaurantOrders",
            JSON.stringify(orders)
        );

    }


    /* =========================================
       FORMAT ORDER TIME
    ========================================== */

    function getOrderTime(order) {

        if (!order.createdAt) {

            return "Recently";

        }


        const orderDate =
            new Date(order.createdAt);


        if (isNaN(orderDate.getTime())) {

            return "Recently";

        }


        const now =
            new Date();


        const difference =
            Math.floor(
                (now - orderDate) / 60000
            );


        if (difference < 1) {

            return "Just now";

        }


        if (difference < 60) {

            return `${difference} mins ago`;

        }


        const hours =
            Math.floor(
                difference / 60
            );


        if (hours < 24) {

            return `${hours} hour${hours > 1 ? "s" : ""} ago`;

        }


        return orderDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    }


    /* =========================================
       UPDATE DATE
    ========================================== */

    function updateDate() {

        if (!todayDate) return;


        const now =
            new Date();


        const options = {

            weekday: "long",

            day: "numeric",

            month: "short",

            year: "numeric"

        };


        todayDate.textContent =
            now.toLocaleDateString(
                "en-IN",
                options
            );

    }


    updateDate();


    /* =========================================
       UPDATE STATISTICS
    ========================================== */

    function updateStats() {

        const total =
            orders.length;


        const pending =
            orders.filter(
                order =>
                    order.status === "pending"
            ).length;


        const accepted =
            orders.filter(
                order =>
                    order.status === "accepted" ||
                    order.status === "preparing"
            ).length;


        /* Today's revenue only */

        const today =
            new Date();


        const todayRevenueAmount =
            orders
                .filter(order => {

                    if (
                        order.status === "rejected"
                    ) {

                        return false;

                    }


                    if (!order.createdAt) {

                        return false;

                    }


                    const orderDate =
                        new Date(
                            order.createdAt
                        );


                    return (
                        orderDate.getDate() ===
                            today.getDate() &&

                        orderDate.getMonth() ===
                            today.getMonth() &&

                        orderDate.getFullYear() ===
                            today.getFullYear()
                    );

                })
                .reduce(
                    (sum, order) =>
                        sum +
                        (Number(order.total) || 0),
                    0
                );


        if (totalOrders) {

            totalOrders.textContent =
                total;

        }


        if (pendingOrders) {

            pendingOrders.textContent =
                pending;

        }


        if (acceptedOrders) {

            acceptedOrders.textContent =
                accepted;

        }


        if (todayRevenue) {

            todayRevenue.textContent =
                `₹${todayRevenueAmount.toLocaleString(
                    "en-IN"
                )}`;

        }


        if (sidebarOrderCount) {

            sidebarOrderCount.textContent =
                pending;

        }

    }


    /* =========================================
       STATUS TEXT
    ========================================== */

    function getStatusText(status) {

        const statusMap = {

            pending: "Pending",

            accepted: "Accepted",

            preparing: "Preparing",

            delivered: "Delivered",

            rejected: "Rejected"

        };


        return (
            statusMap[status] ||
            "Pending"
        );

    }


    /* =========================================
       ACTION BUTTONS
    ========================================== */

    function getActionButtons(order) {

        if (
            order.status === "pending"
        ) {

            return `

                <button
                    class="order-action-btn accept-btn"
                    data-action="accept"
                    data-id="${order.id}"
                >
                    ✓ Accept Order
                </button>


                <button
                    class="order-action-btn reject-btn"
                    data-action="reject"
                    data-id="${order.id}"
                >
                    ✕ Reject
                </button>

            `;

        }


        if (
            order.status === "accepted"
        ) {

            return `

                <button
                    class="order-action-btn prepare-btn"
                    data-action="prepare"
                    data-id="${order.id}"
                >
                    🍳 Start Preparing
                </button>

            `;

        }


        if (
            order.status === "preparing"
        ) {

            return `

                <button
                    class="order-action-btn deliver-btn"
                    data-action="deliver"
                    data-id="${order.id}"
                >
                    ✓ Mark Delivered
                </button>

            `;

        }


        return "";

    }


    /* =========================================
       RENDER ORDERS
    ========================================== */

    function renderOrders() {

        if (!ordersContainer) return;


        const searchTerm =
            searchOrders
                ? searchOrders.value
                    .trim()
                    .toLowerCase()
                : "";


        const filteredOrders =
            orders.filter(order => {

                const matchesFilter =
                    currentFilter === "all" ||
                    order.status === currentFilter;


                const matchesSearch =

                    String(order.id)
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    String(order.customer)
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    String(order.phone)
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    String(order.address)
                        .toLowerCase()
                        .includes(searchTerm);


                return (
                    matchesFilter &&
                    matchesSearch
                );

            });


        ordersContainer.innerHTML = "";


        if (
            filteredOrders.length === 0
        ) {

            if (emptyState) {

                emptyState.classList.add(
                    "show"
                );

            }

            return;

        }


        if (emptyState) {

            emptyState.classList.remove(
                "show"
            );

        }


        filteredOrders.forEach(order => {

            /* ================= ITEMS ================= */

            const itemHTML =
                order.items
                    .map(item => {

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

                    })
                    .join("");


            /* ================= CARD ================= */

            const card =
                document.createElement("div");


            card.className =
                "order-card";


            card.innerHTML = `

                <!-- ORDER HEADER -->

                <div class="order-header">

                    <div class="order-number">

                        <strong>
                            #${order.id}
                        </strong>

                        <span class="order-time">
                            ${getOrderTime(order)}
                        </span>

                    </div>


                    <span class="status ${order.status}">
                        ${getStatusText(order.status)}
                    </span>

                </div>


                <!-- ORDER BODY -->

                <div class="order-body">

                    <!-- CUSTOMER -->

                    <div class="customer-info">

                        <div class="customer-avatar">
                            👤
                        </div>


                        <div class="customer-details">

                            <strong>
                                ${order.customer}
                            </strong>


                            <span>
                                ${order.phone}
                            </span>

                        </div>

                    </div>


                    <!-- ITEMS -->

                    <div class="order-items">

                        ${itemHTML}

                    </div>


                    <!-- TOTAL -->

                    <div class="order-amount">

                        <span>
                            Total Amount
                        </span>


                        <strong>
                            ₹${Number(order.total)
                                .toLocaleString("en-IN")}
                        </strong>

                    </div>

                </div>


                <!-- ADDRESS -->

                <div class="order-address">

                    📍

                    <span>
                        ${order.address}
                    </span>

                </div>


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
                    order.instructions
                        ? `
                            <div class="order-address">
                                📝
                                <span>
                                    ${order.instructions}
                                </span>
                            </div>
                        `
                        : ""
                }


                <!-- PAYMENT -->

                ${
                    order.payment
                        ? `
                            <div class="order-address">
                                💳
                                <span>
                                    Payment:
                                    ${order.payment}
                                </span>
                            </div>
                        `
                        : ""
                }


                <!-- ACTIONS -->

                <div class="order-actions">

                    ${getActionButtons(order)}

                </div>

            `;


            ordersContainer.appendChild(
                card
            );

        });

    }


    /* =========================================
       ORDER ACTIONS
    ========================================== */

    if (ordersContainer) {

        ordersContainer.addEventListener(
            "click",
            (event) => {

                const button =
                    event.target.closest(
                        ".order-action-btn"
                    );


                if (!button) return;


                const action =
                    button.dataset.action;


                const orderId =
                    button.dataset.id;


                const order =
                    orders.find(
                        item =>
                            item.id === orderId
                    );


                if (!order) return;


                /* ACCEPT */

                if (
                    action === "accept"
                ) {

                    order.status =
                        "accepted";


                    alert(
                        `Order #${order.id} accepted successfully.`
                    );

                }


                /* REJECT */

                else if (
                    action === "reject"
                ) {

                    const confirmReject =
                        confirm(
                            `Are you sure you want to reject order #${order.id}?`
                        );


                    if (!confirmReject) {

                        return;

                    }


                    order.status =
                        "rejected";


                    alert(
                        `Order #${order.id} has been rejected.`
                    );

                }


                /* PREPARING */

                else if (
                    action === "prepare"
                ) {

                    order.status =
                        "preparing";


                    alert(
                        `Order #${order.id} is now being prepared.`
                    );

                }


                /* DELIVERED */

                else if (
                    action === "deliver"
                ) {

                    order.status =
                        "delivered";


                    alert(
                        `Order #${order.id} marked as delivered.`
                    );

                }


                saveOrders();

                updateStats();

                renderOrders();

            }
        );

    }


    /* =========================================
       FILTER BUTTONS
    ========================================== */

    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                filterButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                renderOrders();

            }
        );

    });


    /* =========================================
       SEARCH
    ========================================== */

    if (searchOrders) {

        searchOrders.addEventListener(
            "input",
            renderOrders
        );

    }


    /* =========================================
       MOBILE SIDEBAR
    ========================================== */

    if (
        mobileMenuBtn &&
        sidebar
    ) {

        mobileMenuBtn.addEventListener(
            "click",
            () => {

                sidebar.classList.add(
                    "open"
                );


                if (sidebarOverlay) {

                    sidebarOverlay.classList.add(
                        "show"
                    );

                }

            }
        );

    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            () => {

                if (sidebar) {

                    sidebar.classList.remove(
                        "open"
                    );

                }


                sidebarOverlay.classList.remove(
                    "show"
                );

            }
        );

    }


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
                    "owner"
                );


                sessionStorage.removeItem(
                    "owner"
                );


                window.location.href =
                    "owner-login.html";

            }
        );

    }


    /* =========================================
       AUTO REFRESH ORDERS
    ========================================== */

    setInterval(() => {

        const latestOrders =
            localStorage.getItem(
                "restaurantOrders"
            );


        if (!latestOrders) return;


        try {

            const parsedOrders =
                JSON.parse(
                    latestOrders
                );


            if (
                JSON.stringify(parsedOrders) !==
                JSON.stringify(orders)
            ) {

                loadOrders();

                updateStats();

                renderOrders();

            }

        } catch (error) {

            console.error(
                "Unable to refresh orders:",
                error
            );

        }

    }, 3000);


    /* =========================================
       INITIAL LOAD
    ========================================== */

    updateStats();

    renderOrders();

});
