import {createEngine} from '../../shared/engine.mjs';

let EC=null;
const eng=()=>EC||(EC=createEngine());
const TURN_SECS=120,FIRST_TURN_SECS=180,ELO_K=32,SESSION_DAYS=30;
const enc=new TextEncoder();
const hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const unhex=h=>new Uint8Array(h.match(/../g).map(x=>parseInt(x,16)));
const rand=n=>hex(crypto.getRandomValues(new Uint8Array(n)));
const sha=async s=>hex(await crypto.subtle.digest('SHA-256',enc.encode(s)));
const same=(a,b)=>{if(a.length!=b.length)return false;let r=0;for(let i=0;i<a.length;i++)r|=a.charCodeAt(i)^b.charCodeAt(i);return r==0};
async function pwHash(pw,saltHex){const k=await crypto.subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveBits']);return hex(await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:unhex(saltHex),iterations:100000},k,256))}
const parseCookies=req=>Object.fromEntries((req.headers.get('cookie')||'').split(/;\s*/).filter(Boolean).map(c=>{const i=c.indexOf('=');return[c.slice(0,i),c.slice(i+1)]}));
function out(body,status=200,cookies=[],extra={}){const h=new Headers({'content-type':'application/json','cache-control':'no-store',...extra});cookies.forEach(c=>h.append('set-cookie',c));return new Response(JSON.stringify(body),{status,headers:h})}
const fail=(m,s=400)=>out({err:m},s);
function redirect(to,cookies=[]){const h=new Headers({location:to,'cache-control':'no-store'});cookies.forEach(c=>h.append('set-cookie',c));return new Response(null,{status:302,headers:h})}
const ck=(url,name,val,maxAge,path='/')=>`${name}=${val}; Path=${path}; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${url.protocol=='https:'?'; Secure':''}`;

async function readBody(req){try{const t=await req.text();if(t.length>20000)return null;return JSON.parse(t||'{}')}catch(e){return null}}
async function sessionUser(req,env){const t=parseCookies(req).ec_session;if(!t||!/^[0-9a-f]{64}$/.test(t))return null;const h=await sha(t);return await env.DB.prepare('SELECT u.* FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires>?').bind(h,Date.now()).first()}
async function startSession(env,url,userId){const t=rand(32),h=await sha(t);await env.DB.prepare('INSERT INTO sessions(token_hash,user_id,expires) VALUES(?,?,?)').bind(h,userId,Date.now()+SESSION_DAYS*864e5).run();env.DB.prepare('DELETE FROM sessions WHERE expires<?').bind(Date.now()).run().catch(()=>{});return ck(url,'ec_session',t,SESSION_DAYS*86400)}
const discordInfo=u=>u.discord_id?{id:u.discord_id,name:u.discord_name,avatar:u.discord_avatar}:null;
const pub=u=>({username:u.username,rating:u.rating,wins:u.wins,losses:u.losses,discord:discordInfo(u)});
async function currentMatch(env,uid){await settleAll(env,uid);const r=await env.DB.prepare("SELECT id FROM matches WHERE status='active' AND (p0=? OR p1=?) ORDER BY created DESC LIMIT 1").bind(uid,uid).first();return r?r.id:null}

async function finish(env,row,st,winner,reason){
 st.g.over='done';st.g.winner=winner;
 let d0=0,d1=0;const ranked=row.mode=='ranked';
 if(ranked){const e0=1/(1+Math.pow(10,(row.r1-row.r0)/400));d0=Math.round(ELO_K*((winner==0?1:0)-e0));d1=-d0}
 const r=await env.DB.prepare("UPDATE matches SET state=?,ver=ver+1,status='done',winner=?,reason=?,updated=?,d0=?,d1=? WHERE id=? AND status='active' AND ver=?").bind(JSON.stringify(st),winner,reason,Date.now(),d0,d1,row.id,row.ver).run();
 if(r.meta.changes!=1)return false;
 if(ranked)await env.DB.batch([env.DB.prepare('UPDATE users SET rating=MAX(0,rating+?),wins=wins+?,losses=losses+? WHERE id=?').bind(d0,winner==0?1:0,winner==0?0:1,row.p0),env.DB.prepare('UPDATE users SET rating=MAX(0,rating+?),wins=wins+?,losses=losses+? WHERE id=?').bind(d1,winner==1?1:0,winner==1?0:1,row.p1)]);
 return true}
async function settle(env,row){
 if(!row||row.status!='active'||Date.now()<=row.deadline)return row;
 const st=JSON.parse(row.state),loser=st.g.turn;
 if(await finish(env,row,st,1-loser,'timeout'))return await env.DB.prepare('SELECT * FROM matches WHERE id=?').bind(row.id).first();
 return await env.DB.prepare('SELECT * FROM matches WHERE id=?').bind(row.id).first()}
async function settleAll(env,uid){const rows=await env.DB.prepare("SELECT * FROM matches WHERE status='active' AND deadline<? AND (p0=? OR p1=?)").bind(Date.now(),uid,uid).all();for(const r of rows.results||[])await settle(env,r)}

async function createMatch(env,uA,uB,deckA,deckB,mode){
 const flip=Math.random()<.5,[u0,u1]=flip?[uB,uA]:[uA,uB],[d0,d1]=flip?[deckB,deckA]:[deckA,deckB];
 const st=eng().netStart(d0,d1,u0.username,u1.username),id=rand(8),now=Date.now();
 await env.DB.prepare('INSERT INTO matches(id,p0,p1,mode,state,ver,status,deadline,created,updated,r0,r1) VALUES(?,?,?,?,?,1,?,?,?,?,?,?)').bind(id,u0.id,u1.id,mode,JSON.stringify(st),'active',now+FIRST_TURN_SECS*1000,now,now,u0.rating,u1.rating).run();
 return id}

async function matchPayload(env,row,u){
 const k=row.p0==u.id?0:1,st=JSON.parse(row.state),v=eng().netView(st,k);
 const o=await env.DB.prepare('SELECT username,rating,discord_id,discord_name,discord_avatar FROM users WHERE id=?').bind(k==0?row.p1:row.p0).first();
 const me=await env.DB.prepare('SELECT rating FROM users WHERE id=?').bind(u.id).first();
 return{v:row.ver,g:v.g,ev:v.ev,you:{rating:me.rating},opp:{name:o.username,rating:o.rating,discord:discordInfo(o)},left:Math.max(0,Math.round((row.deadline-Date.now())/1000)),mode:row.mode,rd:row.status=='done'&&row.mode=='ranked'?(k==0?row.d0:row.d1):null,reason:row.reason&&row.reason!='normal'?row.reason:''}}

async function tryMatch(env,q){
 const now=Date.now();
 await env.DB.prepare('DELETE FROM queue WHERE match_id IS NULL AND joined<?').bind(now-300000).run();
 const range=r=>r.mode=='ranked'?100+Math.floor((now-r.joined)/10000)*50:1e9;
 const c=await env.DB.prepare('SELECT * FROM queue WHERE user_id!=? AND mode=? AND match_id IS NULL ORDER BY joined LIMIT 25').bind(q.user_id,q.mode).all();
 const opp=(c.results||[]).find(o=>Math.abs(o.rating-q.rating)<=Math.max(range(q),range(o)));
 if(!opp)return null;
 const [a,b]=await Promise.all([env.DB.prepare('SELECT * FROM users WHERE id=?').bind(q.user_id).first(),env.DB.prepare('SELECT * FROM users WHERE id=?').bind(opp.user_id).first()]);
 if(!a||!b)return null;
 const claim=await env.DB.prepare("UPDATE queue SET match_id='pending' WHERE user_id=? AND match_id IS NULL").bind(opp.user_id).run();
 if(claim.meta.changes!=1)return null;
 const mine=await env.DB.prepare("UPDATE queue SET match_id='pending' WHERE user_id=? AND match_id IS NULL").bind(q.user_id).run();
 if(mine.meta.changes!=1){await env.DB.prepare('UPDATE queue SET match_id=NULL WHERE user_id=?').bind(opp.user_id).run();return null}
 const id=await createMatch(env,a,b,JSON.parse(q.deck),JSON.parse(opp.deck),q.mode);
 await env.DB.batch([env.DB.prepare('UPDATE queue SET match_id=? WHERE user_id=?').bind(id,q.user_id),env.DB.prepare('UPDATE queue SET match_id=? WHERE user_id=?').bind(id,opp.user_id)]);
 return id}

const NAME_RE=/^[A-Za-z0-9_]{3,20}$/;
const ROOM_CHARS='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const cleanText=s=>String(s).replace(/<[^>]*>/g,'').replace(/[\uE000-\uF8FF]/g,'').replace(/\s+/g,' ').trim();

async function discordStart(url,req,env,u){
 if(!env.DISCORD_CLIENT_ID||!env.DISCORD_CLIENT_SECRET)return redirect('/?online=1&m=err');
 const mode=url.searchParams.get('mode');if(!['link','login','reset'].includes(mode))return fail('Bad mode');
 if(mode=='link'&&!u)return redirect('/?online=1');
 const state=rand(16),redirectUri=env.DISCORD_REDIRECT||url.origin+'/api/discord/callback';
 const to='https://discord.com/oauth2/authorize?'+new URLSearchParams({client_id:env.DISCORD_CLIENT_ID,response_type:'code',redirect_uri:redirectUri,scope:'identify',state,prompt:'consent'});
 return redirect(to,[ck(url,'ec_oauth',state+'.'+mode,600,'/api/discord')])}
async function discordCallback(url,req,env,u){
 const c=parseCookies(req).ec_oauth||'',[state,mode]=c.split('.'),clear=ck(url,'ec_oauth','',0,'/api/discord');
 if(!state||!same(state,url.searchParams.get('state')||'')||!['link','login','reset'].includes(mode)||!url.searchParams.get('code'))return redirect('/?online=1&m=err',[clear]);
 const redirectUri=env.DISCORD_REDIRECT||url.origin+'/api/discord/callback';
 try{
  const tr=await fetch('https://discord.com/api/oauth2/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({client_id:env.DISCORD_CLIENT_ID,client_secret:env.DISCORD_CLIENT_SECRET,grant_type:'authorization_code',code:url.searchParams.get('code'),redirect_uri:redirectUri})});
  if(!tr.ok)return redirect('/?online=1&m=err',[clear]);
  const tok=await tr.json(),ur=await fetch('https://discord.com/api/users/@me',{headers:{authorization:'Bearer '+tok.access_token}});
  if(!ur.ok)return redirect('/?online=1&m=err',[clear]);
  const d=await ur.json(),did=String(d.id),dname=cleanText(d.global_name||d.username||'Discord user').slice(0,40);
  const owner=await env.DB.prepare('SELECT * FROM users WHERE discord_id=?').bind(did).first();
  if(mode=='link'){
   if(!u)return redirect('/?online=1',[clear]);
   if(owner&&owner.id!=u.id)return redirect('/?online=1&m=taken',[clear]);
   await env.DB.prepare('UPDATE users SET discord_id=?,discord_name=?,discord_avatar=? WHERE id=?').bind(did,dname,d.avatar||null,u.id).run();
   return redirect('/?online=1&m=linked',[clear])}
  if(!owner)return redirect('/?online=1&m=nolink',[clear]);
  await env.DB.prepare('UPDATE users SET discord_name=?,discord_avatar=? WHERE id=?').bind(dname,d.avatar||null,owner.id).run();
  if(mode=='login'){const s=await startSession(env,url,owner.id);return redirect('/?online=1&m=loggedin',[clear,s])}
  const t=rand(32);await env.DB.prepare('INSERT INTO resets(token_hash,user_id,expires) VALUES(?,?,?)').bind(await sha(t),owner.id,Date.now()+15*60000).run();
  return redirect('/?online=1&reset='+t,[clear])
 }catch(e){return redirect('/?online=1&m=err',[clear])}}

export async function onRequest({request,env}){
 const url=new URL(request.url),method=request.method,path=url.pathname.replace(/^\/api\/?/,'').replace(/\/+$/,'');
 if(!env.DB)return fail('Database is not configured. Add a D1 binding named DB.',500);
 if(method!='GET'&&method!='POST')return fail('Method not allowed',405);
 if(method=='POST'){const o=request.headers.get('origin');if(o&&new URL(o).host!=url.host)return fail('Bad origin',403)}
 try{
  const u=await sessionUser(request,env);
  const need=()=>u?null:fail('Please log in first.',401);
  if(path=='me'&&method=='GET'){if(!u)return fail('Not logged in',401);return out({me:pub(u),current:await currentMatch(env,u.id)})}
  if(path=='register'&&method=='POST'){
   const b=await readBody(request);if(!b)return fail('Bad request');
   const name=String(b.username||''),pw=String(b.password||'');
   if(!NAME_RE.test(name))return fail('Usernames are 3-20 letters, numbers or underscores.');
   if(pw.length<8||pw.length>100)return fail('Passwords need 8-100 characters.');
   if(await env.DB.prepare('SELECT id FROM users WHERE username=?').bind(name).first())return fail('That username is taken.',409);
   const salt=rand(16),h=await pwHash(pw,salt);
   const r=await env.DB.prepare('INSERT INTO users(username,pass_hash,salt,created) VALUES(?,?,?,?)').bind(name,h,salt,Date.now()).run();
   const nu=await env.DB.prepare('SELECT * FROM users WHERE username=?').bind(name).first();
   return out({me:pub(nu),current:null},200,[await startSession(env,url,nu.id)])}
  if(path=='login'&&method=='POST'){
   const b=await readBody(request);if(!b)return fail('Bad request');
   const nu=await env.DB.prepare('SELECT * FROM users WHERE username=?').bind(String(b.username||'')).first();
   const salt=nu?nu.salt:'00'.repeat(16),h=await pwHash(String(b.password||''),salt);
   if(!nu||!same(h,nu.pass_hash))return fail('Wrong username or password.',401);
   return out({me:pub(nu),current:await currentMatch(env,nu.id)},200,[await startSession(env,url,nu.id)])}
  if(path=='logout'&&method=='POST'){const t=parseCookies(request).ec_session;if(t)await env.DB.prepare('DELETE FROM sessions WHERE token_hash=?').bind(await sha(t)).run();return out({ok:true},200,[ck(url,'ec_session','',0)])}
  if(path=='reset'&&method=='POST'){
   const b=await readBody(request);if(!b)return fail('Bad request');
   const pw=String(b.password||''),t=String(b.token||'');
   if(pw.length<8||pw.length>100)return fail('Passwords need 8-100 characters.');
   if(!/^[0-9a-f]{64}$/.test(t))return fail('Invalid or expired reset link.');
   const th=await sha(t),r=await env.DB.prepare('SELECT * FROM resets WHERE token_hash=? AND expires>?').bind(th,Date.now()).first();
   if(!r)return fail('Invalid or expired reset link.');
   const salt=rand(16),h=await pwHash(pw,salt);
   await env.DB.batch([env.DB.prepare('UPDATE users SET pass_hash=?,salt=? WHERE id=?').bind(h,salt,r.user_id),env.DB.prepare('DELETE FROM resets WHERE user_id=?').bind(r.user_id),env.DB.prepare('DELETE FROM sessions WHERE user_id=?').bind(r.user_id)]);
   return out({ok:true})}
  if(path=='discord/start'&&method=='GET')return discordStart(url,request,env,u);
  if(path=='discord/callback'&&method=='GET')return discordCallback(url,request,env,u);
  if(path=='discord/unlink'&&method=='POST'){const e=need();if(e)return e;await env.DB.prepare('UPDATE users SET discord_id=NULL,discord_name=NULL,discord_avatar=NULL WHERE id=?').bind(u.id).run();return out({ok:true})}
  if(path=='leaderboard'&&method=='GET'){const r=await env.DB.prepare('SELECT username,rating,wins,losses,discord_id,discord_name,discord_avatar FROM users WHERE wins+losses>0 ORDER BY rating DESC, wins DESC LIMIT 50').all();return out({users:(r.results||[]).map(x=>({username:x.username,rating:x.rating,wins:x.wins,losses:x.losses,discord:discordInfo(x)}))})}

  const e0=need();if(e0)return e0;
  const E=eng();
  if(path=='history'&&method=='GET'){
   const r=await env.DB.prepare("SELECT m.*,a.username n0,b.username n1 FROM matches m JOIN users a ON a.id=m.p0 JOIN users b ON b.id=m.p1 WHERE m.status='done' AND (m.p0=? OR m.p1=?) ORDER BY m.updated DESC LIMIT 20").bind(u.id,u.id).all();
   return out({matches:(r.results||[]).map(m=>{const k=m.p0==u.id?0:1;return{id:m.id,opp:k==0?m.n1:m.n0,result:m.winner==k?'win':'lose',mode:m.mode,rd:k==0?m.d0:m.d1,reason:m.reason,time:m.updated}})})}
  if(path=='queue'&&method=='POST'){
   const b=await readBody(request);if(!b)return fail('Bad request');
   if(!['ranked','casual'].includes(b.mode))return fail('Bad mode');
   if(!E.validDeck(b.deck))return fail('Your deck is not valid: it needs 60 cards within the rarity limits.');
   if(await currentMatch(env,u.id))return fail('You already have an active match.',409);
   await env.DB.prepare('DELETE FROM queue WHERE user_id=?').bind(u.id).run();
   await env.DB.prepare('INSERT INTO queue(user_id,mode,deck,rating,joined) VALUES(?,?,?,?,?)').bind(u.id,b.mode,JSON.stringify(b.deck),u.rating,Date.now()).run();
   const q=await env.DB.prepare('SELECT * FROM queue WHERE user_id=?').bind(u.id).first(),id=await tryMatch(env,q);
   return out(id?{status:'matched',match:id}:{status:'waiting'})}
  if(path=='queue'&&method=='GET'){
   const q=await env.DB.prepare('SELECT * FROM queue WHERE user_id=?').bind(u.id).first();
   if(!q)return fail('You are not in the queue.',404);
   if(q.match_id&&q.match_id!='pending'){await env.DB.prepare('DELETE FROM queue WHERE user_id=?').bind(u.id).run();return out({status:'matched',match:q.match_id})}
   const id=q.match_id?null:await tryMatch(env,q);
   if(id){await env.DB.prepare('DELETE FROM queue WHERE user_id=?').bind(u.id).run();return out({status:'matched',match:id})}
   return out({status:'waiting',sec:Math.round((Date.now()-q.joined)/1000)})}
  if(path=='queue/cancel'&&method=='POST'){await env.DB.prepare('DELETE FROM queue WHERE user_id=? AND (match_id IS NULL)').bind(u.id).run();return out({ok:true})}
  if(path=='room/create'&&method=='POST'){
   const b=await readBody(request);if(!b)return fail('Bad request');
   if(!E.validDeck(b.deck))return fail('Your deck is not valid: it needs 60 cards within the rarity limits.');
   if(await currentMatch(env,u.id))return fail('You already have an active match.',409);
   await env.DB.prepare('DELETE FROM rooms WHERE host_id=? OR created<?').bind(u.id,Date.now()-900000).run();
   let code='';for(const x of crypto.getRandomValues(new Uint8Array(6)))code+=ROOM_CHARS[x%ROOM_CHARS.length];
   await env.DB.prepare('INSERT INTO rooms(code,host_id,host_deck,created) VALUES(?,?,?,?)').bind(code,u.id,JSON.stringify(b.deck),Date.now()).run();
   return out({code})}
  if(path=='room'&&method=='GET'){
   const r=await env.DB.prepare('SELECT * FROM rooms WHERE code=? AND host_id=?').bind(String(url.searchParams.get('code')||'').toUpperCase(),u.id).first();
   if(!r)return fail('Room not found.',404);
   return out(r.match_id?{status:'matched',match:r.match_id}:{status:'open'})}
  if(path=='room/cancel'&&method=='POST'){await env.DB.prepare('DELETE FROM rooms WHERE host_id=? AND match_id IS NULL').bind(u.id).run();return out({ok:true})}
  if(path=='room/join'&&method=='POST'){
   const b=await readBody(request);if(!b)return fail('Bad request');
   if(!E.validDeck(b.deck))return fail('Your deck is not valid: it needs 60 cards within the rarity limits.');
   if(await currentMatch(env,u.id))return fail('You already have an active match.',409);
   const r=await env.DB.prepare('SELECT * FROM rooms WHERE code=? AND match_id IS NULL AND created>?').bind(String(b.code||'').toUpperCase(),Date.now()-900000).first();
   if(!r)return fail('That room does not exist or has already started.',404);
   if(r.host_id==u.id)return fail('You cannot join your own room.');
   const host=await env.DB.prepare('SELECT * FROM users WHERE id=?').bind(r.host_id).first();
   const claim=await env.DB.prepare("UPDATE rooms SET match_id='pending' WHERE code=? AND match_id IS NULL").bind(r.code).run();
   if(claim.meta.changes!=1)return fail('That room has already started.',409);
   const id=await createMatch(env,host,u,JSON.parse(r.host_deck),b.deck,'casual');
   await env.DB.prepare('UPDATE rooms SET match_id=? WHERE code=?').bind(id,r.code).run();
   return out({match:id})}

  const mm=/^match\/([0-9a-f]{16})(?:\/(act|forfeit|log))?$/.exec(path);
  if(mm){
   let row=await env.DB.prepare('SELECT * FROM matches WHERE id=?').bind(mm[1]).first();
   if(!row||(row.p0!=u.id&&row.p1!=u.id))return fail('Match not found.',404);
   row=await settle(env,row);
   const k=row.p0==u.id?0:1;
   if(!mm[2]&&method=='GET'){
    const v=url.searchParams.get('v');
    if(v!==null&&+v==row.ver)return out({same:true,left:Math.max(0,Math.round((row.deadline-Date.now())/1000))});
    return out(await matchPayload(env,row,u))}
   if(mm[2]=='log'&&method=='GET'){
    const st=JSON.parse(row.state),a=await env.DB.prepare('SELECT username FROM users WHERE id=?').bind(row.p0).first(),b2=await env.DB.prepare('SELECT username FROM users WHERE id=?').bind(row.p1).first();
    const txt=`Elemental Clash online match ${row.id}\n${new Date(row.created).toISOString()}\n${a.username} vs ${b2.username} (${row.mode})\nResult: ${row.status=='done'?(row.winner==0?a.username:b2.username)+' won'+(row.reason&&row.reason!='normal'?' ('+row.reason+')':''):'in progress'}\n\n`+st.g.log.map(cleanText).join('\n');
    return new Response(txt,{headers:{'content-type':'text/plain; charset=utf-8','cache-control':'no-store'}})}
   if(mm[2]=='forfeit'&&method=='POST'){
    if(row.status!='active')return out({ok:true});
    await finish(env,row,JSON.parse(row.state),1-k,'resign');return out({ok:true})}
   if(mm[2]=='act'&&method=='POST'){
    if(row.status!='active')return fail('The match is over.',409);
    const b=await readBody(request);if(!b)return fail('Bad request');
    if(+b.v!=row.ver)return out({...(await matchPayload(env,row,u)),err:'The game state changed. Try again.'},409);
    const res=E.netAct(JSON.parse(row.state),k,b);
    if(res.err)return fail(res.err);
    const st=res.st;
    if(st.g.over=='done'){if(!(await finish(env,row,st,st.g.winner,'normal')))return fail('The game state changed. Try again.',409)}
    else{
     const dl=st.ev.tch?Date.now()+TURN_SECS*1000:row.deadline;
     const r=await env.DB.prepare('UPDATE matches SET state=?,ver=ver+1,deadline=?,updated=? WHERE id=? AND ver=? AND status=?').bind(JSON.stringify(st),dl,Date.now(),row.id,row.ver,'active').run();
     if(r.meta.changes!=1)return fail('The game state changed. Try again.',409)}
    row=await env.DB.prepare('SELECT * FROM matches WHERE id=?').bind(row.id).first();
    return out(await matchPayload(env,row,u))}
  }
  return fail('Not found',404)
 }catch(e){return fail('Server error',500)}
}
