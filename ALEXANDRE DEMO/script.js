// ======================================================================
// ANIMATIONS AU DÉFILEMENT (INTERSECTION OBSERVER) & NAVBAR
// ======================================================================
const navbar = document.querySelector(".navbar");
window.addEventListener("scroll", () => {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 12);
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && revealItems.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((el, index) => {
    el.style.transitionDelay = `${Math.min((index % 3) * 80, 240)}ms`;
    observer.observe(el);
  });
} else {
  revealItems.forEach((el) => el.classList.add("is-visible"));
}

// ======================================================================
// FILTRAGE DES PRODUITS PAR CATÉGORIE
// ======================================================================
const filterBtns = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    productCards.forEach((card) => {
      const category = card.getAttribute("data-category");
      card.style.display = filter === "all" || category === filter ? "flex" : "none";
    });
  });
});

// ======================================================================
// SÉLECTION / PANIER PARTAGÉ (LOCALSTORAGE) & MODALE WHATSAPP
// ======================================================================
const STORAGE_KEY = "mentsap_selected_products";
const WHATSAPP_NUMBER = "242069183984";

let selectedProducts = [];
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if (Array.isArray(saved)) selectedProducts = saved;
} catch (_) {
  selectedProducts = [];
}

const cartCount = document.getElementById("cartCount");
const cartModal = document.getElementById("cartModal");
const cartList = document.getElementById("cartList");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const sendOrderWhatsapp = document.getElementById("sendOrderWhatsapp");

function saveAndRenderCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedProducts));
  } catch (_) {}

  if (cartCount) {
    cartCount.textContent = selectedProducts.length;
  }

  if (!cartList) return;

  if (selectedProducts.length === 0) {
    cartList.innerHTML = "<li>Aucun produit sélectionné pour le moment.</li>";
    return;
  }

  cartList.innerHTML = selectedProducts
    .map(
      (item, index) =>
        `<li><span>${item}</span><button type="button" class="remove-item" data-index="${index}">Retirer</button></li>`
    )
    .join("");

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.getAttribute("data-index"));
      selectedProducts.splice(idx, 1);
      saveAndRenderCart();
    });
  });
}

saveAndRenderCart();

document.querySelectorAll(".add-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const prod = btn.getAttribute("data-product");
    if (prod && !selectedProducts.includes(prod)) {
      selectedProducts.push(prod);
      saveAndRenderCart();
    }

    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Ajouté';
    setTimeout(() => {
      btn.innerHTML = originalHtml;
    }, 1200);
  });
});

if (openCartBtn && cartModal) {
  openCartBtn.addEventListener("click", () => {
    saveAndRenderCart();
    cartModal.classList.add("open");
  });
}

if (closeCartBtn && cartModal) {
  closeCartBtn.addEventListener("click", () => {
    cartModal.classList.remove("open");
  });
}

if (cartModal) {
  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      cartModal.classList.remove("open");
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && cartModal && cartModal.classList.contains("open")) {
    cartModal.classList.remove("open");
  }
});

if (sendOrderWhatsapp) {
  sendOrderWhatsapp.addEventListener("click", () => {
    if (selectedProducts.length === 0) return;

    const text = encodeURIComponent(
      "Bonjour Monsieur Fongang Alexandre Richard, je souhaite commander les produits Dynace Global suivants :\n- " +
        selectedProducts.join("\n- ")
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, "_blank", "noopener");
  });
}

// ======================================================================
// FORMULAIRE DE CONTACT RAPIDE VERS WHATSAPP
// ======================================================================
const demoContactForm = document.getElementById("demoContactForm");

if (demoContactForm) {
  demoContactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("clientName").value.trim();
    const need = document.getElementById("clientNeed").value;
    const msg = document.getElementById("clientMsg").value.trim();

    if (!name || !msg) return;

    const fullText = encodeURIComponent(
      `Bonjour Monsieur Fongang Alexandre Richard,\nNom : ${name}\nObjet : ${need}\nMessage : ${msg}`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${fullText}`, "_blank", "noopener");
  });
}