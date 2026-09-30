/* =========================================
   OWNER DASHBOARD JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       ELEMENTS
    ========================================== */

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
       DEMO ORDERS
    ========================================== */

    let orders = [
        {
            id: "BH1024",
            customer: "Rahul Sharma",
            phone: "9876543211",
            address: "Gomti Nagar, Lucknow",
            time: "10 mins ago",
            status: "pending",
            items: [
                {
                    name: "Chicken Biryani",
                    quantity: 2,
                    price: 220
                },
                {
                    name: "Cold Coffee",
                    quantity: 1,
                    price: 90
                }
            ],
            total: 530
        },

        {
            id: "BH1023",
            customer: "Aman Verma",
            phone: "9876543212",
            address: "Hazratganj, Lucknow",
            time: "25 mins ago",
            status: "accepted",
            items: [
                {
                    name: "Paneer Tikka",
                    quantity: 1,
                    price: 280
                },
                {
                    name: "Butter Naan",
                    quantity: 2,
                    price: 60
                }
            ],
            total: 400
        },

        {
            id: "BH1022",
            customer: "Priya Singh",
            phone: "9876543213",
            address: "Aliganj, Lucknow",
            time: "42 mins ago",
            status: "preparing",
            items: [
                {
                    name: "Creamy Alfredo Pasta",
                    quantity: 1,
                    price: 220
                },
                {
                    name: "Garlic Bread",
                    quantity: 1,
                    price: 100
                }
            ],
            total: 320
        },

        {
            id: "BH1021",
            customer: "Ankit Gupta",
            phone: "9876543214",
            address: "Indira Nagar, Lucknow",
            time: "1 hour ago",
            status: "delivered",
            items: [
                {
                    name: "Cheese Pizza",
                    quantity: 1,
                    price: 299
                },
                {
                    name: "Coke",
                    quantity: 2,
                    price: 60
                }
            ],
            total: 419
        },

        {
            id: "BH1020",
            customer: "Sneha Mishra",
            phone: "9876543215",
            address: "Mahanagar, Lucknow",
            time: "1 hour ago",
            status: "rejected",
            items: [
                {
                    name: "Veg Burger",
                    quantity: 2,
                    price: 180
                }
            ],
            total: 360
        }
    ];


    /* =========================================
       LOAD SAVED ORDERS
    ========================================== */

    const savedOrders =
        localStorage.getItem("restaurantOrders");

    if (savedOrders) {

        try {

            orders =
                JSON.parse(savedOrders);

        } catch (error) {

            console.log(
                "Could not load saved orders."
            );

        }

    }


    /* =========================================
       CURRENT FILTER
    ========================================== */

    let currentFilter = "all";


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
       UPDATE DATE
    ========================================== */

    function updateDate() {

        const now = new Date();

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

        const total = orders.length;

        const pending =
            orders.filter(
                order => order.status === "pending"
            ).length;

        const accepted =
            orders.filter(
                order =>
                    order.status === "accepted" ||
                    order.status === "preparing"
            ).length;

        const revenue =
            orders
                .filter(
                    order =>
                        order.status !== "rejected"
                )
                .reduce(
                    (sum, order) =>
                        sum + order.total,
                    0
                );


        totalOrders.textContent = total;

        pendingOrders.textContent = pending;

        acceptedOrders.textContent = accepted;

        todayRevenue.textContent =
            `₹${revenue.toLocaleString("en-IN")}`;

        sidebarOrderCount.textContent =
            pending;

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

        return statusMap[status] || status;

    }


    /* =========================================
       ORDER ACTIONS
    ========================================== */

    function getActionButtons(order) {

        if (order.status === "pending") {

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


        if (order.status === "accepted") {

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


        if (order.status === "preparing") {

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

        const searchTerm =
            searchOrders.value
                .trim()
                .toLowerCase();


        let filteredOrders =
            orders.filter(order => {

                const matchesFilter =
                    currentFilter === "all" ||
                    order.status === currentFilter;


                const matchesSearch =
                    order.id
                        .toLowerCase()
                        .includes(searchTerm) ||

                    order.customer
                        .toLowerCase()
                        .includes(searchTerm) ||

                    order.phone
                        .includes(searchTerm);


                return (
                    matchesFilter &&
                    matchesSearch
                );

            });


        ordersContainer.innerHTML = "";


        if (filteredOrders.length === 0) {

            emptyState.classList.add("show");

            return;

        }


        emptyState.classList.remove("show");


        filteredOrders.forEach(order => {

            const itemHTML =
                order.items.map(item => {

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


            const card =
                document.createElement("div");

            card.className =
                "order-card";


            card.innerHTML = `

                <!-- Order Header -->

                <div class="order-header">

                    <div class="order-number">

                        <strong>
                            #${order.id}
                        </strong>

                        <span class="order-time">
                            ${order.time}
                        </span>

                    </div>

                    <span class="status ${order.status}">
                        ${getStatusText(order.status)}
                    </span>

                </div>


                <!-- Order Body -->

                <div class="order-body">

                    <!-- Customer -->

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


                    <!-- Items -->

                    <div class="order-items">

                        ${itemHTML}

                    </div>


                    <!-- Amount -->

                    <div class="order-amount">

                        <span>
                            Total Amount
                        </span>

                        <strong>
                            ₹${order.total}
                        </strong>

                    </div>

                </div>


                <!-- Address -->

                <div class="order-address">

                    📍

                    <span>
                        ${order.address}
                    </span>

                </div>


                <!-- Actions -->

                <div class="order-actions">

                    ${getActionButtons(order)}

                </div>

            `;


            ordersContainer.appendChild(card);

        });

    }


    /* =========================================
       ORDER ACTION
    ========================================== */

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

            if (action === "accept") {

                order.status = "accepted";

                alert(
                    `Order #${order.id} accepted successfully.`
                );

            }


            /* REJECT */

            else if (action === "reject") {

                const confirmReject =
                    confirm(
                        `Are you sure you want to reject order #${order.id}?`
                    );

                if (!confirmReject) {
                    return;
                }

                order.status = "rejected";

                alert(
                    `Order #${order.id} has been rejected.`
                );

            }


            /* PREPARING */

            else if (action === "prepare") {

                order.status = "preparing";

                alert(
                    `Order #${order.id} is now being prepared.`
                );

            }


            /* DELIVERED */

            else if (action === "deliver") {

                order.status = "delivered";

                alert(
                    `Order #${order.id} marked as delivered.`
                );

            }


            saveOrders();

            updateStats();

            renderOrders();

        }
    );


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

    searchOrders.addEventListener(
        "input",
        renderOrders
    );


    /* =========================================
       MOBILE SIDEBAR
    ========================================== */

    mobileMenuBtn.addEventListener(
        "click",
        () => {

            sidebar.classList.add("open");

            sidebarOverlay.classList.add("show");

        }
    );


    sidebarOverlay.addEventListener(
        "click",
        () => {

            sidebar.classList.remove("open");

            sidebarOverlay.classList.remove("show");

        }
    );


    /* =========================================
       LOGOUT
    ========================================== */

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


            localStorage.removeItem("owner");

            sessionStorage.removeItem("owner");

            window.location.href =
                "owner-login.html";

        }
    );


    /* =========================================
       INITIAL LOAD
    ========================================== */

    updateStats();

    renderOrders();

});