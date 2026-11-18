
"use strict";

/* ================================
   VARZID SCORE — APP.JS
================================ */

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

/* ================================
   DATA
================================ */

function loadJSON(key,fallback){
  try{
    const value=localStorage.getItem(key);
    return value===null?fallback:JSON.parse(value);
  }catch(error){
    console.error("Storage error:",key,error);
    return fallback;
  }
}

let teams=loadJSON(STORAGE.teams,[]);
let matches=loadJSON(STORAGE.matches,[]);
let codes={
  ...DEFAULT_CODES,
  ...(loadJSON(STORAGE.codes,{})||{})
};

let currentAdmin=localStorage.getItem(STORAGE.admin)||"";
let currentLeague=null;
let editingMatchId=null;
let selectedDate=new Date();
let language=localStorage.getItem(STORAGE.language)||"ru";
let matchFilter="all";

/* ================================
   BASIC FUNCTIONS
================================ */

function el(id){
  return document.getElementById(id);
}

function saveData(){
  localStorage.setItem(STORAGE.teams,JSON.stringify(teams));
  localStorage.setItem(STORAGE.matches,JSON.stringify(matches));
  localStorage.setItem(STORAGE.codes,JSON.stringify(codes));
}

function escapeHTML(value){
  return String(value??"").replace(/[&<>"']/g,m=>({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    '"':"&quot;",
    "'":"&#039;"
  }[m]));
}

function groupName(id){
  const group=GROUPS.find(g=>g.id===id);
  if(!group)return id;
  return language==="tg"?group.tg:group.ru;
}

function isMaster(){
  return currentAdmin==="master";
}

function isAdmin(){
  return currentAdmin!=="";
}

function allowedLeague(id){
  return isMaster()||currentAdmin===id;
}

function isFinished(m){
  return m.finished===true||m.status==="finished";
}

function isLive(m){
  return !isFinished(m)&&(m.live===true||m.status==="live");
}

function matchStatus(m){
  if(isFinished(m))return "finished";
  if(isLive(m))return "live";
  return "upcoming";
}

function localDateString(date){
  const y=date.getFullYear();
  const m=String(date.getMonth()+1).padStart(2,"0");
  const d=String(date.getDate()).padStart(2,"0");
  return `${y}-${m}-${d}`;
}

/* ================================
   NAVIGATION
================================ */

function setPage(pageId){
  document.querySelectorAll(".page").forEach(page=>{
    page.classList.remove("active");
  });

  const page=el(pageId);
  if(page)page.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(button=>{
    button.classList.toggle(
      "active",
      button.dataset.page===pageId
    );
  });

  if(pageId==="matchesPage")renderMatches();
  if(pageId==="ratingPage")renderRating();
  if(pageId==="profilePage")renderAdmin();
}

/* ================================
   LEAGUES
================================ */

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
      </div>
    `;
  }

  container.innerHTML=
    card(GROUPS[0],1)+
    card(GROUPS[1],2)+
    `<div class="regional-heading">
      <h3>${escapeHTML(REGIONAL_TITLE[language]||REGIONAL_TITLE.ru)}</h3>
    </div>`+
    card(GROUPS[2],3)+
    card(GROUPS[3],4)+
    card(GROUPS[4],5)+
    card(GROUPS[5],6)+
    card(GROUPS[6],7)+
    card(GROUPS[7],8);

  container.querySelectorAll(".league-card").forEach(card=>{
    card.onclick=()=>openLeague(card.dataset.league);
  });
}

function openLeague(id){
  if(!GROUPS.some(g=>g.id===id))return;

  currentLeague=id;

  el("leagueTitle").textContent=groupName(id);

  renderLeagueTeams();
  renderLeagueMatches();

  setPage("leagueDetailsPage");
}

/* ================================
   TEAM DETAILS
================================ */

function teamName(id){
  const team=teams.find(t=>t.id===id);
  return team?team.name:"Команда";
}

function renderLeagueTeams(){
  const container=el("leagueTeams");
  if(!container)return;

  const list=teams.filter(t=>t.league===currentLeague);

  if(!list.length){
    container.innerHTML=
      '<div class="empty-state">Команды пока не добавлены</div>';
    return;
  }

  container.innerHTML=list.map(t=>`
    <div class="match-card team-card"
         data-team="${escapeHTML(t.id)}"
         style="cursor:pointer">
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

  const played=matches.filter(m=>
    isFinished(m)&&
    (m.home===id||m.away===id)
  );

  let wins=0,draws=0,losses=0;
  let points=0,goals=0,against=0;

  played.forEach(m=>{
    const home=m.home===id;
    const gf=Number(home?m.homeScore:m.awayScore);
    const ga=Number(home?m.awayScore:m.homeScore);

    if(!Number.isFinite(gf)||!Number.isFinite(ga))return;

    goals+=gf;
    against+=ga;

    if(gf>ga){
      wins++;
      points+=3;
    }else if(gf===ga){
      draws++;
      points++;
    }else{
      losses++;
    }
  });

  el("leagueTeams").innerHTML=`
    <button class="back-btn" id="teamBack">← Назад</button>

    <div class="panel">
      <h2>${escapeHTML(team.name)}</h2>
      <p>${escapeHTML(groupName(team.league))}</p>

      <div class="section-header">
        <h3>Статистика</h3>
      </div>

      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>И</th><th>В</th><th>Н</th>
              <th>П</th><th>Г</th><th>О</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${played.length}</td>
              <td>${wins}</td>
              <td>${draws}</td>
              <td>${losses}</td>
              <td>${goals}:${against}</td>
              <td>${points}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 style="margin-top:20px">Матчи</h3>

      ${
        played.length
        ?played.map(m=>`
          <div class="match-card">
            <p>${escapeHTML(teamName(m.home))} — ${escapeHTML(teamName(m.away))}</p>
            <h3>${m.homeScore} : ${m.awayScore}</h3>
            <p>${escapeHTML(m.date||"")}</p>
          </div>
        `).join("")
        :'<div class="empty-state">Матчей пока нет</div>'
      }
    </div>
  `;

  el("teamBack").onclick=()=>renderLeagueTeams();
}

/* ================================
   MATCH DISPLAY
================================ */

function matchHTML(m){
  const status=matchStatus(m);

  let badge="Предстоящий";

  if(status==="live")badge="● LIVE";
  if(status==="finished")badge="Завершён";

  const score=
    status==="upcoming"
    ?"— : —"
    :`${Number(m.homeScore)||0} : ${Number(m.awayScore)||0}`;

  return `
    <div class="match-card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <p>${escapeHTML(groupName(m.league))}</p>
        <strong>${badge}</strong>
      </div>

      <h4>${escapeHTML(teamName(m.home))} — ${escapeHTML(teamName(m.away))}</h4>

      <h3>${score}</h3>

      <p>${escapeHTML(m.date||"")}</p>
    </div>
  `;
}

function renderLeagueMatches(){
  const container=el("leagueMatches");
  if(!container)return;

  const list=matches.filter(m=>m.league===currentLeague);

  container.innerHTML=list.length
    ?list.map(matchHTML).join("")
    :'<div class="empty-state">Матчей пока нет</div>';
}

function renderMatches(){
  const container=el("matchesList");
  if(!container)return;

  let list=[...matches];

  if(matchFilter==="finished"){
    list=list.filter(isFinished);
  }

  if(matchFilter==="live"){
    list=list.filter(isLive);
  }

  if(matchFilter==="upcoming"){
    list=list.filter(m=>matchStatus(m)==="upcoming");
  }

  if(!list.length){
    container.innerHTML=
      '<div class="empty-state">Пока нет матчей</div>';
    return;
  }

  container.innerHTML=list.map(matchHTML).join("");
}

/* ================================
   PERMANENT TEAM RATING
================================ */

function calculateRating(){
  return teams.map(t=>{
    const played=matches.filter(m=>
      isFinished(m)&&
      (m.home===t.id||m.away===t.id)
    );

    let wins=0,draws=0,losses=0;
    let goals=0,against=0,points=0;

    played.forEach(m=>{
      const home=m.home===t.id;

      const gf=Number(home?m.homeScore:m.awayScore);
      const ga=Number(home?m.awayScore:m.homeScore);

      if(!Number.isFinite(gf)||!Number.isFinite(ga))return;

      goals+=gf;
      against+=ga;

      if(gf>ga){
        wins++;
        points+=3;
      }else if(gf===ga){
        draws++;
        points++;
      }else{
        losses++;
      }
    });

    return {
      ...t,
      played:played.length,
      wins,
      draws,
      losses,
      goals,
      against,
      gd:goals-against,
      points
    };
  }).sort((a,b)=>
    b.points-a.points||
    b.gd-a.gd||
    b.goals-a.goals||
    a.name.localeCompare(b.name)
  );
}

function renderRating(){
  const tbody=el("ratingTable");
  const empty=el("ratingEmpty");

  if(!tbody)return;

  const rating=calculateRating();

  tbody.innerHTML=rating.map((t,i)=>`
    <tr>
      <td>${i+1}</td>
      <td>${escapeHTML(t.name)}</td>
      <td>${t.played}</td>
      <td><strong>${t.points}</strong></td>
    </tr>
  `).join("");

  if(empty){
    empty.style.display=rating.length?"none":"block";
  }
}

/* ================================
   ADMIN PANEL
================================ */

function renderAdmin(){
  const role=el("adminRole");
  const panel=el("adminPanel");
  const input=el("adminCodeInput");
  const loginBtn=el("applyAdminCodeBtn");
  const logoutBtn=el("logoutBtn");

  if(role){
    role.textContent=
      isMaster()
      ?"Главный администратор"
      :currentAdmin
      ?groupName(currentAdmin)+" — администратор"
      :"Гость";
  }

  if(panel)panel.classList.toggle("hidden",!isAdmin());

  if(input)input.style.display=isAdmin()?"none":"block";
  if(loginBtn)loginBtn.style.display=isAdmin()?"none":"block";
  if(logoutBtn)logoutBtn.style.display=isAdmin()?"block":"none";

  if(!isAdmin())return;

  buildAdminControls();
  renderAdminTeams();
  updateMatchTeamSelectors();
  renderAdminMatches();
}

function buildAdminControls(){
  const panel=el("adminPanel");
  if(!panel)return;

  let codeBox=el("adminCodeManager");

  if(!codeBox){
    codeBox=document.createElement("div");
    codeBox.id="adminCodeManager";
    panel.appendChild(codeBox);
  }

  codeBox.innerHTML="";

  if(isMaster()){
    codeBox.innerHTML=`
      <div class="panel">
        <h3>Коды администраторов</h3>

        ${GROUPS.map(g=>`
          <label>${escapeHTML(groupName(g.id))}</label>
          <input
            class="admin-code"
            data-code="${g.id}"
            value="${escapeHTML(codes[g.id]||"")}"
            type="text"
          >
        `).join("")}

        <button class="primary-btn" id="saveCodes">
          Сохранить коды
        </button>
      </div>
    `;

    el("saveCodes").onclick=()=>{
      document.querySelectorAll(".admin-code").forEach(input=>{
        const value=input.value.trim();

        if(value)codes[input.dataset.code]=value;
      });

      saveData();
      alert("Коды сохранены");
    };
  }

  const adminLeague=el("adminLeague");

  if(adminLeague){
    adminLeague.innerHTML=GROUPS
      .filter(g=>allowedLeague(g.id))
      .map(g=>`
        <option value="${g.id}">${escapeHTML(groupName(g.id))}</option>
      `).join("");
  }

  const matchLeague=el("matchLeagueSelect");

  if(matchLeague){
    const previous=matchLeague.value;

    matchLeague.innerHTML=GROUPS
      .filter(g=>allowedLeague(g.id))
      .map(g=>`
        <option value="${g.id}">${escapeHTML(groupName(g.id))}</option>
      `).join("");

    if([...matchLeague.options].some(o=>o.value===previous)){
      matchLeague.value=previous;
    }
  }
}

/* ================================
   TEAM MANAGEMENT
================================ */

function renderAdminTeams(){
  const container=el("adminTeams");
  if(!container)return;

  const list=teams.filter(t=>allowedLeague(t.league));

  if(!list.length){
    container.innerHTML=
      '<div class="empty-state">Команды пока не добавлены</div>';
    return;
  }

  container.innerHTML=list.map(t=>`
    <div class="admin-team-item">
      <span>${escapeHTML(t.name)}</span>

      <button class="secondary-btn edit-team"
              data-id="${escapeHTML(t.id)}">
        ✏️
      </button>

      <button class="delete-btn"
              data-id="${escapeHTML(t.id)}">
        Удалить
      </button>
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

  if(!allowedLeague(league)){
    return alert("Нет доступа к этому разделу");
  }

  if(teams.some(t=>
    t.league===league&&
    t.name.trim().toLowerCase()===name.toLowerCase()
  )){
    return alert("Такая команда уже существует");
  }

  teams.push({
    id:String(Date.now())+String(Math.floor(Math.random()*1000)),
    name,
    league
  });

  el("teamName").value="";

  saveData();
  renderAll();
}

function editTeam(id){
  const team=teams.find(t=>t.id===id);

  if(!team||!allowedLeague(team.league))return;

  const name=prompt("Новое название команды:",team.name);

  if(name===null)return;

  const clean=name.trim();

  if(!clean)return alert("Название не может быть пустым");

  if(teams.some(t=>
    t.id!==id&&
    t.league===team.league&&
    t.name.trim().toLowerCase()===clean.toLowerCase()
  )){
    return alert("Такая команда уже существует");
  }

  team.name=clean;

  saveData();
  renderAll();
}

function deleteTeam(id){
  const team=teams.find(t=>t.id===id);

  if(!team||!allowedLeague(team.league))return;

  if(!confirm(`Удалить команду "${team.name}"?`))return;

  teams=teams.filter(t=>t.id!==id);

  saveData();
  renderAll();
}

/* ================================
   MATCH TEAM SELECTORS
================================ */

function updateMatchTeamSelectors(){
  const home=el("matchHomeTeam");
  const away=el("matchAwayTeam");
  const league=el("matchLeagueSelect");

  if(!home||!away||!league)return;

  const selectedLeague=league.value;

  if(!allowedLeague(selectedLeague))return;

  const list=teams.filter(t=>t.league===selectedLeague);

  function fill(select,placeholder){
    const old=select.value;

    select.innerHTML=`
      <option value="">${placeholder}</option>
      ${list.map(t=>`
        <option value="${escapeHTML(t.id)}">
          ${escapeHTML(t.name)}
        </option>
      `).join("")}
    `;

    if(list.some(t=>t.id===old)){
      select.value=old;
    }
  }

  fill(home,"Выберите команду хозяев");
  fill(away,"Выберите команду гостей");
}

/* ================================
   MATCH MANAGEMENT
================================ */

function resetMatchForm(){
  editingMatchId=null;

  if(el("matchHomeTeam"))el("matchHomeTeam").value="";
  if(el("matchAwayTeam"))el("matchAwayTeam").value="";
  if(el("homeScoreInput"))el("homeScoreInput").value="";
  if(el("awayScoreInput"))el("awayScoreInput").value="";
  if(el("matchStatusSelect"))el("matchStatusSelect").value="upcoming";

  const button=el("addMatchBtn");

  if(button)button.textContent="+ Добавить / Обновить матч";
}

function addMatch(){
  if(!isAdmin())return alert("Нет доступа");

  const league=el("matchLeagueSelect").value;
  const home=el("matchHomeTeam").value;
  const away=el("matchAwayTeam").value;

  const homeRaw=el("homeScoreInput").value.trim();
  const awayRaw=el("awayScoreInput").value.trim();

  const status=el("matchStatusSelect").value;

  if(!allowedLeague(league)){
    return alert("Нет доступа к этой лиге");
  }

  if(!home||!away){
    return alert("Выберите обе команды");
  }

  if(home===away){
    return alert("Одна команда не может играть сама с собой");
  }

  const homeTeam=teams.find(t=>t.id===home);
  const awayTeam=teams.find(t=>t.id===away);

  if(!homeTeam||!awayTeam||
     homeTeam.league!==league||
     awayTeam.league!==league){
    return alert("Команды должны принадлежать выбранной лиге");
  }

  if(!["upcoming","live","finished"].includes(status)){
    return alert("Неверный статус матча");
  }

  let homeScore=null;
  let awayScore=null;

  if(homeRaw!==""||awayRaw!==""){
    if(homeRaw===""||awayRaw===""){
      return alert("Введите оба счёта");
    }

    homeScore=Number(homeRaw);
    awayScore=Number(awayRaw);

    if(!Number.isInteger(homeScore)||!Number.isInteger(awayScore)||
       homeScore<0||awayScore<0){
      return alert("Счёт должен быть целым числом от 0");
    }
  }

  if(status==="finished"&&(homeScore===null||awayScore===null)){
    return alert("Для завершённого матча введите счёт");
  }

  if(editingMatchId){
    const match=matches.find(m=>m.id===editingMatchId);

    if(!match||!allowedLeague(match.league)){
      return alert("Нет доступа к изменению матча");
    }

    Object.assign(match,{
      home,
      away,
      league,
      homeScore,
      awayScore,
      live:status==="live",
      finished:status==="finished",
      status,
      date:match.date||localDateString(selectedDate)
    });

  }else{
    matches.push({
      id:String(Date.now())+String(Math.floor(Math.random()*1000)),
      home,
      away,
      league,
      homeScore,
      awayScore,
      live:status==="live",
      finished:status==="finished",
      status,
      date:localDateString(selectedDate)
    });
  }

  saveData();
  resetMatchForm();
  renderAll();

  alert("Матч сохранён");
}

function editMatch(id){
  const match=matches.find(m=>m.id===id);

  if(!match||!allowedLeague(match.league))return;

  editingMatchId=id;

  el("matchLeagueSelect").value=match.league;
  updateMatchTeamSelectors();

  el("matchHomeTeam").value=match.home;
  el("matchAwayTeam").value=match.away;

  el("homeScoreInput").value=match.homeScore??"";
  el("awayScoreInput").value=match.awayScore??"";

  el("matchStatusSelect").value=matchStatus(match);

  const button=el("addMatchBtn");

  if(button)button.textContent="Сохранить изменения";

  el("adminPanel").scrollIntoView({
    behavior:"smooth",
    block:"start"
  });
}

function renderAdminMatches(){
  const container=el("adminMatches");
  if(!container)return;

  const list=matches.filter(m=>allowedLeague(m.league));

  if(!list.length){
    container.innerHTML=
      '<div class="empty-state">Матчей пока нет</div>';
    return;
  }

  container.innerHTML=list.map(m=>`
    <div class="match-card">
      <p>${escapeHTML(groupName(m.league))}</p>

      <h4>
        ${escapeHTML(teamName(m.home))}
        —
        ${escapeHTML(teamName(m.away))}
      </h4>

      <h3>
        ${
          matchStatus(m)==="upcoming"
          ?"— : —"
          :`${Number(m.homeScore)||0} : ${Number(m.awayScore)||0}`
        }
      </h3>

      <p>${escapeHTML(m.date||"")}</p>

      <button class="secondary-btn edit-match"
              data-id="${escapeHTML(m.id)}">
        ✏️ Изменить
      </button>
    </div>
  `).join("");

  container.querySelectorAll(".edit-match").forEach(btn=>{
    btn.onclick=()=>editMatch(btn.dataset.id);
  });
}

/* ================================
   ADMIN LOGIN
================================ */

function login(){
  const input=el("adminCodeInput");

  if(!input)return;

  const value=input.value.trim();

  if(!value)return alert("Введите код администратора");

  if(value===MASTER_CODE){
    currentAdmin="master";
  }else{
    const found=GROUPS.find(g=>
      codes[g.id]===value&&value!==""
    );

    if(!found)return alert("Неверный код администратора");

    currentAdmin=found.id;
  }

  localStorage.setItem(STORAGE.admin,currentAdmin);

  input.value="";

  renderAdmin();
}

function logout(){
  currentAdmin="";

  localStorage.removeItem(STORAGE.admin);

  resetMatchForm();
  renderAdmin();
}

/* ================================
   SEARCH
================================ */

function setupSearch(){
  if(el("searchBtn")){
    el("searchBtn").onclick=()=>{
      el("searchPanel").classList.toggle("hidden");

      if(!el("searchPanel").classList.contains("hidden")){
        el("searchInput").focus();
      }
    };
  }

  if(el("closeSearch")){
    el("closeSearch").onclick=()=>{
      el("searchPanel").classList.add("hidden");
      el("searchInput").value="";
      renderLeagues();
    };
  }

  if(el("searchInput")){
    el("searchInput").oninput=()=>{
      const q=el("searchInput").value.trim().toLowerCase();

      document.querySelectorAll(".league-card").forEach(card=>{
        const league=card.dataset.league;

        const found=teams.some(t=>
          t.league===league&&
          t.name.toLowerCase().includes(q)
        );

        card.style.display=
          !q||card.textContent.toLowerCase().includes(q)||found
          ?"flex":"none";
      });
    };
  }
}

/* ================================
   SETTINGS
================================ */

function setupSettings(){
  if(el("settingsBtn")){
    el("settingsBtn").onclick=()=>{
      el("settingsModal").classList.remove("hidden");
    };
  }

  if(el("closeSettings")){
    el("closeSettings").onclick=()=>{
      el("settingsModal").classList.add("hidden");
    };
  }

  if(el("languageSelect")){
    el("languageSelect").onchange=()=>{
      language=el("languageSelect").value;

      localStorage.setItem(STORAGE.language,language);

      renderAll();
      updateDate();
    };
  }

  if(el("themeSelect")){
    el("themeSelect").onchange=()=>{
      const theme=el("themeSelect").value;

      document.body.classList.toggle("dark",theme==="dark");

      localStorage.setItem(STORAGE.theme,theme);
    };
  }
}

/* ================================
   DATE
================================ */

function updateDate(){
  const date=el("currentDate");
  const label=el("dateLabel");

  if(date){
    date.textContent=selectedDate.toLocaleDateString(
      language==="tg"?"tg-TJ":"ru-RU",
      {
        day:"numeric",
        month:"long",
        year:"numeric"
      }
    );
  }

  if(label){
    const today=localDateString(new Date());

    label.textContent=
      localDateString(selectedDate)===today
      ?"СЕГОДНЯ":"ДАТА";
  }
}

/* ================================
   ALL RENDER
================================ */

function renderAll(){
  renderLeagues();
  renderRating();
  renderMatches();

  if(currentLeague){
    renderLeagueTeams();
    renderLeagueMatches();
  }

  renderAdmin();
}

/* ================================
   EVENT LISTENERS
================================ */

function setupNavigation(){
  document.querySelectorAll(".nav-item").forEach(btn=>{
    btn.onclick=()=>setPage(btn.dataset.page);
  });

  if(el("addTeamBtn")){
    el("addTeamBtn").onclick=addTeam;
  }

  if(el("addMatchBtn")){
    el("addMatchBtn").onclick=addMatch;
  }

  if(el("applyAdminCodeBtn")){
    el("applyAdminCodeBtn").onclick=login;
  }

  if(el("logoutBtn")){
    el("logoutBtn").onclick=logout;
  }

  if(el("backToLeagues")){
    el("backToLeagues").onclick=()=>setPage("leaguesPage");
  }

  document.querySelectorAll(".tab").forEach(btn=>{
    btn.onclick=()=>{
      document.querySelectorAll(".tab").forEach(b=>{
        b.classList.remove("active");
      });

      btn.classList.add("active");

      matchFilter=btn.dataset.filter;

      renderMatches();
    };
  });

  if(el("matchLeagueSelect")){
    el("matchLeagueSelect").onchange=updateMatchTeamSelectors;
  }

  if(el("prevDate")){
    el("prevDate").onclick=()=>{
      selectedDate.setDate(selectedDate.getDate()-1);
      updateDate();
    };
  }

  if(el("nextDate")){
    el("nextDate").onclick=()=>{
      selectedDate.setDate(selectedDate.getDate()+1);
      updateDate();
    };
  }

  setupSearch();
  setupSettings();
}

/* ================================
   INITIALIZATION
================================ */

function init(){
  if(!Array.isArray(teams))teams=[];
  if(!Array.isArray(matches))matches=[];

  setupNavigation();

  const theme=localStorage.getItem(STORAGE.theme)||"light";

  document.body.classList.toggle("dark",theme==="dark");

  if(el("themeSelect"))el("themeSelect").value=theme;
  if(el("languageSelect"))el("languageSelect").value=language;

  updateDate();

  renderAll();

  setPage("leaguesPage");
}

if(document.readyState==="loading"){
  document.addEventListener("DOMContentLoaded",init);
}else{
  init();
}
