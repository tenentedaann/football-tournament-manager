const STORAGE_KEY="calcio-balilla-manager-v1", LIBRARY_KEY="calcio-balilla-library-v2";
const SUPABASE_URL="https://vmcszhtifjnlznauybku.supabase.co";
const SUPABASE_KEY="sb_publishable_dk9G6ZpeY15QkeJsj2MQRg_9kRTIKXx";
const SESSION_KEY="foosball-supabase-session";
const ONLINE=true;
let remoteSession=null,authMode="login";
const LANGUAGE_KEY="calcio-balilla-language", ADMIN_PIN_KEY="calcio-balilla-admin-pin";
let uiLanguage=localStorage.getItem(LANGUAGE_KEY)||"it";
let accessMode=new URLSearchParams(location.search).get("view")==="public"?"viewer":"admin";
const TRANSLATIONS={
 "Amministratore":"Administrator","Visualizzatore":"Public viewer","Vista pubblica":"Public view","Login admin":"Admin login",
 "Salvato in locale":"Saved locally","Esporta":"Export","Importa":"Import","Iscrizioni":"Registrations","Squadre":"Teams","Gironi":"Groups","Partite":"Matches","Fase finale":"Knockout","Statistiche":"Statistics","Regolamento":"Rules",
 "Archivio tornei":"Tournament archive","I tuoi tornei":"Your tournaments","Crea torneo":"Create tournament","Nessun torneo":"No tournaments","Centro torneo":"Tournament center",
 "Gestisci iscrizioni":"Manage registrations","Configura torneo":"Set up tournament","Iscritti":"Entrants","Montepremi":"Prize pool","Prossime partite":"Upcoming matches","Attività recente":"Recent activity",
 "Fase 1":"Step 1","Fase 2":"Step 2","Fase 3":"Step 3","Fase 4":"Step 4","Fase 5":"Step 5","Analisi":"Analysis","Guida ufficiale":"Official guide",
 "Composizione squadre":"Team composition","Calendario e risultati":"Schedule and results","Regolamento del torneo":"Tournament rules","Dati casuali":"Random data",
 "Scarica template Excel":"Download Excel template","Importa Excel":"Import Excel","Nuova iscrizione":"New registration","Nome torneo":"Tournament name","Biliardini disponibili":"Available tables",
 "Ore disponibili":"Available hours","Giocatori per squadra":"Players per team","Salva impostazioni":"Save settings","Iscrizioni singole":"Individual registration","Iscrizioni a squadre":"Team registration",
 "Giocatore":"Player","Contatto":"Contact","Ruolo":"Role","Livello":"Level","Stato":"Status","Portiere":"Goalkeeper","Attaccante":"Forward","Indifferente":"Either",
 "Principiante":"Beginner","Intermedio":"Intermediate","Esperto":"Expert","Titolare":"Starter","Riserva":"Reserve","Modifica":"Edit","Rinomina":"Rename","Sostituzione":"Substitution",
 "Ritiro":"Withdraw","Cambia seed":"Change seed","Componi squadre":"Create teams","Ripeti sorteggio":"Draw again","Stampa":"Print","Genera gironi":"Generate groups","Rigenera gironi":"Regenerate groups",
 "Tutte":"All","Risultato":"Result","Inserisci risultato":"Enter result","Completa casualmente":"Fill randomly","Crea tabellone":"Create bracket","VINCITORE DEL TORNEO":"TOURNAMENT WINNER",
 "Congratulazioni!":"Congratulations!","Statistiche squadre":"Team statistics","Statistiche giocatori":"Player statistics","Hall of Fame dei tornei":"Tournament Hall of Fame","Stampa regolamento":"Print rules"
};
const LEVEL={principiante:1,intermedio:2,esperto:3};
const ROLE_LABEL={portiere:"Portiere",attaccante:"Attaccante",indifferente:"Indifferente"};
const LEVEL_LABEL={principiante:"Principiante",intermedio:"Intermedio",esperto:"Esperto"};
const TEAM_NAMES=["Le Saette","I Fuoriclasse","Tiro Incrociato","I Rulli","Zona Gol","Gli Inarrestabili","Palla al Centro","I Bomber","Doppio Passo","Gli Invincibili","La Muraglia","I Registi","Contropiede","I Panzer","Gli Audaci","Calcio Totale","I Falchi","Gli Spartani","Real Balilla","Atletico Legno","Dinamo Aste","Sporting Bar","United Biliardino","Rapid Gol"];
const NAME_THEMES={
 sportive:TEAM_NAMES,
 nazionali:["Italia","Brasile","Argentina","Francia","Spagna","Germania","Portogallo","Olanda","Belgio","Croazia","Uruguay","Messico","Giappone","Marocco","Senegal","Colombia","Svizzera","Danimarca","Svezia","Polonia","Grecia","Turchia","Canada","Australia"],
 animali:["Leoni","Tigri","Falchi","Lupi","Pantere","Squali","Cobra","Bisonti","Aquile","Puma","Draghi","Orsi","Volpi","Ghepardi","Rinoceronti","Gorilla","Scorpioni","Piranha","Tori","Corvi","Iene","Coccodrilli","Vespe","Grifoni"],
 ironici:["Gli Svitati","Palla Boh","Barre Storte","Gol per Caso","I Senza Polsi","Mani di Legno","Gli Infilzati","Tutto Gancio","Rullo Compressore","I Fuori Asta","Zero Tattica","Birra e Gol","Gli Scappati","Palla Persa","Mai Una Gioia","I Panchinari","Tiro a Caso","Gli Imbullonati","Quelli del Bar","Asta la Vista","No Look Team","Gli Sbilanciati","Ultimo Posto","VAR da Bar"]
};

function blankState(){
  return {version:2,id:uid("tournament"),mode:"single",teamSize:2,title:"Nuovo torneo",tables:4,availableHours:6,matchMinutes:12,seed:"BALILLA-2026",nameTheme:"sportive",entryFee:0,fixedCosts:0,prizeSplit:[50,30,20],withdrawalPolicy:"forfeit",players:[],teams:[],groups:[],matches:[],knockout:[],createdAt:new Date().toISOString(),log:[]};
}
let library=loadLibrary(), state=null, currentView="dashboard", matchFilter="all";
const $=s=>document.querySelector(s), main=$("#main");

function loadLibrary(){try{const x=JSON.parse(localStorage.getItem(LIBRARY_KEY)||"null");if(x?.tournaments)return x;const old=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");if(old){const migrated=Object.assign(blankState(),old,{id:uid("tournament"),version:2,tables:old.tables||4});return{tournaments:[migrated],currentId:migrated.id}}}catch{}return{tournaments:[],currentId:null}}
function persistLibrary(){localStorage.setItem(LIBRARY_KEY,JSON.stringify(library))}
function save(msg){if(!state)return;if(msg){state.log.unshift({at:new Date().toISOString(),text:msg});state.log=state.log.slice(0,30)}const i=library.tournaments.findIndex(t=>t.id===state.id);if(i>=0)library.tournaments[i]=state;else library.tournaments.push(state);library.currentId=state.id;persistLibrary();if(remoteSession)syncTournament(state).catch(()=>toast("Sincronizzazione da riprovare"));toast(ONLINE?"Sincronizzato":"Salvato")}
function toast(text){const el=$("#toast");el.textContent=text;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,2200)}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function uid(p="id"){return p+"_"+Math.random().toString(36).slice(2,9)}
function seeded(seed){let h=2166136261;for(const c of seed)h=Math.imul(h^c.charCodeAt(0),16777619);return()=>((h=Math.imul(h^(h>>>15),2246822507))>>>0)/4294967296}
function shuffle(arr,seed){const a=[...arr],r=seeded(seed);for(let i=a.length-1;i;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function team(id){return state.teams.find(t=>t.id===id)}
function player(id){return state.players.find(p=>p.id===id)}
function nameTeam(id){return team(id)?.name||"Da definire"}
function pct(n,d){return d?Math.round(n/d*100)+"%":"—"}
function pageHead(kicker,title,sub,actions=""){return `<div class="page-head"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${sub}</p></div><div class="actions">${actions}</div></div>`}

function authHeaders(json=true){return{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${remoteSession?.access_token||SUPABASE_KEY}`,...(json?{"Content-Type":"application/json"}:{})}}
async function supabase(path,options={}){const r=await fetch(SUPABASE_URL+path,{...options,headers:{...authHeaders(options.body!==undefined),...(options.headers||{})}});if(!r.ok){const e=await r.json().catch(()=>({message:r.statusText}));throw Error(e.msg||e.message||e.error_description||"Errore Supabase")}if(r.status===204)return null;const text=await r.text();return text?JSON.parse(text):null}
function slugify(text){return String(text||"torneo").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,55)||"torneo"}
async function syncTournament(t){
 const data=JSON.parse(JSON.stringify(t)),publicData=JSON.parse(JSON.stringify(t));publicData.players?.forEach(p=>delete p.contact);publicData.teams?.forEach(x=>delete x.contact);publicData.log=[];
 const payload={owner_id:remoteSession.user.id,title:t.title,slug:t.slug||`${slugify(t.title)}-${Math.random().toString(36).slice(2,8)}`,data,public_data:publicData,is_public:t.isPublic!==false};
 if(t.remoteId){await supabase(`/rest/v1/tournaments?id=eq.${t.remoteId}`,{method:"PATCH",headers:{"Prefer":"return=minimal"},body:JSON.stringify(payload)})}
 else{const rows=await supabase("/rest/v1/tournaments",{method:"POST",headers:{"Prefer":"return=representation"},body:JSON.stringify(payload)});t.remoteId=rows[0].id;t.slug=rows[0].slug;persistLibrary()}
}
async function deleteRemoteTournament(t){if(t?.remoteId&&remoteSession)await supabase(`/rest/v1/tournaments?id=eq.${t.remoteId}`,{method:"DELETE",headers:{"Prefer":"return=minimal"}})}
async function loadRemoteLibrary(){
 const rows=await supabase("/rest/v1/tournaments?select=id,slug,title,data,created_at&order=created_at.desc");
 library={tournaments:rows.map(r=>Object.assign(blankState(),r.data,{remoteId:r.id,slug:r.slug,title:r.title})),currentId:null};persistLibrary();state=null;render();
}
function saveSession(session){remoteSession=session;localStorage.setItem(SESSION_KEY,JSON.stringify(session))}
async function restoreSession(){try{const s=JSON.parse(localStorage.getItem(SESSION_KEY)||"null");if(!s)return null;if(s.expires_at&&s.expires_at*1000>Date.now()+60000)return s;if(!s.refresh_token)return null;const r=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,{method:"POST",headers:{"apikey":SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:s.refresh_token})});if(!r.ok)return null;const fresh=await r.json();saveSession(fresh);return fresh}catch{return null}}
function showAuth(message=""){
 accessMode="viewer";$("#nav").hidden=true;document.body.dataset.role="viewer";$("#accessButton").hidden=true;$("#roleBadge").textContent="Accesso amministratore";
 main.innerHTML=`<section class="auth-shell"><div class="card auth-card"><div class="brand-mark" style="margin-bottom:16px">⚽</div><div class="eyebrow">Football Tournament Manager</div><h1>${authMode==="login"?"Accedi":"Crea account"}</h1><p class="muted">${message||"Gestisci e pubblica i tuoi tornei da qualsiasi dispositivo."}</p><form id="authForm" class="form-grid"><label class="field full">Email<input name="email" type="email" autocomplete="email" required></label>${authMode==="signup"?`<label class="field full">Nome<input name="display_name" autocomplete="name" required></label>`:""}<label class="field full">Password<input name="password" type="password" minlength="8" autocomplete="${authMode==="login"?"current-password":"new-password"}" required></label><div class="full actions auth-actions"><button type="submit" class="btn">${authMode==="login"?"Accedi":"Registrati"}</button><button type="button" class="btn secondary" data-action="toggle-auth">${authMode==="login"?"Registrati":"Torna al login"}</button></div></form></div></section>`;applyUiMode();
}
async function submitAuth(form){
 const d=Object.fromEntries(new FormData(form));try{
  if(authMode==="signup"){const result=await fetch(`${SUPABASE_URL}/auth/v1/signup`,{method:"POST",headers:{"apikey":SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify({email:d.email,password:d.password,data:{display_name:d.display_name}})}).then(async r=>{const x=await r.json();if(!r.ok)throw Error(x.msg||x.message);return x});if(!result.access_token){authMode="login";return showAuth("Controlla la tua email, conferma l’account e poi accedi.")}saveSession(result)}
  else{const result=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"apikey":SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify({email:d.email,password:d.password})}).then(async r=>{const x=await r.json();if(!r.ok)throw Error(x.error_description||x.msg||x.message);return x});saveSession(result)}
  accessMode="admin";$("#accessButton").hidden=false;await loadRemoteLibrary()
 }catch(err){showAuth(err.message)}
}
async function loadPublicTournament(slug){
 const rows=await fetch(`${SUPABASE_URL}/rest/v1/tournaments?slug=eq.${encodeURIComponent(slug)}&is_public=eq.true&select=id,slug,title,public_data`,{headers:{"apikey":SUPABASE_KEY}}).then(r=>r.json());
 if(!Array.isArray(rows)||!rows.length){state=null;library={tournaments:[],currentId:null};renderHub();main.insertAdjacentHTML("afterbegin",`<div class="warning">Torneo pubblico non trovato.</div>`);return}
 state=Object.assign(blankState(),rows[0].public_data,{remoteId:rows[0].id,slug:rows[0].slug,title:rows[0].title});library={tournaments:[state],currentId:state.id};accessMode="viewer";currentView="dashboard";render();
}
async function bootOnline(){const q=new URLSearchParams(location.search);if(q.get("view")==="public"&&q.get("slug"))return loadPublicTournament(q.get("slug"));remoteSession=await restoreSession();if(!remoteSession)return showAuth();accessMode="admin";await loadRemoteLibrary()}
async function shareTournament(){
 if(!state)return toast("Apri prima un torneo");
 try{if(!state.remoteId)await syncTournament(state);const link=new URL(location.href);link.search="";link.searchParams.set("view","public");link.searchParams.set("slug",state.slug);const url=link.toString(),qr=`https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&data=${encodeURIComponent(url)}`;modal(`<h2>Condividi torneo</h2><p class="muted">Chi apre questo collegamento vede calendario, risultati, classifiche e regolamento senza poter modificare nulla.</p><label class="field">Link pubblico<input id="publicLink" readonly value="${esc(url)}"></label><div class="qr-box"><img src="${qr}" alt="QR code del torneo" width="260" height="260"></div><div class="actions"><button class="btn" data-action="copy-public-link">Copia link</button><a class="btn secondary" href="${qr}" download="qr-${esc(state.slug)}.png" target="_blank" rel="noopener">Apri QR</a></div>`)}catch(err){toast(err.message)}
}

function render(){
  if(!state){renderHub();applyUiMode();return}
  $("#nav").hidden=false;
  document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===currentView));
  ({dashboard,registrations,teams,groups,matches,knockout,stats,rules}[currentView]||dashboard)();
  applyUiMode();
}
function renderHub(){
 $("#nav").hidden=true;
 main.innerHTML=`<div class="hub"><section class="hub-hero"><div class="eyebrow">Archivio tornei</div><h1>I tuoi tornei</h1><p class="muted">Ogni cartella conserva iscritti, calendario, risultati e statistiche separatamente.</p></section><div class="actions" style="margin:18px 0 24px"><button class="btn" data-action="new-tournament">+ Crea torneo</button></div>${library.tournaments.length?`<div class="folder-grid">${library.tournaments.map(t=>`<article class="card folder" data-open-tournament="${t.id}"><button class="folder-delete" data-delete-tournament="${t.id}" aria-label="Elimina ${esc(t.title)}">×</button><div class="folder-icon">📁</div><h2>${esc(t.title)}</h2><p class="muted">${new Date(t.createdAt).toLocaleDateString("it-IT")}</p><div class="folder-meta"><span class="badge">${t.players?.length||0} iscritti</span><span class="badge gray">${t.tables||4} biliardini</span><span class="badge gold">${t.matches?.filter(m=>m.played).length||0} risultati</span></div></article>`).join("")}</div>`:empty("Nessun torneo","Crea la prima cartella torneo per cominciare.")}</div>`;
}
function createTournament(){
 modal(`<h2>Nuovo torneo</h2><form id="newTournamentForm" class="form-grid"><label class="field full">Nome del torneo<input name="title" required autofocus placeholder="Es. Torneo Estate 2026"></label><label class="field">Biliardini disponibili<input name="tables" type="number" min="1" value="4" required></label><label class="field">Ore disponibili<input name="availableHours" type="number" min="1" step=".5" value="6" required></label><label class="field">Minuti per partita, cambio incluso<input name="matchMinutes" type="number" min="5" value="12" required></label><label class="field">Tipo iscrizione<select name="mode"><option value="single">Singoli</option><option value="team">Squadre</option></select></label><label class="field">Giocatori per squadra<select name="teamSize"><option value="2">2 giocatori</option><option value="3">3 giocatori</option></select></label><div class="full"><button class="btn">Crea cartella</button></div></form>`,()=>{const d=Object.fromEntries(new FormData($("#newTournamentForm")));state=blankState();state.title=d.title.trim();state.tables=Math.max(1,+d.tables||1);state.availableHours=Math.max(1,+d.availableHours||6);state.matchMinutes=Math.max(5,+d.matchMinutes||12);state.mode=d.mode;state.teamSize=+d.teamSize||2;save("Torneo creato");closeModal();currentView="dashboard";render()});
}
function dashboard(){
  const done=state.matches.filter(m=>m.played).length+state.knockout.filter(m=>m.played).length;
  const total=state.matches.length+state.knockout.length;
  const champ=getChampion(),paid=state.mode==="single"?state.players.length:state.teams.length*2,pot=Math.max(0,paid*(+state.entryFee||0)-(+state.fixedCosts||0));
  main.innerHTML=pageHead("Centro torneo",state.title,"Tutto il torneo, in un colpo d’occhio.",`<button class="btn" data-view="registrations">Gestisci iscrizioni</button>`) +
  (!state.teams.length?`<section class="setup-banner"><div><strong>Pronti a partire?</strong><p>Scegli il tipo di iscrizione e inserisci i partecipanti.</p></div><button class="btn" data-view="registrations">Configura torneo</button></section>`:"")+
  `<section class="grid kpis">
   ${kpi("Iscritti",state.mode==="single"?state.players.length:state.teams.length,"senza limite",Math.min(100,(state.mode==="single"?state.players.length:state.teams.length)/48*100))}
   ${kpi("Squadre",state.teams.length,`consigliate fino a ${capacityLimit(.85)}`,state.teams.length/Math.max(1,capacityLimit(.85))*100)}
   ${kpi("Partite",done,total?`/ ${total} concluse`:"calendario da creare",total?done/total*100:0)}
   ${kpi("Montepremi",pot?`€ ${pot.toFixed(0)}`:"—",pot?`1° ${state.prizeSplit?.[0]||50}% · 2° ${state.prizeSplit?.[1]||30}% · 3° ${state.prizeSplit?.[2]||20}%`:"non configurato",pot?100:0)}
  </section>
  <section class="grid two" style="margin-top:16px"><div class="card"><h2>Prossime partite</h2>${nextMatches()}</div>
  <div class="card"><h2>Attività recente</h2>${state.log.length?state.log.slice(0,6).map(l=>`<div class="activity"><span class="dot"></span><div>${esc(l.text)}<small>${new Date(l.at).toLocaleString("it-IT")}</small></div></div>`).join(""):`<div class="empty">Nessuna attività registrata.</div>`}</div></section>`;
}
function kpi(label,value,hint,progress){return `<div class="card kpi"><small>${label}</small><strong>${value}</strong><div class="hint">${hint}</div><div class="progress"><i style="width:${Math.min(100,progress||0)}%"></i></div></div>`}
function dynamicGroupSizes(teamCount){if(teamCount<2)return[];let groups=Math.max(1,Math.ceil(teamCount/4));while(groups>1&&Math.floor(teamCount/groups)<3)groups--;const base=Math.floor(teamCount/groups),extra=teamCount%groups;return Array.from({length:groups},(_,i)=>base+(i<extra?1:0))}
function suggestedKnockoutSize(teamCount){if(teamCount<4)return 2;const target=teamCount*.67,powers=[];for(let p=4;p<=teamCount;p*=2)powers.push(p);return powers.sort((a,b)=>Math.abs(a-target)-Math.abs(b-target))[0]||2}
function estimateTournament(teamCount){if(teamCount<2)return{matches:0,minutes:0,groups:0,ko:0};const sizes=dynamicGroupSizes(teamCount),groupMatches=sizes.reduce((s,n)=>s+n*(n-1)/2,0),ko=suggestedKnockoutSize(teamCount),tables=Math.max(1,state?.tables||4),slot=Math.max(5,state?.matchMinutes||12);let slots=Math.ceil(groupMatches/tables),roundMatches=ko/2;while(roundMatches>=1){slots+=Math.ceil(roundMatches/tables);roundMatches/=2}slots+=1;return{matches:groupMatches+ko,minutes:Math.ceil(slots*slot*1.08),groups:sizes.length,ko}}
function capacityLimit(ratio=1){const budget=(state.availableHours||6)*60*ratio;let best=4;for(let n=4;n<=256;n++)if(estimateTournament(n).minutes<=budget)best=n;return best}
function capacityPanel(){const currentTeams=state.mode==="single"?Math.floor(state.players.length/(state.teamSize||2)):state.teams.length,est=estimateTournament(currentTeams),recommended=capacityLimit(.85),maximum=capacityLimit(1),peopleRec=recommended*(state.teamSize||2),over=est.minutes>(state.availableHours||6)*60;return `<div class="capacity-panel ${over?"over":""}"><div><small>STIMA DI CAPIENZA</small><b>${recommended} squadre consigliate · ${maximum} al limite</b><span>${peopleRec} persone consigliate con rose da ${state.teamSize||2}</span></div><div><small>CONFIGURAZIONE ATTUALE</small><b>${currentTeams} squadre · circa ${Math.floor(est.minutes/60)}h ${est.minutes%60}m</b><span>${est.groups||"—"} gironi · fase finale da ${est.ko||"—"}</span></div></div>`}
function nextMatches(){const games=[...state.matches,...state.knockout].filter(m=>!m.played).slice(0,5);return games.length?games.map(m=>`<div class="record"><span>${esc(nameTeam(m.a))} <b>vs</b> ${esc(nameTeam(m.b))}</span><small class="muted">${m.table?`Turno ${m.slot} · Tavolo ${m.table}`:m.round}</small></div>`).join(""):`<div class="empty"><div class="icon">▤</div><h3>Nessuna partita in attesa</h3><p>Genera il calendario o completa il torneo.</p></div>`}

function registrations(){
  const count=state.mode==="single"?state.players.length:state.teams.length;
  main.innerHTML=pageHead("Fase 1","Iscrizioni",`${count} ${state.mode==="single"?"giocatori":"squadre"} registrati.`,`<button class="btn secondary test-btn" data-action="random-registrations">⚗ Dati casuali</button><a class="btn secondary" href="template-iscrizioni.xlsx" download>Scarica template Excel</a><label class="btn secondary file-btn">Importa Excel<input id="excelImport" type="file" accept=".xlsx,.csv"></label><button class="btn" data-action="open-registration">+ Nuova iscrizione</button>`) +
  `<div class="card"><div class="settings-strip"><label class="field">Nome torneo<input id="titleInput" value="${esc(state.title)}"></label><label class="field">Biliardini disponibili<input id="tablesInput" type="number" min="1" value="${state.tables||4}"></label><button class="btn secondary" data-action="save-settings">Salva impostazioni</button></div><div class="form-grid" style="margin-top:14px"><label class="field">Ore disponibili<input id="availableHoursInput" type="number" min="1" step=".5" value="${state.availableHours||6}"></label><label class="field">Minuti per partita, cambio incluso<input id="matchMinutesInput" type="number" min="5" value="${state.matchMinutes||12}"></label><label class="field">Giocatori per squadra<select id="teamSizeInput"><option value="2" ${(state.teamSize||2)===2?"selected":""}>2 giocatori</option><option value="3" ${state.teamSize===3?"selected":""}>3 giocatori</option></select></label><label class="field">Quota per giocatore (€)<input id="entryFeeInput" type="number" min="0" step=".01" value="${state.entryFee||0}"></label><label class="field">Costi da sottrarre (€)<input id="fixedCostsInput" type="number" min="0" step=".01" value="${state.fixedCosts||0}"></label><label class="field">Premi 1° / 2° / 3° (%)<input id="prizeSplitInput" value="${(state.prizeSplit||[50,30,20]).join("/")}"></label><label class="field">Ritiro squadra<select id="withdrawalPolicyInput"><option value="forfeit">6–0 a tavolino</option></select></label></div>${capacityPanel()}<div class="segmented" style="margin-top:18px"><button data-mode="single" class="${state.mode==="single"?"active":""}">Iscrizioni singole</button><button data-mode="team" class="${state.mode==="team"?"active":""}">Iscrizioni a squadre</button></div>
  <p class="muted">${state.mode==="single"?`Il registro non ha limiti. Tutti gli iscritti vengono usati per formare le squadre; in modalità da 2, un numero dispari crea una squadra da 3. La stima segnala soltanto se la durata prevista supera il tempo disponibile.`:"Il registro squadre non ha limiti. La stima di capienza è un avviso, non un blocco."}</p></div>
  <div class="card" style="margin-top:16px">${registrationTable()}</div>`;
}
function registrationTable(){
 if(state.mode==="single"){
  if(!state.players.length)return empty("Nessun giocatore","Inserisci il primo partecipante per iniziare.");
  return `<div class="table-wrap"><table><thead><tr><th>Giocatore</th><th>Contatto</th><th>Ruolo</th><th>Livello</th><th>Stato</th><th></th></tr></thead><tbody>${state.players.map(p=>{const active=state.teams.some(t=>t.playerIds?.includes(p.id));return`<tr><td><b>${esc(p.name)}</b></td><td>${esc(p.contact)}</td><td><span class="badge">${ROLE_LABEL[p.role]}</span></td><td>${LEVEL_LABEL[p.level]}</td><td><span class="badge ${active?"":"gold"}">${active?"Titolare":"Riserva"}</span></td><td><button class="btn small secondary" data-edit-player="${p.id}">Modifica</button> <button class="btn small secondary" data-delete-player="${p.id}">×</button></td></tr>`}).join("")}</tbody></table></div>`;
 }
 if(!state.teams.length)return empty("Nessuna squadra","Inserisci la prima coppia per iniziare.");
 return `<div class="table-wrap"><table><thead><tr><th>Squadra</th><th>Giocatori</th><th>Contatto</th><th></th></tr></thead><tbody>${state.teams.map(t=>`<tr><td><b>${esc(t.name)}</b></td><td>${esc(t.memberNames?.join(" · ")||"")}</td><td>${esc(t.contact||"")}</td><td><button class="btn small secondary" data-edit-team="${t.id}">Modifica</button> <button class="btn small secondary" data-delete-team="${t.id}">×</button></td></tr>`).join("")}</tbody></table></div>`;
}
function empty(title,text){return `<div class="empty"><div class="icon">＋</div><h3>${title}</h3><p>${text}</p></div>`}

function teams(){
 const ready=state.mode==="team"||state.players.length>=(state.teamSize||2);
 main.innerHTML=pageHead("Fase 2","Composizione squadre","Bilanciamento per ruolo e livello, con sorteggio ripetibile.",state.mode==="single"?`<button class="btn secondary" data-action="seed">Cambia seed</button><button class="btn" data-action="generate-teams" ${ready?"":"disabled"}>${state.teams.length?"Ripeti sorteggio":"Componi squadre"}</button>`:"")+
 `<div class="card"><div class="form-grid"><label class="field">Seed del sorteggio<input id="seedInput" value="${esc(state.seed)}" ${state.mode==="team"?"disabled":""}></label><label class="field">Tema nomi squadre<select id="themeInput">${Object.entries({sportive:"Sportivo",nazionali:"Nazionali",animali:"Animali",ironici:"Ironico da bar"}).map(([k,v])=>`<option value="${k}" ${state.nameTheme===k?"selected":""}>${v}</option>`).join("")}</select></label></div><p class="muted">Lo stesso seed e gli stessi iscritti producono lo stesso sorteggio. Il tema assegna i nomi iniziali; ogni nome può poi essere modificato liberamente.</p></div>
 <div style="margin-top:16px">${state.teams.length?`<div class="team-list">${state.teams.map(teamCard).join("")}</div>`:empty("Squadre non ancora composte","Completa le iscrizioni, poi avvia il sorteggio.")}</div>`;
}
function teamCard(t,i){const members=t.playerIds?.map(player).filter(Boolean)||[];return `<article class="team-card"><div class="team-name"><span>${esc(t.name)}</span><span class="badge ${t.withdrawn?"red":"gold"}">${t.withdrawn?"Ritirata":"#"+(i+1)}</span></div><div class="players">${members.length?members.map(p=>`<div><b>${esc(p.name)}</b> · ${ROLE_LABEL[p.role]} · ${LEVEL_LABEL[p.level]}</div>`).join(""):esc(t.memberNames?.join(" · ")||"")}</div><div class="actions" style="margin-top:10px"><button class="btn small secondary" data-rename-team="${t.id}">Rinomina</button>${state.mode==="single"?`<button class="btn small secondary" data-manual-team="${t.id}">Modifica coppia</button><button class="btn small secondary" data-substitute-team="${t.id}">Sostituzione</button>`:""}${state.groups.length&&!t.withdrawn?`<button class="btn small secondary" data-withdraw-team="${t.id}">Ritiro</button>`:""}</div></article>`}

function groups(){
 const sizes=dynamicGroupSizes(state.teams.length),est=estimateTournament(state.teams.length),over=est.minutes>(state.availableHours||6)*60;
 main.innerHTML=pageHead("Fase 3","Gironi",`${sizes.length||0} gironi dinamici · ${state.teams.length} squadre · fase finale prevista da ${est.ko}.`,`<button class="btn secondary" data-action="print">Stampa</button><button class="btn" data-action="generate-groups" ${state.teams.length<4?"disabled":""}>${state.groups.length?"Rigenera gironi":"Genera gironi"}</button>`)+
 (over?`<div class="warning">La durata stimata supera le ${state.availableHours||6} ore disponibili. Puoi procedere comunque oppure aumentare tempo/biliardini.</div>`:"")+
 (state.teams.length<4?`<div class="warning">Servono almeno 4 squadre per generare il torneo.</div>`:"")+
 (state.groups.length?`<div class="group-grid">${state.groups.map((g,i)=>groupCard(g,i)).join("")}</div>`:empty("Gironi non ancora generati","Componi le squadre e avvia il sorteggio."));
}
function groupLabel(i){return i<26?String.fromCharCode(65+i):String(i+1)}
function groupCard(g,i){const standings=getStandings(g),total=g.length*(g.length-1)/2;return `<article class="card group-card"><div class="group-title"><b>Girone ${groupLabel(i)}</b><span>${state.matches.filter(m=>m.group===i&&m.played).length}/${total}</span></div><div class="table-wrap"><table><thead><tr><th>#</th><th>Squadra</th><th>Pt</th><th>DR</th><th>GF</th></tr></thead><tbody>${standings.map((s,x)=>`<tr><td>${x+1}</td><td><b>${esc(nameTeam(s.id))}</b></td><td>${s.pts}</td><td>${s.gd>0?"+":""}${s.gd}</td><td>${s.gf}</td></tr>`).join("")}</tbody></table></div></article>`}

function matches(){
 const filtered=state.matches.filter(m=>matchFilter==="all"||String(m.group)===matchFilter);
 main.innerHTML=pageHead("Fase 4","Calendario e risultati",`Partite distribuite su ${state.tables||4} biliardini senza sovrapposizioni.`,`<button class="btn secondary test-btn" data-action="random-group-results" ${state.matches.length?"":"disabled"}>⚗ Risultati casuali</button><button class="btn secondary" data-action="print">Stampa</button>`)+
 `<div class="tabs"><button data-filter="all" class="${matchFilter==="all"?"active":""}">Tutte</button>${state.groups.map((_,i)=>`<button data-filter="${i}" class="${matchFilter==i?"active":""}">Girone ${groupLabel(i)}</button>`).join("")}</div>
 <div class="card">${filtered.length?filtered.map(matchRow).join(""):empty("Calendario assente","Genera i gironi per creare automaticamente tutte le partite.")}</div>`;
}
function matchRow(m){return `<div class="match-row"><span class="badge gray">T${m.slot} · Tav. ${m.table}</span><span style="text-align:right"><b>${esc(nameTeam(m.a))}</b></span><span class="match-score ${m.played?"":"pending"}">${m.played?`${m.ga} — ${m.gb}`:"—"}</span><span><b>${esc(nameTeam(m.b))}</b></span><button class="btn small ${m.played?"secondary":""}" data-result="${m.id}">${m.played?"Modifica":"Risultato"}</button></div>`}

function knockout(){
 const can=state.groups.length&&state.groups.every((g,i)=>state.matches.filter(m=>m.group===i).every(m=>m.played));
 const champ=getChampion();
 main.innerHTML=pageHead("Fase 5","Fase finale",`Tabellone dinamico da ${suggestedKnockoutSize(state.teams.length)} squadre.`,`${state.knockout.length?`<button class="btn secondary test-btn" data-action="random-knockout">⚗ Completa casualmente</button>`:""}<button class="btn secondary" data-action="print">Stampa</button>${!state.knockout.length?`<button class="btn" data-action="generate-knockout" ${can?"":"disabled"}>Crea tabellone</button>`:""}`)+
 (champ?`<div class="champion"><div class="cup">🏆</div><small>VINCITORE DEL TORNEO</small><h2>${esc(champ.name)}</h2><p>Congratulazioni!</p></div>`:"")+
 (!can&&!state.knockout.length?`<div class="warning">Completa tutte le partite dei gironi per creare la fase finale.</div>`:"")+
 (state.knockout.length?bracket():empty("Tabellone non ancora creato","La dimensione della fase finale verrà calcolata automaticamente."));
}
function knockoutRoundNames(size){const map={2:["Finale"],4:["Semifinali","Finale"],8:["Quarti","Semifinali","Finale"],16:["Ottavi","Quarti","Semifinali","Finale"],32:["Sedicesimi","Ottavi","Quarti","Semifinali","Finale"],64:["Trentaduesimi","Sedicesimi","Ottavi","Quarti","Semifinali","Finale"],128:["Sessantaquattresimi","Trentaduesimi","Sedicesimi","Ottavi","Quarti","Semifinali","Finale"]};return map[size]||["Finale"]}
function mainKnockoutRounds(){return [...new Set(state.knockout.filter(m=>m.round!=="3° posto").sort((a,b)=>(a.roundIndex??99)-(b.roundIndex??99)).map(m=>m.round))]}
function bracket(){const mainRounds=mainKnockoutRounds(),rounds=mainRounds.length>1?[...mainRounds.slice(0,-1),"3° posto",mainRounds.at(-1)]:mainRounds;return `<div class="bracket">${rounds.map(r=>`<section class="round"><h3>${r}</h3>${state.knockout.filter(m=>m.round===r).map(bracketMatch).join("")}</section>`).join("")}</div>`}
function bracketMatch(m){const winner=m.played?(m.ga>m.gb?m.a:m.b):null;return `<div class="bracket-match"><div class="bracket-team ${winner===m.a?"winner":""}"><span>${m.seedA?`<small class="muted">${m.seedA}</small> `:""}${esc(nameTeam(m.a))}</span><b>${m.played?m.ga:"—"}</b></div><div class="bracket-team ${winner===m.b?"winner":""}"><span>${m.seedB?`<small class="muted">${m.seedB}</small> `:""}${esc(nameTeam(m.b))}</span><b>${m.played?m.gb:"—"}</b></div><button class="btn small ${m.played?"secondary":""}" data-ko-result="${m.id}" ${!m.a||!m.b?"disabled":""}>${m.played?"Modifica":"Inserisci risultato"}</button></div>`}

function stats(){
 const rows=state.teams.map(t=>({t,...teamStats(t.id)})).sort((a,b)=>b.wins-a.wins||b.gf-a.gf);
 const topGF=[...rows].sort((a,b)=>b.gf-a.gf)[0],topWin=[...rows].sort((a,b)=>(b.played?b.wins/b.played:0)-(a.played?a.wins/a.played:0))[0];
 main.innerHTML=pageHead("Analisi","Statistiche","Prestazioni aggiornate automaticamente dopo ogni risultato.")+
 `<section class="grid kpis">${kpi("Gol totali",rows.reduce((a,r)=>a+r.gf,0),"nel torneo",100)}${kpi("Partite giocate",state.matches.filter(m=>m.played).length+state.knockout.filter(m=>m.played).length,"gironi + fase finale",100)}${kpi("Miglior attacco",topGF?.t.name||"—",topGF?`${topGF.gf} gol`:"nessun dato",100)}${kpi("Miglior % vittorie",topWin?.t.name||"—",topWin?pct(topWin.wins,topWin.played):"nessun dato",100)}</section>
 <div class="card" style="margin-top:16px"><h2>Statistiche squadre</h2><div class="table-wrap"><table><thead><tr><th>Squadra</th><th>PG</th><th>V</th><th>S</th><th>GF</th><th>GS</th><th>DR</th><th>% V</th><th>Andamento</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${esc(r.t.name)}</b></td><td>${r.played}</td><td>${r.wins}</td><td>${r.losses}</td><td>${r.gf}</td><td>${r.ga}</td><td>${r.gd}</td><td>${pct(r.wins,r.played)}</td><td>${r.form.map(x=>`<span class="badge ${x==="S"?"red":""}">${x}</span>`).join(" ")||"—"}</td></tr>`).join("")}</tbody></table></div></div>
 <div class="card" style="margin-top:16px"><h2>Statistiche giocatori</h2><p class="muted">Ogni giocatore eredita i risultati e i gol della propria squadra; i gol individuali non sono conteggiati perché il risultato registra il totale della coppia.</p>${state.mode==="single"?`<div class="table-wrap"><table><thead><tr><th>Giocatore</th><th>Squadra</th><th>Ruolo</th><th>PG</th><th>V</th><th>% V</th></tr></thead><tbody>${state.players.map(p=>{const t=state.teams.find(t=>t.playerIds?.includes(p.id)),s=t?teamStats(t.id):{played:0,wins:0};return`<tr><td><b>${esc(p.name)}</b></td><td>${esc(t?.name||"—")}</td><td>${ROLE_LABEL[p.role]}</td><td>${s.played}</td><td>${s.wins}</td><td>${pct(s.wins,s.played)}</td></tr>`}).join("")}</tbody></table></div>`:"<p>In modalità squadra non sono disponibili schede giocatore separate.</p>"}</div>
 <div class="card" style="margin-top:16px"><h2>Hall of Fame dei tornei</h2><p class="muted">Archivio delle edizioni concluse, senza ranking storico individuale.</p>${hallOfFame()}</div>`;
}
function teamStats(id){const games=[...state.matches,...state.knockout].filter(m=>m.played&&(m.a===id||m.b===id));let gf=0,ga=0,wins=0;const form=[];games.forEach(m=>{const home=m.a===id,a=home?m.ga:m.gb,b=home?m.gb:m.ga;gf+=a;ga+=b;wins+=a>b;form.push(a>b?"V":"S")});return{played:games.length,wins,losses:games.length-wins,gf,ga,gd:gf-ga,form:form.slice(-5)}}
function hallOfFame(){const completed=library.tournaments.map(t=>{const f=t.knockout?.find(m=>m.round==="Finale"&&m.played);if(!f)return null;const winnerId=f.ga>f.gb?f.a:f.b,winner=t.teams.find(x=>x.id===winnerId),games=[...(t.matches||[]),...(t.knockout||[])].filter(m=>m.played);let best=null;t.teams.forEach(tm=>{const gf=games.reduce((s,m)=>s+(m.a===tm.id?m.ga:m.b===tm.id?m.gb:0),0);if(!best||gf>best.gf)best={name:tm.name,gf}});return{title:t.title,winner:winner?.name||"—",best}}).filter(Boolean);return completed.length?`<div class="table-wrap"><table><thead><tr><th>Torneo</th><th>Campione</th><th>Miglior attacco</th></tr></thead><tbody>${completed.map(x=>`<tr><td><b>${esc(x.title)}</b></td><td>🏆 ${esc(x.winner)}</td><td>${esc(x.best?.name||"—")} · ${x.best?.gf||0} gol</td></tr>`).join("")}</tbody></table></div>`:`<div class="empty">Completa una finale per inaugurare la Hall of Fame.</div>`}

function rules(){
 main.innerHTML=pageHead("Guida ufficiale","Regolamento del torneo","Regole uniche valide su tutti i modelli di biliardino.",`<button class="btn secondary" data-action="print">Stampa regolamento</button>`)+
 `<article class="card rules"><h2>1. Formato</h2><p>Il numero di squadre non ha un limite fisso. Il sistema crea gironi il più possibile uniformi, normalmente da 4 squadre, e stima la durata usando biliardini, ore disponibili e minuti medi per partita. La stima è informativa e non blocca le iscrizioni. Se la modalità scelta è da 2 e il numero dei titolari è dispari, una sola squadra viene composta da 3 persone invece di escludere un iscritto.</p>
 <h2>2. Vittoria e punteggio</h2><ul><li>Vince la prima squadra che raggiunge <b>6 gol netti</b>.</li><li>Non è richiesto alcun vantaggio: il 6–5 conclude la partita.</li><li>Non sono ammessi pareggi né golden goal.</li><li>Vittoria: <b>3 punti</b>. Sconfitta: <b>0 punti</b>.</li></ul>
 <h2>3. Inizio e rimessa</h2><p>Prima della partita si effettua un sorteggio. Chi vince sceglie la prima palla oppure il lato del campo; l’avversario riceve l’altra opzione. La rimessa avviene dal centro. Dopo ogni gol rimette dal centro la squadra che lo ha subito.</p>
 <h2>4. Regole tecniche</h2><ul><li>Il gancio è vietato.</li><li>Il giro completo pulito è consentito nel rispetto della giocata; sono vietate rotazioni incontrollate.</li><li>È vietato scuotere, spostare o sollevare il tavolo.</li><li>È vietato toccare la pallina con le mani senza autorizzazione.</li><li>Non sono ammesse distrazioni volontarie o condotte antisportive.</li><li>Una pallina irraggiungibile viene rimessa in gioco dall’arbitro dal centro.</li></ul>
 <h2>5. Classifica e spareggi</h2><p>L’ordine è determinato da: 1) punti; 2) differenza reti; 3) gol fatti; 4) mini-classifica degli scontri tra tutte le squadre ancora a pari merito; 5) sorteggio stabile del sistema.</p>
 <h2>6. Qualificazione</h2><p>La dimensione della fase finale è scelta automaticamente tra 8, 16, 32, 64 o 128 squadre in proporzione ai partecipanti. Si qualificano prima le migliori classificate di ogni girone, poi le seconde, le terze e così via. Se i gironi hanno dimensioni diverse, il confronto tra pari posizione usa punti, differenza reti e gol fatti per partita, evitando di favorire chi ha disputato più incontri.</p>
 <h2>7. Fase finale</h2><p>La fase finale è a eliminazione diretta, sempre al primo che raggiunge 6 gol. Le qualificate ricevono un seed complessivo; al primo turno si evitano, quando possibile, rivincite dello stesso girone. Da quattro qualificate in su è prevista anche la finale per il terzo posto.</p>
 <h2>8. Riserve, sostituzioni e ritiri</h2><p>Gli iscritti che non completano una squadra sono riserve. Nelle rose da 3 giocano in due: il terzo può entrare durante un’interruzione di gioco, comunicando il cambio agli avversari; il numero dei cambi interni può essere stabilito dall’organizzazione. Una sostituzione definitiva con una riserva esterna deve essere autorizzata e registrata; il sostituito non può entrare in un’altra squadra. In caso di ritiro, tutte le partite del girone della squadra ritirata vengono assegnate 6–0 agli avversari.</p>
 <h2>9. Arbitraggio</h2><p>Le decisioni arbitrali sono definitive. Per casi non previsti, decide l’organizzazione tutelando uniformità, sicurezza e correttezza sportiva.</p></article>`;
}

function openRegistration(edit=null){
 if(state.mode==="single"){
  const p=edit?player(edit):null;
  modal(`<h2>${p?"Modifica":"Nuovo"} giocatore</h2><form id="registrationForm" class="form-grid">
  <label class="field full">Nome e cognome<input name="name" required value="${esc(p?.name||"")}"></label><label class="field">Contatto<input name="contact" required value="${esc(p?.contact||"")}"></label>
  <label class="field">Ruolo preferito<select name="role">${opts(ROLE_LABEL,p?.role)}</select></label><label class="field">Livello<select name="level">${opts(LEVEL_LABEL,p?.level)}</select></label>
  <div class="full actions"><button class="btn" type="submit">Salva giocatore</button></div></form>`,()=>{const f=$("#registrationForm"),d=Object.fromEntries(new FormData(f));if(p)Object.assign(p,d);else state.players.push({id:uid("p"),...d});save(p?"Giocatore modificato":"Giocatore iscritto");closeModal();render()});
 }else{
  const t=edit?team(edit):null;
  modal(`<h2>${t?"Modifica":"Nuova"} squadra</h2><form id="registrationForm" class="form-grid"><label class="field full">Nome squadra<input name="name" required value="${esc(t?.name||TEAM_NAMES[state.teams.length])}"></label><label class="field">Giocatore 1<input name="p1" required value="${esc(t?.memberNames?.[0]||"")}"></label><label class="field">Giocatore 2<input name="p2" required value="${esc(t?.memberNames?.[1]||"")}"></label>${state.teamSize===3?`<label class="field">Giocatore 3<input name="p3" required value="${esc(t?.memberNames?.[2]||"")}"></label>`:""}<label class="field full">Contatto<input name="contact" value="${esc(t?.contact||"")}"></label><div class="full"><button class="btn">Salva squadra</button></div></form>`,()=>{const d=Object.fromEntries(new FormData($("#registrationForm"))),members=[d.p1,d.p2];if(state.teamSize===3)members.push(d.p3);const obj={name:d.name,memberNames:members,contact:d.contact};if(t)Object.assign(t,obj);else state.teams.push({id:uid("t"),...obj});save(t?"Squadra modificata":"Squadra iscritta");closeModal();render()});
 }
}
function opts(map,val){return Object.entries(map).map(([k,v])=>`<option value="${k}" ${val===k?"selected":""}>${v}</option>`).join("")}
function modal(html,onSubmit){$("#modalBody").innerHTML=html;$("#modal").hidden=false;if(onSubmit)$("#modalBody form").addEventListener("submit",e=>{e.preventDefault();onSubmit(e)})}
function closeModal(){$("#modal").hidden=true}

function generateTeams(){
 if(state.players.length<2)return toast("Servono almeno due giocatori");
 state.seed=$("#seedInput")?.value||state.seed;
 state.nameTheme=$("#themeInput")?.value||state.nameTheme||"sportive";
 const size=state.teamSize||2,available=shuffle(state.players,state.seed).sort((a,b)=>LEVEL[b.level]-LEVEL[a.level]);
 const teamCount=Math.floor(available.length/size);if(!teamCount)return toast(`Servono almeno ${size} giocatori`);
 const targets=Array(teamCount).fill(size);if(size===2&&available.length%2===1)targets[0]=3;
 const squads=Array.from({length:teamCount},()=>[]);
 available.slice(0,targets.reduce((a,n)=>a+n,0)).forEach(p=>{const choices=squads.map((members,i)=>({i,members,target:targets[i]})).filter(x=>x.members.length<x.target);choices.sort((a,b)=>{const rolePenalty=x=>x.members.filter(q=>q.role===p.role&&p.role!=="indifferente").length*8,score=x=>x.members.reduce((s,q)=>s+LEVEL[q.level],0)*10+x.members.length*3+rolePenalty(x);return score(a)-score(b)||seeded(state.seed+p.id+a.i)()-seeded(state.seed+p.id+b.i)()});choices[0].members.push(p)});
 const names=NAME_THEMES[state.nameTheme]||TEAM_NAMES;
 state.teams=squads.map((ps,i)=>({id:uid("t"),name:names[i%names.length]+(i>=names.length?` ${Math.floor(i/names.length)+1}`:""),playerIds:ps.map(p=>p.id)}));
 state.groups=[];state.matches=[];state.knockout=[];save("Squadre composte con seed "+state.seed);render();
}
function manualTeam(id){
 const t=team(id),others=state.teams.filter(x=>x.id!==id);
 modal(`<h2>Modifica ${esc(t.name)}</h2><p class="muted">Scambia un giocatore con una delle altre squadre.</p><form id="swapForm" class="form-grid"><label class="field">Giocatore da spostare<select name="from">${t.playerIds.map(id=>`<option value="${id}">${esc(player(id)?.name)}</option>`)}</select></label><label class="field">Scambia con<select name="to">${others.flatMap(o=>o.playerIds.map(id=>`<option value="${id}">${esc(player(id)?.name)} · ${esc(o.name)}</option>`)).join("")}</select></label><div class="full"><button class="btn">Conferma scambio</button></div></form>`,()=>{const d=Object.fromEntries(new FormData($("#swapForm"))),other=state.teams.find(x=>x.playerIds.includes(d.to)),a=t.playerIds.indexOf(d.from),b=other.playerIds.indexOf(d.to);t.playerIds[a]=d.to;other.playerIds[b]=d.from;save("Scambio manuale effettuato");closeModal();render()});
}
function renameTeam(id){
 const t=team(id);modal(`<h2>Rinomina squadra</h2><form id="renameTeamForm"><label class="field">Nome squadra<input name="name" required maxlength="40" value="${esc(t.name)}"></label><div class="actions" style="margin-top:16px"><button class="btn">Salva nome</button></div></form>`,()=>{t.name=new FormData($("#renameTeamForm")).get("name").trim();save("Squadra rinominata");closeModal();render()});
}
function substituteTeam(id){
 const t=team(id),reserves=state.players.filter(p=>!state.teams.some(x=>x.playerIds?.includes(p.id)));
 if(!reserves.length)return toast("Non ci sono riserve disponibili");
 modal(`<h2>Sostituzione in ${esc(t.name)}</h2><p class="muted">La sostituzione viene registrata nello storico del torneo.</p><form id="subForm" class="form-grid"><label class="field">Giocatore uscente<select name="out">${t.playerIds.map(id=>`<option value="${id}">${esc(player(id)?.name)}</option>`).join("")}</select></label><label class="field">Riserva entrante<select name="in">${reserves.map(p=>`<option value="${p.id}">${esc(p.name)} · ${ROLE_LABEL[p.role]}</option>`).join("")}</select></label><div class="full"><button class="btn">Conferma sostituzione</button></div></form>`,()=>{const d=Object.fromEntries(new FormData($("#subForm"))),idx=t.playerIds.indexOf(d.out),old=player(d.out),incoming=player(d.in);t.playerIds[idx]=d.in;t.substitutions=t.substitutions||[];t.substitutions.push({out:d.out,in:d.in,at:new Date().toISOString()});save(`Sostituzione: ${incoming.name} per ${old.name} in ${t.name}`);closeModal();render()});
}
function withdrawTeam(id){
 const t=team(id);if(!confirm(`Ritirare ${t.name}? Tutte le partite del girone saranno assegnate 6–0 agli avversari.`))return;
 t.withdrawn=true;state.matches.filter(m=>m.a===id||m.b===id).forEach(m=>{m.played=true;if(m.a===id){m.ga=0;m.gb=6}else{m.ga=6;m.gb=0}m.note="Ritiro: risultato a tavolino"});
 state.knockout=[];save(`${t.name} ritirata: partite assegnate a tavolino`);render();
}
function randomRegistrations(){
 const first=["Luca","Marco","Giulia","Andrea","Sara","Matteo","Elena","Davide","Chiara","Simone","Francesca","Alessandro","Martina","Federico","Valentina","Stefano","Alice","Gabriele","Beatrice","Riccardo","Sofia","Nicola","Camilla","Tommaso"],last=["Rossi","Bianchi","Romano","Colombo","Ricci","Marino","Greco","Bruno","Gallo","Conti","De Luca","Mancini","Costa","Giordano","Rizzo","Lombardi","Moretti","Barbieri","Fontana","Santoro","Mariani","Ferrara","Caruso","Ferri"];
 if(state.mode==="single"){const start=state.players.length,target=Math.max((state.teamSize||2)*24,start+12);for(let i=start;i<target;i++)state.players.push({id:uid("p"),name:`${first[i%24]} ${last[(i*7+Math.floor(i/24)*5)%24]}`,contact:`test${i+1}@example.test`,role:["portiere","attaccante","indifferente"][i%3],level:["principiante","intermedio","esperto"][(i*2)%3]})}
 else{const start=state.teams.length,target=Math.max(24,start+6),names=NAME_THEMES[state.nameTheme||"sportive"];for(let i=start;i<target;i++){const members=[`${first[(i*3)%24]} ${last[i%24]}`,`${first[(i*3+1)%24]} ${last[(i+9)%24]}`];if(state.teamSize===3)members.push(`${first[(i*3+2)%24]} ${last[(i+15)%24]}`);state.teams.push({id:uid("t"),name:names[i%24]||`Squadra ${i+1}`,memberNames:members,contact:`team${i+1}@example.test`})}}
 save("Aggiunti dati casuali per il test");render();
}
function randomScore(){const loser=Math.floor(Math.random()*6);return Math.random()<.5?[6,loser]:[loser,6]}
function randomGroupResults(){state.matches.filter(m=>!m.played).forEach(m=>{[m.ga,m.gb]=randomScore();m.played=true;m.choice="Sorteggio casuale di test"});state.knockout=[];save("Risultati casuali inseriti nei gironi");render()}
function randomKnockout(){const rounds=mainKnockoutRounds(),ordered=rounds.length>1?[...rounds.slice(0,-1),"3° posto",rounds.at(-1)]:rounds;for(const round of ordered){state.knockout.filter(m=>m.round===round&&m.a&&m.b&&!m.played).forEach(m=>{[m.ga,m.gb]=randomScore();m.played=true});advanceKnockout()}save("Fase finale completata con risultati casuali");render()}
function generateGroups(){
 const ordered=shuffle(state.teams,state.seed+"-groups");
 const sizes=dynamicGroupSizes(ordered.length);state.groups=[];let cursor=0;sizes.forEach(n=>{state.groups.push(ordered.slice(cursor,cursor+n).map(t=>t.id));cursor+=n});
 const unscheduled=[];state.groups.forEach((g,gi)=>{for(let a=0;a<g.length;a++)for(let b=a+1;b<g.length;b++)unscheduled.push({id:uid("m"),group:gi,a:g[a],b:g[b],played:false})});
 state.matches=[];const maxTables=Math.max(1,+state.tables||1);let slot=1;
 while(unscheduled.length){const used=new Set();let table=1;for(let i=0;i<unscheduled.length&&table<=maxTables;){const m=unscheduled[i];if(!used.has(m.a)&&!used.has(m.b)){m.slot=slot;m.table=table++;used.add(m.a);used.add(m.b);state.matches.push(m);unscheduled.splice(i,1)}else i++}slot++}
 state.knockout=[];save("Gironi e calendario generati");render();
}
function resultModal(id,ko=false){
 const list=ko?state.knockout:state.matches,m=list.find(x=>x.id===id);
 const heading=ko?m.round:`Girone ${groupLabel(m.group)}`;
 modal(`<h2>${heading}</h2><p><b>${esc(nameTeam(m.a))}</b> contro <b>${esc(nameTeam(m.b))}</b></p><form id="resultForm" class="form-grid"><label class="field">${esc(nameTeam(m.a))}<input name="ga" type="number" min="0" max="6" required value="${m.played?m.ga:""}"></label><label class="field">${esc(nameTeam(m.b))}<input name="gb" type="number" min="0" max="6" required value="${m.played?m.gb:""}"></label><label class="field full">Sorteggio iniziale<select name="choice"><option>Squadra A: palla · Squadra B: campo</option><option>Squadra A: campo · Squadra B: palla</option></select></label><div class="full warning">Un risultato valido deve avere un solo vincitore a 6 gol.</div><div class="full"><button class="btn">Conferma risultato</button></div></form>`,()=>{const d=Object.fromEntries(new FormData($("#resultForm"))),ga=+d.ga,gb=+d.gb;if(ga===gb||Math.max(ga,gb)!==6)return toast("Inserisci un risultato valido: un solo 6");if(ko&&m.played)invalidateFollowingRounds(m.round);m.ga=ga;m.gb=gb;m.choice=d.choice;m.played=true;if(ko)advanceKnockout();save(`Risultato registrato: ${nameTeam(m.a)} ${ga}-${gb} ${nameTeam(m.b)}`);closeModal();render()});
}
function invalidateFollowingRounds(round){const source=state.knockout.find(m=>m.round===round),idx=source?.roundIndex;if(idx===undefined||round==="Finale"||round==="3° posto")return;state.knockout.filter(m=>m.round==="3° posto"||(m.roundIndex??-1)>idx).forEach(m=>{m.a=null;m.b=null;m.played=false;delete m.ga;delete m.gb})}
function getStandings(groupIds){
 const gi=state.groups.findIndex(g=>g===groupIds),games=state.matches.filter(m=>m.group===gi&&m.played);
 const rows=groupIds.map(id=>({id,group:gi,pts:0,gf:0,ga:0,gd:0,w:0,l:0,tie:seeded(state.seed+id)(),withdrawn:!!team(id)?.withdrawn}));
 games.forEach(m=>{const a=rows.find(x=>x.id===m.a),b=rows.find(x=>x.id===m.b);a.gf+=m.ga;a.ga+=m.gb;b.gf+=m.gb;b.ga+=m.ga;(m.ga>m.gb?a:b).pts+=3;(m.ga>m.gb?a:b).w++;(m.ga>m.gb?b:a).l++});
 rows.forEach(x=>{x.gd=x.gf-x.ga;x.played=x.w+x.l});
 const tied=new Map();rows.forEach(r=>{const key=`${r.pts}|${r.gd}|${r.gf}`;(tied.get(key)||tied.set(key,[]).get(key)).push(r)});
 tied.forEach(set=>{if(set.length<2)return;const ids=new Set(set.map(x=>x.id)),mini=games.filter(m=>ids.has(m.a)&&ids.has(m.b));set.forEach(r=>{r.miniPts=0;r.miniGf=0;r.miniGa=0});mini.forEach(m=>{const a=set.find(x=>x.id===m.a),b=set.find(x=>x.id===m.b);a.miniGf+=m.ga;a.miniGa+=m.gb;b.miniGf+=m.gb;b.miniGa+=m.ga;(m.ga>m.gb?a:b).miniPts+=3});set.forEach(r=>r.miniGd=r.miniGf-r.miniGa)});
 return rows.sort((a,b)=>a.withdrawn-b.withdrawn||b.pts-a.pts||b.gd-a.gd||b.gf-a.gf||(b.miniPts||0)-(a.miniPts||0)||(b.miniGd||0)-(a.miniGd||0)||(b.miniGf||0)-(a.miniGf||0)||a.tie-b.tie);
}
function qualifiers(){
 const ranks=state.groups.map(getStandings),rate=(x,k)=>(x.played?x[k]/x.played:0),cmp=(a,b)=>rate(b,"pts")-rate(a,"pts")||rate(b,"gd")-rate(a,"gd")||rate(b,"gf")-rate(a,"gf")||a.tie-b.tie,target=suggestedKnockoutSize(state.teams.length),all=[];let pos=0;
 while(all.length<target){const tier=ranks.map(r=>r[pos]).filter(Boolean).sort(cmp);if(!tier.length)break;all.push(...tier.slice(0,target-all.length));pos++}
 return {all};
}
function generateKnockout(){
 const q=qualifiers(),size=q.all.length,seededRows=q.all.map((x,i)=>({...x,seed:i+1})),top=seededRows.slice(0,size/2),bottom=seededRows.slice(size/2),pairs=[];
 top.forEach(a=>{let idx=-1;for(let i=bottom.length-1;i>=0;i--)if(bottom[i].group!==a.group){idx=i;break}if(idx<0)idx=bottom.length-1;const b=bottom.splice(idx,1)[0];pairs.push([a,b])});
 const rounds=knockoutRoundNames(size);state.knockout=pairs.map((p,i)=>({id:uid("ko"),round:rounds[0],roundIndex:0,index:i,a:p[0].id,b:p[1].id,seedA:p[0].seed,seedB:p[1].seed,played:false}));
 for(let ri=1;ri<rounds.length;ri++){const n=size/2**(ri+1);for(let i=0;i<n;i++)state.knockout.push({id:uid("ko"),round:rounds[ri],roundIndex:ri,index:i,a:null,b:null,played:false})}
 if(size>=4)state.knockout.push({id:uid("ko"),round:"3° posto",roundIndex:rounds.length-1,index:0,a:null,b:null,played:false});
 save(`Tabellone finale da ${size} squadre creato`);render();
}
function advanceKnockout(){const rounds=mainKnockoutRounds();for(let r=0;r<rounds.length-1;r++){const cur=state.knockout.filter(m=>m.round===rounds[r]),next=state.knockout.filter(m=>m.round===rounds[r+1]);cur.forEach((m,i)=>{if(m.played){const w=m.ga>m.gb?m.a:m.b;if(i%2===0)next[Math.floor(i/2)].a=w;else next[Math.floor(i/2)].b=w}})}const semis=state.knockout.filter(m=>m.round===rounds.at(-2)),third=state.knockout.find(m=>m.round==="3° posto");if(third&&semis.length===2&&semis.every(m=>m.played)){third.a=semis[0].ga<semis[0].gb?semis[0].a:semis[0].b;third.b=semis[1].ga<semis[1].gb?semis[1].a:semis[1].b}}
function getChampion(){const f=state.knockout.find(m=>m.round==="Finale"&&m.played);return f?team(f.ga>f.gb?f.a:f.b):null}

function applyUiMode(){
 document.documentElement.lang=uiLanguage;
 document.body.dataset.role=accessMode;
 $("#languageSelect").value=uiLanguage;
 $("#roleBadge").textContent=accessMode==="admin"?(uiLanguage==="en"?"Administrator":"Amministratore"):(uiLanguage==="en"?"Public viewer":"Visualizzatore");
 $("#accessButton").textContent=accessMode==="admin"?(uiLanguage==="en"?"Public view":"Vista pubblica"):(uiLanguage==="en"?"Admin login":"Login admin");
 $("#accessButton").dataset.action=accessMode==="admin"?"public-view":"admin-login";
 if(accessMode==="viewer"&&["registrations","teams"].includes(currentView)){currentView="dashboard";dashboard()}
 if(uiLanguage==="en")translateTree(document.body);
}
function translateTree(root){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 const entries=Object.entries(TRANSLATIONS).sort((a,b)=>b[0].length-a[0].length);
 nodes.forEach(n=>{let text=n.nodeValue;entries.forEach(([it,en])=>text=text.replaceAll(it,en));n.nodeValue=text});
 root.querySelectorAll("[placeholder]").forEach(el=>{if(TRANSLATIONS[el.placeholder])el.placeholder=TRANSLATIONS[el.placeholder]});
}
async function pinDigest(pin){const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(pin));return [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,"0")).join("")}
function enterPublicView(){
 accessMode="viewer";currentView=["registrations","teams"].includes(currentView)?"dashboard":currentView;
 const url=new URL(location.href);url.searchParams.set("view","public");if(state)url.searchParams.set("tournament",state.id);history.replaceState(null,"",url);render();
}
function openAdminLogin(){
 if(ONLINE&&remoteSession){accessMode="admin";const url=new URL(location.href);url.searchParams.delete("view");url.searchParams.delete("slug");history.replaceState(null,"",url);render();return}
 if(ONLINE){showAuth();return}
 const configured=!!localStorage.getItem(ADMIN_PIN_KEY);
 modal(`<h2>${configured?"Login amministratore":"Imposta accesso amministratore"}</h2><p class="muted">${configured?"Inserisci il PIN locale per riattivare i comandi.":"Questa è una protezione solo per la versione locale. Gli account online useranno un accesso sicuro con email."}</p><form id="adminLoginForm"><label class="field">PIN<input name="pin" type="password" inputmode="numeric" minlength="4" required autocomplete="${configured?"current-password":"new-password"}"></label><div class="actions" style="margin-top:16px"><button class="btn">${configured?"Accedi":"Salva PIN"}</button></div></form>`,async()=>{const pin=new FormData($("#adminLoginForm")).get("pin"),digest=await pinDigest(pin),saved=localStorage.getItem(ADMIN_PIN_KEY);if(saved&&saved!==digest)return toast("PIN non corretto");if(!saved)localStorage.setItem(ADMIN_PIN_KEY,digest);accessMode="admin";const url=new URL(location.href);url.searchParams.delete("view");url.searchParams.delete("tournament");history.replaceState(null,"",url);closeModal();render();toast("Modalità amministratore attiva")});
 applyUiMode();
}

document.addEventListener("click",e=>{
 const b=e.target.closest("button");
 if(b?.dataset.deleteTournament){openDeleteConfirmation(b.dataset.deleteTournament);return}
 const folder=e.target.closest("[data-open-tournament]");if(folder){state=library.tournaments.find(t=>t.id===folder.dataset.openTournament);library.currentId=state.id;persistLibrary();currentView="dashboard";render();return}
 if(!b)return;
 if(b.dataset.action==="toggle-auth"){authMode=authMode==="login"?"signup":"login";showAuth();return}
 if(b.dataset.action==="copy-public-link"){navigator.clipboard.writeText($("#publicLink").value).then(()=>toast("Link copiato"));return}
 if(b.dataset.action==="logout"){localStorage.removeItem(SESSION_KEY);remoteSession=null;library={tournaments:[],currentId:null};state=null;authMode="login";showAuth("Sessione terminata.");return}
 if(b.dataset.action==="share"){shareTournament();return}
 if(b.dataset.action==="public-view"){enterPublicView();return}
 if(b.dataset.action==="admin-login"){openAdminLogin();return}
 if(accessMode==="viewer"&&!b.dataset.view&&b.dataset.action!=="print"&&b.dataset.filter===undefined)return;
 if(b.dataset.action==="home"){state=null;render();return}
 if(b.dataset.action==="new-tournament")createTournament();
 if(b.dataset.view){currentView=b.dataset.view;render()}
 if(b.dataset.mode&&b.dataset.mode!==state.mode){if((state.players.length||state.teams.length)&&!confirm("Cambiare modalità azzera iscrizioni, squadre e risultati. Continuare?"))return;const keep={id:state.id,title:state.title,tables:state.tables,availableHours:state.availableHours,matchMinutes:state.matchMinutes,teamSize:state.teamSize,entryFee:state.entryFee,fixedCosts:state.fixedCosts,prizeSplit:state.prizeSplit,createdAt:state.createdAt};state=Object.assign(blankState(),keep,{mode:b.dataset.mode});save("Modalità iscrizione impostata");render()}
 if(b.dataset.action==="open-registration")openRegistration();
 if(b.dataset.action==="close-modal")closeModal();
 if(b.dataset.action==="generate-teams")generateTeams();
 if(b.dataset.action==="seed"){state.seed=Math.random().toString(36).slice(2,10).toUpperCase();save("Nuovo seed generato");render()}
 if(b.dataset.action==="generate-groups")generateGroups();
 if(b.dataset.action==="generate-knockout")generateKnockout();
 if(b.dataset.action==="random-registrations")randomRegistrations();
 if(b.dataset.action==="random-group-results")randomGroupResults();
 if(b.dataset.action==="random-knockout")randomKnockout();
 if(b.dataset.action==="print")window.print();
 if(b.dataset.action==="export")exportJSON();
 if(b.dataset.action==="reset")resetAll();
 if(b.dataset.action==="save-settings"){const split=$("#prizeSplitInput").value.split(/[\\/,-]/).map(Number),newTables=Math.max(1,+$("#tablesInput").value||1),newSize=+$("#teamSizeInput").value||2,tablesChanged=newTables!==state.tables,sizeChanged=newSize!==(state.teamSize||2);if(split.length!==3||split.some(x=>!Number.isFinite(x))||split.reduce((a,x)=>a+x,0)!==100)return toast("Le percentuali premio devono sommare 100");if((tablesChanged&&state.matches.length||sizeChanged&&state.teams.length)&&!confirm("Questa modifica richiede di rigenerare squadre e/o calendario. Continuare?"))return;state.title=$("#titleInput").value.trim()||state.title;state.tables=newTables;state.availableHours=Math.max(1,+$("#availableHoursInput").value||6);state.matchMinutes=Math.max(5,+$("#matchMinutesInput").value||12);state.teamSize=newSize;state.entryFee=Math.max(0,+$("#entryFeeInput").value||0);state.fixedCosts=Math.max(0,+$("#fixedCostsInput").value||0);state.prizeSplit=split;state.withdrawalPolicy=$("#withdrawalPolicyInput").value;if(sizeChanged){state.teams=[];state.groups=[];state.matches=[];state.knockout=[]}else if(tablesChanged){state.matches=[];state.knockout=[]}save("Impostazioni torneo aggiornate");render()}
 if(b.dataset.editPlayer)openRegistration(b.dataset.editPlayer);
 if(b.dataset.editTeam)openRegistration(b.dataset.editTeam);
 if(b.dataset.deletePlayer&&confirm("Eliminare questo giocatore?")){state.players=state.players.filter(p=>p.id!==b.dataset.deletePlayer);state.teams=[];state.groups=[];state.matches=[];state.knockout=[];save("Giocatore eliminato");render()}
 if(b.dataset.deleteTeam&&confirm("Eliminare questa squadra?")){state.teams=state.teams.filter(t=>t.id!==b.dataset.deleteTeam);state.groups=[];state.matches=[];state.knockout=[];save("Squadra eliminata");render()}
 if(b.dataset.manualTeam)manualTeam(b.dataset.manualTeam);
 if(b.dataset.renameTeam)renameTeam(b.dataset.renameTeam);
 if(b.dataset.substituteTeam)substituteTeam(b.dataset.substituteTeam);
 if(b.dataset.withdrawTeam)withdrawTeam(b.dataset.withdrawTeam);
 if(b.dataset.result)resultModal(b.dataset.result);
 if(b.dataset.koResult)resultModal(b.dataset.koResult,true);
 if(b.dataset.filter!==undefined){matchFilter=b.dataset.filter;render()}
});
$("#modal").addEventListener("click",e=>{if(e.target===$("#modal"))closeModal()});
$("#importFile").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!x.version||!Array.isArray(x.teams))throw 0;state=Object.assign(blankState(),x);save("Archivio JSON importato");currentView="dashboard";render()}catch{toast("File JSON non valido")}};r.readAsText(f);e.target.value=""});
function exportJSON(){if(!state)return toast("Apri prima un torneo");const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="torneo-calcio-balilla.json";a.click();URL.revokeObjectURL(a.href)}
function openDeleteConfirmation(id){const target=library.tournaments.find(t=>t.id===id);if(!target)return;modal(`<h2>Elimina torneo</h2><p>Stai per cancellare definitivamente <b>${esc(target.title)}</b>, con iscritti, risultati e statistiche.</p><div class="warning">Per confermare, digita <b>ELIMINA</b>.</div><form id="deleteTournamentForm" style="margin-top:16px"><label class="field">Conferma<input name="code" autocomplete="off" placeholder="ELIMINA" required></label><div class="actions" style="margin-top:16px"><button class="btn danger-confirm">Elimina definitivamente</button><button type="button" class="btn secondary" data-action="close-modal">Annulla</button></div></form>`,async()=>{const code=new FormData($("#deleteTournamentForm")).get("code");if(code!=="ELIMINA")return toast("Scrivi ELIMINA per confermare");try{await deleteRemoteTournament(target)}catch{return toast("Eliminazione online non riuscita")}library.tournaments=library.tournaments.filter(t=>t.id!==id);if(state?.id===id)state=null;persistLibrary();closeModal();render();toast("Torneo eliminato")})}
function resetAll(){if(!state)return toast("Apri una cartella oppure usa × per eliminarla");openDeleteConfirmation(state.id)}
document.addEventListener("change",async e=>{if(e.target.id!=="excelImport")return;const f=e.target.files[0];if(!f)return;try{const rows=f.name.toLowerCase().endsWith(".csv")?parseCSV(await f.text()):await readXlsx(f);importRows(rows);save(`${Math.max(0,rows.length-1)} righe importate da Excel`);render()}catch(err){console.error(err);toast("Impossibile leggere il file Excel")}e.target.value=""});
$("#languageSelect").addEventListener("change",e=>{uiLanguage=e.target.value;localStorage.setItem(LANGUAGE_KEY,uiLanguage);const q=new URLSearchParams(location.search);if(ONLINE&&!remoteSession&&q.get("view")!=="public")showAuth();else render()});
document.addEventListener("submit",e=>{if(e.target.id==="authForm"){e.preventDefault();submitAuth(e.target)}});
function parseCSV(text){return text.split(/\r?\n/).filter(Boolean).map(line=>line.split(/[;,]/).map(x=>x.trim()))}
function importRows(rows){
 const headerIndex=rows.findIndex(r=>r.some(x=>["nome","nome e cognome","name","squadra","nome squadra","team"].includes(String(x||"").toLowerCase().trim())));if(headerIndex<0)throw Error("Intestazioni non riconosciute");
 const header=rows[headerIndex].map(x=>String(x||"").toLowerCase().trim()),data=rows.slice(headerIndex+1),col=(...names)=>header.findIndex(h=>names.includes(h));
 if(state.mode==="single"){const ni=col("nome","nome e cognome","name"),ci=col("contatto","telefono","contact"),ri=col("ruolo","ruolo preferito","role"),li=col("livello","level");if(ni<0)throw Error("Colonna nome assente");data.forEach(r=>{if(!r[ni])return;state.players.push({id:uid("p"),name:String(r[ni]).trim(),contact:String(r[ci]||""),role:normalizeRole(r[ri]),level:normalizeLevel(r[li])})})}
 else{const ti=col("squadra","nome squadra","team"),p1=col("giocatore 1","player 1"),p2=col("giocatore 2","player 2"),p3=col("giocatore 3","player 3"),ci=col("contatto","telefono","contact");if(ti<0||p1<0||p2<0||(state.teamSize===3&&p3<0))throw Error("Colonne squadra mancanti");data.forEach(r=>{if(r[ti]){const members=[String(r[p1]||""),String(r[p2]||"")];if(state.teamSize===3)members.push(String(r[p3]||""));state.teams.push({id:uid("t"),name:String(r[ti]),memberNames:members,contact:String(r[ci]||"")})}})}
}
function normalizeRole(x=""){x=String(x).toLowerCase();return x.startsWith("p")?"portiere":x.startsWith("a")?"attaccante":"indifferente"}
function normalizeLevel(x=""){x=String(x).toLowerCase();return x.startsWith("e")?"esperto":x.startsWith("p")?"principiante":"intermedio"}
async function readXlsx(file){
 const bytes=new Uint8Array(await file.arrayBuffer()),view=new DataView(bytes.buffer);let eocd=-1;for(let i=bytes.length-22;i>=Math.max(0,bytes.length-66000);i--)if(view.getUint32(i,true)===0x06054b50){eocd=i;break}if(eocd<0)throw Error("ZIP non valido");
 const count=view.getUint16(eocd+10,true),offset=view.getUint32(eocd+16,true),files={};let p=offset;
 for(let i=0;i<count;i++){if(view.getUint32(p,true)!==0x02014b50)break;const method=view.getUint16(p+10,true),size=view.getUint32(p+20,true),nameLen=view.getUint16(p+28,true),extra=view.getUint16(p+30,true),comment=view.getUint16(p+32,true),local=view.getUint32(p+42,true),name=new TextDecoder().decode(bytes.slice(p+46,p+46+nameLen));files[name]={method,size,local};p+=46+nameLen+extra+comment}
 async function entry(name){const f=files[name];if(!f)throw Error("Voce XLSX assente");const n=view.getUint16(f.local+26,true),x=view.getUint16(f.local+28,true),start=f.local+30+n+x,raw=bytes.slice(start,start+f.size);if(f.method===0)return new TextDecoder().decode(raw);const ds=new DecompressionStream("deflate-raw"),ab=await new Response(new Blob([raw]).stream().pipeThrough(ds)).arrayBuffer();return new TextDecoder().decode(ab)}
 const parser=new DOMParser(),shared=files["xl/sharedStrings.xml"]?[...parser.parseFromString(await entry("xl/sharedStrings.xml"),"text/xml").querySelectorAll("si")].map(si=>si.textContent):[];
 const xml=parser.parseFromString(await entry("xl/worksheets/sheet1.xml"),"text/xml"),out=[];for(const row of xml.querySelectorAll("row")){const arr=[];for(const c of row.querySelectorAll("c")){const ref=c.getAttribute("r"),idx=ref.match(/[A-Z]+/)[0].split("").reduce((a,ch)=>a*26+ch.charCodeAt(0)-64,0)-1,v=c.querySelector("v")?.textContent||"",type=c.getAttribute("t");arr[idx]=type==="s"?shared[+v]:type==="inlineStr"?c.querySelector("is")?.textContent:v}out.push(arr)}return out
}
const requestedTournament=new URLSearchParams(location.search).get("tournament");
state=requestedTournament?library.tournaments.find(t=>t.id===requestedTournament)||null:null;
if(ONLINE)bootOnline().catch(err=>showAuth(err.message));else render();
