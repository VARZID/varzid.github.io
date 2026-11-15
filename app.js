// VARZID SCORE — тоҷикӣ / русӣ, рӯз / шаб, бе дастаҳои намунавӣ
const SUPABASE_URL = "ГУЗОРЕД_SUPABASE_PROJECT_URL";
const SUPABASE_ANON_KEY = "ГУЗОРЕД_SUPABASE_ANON_KEY";

// Шаш мусобиқа. «Гурӯҳи деҳот» танҳо сарлавҳаи чор минтақа аст.
const GROUPS = [
  { key: "top", tg: "Гурӯҳи олии Фархор", ru: "Высшая лига Фархора" },
  { key: "district", tg: "Гурӯҳи шаҳрак", ru: "Лига района Фархор" },
  { key: "east", tg: "Гурӯҳи Деҳ Шарқ", ru: "Восточный регион" },
  { key: "west", tg: "Гурӯҳи Деҳ Ғарб", ru: "Западный регион" },
  { key: "north", tg: "Гурӯҳи Деҳ Шимол", ru: "Северный регион" },
  { key: "south", tg: "Гурӯҳи Деҳ Ҷануб", ru: "Южный регион" }
];

const WORDS = {
  tg: {
    eyebrow:"ФУТБОЛИ МАҲАЛЛӢ", heroTitle:"Ҳамаи бозиҳо", heroText:"Натиҷаҳо, ҷадвалҳо ва рейтинги дастаҳои Фархор",
    all:"Ҳама", upcoming:"Дар пеш", finished:"Анҷомёфта", matches:"Бозиҳо", leagues:"Лигаҳо", sixGroups:"6 лига",
    ranking:"Рейтинги умумии дастаҳо", allTeams:"Ҳамаи дастаҳо", rankingNote:"Рейтинги доимӣ баъди муайян шудани тартиби ҳисоб ва тасдиқи натиҷаҳо фаъол карда мешавад.",
    noTeams:"Ҳоло дастаҳо илова нашудаанд.", teams:"Дастаҳо", favoriteHint:"Барои интихоб кардани дастаи дӯстдошта ситораро пахш кунед",
    profile:"Ҳисоб ва идоракунӣ", guest:"Шумо ҳамчун меҳмон ворид шудаед.", email:"Почтаи электронӣ", password:"Рамз", login:"Ворид шудан", logout:"Баромадан",
    adminInfo:"Ҳисобҳои маъмуриро танҳо роҳбари асосӣ идора мекунад.", adminPanel:"Панели идоракунӣ", adminRights:"Имкониятҳо мувофиқи ҳуқуқи ҳисоби шумо дастрасанд.",
    group:"Лига", teamName:"Номи даста", addTeam:"Илова кардани даста", homeTeam:"Дастаи мизбон", awayTeam:"Дастаи меҳмон", date:"Сана", time:"Соат",
    homeGoals:"Голҳои мизбон", awayGoals:"Голҳои меҳмон", matchStatus:"Ҳолати бозӣ", saveMatch:"Сабти бозӣ", settings:"Танзимот",
    language:"Забон", languageHint:"Забони намоиши платформа", appearance:"Намуди зоҳирӣ", appearanceHint:"Рӯз ё шаб", dayMode:"Рӯз", nightMode:"Шаб",
    sound:"Садои огоҳинома", soundHint:"Фаъол ё ғайрифаъол кардани садо", soundOn:"Фаъол", soundOff:"Ғайрифаъол",
    timezone:"Минтақаи вақт", platformNote:"VARZID SCORE — платформаи мустақили футболи маҳаллӣ.", rankingShort:"Рейтинг", profileShort:"Ҳисоб",
    today:"ИМРӮЗ", live:"● LIVE", ft:"АНҶОМ", kickoff:"Оғози бозӣ", finalScore:"Натиҷаи ниҳоӣ", inProgress:"Дар ҷараён",
    noMatches:"Дар ин рӯз бозӣ ба нақша гирифта нашудааст.", matchCount:"бозӣ", qualifier:"Марҳилаи интихобӣ", finalStage:"Марҳилаи ниҳоии солона",
    ruralHeading:"Гурӯҳи деҳот", searchPrompt:"Номи даста ё минтақаеро нависед", searchTitle:"Натиҷа ёфт шуд", searchEmpty:"Чизе ёфт нашуд.",
    supabaseMissing:"Барои истифодаи ҳисоби маъмурӣ аввал Supabase-ро пайваст кунед.", loginError:"Почтаи электронӣ ё рамз нодуруст аст.", loggedIn:"Ба ҳисоб ворид шудед.",
    teamRequired:"Номи дастаро ворид кунед.", teamAdded:"Даста илова карда шуд.", matchRequired:"Номи ҳар ду даста ва санаи бозиро ворид кунед.", matchAdded:"Бозӣ сабт карда шуд.",
    cloudError:"Маълумотро бор кардан имкон нашуд.", teamLoadError:"Рӯйхати дастаҳоро бор кардан имкон нашуд.", favoriteAdded:"Даста ба дӯстдоштаҳо илова шуд.", favoriteRemoved:"Даста аз дӯстдоштаҳо хориҷ шуд."
  },
  ru: {
    eyebrow:"МЕСТНЫЙ ФУТБОЛ", heroTitle:"Все матчи", heroText:"Результаты, таблицы и рейтинг команд Фархора",
    all:"Все", upcoming:"Предстоящие", finished:"Завершённые", matches:"Матчи", leagues:"Лиги", sixGroups:"6 лиг",
    ranking:"Общий рейтинг команд", allTeams:"Все команды", rankingNote:"Постоянный рейтинг будет включён после утверждения правил начисления очков и подтверждения результатов.",
    noTeams:"Команды пока не добавлены.", teams:"Команды", favoriteHint:"Нажмите на звезду, чтобы отметить любимую команду",
    profile:"Учётная запись и управление", guest:"Вы вошли как гость.", email:"Электронная почта", password:"Пароль", login:"Войти", logout:"Выйти",
    adminInfo:"Учётными записями администраторов управляет только главный администратор.", adminPanel:"Панель управления", adminRights:"Доступные действия зависят от прав вашей учётной записи.",
    group:"Лига", teamName:"Название команды", addTeam:"Добавить команду", homeTeam:"Хозяева", awayTeam:"Гости", date:"Дата", time:"Время",
    homeGoals:"Голы хозяев", awayGoals:"Голы гостей", matchStatus:"Статус матча", saveMatch:"Сохранить матч", settings:"Настройки",
    language:"Язык", languageHint:"Язык интерфейса платформы", appearance:"Оформление", appearanceHint:"День или ночь", dayMode:"День", nightMode:"Ночь",
    sound:"Звук уведомлений", soundHint:"Включить или отключить звук", soundOn:"Включён", soundOff:"Выключен",
    timezone:"Часовой пояс", platformNote:"VARZID SCORE — независимая платформа местного футбола.", rankingShort:"Рейтинг", profileShort:"Профиль",
    today:"СЕГОДНЯ", live:"● LIVE", ft:"ЗАВЕРШЁН", kickoff:"Начало матча", finalScore:"Итоговый счёт", inProgress:"Идёт матч",
    noMatches:"На эту дату матчи не запланированы.", matchCount:"матчей", qualifier:"Отборочный этап", finalStage:"Ежегодный финальный этап",
    ruralHeading:"Сельский регион Фархора", searchPrompt:"Введите название команды или региона", searchTitle:"Найдено", searchEmpty:"Ничего не найдено.",
    supabaseMissing:"Сначала подключите Supabase для входа администратора.", loginError:"Неверная почта или пароль.", loggedIn:"Вы успешно вошли.",
    teamRequired:"Введите название команды.", teamAdded:"Команда добавлена.", matchRequired:"Укажите обе команды и дату матча.", matchAdded:"Матч сохранён.",
    cloudError:"Не удалось загрузить данные.", teamLoadError:"Не удалось загрузить список команд.", favoriteAdded:"Команда добавлена в избранное.", favoriteRemoved:"Команда удалена из избранного."
  }
};

const $ = id => document.getElementById(id);
const localISO = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;

let lang = localStorage.getItem("vs-language") === "ru" ? "ru" : "tg";
let theme = localStorage.getItem("vs-theme") === "light" ? "light" : "dark";
let soundEnabled = localStorage.getItem("vs-sound") !== "off";
let matches = [];
let teams = [];
let favorites = new Set(JSON.parse(localStorage.getItem("vs-favorite-teams") || "[]"));
let currentFilter = "all", selectedDate = new Date(), db = null, user = null, profile = null, channel = null;

const hasSupabase = SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("ГУЗОРЕД") && SUPABASE_ANON_KEY.length > 30 && !SUPABASE_ANON_KEY.includes("ГУЗОРЕД");
if (hasSupabase && window.supabase) db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const t = key => WORDS[lang][key] || key;

function toast(message) {
  const el = $("toast");
  if (!el) return;
  el.textContent = message;
  el.style.display = "block";
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.style.display = "none", 2800);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[char]));
}

function groupName(name) {
  const group = GROUPS.find(item => item.tg === name || item.ru === name || item.key === name);
  return group ? group[lang] : (name || "");
}

function applyLanguage() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    if (WORDS[lang][key]) el.textContent = t(key);
  });
  $("languageSelect").value = lang;
  renderDate();
  renderLeagues();
  renderMatches();
  renderTeams();
  updateSettingButtons();
  if (user) updateAuth();
}

function applyTheme() {
  document.body.classList.toggle("light", theme === "light");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = theme === "light" ? "#ffffff" : "#10251c";
  localStorage.setItem("vs-theme", theme);
  updateSettingButtons();
}

function updateSettingButtons() {
  $("themeBtn").textContent = theme === "dark" ? t("nightMode") : t("dayMode");
  $("themeBtn").setAttribute("aria-pressed", theme === "light" ? "true" : "false");
  $("soundBtn").textContent = soundEnabled ? t("soundOn") : t("soundOff");
  $("soundBtn").setAttribute("aria-pressed", soundEnabled ? "true" : "false");
}

function renderDate() {
  const today = localISO(new Date());
  $("dayName").textContent = localISO(selectedDate) === today
    ? t("today")
    : selectedDate.toLocaleDateString(lang === "tg" ? "tg-TJ" : "ru-RU", {weekday:"short"}).toUpperCase();
  $("dateText").textContent = selectedDate.toLocaleDateString(lang === "tg" ? "tg-TJ" : "ru-RU", {day:"2-digit",month:"long",year:"numeric"});
}

function statusLabel(match) {
  return match.status === "live" ? t("live") : match.status === "finished" ? t("ft") : t("upcoming");
}

function renderMatches() {
  const day = localISO(selectedDate);
  let list = matches.filter(match => match.date === day);
  if (currentFilter !== "all") list = list.filter(match => match.status === currentFilter);

  $("matchCount").textContent = `${list.length} ${t("matchCount")}`;

  $("matches").innerHTML = list.length ? list.map(match => `
    <article class="match-card">
      <div class="match-meta">
        <span class="league-tag">${escapeHTML(groupName(match.league))}</span>
        <span class="${match.status === "live" ? "status-live" : match.status === "finished" ? "status-finished" : ""}">${statusLabel(match)}</span>
      </div>
      <div class="teams">
        <div class="team">${escapeHTML(match.home)}</div>
        <div class="score ${escapeHTML(match.status)}">${match.status === "upcoming" ? "—" : `${match.home_score ?? 0} : ${match.away_score ?? 0}`}</div>
        <div class="team">${escapeHTML(match.away)}</div>
      </div>
      <div class="match-foot">
        <span>${match.status === "live" ? `${escapeHTML(match.minute || 1)}′ · ${t("inProgress")}` : match.status === "finished" ? t("finalScore") : t("kickoff")}</span>
        <span>${escapeHTML(match.time || "--:--")}</span>
      </div>
    </article>`).join("") : `<div class="notice">${t("noMatches")}</div>`;
}

function renderLeagues() {
  const top = GROUPS.filter(group => group.key === "top");
  const district = GROUPS.filter(group => group.key === "district");
  const rural = GROUPS.filter(group => ["east","west","north","south"].includes(group.key));

  let html = top.map(group => `
    <article class="league-card">
      <div><b>${group[lang]}</b><small>${t("finalStage")}</small></div>
      <span class="league-number">01</span>
    </article>`).join("");

  html += district.map(group => `
    <article class="league-card">
      <div><b>${group[lang]}</b><small>${t("qualifier")}</small></div>
      <span class="league-number">02</span>
    </article>`).join("");

  html += `<div class="league-divider">${t("ruralHeading")}</div>`;

  html += rural.map((group,index) => `
    <article class="league-card">
      <div><b>${group[lang]}</b><small>${t("qualifier")}</small></div>
      <span class="league-number">${String(index+3).padStart(2,"0")}</span>
    </article>`).join("");

  $("leagues").innerHTML = html;

  $("adminLeague").innerHTML = GROUPS.map(group =>
    `<option value="${escapeHTML(group.tg)}">${escapeHTML(group[lang])}</option>`
  ).join("");
}

function renderTeams() {
  const container = $("teamsList");

  if (!teams.length) {
    container.innerHTML = `<div class="notice">${t("noTeams")}</div>`;
    return;
  }

  const sorted = [...teams].sort((a,b) =>
    String(a.name).localeCompare(String(b.name), lang === "tg" ? "tg" : "ru")
  );

  container.innerHTML = sorted.map(team => {
    const id = String(team.id);
    const active = favorites.has(id);

    return `
      <article class="team-list-card">
        <div class="team-list-name">
          ${escapeHTML(team.name)}
          <small class="team-list-league">${escapeHTML(groupName(team.league))}</small>
        </div>
        <button class="favorite-btn ${active ? "active" : ""}"
          type="button"
          data-favorite-id="${escapeHTML(id)}"
          aria-label="${active ? t("favoriteRemoved") : t("favoriteAdded")}"
          aria-pressed="${active}">★</button>
      </article>`;
  }).join("");
}

function showView(id) {
  ["matchesView","leaguesView","rankingView","profileView","settingsView"].forEach(view => {
    $(view).classList.toggle("hidden", view !== id);
  });
  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle("active", button.dataset.view === id);
  });
}

// Навигатсия ва филтрҳо
document.querySelectorAll(".nav-item").forEach(button =>
  button.addEventListener("click", () => showView(button.dataset.view))
);

document.querySelectorAll(".filter").forEach(button =>
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    document.querySelectorAll(".filter").forEach(item =>
      item.classList.toggle("active", item === button)
    );
    renderMatches();
  })
);

$("prevDay").addEventListener("click", () => {
  selectedDate.setDate(selectedDate.getDate()-1);
  renderDate();
  renderMatches();
});

$("nextDay").addEventListener("click", () => {
  selectedDate.setDate(selectedDate.getDate()+1);
  renderDate();
  renderMatches();
});

$("settingsBtn").addEventListener("click", () => showView("settingsView"));

$("themeBtn").addEventListener("click", () => {
  theme = theme === "dark" ? "light" : "dark";
  applyTheme();
});

$("soundBtn").addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  localStorage.setItem("vs-sound", soundEnabled ? "on" : "off");
  updateSettingButtons();
});

$("languageSelect").addEventListener("change", event => {
  lang = event.target.value;
  localStorage.setItem("vs-language", lang);
  applyLanguage();
});

$("teamsList").addEventListener("click", event => {
  const button = event.target.closest("[data-favorite-id]");
  if (!button) return;

  const id = button.dataset.favoriteId;

  if (favorites.has(id)) {
    favorites.delete(id);
    toast(t("favoriteRemoved"));
  } else {
    favorites.add(id);
    toast(t("favoriteAdded"));
  }

  localStorage.setItem("vs-favorite-teams", JSON.stringify([...favorites]));
  renderTeams();
});

$("searchBtn").addEventListener("click", () => {
  const query = prompt(t("searchPrompt"));
  if (query === null) return;

  const term = query.trim().toLocaleLowerCase();
  if (!term) return;

  const found =
    GROUPS.some(group => `${group.tg} ${group.ru}`.toLocaleLowerCase().includes(term)) ||
    teams.some(team => String(team.name).toLocaleLowerCase().includes(term)) ||
    matches.some(match => [match.home,match.away].some(value => String(value).toLocaleLowerCase().includes(term)));

  toast(found ? t("searchTitle") : t("searchEmpty"));

  if (found) {
    showView(teams.some(team => String(team.name).toLocaleLowerCase().includes(term))
      ? "rankingView" : "matchesView");
  }
});

async function refreshFromCloud() {
  if (!db) return;

  const [matchResult, teamResult] = await Promise.all([
    db.from("matches")
      .select("id,league,home,away,match_date,match_time,status,home_score,away_score,minute")
      .order("match_date"),
    db.from("teams")
      .select("id,name,league")
      .order("name")
  ]);

  if (matchResult.error) {
    console.error(matchResult.error);
    toast(t("cloudError"));
  } else {
    matches = (matchResult.data || []).map(match => ({
      id:match.id,
      league:match.league,
      home:match.home,
      away:match.away,
      date:match.match_date,
      time:match.match_time,
      status:match.status,
      home_score:match.home_score,
      away_score:match.away_score,
      minute:match.minute
    }));
    renderMatches();
  }

  if (teamResult.error) {
    console.error(teamResult.error);
    toast(t("teamLoadError"));
  } else {
    teams = teamResult.data || [];
    renderTeams();
  }

  if (channel) db.removeChannel(channel);

  channel = db.channel("varzid-live-updates")
    .on("postgres_changes", {event:"*",schema:"public",table:"matches"}, refreshFromCloud)
    .on("postgres_changes", {event:"*",schema:"public",table:"teams"}, refreshFromCloud)
    .subscribe();
}

async function updateAuth() {
  if (!db) {
    $("authStatus").textContent = t("supabaseMissing");
    return;
  }

  const {data,error} = await db.auth.getSession();
  if (error) console.error(error);

  user = data.session?.user || null;
  $("authStatus").textContent = user ? user.email : t("guest");
  $("loginBtn").classList.toggle("hidden", !!user);
  $("logoutBtn").classList.toggle("hidden", !user);
  $("adminPanel").classList.add("hidden");
  profile = null;

  if (user) {
    const {data:record,error:profileError} = await db
      .from("profiles")
      .select("role,league_id")
      .eq("id",user.id)
      .maybeSingle();

    if (profileError) console.error(profileError);

    profile = record;

    if (profile && ["super_admin","league_admin"].includes(profile.role)) {
      $("adminPanel").classList.remove("hidden");
    }
  }
}

$("loginBtn").addEventListener("click", async () => {
  if (!db) return toast(t("supabaseMissing"));

  const {error} = await db.auth.signInWithPassword({
    email:$("email").value.trim(),
    password:$("password").value
  });

  if (error) return toast(t("loginError"));

  await updateAuth();
  toast(t("loggedIn"));
});

$("logoutBtn").addEventListener("click", async () => {
  if (!db) return;
  await db.auth.signOut();
  profile = null;
  await updateAuth();
});

$("addTeamBtn").addEventListener("click", async () => {
  if (!db || !profile) return toast(t("supabaseMissing"));

  const league = $("adminLeague").value;
  const name = $("teamName").value.trim();

  if (!name) return toast(t("teamRequired"));

  const {error} = await db.from("teams").insert({name,league});

  if (error) return toast(error.message);

  $("teamName").value = "";
  toast(t("teamAdded"));
  await refreshFromCloud();
});

$("addMatchBtn").addEventListener("click", async () => {
  if (!db || !profile) return toast(t("supabaseMissing"));

  const payload = {
    league:$("adminLeague").value,
    home:$("homeTeam").value.trim(),
    away:$("awayTeam").value.trim(),
    match_date:$("matchDate").value,
    match_time:$("matchTime").value || "16:00",
    status:$("matchStatus").value,
    home_score:$("homeScore").value === "" ? null : Number($("homeScore").value),
    away_score:$("awayScore").value === "" ? null : Number($("awayScore").value)
  };

  if (!payload.home || !payload.away || !payload.match_date) {
    return toast(t("matchRequired"));
  }

  const {error} = await db.from("matches").insert(payload);

  if (error) return toast(error.message);

  toast(t("matchAdded"));
  await refreshFromCloud();
});

// Оғози интерфейс
applyTheme();
applyLanguage();
renderDate();
renderTeams();
updateAuth();
refreshFromCloud();
