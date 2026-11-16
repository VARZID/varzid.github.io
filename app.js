
"use strict";

/* =========================
   VARZID SCORE
   RU / TG LANGUAGE SYSTEM
========================= */

const GROUPS = [
  {id:"higher", ru:"Высшая лига Фархора", tg:"Лигаи олии Фархор", subRu:"Высшая лига", subTg:"Лигаи олӣ"},
  {id:"district", ru:"Лига района Фархора", tg:"Лигаи ноҳияи Фархор", subRu:"Районная лига", subTg:"Лигаи ноҳиявӣ"},
  {id:"east", ru:"Лига Регион Шарқ", tg:"Лигаи минтақаи Шарқ", subRu:"Восточный регион", subTg:"Минтақаи Шарқ"},
  {id:"west", ru:"Лига Регион Ғарб", tg:"Лигаи минтақаи Ғарб", subRu:"Западный регион", subTg:"Минтақаи Ғарб"},
  {id:"north", ru:"Лига Регион Шимол", tg:"Лигаи минтақаи Шимол", subRu:"Северный регион", subTg:"Минтақаи Шимол"},
  {id:"south", ru:"Лига Регион Ҷануб", tg:"Лигаи минтақаи Ҷануб", subRu:"Южный регион", subTg:"Минтақаи Ҷануб"},
  {id:"cup", ru:"Кубок Фархора", tg:"Ҷоми Фархор", subRu:"Кубок", subTg:"Ҷом"},
  {id:"friendly", ru:"Товарищеские матчи", tg:"Бозиҳои дӯстона", subRu:"Товарищеские матчи", subTg:"Бозиҳои дӯстона"}
];

const ADMIN_CODES = {
  "123кубок":"cup",
  "123дустона":"friendly",
  "123шарк":"east",
  "123гарб":"west",
  "123шимол":"north",
  "123чануб":"south"
};

const LANG = {
  ru: {
    search:"Поиск команды или лиги...",
    football:"ФУТБОЛ ФАРХОРА",
    hero:"Матчи, результаты и рейтинг футбольных команд",
    leagues:"Лиги и турниры",
    sections:"8 разделов",
    village:"Лига Деҳот Фархор",
    matches:"Матчи",
    rating:"Рейтинг",
    profile:"Профиль",
    all:"Все",
    live:"● LIVE",
    upcoming:"Предстоящие",
    finished:"Завершённые",
    overall:"Общий рейтинг команд",
    team:"Команда",
    played:"И",
    points:"О",
    noTeams:"Команды пока не добавлены",
    noMatches:"Пока нет матчей",
    noDateMatches:"На эту дату матчей нет",
    noLeagueTeams:"В этой лиге пока нет команд",
    noLeagueMatches:"Матчей пока нет",
    back:"← Назад к лигам",
    profileTitle:"Профиль и управление",
    adminLogin:"Административный вход",
    guest:"Гость — войдите для управления",
    adminAll:"Администратор — все лиги",
    adminLeague:"Администратор: ",
    enterCode:"Введите код администратора",
    login:"Войти",
    logout:"Выйти",
    manageTeams:"Управление командами",
    teamName:"Название команды",
    addTeam:"+ Добавить команду",
    delete:"Удалить",
    settings:"Настройки",
    language:"Язык",
    theme:"Тема",
    light:"Светлая",
    dark:"Тёмная",
    russian:"Русский",
    tajik:"Тоҷикӣ",
    today:"СЕГОДНЯ",
    selectedDate:"ВЫБРАННАЯ ДАТА",
    commands:"команд",
    completed:"Завершён",
    waiting:"Предстоящий",
    wrongCode:"Неверный код администратора",
    loginSuccess:"Вход выполнен",
    logoutSuccess:"Вы вышли из панели администратора",
    needLogin:"Сначала войдите как администратор",
    enterTeam:"Введите название команды",
    noAccess:"Нет доступа к этой лиге",
    maxTeams:"Максимум 70 команд",
    duplicate:"Такая команда уже существует в этой лиге",
    teamAdded:"Команда добавлена",
    noDelete:"Нет прав для удаления этой команды",
    deleteConfirm:"Удалить команду "
  },

  tg: {
    search:"Ҷустуҷӯи даста ё лига...",
    football:"ФУТБОЛИ ФАРХОР",
    hero:"Бозиҳо, натиҷаҳо ва радабандии дастаҳои футбол",
    leagues:"Лигаҳо ва мусобиқаҳо",
    sections:"8 бахш",
    village:"Лигаи деҳоти Фархор",
    matches:"Бозиҳо",
    rating:"Радабандӣ",
    profile:"Профил",
    all:"Ҳама",
    live:"● ЗИНДА",
    upcoming:"Бозиҳои дар пеш",
    finished:"Бозиҳои анҷомёфта",
    overall:"Радабандии умумии дастаҳо",
    team:"Даста",
    played:"Б",
    points:"Х",
    noTeams:"Ҳоло ягон даста илова нашудааст",
    noMatches:"Ҳоло бозие нест",
    noDateMatches:"Дар ин сана бозӣ нест",
    noLeagueTeams:"Дар ин лига ҳоло даста нест",
    noLeagueMatches:"Ҳоло бозӣ нест",
    back:"← Бозгашт ба лигаҳо",
    profileTitle:"Профил ва идоракунӣ",
    adminLogin:"Воридшавии маъмур",
    guest:"Меҳмон — барои идоракунӣ ворид шавед",
    adminAll:"Маъмури асосӣ — ҳамаи лигаҳо",
    adminLeague:"Маъмури лига: ",
    enterCode:"Рамзи маъмурро ворид кунед",
    login:"Ворид шудан",
    logout:"Баромадан",
    manageTeams:"Идоракунии дастаҳо",
    teamName:"Номи даста",
    addTeam:"+ Илова кардани даста",
    delete:"Ҳазф кардан",
    settings:"Танзимот",
    language:"Забон",
    theme:"Намуди зоҳирӣ",
    light:"Равшан",
    dark:"Торик",
    russian:"Русӣ",
    tajik:"Тоҷикӣ",
    today:"ИМРӮЗ",
    selectedDate:"САНАИ ИНТИХОБШУДА",
    commands:"даста",
    completed:"Анҷом ёфт",
    waiting:"Дар пеш",
    wrongCode:"Рамзи маъмур нодуруст аст",
    loginSuccess:"Воридшавӣ муваффақ шуд",
    logoutSuccess:"Шумо аз панели маъмур баромадед",
    needLogin:"Аввал ҳамчун маъмур ворид шавед",
    enterTeam:"Номи дастаро ворид кунед",
    noAccess:"Ба ин лига дастрасӣ надоред",
    maxTeams:"Ҳадди аксар 70 даста",
    duplicate:"Ин даста дар ин лига аллакай мавҷуд аст",
    teamAdded:"Даста илова карда шуд",
    noDelete:"Барои ҳазфи ин даста иҷозат надоред",
    deleteConfirm:"Дастаро ҳазф мекунед: "
  }
};

let teams = [];
let matches = [];
let activeAdminRole = "guest";
let currentPage = "leaguesPage";
let selectedLeague = null;
let currentFilter = "all";
let selectedDate = new Date();
let searchText = "";

let language = localStorage.getItem("varzid_language") || "ru";

const $ = id => document.getElementById(id);
const tr = key => LANG[language][key] || LANG.ru[key] || key;

function groupName(id) {
  const group = GROUPS.find(g => g.id === id);
  return group ? group[language] : id;
}

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem("varzid_state") || "{}");
    teams = Array.isArray(saved.teams) ? saved.teams : [];
    matches = Array.isArray(saved.matches) ? saved.matches : [];
  } catch (error) {
    teams = [];
    matches = [];
  }
}

function saveData() {
  localStorage.setItem("varzid_state", JSON.stringify({teams,matches}));
}

function isMainAdmin() {
  return activeAdminRole === "master";
}

function canManageLeague(league) {
  return isMainAdmin() || activeAdminRole === league;
}

function showMessage(message) {
  alert(message);
}

/* LANGUAGE */

function applyLanguage() {
  document.documentElement.lang = language;

  const text = (id,value) => {
    const el = $(id);
    if (el) el.textContent = value;
  };

  const placeholder = (id,value) => {
    const el = $(id);
    if (el) el.placeholder = value;
  };

  const set = (selector,value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value;
  };

  placeholder("searchInput",tr("search"));
  placeholder("adminCodeInput",tr("enterCode"));
  placeholder("teamName",tr("teamName"));

  set(".hero-tag",tr("football"));
  set(".hero-card p",tr("hero"));

  set("#leaguesPage .section-header h3",tr("leagues"));
  set("#leaguesPage .section-header span",tr("sections"));

  set("#ratingPage .section-header h3",tr("overall"));
  set("#profilePage > .section-header h3",tr("profileTitle"));
  set("#profilePage .panel h3",tr("adminLogin"));
  set("#adminPanel h3",tr("manageTeams"));
  set("#settingsModal .modal-header h3",tr("settings"));

  text("applyAdminCodeBtn",tr("login"));
  text("logoutBtn",tr("logout"));
  text("addTeamBtn",tr("addTeam"));
  text("backToLeagues",tr("back"));

  const headers = document.querySelectorAll("#ratingPage thead th");
  if (headers.length >= 4) {
    headers[1].textContent = tr("team");
    headers[2].textContent = tr("played");
    headers[3].textContent = tr("points");
  }

  const tabs = document.querySelectorAll(".tab");
  const tabKeys = ["all","live","upcoming","finished"];
  tabs.forEach((tab,index) => {
    if (tabKeys[index]) tab.textContent = tr(tabKeys[index]);
  });

  const labels = document.querySelectorAll("#settingsModal label");
  if (labels[0]) labels[0].textContent = tr("language");
  if (labels[1]) labels[1].textContent = tr("theme");

  if ($("languageSelect")) {
    $("languageSelect").value = language;
    $("languageSelect").options[0].textContent = tr("russian");
    $("languageSelect").options[1].textContent = tr("tajik");
  }

  if ($("themeSelect")) {
    $("themeSelect").options[0].textContent = tr("light");
    $("themeSelect").options[1].textContent = tr("dark");
  }

  const nav = {
    leaguesPage:tr("leagues"),
    matchesPage:tr("matches"),
    ratingPage:tr("rating"),
    profilePage:tr("profile")
  };

  document.querySelectorAll(".nav-item").forEach(button => {
    const label = button.querySelector("span:last-child");
    if (label) label.textContent = nav[button.dataset.page] || "";
  });

  updateDate();
  renderLeagues();
  renderMatches();
  renderRating();
  updateAdminUI();

  if (selectedLeague) openLeague(selectedLeague,false);
}

function changeLanguage(value) {
  language = value === "tg" ? "tg" : "ru";
  localStorage.setItem("varzid_language",language);
  applyLanguage();
}

/* NAVIGATION */

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const page = $(pageId);
  if (page) page.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("active",button.dataset.page === pageId);
  });

  currentPage = pageId;

  const hero = document.querySelector(".hero-card");
  if (hero) hero.style.display = pageId === "leagueDetailsPage" ? "none" : "flex";

  if (pageId === "leaguesPage") renderLeagues();
  if (pageId === "ratingPage") renderRating();
  if (pageId === "profilePage") updateAdminUI();
  if (pageId === "matchesPage") renderMatches();
}

/* LEAGUES */

function renderLeagues() {
  const container = $("leaguesContainer");
  if (!container) return;

  container.innerHTML = "";

  function addLeagueCard(group,index) {
    const count = teams.filter(t => t.league === group.id).length;

    const card = document.createElement("button");
    card.className = "league-card";
    card.type = "button";

    const info = document.createElement("div");
    info.className = "league-info";

    const title = document.createElement("h4");
    title.textContent = groupName(group.id);

    const sub = document.createElement("p");
    sub.textContent =
      (language === "ru" ? group.subRu : group.subTg) +
      " · " + count + " " + tr("commands");

    info.append(title,sub);

    const number = document.createElement("span");
    number.className = "league-num";
    number.textContent = String(index).padStart(2,"0");

    card.append(info,number);
    card.addEventListener("click",() => openLeague(group.id));

    container.appendChild(card);
  }

  addLeagueCard(GROUPS[0],1);
  addLeagueCard(GROUPS[1],2);

  const heading = document.createElement("h3");
  heading.className = "league-section-title";
  heading.textContent = tr("village");
  container.appendChild(heading);

  addLeagueCard(GROUPS[2],3);
  addLeagueCard(GROUPS[3],4);
  addLeagueCard(GROUPS[4],5);
  addLeagueCard(GROUPS[5],6);
  addLeagueCard(GROUPS[6],7);
  addLeagueCard(GROUPS[7],8);
}

function openLeague(id,navigate = true) {
  selectedLeague = id;

  $("leagueTitle").textContent = groupName(id);

  const teamContainer = $("leagueTeams");
  const matchContainer = $("leagueMatches");

  teamContainer.innerHTML = "";
  matchContainer.innerHTML = "";

  const leagueTeams = teams.filter(t => t.league === id);

  if (!leagueTeams.length) {
    teamContainer.innerHTML = `<div class="empty-state">${tr("noLeagueTeams")}</div>`;
  } else {
    leagueTeams.forEach(team => {
      const item = document.createElement("div");
      item.className = "match-card";
      item.textContent = team.name;
      teamContainer.appendChild(item);
    });
  }

  const leagueMatches = matches.filter(m => m.league === id);

  if (!leagueMatches.length) {
    matchContainer.innerHTML = `<div class="empty-state">${tr("noLeagueMatches")}</div>`;
  } else {
    leagueMatches.forEach(match => {
      matchContainer.appendChild(createMatchCard(match));
    });
  }

  if (navigate) showPage("leagueDetailsPage");
}

/* MATCHES */

function createMatchCard(match) {
  const card = document.createElement("div");
  card.className = "match-card";

  const title = document.createElement("strong");
  title.textContent =
    `${match.home} ${match.home_score ?? "-"} : ${match.away_score ?? "-"} ${match.away}`;

  const info = document.createElement("p");
  info.textContent = `${groupName(match.league)} · ${match.match_date || ""}`;

  const status = document.createElement("span");
  status.className = "match-status";
  status.textContent =
    match.status === "live" ? tr("live") :
    match.status === "finished" ? tr("completed") : tr("waiting");

  card.append(title,info,status);
  return card;
}

function renderMatches() {
  const container = $("matchesList");
  if (!container) return;

  container.innerHTML = "";

  const list = matches.filter(match => {
    const dateMatch = match.match_date === dateKey(selectedDate);

    const filterMatch =
      currentFilter === "all" ||
      (currentFilter === "live" && match.status === "live") ||
      (currentFilter === "upcoming" && match.status === "upcoming") ||
      (currentFilter === "finished" && match.status === "finished");

    const searchMatch = !searchText ||
      `${match.home} ${match.away} ${groupName(match.league)}`
      .toLowerCase().includes(searchText.toLowerCase());

    return dateMatch && filterMatch && searchMatch;
  });

  if (!list.length) {
    container.innerHTML = `<div class="empty-state">${tr("noDateMatches")}</div>`;
    return;
  }

  list.forEach(match => container.appendChild(createMatchCard(match)));
}

/* RATING */

function renderRating() {
  const tbody = $("ratingTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  const sorted = [...teams].sort((a,b) =>
    (b.points || 0) - (a.points || 0) ||
    ((b.goalsFor || 0) - (b.goalsAgainst || 0)) -
    ((a.goalsFor || 0) - (a.goalsAgainst || 0))
  );

  const empty = $("ratingEmpty");
  if (empty) {
    empty.textContent = tr("noTeams");
    empty.style.display = sorted.length ? "none" : "block";
  }

  sorted.forEach((team,index) => {
    const row = document.createElement("tr");

    [index+1,team.name,team.played || 0,team.points || 0].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    tbody.appendChild(row);
  });
}

/* ADMIN */

function updateAdminUI() {
  const label = $("adminRole");
  const panel = $("adminPanel");

  if (!label || !panel) return;

  if (activeAdminRole === "guest") {
    label.textContent = tr("guest");
    panel.classList.add("hidden");
    return;
  }

  label.textContent = isMainAdmin()
    ? tr("adminAll")
    : tr("adminLeague") + groupName(activeAdminRole);

  panel.classList.remove("hidden");

  const select = $("adminLeague");
  if (!select) return;

  const previous = select.value;
  select.innerHTML = "";

  GROUPS.forEach(group => {
    if (canManageLeague(group.id)) {
      const option = document.createElement("option");
      option.value = group.id;
      option.textContent = groupName(group.id);
      select.appendChild(option);
    }
  });

  if ([...select.options].some(option => option.value === previous)) {
    select.value = previous;
  }

  renderAdminTeams();
}

function loginWithCode() {
  const code = $("adminCodeInput").value.trim();

  if (code === "123456") {
    activeAdminRole = "master";
  } else if (ADMIN_CODES[code]) {
    activeAdminRole = ADMIN_CODES[code];
  } else {
    showMessage(tr("wrongCode"));
    return;
  }

  $("adminCodeInput").value = "";
  updateAdminUI();
  showMessage(tr("loginSuccess"));
}

function logout() {
  activeAdminRole = "guest";
  updateAdminUI();
  showMessage(tr("logoutSuccess"));
}

function addTeam() {
  if (activeAdminRole === "guest") {
    showMessage(tr("needLogin"));
    return;
  }

  const name = $("teamName").value.trim();
  const league = $("adminLeague").value;

  if (!name) {
    showMessage(tr("enterTeam"));
    return;
  }

  if (!canManageLeague(league)) {
    showMessage(tr("noAccess"));
    return;
  }

  if (teams.length >= 70) {
    showMessage(tr("maxTeams"));
    return;
  }

  if (teams.some(t =>
    t.name.toLowerCase() === name.toLowerCase() && t.league === league
  )) {
    showMessage(tr("duplicate"));
    return;
  }

  teams.push({
    id:Date.now().toString(),
    name,
    league,
    played:0,
    won:0,
    drawn:0,
    lost:0,
    goalsFor:0,
    goalsAgainst:0,
    points:0
  });

  saveData();
  $("teamName").value = "";

  renderAdminTeams();
  renderLeagues();
  renderRating();

  showMessage(tr("teamAdded"));
}

function renderAdminTeams() {
  const container = $("adminTeams");
  if (!container) return;

  container.innerHTML = "";

  teams.forEach(team => {
    if (!canManageLeague(team.league)) return;

    const item = document.createElement("div");
    item.className = "admin-team-item";

    const name = document.createElement("span");
    name.textContent = team.name + " — " + groupName(team.league);

    const remove = document.createElement("button");
    remove.className = "delete-btn";
    remove.textContent = tr("delete");
    remove.addEventListener("click",() => deleteTeam(team.id));

    item.append(name,remove);
    container.appendChild(item);
  });
}

function deleteTeam(id) {
  const team = teams.find(t => t.id === id);

  if (!team || !canManageLeague(team.league)) {
    showMessage(tr("noDelete"));
    return;
  }

  if (!confirm(tr("deleteConfirm") + team.name + "?")) return;

  teams = teams.filter(t => t.id !== id);
  saveData();

  renderAdminTeams();
  renderLeagues();
  renderRating();
  renderMatches();
}

/* DATE */

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,"0");
  const d = String(date.getDate()).padStart(2,"0");
  return `${y}-${m}-${d}`;
}

function updateDate() {
  $("currentDate").textContent = selectedDate.toLocaleDateString(
    language === "tg" ? "tg-TJ" : "ru-RU",
    {day:"numeric",month:"long",year:"numeric"}
  );

  $("dateLabel").textContent =
    dateKey(selectedDate) === dateKey(new Date())
      ? tr("today")
      : tr("selectedDate");

  renderMatches();
}

function changeDate(amount) {
  selectedDate.setDate(selectedDate.getDate()+amount);
  updateDate();
}

/* SEARCH */

function setupSearch() {
  $("searchBtn").addEventListener("click",() => {
    $("searchPanel").classList.toggle("hidden");
    $("searchInput").focus();
  });

  $("closeSearch").addEventListener("click",() => {
    $("searchPanel").classList.add("hidden");
    $("searchInput").value = "";
    searchText = "";
    renderMatches();
  });

  $("searchInput").addEventListener("input",event => {
    searchText = event.target.value;
    renderMatches();
  });
}

/* SETTINGS */

function setupSettings() {
  $("settingsBtn").addEventListener("click",() => {
    $("settingsModal").classList.remove("hidden");
  });

  $("closeSettings").addEventListener("click",() => {
    $("settingsModal").classList.add("hidden");
  });

  $("settingsModal").addEventListener("click",event => {
    if (event.target === $("settingsModal")) {
      $("settingsModal").classList.add("hidden");
    }
  });

  const savedTheme = localStorage.getItem("varzid_theme") || "light";
  $("themeSelect").value = savedTheme;
  document.body.classList.toggle("dark",savedTheme === "dark");

  $("themeSelect").addEventListener("change",event => {
    const theme = event.target.value;
    document.body.classList.toggle("dark",theme === "dark");
    localStorage.setItem("varzid_theme",theme);
  });

  $("languageSelect").addEventListener("change",event => {
    changeLanguage(event.target.value);
  });
}

/* FILTERS AND NAVIGATION */

function setupFilters() {
  document.querySelectorAll(".tab").forEach(button => {
    button.addEventListener("click",() => {
      document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
      button.classList.add("active");
      currentFilter = button.dataset.filter;
      renderMatches();
    });
  });
}

function setupNavigation() {
  document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click",() => showPage(button.dataset.page));
  });
}

/* START */

function init() {
  loadData();

  setupNavigation();
  setupFilters();
  setupSearch();
  setupSettings();

  $("prevDate").addEventListener("click",() => changeDate(-1));
  $("nextDate").addEventListener("click",() => changeDate(1));

  $("applyAdminCodeBtn").addEventListener("click",loginWithCode);
  $("logoutBtn").addEventListener("click",logout);
  $("addTeamBtn").addEventListener("click",addTeam);

  $("backToLeagues").addEventListener("click",() => showPage("leaguesPage"));

  applyLanguage();
  showPage("leaguesPage");
}

document.addEventListener("DOMContentLoaded",init);
