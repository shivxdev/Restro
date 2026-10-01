/* =========================================
   BITEHUB CART SYSTEM
========================================= */

let cart = JSON.parse(localStorage.getItem("bitehubCart")) || [];


/* =========================================
   SAVE CART
========================================= */

function saveCart() {
    localStorage.setItem(
        "bitehubCart",
        JSON.stringify(cart)
    );
}


/* =========================================
   LOAD CART
========================================= */

function loadCart() {

    const cartItems = document.getElementById("cartItems");
    const emptyCart = document.getElementById("emptyCart");

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        emptyCart.style.display = "block";

        updateSummary();

        return;
    }

    emptyCart.style.display = "none";


    cart.forEach((item, index) => {

        const itemElement = document.createElement("div");

        itemElement.className = "cart-item";

        itemElement.innerHTML = `

            <img
                src="${item.image}"
                alt="${item.name}"
                class="cart-item-image"
            >

            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <div class="cart-item-price">
                    ₹${item.price}
                </div>

            </div>


            <div class="quantity-box">

                <button onclick="decreaseQuantity(${index})">
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button onclick="increaseQuantity(${index})">
                    +
                </button>

            </div>


            <button
                class="remove-btn"
                onclick="removeItem(${index})"
                title="Remove"
            >
                ×
            </button>

        `;

        cartItems.appendChild(itemElement);

    });


    updateSummary();
}


/* =========================================
   INCREASE
========================================= */

function increaseQuantity(index) {

    cart[index].quantity++;

    saveCart();

    loadCart();
}


/* =========================================
   DECREASE
========================================= */

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    saveCart();

    loadCart();
}


/* =========================================
   REMOVE
========================================= */

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    loadCart();
}


/* =========================================
   SUMMARY
========================================= */

function updateSummary() {

    let subtotal = 0;

    cart.forEach(item => {

        subtotal +=
            Number(item.price) *
            Number(item.quantity);

    });


    const deliveryFee =
        subtotal > 0 ? 40 : 0;


    const discount = 0;


    const total =
        subtotal +
        deliveryFee -
        discount;


    document.getElementById("subtotal").textContent =
        `₹${subtotal}`;


    document.getElementById("deliveryFee").textContent =
        `₹${deliveryFee}`;


    document.getElementById("discount").textContent =
        `- ₹${discount}`;


    document.getElementById("total").textContent =
        `₹${total}`;


    const checkoutBtn =
        document.getElementById("checkoutBtn");


    checkoutBtn.disabled =
        cart.length === 0;
}


/* =========================================
   CHECKOUT
========================================= */

document
    .getElementById("checkoutBtn")
    .addEventListener("click", function () {

        if (cart.length === 0) {

            alert("Your cart is empty.");

            return;
        }


        window.location.href =
            "checkout.html";

    });


/* =========================================
   INITIAL LOAD
========================================= */

loadCart();