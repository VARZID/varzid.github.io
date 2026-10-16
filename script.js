const langData = {
    ru: {
        addr: "Фархор, Центр", search: "Поиск товаров...",
        cat1: "Зерно", cat2: "Удобрения", cat3: "Корма",
        badge: "Скидка 0%", bTitle: "Спецпредложение недели", bDesc: "Лучшие цены с доставкой.",
        tab1: "Для вас", tab2: "Цены дня", cartBtn: "В корзину",
        p1: "Пшеница отборная", p2: "Кукуруза сухая",
        h: "Главная", w: "Кошелек", c: "Корзина", f: "Избранное", s: "Настройки",
        setTitle: "Настройки", lblLang: "Язык приложения", lblTheme: "Темная тема"
    },
    tj: {
        addr: "Фархор, Марказ", search: "Ҷустуҷӯи маҳсулот...",
        cat1: "Ғалла", cat2: "Нуриҳо", cat3: "Хӯрокворӣ",
        badge: "Тахфиф 0%", bTitle: "Пешниҳоди махсус", bDesc: "Нархҳои беҳтарин бо расонидан.",
        tab1: "Барои шумо", tab2: "Нархҳои рӯз", cartBtn: "Ба сабад",
        p1: "Гандуми аълосифат", p2: "Маккаҷухории хушк",
        h: "Хона", w: "Қуттича", c: "Сабад", f: "Дӯстдошта", s: "Танзимот",
        setTitle: "Танзимот", lblLang: "Забони барнома", lblTheme: "Режими шабона"
    },
    uz: {
        addr: "Farxor, Markaz", search: "Mahsulotlarni qidirish...",
        cat1: "Don", cat2: "O'g'it", cat3: "Yem",
        badge: "Chegirma 0%", bTitle: "Maxsus taklif", bDesc: "Yetkazib berish bilan eng yaxshi narxlar.",
        tab1: "Siz uchun", tab2: "Kun narxlari", cartBtn: "Savatga",
        p1: "Saralangan bug'doy", p2: "Quruq makkajo'xori",
        h: "Bosh sahifa", w: "Hamyon", c: "Savat", f: "Saralangan", s: "Sozlamalar",
        setTitle: "Sozlamalar", lblLang: "Ilova tili", lblTheme: "Tungi rejim"
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

    document.querySelectorAll('.btn-cart').forEach(b => b.innerText = l.cartBtn);
}

function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
}

function showTab(tab) {
    const home = document.getElementById('view-home');
    const settings = document.getElementById('view-settings');
    const btnHome = document.getElementById('nav-home-btn');
    const btnSet = document.getElementById('nav-set-btn');

    if (tab === 'home') {
        home.classList.remove('hidden');
        settings.classList.add('hidden');
        btnHome.classList.replace('text-gray-400', 'text-emerald-600');
        btnSet.classList.replace('text-emerald-600', 'text-gray-400');
    } else if (tab === 'settings') {
        home.classList.add('hidden');
        settings.classList.remove('hidden');
        btnSet.classList.replace('text-gray-400', 'text-emerald-600');
        btnHome.classList.replace('text-emerald-600', 'text-gray-400');
    }
}
