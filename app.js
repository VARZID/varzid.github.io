
"use strict";

const GROUPS = [
  {id:"higher", name:"Высшая лига Фархора", sub:"Высшая лига"},
  {id:"district", name:"Лига района Фархора", sub:"Районная лига"},
  {id:"east", name:"Лига Регион Шарқ", sub:"Восточный регион"},
  {id:"west", name:"Лига Регион Ғарб", sub:"Западный регион"},
  {id:"north", name:"Лига Регион Шимол", sub:"Северный регион"},
  {id:"south", name:"Лига Регион Ҷануб", sub:"Южный регион"},
  {id:"cup", name:"Кубок Фархора", sub:"Кубок"},
  {id:"friendly", name:"Товарищеские матчи", sub:"Товарищеские матчи"}
];

const ADMIN_CODES = {
  "123кубок":"cup",
  "123дустона":"friendly",
  "123шарк":"east",
  "123гарб":"west",
  "123шимол":"north",
  "123чануб":"south"
};

let teams = [];
let matches = [];
let activeAdminRole = "guest";
let currentPage = "matchesPage";
let selectedLeague = null;
let currentFilter = "all";
let selectedDate = new Date();
let searchText = "";

const $ = id => document.getElementById(id);

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
  localStorage.setItem("varzid_state", JSON.stringify({
    teams,
    matches
  }));
}

function groupName(id) {
  return GROUPS.find(g => g.id === id)?.name || id;
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

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const page = $(pageId);
  if (page) page.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.page === pageId);
  });

  currentPage = pageId;

  const hero = document.querySelector(".hero-card");
  if (hero) {
    hero.style.display = pageId === "leagueDetailsPage" ? "none" : "flex";
  }

  if (pageId === "leaguesPage") renderLeagues();
  if (pageId === "ratingPage") renderRating();
  if (pageId === "profilePage") updateAdminUI();
  if (pageId === "matchesPage") renderMatches();
}

function renderLeagues() {
  const container = $("leaguesContainer");
  if (!container) return;

  container.innerHTML = "";

  function addLeagueCard(group, index) {
    const count = teams.filter(t => t.league === group.id).length;

    const card = document.createElement("button");
    card.className = "league-card";
    card.type = "button";

    const info = document.createElement("div");
    info.className = "league-info";

    const title = document.createElement("h4");
    title.textContent = group.name;

    const sub = document.createElement("p");
    sub.textContent = group.sub + " · " + count + " команд";

    info.append(title, sub);

    const number = document.createElement("span");
    number.className = "league-num";
    number.textContent = String(index).padStart(2, "0");

    card.append(info, number);
    card.addEventListener("click", () => openLeague(group.id));

    container.appendChild(card);
  }

  addLeagueCard(GROUPS[0], 1);
  addLeagueCard(GROUPS[1], 2);

  const heading = document.createElement("h3");
  heading.className = "league-section-title";
  heading.textContent = "Лига Деҳот Фархор";
  container.appendChild(heading);

  addLeagueCard(GROUPS[2], 3);
  addLeagueCard(GROUPS[3], 4);
  addLeagueCard(GROUPS[4], 5);
  addLeagueCard(GROUPS[5], 6);

  addLeagueCard(GROUPS[6], 7);
  addLeagueCard(GROUPS[7], 8);
}

function openLeague(id) {
  selectedLeague = id;
  $("leagueTitle").textContent = groupName(id);

  const teamContainer = $("leagueTeams");
  const matchContainer = $("leagueMatches");

  teamContainer.innerHTML = "";
  matchContainer.innerHTML = "";

  const leagueTeams = teams.filter(t => t.league === id);

  if (!leagueTeams.length) {
    teamContainer.innerHTML = '<div class="empty-state">В этой лиге пока нет команд</div>';
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
    matchContainer.innerHTML = '<div class="empty-state">Матчей пока нет</div>';
  } else {
    leagueMatches.forEach(match => {
      matchContainer.appendChild(createMatchCard(match));
    });
  }

  showPage("leagueDetailsPage");
}

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
    match.status === "live" ? "LIVE" :
    match.status === "finished" ? "Завершён" : "Предстоящий";

  card.append(title, info, status);
  return card;
}

function renderMatches() {
  const container = $("matchesList");
  if (!container) return;

  container.innerHTML = "";

  let list = matches.filter(match => {
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
    container.innerHTML = '<div class="empty-state">На эту дату матчей нет</div>';
    return;
  }

  list.forEach(match => container.appendChild(createMatchCard(match)));
}

function renderRating() {
  const tbody = $("ratingTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  const sorted = [...teams].sort((a, b) =>
    (b.points || 0) - (a.points || 0) ||
    ((b.goalsFor || 0) - (b.goalsAgainst || 0)) -
    ((a.goalsFor || 0) - (a.goalsAgainst || 0))
  );

  const empty = $("ratingEmpty");
  if (empty) empty.style.display = sorted.length ? "none" : "block";

  sorted.forEach((team, index) => {
    const tr = document.createElement("tr");

    [
      index + 1,
      team.name,
      team.played || 0,
      team.points || 0
    ].forEach(value => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

function updateAdminUI() {
  const label = $("adminRole");
  const panel = $("adminPanel");

  if (!label || !panel) return;

  if (activeAdminRole === "guest") {
    label.textContent = "Гость — войдите для управления";
    panel.classList.add("hidden");
    return;
  }

  label.textContent = isMainAdmin()
    ? "Администратор — все лиги"
    : "Администратор: " + groupName(activeAdminRole);

  panel.classList.remove("hidden");

  const select = $("adminLeague");
  if (!select) return;

  select.innerHTML = "";

  GROUPS.forEach(group => {
    if (canManageLeague(group.id)) {
      const option = document.createElement("option");
      option.value = group.id;
      option.textContent = group.name;
      select.appendChild(option);
    }
  });

  renderAdminTeams();
}

function loginWithCode() {
  const code = $("adminCodeInput").value.trim();

  if (code === "123456") {
    activeAdminRole = "master";
  } else if (ADMIN_CODES[code]) {
    activeAdminRole = ADMIN_CODES[code];
  } else {
    showMessage("Неверный код администратора");
    return;
  }

  $("adminCodeInput").value = "";
  updateAdminUI();
  showMessage("Вход выполнен");
}

function logout() {
  activeAdminRole = "guest";
  updateAdminUI();
  showMessage("Вы вышли из панели администратора");
}

function addTeam() {
  if (activeAdminRole === "guest") {
    showMessage("Сначала войдите как администратор");
    return;
  }

  const name = $("teamName").value.trim();
  const league = $("adminLeague").value;

  if (!name) {
    showMessage("Введите название команды");
    return;
  }

  if (!canManageLeague(league)) {
    showMessage("Нет доступа к этой лиге");
    return;
  }

  if (teams.length >= 70) {
    showMessage("Максимум 70 команд");
    return;
  }

  if (teams.some(t =>
    t.name.toLowerCase() === name.toLowerCase() && t.league === league
  )) {
    showMessage("Такая команда уже существует в этой лиге");
    return;
  }

  teams.push({
    id: Date.now().toString(),
    name,
    league,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0
  });

  saveData();
  $("teamName").value = "";
  renderAdminTeams();
  renderLeagues();
  renderRating();

  showMessage("Команда добавлена");
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
    remove.textContent = "Удалить";

    remove.addEventListener("click", () => deleteTeam(team.id));

    item.append(name, remove);
    container.appendChild(item);
  });
}

function deleteTeam(id) {
  const team = teams.find(t => t.id === id);
  if (!team || !canManageLeague(team.league)) {
    showMessage("Нет прав для удаления этой команды");
    return;
  }

  if (!confirm("Удалить команду " + team.name + "?")) return;

  teams = teams.filter(t => t.id !== id);
  saveData();

  renderAdminTeams();
  renderLeagues();
  renderRating();
  renderMatches();
}

function dateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function updateDate() {
  $("currentDate").textContent = selectedDate.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  $("dateLabel").textContent =
    dateKey(selectedDate) === dateKey(new Date()) ? "СЕГОДНЯ" : "ВЫБРАННАЯ ДАТА";

  renderMatches();
}

function changeDate(amount) {
  selectedDate.setDate(selectedDate.getDate() + amount);
  updateDate();
}

function setupSearch() {
  $("searchBtn").addEventListener("click", () => {
    $("searchPanel").classList.toggle("hidden");
    $("searchInput").focus();
  });

  $("closeSearch").addEventListener("click", () => {
    $("searchPanel").classList.add("hidden");
    $("searchInput").value = "";
    searchText = "";
    renderMatches();
  });

  $("searchInput").addEventListener("input", event => {
    searchText = event.target.value;
    renderMatches();
  });
}

function setupSettings() {
  $("settingsBtn").addEventListener("click", () => {
    $("settingsModal").classList.remove("hidden");
  });

  $("closeSettings").addEventListener("click", () => {
    $("settingsModal").classList.add("hidden");
  });

  $("settingsModal").addEventListener("click", event => {
    if (event.target === $("settingsModal")) {
      $("settingsModal").classList.add("hidden");
    }
  });

  const savedTheme = localStorage.getItem("varzid_theme") || "light";
  $("themeSelect").value = savedTheme;
  document.body.classList.toggle("dark", savedTheme === "dark");

  $("themeSelect").addEventListener("change", event => {
    const theme = event.target.value;
    document.body.classList.toggle("dark", theme === "dark");
    localStorage.setItem("varzid_theme", theme);
  });
}

function setupFilters() {
  document.querySelectorAll(".tab").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(tab =>
        tab.classList.remove("active")
      );

      button.classList.add("active");
      currentFilter = button.dataset.filter;
      renderMatches();
    });
  });
}

function setupNavigation() {
  document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
      showPage(button.dataset.page);
    });
  });
}

function init() {
  document.documentElement.lang = "ru";

  loadData();

  renderLeagues();
  renderRating();
  updateDate();
  updateAdminUI();

  setupNavigation();
  setupFilters();
  setupSearch();
  setupSettings();

  $("prevDate").addEventListener("click", () => changeDate(-1));
  $("nextDate").addEventListener("click", () => changeDate(1));

  $("applyAdminCodeBtn").addEventListener("click", loginWithCode);
  $("logoutBtn").addEventListener("click", logout);
  $("addTeamBtn").addEventListener("click", addTeam);

  $("backToLeagues").addEventListener("click", () => {
    showPage("leaguesPage");
  });
}

document.addEventListener("DOMContentLoaded", init);
