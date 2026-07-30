const STORAGE_KEY="calcio-balilla-manager-v1", LIBRARY_KEY="calcio-balilla-library-v2";
const SUPABASE_URL="https://vmcszhtifjnlznauybku.supabase.co";
const SUPABASE_KEY="sb_publishable_dk9G6ZpeY15QkeJsj2MQRg_9kRTIKXx";
const SESSION_KEY="foosball-supabase-session";
const USERNAME_EMAIL_KEY="foosball-username-email-v1";
const ONLINE=true;
let remoteSession=null,authMode="login";
const LANGUAGE_KEY="calcio-balilla-language", ADMIN_PIN_KEY="calcio-balilla-admin-pin", THEME_KEY="calcio-balilla-theme";
let uiLanguage=localStorage.getItem(LANGUAGE_KEY)||"it";
let uiTheme=localStorage.getItem(THEME_KEY)||"light",syncInFlight=0;
let accessMode=new URLSearchParams(location.search).get("view")==="public"?"viewer":"admin";
const TRANSLATIONS={
 "Organizzatore":"Organizer","Visualizzatore":"Public viewer","Vista pubblica":"Public view","Login organizzatore":"Organizer login",
 "Salvato in locale":"Saved locally","Esporta":"Export","Importa":"Import","Iscrizioni":"Registrations","Squadre":"Teams","Formato":"Format","Gironi":"Groups","Partite":"Matches","Fase finale":"Knockout","Statistiche":"Statistics","Regolamento":"Rules",
 "Archivio tornei":"Tournament archive","I miei tornei":"My tournaments","I tuoi tornei":"Your tournaments","Crea torneo":"Create tournament","Nessun torneo":"No tournaments","Centro torneo":"Tournament center",
 "Gestisci iscrizioni":"Manage registrations","Configura torneo":"Set up tournament","Iscritti":"Entrants","Montepremi":"Prize pool","Prossime partite":"Upcoming matches","Attività recente":"Recent activity",
 "Fase 1":"Step 1","Fase 2":"Step 2","Fase 3":"Step 3","Fase 4":"Step 4","Fase 5":"Step 5","Analisi":"Analysis","Guida ufficiale":"Official guide",
 "Composizione squadre":"Team composition","Formato torneo":"Tournament format","Gironi + playoff":"Groups + playoffs","Girone unico":"Single league","Eliminazione diretta":"Single elimination","Campionato + playoff":"League + playoffs","Calendario e risultati":"Schedule and results","Regolamento del torneo":"Tournament rules","Dati casuali":"Random data",
 "Scarica template Excel":"Download Excel template","Importa Excel":"Import Excel","Nuova iscrizione":"New registration","Nome torneo":"Tournament name","Biliardini disponibili":"Available tables",
 "Ore disponibili":"Available hours","Giocatori per squadra":"Players per team","Salva impostazioni":"Save settings","Iscrizioni singole":"Individual registration","Iscrizioni a squadre":"Team registration",
 "Giocatore":"Player","Contatto":"Contact","Ruolo":"Role","Livello":"Level","Stato":"Status","Portiere":"Goalkeeper","Attaccante":"Forward","Indifferente":"Either",
 "Principiante":"Beginner","Intermedio":"Intermediate","Esperto":"Expert","Titolare":"Starter","Riserva":"Reserve","Modifica":"Edit","Rinomina":"Rename","Sostituzione":"Substitution",
 "Ritiro":"Withdraw","Cambia seed":"Change seed","Componi squadre":"Create teams","Ripeti sorteggio":"Draw again","Stampa":"Print","Genera gironi":"Generate groups","Rigenera gironi":"Regenerate groups",
 "Tutte":"All","Risultato":"Result","Inserisci risultato":"Enter result","Completa casualmente":"Fill randomly","Crea tabellone":"Create bracket","VINCITORE DEL TORNEO":"TOURNAMENT WINNER",
 "Congratulazioni!":"Congratulations!","Statistiche squadre":"Team statistics","Statistiche giocatori":"Player statistics","Hall of Fame dei tornei":"Tournament Hall of Fame","Stampa regolamento":"Print rules",
 "Benvenuto nel tuo portale tornei":"Welcome to your tournament portal","Accedi o registrati per organizzare un torneo di calcio balilla dall’iscrizione fino alla proclamazione del vincitore.":"Log in or sign up to organize a table football tournament from registration to the final winner.",
 "Crea il torneo":"Create the tournament","Imposta partecipanti, squadre, tempo e biliardini.":"Set participants, teams, time and available tables.","Scegli la formula":"Choose the format","Gironi, campionato, playoff oppure eliminazione diretta.":"Groups, league, playoffs or single elimination.",
 "Gioca e condividi":"Play and share","Inserisci i risultati e pubblica il tabellone tramite QR.":"Enter results and share the tournament using a QR code.","Area organizzatori":"Organizer area","Crea il tuo account":"Create your account","Inserisci le tue credenziali per iniziare.":"Enter your credentials to get started.",
 "Registrati gratuitamente per creare e gestire i tuoi tornei.":"Sign up for free to create and manage your tournaments.","Non hai un account? Registrati":"No account? Sign up","Hai già un account? Accedi":"Already registered? Log in","Accedi":"Log in","Registrati":"Sign up","Indietro":"Back","Avanti":"Next",
 "Scegli la struttura più adatta a partecipanti, tempo e biliardini.":"Choose the format that best fits the participants, time and tables.","Componi almeno 2 squadre per ottenere stime attendibili.":"Create at least 2 teams to obtain reliable estimates.",
 "Configurazione usata per la stima":"Configuration used for the estimate","La scelta può essere cambiata finché non sono stati inseriti risultati. Cambiandola, gironi, calendario e tabellone vengono rigenerati.":"You can change the format until results have been entered. Changing it regenerates the groups, schedule and bracket.",
 "Selezionata":"Selected","Formato attivo":"Active format","Scegli formato":"Choose format","partite":"matches","stimate":"estimated","garantite":"guaranteed","Supera il tempo":"Exceeds available time","Compatibile":"Fits the schedule",
 "Avanti: scegli il formato":"Next: choose the format","Avanti: genera la struttura":"Next: generate the structure","Avanti: inserisci i risultati":"Next: enter results","Avanti: vai al tabellone":"Next: open the bracket","Avanti: fase finale":"Next: knockout stage","Avanti: proclama il vincitore":"Next: declare the winner","Avanti: statistiche":"Next: statistics",
 "Servono almeno 2 squadre":"At least 2 teams are required","Genera prima la struttura":"Generate the structure first","Completa tutte le partite per proseguire":"Complete every match to continue","Il vincitore apparirà al termine del torneo":"The winner will appear when the tournament is complete",
 "Ogni cartella conserva iscritti, calendario, risultati e statistiche separatamente.":"Each folder keeps entrants, schedule, results and statistics separate.","Prestazioni aggiornate automaticamente dopo ogni risultato.":"Performance updates automatically after every result.",
 "Tutto il torneo, in un colpo d’occhio.":"Your entire tournament at a glance.","Pronti a partire?":"Ready to start?","Scegli il tipo di iscrizione e inserisci i partecipanti.":"Choose the registration type and add participants.","senza limite":"no fixed limit","calendario da creare":"schedule to create","non configurato":"not configured",
 "Bilanciamento per ruolo e livello, con sorteggio ripetibile.":"Balanced by role and level, with a repeatable draw.","Seed del sorteggio":"Draw seed","Tema nomi squadre":"Team-name theme","Sportivo":"Sport","Nazionali":"National teams","Animali":"Animals","Ironico da bar":"Funny pub names",
 "Calendario assente":"No schedule","Tabellone non ancora creato":"Bracket not created","Nessuna attività registrata.":"No activity recorded.","Nessuna partita in attesa":"No pending matches","Genera il calendario o completa il torneo.":"Generate the schedule or complete the tournament.",
 "Gol totali":"Total goals","Partite giocate":"Matches played","Miglior attacco":"Best attack","Miglior % vittorie":"Best win rate","nel torneo":"in the tournament","nessun dato":"no data","Andamento":"Form","Scuro":"Dark","Chiaro":"Light",
 "Condividi torneo":"Share tournament","Copia link":"Copy link","Apri QR":"Open QR","Link pubblico":"Public link"
};
const LIMITS={title:80,name:60,contact:120,seed:40};
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
const TOURNAMENT_FORMATS={
 classic:{name:"Gironi + playoff",tag:"Consigliata",description:"Gironi equilibrati e successiva eliminazione diretta. Garantisce più partite a tutti."},
 league:{name:"Girone unico",tag:"Campionato",description:"Tutti contro tutti una volta. Vince la prima squadra della classifica finale."},
 knockout:{name:"Eliminazione diretta",tag:"Più veloce",description:"Tabellone immediato con passaggi automatici quando il numero di squadre non è una potenza di due."},
 league_playoff:{name:"Campionato + playoff",tag:"Stile Carmagnola",description:"Tutti contro tutti, poi le migliori 4 o 8 accedono al tabellone finale."}
};
const TOURNAMENT_FORMATS_EN={
 classic:{name:"Groups + playoffs",tag:"Recommended",description:"Balanced groups followed by a knockout stage. It guarantees several matches for every team."},
 league:{name:"Single league",tag:"League",description:"Every team plays every other team once. The top team in the final standings wins."},
 knockout:{name:"Single elimination",tag:"Fastest",description:"An immediate bracket with automatic byes when the number of teams is not a power of two."},
 league_playoff:{name:"League + playoffs",tag:"Carmagnola style",description:"Every team plays every other team, then the best 4 or 8 teams advance to the final bracket."}
};

function blankState(){
  return {version:2,id:uid("tournament"),experience:"complete",mode:"single",teamSize:2,tournamentFormat:"classic",title:"Nuovo torneo",tables:4,availableHours:6,matchMinutes:12,seed:"BALILLA-2026",nameTheme:"sportive",entryFee:0,fixedCosts:0,prizeSplit:[50,30,20],withdrawalPolicy:"forfeit",players:[],teams:[],groups:[],matches:[],knockout:[],createdAt:new Date().toISOString(),log:[]};
}
let library=loadLibrary(), state=null, currentView="dashboard", matchFilter="all";
const $=s=>document.querySelector(s), main=$("#main");

function loadLibrary(){try{const x=JSON.parse(localStorage.getItem(LIBRARY_KEY)||"null");if(x?.tournaments)return x;const old=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");if(old){const migrated=Object.assign(blankState(),old,{id:uid("tournament"),version:2,tables:old.tables||4});return{tournaments:[migrated],currentId:migrated.id}}}catch{}return{tournaments:[],currentId:null}}
function persistLibrary(){localStorage.setItem(LIBRARY_KEY,JSON.stringify(library))}
function save(msg){if(!state)return;if(msg){state.log.unshift({at:new Date().toISOString(),text:msg});state.log=state.log.slice(0,30)}const i=library.tournaments.findIndex(t=>t.id===state.id);if(i>=0)library.tournaments[i]=state;else library.tournaments.push(state);library.currentId=state.id;persistLibrary();if(remoteSession){syncInFlight++;updateSaveState();syncTournament(state).then(()=>toast("Sincronizzato online")).catch(()=>toast("Salvato sul dispositivo · sincronizzazione da riprovare")).finally(()=>{syncInFlight--;updateSaveState()})}else toast("Salvato sul dispositivo")}
function toast(text){const el=$("#toast");el.textContent=text;el.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>el.hidden=true,2200)}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function cleanText(v,max){return String(v??"").replace(/\s+/g," ").trim().slice(0,max)}
function validName(v){return /[\p{L}\p{N}]/u.test(cleanText(v,LIMITS.name))}
function normalizedName(v){return cleanText(v,LIMITS.name).toLocaleLowerCase("it-IT")}
function duplicateName(list,name,ignoreId=null){const key=normalizedName(name);return list.some(x=>x.id!==ignoreId&&normalizedName(x.name)===key)}
function updateSaveState(){const el=$("#saveState");if(!el)return;el.textContent=syncInFlight?"● Sincronizzazione…":remoteSession?"● Sincronizzato online":"● Salvato sul dispositivo"}
function organizerName(){return cleanText(remoteSession?.user?.user_metadata?.display_name||remoteSession?.user?.email?.split("@")[0]||"",LIMITS.name)}
function usernameEmails(){try{return JSON.parse(localStorage.getItem(USERNAME_EMAIL_KEY)||"{}")}catch{return{}}}
function rememberUsername(username,email){if(!validName(username)||!email)return;const map=usernameEmails();map[normalizedName(username)]=email.toLowerCase();localStorage.setItem(USERNAME_EMAIL_KEY,JSON.stringify(map))}
function uid(p="id"){return p+"_"+Math.random().toString(36).slice(2,9)}
function seeded(seed){let h=2166136261;for(const c of seed)h=Math.imul(h^c.charCodeAt(0),16777619);return()=>((h=Math.imul(h^(h>>>15),2246822507))>>>0)/4294967296}
function shuffle(arr,seed){const a=[...arr],r=seeded(seed);for(let i=a.length-1;i;i--){const j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function team(id){return state.teams.find(t=>t.id===id)}
function player(id){return state.players.find(p=>p.id===id)}
function nameTeam(id){return team(id)?.name||"Da definire"}
function pct(n,d){return d?Math.round(n/d*100)+"%":"—"}
function prizeFields(){const split=state.prizeSplit?.length?state.prizeSplit:[50,30,20];return `<label class="field">Numero di premiati<select id="prizeCountInput">${[1,2,3,4,5].map(n=>`<option value="${n}" ${split.length===n?"selected":""}>${n}</option>`).join("")}</select></label><div class="field prize-editor"><span>Percentuali premi</span><div id="prizeInputs">${split.map((v,i)=>`<label>${i+1}°<input class="prize-value" type="number" min="0" max="100" step="1" value="${v}" aria-label="Premio ${i+1}"></label>`).join("")}</div><small>Totale obbligatorio: 100%</small></div>`}
function pageHead(kicker,title,sub,actions=""){return `<div class="page-head"><div><div class="eyebrow">${kicker}</div><h1>${title}</h1><p>${sub}</p></div><div class="actions">${actions}</div></div>`}
function stepNav(previous,next,nextLabel="Avanti",disabled=false,hint=""){return `<div class="step-nav admin-only"><div>${previous?`<button class="btn secondary" data-view="${previous}">← Indietro</button>`:""}</div><div class="step-next">${hint?`<small>${hint}</small>`:""}<button class="btn" data-auto-next="${next}" ${disabled?"disabled":""}>${nextLabel} →</button></div></div>`}

function authHeaders(json=true){return{"apikey":SUPABASE_KEY,"Authorization":`Bearer ${remoteSession?.access_token||SUPABASE_KEY}`,...(json?{"Content-Type":"application/json"}:{})}}
async function supabase(path,options={}){const r=await fetch(SUPABASE_URL+path,{...options,headers:{...authHeaders(options.body!==undefined),...(options.headers||{})}});if(!r.ok){const e=await r.json().catch(()=>({message:r.statusText}));throw Error(e.msg||e.message||e.error_description||"Errore Supabase")}if(r.status===204)return null;const text=await r.text();return text?JSON.parse(text):null}
function slugify(text){return String(text||"torneo").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,55)||"torneo"}
async function syncTournament(t){
 t.ownerId=remoteSession.user.id;
 const data=JSON.parse(JSON.stringify(t)),publicData=JSON.parse(JSON.stringify(t));publicData.players?.forEach(p=>delete p.contact);publicData.teams?.forEach(x=>delete x.contact);publicData.log=[];
 const payload={owner_id:remoteSession.user.id,title:t.title,slug:t.slug||`${slugify(t.title)}-${Math.random().toString(36).slice(2,8)}`,data,public_data:publicData,is_public:t.isPublic!==false};
 if(t.remoteId){await supabase(`/rest/v1/tournaments?id=eq.${t.remoteId}`,{method:"PATCH",headers:{"Prefer":"return=minimal"},body:JSON.stringify(payload)})}
 else{const rows=await supabase("/rest/v1/tournaments",{method:"POST",headers:{"Prefer":"return=representation"},body:JSON.stringify(payload)});t.remoteId=rows[0].id;t.slug=rows[0].slug;persistLibrary()}
}
async function deleteRemoteTournament(t){if(t?.remoteId&&remoteSession)await supabase(`/rest/v1/tournaments?id=eq.${t.remoteId}`,{method:"DELETE",headers:{"Prefer":"return=minimal"}})}
async function loadRemoteLibrary(){
 const rows=await supabase("/rest/v1/tournaments?select=id,slug,title,data,created_at&order=created_at.desc");
 const userId=remoteSession.user.id,remote=rows.map(r=>Object.assign(blankState(),r.data,{remoteId:r.id,slug:r.slug,title:r.title,ownerId:userId})),local=library.tournaments||[],eligibleLocal=local.filter(t=>!t.ownerId||t.ownerId===userId),merged=[...remote];
 eligibleLocal.forEach(t=>{if(!merged.some(r=>r.remoteId&&r.remoteId===t.remoteId||r.id===t.id))merged.push(t)});
 library={tournaments:merged,currentId:null};persistLibrary();state=null;render();
 eligibleLocal.filter(t=>!t.remoteId).forEach(t=>syncTournament(t).catch(()=>{}));
}
function saveSession(session){remoteSession=session;localStorage.setItem(SESSION_KEY,JSON.stringify(session))}
async function restoreSession(){try{const s=JSON.parse(localStorage.getItem(SESSION_KEY)||"null");if(!s)return null;if(s.expires_at&&s.expires_at*1000>Date.now()+60000)return s;if(!s.refresh_token)return null;const r=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,{method:"POST",headers:{"apikey":SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify({refresh_token:s.refresh_token})});if(!r.ok)return null;const fresh=await r.json();saveSession(fresh);return fresh}catch{return null}}
function showAuth(message=""){
 accessMode="viewer";$("#nav").hidden=true;document.body.dataset.role="viewer";document.body.classList.remove("hub-page");document.body.classList.add("auth-page");$("#accessButton").hidden=true;$("#roleBadge").textContent="Accesso organizzatore";$("#userName").hidden=true;
 main.innerHTML=`<section class="welcome-shell"><div class="welcome-overlay"></div><div class="welcome-layout"><div class="welcome-copy"><div class="welcome-kicker">⚽ Football Tournament Manager</div><h1>Benvenuto nel tuo portale tornei</h1><p>Accedi o registrati per organizzare un torneo di calcio balilla dall’iscrizione fino alla proclamazione del vincitore.</p><div class="welcome-steps"><div><b>1</b><span><strong>Crea il torneo</strong><small>Imposta partecipanti, squadre, tempo e biliardini.</small></span></div><div><b>2</b><span><strong>Scegli la formula</strong><small>Gironi, campionato, playoff oppure eliminazione diretta.</small></span></div><div><b>3</b><span><strong>Gioca e condividi</strong><small>Inserisci i risultati e pubblica il tabellone tramite QR.</small></span></div></div></div><div class="card auth-card"><div class="eyebrow">Area organizzatori</div><h2>${authMode==="login"?"Accedi":"Crea il tuo account"}</h2><p class="muted">${message||(authMode==="login"?"Inserisci le tue credenziali per iniziare.":"Registrati gratuitamente per creare e gestire i tuoi tornei.")}</p><form id="authForm" class="form-grid"><label class="field full">${authMode==="login"?"Email o username":"Email"}<input name="email" type="${authMode==="login"?"text":"email"}" maxlength="120" autocomplete="email" required></label>${authMode==="signup"?`<label class="field full">Username visibile<input name="display_name" maxlength="${LIMITS.name}" autocomplete="name" required></label>`:""}<label class="field full">Password<input name="password" type="password" minlength="8" maxlength="128" autocomplete="${authMode==="login"?"current-password":"new-password"}" required></label><div class="full actions auth-actions"><button type="submit" class="btn">${authMode==="login"?"Accedi":"Registrati"}</button><button type="button" class="btn secondary" data-action="toggle-auth">${authMode==="login"?"Non hai un account? Registrati":"Hai già un account? Accedi"}</button></div></form></div></div></section>`;applyUiMode();
}
async function submitAuth(form){
 const d=Object.fromEntries(new FormData(form));d.email=cleanText(d.email,120);if(d.display_name!==undefined){d.display_name=cleanText(d.display_name,LIMITS.name);if(!validName(d.display_name))return showAuth("Lo username deve contenere almeno una lettera o un numero.")}if(authMode==="login"&&!d.email.includes("@")){const resolved=usernameEmails()[normalizedName(d.email)];if(!resolved)return showAuth("Username non riconosciuto su questo dispositivo. Accedi una volta con l’email per associarlo.");d.email=resolved}try{
  if(authMode==="signup"){const result=await fetch(`${SUPABASE_URL}/auth/v1/signup`,{method:"POST",headers:{"apikey":SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify({email:d.email,password:d.password,data:{display_name:d.display_name}})}).then(async r=>{const x=await r.json();if(!r.ok)throw Error(x.msg||x.message);return x});rememberUsername(d.display_name,d.email);if(!result.access_token){authMode="login";return showAuth("Controlla la tua email, conferma l’account e poi accedi.")}saveSession(result)}
  else{const result=await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"apikey":SUPABASE_KEY,"Content-Type":"application/json"},body:JSON.stringify({email:d.email,password:d.password})}).then(async r=>{const x=await r.json();if(!r.ok)throw Error(x.error_description||x.msg||x.message);return x});saveSession(result);rememberUsername(result.user?.user_metadata?.display_name,d.email)}
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
 try{if(!state.remoteId)await syncTournament(state);const link=new URL(location.href);link.search="";link.searchParams.set("view","public");link.searchParams.set("slug",state.slug);const url=link.toString(),qr=qrcode(0,"M");qr.addData(url);qr.make();const qrData=qr.createDataURL(6,12);modal(`<h2>Condividi torneo</h2><p class="muted">Chi apre questo collegamento vede calendario, risultati, classifiche e regolamento senza poter modificare nulla.</p><label class="field">Link pubblico<input id="publicLink" readonly value="${esc(url)}"></label><div class="qr-box"><img src="${qrData}" alt="QR code del torneo" width="260" height="260"></div><div class="actions"><button class="btn" data-action="copy-public-link">Copia link</button><a class="btn secondary" href="${qrData}" download="qr-${esc(state.slug)}.gif">Scarica QR</a><button class="btn secondary" data-action="close-modal">Chiudi</button></div>`)}catch(err){toast("Impossibile creare il QR: "+err.message)}
}

function render(){
  document.body.classList.remove("auth-page");
  document.body.classList.toggle("hub-page",!state);
  if(!state){renderHub();applyUiMode();return}
  $("#nav").hidden=false;
  document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===currentView));
  ({dashboard,registrations,teams,format,groups,matches,knockout,stats,rules}[currentView]||dashboard)();
  applyUiMode();
}
function renderHub(){
 document.body.classList.add("hub-page");
 $("#nav").hidden=false;
 document.querySelectorAll("#nav button").forEach(b=>b.classList.toggle("active",b.dataset.action==="home"));
 main.innerHTML=`<div class="hub"><section class="hub-hero"><div class="eyebrow">Archivio tornei</div><h1>I tuoi tornei</h1><p class="muted">Ogni cartella conserva iscritti, calendario, risultati e statistiche separatamente.</p></section><div class="actions" style="margin:18px 0 24px"><button class="btn" data-action="new-tournament">+ Crea torneo</button></div>${library.tournaments.length?`<div class="folder-grid">${library.tournaments.map(t=>`<article class="card folder" data-open-tournament="${t.id}"><button class="folder-delete" data-delete-tournament="${t.id}" aria-label="Elimina ${esc(t.title)}">×</button><div class="folder-icon">📁</div><h2>${esc(t.title)}</h2><p class="muted">${new Date(t.createdAt).toLocaleDateString("it-IT")}</p><div class="folder-meta"><span class="badge">${t.players?.length||0} iscritti</span><span class="badge gray">${t.tables||4} biliardini</span><span class="badge gold">${t.matches?.filter(m=>m.played).length||0} risultati</span></div></article>`).join("")}</div>`:empty("Nessun torneo","Crea la prima cartella torneo per cominciare.")}</div>`;
}
function createTournament(experience=null){
 if(!experience)return modal(`<h2>Come vuoi organizzare il torneo?</h2><p class="muted">Potrai cambiare modalità senza perdere i dati.</p><div class="experience-grid"><button class="experience-card recommended" data-new-experience="quick"><b>⚡ Torneo rapido</b><span>Inserisci i partecipanti, sorteggia e gioca. Il resto viene deciso automaticamente.</span><small>Più semplice</small></button><button class="experience-card" data-new-experience="guided"><b>🧭 Configurazione guidata</b><span>Un passaggio alla volta, con spiegazioni e impostazioni essenziali.</span><small>Consigliata per iniziare</small></button><button class="experience-card" data-new-experience="complete"><b>⚙ Modalità completa</b><span>Tutte le formule, premi, statistiche e impostazioni avanzate.</span><small>Per utenti esperti</small></button></div>`);
 const quick=experience==="quick",complete=experience==="complete";
 modal(`<h2>${quick?"Torneo rapido":experience==="guided"?"Configurazione guidata":"Nuovo torneo completo"}</h2><p class="muted">${quick?"Servono solo le informazioni essenziali.":"Imposta il torneo; potrai modificare tutto successivamente."}</p><form id="newTournamentForm" class="form-grid"><label class="field full">Nome del torneo<input name="title" maxlength="${LIMITS.title}" required autofocus placeholder="Es. Torneo Estate 2026"></label><label class="field">Biliardini disponibili<input name="tables" type="number" min="1" max="100" value="4" required></label>${quick?"":`<label class="field">Ore disponibili<input name="availableHours" type="number" min="1" max="240" step=".5" value="6" required></label>`}<label class="field">Tipo iscrizione<select name="mode"><option value="single">Singoli</option><option value="team">Squadre</option></select></label><label class="field">Giocatori per squadra<select name="teamSize"><option value="2">2 giocatori</option><option value="3">3 giocatori</option></select></label>${complete?`<label class="field">Minuti per partita, cambio incluso<input name="matchMinutes" type="number" min="5" max="180" value="12" required></label><label class="field full">Formato iniziale<select name="tournamentFormat"><option value="classic">Gironi + playoff (consigliato)</option><option value="league">Girone unico</option><option value="knockout">Eliminazione diretta</option><option value="league_playoff">Campionato + playoff</option></select></label>`:""}<div class="full actions"><button class="btn">Inizia</button><button type="button" class="btn secondary" data-action="choose-experience">Indietro</button></div></form>`,()=>{const d=Object.fromEntries(new FormData($("#newTournamentForm"))),title=cleanText(d.title,LIMITS.title);if(!validName(title))return toast("Il nome deve contenere almeno una lettera o un numero");state=blankState();state.experience=experience;state.title=title;state.tables=Math.min(100,Math.max(1,+d.tables||1));state.availableHours=Math.min(240,Math.max(1,+d.availableHours||6));state.matchMinutes=Math.min(180,Math.max(5,+d.matchMinutes||12));state.mode=d.mode;state.teamSize=+d.teamSize||2;state.tournamentFormat=d.tournamentFormat||"classic";save("Torneo creato");closeModal();currentView="registrations";render()});
}
function dashboard(){
  const done=state.matches.filter(m=>m.played).length+state.knockout.filter(m=>m.played).length;
  const total=state.matches.length+state.knockout.length;
  const champ=getChampion(),paid=state.mode==="single"?state.players.length:state.teams.length*2,pot=Math.max(0,paid*(+state.entryFee||0)-(+state.fixedCosts||0));
  main.innerHTML=pageHead("Centro torneo",state.title,"Tutto il torneo, in un colpo d’occhio.",`<button class="btn" data-view="registrations">Gestisci iscrizioni</button>`) +
  (!state.teams.length?`<section class="setup-banner"><div><strong>Pronti a partire?</strong><p>Scegli il tipo di iscrizione e inserisci i partecipanti.</p></div><button class="btn" data-view="registrations">Configura torneo</button></section>`:"")+
  guidedPath()+
  `<section class="grid kpis">
   ${kpi("Iscritti",state.mode==="single"?state.players.length:state.teams.length,"senza limite",Math.min(100,(state.mode==="single"?state.players.length:state.teams.length)/48*100))}
   ${kpi("Squadre",state.teams.length,`consigliate fino a ${capacityLimit(.85)}`,state.teams.length/Math.max(1,capacityLimit(.85))*100)}
   ${kpi("Partite",done,total?`/ ${total} concluse`:"calendario da creare",total?done/total*100:0)}
   ${kpi("Montepremi",pot?`€ ${pot.toFixed(0)}`:"—",pot?(state.prizeSplit||[50,30,20]).map((v,i)=>`${i+1}° ${v}%`).join(" · "):"non configurato",pot?100:0)}
  </section>
  <section class="grid two" style="margin-top:16px"><div class="card"><h2>Prossime partite</h2>${nextMatches()}</div>
  <div class="card"><h2>Attività recente</h2>${state.log.length?state.log.slice(0,6).map(l=>`<div class="activity"><span class="dot"></span><div>${esc(l.text)}<small>${new Date(l.at).toLocaleString("it-IT")}</small></div></div>`).join(""):`<div class="empty">Nessuna attività registrata.</div>`}</div></section>`;
}
function kpi(label,value,hint,progress){return `<div class="card kpi"><small>${label}</small><strong>${value}</strong><div class="hint">${hint}</div><div class="progress"><i style="width:${Math.min(100,progress||0)}%"></i></div></div>`}
function dynamicGroupSizes(teamCount){if(teamCount<2)return[];let groups=Math.max(1,Math.ceil(teamCount/4));while(groups>1&&Math.floor(teamCount/groups)<3)groups--;const base=Math.floor(teamCount/groups),extra=teamCount%groups;return Array.from({length:groups},(_,i)=>base+(i<extra?1:0))}
function suggestedKnockoutSize(teamCount){if(teamCount<4)return 2;const target=teamCount*.67,powers=[];for(let p=4;p<=teamCount;p*=2)powers.push(p);return powers.sort((a,b)=>Math.abs(a-target)-Math.abs(b-target))[0]||2}
function previousPowerOfTwo(n){let p=1;while(p*2<=n)p*=2;return p}
function nextPowerOfTwo(n){let p=1;while(p<n)p*=2;return p}
function playoffSize(teamCount){return Math.min(8,Math.max(2,previousPowerOfTwo(teamCount)))}
function estimateTournament(teamCount,format=state?.tournamentFormat||"classic"){
 if(teamCount<2)return{matches:0,minutes:0,groups:0,ko:0,guaranteed:0};
 const tables=Math.max(1,state?.tables||4),slot=Math.max(5,state?.matchMinutes||12),leagueMatches=teamCount*(teamCount-1)/2;
 let groupMatches=0,groups=0,ko=0,guaranteed=1,roundSlots=0;
 if(format==="classic"){const sizes=dynamicGroupSizes(teamCount);groups=sizes.length;groupMatches=sizes.reduce((s,n)=>s+n*(n-1)/2,0);ko=suggestedKnockoutSize(teamCount);guaranteed=Math.max(1,Math.min(...sizes)-1)}
 if(format==="league"){groups=1;groupMatches=leagueMatches;guaranteed=teamCount-1}
 if(format==="league_playoff"){groups=1;groupMatches=leagueMatches;ko=playoffSize(teamCount);guaranteed=teamCount-1}
 if(format==="knockout"){ko=nextPowerOfTwo(teamCount);guaranteed=1}
 if(ko){const first=format==="knockout"?teamCount-ko/2:ko/2;roundSlots+=Math.ceil(Math.max(0,first)/tables);for(let m=ko/4;m>=1;m/=2)roundSlots+=Math.ceil(m/tables);if(ko>=4)roundSlots+=1}
 const actualKo=format==="knockout"?teamCount-1+(teamCount>=4?1:0):ko;
 const slots=Math.ceil(groupMatches/tables)+roundSlots;
 return{matches:groupMatches+actualKo,minutes:Math.ceil(slots*slot*1.08),groups,ko,guaranteed};
}
function capacityLimit(ratio=1){const budget=(state.availableHours||6)*60*ratio;let best=4;for(let n=4;n<=256;n++)if(estimateTournament(n).minutes<=budget)best=n;return best}
function capacityPanel(){const currentTeams=state.mode==="single"?Math.floor(state.players.length/(state.teamSize||2)):state.teams.length,est=estimateTournament(currentTeams),recommended=capacityLimit(.85),maximum=capacityLimit(1),peopleRec=recommended*(state.teamSize||2),over=est.minutes>(state.availableHours||6)*60;return `<div class="capacity-panel ${over?"over":""}"><div><small>STIMA DI CAPIENZA</small><b>${recommended} squadre consigliate · ${maximum} al limite</b><span>${peopleRec} persone consigliate con rose da ${state.teamSize||2}</span></div><div><small>CONFIGURAZIONE ATTUALE</small><b>${currentTeams} squadre · circa ${Math.floor(est.minutes/60)}h ${est.minutes%60}m</b><span>${TOURNAMENT_FORMATS[state.tournamentFormat||"classic"].name} · ${est.matches} partite</span></div></div>`}
function nextMatches(){const games=[...state.matches,...state.knockout].filter(m=>!m.played).slice(0,5);return games.length?games.map(m=>`<div class="record"><span>${esc(nameTeam(m.a))} <b>vs</b> ${esc(nameTeam(m.b))}</span><small class="muted">${m.table?`Turno ${m.slot} · Tavolo ${m.table}`:m.round}</small></div>`).join(""):`<div class="empty"><div class="icon">▤</div><h3>Nessuna partita in attesa</h3><p>Genera il calendario o completa il torneo.</p></div>`}

function registrations(){
  const count=state.mode==="single"?state.players.length:state.teams.length;
  main.innerHTML=pageHead("Fase 1","Iscrizioni",`${count} ${state.mode==="single"?"giocatori":"squadre"} registrati.`,`<button class="btn secondary test-btn" data-action="random-registrations">⚗ Dati casuali</button><a class="btn secondary" href="template-iscrizioni.xlsx" download>Scarica template Excel</a><label class="btn secondary file-btn">Importa Excel<input id="excelImport" type="file" accept=".xlsx,.csv"></label><button class="btn" data-action="open-registration">+ Nuova iscrizione</button>`) +
  `<div class="card"><div class="settings-strip"><label class="field">Nome torneo<input id="titleInput" maxlength="${LIMITS.title}" value="${esc(state.title)}"></label><label class="field">Biliardini disponibili<input id="tablesInput" type="number" min="1" max="100" value="${state.tables||4}"></label><button class="btn secondary" data-action="save-settings">Salva impostazioni</button></div><div class="form-grid" style="margin-top:14px"><label class="field">Ore disponibili<input id="availableHoursInput" type="number" min="1" max="240" step=".5" value="${state.availableHours||6}"></label><label class="field">Minuti per partita, cambio incluso<input id="matchMinutesInput" type="number" min="5" max="180" value="${state.matchMinutes||12}"></label><label class="field">Giocatori per squadra<select id="teamSizeInput"><option value="2" ${(state.teamSize||2)===2?"selected":""}>2 giocatori</option><option value="3" ${state.teamSize===3?"selected":""}>3 giocatori</option></select></label><label class="field">Quota per giocatore (€)<input id="entryFeeInput" type="number" min="0" max="100000" step=".01" value="${state.entryFee||0}"></label><label class="field">Costi da sottrarre (€)<input id="fixedCostsInput" type="number" min="0" max="1000000" step=".01" value="${state.fixedCosts||0}"></label>${prizeFields()}<label class="field">Ritiro squadra<select id="withdrawalPolicyInput"><option value="forfeit">6–0 a tavolino</option></select></label></div>${capacityPanel()}<div class="segmented" style="margin-top:18px"><button data-mode="single" class="${state.mode==="single"?"active":""}">Iscrizioni singole</button><button data-mode="team" class="${state.mode==="team"?"active":""}">Iscrizioni a squadre</button></div>
  <p class="muted">${state.mode==="single"?`Il registro non ha limiti. Tutti gli iscritti vengono usati per formare le squadre; in modalità da 2, un numero dispari crea una squadra da 3. La stima segnala soltanto se la durata prevista supera il tempo disponibile.`:"Il registro squadre non ha limiti. La stima di capienza è un avviso, non un blocco."}</p></div>
  <div class="card" style="margin-top:16px">${registrationTable()}</div>`+
  stepNav(null,"teams","Avanti: componi le squadre",state.mode==="single"?state.players.length<(state.teamSize||2):state.teams.length<2,"Completa le iscrizioni per proseguire");
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
 `<div class="card"><div class="form-grid"><label class="field">Seed del sorteggio<input id="seedInput" maxlength="${LIMITS.seed}" value="${esc(state.seed)}" ${state.mode==="team"?"disabled":""}></label><label class="field">Tema nomi squadre<select id="themeInput">${Object.entries({sportive:"Sportivo",nazionali:"Nazionali",animali:"Animali",ironici:"Ironico da bar"}).map(([k,v])=>`<option value="${k}" ${state.nameTheme===k?"selected":""}>${v}</option>`).join("")}</select></label></div><p class="muted">Lo stesso seed e gli stessi iscritti producono lo stesso sorteggio. Il tema assegna i nomi iniziali; ogni nome può poi essere modificato liberamente.</p></div>
 <div style="margin-top:16px">${state.teams.length?`<div class="team-list">${state.teams.map(teamCard).join("")}</div>`:empty("Squadre non ancora composte","Completa le iscrizioni, poi avvia il sorteggio.")}</div>`+
 stepNav("registrations",state.experience==="quick"?"groups":"format",state.experience==="quick"?"Avanti: crea il torneo":"Avanti: scegli il formato",state.teams.length<2,"Servono almeno 2 squadre");
}
function teamCard(t,i){const members=t.playerIds?.map(player).filter(Boolean)||[];return `<article class="team-card"><div class="team-name"><span>${esc(t.name)}</span><span class="badge ${t.withdrawn?"red":"gold"}">${t.withdrawn?"Ritirata":"#"+(i+1)}</span></div><div class="players">${members.length?members.map(p=>`<div><b>${esc(p.name)}</b> · ${ROLE_LABEL[p.role]} · ${LEVEL_LABEL[p.level]}</div>`).join(""):esc(t.memberNames?.join(" · ")||"")}</div><div class="actions" style="margin-top:10px"><button class="btn small secondary" data-rename-team="${t.id}">Rinomina</button>${state.mode==="single"?`<button class="btn small secondary" data-manual-team="${t.id}">Modifica coppia</button><button class="btn small secondary" data-substitute-team="${t.id}">Sostituzione</button>`:""}${state.groups.length&&!t.withdrawn?`<button class="btn small secondary" data-withdraw-team="${t.id}">Ritiro</button>`:""}</div></article>`}

function format(){
 const count=state.teams.length,current=state.tournamentFormat||"classic";
 const formats=uiLanguage==="en"?TOURNAMENT_FORMATS_EN:TOURNAMENT_FORMATS;
 main.innerHTML=pageHead("Fase 3","Formato torneo","Scegli la struttura più adatta a partecipanti, tempo e biliardini.")+
 (count<2?`<div class="warning">Componi almeno 2 squadre per ottenere stime attendibili.</div>`:"")+
 `<div class="format-grid">${Object.entries(formats).map(([key,f])=>{const est=estimateTournament(count,key),over=est.minutes>(state.availableHours||6)*60;return `<article class="card format-card ${current===key?"selected":""}"><div class="format-card-head"><span class="badge ${key==="classic"?"gold":"gray"}">${f.tag}</span>${current===key?`<span class="selected-check">✓ Selezionata</span>`:""}</div><h2>${f.name}</h2><p>${f.description}</p><div class="format-metrics"><span><b>${est.matches}</b> partite</span><span><b>${Math.floor(est.minutes/60)}h ${est.minutes%60}m</b> stimate</span><span><b>${est.guaranteed}</b> garantite</span><span class="${over?"format-over":""}">${over?"⚠ Supera il tempo":"✓ Compatibile"}</span></div><button class="btn ${current===key?"secondary":""}" data-tournament-format="${key}" ${current===key?"disabled":""}>${current===key?"Formato attivo":"Scegli formato"}</button></article>`}).join("")}</div>
 <div class="card format-summary"><h2>Configurazione usata per la stima</h2><p><b>${count} squadre</b> · ${state.tables||4} biliardini · ${state.availableHours||6} ore disponibili · ${state.matchMinutes||12} minuti medi per partita.</p><p class="muted">La scelta può essere cambiata finché non sono stati inseriti risultati. Cambiandola, gironi, calendario e tabellone vengono rigenerati.</p></div>`+
 stepNav("teams","groups","Avanti: genera la struttura",count<2,(uiLanguage==="en"?"Selected: ":"Hai scelto ")+formats[current].name);
}

function groups(){
 const mode=state.tournamentFormat||"classic",est=estimateTournament(state.teams.length),over=est.minutes>(state.availableHours||6)*60,direct=mode==="knockout",leagueMode=mode==="league"||mode==="league_playoff",minTeams=direct?2:4;
 const title=direct?"Eliminazione diretta":leagueMode?"Campionato":"Gironi";
 const sub=direct?`${state.teams.length} squadre · tabellone con passaggi automatici.`:leagueMode?`Girone unico · ${state.teams.length} squadre · ${state.teams.length?state.teams.length-1:0} partite garantite.`:`${est.groups||0} gironi dinamici · ${state.teams.length} squadre · fase finale prevista da ${est.ko}.`;
 const generated=direct?state.knockout.length:state.groups.length;
 main.innerHTML=pageHead("Fase 4",title,sub,`<button class="btn secondary" data-action="print">Stampa</button><button class="btn" data-action="generate-groups" ${state.teams.length<minTeams?"disabled":""}>${generated?"Rigenera struttura":"Genera struttura"}</button>`)+
 (over?`<div class="warning">La durata stimata supera le ${state.availableHours||6} ore disponibili. Puoi procedere comunque oppure aumentare tempo/biliardini.</div>`:"")+
 (state.teams.length<minTeams?`<div class="warning">Servono almeno ${minTeams} squadre per generare il torneo.</div>`:"")+
 (direct?(state.knockout.length?`<div class="card"><h2>Tabellone creato</h2><p>Apri la sezione Fase finale per inserire i risultati.</p><button class="btn" data-view="knockout">Vai al tabellone</button></div>`:empty("Tabellone non ancora generato","Scegli il formato e genera la struttura.")):(state.groups.length?`<div class="group-grid ${leagueMode?"single-group":""}">${state.groups.map((g,i)=>groupCard(g,i)).join("")}</div>`:empty("Struttura non ancora generata","Componi le squadre e avvia la generazione.")))+
 stepNav("format",direct?"knockout":"matches",direct?"Avanti: vai al tabellone":"Avanti: inserisci i risultati",!generated,"Genera prima la struttura");
}
function groupLabel(i){return i<26?String.fromCharCode(65+i):String(i+1)}
function groupCard(g,i){const standings=getStandings(g),total=g.length*(g.length-1)/2,leagueMode=["league","league_playoff"].includes(state.tournamentFormat);return `<article class="card group-card"><div class="group-title"><b>${leagueMode?"Classifica generale":`Girone ${groupLabel(i)}`}</b><span>${state.matches.filter(m=>m.group===i&&m.played).length}/${total}</span></div><div class="table-wrap"><table><thead><tr><th>#</th><th>Squadra</th><th>Pt</th><th>DR</th><th>GF</th></tr></thead><tbody>${standings.map((s,x)=>`<tr><td>${x+1}</td><td><b>${esc(nameTeam(s.id))}</b></td><td>${s.pts}</td><td>${s.gd>0?"+":""}${s.gd}</td><td>${s.gf}</td></tr>`).join("")}</tbody></table></div></article>`}

function matches(){
 const filtered=state.matches.filter(m=>matchFilter==="all"||String(m.group)===matchFilter),leagueMode=["league","league_playoff"].includes(state.tournamentFormat),direct=state.tournamentFormat==="knockout";
 main.innerHTML=pageHead("Fase 5","Calendario e risultati",direct?"Le partite sono gestite direttamente nel tabellone finale.":`Partite distribuite su ${state.tables||4} biliardini senza sovrapposizioni.`,`<button class="btn secondary test-btn" data-action="random-group-results" ${state.matches.length?"":"disabled"}>⚗ Risultati casuali</button><button class="btn secondary" data-action="print">Stampa</button>`)+
 `<div class="tabs"><button data-filter="all" class="${matchFilter==="all"?"active":""}">Tutte</button>${state.groups.map((_,i)=>`<button data-filter="${i}" class="${matchFilter==i?"active":""}">${leagueMode?"Campionato":`Girone ${groupLabel(i)}`}</button>`).join("")}</div>
 <div class="card">${filtered.length?filtered.map(matchRow).join(""):empty("Calendario assente",direct?"Apri la fase finale per gestire il tabellone.":"Genera la struttura per creare automaticamente tutte le partite.")}</div>`+
 stepNav("groups","knockout",state.tournamentFormat==="league"?"Avanti: proclama il vincitore":"Avanti: fase finale",!direct&&(!state.matches.length||state.matches.some(m=>!m.played)),"Completa tutte le partite per proseguire");
}
function matchRow(m){return `<div class="match-row"><span class="badge gray">T${m.slot} · Tav. ${m.table}</span><span style="text-align:right"><b>${esc(nameTeam(m.a))}</b></span><span class="match-score ${m.played?"":"pending"}">${m.played?`${m.ga} — ${m.gb}`:"—"}</span><span><b>${esc(nameTeam(m.b))}</b></span><button class="btn small ${m.played?"secondary":""}" data-result="${m.id}">${m.played?"Modifica":"Risultato"}</button></div>`}

function knockout(){
 const mode=state.tournamentFormat||"classic",leagueOnly=mode==="league",direct=mode==="knockout";
 const can=direct?state.teams.length>=2:state.groups.length&&state.groups.every((g,i)=>state.matches.filter(m=>m.group===i).every(m=>m.played));
 const champ=getChampion();
 main.innerHTML=pageHead("Fase 6",leagueOnly?"Vincitore del campionato":"Fase finale",leagueOnly?"Il primo classificato al termine di tutte le partite vince il torneo.":`Tabellone ${direct?"a eliminazione diretta":`da ${mode==="league_playoff"?playoffSize(state.teams.length):suggestedKnockoutSize(state.teams.length)} squadre`}.`,`${state.knockout.length?`<button class="btn secondary test-btn" data-action="random-knockout">⚗ Completa casualmente</button>`:""}<button class="btn secondary" data-action="print">Stampa</button>${!leagueOnly&&!state.knockout.length?`<button class="btn" data-action="generate-knockout" ${can?"":"disabled"}>Crea tabellone</button>`:""}`)+
 (champ?`<div class="champion"><div class="cup">🏆</div><small>VINCITORE DEL TORNEO</small><h2>${esc(champ.name)}</h2><p>Congratulazioni!</p></div>`:"")+
 (leagueOnly&&!champ?`<div class="warning">Completa tutte le partite del campionato per proclamare il vincitore.</div>`:"")+
 (!leagueOnly&&!can&&!state.knockout.length?`<div class="warning">Completa tutte le partite della prima fase per creare il tabellone.</div>`:"")+
 (leagueOnly?(state.groups.length?groupCard(state.groups[0],0):empty("Campionato non generato","Genera prima il calendario.")):(state.knockout.length?bracket():empty("Tabellone non ancora creato","La dimensione della fase finale verrà calcolata automaticamente.")))+
 stepNav(direct?"groups":"matches","stats","Avanti: statistiche",!champ,"Il vincitore apparirà al termine del torneo");
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
function teamStats(id){const games=[...state.matches,...state.knockout].filter(m=>m.played&&!m.bye&&(m.a===id||m.b===id));let gf=0,ga=0,wins=0;const form=[];games.forEach(m=>{const home=m.a===id,a=home?m.ga:m.gb,b=home?m.gb:m.ga;gf+=a;ga+=b;wins+=a>b;form.push(a>b?"V":"S")});return{played:games.length,wins,losses:games.length-wins,gf,ga,gd:gf-ga,form:form.slice(-5)}}
function hallOfFame(){const completed=library.tournaments.map(t=>{const f=t.knockout?.find(m=>m.round==="Finale"&&m.played);if(!f)return null;const winnerId=f.ga>f.gb?f.a:f.b,winner=t.teams.find(x=>x.id===winnerId),games=[...(t.matches||[]),...(t.knockout||[])].filter(m=>m.played);let best=null;t.teams.forEach(tm=>{const gf=games.reduce((s,m)=>s+(m.a===tm.id?m.ga:m.b===tm.id?m.gb:0),0);if(!best||gf>best.gf)best={name:tm.name,gf}});return{title:t.title,winner:winner?.name||"—",best}}).filter(Boolean);return completed.length?`<div class="table-wrap"><table><thead><tr><th>Torneo</th><th>Campione</th><th>Miglior attacco</th></tr></thead><tbody>${completed.map(x=>`<tr><td><b>${esc(x.title)}</b></td><td>🏆 ${esc(x.winner)}</td><td>${esc(x.best?.name||"—")} · ${x.best?.gf||0} gol</td></tr>`).join("")}</tbody></table></div>`:`<div class="empty">Completa una finale per inaugurare la Hall of Fame.</div>`}

function rules(){
 const formatKey=state.tournamentFormat||"classic";
 if(uiLanguage==="en"){
  const selectedFormat=TOURNAMENT_FORMATS_EN[formatKey];
  const qualification=formatKey==="league"?"The single league has no qualification stage: the top-ranked team wins.":formatKey==="knockout"?"All teams enter the bracket directly; any byes are assigned by the initial draw.":formatKey==="league_playoff"?"At the end of the league, the best 4 or 8 teams qualify, depending on the number of participants. Pairings follow the standings: first versus the lowest qualifier, second versus the second-lowest, and so on.":"The knockout-stage size is chosen automatically in proportion to the number of participants. Group winners qualify first, followed by runners-up, third-placed teams, and so on. If groups have different sizes, teams are compared using points, goal difference and goals scored per match.";
  main.innerHTML=pageHead("Official guide","Tournament rules","Unified rules valid on every table model.",`<button class="btn secondary" data-action="print">Print rules</button>`)+
  `<article class="card rules"><h2>1. Format</h2><p>Selected format: <b>${selectedFormat.name}</b>. ${selectedFormat.description} There is no fixed team limit: duration is estimated using the number of tables, available hours and average minutes per match. The estimate is informative and never blocks registrations. With two-player teams and an odd number of starters, one team is made up of three players instead of excluding one entrant.</p>
  <h2>2. Winning and scoring</h2><ul><li>The first team to reach <b>6 goals</b> wins.</li><li>No two-goal margin is required: 6–5 ends the match.</li><li>Draws and golden goals are not allowed.</li><li>Win: <b>3 points</b>. Loss: <b>0 points</b>.</li></ul>
  <h2>3. Start and restart</h2><p>A draw is held before the match. Its winner chooses either first possession or side of the table; the opponent receives the other option. Play starts from midfield. After each goal, the team that conceded restarts from midfield.</p>
  <h2>4. Technical rules</h2><ul><li>Hook shots are prohibited.</li><li>A clean full rotation is allowed as part of a controlled play; uncontrolled spinning is prohibited.</li><li>Shaking, moving or lifting the table is prohibited.</li><li>The ball may not be touched by hand without permission.</li><li>Deliberate distractions and unsporting conduct are prohibited.</li><li>An unreachable ball is put back into play from midfield by the referee.</li></ul>
  <h2>5. Standings and tie-breakers</h2><p>Teams are ranked by: 1) points; 2) goal difference; 3) goals scored; 4) a mini-table using the head-to-head matches among all teams that are still tied; 5) a stable system draw.</p>
  <h2>6. Qualification</h2><p>${qualification}</p>
  <h2>7. Knockout stage</h2><p>The knockout stage is single elimination, with every match won by the first team to reach 6 goals. Qualifiers receive an overall seed; first-round rematches between teams from the same group are avoided whenever possible. A third-place match is included when at least four teams qualify.</p>
  <h2>8. Reserves, substitutions and withdrawals</h2><p>Entrants who do not complete a team become reserves. In three-player rosters, two players are active: the third may enter during a stoppage after notifying the opponents; the organizers may set a limit on internal substitutions. A permanent substitution by an external reserve must be authorized and recorded, and the replaced player may not join another team. If a team withdraws, all of its group matches are awarded 6–0 to its opponents.</p>
  <h2>9. Refereeing</h2><p>Referee decisions are final. In situations not covered by these rules, the organizers decide while protecting consistency, safety and fair play.</p></article>`;
  return;
 }
 const selectedFormat=TOURNAMENT_FORMATS[formatKey];
 main.innerHTML=pageHead("Guida ufficiale","Regolamento del torneo","Regole uniche valide su tutti i modelli di biliardino.",`<button class="btn secondary" data-action="print">Stampa regolamento</button>`)+
 `<article class="card rules"><h2>1. Formato</h2><p>Formato selezionato: <b>${selectedFormat.name}</b>. ${selectedFormat.description} Il numero di squadre non ha un limite fisso e la durata viene stimata usando biliardini, ore disponibili e minuti medi per partita. La stima è informativa e non blocca le iscrizioni. Se la modalità scelta è da 2 e il numero dei titolari è dispari, una sola squadra viene composta da 3 persone invece di escludere un iscritto.</p>
 <h2>2. Vittoria e punteggio</h2><ul><li>Vince la prima squadra che raggiunge <b>6 gol netti</b>.</li><li>Non è richiesto alcun vantaggio: il 6–5 conclude la partita.</li><li>Non sono ammessi pareggi né golden goal.</li><li>Vittoria: <b>3 punti</b>. Sconfitta: <b>0 punti</b>.</li></ul>
 <h2>3. Inizio e rimessa</h2><p>Prima della partita si effettua un sorteggio. Chi vince sceglie la prima palla oppure il lato del campo; l’avversario riceve l’altra opzione. La rimessa avviene dal centro. Dopo ogni gol rimette dal centro la squadra che lo ha subito.</p>
 <h2>4. Regole tecniche</h2><ul><li>Il gancio è vietato.</li><li>Il giro completo pulito è consentito nel rispetto della giocata; sono vietate rotazioni incontrollate.</li><li>È vietato scuotere, spostare o sollevare il tavolo.</li><li>È vietato toccare la pallina con le mani senza autorizzazione.</li><li>Non sono ammesse distrazioni volontarie o condotte antisportive.</li><li>Una pallina irraggiungibile viene rimessa in gioco dall’arbitro dal centro.</li></ul>
 <h2>5. Classifica e spareggi</h2><p>L’ordine è determinato da: 1) punti; 2) differenza reti; 3) gol fatti; 4) mini-classifica degli scontri tra tutte le squadre ancora a pari merito; 5) sorteggio stabile del sistema.</p>
 <h2>6. Qualificazione</h2><p>${state.tournamentFormat==="league"?"Il girone unico non prevede qualificazioni: vince la prima classificata.":state.tournamentFormat==="knockout"?"Tutte le squadre entrano direttamente nel tabellone; gli eventuali passaggi automatici sono assegnati dal sorteggio iniziale.":state.tournamentFormat==="league_playoff"?"Al termine del campionato si qualificano le migliori 4 o 8 squadre, secondo il numero di partecipanti. Gli accoppiamenti seguono il piazzamento: prima contro ultima qualificata, seconda contro penultima e così via.":"La dimensione della fase finale è scelta automaticamente in proporzione ai partecipanti. Si qualificano prima le migliori classificate di ogni girone, poi le seconde, le terze e così via. Se i gironi hanno dimensioni diverse, il confronto usa punti, differenza reti e gol fatti per partita."}</p>
 <h2>7. Fase finale</h2><p>La fase finale è a eliminazione diretta, sempre al primo che raggiunge 6 gol. Le qualificate ricevono un seed complessivo; al primo turno si evitano, quando possibile, rivincite dello stesso girone. Da quattro qualificate in su è prevista anche la finale per il terzo posto.</p>
 <h2>8. Riserve, sostituzioni e ritiri</h2><p>Gli iscritti che non completano una squadra sono riserve. Nelle rose da 3 giocano in due: il terzo può entrare durante un’interruzione di gioco, comunicando il cambio agli avversari; il numero dei cambi interni può essere stabilito dall’organizzazione. Una sostituzione definitiva con una riserva esterna deve essere autorizzata e registrata; il sostituito non può entrare in un’altra squadra. In caso di ritiro, tutte le partite del girone della squadra ritirata vengono assegnate 6–0 agli avversari.</p>
 <h2>9. Arbitraggio</h2><p>Le decisioni arbitrali sono definitive. Per casi non previsti, decide l’organizzazione tutelando uniformità, sicurezza e correttezza sportiva.</p></article>`;
}

function openRegistration(edit=null){
 if(state.mode==="single"){
  const p=edit?player(edit):null;
  modal(`<h2>${p?"Modifica":"Nuovo"} giocatore</h2><form id="registrationForm" class="form-grid">
  <label class="field full">Nome e cognome<input name="name" maxlength="${LIMITS.name}" required value="${esc(p?.name||"")}"></label><label class="field">Contatto<input name="contact" maxlength="${LIMITS.contact}" required value="${esc(p?.contact||"")}"></label>
  <label class="field">Ruolo preferito<select name="role">${opts(ROLE_LABEL,p?.role)}</select></label><label class="field">Livello<select name="level">${opts(LEVEL_LABEL,p?.level)}</select></label>
  <div class="full actions"><button class="btn" type="submit">Salva giocatore</button></div></form>`,()=>{const f=$("#registrationForm"),d=Object.fromEntries(new FormData(f));d.name=cleanText(d.name,LIMITS.name);d.contact=cleanText(d.contact,LIMITS.contact);if(!validName(d.name))return toast("Il nome deve contenere almeno una lettera o un numero");if(duplicateName(state.players,d.name,p?.id))return toast("Esiste già un giocatore con questo nome");if(p)Object.assign(p,d);else state.players.push({id:uid("p"),...d});save(p?"Giocatore modificato":"Giocatore iscritto");closeModal();render()});
 }else{
  const t=edit?team(edit):null;
  modal(`<h2>${t?"Modifica":"Nuova"} squadra</h2><form id="registrationForm" class="form-grid"><label class="field full">Nome squadra<input name="name" maxlength="${LIMITS.name}" required value="${esc(t?.name||TEAM_NAMES[state.teams.length])}"></label><label class="field">Giocatore 1<input name="p1" maxlength="${LIMITS.name}" required value="${esc(t?.memberNames?.[0]||"")}"></label><label class="field">Giocatore 2<input name="p2" maxlength="${LIMITS.name}" required value="${esc(t?.memberNames?.[1]||"")}"></label>${state.teamSize===3?`<label class="field">Giocatore 3<input name="p3" maxlength="${LIMITS.name}" required value="${esc(t?.memberNames?.[2]||"")}"></label>`:""}<label class="field full">Contatto<input name="contact" maxlength="${LIMITS.contact}" value="${esc(t?.contact||"")}"></label><div class="full"><button class="btn">Salva squadra</button></div></form>`,()=>{const d=Object.fromEntries(new FormData($("#registrationForm")));d.name=cleanText(d.name,LIMITS.name);d.contact=cleanText(d.contact,LIMITS.contact);const members=[cleanText(d.p1,LIMITS.name),cleanText(d.p2,LIMITS.name)];if(state.teamSize===3)members.push(cleanText(d.p3,LIMITS.name));if(!validName(d.name)||members.some(x=>!validName(x)))return toast("Nomi squadra e giocatori: inserisci almeno una lettera o un numero");if(duplicateName(state.teams,d.name,t?.id))return toast("Esiste già una squadra con questo nome");if(new Set(members.map(normalizedName)).size!==members.length)return toast("I giocatori della squadra devono avere nomi diversi");const obj={name:d.name,memberNames:members,contact:d.contact};if(t)Object.assign(t,obj);else state.teams.push({id:uid("t"),...obj});save(t?"Squadra modificata":"Squadra iscritta");closeModal();render()});
 }
}
function opts(map,val){return Object.entries(map).map(([k,v])=>`<option value="${k}" ${val===k?"selected":""}>${v}</option>`).join("")}
function modal(html,onSubmit){$("#modalBody").innerHTML=html;$("#modal").hidden=false;if(onSubmit)$("#modalBody form").addEventListener("submit",e=>{e.preventDefault();onSubmit(e)})}
function closeModal(){$("#modal").hidden=true}
function openProfile(){
 if(!remoteSession?.user)return toast("Accedi per gestire il profilo");
 const user=remoteSession.user,display=organizerName(),email=user.email||"";
 modal(`<h2>Il mio profilo</h2><p class="muted">Gestisci i dati visibili e la password del tuo account.</p><form id="profileForm" class="form-grid"><label class="field full">Email account<input value="${esc(email)}" readonly></label><label class="field full">Username visibile<input name="display_name" maxlength="${LIMITS.name}" value="${esc(display)}" required></label><label class="field full">Nuova password <small class="muted">Lascia vuoto per non modificarla</small><input name="password" type="password" minlength="8" maxlength="128" autocomplete="new-password"></label><label class="field full">Ripeti nuova password<input name="confirm_password" type="password" minlength="8" maxlength="128" autocomplete="new-password"></label><div class="full actions"><button class="btn">Salva profilo</button><button type="button" class="btn secondary" data-action="close-modal">Annulla</button></div></form>`,async()=>{const d=Object.fromEntries(new FormData($("#profileForm"))),name=cleanText(d.display_name,LIMITS.name);if(!validName(name))return toast("Lo username deve contenere almeno una lettera o un numero");if(d.password&&d.password!==d.confirm_password)return toast("Le due password non coincidono");const payload={data:{...(user.user_metadata||{}),display_name:name}};if(d.password)payload.password=d.password;try{const updated=await supabase("/auth/v1/user",{method:"PUT",body:JSON.stringify(payload)});remoteSession.user=updated;saveSession(remoteSession);rememberUsername(name,updated.email||email);closeModal();applyUiMode();toast(d.password?"Profilo e password aggiornati":"Profilo aggiornato")}catch(err){toast("Aggiornamento non riuscito: "+err.message)}})
}

function generateTeams(){
 if(state.players.length<2)return toast("Servono almeno due giocatori");
 state.seed=cleanText($("#seedInput")?.value||state.seed,LIMITS.seed);
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
 const t=team(id);modal(`<h2>Rinomina squadra</h2><form id="renameTeamForm"><label class="field">Nome squadra<input name="name" required maxlength="${LIMITS.name}" value="${esc(t.name)}"></label><div class="actions" style="margin-top:16px"><button class="btn">Salva nome</button></div></form>`,()=>{const name=cleanText(new FormData($("#renameTeamForm")).get("name"),LIMITS.name);if(!validName(name))return toast("Il nome deve contenere almeno una lettera o un numero");if(duplicateName(state.teams,name,t.id))return toast("Esiste già una squadra con questo nome");t.name=name;save("Squadra rinominata");closeModal();render()});
}
function guidedPath(){const hasEntries=state.mode==="single"?state.players.length>0:state.teams.length>0,steps=[["registrations","1","Iscrizioni",hasEntries],["teams","2","Squadre",state.teams.length>1],["format","3","Formato",!!state.tournamentFormat],["groups","4","Calendario",state.matches.length>0||state.knockout.length>0],["matches","5","Risultati",state.matches.some(m=>m.played)||state.knockout.some(m=>m.played&&!m.bye)]];return `<section class="card guided-path"><div><div class="eyebrow">Percorso consigliato</div><h2>Segui i passaggi in ordine</h2><p class="muted">Puoi sempre tornare indietro senza perdere i dati salvati.</p></div><div class="guided-steps">${steps.map(([view,n,label,done])=>`<button class="${done?"done":""}" data-view="${view}"><b>${done?"✓":n}</b><span>${label}</span></button>`).join("")}</div></section>`}
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
 const mode=state.tournamentFormat||"classic",ordered=shuffle(state.teams,state.seed+"-"+mode);
 if(mode==="knockout"){state.groups=[];state.matches=[];createKnockout(ordered.map((t,i)=>({id:t.id,group:-1,seed:i+1})),true);save("Tabellone a eliminazione diretta generato");render();return}
 if(mode==="league"||mode==="league_playoff")state.groups=[ordered.map(t=>t.id)];
 else{const sizes=dynamicGroupSizes(ordered.length);state.groups=[];let cursor=0;sizes.forEach(n=>{state.groups.push(ordered.slice(cursor,cursor+n).map(t=>t.id));cursor+=n})}
 const unscheduled=[];state.groups.forEach((g,gi)=>{for(let a=0;a<g.length;a++)for(let b=a+1;b<g.length;b++)unscheduled.push({id:uid("m"),group:gi,a:g[a],b:g[b],played:false})});
 state.matches=[];const maxTables=Math.max(1,+state.tables||1);let slot=1;
 while(unscheduled.length){const used=new Set();let table=1;for(let i=0;i<unscheduled.length&&table<=maxTables;){const m=unscheduled[i];if(!used.has(m.a)&&!used.has(m.b)){m.slot=slot;m.table=table++;used.add(m.a);used.add(m.b);state.matches.push(m);unscheduled.splice(i,1)}else i++}slot++}
 state.knockout=[];save(mode==="classic"?"Gironi e calendario generati":"Campionato e calendario generati");render();
}
function resultModal(id,ko=false){
 const list=ko?state.knockout:state.matches,m=list.find(x=>x.id===id);
 const heading=ko?m.round:["league","league_playoff"].includes(state.tournamentFormat)?"Campionato":`Girone ${groupLabel(m.group)}`;
 modal(`<h2>${heading}</h2><p><b>${esc(nameTeam(m.a))}</b> contro <b>${esc(nameTeam(m.b))}</b></p><form id="resultForm" class="form-grid"><label class="field">${esc(nameTeam(m.a))}<input name="ga" type="text" inputmode="numeric" pattern="[0-6]" maxlength="1" required value="${m.played?m.ga:""}"></label><label class="field">${esc(nameTeam(m.b))}<input name="gb" type="text" inputmode="numeric" pattern="[0-6]" maxlength="1" required value="${m.played?m.gb:""}"></label><label class="field full">Sorteggio iniziale<select name="choice"><option>Squadra A: palla · Squadra B: campo</option><option>Squadra A: campo · Squadra B: palla</option></select></label><div class="full warning">Sono ammessi soltanto numeri da 0 a 6 e una sola squadra deve avere 6.</div><div class="full"><button class="btn">Conferma risultato</button></div></form>`,()=>{const d=Object.fromEntries(new FormData($("#resultForm")));if(!/^[0-6]$/.test(d.ga)||!/^[0-6]$/.test(d.gb))return toast("Inserisci una sola cifra da 0 a 6");const ga=Number(d.ga),gb=Number(d.gb);if(ga===gb||Math.max(ga,gb)!==6)return toast("Inserisci un risultato valido: un solo 6");if(ko&&m.played)invalidateFollowingRounds(m.round);m.ga=ga;m.gb=gb;m.choice=d.choice;m.played=true;if(ko)advanceKnockout();save(`Risultato registrato: ${nameTeam(m.a)} ${ga}-${gb} ${nameTeam(m.b)}`);closeModal();render()});
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
 const ranks=state.groups.map(getStandings),rate=(x,k)=>(x.played?x[k]/x.played:0),cmp=(a,b)=>rate(b,"pts")-rate(a,"pts")||rate(b,"gd")-rate(a,"gd")||rate(b,"gf")-rate(a,"gf")||a.tie-b.tie,target=(state.tournamentFormat==="league_playoff"?playoffSize(state.teams.length):suggestedKnockoutSize(state.teams.length)),all=[];let pos=0;
 if(state.tournamentFormat==="league_playoff")return{all:ranks[0].slice(0,target)};
 while(all.length<target){const tier=ranks.map(r=>r[pos]).filter(Boolean).sort(cmp);if(!tier.length)break;all.push(...tier.slice(0,target-all.length));pos++}
 return {all};
}
function createKnockout(rows,direct=false){
 const seededRows=rows.map((x,i)=>({...x,seed:i+1})),size=direct?nextPowerOfTwo(seededRows.length):seededRows.length,pairs=[];
 if(direct){const padded=[...seededRows,...Array(size-seededRows.length).fill(null)],top=padded.slice(0,size/2),bottom=padded.slice(size/2).reverse();top.forEach((a,i)=>pairs.push([a,bottom[i]]))}
 else{const top=seededRows.slice(0,size/2),bottom=seededRows.slice(size/2);top.forEach(a=>{let idx=-1;for(let i=bottom.length-1;i>=0;i--)if(bottom[i].group!==a.group){idx=i;break}if(idx<0)idx=bottom.length-1;const b=bottom.splice(idx,1)[0];pairs.push([a,b])})}
 const rounds=knockoutRoundNames(size);state.knockout=pairs.map((p,i)=>({id:uid("ko"),round:rounds[0],roundIndex:0,index:i,a:p[0]?.id||null,b:p[1]?.id||null,seedA:p[0]?.seed||null,seedB:p[1]?.seed||null,played:false}));
 if(direct)state.knockout.forEach(m=>{if(m.a&&!m.b){m.played=true;m.ga=6;m.gb=0;m.bye=true}});
 for(let ri=1;ri<rounds.length;ri++){const n=size/2**(ri+1);for(let i=0;i<n;i++)state.knockout.push({id:uid("ko"),round:rounds[ri],roundIndex:ri,index:i,a:null,b:null,played:false})}
 if(size>=4)state.knockout.push({id:uid("ko"),round:"3° posto",roundIndex:rounds.length-1,index:0,a:null,b:null,played:false});
 advanceKnockout();
}
function generateKnockout(){
 const mode=state.tournamentFormat||"classic";
 if(mode==="league")return toast("Il girone unico non prevede una fase finale");
 if(mode==="knockout"){const ordered=shuffle(state.teams,state.seed+"-knockout");createKnockout(ordered.map((t,i)=>({id:t.id,group:-1,seed:i+1})),true)}
 else{const q=qualifiers();createKnockout(q.all,false)}
 const size=state.knockout.filter(m=>m.roundIndex===0).length*2;
 save(`Tabellone finale da ${size} squadre creato`);render();
}
function advanceKnockout(){const rounds=mainKnockoutRounds();for(let r=0;r<rounds.length-1;r++){const cur=state.knockout.filter(m=>m.round===rounds[r]),next=state.knockout.filter(m=>m.round===rounds[r+1]);cur.forEach((m,i)=>{if(m.played){const w=m.ga>m.gb?m.a:m.b;if(i%2===0)next[Math.floor(i/2)].a=w;else next[Math.floor(i/2)].b=w}})}const semis=state.knockout.filter(m=>m.round===rounds.at(-2)),third=state.knockout.find(m=>m.round==="3° posto");if(third&&semis.length===2&&semis.every(m=>m.played)){third.a=semis[0].ga<semis[0].gb?semis[0].a:semis[0].b;third.b=semis[1].ga<semis[1].gb?semis[1].a:semis[1].b}}
function getChampion(){if((state.tournamentFormat||"classic")==="league"&&state.groups.length&&state.matches.length&&state.matches.every(m=>m.played))return team(getStandings(state.groups[0])[0]?.id);const f=state.knockout.find(m=>m.round==="Finale"&&m.played);return f?team(f.ga>f.gb?f.a:f.b):null}

function applyUiMode(){
 document.documentElement.lang=uiLanguage;
 document.documentElement.dataset.theme=uiTheme;
 document.body.dataset.role=accessMode;
 document.body.dataset.experience=state?.experience||"complete";
 $("#languageSelect").value=uiLanguage;
 $("#themeButton").textContent=uiTheme==="dark"?(uiLanguage==="en"?"☀ Light":"☀ Chiaro"):(uiLanguage==="en"?"🌙 Dark":"🌙 Scuro");
 $("#roleBadge").textContent=accessMode==="admin"?(uiLanguage==="en"?"Organizer":"Organizzatore"):(uiLanguage==="en"?"Public viewer":"Visualizzatore");
 const user=organizerName();$("#userName").textContent=user?`👤 ${user}`:"";$("#userName").hidden=accessMode!=="admin"||!user;
 $("#accessButton").textContent=accessMode==="admin"?(uiLanguage==="en"?"Public view":"Vista pubblica"):(uiLanguage==="en"?"Organizer login":"Login organizzatore");
 $("#accessButton").dataset.action=accessMode==="admin"?"public-view":"organizer-login";
 $("#experienceButton").textContent=state?.experience==="complete"?"🧭 Modalità guidata":"⚙ Modalità completa";
 updateSaveState();
 if(accessMode==="viewer"&&["registrations","teams","format"].includes(currentView)){currentView="dashboard";dashboard()}
 if(uiLanguage==="en")translateTree(document.body);
}
function translateTree(root){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(n=>{if(n.parentElement?.closest(".notranslate"))return;const text=n.nodeValue,core=text.trim(),translated=TRANSLATIONS[core]||translateDynamicText(core);if(translated!==core)n.nodeValue=text.replace(core,translated)});
 root.querySelectorAll("[placeholder]").forEach(el=>{if(TRANSLATIONS[el.placeholder])el.placeholder=TRANSLATIONS[el.placeholder]});
}
function translateDynamicText(text){
 const rules=[
  [/^\+ Crea torneo$/,"+ Create tournament"],[/^← Indietro$/,"← Back"],[/^(.+) →$/,(m,x)=>(TRANSLATIONS[x]||x)+" →"],
  [/^(\d+) iscritti$/,(m,n)=>`${n} entrants`],[/^(\d+) biliardini$/,(m,n)=>`${n} tables`],[/^(\d+) risultati$/,(m,n)=>`${n} results`],
  [/^(\d+) (giocatori|squadre) registrati\.$/,(m,n,type)=>`${n} ${type==="giocatori"?"players":"teams"} registered.`],
  [/^consigliate fino a (\d+)$/,(m,n)=>`recommended up to ${n}`],[/^\/ (\d+) concluse$/,(m,n)=>`/ ${n} completed`],
  [/^Girone ([A-Z0-9]+)$/,(m,n)=>`Group ${n}`],[/^Turno (\d+) · Tavolo (\d+)$/,(m,r,t)=>`Round ${r} · Table ${t}`],
  [/^(\d+) gironi dinamici · (\d+) squadre · fase finale prevista da (\d+)\.$/,(m,g,t,k)=>`${g} dynamic groups · ${t} teams · ${k}-team knockout stage.`]
 ];for(const [pattern,replacement] of rules)if(pattern.test(text))return text.replace(pattern,replacement);return text
}
async function pinDigest(pin){const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(pin));return [...new Uint8Array(bytes)].map(x=>x.toString(16).padStart(2,"0")).join("")}
function enterPublicView(){
 accessMode="viewer";currentView=["registrations","teams","format"].includes(currentView)?"dashboard":currentView;
 const url=new URL(location.href);url.searchParams.set("view","public");if(state)url.searchParams.set("tournament",state.id);history.replaceState(null,"",url);render();
}
function openAdminLogin(){
 if(ONLINE&&remoteSession){accessMode="admin";const url=new URL(location.href);url.searchParams.delete("view");url.searchParams.delete("slug");history.replaceState(null,"",url);render();return}
 if(ONLINE){showAuth();return}
 const configured=!!localStorage.getItem(ADMIN_PIN_KEY);
 modal(`<h2>${configured?"Login organizzatore":"Imposta accesso organizzatore"}</h2><p class="muted">${configured?"Inserisci il PIN locale per riattivare i comandi.":"Questa è una protezione solo per la versione locale. Gli account online usano un accesso sicuro con email."}</p><form id="adminLoginForm"><label class="field">PIN<input name="pin" type="password" inputmode="numeric" minlength="4" maxlength="12" required autocomplete="${configured?"current-password":"new-password"}"></label><div class="actions" style="margin-top:16px"><button class="btn">${configured?"Accedi":"Salva PIN"}</button></div></form>`,async()=>{const pin=new FormData($("#adminLoginForm")).get("pin"),digest=await pinDigest(pin),saved=localStorage.getItem(ADMIN_PIN_KEY);if(saved&&saved!==digest)return toast("PIN non corretto");if(!saved)localStorage.setItem(ADMIN_PIN_KEY,digest);accessMode="admin";const url=new URL(location.href);url.searchParams.delete("view");url.searchParams.delete("tournament");history.replaceState(null,"",url);closeModal();render();toast("Modalità organizzatore attiva")});
 applyUiMode();
}

function closeHeaderMenu(){const menu=$("#headerMenu"),button=$("#headerMenuButton");if(!menu?.classList.contains("open"))return;menu.classList.remove("open");button?.setAttribute("aria-expanded","false")}
document.addEventListener("pointerdown",e=>{if(!e.target.closest(".header-actions"))closeHeaderMenu()},{capture:true});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeHeaderMenu()});
document.addEventListener("click",e=>{
 const b=e.target.closest("button");
 if(b?.dataset.deleteTournament){openDeleteConfirmation(b.dataset.deleteTournament);return}
 const folder=e.target.closest("[data-open-tournament]");if(folder){state=library.tournaments.find(t=>t.id===folder.dataset.openTournament);library.currentId=state.id;persistLibrary();currentView="dashboard";render();return}
 if(!b)return;
 if(b.dataset.newExperience){createTournament(b.dataset.newExperience);return}
 if(b.dataset.action!=="toggle-header-menu"){$("#headerMenu")?.classList.remove("open");$("#headerMenuButton")?.setAttribute("aria-expanded","false")}
 if(b.dataset.action==="toggle-auth"){authMode=authMode==="login"?"signup":"login";showAuth();return}
 if(b.dataset.action==="copy-public-link"){navigator.clipboard.writeText($("#publicLink").value).then(()=>toast("Link copiato"));return}
 if(b.dataset.action==="logout"){localStorage.removeItem(SESSION_KEY);remoteSession=null;state=null;authMode="login";showAuth("Sessione terminata. I tornei restano salvati sul dispositivo.");return}
 if(b.dataset.action==="toggle-theme"){uiTheme=uiTheme==="dark"?"light":"dark";localStorage.setItem(THEME_KEY,uiTheme);applyUiMode();return}
 if(b.dataset.action==="choose-experience"){createTournament();return}
 if(b.dataset.action==="toggle-experience"&&state){state.experience=state.experience==="complete"?"guided":"complete";save(`Interfaccia ${state.experience==="complete"?"completa":"guidata"} attivata`);render();return}
 if(b.dataset.action==="toggle-header-menu"){const menu=$("#headerMenu"),open=!menu.classList.contains("open");menu.classList.toggle("open",open);b.setAttribute("aria-expanded",String(open));return}
 if(b.dataset.action==="open-profile"){openProfile();return}
 if(b.dataset.action==="share"){shareTournament();return}
 if(b.dataset.action==="public-view"){enterPublicView();return}
 if(b.dataset.action==="organizer-login"){openAdminLogin();return}
 if(accessMode==="viewer"&&!b.dataset.view&&b.dataset.action!=="print"&&b.dataset.filter===undefined)return;
 if(b.dataset.action==="home"){state=null;render();return}
 if(b.dataset.action==="new-tournament")createTournament();
 if(b.dataset.autoNext){const next=b.dataset.autoNext;if(next==="groups"&&!state.groups.length&&!state.knockout.length){currentView="groups";generateGroups();return}if(next==="knockout"&&state.tournamentFormat!=="league"&&!state.knockout.length){currentView="knockout";generateKnockout();return}currentView=next;render();return}
 if(b.dataset.view){currentView=b.dataset.view;render()}
 if(b.dataset.mode&&b.dataset.mode!==state.mode){if((state.players.length||state.teams.length)&&!confirm("Cambiare modalità azzera iscrizioni, squadre e risultati. Continuare?"))return;const keep={id:state.id,title:state.title,tables:state.tables,availableHours:state.availableHours,matchMinutes:state.matchMinutes,teamSize:state.teamSize,tournamentFormat:state.tournamentFormat,entryFee:state.entryFee,fixedCosts:state.fixedCosts,prizeSplit:state.prizeSplit,createdAt:state.createdAt};state=Object.assign(blankState(),keep,{mode:b.dataset.mode});save("Modalità iscrizione impostata");render()}
 if(b.dataset.tournamentFormat&&b.dataset.tournamentFormat!==state.tournamentFormat){if((state.matches.some(m=>m.played)||state.knockout.some(m=>m.played&&!m.bye))&&!confirm("Cambiare formato cancella calendario, tabellone e risultati già inseriti. Continuare?"))return;state.tournamentFormat=b.dataset.tournamentFormat;state.groups=[];state.matches=[];state.knockout=[];save(`Formato scelto: ${TOURNAMENT_FORMATS[state.tournamentFormat].name}`);render()}
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
 if(b.dataset.action==="save-settings"){const split=[...document.querySelectorAll(".prize-value")].map(x=>+x.value),newTables=Math.min(100,Math.max(1,+$("#tablesInput").value||1)),newSize=+$("#teamSizeInput").value||2,tablesChanged=newTables!==state.tables,sizeChanged=newSize!==(state.teamSize||2),title=cleanText($("#titleInput").value,LIMITS.title);if(!validName(title))return toast("Il nome deve contenere almeno una lettera o un numero");if(split.some(x=>!Number.isInteger(x)||x<0||x>100)||split.reduce((a,x)=>a+x,0)!==100)return toast("Le percentuali premio devono essere numeri interi e sommare esattamente 100");if((tablesChanged&&state.matches.length||sizeChanged&&state.teams.length)&&!confirm("Questa modifica richiede di rigenerare squadre e/o calendario. Continuare?"))return;state.title=title;state.tables=newTables;state.availableHours=Math.min(240,Math.max(1,+$("#availableHoursInput").value||6));state.matchMinutes=Math.min(180,Math.max(5,+$("#matchMinutesInput").value||12));state.teamSize=newSize;state.entryFee=Math.min(100000,Math.max(0,+$("#entryFeeInput").value||0));state.fixedCosts=Math.min(1000000,Math.max(0,+$("#fixedCostsInput").value||0));state.prizeSplit=split;state.withdrawalPolicy=$("#withdrawalPolicyInput").value;if(sizeChanged){state.teams=[];state.groups=[];state.matches=[];state.knockout=[]}else if(tablesChanged){state.matches=[];state.knockout=[]}save("Impostazioni torneo aggiornate");render()}
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
$("#modal").addEventListener("click",()=>{});
$("#importFile").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!x.version||!Array.isArray(x.teams))throw 0;state=Object.assign(blankState(),x);save("Archivio JSON importato");currentView="dashboard";render()}catch{toast("File JSON non valido")}};r.readAsText(f);e.target.value=""});
function exportJSON(){if(!state)return toast("Apri prima un torneo");const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="torneo-calcio-balilla.json";a.click();URL.revokeObjectURL(a.href)}
function openDeleteConfirmation(id){const target=library.tournaments.find(t=>t.id===id);if(!target)return;modal(`<h2>Elimina torneo</h2><p>Stai per cancellare definitivamente <b>${esc(target.title)}</b>, con iscritti, risultati e statistiche.</p><div class="warning">Per confermare, digita <b>ELIMINA</b>.</div><form id="deleteTournamentForm" style="margin-top:16px"><label class="field">Conferma<input name="code" maxlength="7" autocomplete="off" placeholder="ELIMINA" required></label><div class="actions" style="margin-top:16px"><button class="btn danger-confirm">Elimina definitivamente</button><button type="button" class="btn secondary" data-action="close-modal">Annulla</button></div></form>`,async()=>{const code=new FormData($("#deleteTournamentForm")).get("code");if(code!=="ELIMINA")return toast("Scrivi ELIMINA per confermare");try{await deleteRemoteTournament(target)}catch{return toast("Eliminazione online non riuscita")}library.tournaments=library.tournaments.filter(t=>t.id!==id);if(state?.id===id)state=null;persistLibrary();closeModal();render();toast("Torneo eliminato")})}
function resetAll(){if(!state)return toast("Apri una cartella oppure usa × per eliminarla");openDeleteConfirmation(state.id)}
document.addEventListener("change",async e=>{if(e.target.id==="prizeCountInput"){const count=+e.target.value,current=[...document.querySelectorAll(".prize-value")].map(x=>+x.value),defaults={1:[100],2:[70,30],3:[50,30,20],4:[45,25,20,10],5:[40,25,15,10,10]},values=current.length===count?current:defaults[count];$("#prizeInputs").innerHTML=values.map((v,i)=>`<label>${i+1}°<input class="prize-value" type="number" min="0" max="100" step="1" value="${v}" aria-label="Premio ${i+1}"></label>`).join("");return}if(e.target.id!=="excelImport")return;const f=e.target.files[0];if(!f)return;try{const rows=f.name.toLowerCase().endsWith(".csv")?parseCSV(await f.text()):await readXlsx(f);importRows(rows);save(`${Math.max(0,rows.length-1)} righe importate da Excel`);render()}catch(err){console.error(err);toast(err.message||"Impossibile leggere il file Excel")}e.target.value=""});
$("#languageSelect").addEventListener("change",e=>{uiLanguage=e.target.value;localStorage.setItem(LANGUAGE_KEY,uiLanguage);const q=new URLSearchParams(location.search);if(ONLINE&&!remoteSession&&q.get("view")!=="public")showAuth();else render()});
document.addEventListener("submit",e=>{if(e.target.id==="authForm"){e.preventDefault();submitAuth(e.target)}});
function parseCSV(text){return text.split(/\r?\n/).filter(Boolean).map(line=>line.split(/[;,]/).map(x=>x.trim()))}
function importRows(rows){
 const headerIndex=rows.findIndex(r=>r.some(x=>["nome","nome e cognome","name","squadra","nome squadra","team"].includes(String(x||"").toLowerCase().trim())));if(headerIndex<0)throw Error("Intestazioni non riconosciute");
 const header=rows[headerIndex].map(x=>String(x||"").toLowerCase().trim()),data=rows.slice(headerIndex+1),col=(...names)=>header.findIndex(h=>names.includes(h));
 if(state.mode==="single"){const ni=col("nome","nome e cognome","name"),ci=col("contatto","telefono","contact"),ri=col("ruolo","ruolo preferito","role"),li=col("livello","level");if(ni<0)throw Error("Colonna nome assente");for(const r of data){const name=cleanText(r[ni],LIMITS.name);if(!name)continue;if(!validName(name))throw Error(`Nome non valido nel file: ${name}`);if(duplicateName(state.players,name))throw Error(`Nome duplicato nel file: ${name}`);state.players.push({id:uid("p"),name,contact:cleanText(r[ci],LIMITS.contact),role:normalizeRole(r[ri]),level:normalizeLevel(r[li])})}}
 else{const ti=col("squadra","nome squadra","team"),p1=col("giocatore 1","player 1"),p2=col("giocatore 2","player 2"),p3=col("giocatore 3","player 3"),ci=col("contatto","telefono","contact");if(ti<0||p1<0||p2<0||(state.teamSize===3&&p3<0))throw Error("Colonne squadra mancanti");for(const r of data){const name=cleanText(r[ti],LIMITS.name);if(!name)continue;if(!validName(name))throw Error(`Nome squadra non valido nel file: ${name}`);if(duplicateName(state.teams,name))throw Error(`Squadra duplicata nel file: ${name}`);const members=[cleanText(r[p1],LIMITS.name),cleanText(r[p2],LIMITS.name)];if(state.teamSize===3)members.push(cleanText(r[p3],LIMITS.name));if(members.some(x=>!validName(x))||new Set(members.map(normalizedName)).size!==members.length)throw Error(`Giocatori non validi nella squadra: ${name}`);state.teams.push({id:uid("t"),name,memberNames:members,contact:cleanText(r[ci],LIMITS.contact)})}}
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
