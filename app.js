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

  container.innerHTML=list.map(t=>`
    <div class="match-card team-card" data-team="${t.id}" style="cursor:pointer">
      <h4>${escapeHTML(t.name)}</h4>
      <p>Открыть команду →</p>
    </div>
  `).join("");

  container.querySelectorAll(".team-card").forEach(card=>{
    card.onclick=()=>openTeam(card.dataset.team);
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
        <p>${escapeHTML(teamName(m.home))} — ${escapeHTML(teamName(m.away))}</p>
        <h3>${m.homeScore} : ${m.awayScore}</h3>
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

  container.innerHTML=list.map(m=>matchHTML(m)).join("");
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

// Системаи рейтинги аз сифр (0) бо стрелкаҳои кабуд/сабз ва сурх
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
        points -= 1; // Барои бохт минус хол
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
    let badgeColor = "#007aff"; // Ранги кабуд барои холҳои муътадил/мусбат
    let arrow = "▲";
    
    if(t.points > 0){
      badgeColor = "#007aff"; // Кабуд бо стрелкаи боло
      arrow = "▲";
    } else if(t.points < 0){
      badgeColor = "#ff3b30"; // Сурх бо стрелкаи поён (минус)
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

      <label style="font-size:12px; color:var(--text-muted); margin-top:8px; display:block;">Хозяева</label>
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
  updateMatchTeamSelectors();
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
  const isLive = status === "live";

  if((isFinished || isLive) && (homeScore === "" || awayScore === "")) {
    return alert("Лутфан ҳисоби бозиро ворид кунед!");
  }

  let existingMatch = matches.find(m => m.league === league && ((m.home === home && m.away === away) || (m.home === away && m.away === home)));

  const matchData = {
    id: existingMatch ? existingMatch.id : String(Date.now()),
    league,
    home,
    away,
    homeScore: homeScore !== "" ? Number(homeScore) : 0,
    awayScore: awayScore !== "" ? Number(awayScore) : 0,
    finished: isFinished,
    live: isLive,
    date: selectedDate.toLocaleDateString(language==="tg"?"tg-TJ":"ru-RU",{day:"numeric",month:"long",year:"numeric"})
  };

  if(existingMatch){
    const index = matches.findIndex(m => m.id === existingMatch.id);
    matches[index] = matchData;
  } else {
    matches.push(matchData);
  }

  el("homeScoreInput").value = "";
  el("awayScoreInput").value = "";
  saveData();
  renderAll();
  alert("Матч ва ҳисоби он бомуваффақият илова/навсозӣ шуд!");
}

function renderAdminMatches(){
  const container = el("adminMatches");
  if(!container) return;

  const list = matches.filter(m => isMaster() || m.league === currentAdmin);
  if(!list.length){
    container.innerHTML = '<div class="empty-state" style="padding:15px; font-size:13px;">Матчей пока нет</div>';
    return;
  }

  container.innerHTML = list.map(m => `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; background:var(--bg-main); padding:10px; border-radius:8px; border:1px solid var(--border-color);">
      <div>
        <strong style="font-size:13px;">${escapeHTML(teamName(m.home))} vs ${escapeHTML(teamName(m.away))}</strong>
        <p style="margin:2px 0 0 0; font-size:12px; color:var(--text-muted);">Шот: ${m.homeScore} : ${m.awayScore} | Ҳолат: ${m.live ? 'LIVE' : (m.finished ? 'Ба охир расида' : 'Предстоящие')}</p>
      </div>
      <button class="delete-match-btn" data-id="${m.id}" style="padding:6px 10px; background:#ffe8e8; color:#d32f2f; border:none; border-radius:6px; cursor:pointer; font-size:12px;">Удалить</button>
    </div>
  `).join("");

  container.querySelectorAll(".delete-match-btn").forEach(btn => {
    btn.onclick = () => deleteMatch(btn.dataset.id);
  });
}

function deleteMatch(id){
  const m = matches.find(x => x.id === id);
  if(!m || !allowedLeague(m.league)) return;
  if(!confirm("Удалить матч?")) return;

  matches = matches.filter(x => x.id !== id);
  saveData();
  renderAll();
}

function renderAdminTeams(){
  const container=el("adminTeams");
  if(!container)return;

  const list=teams.filter(t=>isMaster()||t.league===currentAdmin);
  if(!list.length){
    container.innerHTML='<div class="empty-state">Команды пока не добавлены</div>';
    return;
  }

  container.innerHTML=list.map(t=>`
    <div class="admin-team-item">
      <span>${escapeHTML(t.name)}</span>
      <button class="secondary-btn edit-team" data-id="${t.id}">✏️</button>
      <button class="delete-btn" data-id="${t.id}">Удалить</button>
    </div>
  `).join("");

  container.querySelectorAll(".edit-team").forEach(btn=>{
    btn.onclick=()=>editTeam(btn.dataset.id);
  });

  container.querySelectorAll(".delete-btn").forEach(btn=>{
    btn.onclick=()=>deleteTeam(btn.dataset.id);
  });
}

function addTeam(){
  if(!isAdmin())return alert("Войдите как администратор");

  const name=el("teamName").value.trim();
  const league=el("adminLeague").value;

  if(!name)return alert("Введите название команды");
  if(!allowedLeague(league))return alert("Нет доступа к этому разделу");
  if(teams.some(t=>t.league===league&&t.name.toLowerCase()===name.toLowerCase()))
    return alert("Такая команда уже существует");

  teams.push({id:String(Date.now()),name,league});
  el("teamName").value="";
  saveData();
  renderAll();
}

function editTeam(id){
  const t=teams.find(x=>x.id===id);
  if(!t||!allowedLeague(t.league))return;

  const name=prompt("Новое название команды:",t.name);
  if(name===null)return;
  const clean=name.trim();
  if(!clean)return alert("Название не может быть пустым");

  t.name=clean;
  saveData();
  renderAll();
}

function deleteTeam(id){
  const t=teams.find(x=>x.id===id);
  if(!t||!allowedLeague(t.league))return;
  if(!confirm(`Удалить команду "${t.name}"?`))return;

  teams=teams.filter(x=>x.id!==id);
  saveData();
  renderAll();
}

function login(){
  const value=el("adminCodeInput").value.trim();
  if(value===MASTER_CODE){
    currentAdmin="master";
  }else{
    const found=GROUPS.find(g=>codes[g.id]===value&&value!=="");
    if(!found)return alert("Неверный код администратора");
    currentAdmin=found.id;
  }

  localStorage.setItem(STORAGE.admin,currentAdmin);
  el("adminCodeInput").value="";
  renderAdmin();
}

function logout(){
  currentAdmin="";
  localStorage.removeItem(STORAGE.admin);
  renderAdmin();
}

function renderAll(){
  renderLeagues();
  renderRating();
  renderMatches();
  renderLeagueTeams();
  renderAdmin();
}

function setupNavigation(){
  document.querySelectorAll(".nav-item").forEach(btn=>{
    btn.onclick=()=>setPage(btn.dataset.page);
  });

  if(el("addTeamBtn"))el("addTeamBtn").onclick=addTeam;
  if(el("applyAdminCodeBtn"))el("applyAdminCodeBtn").onclick=login;
  if(el("logoutBtn"))el("logoutBtn").onclick=logout;

  if(el("backToLeagues"))el("backToLeagues").onclick=()=>setPage("leaguesPage");

  document.querySelectorAll(".tab").forEach(btn=>{
    btn.onclick=()=>{
      document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      matchFilter=btn.dataset.filter;
      renderMatches();
    };
  });

  if(el("searchBtn"))el("searchBtn").onclick=()=>{
    el("searchPanel").classList.toggle("hidden");
    el("searchInput").focus();
  };

  if(el("closeSearch"))el("closeSearch").onclick=()=>{
    el("searchPanel").classList.add("hidden");
  };

  if(el("searchInput"))el("searchInput").oninput=()=>{
    const q=el("searchInput").value.trim().toLowerCase();
    document.querySelectorAll(".league-card").forEach(card=>{
      card.style.display=card.textContent.toLowerCase().includes(q)?"flex":"none";
    });
    document.querySelectorAll(".match-card").forEach(card=>{
      card.style.display=card.textContent.toLowerCase().includes(q)?"block":"none";
    });
  };

  if(el("settingsBtn"))el("settingsBtn").onclick=()=>{
    el("settingsModal").classList.remove("hidden");
  };

  if(el("closeSettings"))el("closeSettings").onclick=()=>{
    el("settingsModal").classList.add("hidden");
  };

  if(el("languageSelect"))el("languageSelect").onchange=()=>{
    language=el("languageSelect").value;
    localStorage.setItem(STORAGE.language,language);
    renderAll();
  };

  if(el("themeSelect"))el("themeSelect").onchange=()=>{
    const theme=el("themeSelect").value;
    document.body.classList.toggle("dark",theme==="dark");
    localStorage.setItem(STORAGE.theme,theme);
  };

  if(el("prevDate"))el("prevDate").onclick=()=>{
    selectedDate.setDate(selectedDate.getDate()-1);
    updateDate();
  };

  if(el("nextDate"))el("nextDate").onclick=()=>{
    selectedDate.setDate(selectedDate.getDate()+1);
    updateDate();
  };
}

function updateDate(){
  if(el("currentDate")){
    el("currentDate").textContent=selectedDate.toLocaleDateString(language==="tg"?"tg-TJ":"ru-RU",{
      day:"numeric",month:"long",year:"numeric"
    });
  }
}

function init(){
  setupNavigation();

  const theme=localStorage.getItem(STORAGE.theme)||"light";
  document.body.classList.toggle("dark",theme==="dark");
  if(el("themeSelect"))el("themeSelect").value=theme;
  if(el("languageSelect"))el("languageSelect").value=language;

  updateDate();
  renderAll();
  setPage("leaguesPage");
}

document.addEventListener("DOMContentLoaded",init);
