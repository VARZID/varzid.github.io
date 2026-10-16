
"use strict";

const translations = {
  ru: {
    subscribe: "Подписаться",
    language: "Язык",
    delivery: "Стоимость доставки зависит от расстояния.",
    categories: [
      "Мука",
      "Комбикорм",
      "Пшеница",
      "Ячмень",
      "Кукуруза",
      "Селитра",
      "Карбамид"
    ],
    settings: "Настройки"
  },

  tg: {
    subscribe: "Обуна шудан",
    language: "Забон",
    delivery: "Арзиши расонидан вобаста ба масофа аст.",
    categories: [
      "Орд",
      "Комбикорм",
      "Гандум",
      "Ҷав",
      "Ҷуворимакка",
      "Селитра",
      "Карбамид"
    ],
    settings: "Танзимот"
  },

  uz: {
    subscribe: "Obuna bo‘lish",
    language: "Til",
    delivery: "Yetkazib berish narxi masofaga bog‘liq.",
    categories: [
      "Un",
      "Kombikorm",
      "Bug‘doy",
      "Arpa",
      "Makkajo‘xori",
      "Selitra",
      "Karbamid"
    ],
    settings: "Sozlamalar"
  }
};

const categoryKeys = [
  "flour",
  "feed",
  "wheat",
  "barley",
  "corn",
  "saltpeter",
  "urea"
];

const elements = {
  categories: document.getElementById("categories"),
  languageSelect: document.getElementById("languageSelect"),
  languageLabel: document.getElementById("languageLabel"),
  deliveryNote: document.getElementById("deliveryNote"),
  subscribeLabel: document.getElementById("subscribeLabel"),
  subscribeToggle: document.getElementById("subscribeToggle"),
  subscribeMenu: document.getElementById("subscribeMenu"),
  subscribeAction: document.getElementById("subscribeAction"),
  settingsToggle: document.getElementById("settingsToggle"),
  settingsPanel: document.getElementById("settingsPanel")
};

function readSavedLanguage() {
  try {
    const saved = localStorage.getItem("lang");
    return saved && translations[saved] ? saved : "ru";
  } catch (error) {
    return "ru";
  }
}

let currentLanguage = readSavedLanguage();

function renderCategories() {
  const words = translations[currentLanguage];

  elements.categories.replaceChildren();

  words.categories.forEach((name, index) => {
    const card = document.createElement("article");
    card.className = "category-card";
    card.dataset.category = categoryKeys[index];

    const title = document.createElement("span");
    title.className = "category-name";
    title.textContent = name;

    const plus = document.createElement("span");
    plus.className = "category-plus";
    plus.textContent = "+";
    plus.setAttribute("aria-hidden", "true");

    card.append(title, plus);
    elements.categories.appendChild(card);
  });
}

function applyLanguage(language) {
  currentLanguage = translations[language] ? language : "ru";
  const words = translations[currentLanguage];

  document.documentElement.lang =
    currentLanguage === "tg" ? "tg" :
    currentLanguage === "uz" ? "uz" : "ru";

  elements.languageSelect.value = currentLanguage;
  elements.languageLabel.textContent = words.language;
  elements.deliveryNote.textContent = words.delivery;
  elements.subscribeLabel.textContent = words.subscribe;
  elements.subscribeAction.textContent = words.subscribe;
  elements.settingsToggle.setAttribute("aria-label", words.settings);
  elements.settingsPanel.setAttribute(
    "aria-label",
    words.settings
  );

  renderCategories();

  try {
    localStorage.setItem("lang", currentLanguage);
  } catch (error) {
    // Сайт продолжает работать, даже если сохранение недоступно.
  }
}

elements.languageSelect.addEventListener("change", function () {
  applyLanguage(this.value);
});

elements.settingsToggle.addEventListener("click", function () {
  const isHidden = elements.settingsPanel.hidden;

  elements.settingsPanel.hidden = !isHidden;
  this.setAttribute("aria-expanded", String(isHidden));

  elements.subscribeMenu.hidden = true;
  elements.subscribeToggle.setAttribute("aria-expanded", "false");
});

elements.subscribeToggle.addEventListener("click", function () {
  const isHidden = elements.subscribeMenu.hidden;

  elements.subscribeMenu.hidden = !isHidden;
  this.setAttribute("aria-expanded", String(isHidden));

  elements.settingsPanel.hidden = true;
  elements.settingsToggle.setAttribute("aria-expanded", "false");
});

elements.subscribeAction.addEventListener("click", function () {
  elements.subscribeMenu.hidden = true;
  elements.subscribeToggle.setAttribute("aria-expanded", "false");
});

document.addEventListener("click", function (event) {
  if (
    !elements.settingsPanel.contains(event.target) &&
    !elements.settingsToggle.contains(event.target)
  ) {
    elements.settingsPanel.hidden = true;
    elements.settingsToggle.setAttribute("aria-expanded", "false");
  }

  if (
    !elements.subscribeMenu.contains(event.target) &&
    !elements.subscribeToggle.contains(event.target)
  ) {
    elements.subscribeMenu.hidden = true;
    elements.subscribeToggle.setAttribute("aria-expanded", "false");
  }
});

applyLanguage(currentLanguage);
