document.addEventListener("DOMContentLoaded", () => {
    const leagueButtonsContainer = document.getElementById("leagueButtons");
    const leagueDetails = document.getElementById("leagueDetails");
    const currentLeagueTitle = document.getElementById("currentLeagueTitle");
    const backBtn = document.getElementById("backBtn");
    
    const adminCodeInput = document.getElementById("adminCodeInput");
    const adminLoginBtn = document.getElementById("adminLoginBtn");
    const adminPanel = document.getElementById("adminPanel");

    const newTeamName = document.getElementById("newTeamName");
    const addTeamBtn = document.getElementById("addTeamBtn");

    const homeTeamSelect = document.getElementById("homeTeamSelect");
    const awayTeamSelect = document.getElementById("awayTeamSelect");
    const homeScore = document.getElementById("homeScore");
    const awayScore = document.getElementById("awayScore");
    const addMatchBtn = document.getElementById("addMatchBtn");
    const standingsBody = document.getElementById("standingsBody");

    let activeLeagueKey = null;

    // Бор кардани маълумот аз localStorage агар бошад
    const savedData = localStorage.getItem("varzid_leagues");
    if (savedData) {
        const parsed = JSON.parse(savedData);
        Object.keys(parsed).forEach(key => {
            if (leaguesData[key]) {
                leaguesData[key].teams = parsed[key].teams || [];
            }
        });
    }

    function saveDataToStorage() {
        localStorage.setItem("varzid_leagues", JSON.stringify(leaguesData));
    }

    // Сохтани тугмаҳои лигаҳо дар саҳифаи асосӣ
    function renderLeagues() {
        leagueButtonsContainer.innerHTML = "";
        Object.keys(leaguesData).forEach(key => {
            const league = leaguesData[key];
            const btn = document.createElement("button");
            btn.className = "league-btn";
            btn.textContent = league.name;
            btn.addEventListener("click", () => openLeague(key));
            leagueButtonsContainer.appendChild(btn);
        });
    }

    function openLeague(key) {
        activeLeagueKey = key;
        const league = leaguesData[key];
        
        currentLeagueTitle.textContent = league.name;
        document.querySelector(".leagues-section").classList.add("hidden");
        leagueDetails.classList.remove("hidden");

        // Пихон кардани панели админ ҳангоми кушодани гурӯҳ
        adminPanel.classList.add("hidden");
        adminCodeInput.value = "";
        
        renderStandings();
        updateTeamSelects();
    }

    backBtn.addEventListener("click", () => {
        leagueDetails.classList.add("hidden");
        document.querySelector(".leagues-section").classList.remove("hidden");
        activeLeagueKey = null;
    });

    // Санҷиши коди админ
    adminLoginBtn.addEventListener("click", () => {
        const enteredCode = adminCodeInput.value.trim();
        if (activeLeagueKey && enteredCode === leaguesData[activeLeagueKey].code) {
            adminPanel.classList.remove("hidden");
            alert("Код дуруст аст! Панели админ кушода шуд.");
        } else {
            alert("Коди админ хато аст!");
            adminPanel.classList.add("hidden");
        }
    });

    // Илова кардани команда
    addTeamBtn.addEventListener("click", () => {
        const name = newTeamName.value.trim();
        if (!name) return alert("Номи командаро нависед!");

        leaguesData[activeLeagueKey].teams.push({
            name: name,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            gf: 0,
            ga: 0,
            points: 0
        });

        saveDataToStorage();
        newTeamName.value = "";
        renderStandings();
        updateTeamSelects();
    });

    // Навсозии рӯйхати командаҳо дар менюи шот
    function updateTeamSelects() {
        const teams = leaguesData[activeLeagueKey].teams;
        homeTeamSelect.innerHTML = "";
        awayTeamSelect.innerHTML = "";

        teams.forEach((team, index) => {
            const opt1 = document.createElement("option");
            opt1.value = index;
            opt1.textContent = team.name;
            homeTeamSelect.appendChild(opt1);

            const opt2 = document.createElement("option");
            opt2.value = index;
            opt2.textContent = team.name;
            awayTeamSelect.appendChild(opt2);
        });
    }

    // Илова кардани шот ва ҳисоби автоматӣ
    addMatchBtn.addEventListener("click", () => {
        const hIdx = parseInt(homeTeamSelect.value);
        const aIdx = parseInt(awayTeamSelect.value);
        const hSc = parseInt(homeScore.value);
        const aSc = parseInt(awayScore.value);

        if (isNaN(hSc) || isNaN(aSc)) return alert("Шоти бозиро пурра ворид кунед!");
        if (hIdx === aIdx) return alert("Як команда бо худаш бозӣ карда наметавонад!");

        const teams = leaguesData[activeLeagueKey].teams;
        const home = teams[hIdx];
        const away = teams[aIdx];

        // Ҳисоби омор
        home.played += 1;
        away.played += 1;
        home.gf += hSc;
        home.ga += aSc;
        away.gf += aSc;
        away.ga += hSc;

        if (hSc > aSc) {
            home.won += 1;
            home.points += 3;
            away.lost += 1;
        } else if (hSc < aSc) {
            away.won += 1;
            away.points += 3;
            home.lost += 1;
        } else {
            home.drawn += 1;
            home.points += 1;
            away.drawn += 1;
            away.points += 1;
        }

        saveDataToStorage();
        homeScore.value = "";
        awayScore.value = "";
        renderStandings();
        alert("Натиҷаи бозӣ бомуваффақият сабт шуд ва ҷадвал нав шуд!");
    });

    // Намоиши ҷадвал бо тартиби холҳо
    function renderStandings() {
        const teams = leaguesData[activeLeagueKey].teams;
        
        // Рангбандии командаҳо аз рӯи хол ва тафовути тӯбҳо
        teams.sort((a, b) => {
            if (b.points !== a.points) return b.points - a.points;
            let diffB = b.gf - b.ga;
            let diffA = a.gf - a.ga;
            if (diffB !== diffA) return diffB - diffA;
            return b.gf - a.gf;
        });

        standingsBody.innerHTML = "";
        teams.forEach((team, index) => {
            const tr = document.createElement("tr");
            const goalDiff = team.gf - team.ga;
            const diffStr = goalDiff > 0 ? `+${goalDiff}` : goalDiff;

            tr.innerHTML = `
                <td>${index + 1}</td>
                <td>${team.name}</td>
                <td>${team.played}</td>
                <td>${team.won}</td>
                <td>${team.drawn}</td>
                <td>${team.lost}</td>
                <td>${diffStr}</td>
                <td><strong>${team.points}</strong></td>
            `;
            standingsBody.appendChild(tr);
        });
    }

    renderLeagues();
});
