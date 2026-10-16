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

function switchLanguage(lang) {
    const l = langData[lang];
    if (!l) return;

    document.getElementById('txt-addr').innerText = l.addr;
    document.getElementById('search-input').placeholder = l.search;
    document.getElementById('cat1').innerText = l.cat1;
    document.getElementById('cat2').innerText = l.cat2;
    document.getElementById('cat3').innerText = l.cat3;
    document.getElementById('banner-badge').innerText = l.badge;
    document.getElementById('banner-title').innerText = l.bTitle;
    document.getElementById('banner-desc').innerText = l.bDesc;
    document.getElementById('tab1').innerText = l.tab1;
    document.getElementById('tab2').innerText = l.tab2;
    document.getElementById('p1-title').innerText = l.p1;
    document.getElementById('p2-title').innerText = l.p2;
    document.getElementById('nav-home').innerText = l.h;
    document.getElementById('nav-wallet').innerText = l.w;
    document.getElementById('nav-cart').innerText = l.c;
    document.getElementById('nav-fav').innerText = l.f;
    document.getElementById('nav-set').innerText = l.s;
    document.getElementById('set-title').innerText = l.setTitle;
    document.getElementById('lbl-lang').innerText = l.lblLang;
    document.getElementById('lbl-theme').innerText = l.lblTheme;

    if(document.getElementById('title-notif')) document.getElementById('title-notif').innerText = l.titleNotif;
    if(document.getElementById('page-wallet')) document.getElementById('page-wallet').innerText = l.pWallet;
    if(document.getElementById('page-cart')) document.getElementById('page-cart').innerText = l.pCart;
    if(document.getElementById('page-fav')) document.getElementById('page-fav').innerText = l.pFav;
    if(document.getElementById('empty-cart')) document.getElementById('empty-cart').innerText = l.eCart;
    if(document.getElementById('empty-fav')) document.getElementById('empty-fav').innerText = l.eFav;

    document.querySelectorAll('.btn-cart').forEach(b => b.innerText = l.cartBtn);
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function toggleNotifications() {
    const modal = document.getElementById('modal-notif');
    modal.classList.toggle('hidden');
}

function toggleFav(btn) {
    btn.classList.toggle('text-red-500');
    btn.classList.toggle('text-gray-300');
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
});
