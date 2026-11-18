function buildAdminControls(){
  const panel=el("adminPanel");
  if(!panel)return;

  // Пеш аз аз нав сохтан, лигаи интихобшудаи ҳозираро дар хотир нигоҳ медорем
  const matchLeagueSelectOld = el("matchLeagueSelect");
  const adminLeagueOld = el("adminLeague");
  const savedMatchLeague = matchLeagueSelectOld ? matchLeagueSelectOld.value : (currentLeague || "higher");
  const savedAdminLeague = adminLeagueOld ? adminLeagueOld.value : (currentAdmin && currentAdmin !== "master" ? currentAdmin : "higher");

  let matchControlBox = el("adminMatchManagerBox");
  if(!matchControlBox){
    matchControlBox = document.createElement("div");
    matchControlBox.id = "adminMatchManagerBox";
    panel.appendChild(matchControlBox);
  }

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
  if(select){
    select.innerHTML=GROUPS
      .filter(g=>isMaster()||g.id===currentAdmin)
      .map(g=>`<option value="${g.id}">${escapeHTML(groupName(g.id))}</option>`)
      .join("");
    select.value = savedAdminLeague; // Лигаи интихобшударо мемонад
  }

  const matchLeagueSelect = el("matchLeagueSelect");
  if(matchLeagueSelect){
    matchLeagueSelect.innerHTML=GROUPS
      .filter(g=>isMaster()||g.id===currentAdmin)
      .map(g=>`<option value="${g.id}">${escapeHTML(groupName(g.id))}</option>`)
      .join("");
    
    matchLeagueSelect.value = savedMatchLeague; // Лигаи матчи интихобшударо мемонад ва намегузорад ба Высшая лига баргардад
    matchLeagueSelect.onchange = updateMatchTeamSelectors;
  }

  if(el("addMatchBtn")) el("addMatchBtn").onclick = addMatch;
  updateMatchTeamSelectors();
}
