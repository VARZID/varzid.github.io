// --- Сабти Service Worker барои насби PWA ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker бо муваффақият сабт шуд!', reg))
            .catch(err => console.log('Хатогӣ дар сабти Service Worker:', err));
    });
}

// --- Идоракунии Ҳолати Торик (Dark Mode) ---
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("varzid_theme");
    if (savedTheme === "dark" || (!savedTheme && document.documentElement.classList.contains("dark"))) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
});

function toggleDarkMode() {
    const htmlEl = document.documentElement;
    if (htmlEl.classList.contains("dark")) {
        htmlEl.classList.remove("dark");
        localStorage.setItem("varzid_theme", "light");
    } else {
        htmlEl.classList.add("dark");
        localStorage.setItem("varzid_theme", "dark");
    }
}

// --- Гузариш байни вкладкаҳо (Tabs) ва Навигация ---
function showTab(tabName) {
    // Ҳамаи вкладкаҳоро пинҳон мекунем
    const views = document.querySelectorAll('.tab-view');
    views.forEach(view => view.classList.add('hidden'));

    // Вкладкаи лозимиро мекушоем
    const targetView = document.getElementById(`view-${tabName}`);
    if (targetView) {
        targetView.classList.remove('hidden');
    }

    // Ранги тугмаҳои менюи поёниро иваз мекунем
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.replace('text-emerald-600', 'text-gray-400'));

    const activeNavBtn = document.getElementById(`nav-btn-${tabName}`);
    if (activeNavBtn) {
        activeNavBtn.classList.replace('text-gray-400', 'text-emerald-600');
    }
}

// --- Уведомления (Зангула) ---
function toggleNotifications() {
    const modal = document.getElementById('modal-notif');
    if (modal) {
        modal.classList.toggle('hidden');
    }
}

// --- Корзина ва Сабад ---
let cart = [];

function addToCart(id, title, price, img) {
    cart.push({ id, title, price, img });
    updateCartUI();
    alert(`Маҳсулот ба корзина илова шуд: ${title}`);
}

function updateCartUI() {
    const cartBadge = document.getElementById('cart-badge');
    if (cartBadge) {
        if (cart.length > 0) {
            cartBadge.textContent = cart.length;
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
    }
}

// --- Избранное (Дилчаҳо) ---
function toggleFav(id, btn) {
    btn.classList.toggle('text-red-500');
    btn.classList.toggle('text-gray-300');
}

// --- Ҷустуҷӯ ---
function filterProducts() {
    const input = document.getElementById('search-input').value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        if (title.includes(input)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// --- Кошелек ---
function topUpWallet() {
    alert("Функсияи пур кардани ҳамён ба зудӣ дастрас мешавад!");
}

// --- Иваз кардани забон (Забонҳо) ---
function switchLanguage(lang) {
    // Шумо метавонед тарҷумаҳоро ин ҷо илова кунед
    console.language = lang;
}
