// Луғати тарҷума барои сомонаи VARZID (Тартиб: Русский, English, Тоҷикӣ, Ўзбекча)
const translations = {
  ru: {
    title: "Агромаркетплейс VARZID",
    subtitle: "Качественная продукция и товары прямо от производителей.",
    searchPlaceholder: "Поиск товаров в VARZID...",
    catGrains: "Зерновые",
    catSeeds: "Семена",
    catFertilizers: "Удобрения",
    navHome: "Главная",
    navCatalog: "Каталог",
    navCart: "Корзина",
    navProfile: "Кабинет"
  },
  en: {
    title: "Agromarketplace VARZID",
    subtitle: "High quality products directly from producers.",
    searchPlaceholder: "Search products in VARZID...",
    catGrains: "Grains",
    catSeeds: "Seeds",
    catFertilizers: "Fertilizers",
    navHome: "Home",
    navCatalog: "Catalog",
    navCart: "Cart",
    navProfile: "Profile"
  },
  tj: {
    title: "Агромаркетплейс VARZID",
    subtitle: "Маҳсулоти хушсифат ва товарҳо бевосита аз истеҳсолкунандагон.",
    searchPlaceholder: "Ҷустуҷӯи маҳсулот дар VARZID...",
    catGrains: "Ғалладонагӣ",
    catSeeds: "Уруғҳо",
    catFertilizers: "Нуриҳо",
    navHome: "Асосӣ",
    navCatalog: "Каталог",
    navCart: "Сабад",
    navProfile: "Кабинет"
  },
  uz: {
    title: "VARZID агромаркетплейси",
    subtitle: "Юқори сифатли маҳсулотлар ва товарлар бевосита ишлаб чиқарувчилардан.",
    searchPlaceholder: "VARZID дан маҳсулотларни қидириш...",
    catGrains: "Дон маҳсулотлари",
    catSeeds: "Уруғликлар",
    catFertilizers: "Ўғитлар",
    navHome: "Бош саҳифа",
    navCatalog: "Каталог",
    navCart: "Сават",
    navProfile: "Кабинет"
  }
};

// Функцияи иваз кардани забон
function changeLanguage(lang) {
  localStorage.setItem('varzid_lang', lang);
  
  if (document.getElementById('banner-title')) {
    document.getElementById('banner-title').innerText = translations[lang].title;
  }
  if (document.getElementById('banner-subtitle')) {
    document.getElementById('banner-subtitle').innerText = translations[lang].subtitle;
  }
  if (document.getElementById('search-input')) {
    document.getElementById('search-input').placeholder = translations[lang].searchPlaceholder;
  }
  
  if (document.getElementById('cat-grains')) {
    document.getElementById('cat-grains').innerText = translations[lang].catGrains;
  }
  if (document.getElementById('cat-seeds')) {
    document.getElementById('cat-seeds').innerText = translations[lang].catSeeds;
  }
  if (document.getElementById('cat-fertilizers')) {
    document.getElementById('cat-fertilizers').innerText = translations[lang].catFertilizers;
  }

  if (document.getElementById('nav-home')) {
    document.getElementById('nav-home').innerText = translations[lang].navHome;
  }
  if (document.getElementById('nav-catalog')) {
    document.getElementById('nav-catalog').innerText = translations[lang].navCatalog;
  }
  if (document.getElementById('nav-cart')) {
    document.getElementById('nav-cart').innerText = translations[lang].navCart;
  }
  if (document.getElementById('nav-profile')) {
    document.getElementById('nav-profile').innerText = translations[lang].navProfile;
  }
}

// Ҳангоми боркунии саҳифа забони интихобшуда фаъол мешавад
document.addEventListener('DOMContentLoaded', function() {
  const savedLang = localStorage.getItem('varzid_lang') || 'ru';
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.value = savedLang;
  }
  changeLanguage(savedLang);
});
