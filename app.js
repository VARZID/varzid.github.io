
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
  el("leagueTitle").textContent=groupName(id);
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
  return `
    <div class="match-card">
      <p>${escapeHTML(groupName(m.league))}</p>
      <h4>${escapeHTML(teamName(m.home))} — ${escapeHTML(teamName(m.away))}</h4>
      <h3>${m.finished?`${m.homeScore} : ${m.awayScore}`:"— : —"}</h3>
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
  return teams.map(t=>{
    const played=matches.filter(m=>m.finished&&(m.home===t.id||m.away===t.id));
    let wins=0,draws=0,losses=0,goals=0,against=0,points=0;

    played.forEach(m=>{
      const home=m.home===t.id;
      const gf=Number(home?m.homeScore:m.awayScore);
      const ga=Number(home?m.awayScore:m.homeScore);

      goals+=gf;
      against+=ga;

      if(gf>ga){wins++;points+=3;}
      else if(gf===ga){draws++;points++;}
      else losses++;
    });

    return {
      ...t,played:played.length,wins,draws,losses,
      goals,against,gd:goals-against,points
    };
  }).sort((a,b)=>
    b.points-a.points||b.gd-a.gd||b.goals-a.goals||a.name.localeCompare(b.name)
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
  }
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
          <input class="admin-code" data-code="${g.id}" value="${escapeHTML(codes[g.id]||"")}" type="text">
        `).join("")}
        <button class="primary-btn" id="saveCodes">Сохранить коды</button>
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
  if(select){
    select.innerHTML=GROUPS
      .filter(g=>isMaster()||g.id===currentAdmin)
      .map(g=>`<option value="${g.id}">${escapeHTML(groupName(g.id))}</option>`)
      .join("");
  }
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
