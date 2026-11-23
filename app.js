// ============================================================
//  HerbNest – App Logic
// ============================================================

// ── Products data ───────────────────────────────────────────
const products = [
  {
    id: 1,
    name: "Ashwagandha Capsules",
    emoji: "🌿",
    tag: "Stress & Sleep",
    desc: "Ancient adaptogen that helps your body manage stress, boosts energy and improves sleep quality naturally.",
    price: 549,
    original: 699,
    rating: 4.8,
    reviews: 1240,
  },
  {
    id: 2,
    name: "Cold-Pressed Neem Oil",
    emoji: "🫚",
    tag: "Skin & Hair",
    desc: "Pure, unrefined neem oil for acne, dandruff, and scalp health. Loaded with nimbidin and essential fatty acids.",
    price: 349,
    original: 450,
    rating: 4.6,
    reviews: 870,
  },
  {
    id: 3,
    name: "Organic Tulsi Drops",
    emoji: "🌱",
    tag: "Immunity Boost",
    desc: "Concentrated extract of Holy Basil (Tulsi) to strengthen immunity, reduce cough, and fight infections.",
    price: 299,
    original: 399,
    rating: 4.7,
    reviews: 965,
  },
  {
    id: 4,
    name: "Chamomile Tea Blend",
    emoji: "🌼",
    tag: "Relaxation",
    desc: "Premium chamomile blended with lavender and lemon balm for a calming bedtime ritual. No caffeine.",
    price: 249,
    original: 320,
    rating: 4.9,
    reviews: 2100,
  },
  {
    id: 5,
    name: "Triphala Powder",
    emoji: "🫙",
    tag: "Digestion",
    desc: "Ayurvedic trio of Amalaki, Bibhitaki & Haritaki for gut cleansing, digestion and healthy metabolism.",
    price: 199,
    original: 275,
    rating: 4.5,
    reviews: 740,
  },
];

// ── Cart state ───────────────────────────────────────────────
let cart = [];

// ── Render products ──────────────────────────────────────────
function renderProducts() {
  const grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  products.forEach((p) => {
    const stars = renderStars(p.rating);
    const discount = Math.round(((p.original - p.price) / p.original) * 100);

    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-img">${p.emoji}</div>
      <div class="product-body">
        <span class="product-tag">${p.tag}</span>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:.2rem">
          <h3 class="product-name">${p.name}</h3>
          <span style="font-size:.72rem;background:#fde8dd;color:#e76f51;padding:.12rem .5rem;border-radius:50px;font-weight:600;">-${discount}%</span>
        </div>
        <p class="product-desc">${p.desc}</p>
        <div class="product-rating">${stars} <span style="color:#8aab9c;font-size:.78rem">(${p.reviews.toLocaleString()})</span></div>
        <div class="product-footer">
          <div class="product-price">
            ₹${p.price}
            <span class="original">₹${p.original}</span>
          </div>
          <button class="add-cart-btn" onclick="addToCart(${p.id})">
            <i class="fa-solid fa-plus"></i> Add
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    "★".repeat(full) +
    (half ? "½" : "") +
    "☆".repeat(empty)
  );
}

// ── Cart logic ───────────────────────────────────────────────
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`🌿 ${product.name} added to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartUI();
}

function updateCartUI() {
  const countEl = document.getElementById("cartCount");
  const itemsEl = document.getElementById("cartItems");
  const footerEl = document.getElementById("cartFooter");
  const totalEl = document.getElementById("cartTotal");

  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = totalQty;

  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    footerEl.style.display = "none";
    return;
  }

  footerEl.style.display = "block";

  itemsEl.innerHTML = cart
    .map(
      (item) => `
    <div class="cart-item">
      <span class="cart-item-emoji">${item.emoji}</span>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price} × ${item.qty}</div>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${item.id})" title="Remove">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    </div>
  `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  totalEl.textContent = `₹${total.toLocaleString()}`;
}

function checkout() {
  cart = [];
  updateCartUI();
  closeCart();
  showToast("🎉 Order placed successfully! Thank you!");
}

// ── Cart drawer ──────────────────────────────────────────────
function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

// ── Tab switching ────────────────────────────────────────────
function switchTab(tabName) {
  // Remove active from all panes
  document.querySelectorAll(".tab-pane").forEach((pane) => pane.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"));

  // Activate selected
  document.getElementById(`tab-${tabName}`).classList.add("active");
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Toast ────────────────────────────────────────────────────
let toastTimer;
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
}

// ── Contact form ─────────────────────────────────────────────
function setupContactForm() {
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("formSuccess").style.display = "block";
    form.reset();
    setTimeout(() => {
      document.getElementById("formSuccess").style.display = "none";
    }, 5000);
  });
}

// ── Event listeners ──────────────────────────────────────────
function setupEvents() {
  // Tab buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  // Cart open/close
  document.getElementById("cartToggle").addEventListener("click", openCart);
  document.getElementById("cartClose").addEventListener("click", closeCart);
  document.getElementById("cartOverlay").addEventListener("click", closeCart);
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  updateCartUI();
  setupEvents();
  setupContactForm();
});
