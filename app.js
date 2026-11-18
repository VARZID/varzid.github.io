const GROUPS = [
  {id:"higher",ru:"Высшая лига Фархора",tg:"Лигаи олии Фархор"},
  {id:"district",ru:"Лига района Фархора",tg:"Лигаи ноҳияи Фархор"},
  {id:"east",ru:"Восток",tg:"Шарқ"},
  {id:"west",ru:"Запад",tg:"Ғарб"},
  {id:"north",ru:"Север",tg:"Шимол"},
  {id:"south",ru:"Юг",tg:"Ҷануб"},
  {id:"cup",ru:"Кубок Фархора",tg:"Ҷоми Фархор"},
  {id:"friendly",ru:"Товарищеские матчи",tg:"Бозиҳои дӯстона"}
];

const REGIONAL_TITLE = {
  ru:"Сельский регион Фархора",
  tg:"Деҳот — Регион Фархора"
};

const MASTER_CODE = "admin5";

const DEFAULT_CODES = {
  higher:"1111",
  district:"2222",
  east:"3333",
  west:"4444",
  north:"5555",
  south:"6666",
  cup:"7777",
  friendly:"8888"
};

const STORAGE = {
  teams:"varzid_score_teams",
  matches:"varzid_score_matches",
  codes:"varzid_score_codes",
  language:"varzid_score_language",
  theme:"varzid_score_theme",
  admin:"varzid_score_admin"
};

let teams = JSON.parse(localStorage.getItem(STORAGE.teams) || "[]");
let matches = JSON.parse(localStorage.getItem(STORAGE.matches) || "[]");
let codes = JSON.parse(localStorage.getItem(STORAGE.codes) || "null") || {...DEFAULT_CODES};
let currentAdmin = localStorage.getItem(STORAGE.admin) || "";
let currentLeague = null;
let selectedDate = new Date();
let language = localStorage.getItem(STORAGE.language) || "ru";
let matchFilter = "all";

function saveData(){
  localStorage.setItem(STORAGE.teams,JSON.stringify(teams));
  localStorage.setItem(STORAGE.matches,JSON.stringify(matches));
  localStorage.setItem(STORAGE.codes,JSON.stringify(codes));
}

function el(id){
  return document.getElementById(id);
}

function escapeHTML(value){
  return String(value ?? "").replace(/[&<>"']/g,m=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]));
}

function groupName(id){
  const g=GROUPS.find(x=>x.id===id);
  if(!g)return id;
  return language==="tg"?g.tg:g.ru;
}

function isMaster(){
  return currentAdmin==="master";
}

function isAdmin(){
  return currentAdmin!=="";
}

function allowedLeague(id){
  return isMaster() || currentAdmin===id;
}

function setPage(pageId){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  const page=el(pageId);
  if(page)page.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(b=>{
    b.classList.toggle("active",b.dataset.page===pageId);
  });

  if(pageId==="leaguesPage")renderLeagues();
  if(pageId==="matchesPage")renderMatches();
  if(pageId==="ratingPage")renderRating();
  if(pageId==="profilePage")renderAdmin();
}

function renderLeagues(){
  const container=el("leaguesContainer");
  if(!container)return;

  function card(g,i){
    const count=teams.filter(t=>t.league===g.id).length;
    return `
      <div class="league-card" data-league="${g.id}">
        <div class="league-number">${String(i).padStart(2,"0")}</div>
        <div>
          <h4>${escapeHTML(groupName(g.id))}</h4>
          <p>${count} команд</p>
        </div>
      </div>`;
  }

  const higher=GROUPS.find(g=>g.id==="higher");
  const district=GROUPS.find(g=>g.id==="district");
  const east=GROUPS.find(g=>g.id==="east");
  const west=GROUPS.find(g=>g.id==="west");
  const north=GROUPS.find(g=>g.id==="north");
  const south=GROUPS.find(g=>g.id==="south");
  const cup=GROUPS.find(g=>g.id==="cup");
  const friendly=GROUPS.find(g=>g.id==="friendly");

  container.innerHTML=
    card(higher,1)+
    card(district,2)+
    `<div class="regional-heading">
      <h3>${escapeHTML(REGIONAL_TITLE[language]||REGIONAL_TITLE.ru)}</h3>
    </div>`+
    card(east,3)+
    card(west,4)+
    card(north,5)+
    card(south,6)+
    card(cup,7)+
    card(friendly,8);

  container.querySelectorAll(".league-card").forEach(card=>{
    card.onclick=()=>openLeague(card.dataset.league);
  });
}

function openLeague(id){
  currentLeague=id;
  const titleEl = el("leagueTitle");
  if(titleEl) titleEl.textContent=groupName(id);
  renderLeagueTeams();
  renderLeagueMatches();
  setPage("leagueDetailsPage");
}

function renderLeagueTeams(){
  const container=el("leagueTeams");
  if(!container)return;

  const list=teams.filter(t=>t.league===currentLeague);

  if(!list.length){
    container.innerHTML='<div class="empty-state">Команды пока не добавлены</div>';
    return;
  }

  if(currentLeague === "cup"){
    container.innerHTML=`
      <div class="panel" style="margin-bottom: 15px; background: var(--bg-card); border-radius: 8px; padding: 15px;">
        <h3 style="margin-bottom: 10px; color: var(--text-main);">🏆 Марҳилаҳои Ҷоми Фархор (Кубок)</h3>
        <p style="font-size: 13px; color: var(--text-muted);">Бозиҳои плей-офф ва баромадан ба марҳилаи навбатӣ.</p>
      </div>
      <div class="table-wrap" style="margin-top: 10px;">
        <table style="width: 100%; border-collapse: collapse; background: var(--bg-card); border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: var(--bg-main); text-align: left; font-size: 12px; color: var(--text-muted);">
              <th style="padding: 10px;">№</th>
              <th style="padding: 10px;">Дастаи иштирокчии Кубок</th>
              <th style="padding: 10px; text-align: center;">И</th>
            </tr>
          </thead>
          <tbody>
            ${list.map((t, index) => `
              <tr class="league-team-row" data-team="${t.id}" style="border-bottom: 1px solid var(--border-color); cursor: pointer;">
                <td style="padding: 10px; font-weight: bold; font-size: 13px;">${index + 1}</td>
                <td style="padding: 10px; font-weight: 500; font-size: 14px;">${escapeHTML(t.name)}</td>
                <td style="padding: 10px; text-align: center; font-size: 13px;">${matches.filter(m => m.finished && m.league === "cup" && (m.home === t.id || m.away === t.id)).length}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;
  } else {
    container.innerHTML=`
      <div class="table-wrap" style="margin-top: 10px;">
        <table style="width: 100%; border-collapse: collapse; background: var(--bg-card); border-radius: 8px; overflow: hidden;">
          <thead>
            <tr style="background: var(--bg-main); text-align: left; font-size: 12px; color: var(--text-muted);">
              <th style="padding: 10px;">№</th>
              <th style="padding: 10px;">Команда</th>
              <th style="padding: 10px; text-align: center;">И</th>
              <th style="padding: 10px; text-align: center;">О</th>
            </tr>
          </thead>
          <tbody>
            ${list.map((t, index) => {
              const played = matches.filter(m => m.finished && (m.home === t.id || m.away === t.id));
              let points = 0;
              played.forEach(m => {
                const isHome = m.home === t.id;
                const gf = Number(isHome ? m.homeScore : m.awayScore);
                const ga = Number(isHome ? m.awayScore : m.homeScore);
                if(gf > ga) points += 3;
                else if(gf === ga) points += 1;
              });

              return `
                <tr class="league-team-row" data-team="${t.id}" style="border-bottom: 1px solid var(--border-color); cursor: pointer;">
                  <td style="padding: 10px; font-weight: bold; font-size: 13px;">${index + 1}</td>
                  <td style="padding: 10px; font-weight: 500; font-size: 14px;">${escapeHTML(t.name)}</td>
                  <td style="padding: 10px; text-align: center; font-size: 13px;">${played.length}</td>
                  <td style="padding: 10px; text-align: center; font-weight: bold; font-size: 14px; color: #007aff;">${points}</td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  container.querySelectorAll(".league-team-row").forEach(row=>{
    row.onclick=()=>openTeam(row.dataset.team);
  });
}

function openTeam(id){
  const team=teams.find(t=>t.id===id);
  if(!team)return;

  const played=matches.filter(m=>m.finished&&(m.home===id||m.away===id));
  let wins=0,draws=0,losses=0,points=0,goals=0,against=0;

  played.forEach(m=>{
    const isHome=m.home===id;
    const gf=Number(isHome?m.homeScore:m.awayScore);
    const ga=Number(isHome?m.awayScore:m.homeScore);
    goals+=gf;
    against+=ga;
    if(gf>ga){wins++;points+=3;}
    else if(gf===ga){draws++;points++;}
    else losses++;
  });

  el("leagueTeams").innerHTML=`
    <button class="back-btn" id="teamBack">← Назад</button>
    <div class="panel">
      <h2>${escapeHTML(team.name)}</h2>
      <p>${escapeHTML(groupName(team.league))}</p>
      <div class="section-header"><h3>Статистика</h3></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>И</th><th>В</th><th>Н</th><th>П</th><th>Г</th><th>О</th></tr></thead>
          <tbody><tr>
            <td>${played.length}</td><td>${wins}</td><td>${draws}</td>
            <td>${losses}</td><td>${goals}:${against}</td><td>${points}</td>
          </tr></tbody>
        </table>
      </div>
    <h3 style="margin-top:20px">Матчи</h3>
    ${played.length?played.map(m=>`
      <div class="match-card">
        <p>${escapeHTML(teamName(m.home))} —${escapeHTML(teamName(m.away))}</p>
        <h3>${m.homeScore} :${m.awayScore}</h3>
      </div>
    `).join(""):'<div class="empty-state">Матчей пока нет</div>'}
    </div>`;

  el("teamBack").onclick=()=>renderLeagueTeams();
}

function teamName(id){
  const t=teams.find(x=>x.id===id);
  return t?t.name:"Команда";
}

function renderLeagueMatches(){
  const container=el("leagueMatches");
  if(!container)return;

  const list=matches.filter(m=>m.league===currentLeague);
  if(!list.length){
    container.innerHTML='<div class="empty-state">Матчей пока нет</div>';
    return;
  }

  const activeOrUpcoming = list.filter(m => !m.finished);
  const finishedMatches = list.filter(m => m.finished);

  let html = activeOrUpcoming.map(m => matchHTML(m)).join("");

  if(finishedMatches.length > 0) {
    html += `
      <div style="margin-top: 15px;">
        <button onclick="toggleFinishedMatches()" style="width: 100%; padding: 10px; background: #e2e8f0; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; color: #333;">
          📜 Бозиҳои анҷомёфта (${finishedMatches.length}) ▾
        </button>
        <div id="leagueFinishedBox" style="display: none; margin-top: 8px;">
          ${finishedMatches.map(m => matchHTML(m)).join("")}
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

function toggleFinishedMatches() {
  const box = el('leagueFinishedBox');
  if(box){
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
  }
}

function matchHTML(m){
  let scoreText = m.finished ? `${m.homeScore} : ${m.awayScore}` : "— : —";
  if(m.live){
    scoreText = `<span style="color: #ff3b30; font-weight: bold;">● LIVE (${m.homeScore} : ${m.awayScore})</span>`;
  }

  return `
    <div class="match-card" style="${m.live ? 'border: 1px solid #ff3b30;' : ''}">
      <p>${escapeHTML(groupName(m.league))}</p>
      <h4>${escapeHTML(teamName(m.home))} — ${escapeHTML(teamName(m.away))}</h4>
      <h3 style="margin: 6px 0;">${scoreText}</h3>
      <p>${escapeHTML(m.date||"")}</p>
    </div>`;
}

function renderMatches(){
  const container=el("matchesList");
  if(!container)return;

  let list=[...matches];

  if(matchFilter==="finished")list=list.filter(m=>m.finished);
  if(matchFilter==="upcoming")list=list.filter(m=>!m.finished);
  if(matchFilter==="live")list=list.filter(m=>m.live);

  if(!list.length){
    container.innerHTML='<div class="empty-state">Пока нет матчей</div>';
    return;
  }

  container.innerHTML=list.map(m=>matchHTML(m)).join("");
}

function calculateRating(){
  const uniqueTeamsMap = new Map();

  teams.forEach(t => {
    let rawName = t.name ? t.name.trim().toLowerCase().replace(/\s+/g, ' ') : "";
    let baseKey = rawName.replace(/^фк\s+/, '');

    if(!uniqueTeamsMap.has(baseKey)){
      uniqueTeamsMap.set(baseKey, {
        ...t,
        name: t.name.trim(),
        originalIds: [t.id],
        played: 0, wins: 0, draws: 0, losses: 0,
        goals: 0, against: 0, gd: 0, points: 0
      });
    } else {
      uniqueTeamsMap.get(baseKey).originalIds.push(t.id);
    }
  });

  const ratingList = Array.from(uniqueTeamsMap.values()).map(t => {
    const played = matches.filter(m => (m.finished || m.live) && (t.originalIds.includes(m.home) || t.originalIds.includes(m.away)));
    let wins = 0, draws = 0, losses = 0, goals = 0, against = 0;
    let points = 0;

    played.forEach(m => {
      const isHome = t.originalIds.includes(m.home);
      const gf = Number(isHome ? m.homeScore : m.awayScore);
      const ga = Number(isHome ? m.awayScore : m.homeScore);

      goals += gf;
      against += ga;

      if(gf > ga){ 
        wins++; 
        points += 3; 
      } else if(gf === ga){ 
        draws++; 
        points += 1; 
      } else { 
        losses++; 
        points -= 1; 
      }
    });

    return {
      ...t,
      played: played.length,
      wins,
      draws,
      losses,
      goals,
      against,
      gd: goals - against,
      points: points
    };
  });

  return ratingList.sort((a,b) =>
    b.points - a.points || b.gd - a.gd || b.goals - a.goals || a.name.localeCompare(b.name)
  );
}

function renderRating(){
  const tbody=el("ratingTable");
  const empty=el("ratingEmpty");
  if(!tbody)return;

  const rating=calculateRating();
  tbody.innerHTML=rating.map((t,i)=>{
    let badgeColor = "#007aff";
    let arrow = "▲";
    
    if(t.points > 0){
      badgeColor = "#007aff";
      arrow = "▲";
    } else if(t.points < 0){
      badgeColor = "#ff3b30";
      arrow = "▼";
    } else {
      badgeColor = "#8e8e93";
      arrow = "•";
    }

    return `
      <tr>
        <td>${i+1}</td>
        <td>${escapeHTML(t.name)}</td>
        <td>${t.played}</td>
        <td>
          <strong style="color: ${badgeColor};">
            ${arrow} ${t.points}
          </strong>
        </td>
      </tr>
    `;
  }).join("");

  if(empty)empty.style.display=rating.length?"none":"block";
}

function renderAdmin(){
  const role=el("adminRole");
  const panel=el("adminPanel");
  const codeInput=el("adminCodeInput");
  const loginBtn=el("applyAdminCodeBtn");
  const logoutBtn=el("logoutBtn");

  if(role)role.textContent=isMaster()?"Главный администратор":currentAdmin?groupName(currentAdmin)+" — администратор":"Гость";
  if(panel)panel.classList.toggle("hidden",!isAdmin());

  if(codeInput)codeInput.style.display=isAdmin()?"none":"block";
  if(loginBtn)loginBtn.style.display=isAdmin()?"none":"block";
  if(logoutBtn)logoutBtn.style.display=isAdmin()?"block":"none";

  if(isAdmin()){
    buildAdminControls();
    renderAdminTeams();
    updateMatchTeamSelectors();
    renderAdminMatches();
  }
}

function buildAdminControls(){
  const panel=el("adminPanel");
  if(!panel)return;

  let matchControlBox = el("adminMatchManagerBox");
  if(!matchControlBox){
    matchControlBox = document.createElement("div");
    matchControlBox.id = "adminMatchManagerBox";
    matchControlBox.innerHTML = `
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">
      <h3>Управление матчами и счетом</h3>
      
      <label style="font-size:12px; color:var(--text-muted);">Лига матча</label>
      <select id="matchLeagueSelect"></select>

      <div style="background: var(--bg-main); padding: 12px; border-radius: 8px; margin-top: 10px; border: 1px solid var(--border-color);">
        <h4 style="margin-bottom: 8px; font-size: 13px;">🎲 Жеребьевка ва тақвими худкор</h4>
        <label style="font-size:11px; color:var(--text-muted);">Муҳлати мусобиқа (моҳҳо)</label>
        <select id="seasonDuration" style="margin-bottom: 8px;">
          <option value="1">1 моҳ</option>
          <option value="2">2 моҳ</option>
          <option value="3" selected>3 моҳ</option>
          <option value="5">5 моҳ</option>
        </select>
        <button class="secondary-btn" id="generateScheduleBtn" style="width: 100%; font-size: 12px; background: #0284c7; color: #fff;">
          ⚡ Сохтани тақвими худкор (Жеребьевка)
        </button>
      </div>

      <label style="font-size:12px; color:var(--text-muted); margin-top:12px; display:block;">Хозяева</label>
      <select id="matchHomeTeam">
        <option value="">Выберите команду</option>
      </select>

      <label style="font-size:12px; color:var(--text-muted); margin-top:8px; display:block;">Гости</label>
      <select id="matchAwayTeam">
        <option value="">Выберите команду</option>
      </select>

      <div style="display: flex; gap: 10px; margin-top: 10px;">
        <input id="homeScoreInput" type="number" placeholder="Гол Хозяева" style="margin-bottom: 0;">
        <input id="awayScoreInput" type="number" placeholder="Гол Гости" style="margin-bottom: 0;">
      </div>

      <label style="font-size:12px; color:var(--text-muted); margin-top:8px; display:block;">Статус матча</label>
      <select id="matchStatusSelect" style="margin-bottom: 10px;">
        <option value="upcoming">Предстоящие</option>
        <option value="live">● LIVE</option>
        <option value="finished">Завершённые</option>
      </select>

      <button class="primary-btn" id="addMatchBtn">
        + Добавить / Обновить матч
      </button>

      <div id="adminMatches" style="margin-top: 15px;"></div>
    `;
    panel.appendChild(matchControlBox);
  }

  let codeBox=el("adminCodeManager");
  if(!codeBox){
    codeBox=document.createElement("div");
    codeBox.id="adminCodeManager";
    panel.appendChild(codeBox);
  }

  codeBox.innerHTML="";

  if(isMaster()){
    codeBox.innerHTML=`
      <hr style="margin: 20px 0; border: 0; border-top: 1px solid var(--border-color);">
      <div class="panel" style="background:var(--bg-main);">
        <h3>Коды администраторов</h3>
        ${GROUPS.map(g=>`
          <label style="font-size:13px; display:block; margin-top:6px;">${escapeHTML(groupName(g.id))}</label>
          <input class="admin-code" data-code="${g.id}" value="${escapeHTML(codes[g.id]||"")}" type="text">
        `).join("")}
        <button class="primary-btn" id="saveCodes" style="margin-top:10px;">Сохранить коды</button>
      </div>`;

    el("saveCodes").onclick=()=>{
      document.querySelectorAll(".admin-code").forEach(input=>{
        codes[input.dataset.code]=input.value.trim();
      });
      saveData();
      alert("Коды сохранены");
    };
  }

  const select=el("adminLeague");
  if(select && !select.dataset.initialized){
    select.innerHTML=GROUPS
      .filter(g=>isMaster()||g.id===currentAdmin)
      .map(g=>`<option value="${g.id}">${escapeHTML(groupName(g.id))}</option>`)
      .join("");
    select.dataset.initialized = "true";
  }

  const matchLeagueSelect = el("matchLeagueSelect");
  if(matchLeagueSelect){
    matchLeagueSelect.innerHTML=GROUPS
      .filter(g=>isMaster()||g.id===currentAdmin)
      .map(g=>`<option value="${g.id}">${escapeHTML(groupName(g.id))}</option>`)
      .join("");
    
    matchLeagueSelect.onchange = updateMatchTeamSelectors;
  }

  if(el("addMatchBtn")) el("addMatchBtn").onclick = addMatch;
  if(el("generateScheduleBtn")) el("generateScheduleBtn").onclick = generateAutoSchedule;
  updateMatchTeamSelectors();
}

function generateAutoSchedule(){
  if(!isAdmin()) return alert("Войдите как администратор");

  const league = el("matchLeagueSelect").value;
  if(!league) return alert("Лутфан лигаро интихоб кунед!");

  const leagueTeams = teams.filter(t => t.league === league);
  if(leagueTeams.length < 2) return alert("Барои жеребьевка камасташ 2 команда лозим аст!");

  const durationMonths = parseInt(el("seasonDuration").value) || 3;
  
  if(!confirm(`Оё мехоҳед барои лигаи "${groupName(league)}" бо муҳлати ${durationMonths} моҳ жеребьевка гузаронида, тақвим созед?`)) return;

  matches = matches.filter(m => m.league !== league);

  let shuffled = [...leagueTeams].sort(() => Math.random() - 0.5);
  let generatedCount = 0;
  let baseDate = new Date();

  for(let i = 0; i < shuffled.length; i++){
    for(let j = i + 1; j < shuffled.length; j++){
      let matchDate = new Date(baseDate);
      matchDate.setDate(matchDate.getDate() + (generatedCount * Math.floor((durationMonths * 30) / (shuffled.length * (shuffled.length - 1) / 2))));

      matches.push({
        id: String(Date.now() + Math.random()),
        league,
        home: shuffled[i].id,
        away: shuffled[j].id,
        homeScore: 0,
        awayScore: 0,
        finished: false,
        live: false,
        date: matchDate.toLocaleDateString(language==="tg"?"tg-TJ":"ru-RU",{day:"numeric",month:"long",year:"numeric"})
      });
      generatedCount++;
    }
  }

  saveData();
  renderAll();
  alert(`Жеребьевка бомуваффақият гузашт! ${generatedCount} бозӣ ба тақвим илова шуд.`);
}

function updateMatchTeamSelectors(){
  const leagueSelect = el("matchLeagueSelect");
  const homeSelect = el("matchHomeTeam");
  const awaySelect = el("matchAwayTeam");
  if(!leagueSelect || !homeSelect || !awaySelect) return;

  const selectedLeagueId = leagueSelect.value;
  const leagueTeams = teams.filter(t => t.league === selectedLeagueId);

  const optionsHTML = `<option value="">Выберите команду</option>` + leagueTeams.map(t => `<option value="${t.id}">${escapeHTML(t.name)}</option>`).join("");
  
  homeSelect.innerHTML = optionsHTML;
  awaySelect.innerHTML = optionsHTML;
}

function addMatch(){
  if(!isAdmin())return alert("Войдите как администратор");

  const league = el("matchLeagueSelect").value;
  const home = el("matchHomeTeam").value;
  const away = el("matchAwayTeam").value;
  const homeScore = el("homeScoreInput").value;
  const awayScore = el("awayScoreInput").value;
  const status = el("matchStatusSelect").value;

  if(!league)return alert("Выберите лигу");
  if(!home || !away)return alert("Выберите обе команды");
  if(home === away)return alert("Команды не могут совпадать");
  if(!allowedLeague(league))return alert("Нет доступа к этой лиге");

  const isFinished = status === "finished";
  const is
