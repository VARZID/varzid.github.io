// VARZID SCORE
// New application logic
// Supabase configuration

const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

const GROUPS = [
  { id: "top", tj: "Гурӯҳи олии Фархор", ru: "Высшая лига Фархора" },
  { id: "district", tj: "Гурӯҳи шаҳрак", ru: "Лига района Фархор" },
  { id: "east", tj: "Гурӯҳи Деҳ Шарқ", ru: "Восточный регион" },
  { id: "west", tj: "Гурӯҳи Деҳ Ғарб", ru: "Западный регион" },
  { id: "north", tj: "Гурӯҳи Деҳ Шимол", ru: "Северный регион" },
  { id: "south", tj: "Гурӯҳи Деҳ Ҷануб", ru: "Южный регион" }
];

let supabaseClient = null;
let currentUser = null;
let currentProfile = null;
let matches = [];
let teams = [];
let language = "tj";

const $ = (selector) => document.querySelector(selector);

function groupName(id) {
  const group = GROUPS.find(item => item.id === id);
  return group ? group[language] : id;
}

function isMainAdmin() {
  return currentProfile?.role === "super_admin";
}

function isRegionalAdmin() {
  return currentProfile?.role === "league_admin";
}

function canManageLeague(league) {
  if (isMainAdmin()) return true;
  return isRegionalAdmin() && currentProfile.league_id === league;
}

function showMessage(message) {
  alert(message);
}

function initializeSupabase() {
  if (!window.supabase) {
    console.error("Supabase library not loaded");
    return;
  }

  if (
    SUPABASE_URL === "YOUR_SUPABASE_URL" ||
    SUPABASE_ANON_KEY === "YOUR_SUPABASE_ANON_KEY"
  ) {
    console.warn("Supabase credentials are not configured.");
    return;
  }

  supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    currentUser = session?.user || null;
    loadProfile();
  });
}

async function loadProfile() {
  if (!supabaseClient || !currentUser) {
    currentProfile = null;
    updateAuth();
    return;
  }

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("role, league_id")
    .eq("id", currentUser.id)
    .single();

  if (error) {
    console.error(error);
    currentProfile = null;
  } else {
    currentProfile = data;
  }

  updateAuth();
  await loadData();
}

function updateAuth() {
  const panel = $("#adminPanel");

  if (panel) {
    panel.hidden = !(
      currentProfile &&
      ["super_admin", "league_admin"].includes(currentProfile.role)
    );
  }

  const selector = $("#adminLeague");

  if (selector) {
    selector.innerHTML = "";

    GROUPS.forEach(group => {
      if (isMainAdmin() || currentProfile?.league_id === group.id) {
        const option = document.createElement("option");
        option.value = group.id;
        option.textContent = groupName(group.id);
        selector.appendChild(option);
      }
    });

    selector.disabled = isRegionalAdmin();
  }

  const adminLabel = $("#adminRole");

  if (adminLabel && currentProfile) {
    adminLabel.textContent = isMainAdmin()
      ? "Админи асосӣ / Главный админ"
      : "Админи минтақавӣ / Региональный админ";
  }
}

async function loadData() {
  if (!supabaseClient) return;

  const [teamResult, matchResult] = await Promise.all([
    supabaseClient.from("teams").select("*").order("name"),
    supabaseClient.from("matches").select("*").order("match_date", {
      ascending: false
    })
  ]);

  if (teamResult.error) console.error(teamResult.error);
  else teams = teamResult.data || [];

  if (matchResult.error) console.error(matchResult.error);
  else matches = matchResult.data || [];

  renderTeams();
  renderMatches();
}

async function login(email, password) {
  if (!supabaseClient) return;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) showMessage("Воридшавӣ ноком шуд: " + error.message);
}

async function logout() {
  if (!supabaseClient) return;

  await supabaseClient.auth.signOut();
  currentUser = null;
  currentProfile = null;
  updateAuth();
}

async function addTeam() {
  if (!supabaseClient || !currentProfile) return;

  const name = $("#teamName")?.value.trim();
  const league = $("#adminLeague")?.value;

  if (!name || !league) {
    showMessage("Номи дастаро ворид кунед.");
    return;
  }

  if (!canManageLeague(league)) {
    showMessage("Шумо ба ин гурӯҳ иҷозат надоред.");
    return;
  }

  const { error } = await supabaseClient
    .from("teams")
    .insert({ name, league });

  if (error) {
    showMessage(error.message);
    return;
  }

  $("#teamName").value = "";
  await loadData();
}

async function editTeam(id) {
  const team = teams.find(item => item.id === id);
  if (!team || !canManageLeague(team.league)) return;

  const newName = prompt("Номи нави дастаро ворид кунед:", team.name);
  if (!newName || !newName.trim()) return;

  const { error } = await supabaseClient
    .from("teams")
    .update({ name: newName.trim() })
    .eq("id", id);

  if (error) {
    showMessage(error.message);
    return;
  }

  await loadData();
}

async function deleteTeam(id) {
  const team = teams.find(item => item.id === id);
  if (!team || !canManageLeague(team.league)) return;

  if (!confirm("Дастаро нест мекунед?")) return;

  const { error } = await supabaseClient
    .from("teams")
    .delete()
    .eq("id", id);

  if (error) {
    showMessage(error.message);
    return;
  }

  await loadData();
}

async function addMatch() {
  if (!supabaseClient || !currentProfile) return;

  const league = $("#adminLeague")?.value;
  const home = $("#homeTeam")?.value.trim();
  const away = $("#awayTeam")?.value.trim();
  const date = $("#matchDate")?.value;
  const time = $("#matchTime")?.value;

  if (!canManageLeague(league)) {
    showMessage("Шумо ба ин гурӯҳ иҷозат надоред.");
    return;
  }

  if (!home || !away || home === away || !date) {
    showMessage("Маълумоти бозиро дуруст пур кунед.");
    return;
  }

  const { error } = await supabaseClient
    .from("matches")
    .insert({
      league,
      home,
      away,
      match_date: date,
      match_time: time || null,
      status: "upcoming",
      home_score: 0,
      away_score: 0
    });

  if (error) {
    showMessage(error.message);
    return;
  }

  await loadData();
}

async function editMatch(id) {
  const match = matches.find(item => item.id === id);
  if (!match || !canManageLeague(match.league)) return;

  const homeScore = prompt("Голҳои дастаи аввал:", match.home_score ?? 0);
  if (homeScore === null) return;

  const awayScore = prompt("Голҳои дастаи дуюм:", match.away_score ?? 0);
  if (awayScore === null) return;

  if (
    !Number.isInteger(Number(homeScore)) ||
    !Number.isInteger(Number(awayScore)) ||
    Number(homeScore) < 0 ||
    Number(awayScore) < 0
  ) {
    showMessage("Ҳисоб нодуруст аст.");
    return;
  }

  const status = prompt(
    "Ҳолат: upcoming, live ё finished",
    match.status
  );

  if (!["upcoming", "live", "finished"].includes(status)) {
    showMessage("Ҳолати бозӣ нодуруст аст.");
    return;
  }

  const { error } = await supabaseClient
    .from("matches")
    .update({
      home_score: Number(homeScore),
      away_score: Number(awayScore),
      status
    })
    .eq("id", id);

  if (error) {
    showMessage(error.message);
    return;
  }

  await loadData();
}

async function deleteMatch(id) {
  if (!isMainAdmin()) {
    showMessage("Танҳо админи асосӣ метавонад бозиро нест кунад.");
    return;
  }

  if (!confirm("Бозиро пурра нест мекунед?")) return;

  const { error } = await supabaseClient
    .from("matches")
    .delete()
    .eq("id", id);

  if (error) {
    showMessage(error.message);
    return;
  }

  await loadData();
}

function renderTeams() {
  const container = $("#adminTeams");
  if (!container) return;

  container.innerHTML = "";

  teams.forEach(team => {
    if (isRegionalAdmin() && !canManageLeague(team.league)) return;

    const item = document.createElement("div");
    item.className = "admin-team-item";

    const name = document.createElement("span");
    name.textContent = `${team.name} — ${groupName(team.league)}`;

    item.appendChild(name);

    const edit = document.createElement("button");
    edit.textContent = "✏️";
    edit.onclick = () => editTeam(team.id);
    item.appendChild(edit);

    const remove = document.createElement("button");
    remove.textContent = "🗑";
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

    const title = document.createElement("strong");
    title.textContent =
      `${match.home} ${match.home_score ?? 0} : ` +
      `${match.away_score ?? 0} ${match.away}`;

    const info = document.createElement("div");
    info.textContent =
      `${groupName(match.league)} · ${match.match_date || ""}`;

    item.append(title, info);

    if (canManageLeague(match.league)) {
      const edit = document.createElement("button");
      edit.textContent = "Ислоҳи натиҷа";
      edit.onclick = () => editMatch(match.id);
      item.appendChild(edit);
    }

    if (isMainAdmin()) {
      const remove = document.createElement("button");
      remove.textContent = "Нест кардан";
      remove.onclick = () => deleteMatch(match.id);
      item.appendChild(remove);
    }

    container.appendChild(item);
  });
}

function setLanguage(value) {
  language = value === "ru" ? "ru" : "tj";
  updateAuth();
  renderTeams();
  renderMatches();
}

document.addEventListener("DOMContentLoaded", () => {
  $("#addTeamBtn")?.addEventListener("click", addTeam);
  $("#addMatchBtn")?.addEventListener("click", addMatch);
  $("#logoutBtn")?.addEventListener("click", logout);

  initializeSupabase();

  if (supabaseClient) {
    supabaseClient.auth.getSession().then(({ data }) => {
      currentUser = data.session?.user || null;
      loadProfile();
    });
  }
});
