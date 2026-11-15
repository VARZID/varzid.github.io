
(()=>{
'use strict';

const D={
leagues:[
{id:'top',ru:'Группа высшего Фархора',tg:'Гурӯҳи олии Фархор',featured:true},
{id:'town',ru:'Группа шаҳрак',tg:'Гурӯҳи шаҳрак',featured:true},
{id:'east',ru:'Группа Деҳ Шарқ',tg:'Гурӯҳи Деҳ Шарқ'},
{id:'west',ru:'Группа Деҳ Ғарб',tg:'Гурӯҳи Деҳ Ғарб'},
{id:'north',ru:'Группа Деҳ Шимол',tg:'Гурӯҳи Деҳ Шимол'},
{id:'south',ru:'Группа Деҳ Ҷануб',tg:'Гурӯҳи Деҳ Ҷануб'}
],
teams:[
{name:'Истиқлол',rating:0,league:'town'},
{name:'Равшан',rating:0,league:'east'},
{name:'Сомон',rating:0,league:'west'},
{name:'Наврӯз',rating:0,league:'north'},
{name:'Фархор',rating:0,league:'south'}
],
matches:[
{league:'town',home:'Истиқлол',away:'Равшан',hs:2,as:1,status:'live',minute:68,time:'16:00'},
{league:'east',home:'Сомон',away:'Наврӯз',hs:null,as:null,status:'upcoming',time:'17:00'},
{league:'south',home:'Фархор',away:'Дӯстӣ',hs:3,as:0,status:'finished',time:'FT'}
]
};

const $=id=>document.getElementById(id);
let lang=localStorage.getItem('vs-lang')||'ru';
let theme=localStorage.getItem('vs-theme')||'dark';
let filter='all';
let chosen=null;
let date=new Date();

const L=x=>lang==='tg'?x.tg:x.ru;

function dateText(){
$('dateLabel').textContent=date.toLocaleDateString(
lang==='tg'?'tg-TJ':'ru-RU',
{day:'numeric',month:'long',year:'numeric'}
);
}

function leagues(){
const f=D.leagues.filter(x=>x.featured);
const r=D.leagues.filter(x=>!x.featured);

$('featured').innerHTML=f.map(x=>`
<button class="league" data-league="${x.id}">
<small>VARZID SCORE</small>
<b>${L(x)}</b>
<small>Мусобиқаи футбол / Футбольное соревнование</small>
</button>
`).join('');

$('rural').innerHTML=r.map(x=>`
<button class="league" data-league="${x.id}">
<small>ДЕҲОТ</small>
<b>${L(x)}</b>
</button>
`).join('');

document.querySelectorAll('[data-league]').forEach(b=>{
b.onclick=()=>showLeague(b.dataset.league);
});
}

function matches(){
const a=D.matches.filter(x=>filter==='all'||x.status===filter);

$('matchList').innerHTML=a.length?a.map(x=>{
let l=D.leagues.find(z=>z.id===x.league);
let s=x.hs===null?'— : —':x.hs+' : '+x.as;
let status=x.status==='live'
?'● LIVE · '+x.minute+'′'
:x.status==='finished'
?'Завершён'
:'Начало · '+x.time;

return `
<article class="match">
<small>${L(l)} · ${status}</small>
<div class="teams">
<span>${x.home}</span>
<b class="score">${s}</b>
<span>${x.away}</span>
</div>
</article>`;
}).join(''):'<p>Матчей пока нет / Ҳоло бозӣ нест</p>';

$('matchesCount').textContent=D.matches.length;
}

function ranking(){
$('ranking').innerHTML=D.teams.slice()
.sort((a,b)=>b.rating-a.rating)
.map((x,i)=>`
<div class="row">
<b>${i+1}</b>
<span>${x.name}</span>
<strong>${x.rating}</strong>
</div>
`).join('');

$('teamsCount').textContent=D.teams.length;
}

function showLeague(id){
chosen=id;
let l=D.leagues.find(x=>x.id===id);
$('leagueTitle').textContent=L(l);

let ts=D.teams.filter(x=>x.league===id);
let ms=D.matches.filter(x=>x.league===id);

$('leagueContent').innerHTML=
'<h3>КОМАНДЫ / ДАСТАҲО</h3>'+
(ts.map(x=>`<p>${x.name} · рейтинг ${x.rating}</p>`).join('')||
'<p>Команды пока не добавлены.</p>')+
'<h3>МАТЧИ / БОЗИҲО</h3>'+
(ms.map(x=>`<p>${x.home} — ${x.away}: ${x.hs===null?'—':x.hs+':'+x.as}</p>`).join('')||
'<p>Матчей пока нет.</p>');

$('leagueDetails').classList.remove('hidden');
$('leagueDetails').scrollIntoView({behavior:'smooth'});
}

function render(){
document.documentElement.dataset.theme=theme;
$('theme').value=theme;
$('lang').value=lang;
leagues();
matches();
ranking();
dateText();
}

function open(id){$(id).classList.remove('hidden')}
function close(id){$(id).classList.add('hidden')}

$('settingsBtn').onclick=$('settingsNav').onclick=()=>open('settings');
$('adminBtn').onclick=$('openLogin').onclick=()=>open('login');

document.querySelectorAll('[data-close]').forEach(b=>{
b.onclick=()=>close(b.dataset.close);
});

$('lang').onchange=e=>{
lang=e.target.value;
localStorage.setItem('vs-lang',lang);
render();
};

$('theme').onchange=e=>{
theme=e.target.value;
localStorage.setItem('vs-theme',theme);
render();
};

document.querySelector('.filters').onclick=e=>{
if(!e.target.dataset.filter)return;
filter=e.target.dataset.filter;
document.querySelectorAll('.filters button').forEach(b=>{
b.classList.toggle('active',b===e.target);
});
matches();
};

$('prev').onclick=()=>{
date.setDate(date.getDate()-1);
dateText();
};

$('next').onclick=()=>{
date.setDate(date.getDate()+1);
dateText();
};

$('closeLeague').onclick=()=>
$('leagueDetails').classList.add('hidden');

$('loginSubmit').onclick=()=>
$('loginMessage').textContent=
'Авторизация ещё не подключена. / Воридшавӣ ҳоло пайваст нест.';

$('searchBtn').onclick=()=>{
let q=prompt('Поиск команды / Ҷустуҷӯи даста');
if(!q)return;
document.querySelectorAll('.league').forEach(x=>{
x.classList.toggle('hidden',
!x.textContent.toLowerCase().includes(q.toLowerCase()));
});
};

render();
})();
