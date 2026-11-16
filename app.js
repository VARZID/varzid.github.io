// VARZID SCORE - Application Logic with Supabase & Local Management
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const GROUPS = [
  { id: "top", tj: "Гурӯҳи олии Фархор", ru: "Высшая лига Фархора" },
  { id: "district", tj: "Лигаи ноҳияи Фархор", ru: "Лига района Фархор" },
  { id: "east", tj: "Деҳи Шарқ", ru: "Восточный регион" },
  { id: "west", tj: "Деҳи Ғарб", ru: "Западный регион" },
  { id: "north", tj: "Деҳи Шимол", ru: "Северный регион" },
  { id: "south", tj: "Деҳи Ҷануб", ru: "Южный регион" },
  { id: "cup", tj: "Кубоки Фархор", ru: "Кубок Фархора" },
  { id: "friendly", tj: "Бозиҳои дӯстона", ru: "Товарищеские матчи" }
];

// Кодҳои админҳо барои дастрасии минтақавӣ ва махсус
const ADMIN_CODES = {
  "123кубок": "cup",
  "123дустона": "friendly",
  "123шарк": "east",
  "123гарб": "west",
  "123шимол": "north",
  "123чануб": "south"
};

let supabaseClient = null;
let currentUser = null;
let currentProfile = null;
let matches = [];
let teams = [];
let language = "tj";
let activeAdminRole = "master"; // По умолчанию админи асосӣ (бе код)

const $ = (selector) => document.querySelector(selector);

function groupName(id) {
  const group = GROUPS.find(item => item.id === id);
  return group ? group[language || "tj"] : id;
}

function isMainAdmin() {
  return activeAdminRole === "master" || currentProfile?.role === "super_admin";
}

function canManageLeague(league) {
  if (isMainAdmin()) return true;
  return activeAdminRole === league || currentProfile?.league_id === league;
}

function showMessage(message) {
  alert(message);
}

// Санҷиши воридшавии админ бо кодҳо
function loginWithCode(code) {
  if (!code) {
    activeAdminRole = "master";
    showMessage("Шумо ҳамчун Админи Асосӣ ворид шудед (Ҳама ҳуқуқҳо фаъolанд).");
    updateAuthUI();
    return true;
  }
  
  if (ADMIN_CODES[code]) {
    activeAdminRole = ADMIN_CODES[code];
    showMessage(`Шумо ҳамчун админи "${groupName(activeAdminRole)}" ворид шудед.`);
    updateAuthUI();
    return true;
  } else {
    showMessage("Коди админ хато аст!");
    return false;
  }
}

function initializeSupabase() {
  if (!window.supabase) {
    console.warn("Supabase library not loaded, running in local memory mode.");
    return;
  }

  if (SUPABASE_URL !== "YOUR_SUPABASE_URL" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY") {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      currentUser = session?.user || null;
      loadProfile();
    });
  }
}

async function loadProfile() {
  if (!supabaseClient || !currentUser) {
    updateAuthUI();
    return;
  }

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("role, league_id")
    .eq("id", currentUser.id)
    .single();

  if (!error && data) {
    currentProfile = data;
  }
  updateAuthUI();
  await loadData();
}

function updateAuthUI() {
  const adminLabel = $("#adminRole");
  if (adminLabel) {
    adminLabel.textContent = isMainAdmin()
      ? "Админи асосӣ (Ҳамаи лигаҳо)"
      : `Админ: ${groupName(activeAdminRole)}`;
  }
}

async function loadData() {
  // Агар Supabase бошад аз онҷо мекашад, агар не аз LocalStorage ё хотираи пешфарз
  if (supabaseClient) {
    const [teamResult, matchResult] = await Promise.all([
      supabaseClient.from("teams").select("*").order("name"),
      supabaseClient.from("matches").select("*").order("match_date", { ascending: false })
    ]);
    if (!teamResult.error) teams = teamResult.data || [];
    if (!matchResult.error) matches = matchResult.data || [];
  } else {
    let localState = JSON.parse(localStorage.getItem('varzid_state')) || { teams: [], matches: [] };
    teams = localState.teams;
    matches = localState.matches;
  }
  renderTeams();
  renderMatches();
}

function saveLocalState() {
  localStorage.setItem('varzid_state', JSON.stringify({ teams, matches }));
}

// Илова кардани даста (то 70 даста)
async function addTeam() {
  const name = $("#teamName")?.value.trim();
  const league = $("#adminLeague")?.value || activeAdminRole;

  if (!name) {
    showMessage("Номи дастаро ворид кунед.");
    return;
  }

  if (teams.length >= 70) {
    showMessage("Лимит пур шуд! Ҳадди аксар 70 даста иҷозат аст.");
    return;
  }

  if (!canManageLeague(league)) {
    showMessage("Шумо ба ин гурӯҳ иҷозат надоред.");
    return;
  }

  const newTeam = {
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
  };

  if (supabaseClient && currentProfile) {
    await supabaseClient.from("teams").insert({ name, league });
  } else {
    teams.push(newTeam);
    saveLocalState();
  }

  if ($("#teamName")) $("#teamName").value = "";
  loadData();
  showMessage("Даста бо муваффақият илова шуд!");
}

async function deleteTeam(id) {
  const team = teams.find(item => item.id == id);
  if (team && !canManageLeague(team.league)) {
    showMessage("Шумо ҳуқуқи нест кардани ин дастаро надоред.");
    return;
  }

  if (!confirm("Даста нест карда шавад?")) return;

  if (supabaseClient && currentProfile) {
    await supabaseClient.from("teams").delete().eq("id", id);
  } else {
    teams = teams.filter(item => item.id != id);
    saveLocalState();
  }
  loadData();
}

// Сабти бозӣ ва таъсир ба рейтинг (Очкоҳо)
async function recordMatchResult(homeId, awayId, homeGoals, awayGoals, leagueType) {
  const homeTeam = teams.find(t => t.id == homeId);
  const awayTeam = teams.find(t => t.id == awayId);

  if (!homeTeam || !awayTeam) {
    showMessage("Дастаҳо ёфт нашуданд!");
    return;
  }

  homeTeam.played++;
  awayTeam.played++;
  homeTeam.goalsFor += homeGoals;
  homeTeam.goalsAgainst += awayGoals;
  awayTeam.goalsFor += awayGoals;
  awayTeam.goalsAgainst += homeGoals;

  // Ҳисоби очкоҳо барои рейтинг
  if (homeGoals > awayGoals) {
    homeTeam.won++;
    homeTeam.points += 3;
    awayTeam.lost++;
  } else if (homeGoals < awayGoals) {
    awayTeam.won++;
    awayTeam.points += 3;
    homeTeam.lost++;
  } else {
    homeTeam.drawn++;
    homeTeam.points += 1;
    awayTeam.drawn++;
    awayTeam.points += 1;
  }

  matches.push({
    id: Date.now().toString(),
    home: homeTeam.name,
    away: awayTeam.name,
    home_score: homeGoals,
    away_score: awayGoals,
    league: leagueType,
    match_date: new Date().toISOString().split('T')[0],
    status: "finished"
  });

  saveLocalState();
  loadData();
  updateRatingTable();
}

function updateRatingTable() {
  // Мураттабсозӣ аз рӯи очко ва фарқи голҳо
  teams.sort((a, b) => b.points - a.points || (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst));
}

function renderTeams() {
  const container = $("#adminTeams");
  if (!container) return;
  container.innerHTML = "";

  teams.forEach(team => {
    if (!isMainAdmin() && team.league !== activeAdminRole) return;

    const item = document.createElement("div");
    item.className = "admin-team-item";
    item.style.display = "flex";
    item.style.justifyContent = "space-between";
    item.style.padding = "8px";
    item.style.borderBottom = "1px solid #eee";

    const name = document.createElement("span");
    name.textContent = `${team.name} (${groupName(team.league)}) - Очко: ${team.points}`;
    item.appendChild(name);

    const remove = document.createElement("button");
    remove.textContent = "🗑 Нест кардан";
    remove.style.background = "#ff4d4d";
    remove.style.color = "#fff";
    remove.style.border = "none";
    remove.style.padding = "4px 8px";
    remove.style.borderRadius = "4px";
    remove.style.cursor = "pointer";
    remove.onclick = () => deleteTeam(team.id);
    item.appendChild(remove);

    container.appendChild(item);
  });
}

function renderMatches() {
  const container = $("#matchesList");
  if (!container) return;
  container.innerHTML = "";

  matches.forEach(match => {
    const item = document.createElement("div");
    item.className = "match-card";
    item.style.background = "#fff";
    item.style.padding = "12px";
    item.style.margin = "8px 0";
    item.style.borderRadius = "8px";
    item.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";

    const title = document.createElement("strong");
    title.textContent = `${match.home} ${match.home_score} : ${match.away_score} ${match.away}`;
    
    const info = document.createElement("div");
    info.style.fontSize = "12px";
    info.style.color = "#666";
    info.textContent = `${groupName(match.league)} · Сана: ${match.match_date}`;

    item.append(title, info);
    container.appendChild(item);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initializeSupabase();
  loadData();

  $("#addTeamBtn")?.addEventListener("click", addTeam);
  
  // Тугмаи санҷиши коди админ агар дар дизайн бошад
  const codeInputBtn = $("#applyAdminCodeBtn");
  codeInputBtn?.addEventListener("click", () => {
    const code = $("#adminCodeInput")?.value.trim();
    loginWithCode(code);
  });
});
