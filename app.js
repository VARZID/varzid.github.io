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
