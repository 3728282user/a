const OL={me:null,cur:null,sub:'hub',form:{u:'',p:'',room:''},msg:'',board:null,hist:null,q:null,room:null,timer:null,reset:null};
const esc=s=>String(s==null?'':s).replace(/[&<>"'`]/g,c=>'&#'+c.charCodeAt(0)+';');
const apiCall=async(path,body)=>{try{const r=await fetch('/api/'+path,{method:body?'POST':'GET',headers:body?{'content-type':'application/json'}:{},body:body?JSON.stringify(body):undefined,credentials:'same-origin'});let d={};try{d=await r.json()}catch(e){}return{ok:r.ok,s:r.status,d}}catch(e){return{ok:false,s:0,d:{err:'Network error. Are you online?'}}}};
const avatar=d=>d&&d.id&&d.avatar?`<img src="https://cdn.discordapp.com/avatars/${esc(d.id)}/${esc(d.avatar)}.png?size=32" width=20 height=20 style="border-radius:50%;vertical-align:middle" alt="">`:'';
const dcName=d=>d?`${avatar(d)} ${esc(d.name)}`:'';
function oStop(){clearInterval(OL.timer);OL.timer=null}
const RANKC={Bronze:'#c58a5a',Silver:'#b8c0cc',Gold:'#d6b04a',Platinum:'#6fd0c8',Diamond:'#7cc4ff'};
const rankBadge=r=>`<span class=ol-rank style="--rc:${RANKC[rankName(r)]}">${rankName(r)}</span>`;
const olStat=(l,v)=>`<div class=ol-stat><b>${v}</b><span>${l}</span></div>`;
function renderOnline(){
 const m=OL.me,f=OL.form;
 const head=(t,btn)=>`<div class=ol-head>${btn===null?'':`<button data-a=${btn||'menu'}>${nf(IC.back)} ${btn?'Back':'Menu'}</button>`}<h2>${t}</h2></div>${OL.msg?`<div class=ol-msg>${esc(OL.msg)}</div>`:''}`;
 if(OL.sub=='queue')return `<div class="wrap ol">${head('Online',null)}<div class="ol-card ol-center"><div class=ol-spin></div><h3>Searching for a ${OL.q.mode} opponent</h3><p class=mut>${OL.q.sec}s elapsed. Ranked searches widen their rating range the longer you wait.</p><button data-a=o_qcancel>Cancel</button></div></div>`;
 if(OL.sub=='lobby')return `<div class="wrap ol">${head('Private room',null)}<div class="ol-card ol-center"><p class=mut>Share this code with a friend. The match starts as soon as they join.</p><div class=ol-code>${esc(OL.room.code)}</div><div class=ol-grid><button data-a=o_rcopy>Copy code</button><button data-a=o_rcancel>Close room</button></div></div></div>`;
 if(OL.sub=='board')return `<div class="wrap ol">${head('Leaderboard','o_back')}${(OL.board||[]).map((u,i)=>`<div class=ol-row style="--rc:${i==0?'#d6b04a':i==1?'#b8c0cc':i==2?'#c58a5a':'var(--line)'}"><span class=ol-pos>${i+1}</span><div class=ol-who><b>${esc(u.username)}</b>${u.discord?`<small>${dcName(u.discord)}</small>`:''}</div>${rankBadge(u.rating)}<b class=ol-num>${u.rating}</b><span class="mut ol-wl">${u.wins}W ${u.losses}L</span></div>`).join('')||'<div class="ol-card mut ol-center">No ranked games have been played yet.</div>'}</div>`;
 if(OL.sub=='hist')return `<div class="wrap ol">${head('Online match history','o_back')}${(OL.hist||[]).map(h=>`<div class=ol-row style="--rc:${h.result=='win'?'#6fbf6a':'#e0603f'}"><div class=ol-who><b>${h.result=='win'?'Victory':'Defeat'} vs ${esc(h.opp)}</b><small class=mut>${esc(h.mode)}${h.rd!=null&&h.mode=='ranked'?', '+(h.rd>=0?'+':'')+h.rd+' rating':''}${h.reason&&h.reason!='normal'?', '+esc(h.reason):''} · ${new Date(h.time).toLocaleString()}</small></div><button data-a=o_hexp data-id=${esc(h.id)}>Export log</button></div>`).join('')||'<div class="ol-card mut ol-center">No online matches yet.</div>'}</div>`;
 if(!m)return `<div class="wrap ol">${head('Online')}<div class=ol-card><h3>Sign in or create an account</h3><p class=mut>Accounts are standalone. You can link Discord afterwards for login and password recovery.</p>
 <div class=ol-field><label for=ou>Username</label><input id=ou value="${esc(f.u)}" maxlength=20 autocomplete=username placeholder="3-20 letters, numbers, _"></div>
 <div class=ol-field><label for=op>Password</label><input id=op type=password value="${esc(f.p)}" autocomplete=current-password placeholder="8 or more characters"></div>
 <div class=ol-grid><button class="pri big" data-a=o_login>Log in</button><button class=big data-a=o_register>Register</button></div>
 <div class=ol-or>or</div>
 <div class=ol-grid><button class=dc data-a=o_discord data-m=login>Log in with Discord</button><button data-a=o_discord data-m=reset>Forgot password</button></div></div></div>`;
 const ok=deckIds.length==60,can=ok&&!OL.cur;
 return `<div class="wrap ol">${head('Online')}
 <div class=ol-card><div class=ol-top><div><div class=ol-name>${esc(m.username)}</div><div class=mut>${m.discord?dcName(m.discord):'Discord not linked'}</div></div>${rankBadge(m.rating)}</div>
 <div class=ol-stats>${olStat('Rating',m.rating)}${olStat('Wins',m.wins)}${olStat('Losses',m.losses)}</div>
 <div class=ol-deck><span class=mut>Active deck</span><b>${esc(deckNm)}</b><span class="${ok?'mut':'ol-bad'}">${deckIds.length}/60</span><button data-a=deck>Deck builder</button></div></div>
 ${OL.cur?`<div class="ol-card ol-gold"><h3>You have a match in progress</h3><button class="pri big" data-a=o_resume>Resume match</button></div>`:''}
 ${ok?'':'<div class=ol-msg>Your active deck needs exactly 60 cards before you can play online.</div>'}
 <div class=ol-card><h3>Play</h3><div class=ol-grid><button class="pri big" data-a=o_qranked ${can?'':'disabled'}>Ranked match</button><button class=big data-a=o_qcasual ${can?'':'disabled'}>Casual match</button></div>
 <div class=ol-or>or play a friend</div>
 <div class=ol-join><button data-a=o_rcreate ${can?'':'disabled'}>Create private room</button><input id=orm placeholder="CODE" value="${esc(f.room)}" maxlength=6 autocomplete=off><button data-a=o_rjoin ${can?'':'disabled'}>Join</button></div></div>
 <div class=ol-grid3><button data-a=o_board>Leaderboard</button><button data-a=o_hist>Match history</button>${m.discord?'<button data-a=o_unlink>Unlink Discord</button>':'<button class=dc data-a=o_discord data-m=link>Link Discord</button>'}</div>
 <div class=ol-foot><button data-a=o_logout>Log out</button></div></div>`}
async function loadMe(){const r=await apiCall('me');OL.me=r.ok?r.d.me:null;OL.cur=r.ok?r.d.current:null;if(screen=='online')render()}
function oPoll(fn){oStop();OL.timer=setInterval(fn,1500)}
async function oAuth(kind){const f=OL.form;if(!f.u||!f.p){OL.msg='Enter a username and password.';return}const r=await apiCall(kind,{username:f.u,password:f.p});if(!r.ok){OL.msg=r.d.err||'Failed.';return}f.p='';OL.msg=kind=='register'?'Account created.':'';OL.me=r.d.me;OL.cur=r.d.current}
async function onlineAct(a,t){
 const f=OL.form;OL.msg='';
 if(a=='o_open'){screen='online';OL.sub='hub';await loadMe();return}
 if(a=='o_back'){oStop();OL.sub='hub';render();return}
 if(a=='o_login')await oAuth('login');
 else if(a=='o_register')await oAuth('register');
 else if(a=='o_logout'){await apiCall('logout',{});OL.me=null;OL.cur=null}
 else if(a=='o_discord'){location.href='/api/discord/start?mode='+t.dataset.m;return}
 else if(a=='o_unlink'){const r=await apiCall('discord/unlink',{});OL.msg=r.ok?'Discord unlinked.':(r.d.err||'Failed.');await loadMe()}
 else if(a=='o_qranked'||a=='o_qcasual'){const mode=a=='o_qranked'?'ranked':'casual';const r=await apiCall('queue',{mode,deck:deckIds});if(!r.ok)OL.msg=r.d.err||'Could not join the queue.';else if(r.d.status=='matched')return startNet(r.d.match,mode);else{OL.sub='queue';OL.q={mode,sec:0};oPoll(async()=>{OL.q.sec++;const q=await apiCall('queue');if(q.ok&&q.d.status=='matched'){oStop();startNet(q.d.match,mode)}else if(!q.ok){oStop();OL.sub='hub';OL.msg=q.d.err||'Queue lost.';render()}else render()})}}
 else if(a=='o_qcancel'){oStop();await apiCall('queue/cancel',{});OL.sub='hub'}
 else if(a=='o_rcreate'){const r=await apiCall('room/create',{deck:deckIds});if(!r.ok)OL.msg=r.d.err||'Could not create a room.';else{OL.room={code:r.d.code};OL.sub='lobby';oPoll(async()=>{const q=await apiCall('room?code='+OL.room.code);if(q.ok&&q.d.status=='matched'){oStop();startNet(q.d.match,'room')}else if(!q.ok){oStop();OL.sub='hub';OL.msg='Room closed.';render()}})}}
 else if(a=='o_rjoin'){const code=(f.room||'').trim().toUpperCase();if(!code){OL.msg='Enter a room code.'}else{const r=await apiCall('room/join',{code,deck:deckIds});if(!r.ok)OL.msg=r.d.err||'Could not join that room.';else return startNet(r.d.match,'room')}}
 else if(a=='o_rcancel'){oStop();await apiCall('room/cancel',{});OL.sub='hub'}
 else if(a=='o_board'){const r=await apiCall('leaderboard');OL.board=r.ok?r.d.users:[];OL.sub='board'}
 else if(a=='o_hist'){const r=await apiCall('history');OL.hist=r.ok?r.d.matches:[];OL.sub='hist'}
 else if(a=='o_hexp'){try{const r=await fetch('/api/match/'+t.dataset.id+'/log',{credentials:'same-origin'});const tx=await r.text(),u=URL.createObjectURL(new Blob([tx],{type:'text/plain'})),l=document.createElement('a');l.href=u;l.download='elemental-clash-online-'+t.dataset.id+'.txt';l.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}catch(e){OL.msg='Export failed.'}}
 else if(a=='o_rcopy'){try{await navigator.clipboard.writeText(OL.room.code);OL.msg='Code copied.'}catch(e){OL.msg='Could not copy. Select the code manually.'}}
 else if(a=='o_resume')return startNet(OL.cur,'resumed');
 render()}
function netLeave(){if(NET){const n=NET;NET=null;n.stop=true;if(G&&!G.over)apiCall('match/'+n.id+'/forfeit',{})}G=null;FX={};FXT={};GH=[]}
function applyNet(d){const old=G;NET.v=d.v;NET.left=d.left;NET.leftAt=Date.now();NET.reason=d.reason||'';NET.rt=d.you.rating;NET.mode=d.mode;NET.label=d.mode=='ranked'?'Ranked':d.mode=='room'?'Room':'Casual';G=d.g;G.net=1;G.ranked=false;G.rd=d.rd;G.opp={n:d.opp.name,lvl:0,d:'Online '+(d.opp.rating||''),m:'white',s:'white'};if(old&&old.net){G.gv=old.gv;G.pv=old.pv}FX=d.ev.fx;FXT=d.ev.fxt;GH=d.ev.gh}
async function startNet(id,label){oStop();NET={id,v:0,busy:false,left:0,leftAt:0,rt:0,reason:'',label:'',stop:false};const r=await apiCall('match/'+id);if(!r.ok){OL.msg=r.d.err||'Could not load the match.';NET=null;screen='online';OL.sub='hub';await loadMe();return}applyNet(r.d);screen='battle';render();netLoop()}
async function netLoop(){while(NET&&!NET.stop){const n=NET;if(G&&G.over)return;await sleep(G&&G.turn==0?2500:900);if(NET!==n||n.stop)return;if(n.busy)continue;const r=await apiCall(`match/${n.id}?v=${n.v}`);if(NET!==n||n.busy)continue;if(r.ok&&!r.d.same){applyNet(r.d);render()}else if(r.ok){n.left=r.d.left;n.leftAt=Date.now()}else if(r.s==403||r.s==404){NET=null;G=null;screen='online';OL.sub='hub';OL.msg='That match is no longer available.';loadMe();return}}}
async function netSend(body){if(!NET||NET.busy||!G||G.over)return;const n=NET;n.busy=true;G.pv=null;const r=await apiCall(`match/${n.id}/act`,{...body,v:n.v});n.busy=false;if(NET!==n)return;if(r.ok){applyNet(r.d);render()}else{if(r.d&&r.d.g)applyNet(r.d);G.msg=r.d.err||'Action failed.';render()}}
document.addEventListener('input',e=>{const i=e.target.id;if(i=='ou')OL.form.u=e.target.value;else if(i=='op')OL.form.p=e.target.value;else if(i=='orm')OL.form.room=e.target.value});
document.addEventListener('keydown',e=>{if(e.key!='Enter'||screen!='online'||!e.target.id)return;if(e.target.id=='orm')onlineAct('o_rjoin');else if(e.target.id=='ou'||e.target.id=='op')onlineAct('o_login')});
setInterval(()=>{const el=document.getElementById('nt');if(el&&NET&&G&&G.net&&!G.over){const s=Math.max(0,Math.round(NET.left-(Date.now()-NET.leftAt)/1000));el.textContent=` · ${G.turn==0?'Your':'Their'} turn: ${s}s`}},500);
(function init(){const q=new URLSearchParams(location.search);if(!q.has('online'))return;screen='online';OL.sub='hub';const msgs={linked:'Discord linked.',loggedin:'Logged in with Discord.',nolink:'No account is linked to that Discord user. Log in with your password and link Discord first.',taken:'That Discord account is already linked to another account.',err:'Discord login failed. Try again.'};OL.msg=msgs[q.get('m')]||'';const r=q.get('reset');history.replaceState(null,'',location.pathname);loadMe().then(async()=>{render();if(r){const pw=prompt('Choose a new password (8+ characters)');if(pw){const x=await apiCall('reset',{token:r,password:pw});OL.msg=x.ok?'Password updated. Log in with your new password.':(x.d.err||'Reset failed.');if(x.ok){OL.me=null}render()}}})})();
