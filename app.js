
const LEAGUES = [
  "Лигаи дуюми шаҳрак",
  "Деҳшарқ",
  "Деҳшимол",
  "Деҳҷануб",
  "Деҳғарб",
  "Лигаи олии шаҳрак"
];

const today = new Date();
let selectedDate = new Date(today);
let currentFilter = "all";

const matches = [
  {league:LEAGUES[0],home:"Истиқлол",away:"Равшан",score:"2 : 1",status:"live",minute:"68′"},
  {league:LEAGUES[1],home:"Сомон",away:"Наврӯз",score:"— : —",status:"upcoming",minute:"15:00"},
  {league:LEAGUES[2],home:"Фархор",away:"Вахш",score:"3 : 0",status:"finished",minute:"Завершён"},
  {league:LEAGUES[3],home:"Пахтакор",away:"Дӯстӣ",score:"— : —",status:"upcoming",minute:"17:00"}
];

const ranking = [
  {name:"Истиқлол",points:0},
  {name:"Равшан",points:0},
  {name:"Сомон",points:0},
  {name:"Наврӯз",points:0},
  {name:"Фархор",points:0}
];

const matchesBox = document.getElementById("matches");
const dateLabel = document.getElementById("dateLabel");

function showDate() {
  dateLabel.textContent = selectedDate.toLocaleDateString("ru-RU", {
    day:"numeric",month:"long",year:"numeric"
  });
}

function renderMatches() {
  const visible = matches.filter(m =>
    currentFilter === "all" || m.status === currentFilter
  );

  matchesBox.innerHTML = visible.length ? visible.map(m => `
    <article class="match-card">
      <div class="match-league">${m.league}</div>
      <div class="match-body">
        <div class="team">${m.home}</div>
        <div class="score">${m.score}</div>
        <div class="team">${m.away}</div>
      </div>
      <div class="match-status ${m.status === "live" ? "live" : ""}">
        ${m.status === "live" ? "● LIVE · " + m.minute :
          m.status === "finished" ? "FT · " + m.minute : m.minute}
      </div>
    </article>
  `).join("") : `<p>На эту дату матчей нет.</p>`;
}

function renderRanking() {
  document.getElementById("ranking").innerHTML = ranking.map((team,i) => `
    <div class="rank-row">
      <div class="rank-left">
        <span class="rank-number">${i+1}</span>
        <b>${team.name}</b>
      </div>
      <span class="points">${team.points}</span>
    </div>
  `).join("");
}

function renderLeagues() {
  document.getElementById("leagues").innerHTML = LEAGUES.map((name,i) => `
    <button class="league-item" type="button" data-league="${i}">
      ${name} <span style="float:right">›</span>
    </button>
  `).join("");
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderMatches();
  });
});

document.getElementById("prevDay").addEventListener("click", () => {
  selectedDate.setDate(selectedDate.getDate()-1);
  showDate();
});

document.getElementById("nextDay").addEventListener("click", () => {
  selectedDate.setDate(selectedDate.getDate()+1);
  showDate();
});

document.getElementById("themeBtn").addEventListener("click", () => {
  document.body.classList.toggle("light");
});

document.getElementById("adminBtn").addEventListener("click", () => {
  document.getElementById("adminArea").hidden =
    !document.getElementById("adminArea").hidden;
});

document.getElementById("loginBtn").addEventListener("click", () => {
  document.getElementById("loginMessage").textContent =
    "Вход администратора ещё не подключён. Сначала настройте Supabase и аккаунты.";
});

showDate();
renderMatches();
renderRanking();
renderLeagues();
