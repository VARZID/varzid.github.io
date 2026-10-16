const langData = {
    ru: {
        addr: "Фархор, Центр", search: "Поиск товаров...",
        cat1: "Зерно", cat2: "Удобрения", cat3: "Корма",
        badge: "Скидка 0%", bTitle: "Спецпредложение недели", bDesc: "Лучшие цены с доставкой.",
        tab1: "Для вас", tab2: "Цены дня", cartBtn: "В корзину",
        p1: "Пшеница отборная", p2: "Кукуруза сухая",
        h: "Главная", w: "Кошелек", c: "Корзина", f: "Избранное", s: "Настройки",
        setTitle: "Настройки", lblLang: "Язык приложения", lblTheme: "Темная тема",
        titleNotif: "Уведомления", pWallet: "Кошелек", pCart: "Корзина", pFav: "Избранное",
        eCart: "Ваша корзина пуста", eFav: "Нет избранных товаров"
    },
    tj: {
        addr: "Фархор, Марказ", search: "Ҷустуҷӯи маҳсулот...",
        cat1: "Ғалла", cat2: "Нуриҳо", cat3: "Хӯрокворӣ",
        badge: "Тахфиф 0%", bTitle: "Пешниҳоди махсус", bDesc: "Нархҳои беҳтарин бо расонидан.",
        tab1: "Барои шумо", tab2: "Нархҳои рӯз", cartBtn: "Ба сабад",
        p1: "Гандуми аълосифат", p2: "Маккаҷухории хушк",
        h: "Хона", w: "Қуттича", c: "Сабад", f: "Дӯстдошта", s: "Танзимот",
        setTitle: "Танзимот", lblLang: "Забони барнома", lblTheme: "Режими шабона",
        titleNotif: "Огоҳиномаҳо", pWallet: "Қуттича", pCart: "Сабад", pFav: "Дӯстдоштаҳо",
        eCart: "Сабади шумо холӣ аст", eFav: "Ҳеҷ маҳсулоти дӯстдошта нест"
    },
    uz: {
        addr: "Farxor, Markaz", search: "Mahsulotlarni qidirish...",
        cat1: "Don", cat2: "O'g'it", cat3: "Yem",
        badge: "Chegirma 0%", bTitle: "Maxsus taklif", bDesc: "Yetkazib berish bilan eng yaxshi narxlar.",
        tab1: "Siz uchun", tab2: "Kun narxlari", cartBtn: "Savatga",
        p1: "Saralangan bug'doy", p2: "Quruq makkajo'xori",
        h: "Bosh sahifa", w: "Hamyon", c: "Savat", f: "Saralangan", s: "Sozlamalar",
        setTitle: "Sozlamalar", lblLang: "Ilova tili", lblTheme: "Tungi rejim",
        titleNotif: "Bildirishnomalar", pWallet: "Hamyon", pCart: "Savat", pFav: "Saralanganlar",
        eCart: "Savatingiz bo'sh", eFav: "Saralangan mahsulotlar yo'q"
    }
};

let currentLang = 'ru';
let cart = [];
let favorites = [];
let walletBalance = 0.00;

function switchLanguage(lang) {
    currentLang = lang;
    const l = langData[lang];
    if (!l) return;

    if(document.getElementById('txt-addr')) document.getElementById('txt-addr').innerText = l.addr;
    if(document.getElementById('search-input')) document.getElementById('search-input').placeholder = l.search;
    if(document.getElementById('cat1')) document.getElementById('cat1').innerText = l.cat1;
    if(document.getElementById('cat2')) document.getElementById('cat2').innerText = l.cat2;
    if(document.getElementById('cat3')) document.getElementById('cat3').innerText = l.cat3;
    if(document.getElementById('banner-badge')) document.getElementById('banner-badge').innerText = l.badge;
    if(document.getElementById('banner-title')) document.getElementById('banner-title').innerText = l.bTitle;
    if(document.getElementById('banner-desc')) document.getElementById('banner-desc').innerText = l.bDesc;
    if(document.getElementById('tab1')) document.getElementById('tab1').innerText = l.tab1;
    if(document.getElementById('tab2')) document.getElementById('tab2').innerText = l.tab2;
    if(document.getElementById('p1-title')) document.getElementById('p1-title').innerText = l.p1;
    if(document.getElementById('p2-title')) document.getElementById('p2-title').innerText = l.p2;
    if(document.getElementById('nav-home')) document.getElementById('nav-home').innerText = l.h;
    if(document.getElementById('nav-wallet')) document.getElementById('nav-wallet').innerText = l.w;
    if(document.getElementById('nav-cart')) document.getElementById('nav-cart').innerText = l.c;
    if(document.getElementById('nav-fav')) document.getElementById('nav-fav').innerText = l.f;
    if(document.getElementById('nav-set')) document.getElementById('nav-set').innerText = l.s;
    if(document.getElementById('set-title')) document.getElementById('set-title').innerText = l.setTitle;
    if(document.getElementById('lbl-lang')) document.getElementById('lbl-lang').innerText = l.lblLang;
    if(document.getElementById('lbl-theme')) document.getElementById('lbl-theme').innerText = l.lblTheme;

    if(document.getElementById('title-notif')) document.getElementById('title-notif').innerText = l.titleNotif;
    if(document.getElementById('page-wallet')) document.getElementById('page-wallet').innerText = l.pWallet;
    if(document.getElementById('page-cart')) document.getElementById('page-cart').innerText = l.pCart;
    if(document.getElementById('page-fav')) document.getElementById('page-fav').innerText = l.pFav;

    document.querySelectorAll('.btn-cart').forEach(b => b.innerText = l.cartBtn);
    renderCart();
    renderFav();
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function toggleNotifications() {
    const modal = document.getElementById('modal-notif');
    if (modal) modal.classList.toggle('hidden');
}

function filterProducts() {
    const input = document.getElementById('search-input');
    if (!input) return;
    const filter = input.value.toLowerCase();
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        if (title.includes(filter)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

function toggleFav(id, btn) {
    const card = btn.closest('.product-card');
    if (!card) return;
    const title = card.getAttribute('data-title');
    const price = card.getAttribute('data-price');
    const img = card.getAttribute('data-img');

    const index = favorites.findIndex(item => item.id === id);
    if (index > -1) {
        favorites.splice(index, 1);
        btn.classList.remove('text-red-500');
        btn.classList.add('text-gray-300', 'dark:text-gray-600');
    } else {
        favorites.push({ id, title, price, img });
        btn.classList.remove('text-gray-300', 'dark:text-gray-600');
        btn.classList.add('text-red-500');
    }
    renderFav();
}

function addToCart(id, title, price, img) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, title, price, img, qty: 1 });
    }
    updateCartBadge();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartBadge();
    renderCart();
}

function updateCartBadge() {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.innerText = totalQty;
        if (totalQty > 0) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

function renderCart() {
    const container = document.getElementById('cart-container');
    if (!container) return;
    const l = langData[currentLang];

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl text-center shadow-sm border border-gray-100 dark:border-gray-700">
                <i class="fa-solid fa-cart-flatbed text-3xl text-gray-300 dark:text-gray-600 mb-2"></i>
                <p class="text-xs text-gray-500 dark:text-gray-400" id="empty-cart">${l.eCart}</p>
            </div>`;
        return;
    }

    let html = '<div class="space-y-3">';
    let totalSum = 0;

    cart.forEach(item => {
        let itemTotal = item.price * item.qty;
        totalSum += itemTotal;
        html += `
            <div class="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div class="flex items-center space-x-3">
                    <div class="bg-gray-100 dark:bg-gray-700 w-12 h-12 rounded-xl flex items-center justify-center text-xl">${item.img}</div>
                    <div>
                        <h4 class="text-xs font-bold text-gray-800 dark:text-white">${item.title}</h4>
                        <p class="text-[10px] text-gray-400">${item.price} TJS × ${item.qty}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <span class="text-xs font-bold text-emerald-600">${itemTotal.toFixed(2)} TJS</span>
                    <button onclick="removeFromCart('${item.id}')" class="text-red-400 hover:text-red-600 p-1"><i class="fa-solid fa-trash text-xs"></i></button>
                </div>
            </div>`;
    });

    html += `
        <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center mt-3">
            <span class="text-xs font-bold text-gray-700 dark:text-gray-300">Итого:</span>
            <span class="text-sm font-black text-emerald-600">${totalSum.toFixed(2)} TJS</span>
        </div>
    </div>`;

    container.innerHTML = html;
}

function renderFav() {
    const container = document.getElementById('fav-container');
    if (!container) return;
    const l = langData[currentLang];

    if (favorites.length === 0) {
        container.innerHTML = `
            <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl text-center shadow-sm border border-gray-100 dark:border-gray-700">
                <i class="fa-regular fa-heart text-3xl text-gray-300 dark:text-gray-600 mb-2"></i>
                <p class="text-xs text-gray-500 dark:text-gray-400" id="empty-fav">${l.eFav}</p>
            </div>`;
        return;
    }

    let html = '<div class="grid grid-cols-2 gap-3">';
    favorites.forEach(item => {
        html += `
            <div class="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
                <div>
                    <div class="bg-gray-100 dark:bg-gray-700 h-24 rounded-xl flex items-center justify-center text-3xl mb-2">${item.img}</div>
                    <h3 class="text-xs font-medium text-gray-800 dark:text-white">${item.title}</h3>
                    <p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">${item.price} TJS</p>
                </div>
                <button onclick="addToCart('${item.id}', '${item.title}', ${item.price}, '${item.img}')" class="mt-3 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold py-2 rounded-xl transition">${l.cartBtn}</button>
            </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
}

function topUpWallet() {
    let input = prompt(currentLang === 'tj' ? "Маблағи иловашавандаро ворид кунед (TJS):" : (currentLang === 'uz' ? "To'ldiriladigan summani kiriting (TJS):" : "Введите сумму пополнения (TJS):"), "100");
    if (input !== null) {
        let amount = parseFloat(input);
        if (!isNaN(amount) && amount > 0) {
            walletBalance += amount;
            const el = document.getElementById('wallet-balance');
            if (el) el.innerText = walletBalance.toFixed(2) + ' TJS';
        } else {
            alert(currentLang === 'tj' ? "Лутфан маблағи дуруст ворид кунед!" : (currentLang === 'uz' ? "Iltimos, to'g'ri summa kiriting!" : "Пожалуйста, введите корректную сумму!"));
        }
    }
}

function showTab(tabName) {
    document.querySelectorAll('.tab-view').forEach(view => view.classList.add('hidden'));
    
    const target = document.getElementById(`view-${tabName}`);
    if (target) target.classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-emerald-600');
        btn.classList.add('text-gray-400');
    });

    const activeBtn = document.getElementById(`nav-btn-${tabName}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-gray-400');
        activeBtn.classList.add('text-emerald-600');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    updateCartBadge();
});
