export function createEngine(){
const TYPES=['fire','water','wind','ground'],ELM={fire:'fire',light:'fire',water:'water',ice:'water',storm:'wind',shadow:'wind',plant:'ground',metal:'ground'},LIFE=4000;
const LN=[0,1,2,3,4];
const nf=(g,c)=>`<i class="nf${c?' '+c:''}">${g}</i>`,IC={atk:'\uf0e3',hp:'\uf004',en:'\uf219',deck:'\uf24d',gy:'\uf1f8',trap:'\uf070',tcard:'\uf1e2',spell:'\uf0d0',hand:'\uf256',ward:'\uf132',frz:'\uf2dc',burn:'\uf06d',user:'\uf007',tool:'\uf0ad',win:'\uf091',lose:'\uf119',back:'\uf060'};
const EM={fire:nf('\uf06d'),water:nf('\uf043'),wind:nf('\uf0c2'),ground:nf('\uf1b2'),white:nf('\uf007')},SETS={alpha:'Alpha',basic:'Basic Arsenal'},FAM={ninja:'Shadow Ninja'},ORD=['fire','water','wind','ground','white'];
const aura=c=>{if(typeof G==='undefined'||!G)return 0;const p=G.p.find(p=>p.board.includes(c));return p?p.board.reduce((s,x)=>x&&x!==c&&has(x,'aura')?s+x.A.n:s,0):0},ea=c=>c.atk+(c.atkMod||0)+aura(c),cl=(x,m)=>Math.min(m,Math.max(1,x));
const RAW={fire:['Ember Imp|300|200|S:burn:150','Cinder Hound|400|300|P:haste','Magma Golem|300|900|P:thorns:300','Flame Drake|500|500|P:pierce','Ash Wraith|450|350|D:dmgall:200','Pyre Scout|250|300|S:dmg:300','Scorch Berserker|600|400|K:buff:200','Volcano Caller|350|600|S:burnall:100','Phoenix Lord|550|700|D:raise','Solar Dragon|800|1000|S:face:150:g'],
water:['Tide Sprite|100|400|S:draw:1','Reef Shark|400|500|P:lifesteal','Kelp Guardian|200|1100|P:guard','Wave Serpent|350|700|T:heal:150','Tide Witch|250|600|T:en:1','Brine Scout|300|400|K:draw:1','Coral Brute|300|1200|P:ward','Riptide Sorcerer|500|600|S:bounce','Pearl Oracle|350|800|S:recall:1','Abyssal Kraken|700|1400|S:dmgall:100:g'],
plant:['Thorn Pup|150|500|W:dmg:150','Vine Lasher|350|450|T:buff:50','Moss Giant|250|1300|T:healme:200','Bramble Beast|400|700|S:buff:100:a','Spore Witch|300|500|S:en:2','Seed Scout|200|400|D:recall:1','Elder Treant|350|1400|T:hpall:100','Briar Berserker|550|700|P:twin','Grove Shaman|300|900|S:hpall:200','World Tree|600|1600|T:buffall:50'],
ice:['Frost Imp|200|300|S:freeze','Snow Wolf|400|400|P:snipe','Glacier Golem|250|1000|P:immune','Rime Drake|450|600|A:freeze','Hail Wraith|400|450|D:kill:500','Flurry Scout|250|400|S:loot:1','Frost Titan|500|1000|P:cleave','Hoar Berserker|550|600|K:en:2','Blizzard Mage|400|650|S:dmgall:150','Glacial Dragon|750|1100|T:freeze'],
storm:['Mute Wisp|250|200|S:silence','Tailwind Hawk|350|300|P:aura:100','Executioner Ox|450|800|P:deathtouch','Bolt Serpent|400|450|A:dmg:200','Static Ghost|350|400|D:dmg:400','Wind Scout|300|350|A:en:1','Plunder Roc|500|600|A:steal:100','Thunder Berserker|650|450|K:face:300','Cloud Caller|350|600|T:dmg:150','Storm Dragon|700|900|A:dmgall:100'],
shadow:['Gloom Imp|250|250|D:draw:1','Crypt Rat|300|300|D:mill:3','Bone Warden|250|1000|F:buff:200','Wraith Stalker|450|450|K:recall:1','Soul Leech|350|500|S:drain:2','Hex Witch|300|450|S:discard:1','Grave Knight|550|700|S:buff:100:g','Necromancer|400|700|S:raise','Void Reaper|600|600|S:consume','Lich King|700|1200|T:face:100:g'],
light:['Dawn Sprite|200|400|S:heal:400','Shield Cleric|250|600|S:wardall','Temple Mender|300|1100|W:healme:300','Sun Knight|450|600|A:heal:300','Radiant Healer|200|700|T:healall:150','Lightbringer|350|550|S:buffall:100','Archangel|600|900|D:rebirth','Seraph Oracle|350|700|S:fetchs','Holy Avenger|650|700|K:heal:500','Celestial Dragon|750|1300|T:wardall'],
metal:['Gear Sprite|150|450|P:armor:100','Rust Hound|350|450|S:weaken:100','Wall Golem|250|1200|S:token:300','Spike Turret|300|800|W:face:300','Steam Engine|250|600|C:en:1','Clockwork Soldier|350|500|S:disc:2','Cannon Walker|500|700|A:face:150','Plate Knight|450|900|W:buff:150','Trapsmith|350|800|S:settrap','Titan Colossus|700|1500|F:dmgall:100']};
const TR={S:'On summon: ',D:'On death: ',T:'Each turn: ',A:'On attack: ',K:'On kill: ',W:'When damaged: ',F:'When another ally is destroyed: ',C:'When you cast a spell: ',P:''},pl=(v,w)=>v+' '+w+(v>1?'s':'');
const ET={dmg:v=>`deal ${v} damage to a random enemy creature`,dmgall:v=>`deal ${v} damage to all enemy creatures`,face:v=>`deal ${v} damage to the foe`,heal:v=>`heal ${v} life`,healall:v=>`heal your creatures ${v}`,buff:v=>`gain +${v} Attack`,buffall:v=>`your creatures gain +${v} Attack`,hpall:v=>`your creatures gain +${v} HP`,draw:v=>`draw ${pl(v,'card')}`,en:v=>`gain ${v} energy`,burn:v=>`burn a random enemy creature (${v}/turn, 2 turns)`,burnall:v=>`burn all enemy creatures (${v}/turn, 2 turns)`,freeze:()=>'freeze a random enemy creature',raise:()=>'return the strongest creature in your graveyard at half HP',recall:v=>`return ${pl(v,'random creature')} from your graveyard to your hand`,
 guard:()=>'Guard: enemies must attack this first',haste:()=>'Haste: can attack the turn it is summoned',thorns:v=>`Thorns: attackers take ${v} damage`,pierce:()=>'Pierce: excess damage hits the foe',lifesteal:()=>'Lifesteal: heal half the damage dealt',twin:()=>'Twin: attacks twice each turn',ward:()=>'Ward: blocks the first damage it takes'};
const SC={g:' per card in your graveyard',a:' per other ally',f:' per other ally of its element',e:' per enemy creature'},atext=A=>TR[A.t]+ET[A.e](A.n)+(SC[A.s]||'');
Object.assign(ET,{drain:v=>`the foe loses ${v} energy`,discard:v=>`the foe discards ${pl(v,'random card')}`,weaken:v=>`all enemy creatures lose ${v} Attack`,wardall:()=>'your creatures gain Ward',rebirth:()=>'return this card to your hand',consume:()=>'destroy your weakest other ally and gain its Attack',healme:v=>`heal itself ${v}`,armor:v=>`Armor: reduces each hit it takes by ${v}`});
Object.assign(ET,{guard:()=>'Enemies must attack this creature first.',haste:()=>'Can attack the turn it is summoned.',thorns:v=>`Attackers take ${v} damage.`,pierce:()=>'Excess damage hits the foe.',lifesteal:()=>'Heals you for half the damage it deals.',twin:()=>'Attacks twice each turn.',ward:()=>'Blocks the first damage it takes.',armor:v=>`Reduces each hit it takes by ${v}.`,snipe:()=>'Can attack past Guards, and can hit the foe directly when its lane is open.',immune:()=>'Cannot be targeted by spells.',cleave:()=>'Also deals half damage to the enemy creatures beside its target.',deathtouch:()=>'Destroys any creature it damages.',aura:v=>`Your other creatures gain +${v} Attack.`,
steal:v=>`steal ${v} Attack from a random enemy creature`,bounce:()=>`return a random enemy creature to its owner's hand`,silence:()=>'remove the ability of a random enemy creature',mill:v=>`the foe sends ${v} cards from their deck to the graveyard`,token:v=>`summon a ${v}/${v} token`,loot:v=>`draw ${v}, then discard ${v} random card`,fetchs:()=>'add a random spell from your deck to your hand',settrap:()=>'set a random trap from your deck',disc:v=>`your next card costs ${v} less`,kill:v=>`destroy a random enemy creature with ${v} HP or less`,freezeall:()=>'freeze all enemy creatures',none:()=>'No ability.'});
Object.assign(SC,{r:' per energy you have left',h:' per card in your hand'});
const WT={steal:1,bounce:2,silence:1,mill:1,token:2,loot:1,fetchs:1,settrap:1,disc:1,kill:2,snipe:1,immune:1,cleave:1,deathtouch:2,aura:2,none:0,dmg:1,dmgall:2,face:1,heal:1,healall:1,buff:1,buffall:2,hpall:1,draw:1,en:0,burn:1,burnall:2,freeze:1,raise:2,recall:1,drain:1,discard:1,weaken:1,consume:0,rebirth:1,wardall:2,healme:0,guard:0,haste:1,thorns:1,pierce:1,lifesteal:1,twin:2,ward:1,armor:1};
const CARDS={};
Object.keys(RAW).forEach(t=>RAW[t].forEach((r,i)=>{const[n,a,h,ab]=r.split('|'),[tt,e,v,s]=ab.split(':');CARDS[t+i]={id:t+i,kind:'c',type:ELM[t],name:n,atk:+a,hp:+h,A:{t:tt,e,n:+v||0,s:s||''}}}));
[['fireball','Fireball','Deal 600 damage to an enemy creature.',2],['surge','Power Surge','+300 Attack to your creature this turn.',1],['frost','Frost Snap','Freeze an enemy creature: it skips its next attack.',2],['heal','Healing Rain','Gain 1000 life.',2],['inferno','Inferno','300 damage to ALL enemy creatures.',5],['mend','Mending Mist','Restore 900 HP to your creature.',2],['chain','Chain Lightning','500 damage to a target, 250 to the other enemies.',4],['grow','Overgrowth','Your creatures gain +300 HP.',4],['insight','Arcane Insight','Draw 2 cards.',2],
['raise','Raise Dead','Return the strongest creature in your graveyard to the arena at half HP.',4],['recall','Soul Recall','Return 2 random creatures from your graveyard to your hand.',2],['grave','Grave Blast','Deal 150 damage per card in your graveyard to an enemy creature.',3],['devour','Devour Spirits','Exile both graveyards. Gain 150 life per exiled card.',3],['charge','Energy Surge','Gain 3 energy.',2],['tithe','Grave Tithe','Gain 1 energy per 2 cards in your graveyard.',2],
['pact','Dark Pact','Destroy your creature. Gain 2 energy and draw a card.',1],['leech','Mana Leech','The foe loses 3 energy. You gain 2 energy.',2],['bless','Holy Blessing','Your creature gains +200 Attack, +300 HP and a ward.',3],['aegis','Divine Aegis','All your creatures gain a ward.',4],['corrode','Corrode','An enemy creature permanently loses 300 Attack.',2],['hex','Hex','The foe discards 2 random cards.',2],['overload','Overload','Deal 150 damage to the foe per energy you have left.',2],['echo','Spell Echo','Return the most recent spell in your graveyard to your hand.',2],
['cataclysm','Cataclysm','Destroy all enemy creatures.',9],['sealswords','Sealing Swords','Freeze all enemy creatures.',4],['smash','Crushing Blow','Destroy the enemy creature with the most HP.',4],['purge','Gale Purge','Destroy all enemy traps.',3],['breaker','Trap Breaker','Destroy a random enemy trap.',1],['rift','Void Rift','Destroy all creatures on both sides.',7],['fissure','Fissure','Destroy the enemy creature with the lowest Attack.',2],['seize','Mind Seize','Take control of an enemy creature.',8],['mulligan','Fresh Start','Discard your hand, then draw that many cards.',1],['reincarnate','Reincarnation','Discard a random card, then return the strongest creature in your graveyard to your hand.',1],['rouse','Rally Cry','All your creatures can attack this turn.',2],['execution','Execution','Destroy an enemy creature.',5],['berserk','Berserk','Double the Attack of your creature this turn.',2]].forEach(x=>CARDS[x[0]]={id:x[0],kind:'s',name:x[1],ab:x[2],cost:x[3]});
[['mirror','Mirror Shield','atk','When an enemy creature attacks: negate the attack and deal 600 damage to it.',3],['snare','Ice Snare','atk','When an enemy creature attacks: it is frozen after the attack.',2],['barrier','Stone Barrier','atk','When an enemy creature attacks: halve the damage.',2],['spike','Spike Pit','atk','When an enemy creature attacks: it takes 400 damage first.',2],['veil','Soul Veil','atk','When an enemy creature attacks: negate the attack and gain 500 life.',3],['reckon','Reckoning','direct','When an enemy creature attacks you directly: destroy it.',3],['chains','Rust Chains','atk','When an enemy creature attacks: it permanently loses 300 Attack.',2],
['trapdoor','Trapdoor','summon','When the foe summons a creature costing 5 or less: destroy it.',2],['siphon','Greedy Vault','summon','When the foe summons a creature: they lose 3 energy and you gain 1 energy.',2],['seal','Seal of Silence','spell','When the foe casts a spell: negate it.',3],['return','Soul Return','death','When your creature is destroyed: return it to your hand.',2],['oath','Martyr Oath','death','When your creature is destroyed: the foe takes 500 damage.',2]].forEach(x=>CARDS[x[0]]={id:x[0],kind:'t',name:x[1],trig:x[2],ab:x[3],cost:x[4]});
const SPR={fire:['Inferno Colossus|900|1200|K:dmgall:300|tribute:2','Crimson Wyrm|1000|900|A:face:200:g|exile:3'],water:['Leviathan Sovereign|800|1500|T:dmgall:100:e|tribute:2','Tidal Avatar|700|1300|S:draw:1:e|elem:2'],plant:['Verdant Titan|800|1600|S:hpall:200:a|discard:2','Sylvan Overlord|700|1400|T:token:200|elem:2'],ice:['Absolute Zero Sovereign|700|1400|S:freezeall|tribute:2','Permafrost Dragon|1100|1100|W:freeze|low:1500'],storm:['Thunder Emperor|1000|1000|K:dmg:400|discard:2','Tempest Lord|900|1100|S:dmgall:150:r|traps:2'],shadow:['Abyss Overlord|1100|1100|T:drain:2|exile:4','Soul Reaper|900|900|S:kill:900|tribute:1'],light:['Seraph Sovereign|1000|1500|T:heal:200:a|low:2000','Divine Arbiter|800|1600|S:healall:300|elem:2'],metal:['Iron Leviathan|900|1800|F:buffall:100|tribute:2','Mecha Overlord|1000|1500|A:buffall:100|discard:2']};
Object.keys(SPR).forEach(t=>SPR[t].forEach((r,i)=>{const[n,a,h,ab,sp]=r.split('|'),[tt,e,v,sc]=ab.split(':'),[k,sn]=sp.split(':');CARDS[t+'s'+i]={id:t+'s'+i,kind:'c',type:ELM[t],name:n,atk:+a,hp:+h,A:{t:tt,e,n:+v||0,s:sc||''},sp:{k,n:+sn,t:ELM[t]},cost:0,lv:8}}));
const condText=sp=>sp.k=='fam'?`Special Summon by putting ${sp.n} ${FAM[sp.f]} family creatures from your field into the graveyard.`:sp.k=='tribute'?`Special Summon by sacrificing ${sp.n} of your creatures.`:sp.k=='exile'?`Special Summon by exiling ${sp.n} cards from your graveyard.`:sp.k=='discard'?`Special Summon by discarding ${sp.n} cards.`:sp.k=='elem'?`Special Summon if you control ${sp.n} ${sp.t} creatures.`:sp.k=='low'?`Special Summon if your life is ${sp.n} or less.`:`Special Summon if you have ${sp.n} traps set.`;
const CURVE=[0,0,350,500,650,800,950,1100,1250,1450,1650,1850,2050];
Object.values(CARDS).forEach(c=>{if(c.kind!='c'||c.sp)return;const P=c.atk+c.hp/2,tier=Math.min(10,Math.max(2,Math.round(P/125))),r=c.atk/P,T=CURVE[tier];c.atk=Math.max(50,Math.round(T*r/10)*10);c.hp=Math.max(100,Math.round(2*T*(1-r)/10)*10);c.lv=c.cost=Math.min(7,Math.max(1,Math.round((tier+WT[c.A.e]+(c.A.s=='g'?1:0))*.6)))});
const SEL={fireball:'fire',surge:'fire',inferno:'fire',bless:'fire',aegis:'fire',overload:'fire',cataclysm:'fire',rouse:'fire',execution:'fire',berserk:'fire',reckon:'fire',oath:'fire',mirror:'fire',
 frost:'water',heal:'water',mend:'water',insight:'water',tithe:'water',echo:'water',sealswords:'water',reincarnate:'water',snare:'water',veil:'water',return:'water',
 chain:'wind',charge:'wind',leech:'wind',hex:'wind',mulligan:'wind',rift:'wind',seize:'wind',breaker:'wind',purge:'wind',seal:'wind',trapdoor:'wind',siphon:'wind',
 grow:'ground',raise:'ground',recall:'ground',grave:'ground',devour:'ground',pact:'ground',corrode:'ground',smash:'ground',fissure:'ground',barrier:'ground',chains:'ground',spike:'ground'};
Object.values(CARDS).forEach(c=>{if(c.kind!='c')c.type=SEL[c.id]});
Object.values(CARDS).forEach(c=>c.set='alpha');
Object.assign(ET,{clone:()=>'create a clone of itself (it is not summoned)',ninja:v=>`all your Shadow Ninja family creatures gain +${v} Attack and +${v} HP`});
const ninja=(id,name,atk,hp,cost,A,extra)=>CARDS[id]={id,kind:'c',type:'fire',name,atk,hp,A,cost,lv:cost,set:'basic',fam:'ninja',...extra};
ninja('basic1','Shadow Ninja',150,150,2,{t:'S',e:'clone',n:0,s:''},{rar:'common'});
ninja('basic2','Master of Shadow',50,300,4,{t:'S',e:'ninja',n:150,s:''},{rar:'rare'});
ninja('basic3','Shinobi of Mist',650,800,0,{t:'K',e:'ninja',n:100,s:''},{sp:{k:'fam',n:4,f:'ninja',t:'fire'},lv:8,rar:'special'});
CARDS.hide={id:'hide',kind:'s',type:'white',name:'Hide Behind Cover',ab:'Return an allied monster to your hand.',cost:1,set:'basic',rar:'common'};
CARDS.basic0={id:'basic0',kind:'c',type:'white',name:'Recruit',atk:400,hp:400,A:{t:'P',e:'none',n:0,s:''},cost:2,lv:2,set:'basic',rar:'common'};
const LIM={common:4,rare:3,epic:2,legendary:1,special:1},RN={common:'Common',rare:'Rare',epic:'Epic',legendary:'Legendary',special:'Special'};
const RK=(m,id)=>Object.keys(m).find(k=>m[k].split(' ').includes(id))||'common';
const RCm={common:'none dmg face heal buff draw en healme haste thorns pierce guard ward armor lifesteal burn freeze loot mill discard drain weaken disc token steal clone hpall recall',rare:'dmgall healall burnall buffall bounce silence fetchs settrap snipe immune cleave wardall ninja',epic:'kill consume rebirth twin deathtouch aura',legendary:'raise'},
RSm={common:'fireball surge frost heal mend insight charge mulligan breaker corrode hex tithe',rare:'inferno chain grow recall grave pact leech bless aegis overload echo purge fissure rouse berserk reincarnate',epic:'raise devour sealswords smash execution',legendary:'cataclysm rift seize'},
RTm={common:'spike barrier snare chains oath',rare:'mirror veil siphon return trapdoor',epic:'seal reckon'};
Object.values(CARDS).forEach(c=>{if(!c.rar)c.rar=c.sp?'special':c.kind=='c'?RK(RCm,c.A.e):c.kind=='s'?RK(RSm,c.id):RK(RTm,c.id)});
const STGT={fireball:'enemy',frost:'enemy',chain:'enemy',grave:'enemy',corrode:'enemy',execution:'enemy',seize:'enemy',surge:'mine',mend:'mine',pact:'mine',bless:'mine',berserk:'mine',hide:'mine'};
const D=s=>s.split(' ').flatMap(x=>{const[i,n]=x.split('*');return Array(+n||1).fill(i)});
const PRE=[{n:'Ashen Reborn',m:'fire',s:'water',d:D('fire0*2 fire4*2 fire5*2 fire6*2 fire7 fire8*2 fire9*2 water8 water4 plant5*2 raise*2 recall grave*2 devour fireball*2 tithe*2 mirror snare barrier')},
{n:'Tidal Engine',m:'water',s:'ice',d:D('water0*2 water2*2 water3*2 water4*2 water5*2 water8*2 water9*2 ice8 plant4*2 charge*2 insight*2 heal mend*2 recall mirror*2 barrier*2 snare')},
{n:'Overgrowth',m:'plant',s:'water',d:D('plant1*2 plant2*2 plant3*2 plant4*2 plant6*2 plant7*2 plant8*2 plant9*2 grow*2 mend*2 surge*2 insight*2 heal*2 mirror*2 barrier*2')},
{n:'Frozen Lock',m:'ice',s:'water',d:D('ice0*2 ice2*2 ice3*2 ice4*2 ice7*2 ice8*2 ice9*2 ice5 water7 frost*2 inferno chain insight charge grave heal fireball snare*2 mirror*2 barrier')},
{n:'Tempest Rush',m:'storm',s:'fire',d:D('storm0*2 storm1*2 storm3*2 storm5 storm6*2 storm7*2 storm8*2 storm9*2 fire5*2 fire3 chain*2 surge*2 fireball*2 charge*2 inferno mirror snare barrier')},
{n:'Soul Engine',m:'shadow',s:'water',d:D('shadow0*2 shadow3*2 shadow4 shadow5*2 shadow6*2 shadow7*2 shadow8 shadow9 water4*2 water8 pact*2 recall echo tithe*2 raise devour insight leech mirror*2 veil*2')},
{n:'Radiant Aegis',m:'light',s:'plant',d:D('light0*2 light1*2 light2*2 light3*2 light4*2 light5*2 light7 light8*2 light9 plant8*2 bless*2 aegis*2 heal*2 mend*2 grow veil*2 barrier')},
{n:'Iron Bastion',m:'metal',s:'ice',d:D('metal0*2 metal2*2 metal3*2 metal4*2 metal5*2 metal7*2 metal8*2 metal9 ice2 ice8 corrode*2 surge*2 frost*2 charge spike*2 barrier*2 mirror insight')},
{n:'Spellstorm',m:'storm',s:'water',d:D('storm0*2 storm5*2 storm8*2 storm9 water0*2 water3*2 water4*2 water5 fireball*2 chain*2 charge*2 overload*2 echo*2 insight*2 surge leech mirror snare')},
{n:'Grave Pact',m:'shadow',s:'fire',d:D('shadow0*2 shadow1*2 shadow2*2 shadow6*2 shadow8 shadow9 fire4*2 fire5*2 fire8*2 fire9 pact*2 raise grave*2 echo hex devour mirror*2 spike*2 barrier')},
{n:'Trap Fortress',m:'metal',s:'light',d:D('metal0*2 metal1 metal2*2 metal3*2 metal8*2 metal9 light2 light1*2 light6 mirror trapdoor*2 seal*2 return*2 oath*2 reckon*2 chains breaker purge insight*2')},
{n:'Absolute Control',m:'ice',s:'shadow',d:D('ice0*2 ice2*2 ice3*2 ice9 ice4*2 ice8*2 shadow4*2 shadow5*2 shadow9 sealswords*2 seize cataclysm fissure*2 smash execution frost*2 seal siphon insight*2')},
{n:'Chaos Rift',m:'fire',s:'storm',d:D('fire0*2 fire1*2 fire3*2 fire6*2 fire8 storm1*2 storm3*2 storm6*2 storm7 rouse*2 berserk*2 rift execution fireball*2 chain overload spike mirror*2 surge')}];
const fit60=p=>{const c={};p.d.forEach(i=>c[i]=(c[i]||0)+2);const out=[];Object.keys(c).forEach(i=>{for(let k=0;k<Math.min(LIM[CARDS[i].rar],c[i]);k++)out.push(i)});
 const sp=Object.keys(CARDS).filter(i=>CARDS[i].sp&&CARDS[i].set=='alpha'&&CARDS[i].type==p.m).slice(0,2),T=60-sp.length,pool=[...new Set(p.d)].concat(Object.keys(CARDS).filter(id=>!CARDS[id].sp&&CARDS[id].set=='alpha'&&(CARDS[id].type==p.m||CARDS[id].type==p.s)));
 for(let r=0;r<3&&out.length<T;r++)for(const id of pool){if(out.length>=T)break;if(out.filter(x=>x==id).length<LIM[CARDS[id].rar])out.push(id)}
 p.d=out.slice(0,T);sp.forEach(i=>p.d.push(i))};
PRE.forEach(p=>{p.m=ELM[p.m];p.s=ELM[p.s]});
PRE.forEach(fit60);
const DIFF=[{d:'Easy',t:'Plays cards at random, forgets spells and sometimes skips attacks.'},{d:'Normal',t:'Sensible plays: uses spells, finishes off weak creatures and avoids bad trades.'},{d:'Hard',t:'Dumps energy efficiently, focuses kills, baits traps and uses graveyard tricks.'}];
const NM={fire:['Pyra','Cinder','Solis','Ignis'],water:['Marin','Glacia','Tidus','Borealis'],wind:['Zephyr','Nyx','Gale','Vesper'],ground:['Old Thorn','Ferrus','Mossback','Ironside']};
const pick=a=>a[Math.random()*a.length|0];
function randOpp(lvl){const b=pick(PRE),deck=[...b.d],pool=Object.keys(CARDS).filter(id=>CARDS[id].set=='alpha'&&(CARDS[id].type==b.m||CARDS[id].type==b.s));
 for(let k=8+(Math.random()*5|0);k>0;k--){deck.splice(Math.random()*deck.length|0,1);let id;do id=pick(pool);while(deck.filter(x=>x==id).length>=LIM[CARDS[id].rar]);deck.push(id)}
 return{n:pick(NM[b.m]),m:b.m,s:b.s,lvl,d:DIFF[lvl].d,deck}}
let uid=1,G=null,FX={},FXT={},GH=[];const HOOKS={step:null,over:null},sleep=ms=>new Promise(r=>setTimeout(r,ms)),lg=s=>G.log.push(s);
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const has=(c,e)=>c.A&&c.A.t=='P'&&c.A.e==e,idxs=b=>b.map((x,i)=>x?i:-1).filter(i=>i>=0),cost=(p,c)=>Math.max(0,c.cost-(p.disc||0)),legal=(b,a)=>{if(a&&has(a,'snipe'))return idxs(b);const g=idxs(b).filter(i=>has(b[i],'guard'));return g.length?g:idxs(b)};
const isC=c=>c.kind=='c',side=p=>G.p[0]===p?0:1;
const mkP=(name,ids)=>({name,life:LIFE,en:6,cores:2,deck:shuffle(ids.map(id=>({...CARDS[id],uid:uid++,atkMod:0,ready:false,frozen:false,burn:0,bv:0,used:false,ward:has(CARDS[id],'ward'),max:CARDS[id].hp}))),hand:[],board:Array(5).fill(null),traps:[],gy:[]});
function check(){if(G.p[0].life<=0)G.over='lose';else if(G.p[1].life<=0)G.over='win';if(G.over&&HOOKS.over)HOOKS.over(G.over)}
function faceHit(p,n){n=Math.round(n);p.life-=n;FXT['f'+side(p)]='-'+n}
function healF(p,n){n=Math.round(n);p.life=Math.min(6000,p.life+n);FXT['f'+side(p)]='+'+n}
function healC(c,n){c.hp=Math.min(c.max,c.hp+n);FXT[c.uid]='+'+n}
function draw(p){if(p.deck.length&&p.hand.length>=8){lg(`${p.name}'s hand is full, no card drawn.`);if(side(p)==0)G.msg='Hand full: no card drawn this turn.';return}if(!p.deck.length){faceHit(p,200);lg(`${p.name} has no cards left and takes 200 damage!`);return}if(p.hand.length<8){const c=p.deck.pop();p.hand.push(c);if(G.net){FX[c.uid]='draw';G.dfx=G.dfx||[0,0];G.dfx[side(p)]++}else if(side(p)==0)FX[c.uid]='draw';else{G.dfx=G.dfx||[0,0];G.dfx[1]++}}}
function hurt(p,i,n,st){const c=p.board[i];if(!c)return;n=Math.round(n);if(has(c,'armor'))n=Math.max(0,n-c.A.n);if(c.ward&&n>0){c.ward=false;lg(`${c.name}'s ward absorbs the hit!`);FXT[c.uid]=nf(IC.ward);FX[c.uid]='hit|'+(st||c.type);return}
 c.hp-=n;FX[c.uid]='hit|'+(st||c.type);FXT[c.uid]='-'+n;
 if(c.hp<=0){p.board[i]=null;if(!c.token)p.gy.push(c);FX[c.uid]='die|'+(st||c.type);GH.push({s:side(p),i,c});lg(`${c.name} is destroyed.`);if(!c.token){const tid=fireTrap(p,'death',{c});if(tid=='return'&&p.hand.length<8){p.gy.splice(p.gy.indexOf(c),1);c.hp=c.max;p.hand.push(c)}else if(tid=='oath')faceHit(G.p[1-side(p)],500)}p.board.slice().forEach(x=>{if(x&&x.A.t=='F')run(p,x)});if(c.A.t=='D'&&p.gy.includes(c))run(p,c)}else if(n>0&&c.A.t=='W')run(p,c)}
function revive(p){const gc=p.gy.filter(isC).sort((a,b)=>b.atk+b.max-a.atk-a.max)[0],s=p.board.indexOf(null);if(!gc||s<0)return;
 p.gy.splice(p.gy.indexOf(gc),1);gc.hp=Math.ceil(gc.max/2);Object.assign(gc,{ready:false,frozen:false,burn:0,atkMod:0,ward:has(gc,'ward')});p.board[s]=gc;FX[gc.uid]='new';lg(`${gc.name} returns from the graveyard!`)}
function recall(p,n){for(let k=0;k<n;k++){const g=p.gy.filter(isC);if(!g.length||p.hand.length>=8)return;const c=pick(g);p.gy.splice(p.gy.indexOf(c),1);c.hp=c.max;p.hand.push(c);lg(`${c.name} returns to ${p.name}'s hand.`)}}
function discard(p,n){for(let k=0;k<n&&p.hand.length;k++){const c=p.hand.splice(Math.random()*p.hand.length|0,1)[0];p.gy.push(c);lg(`${p.name} discards ${c.name}.`)}}
function run(p,c){G.d=(G.d||0)+1;if(G.d>8){G.d--;return}try{runX(p,c)}finally{G.d--}}
function fireTrap(o,ev,x){const k=o.traps.findIndex(t=>(t.trig==ev||(t.trig=='atk'&&ev=='direct'))?(t.id!='trapdoor'||(x.c.lv||x.c.cost)<=5):false);if(k<0)return null;const t=o.traps.splice(k,1)[0];o.gy.push(t);lg(`${nf(IC.trap)} ${o.name} reveals ${t.name}!`);return t.id}
function runX(p,c){const A=c.A,en=G.p[1-side(p)];let v=A.n;
 if(A.s){v*=A.s=='g'?p.gy.length:A.s=='a'?p.board.filter(x=>x&&x!==c).length:A.s=='f'?p.board.filter(x=>x&&x!==c&&x.type==c.type).length:A.s=='r'?p.en:A.s=='h'?p.hand.length:idxs(en.board).length;if(!v)return}
 const E=A.e,rnd=()=>{const t=idxs(en.board);return t.length?pick(t):-1};lg(`${nf(IC.spell)} ${c.name}: ${atext(A)}`);
 if(E=='dmg'){const k=rnd();if(k>=0)hurt(en,k,v,c.type)}
 else if(E=='dmgall')en.board.forEach((x,k)=>{if(x)hurt(en,k,v,c.type)});
 else if(E=='face')faceHit(en,v);
 else if(E=='heal')healF(p,v);
 else if(E=='healall')p.board.forEach(x=>{if(x)healC(x,v)});
 else if(E=='buff'){c.atk+=v;FXT[c.uid]='+'+v+' '+nf(IC.atk,'ia')}
 else if(E=='buffall')p.board.forEach(x=>{if(x){x.atk+=v;FXT[x.uid]='+'+v+' '+nf(IC.atk,'ia')}});
 else if(E=='hpall')p.board.forEach(x=>{if(x){x.max+=v;x.hp+=v;FXT[x.uid]='+'+v}});
 else if(E=='draw')for(let i=0;i<v;i++)draw(p);
 else if(E=='en'){p.en+=v;FXT['f'+side(p)]='+'+v+' '+nf(IC.en)}
 else if(E=='burn'){const k=rnd();if(k>=0){en.board[k].burn=2;en.board[k].bv=v}}
 else if(E=='burnall')en.board.forEach(x=>{if(x){x.burn=2;x.bv=v}});
 else if(E=='freeze'){const k=rnd();if(k>=0)en.board[k].frozen=true}
 else if(E=='raise')revive(p);
 else if(E=='recall')recall(p,v);
 else if(E=='drain')en.en=Math.max(0,en.en-v);
 else if(E=='freezeall')en.board.forEach(x=>{if(x)x.frozen=true});
 else if(E=='discard')discard(en,v);
 else if(E=='weaken')en.board.forEach(x=>{if(x){x.atk=Math.max(0,x.atk-v);FXT[x.uid]='-'+v+' '+nf(IC.atk,'ia')}});
 else if(E=='wardall')p.board.forEach(x=>{if(x)x.ward=true});
 else if(E=='rebirth'){const k=p.gy.indexOf(c);if(k>=0&&p.hand.length<8){p.gy.splice(k,1);c.hp=c.max;c.ward=false;p.hand.push(c)}}
 else if(E=='consume'){const t=idxs(p.board).filter(i=>p.board[i]!==c).sort((a,b)=>p.board[a].atk+p.board[a].hp-p.board[b].atk-p.board[b].hp)[0];if(t!==undefined){c.atk+=p.board[t].atk;FXT[c.uid]='+'+p.board[t].atk+' '+nf(IC.atk,'ia');hurt(p,t,99999,c.type)}}
 else if(E=='healme')healC(c,v);
 else if(E=='steal'){const t=rnd();if(t>=0){const x=en.board[t],n=Math.min(v,x.atk);x.atk-=n;c.atk+=n;FXT[x.uid]='-'+n+' '+nf(IC.atk,'ia');FXT[c.uid]='+'+n+' '+nf(IC.atk,'ia')}}
 else if(E=='bounce'){const t=rnd();if(t>=0&&en.hand.length<8){const x=en.board[t];en.board[t]=null;Object.assign(x,{hp:x.max,ready:false,frozen:false,burn:0,atkMod:0,ward:has(x,'ward')});if(!x.token)en.hand.push(x)}}
 else if(E=='silence'){const t=rnd();if(t>=0){en.board[t].A={t:'P',e:'none',n:0,s:''};FX[en.board[t].uid]='hit|storm'}}
 else if(E=='mill'){for(let i=0;i<v;i++)if(en.deck.length)en.gy.push(en.deck.pop())}
 else if(E=='clone'){const sl=p.board.indexOf(null);if(sl>=0){const b=CARDS[c.id],x={...b,uid:uid++,max:b.hp,atkMod:0,ready:false,frozen:false,burn:0,bv:0,used:false,ward:false,token:true};p.board[sl]=x;FX[x.uid]='new';lg(`${c.name} creates a clone.`)}}
 else if(E=='ninja')p.board.forEach(x=>{if(x&&x.fam=='ninja'){x.atk+=v;x.max+=v;x.hp+=v;FXT[x.uid]='+'+v+' '+nf(IC.atk,'ia')}});
 else if(E=='token'){const sl=p.board.indexOf(null);if(sl>=0){const x={id:'token',kind:'c',type:c.type,name:'Wall Token',atk:v,hp:v,max:v,A:{t:'P',e:'none',n:0,s:''},cost:0,uid:uid++,atkMod:0,ready:false,frozen:false,burn:0,bv:0,used:false,ward:false,token:true};p.board[sl]=x;FX[x.uid]='new'}}
 else if(E=='loot'){draw(p);discard(p,1)}
 else if(E=='fetchs'){const i=p.deck.map(x=>x.kind).lastIndexOf('s');if(i>=0&&p.hand.length<8)p.hand.push(p.deck.splice(i,1)[0])}
 else if(E=='settrap'){const i=p.deck.map(x=>x.kind).lastIndexOf('t');if(i>=0&&p.traps.length<5)p.traps.push(p.deck.splice(i,1)[0])}
 else if(E=='disc')p.disc=v;
 else if(E=='kill'){const t=idxs(en.board).filter(i=>en.board[i].hp<=v);if(t.length)hurt(en,pick(t),99999,c.type)}
 check()}
function beginTurn(i){G.turn=i;G.p[i].tn=(G.p[i].tn||0)+1;G.tn=G.p[0].tn||0;G.sel=null;G.mode=null;const p=G.p[i];G.charged=false;G.bn=i?p.name+"'s turn":'Your turn';lg(`— ${p.name}'s turn —`);
 p.board.forEach((c,k)=>{if(!c)return;if(c.burn>0){c.burn--;lg(`${c.name} burns!`);hurt(p,k,c.bv||150,'fire');if(!p.board[k])return}c.ready=!c.frozen;c.used=false});
 p.board.slice().forEach(c=>{if(c&&p.board.includes(c)&&c.A.t=='T')run(p,c)});draw(p);check()}
function endTurn(){G.p[G.turn].en+=G.p[G.turn].cores;G.p[G.turn].board.forEach(c=>{if(c){c.atkMod=0;c.frozen=false}});beginTurn(1-G.turn)}
function charge(p,i){p.hand.splice(i,1);p.cores++;p.en++;G.charged=true;G.mode=null;lg(`${p.name} charges a core (${p.cores} cores).`)}
const canFace=(b,a,si)=>!idxs(b).length||(has(a,'snipe')&&!b[si]);
const playable=(p,c)=>c.sp?canSpecial(p,c):p.en>=cost(p,c)&&(c.kind!='c'||p.board.includes(null))&&(c.kind!='t'||p.traps.length<5);
function canSpecial(p,c){const s=c.sp,b=p.board.filter(x=>x),fr=p.board.includes(null);return s.k=='fam'?b.filter(x=>x.fam==s.f).length>=s.n:s.k=='tribute'?b.length>=s.n:s.k=='exile'?fr&&p.gy.length>=s.n:s.k=='discard'?fr&&p.hand.length-1>=s.n:s.k=='elem'?fr&&b.filter(x=>x.type==s.t).length>=s.n:s.k=='low'?fr&&p.life<=s.n:fr&&p.traps.length>=s.n}
function doSpecial(pi,c,pk){const p=G.p[pi],s=c.sp;if(s.k=='tribute')pk.forEach(i=>hurt(p,i,99999,'shadow'));else if(s.k=='exile'){for(let k=0;k<s.n;k++)p.gy.splice(Math.random()*p.gy.length|0,1)}else if(s.k=='discard'){p.hand.splice(p.hand.indexOf(c),1);discard(p,s.n);p.hand.push(c)}else if(s.k=='fam'){idxs(p.board).filter(i=>p.board[i].fam==s.f).slice(0,s.n).forEach(i=>{const x=p.board[i];p.board[i]=null;if(!x.token)p.gy.push(x)})}
 lg(`${p.name} Special Summons ${c.name}!`);summon(pi,c)}
function summon(pi,c){const p=G.p[pi],en=G.p[1-pi],sl=p.board.indexOf(null);p.en-=cost(p,c);p.disc=0;p.hand.splice(p.hand.indexOf(c),1);p.board[sl]=c;c.ready=has(c,'haste');FX[c.uid]='new';lg(`${p.name} summons ${c.name}.`);const tid=fireTrap(en,'summon',{c});if(tid=='trapdoor'){hurt(p,sl,99999,'shadow');return check()}if(tid=='siphon'){p.en=Math.max(0,p.en-3);en.en+=1}if(c.A.t=='S')run(p,c);check()}
function attack(pi,si,ti){const me=G.p[pi],en=G.p[1-pi],a=me.board[si];a.ready=has(a,'twin')&&!a.used;a.used=true;FX[a.uid]='atk|'+a.type;(G.fxq=G.fxq||[]).push({a:`${pi}-${si}`,t:ti<0?`face-${1-pi}`:`${1-pi}-${ti}`,c:{fire:'#ff7a3c',water:'#5ab4ff',wind:'#9fe6c8',ground:'#c8935a'}[a.type]||'#fff'});let tm=1;
 const tid=fireTrap(en,ti<0?'direct':'atk');if(tid=='mirror'){hurt(me,si,600,'ice');return check()}if(tid=='veil'){healF(en,500);return check()}if(tid=='reckon'){hurt(me,si,99999,'shadow');return check()}if(tid=='spike'){hurt(me,si,400,'metal');if(!me.board[si])return check()}if(tid=='snare')a.frozen=true;if(tid=='barrier')tm=.5;if(tid=='chains')a.atk=Math.max(0,a.atk-300);
 if(a.A.t=='A')run(me,a);
 const steal=n=>{if(has(a,'lifesteal'))healF(me,n/2)};
 if(ti<0){const n=Math.round(ea(a)*tm);faceHit(en,n);steal(n);lg(`${a.name} hits ${en.name} directly for ${n}.`);return check()}
 const d=en.board[ti];if(!d)return check();const dm=Math.round(ea(a)*tm),bk=ea(d),over=d.ward?0:dm-d.hp;
 lg(`${a.name} hits ${d.name} for ${dm}, takes ${bk}.`);hurt(en,ti,dm,a.type);steal(dm);hurt(me,si,bk,d.type);if(has(a,'deathtouch')&&en.board[ti]===d)hurt(en,ti,99999,a.type);if(has(a,'cleave'))[ti-1,ti+1].forEach(k=>{if(en.board[k])hurt(en,k,dm/2,a.type)});
 if(has(d,'thorns')&&me.board[si]){lg(`Thorns prick ${a.name}!`);hurt(me,si,d.A.n,'plant')}
 if(d.hp<=0){if(a.A.t=='K'&&me.board[si]===a)run(me,a);if(has(a,'pierce')&&over>0){faceHit(en,over);lg(`Pierce! ${over} damage to ${en.name}.`)}}
 check()}
function cast(pi,hi,ti){const p=G.p[pi],en=G.p[1-pi],c=p.hand.splice(hi,1)[0],id=c.id;p.en-=cost(p,c);p.disc=0;G.mode=null;lg(`${p.name} casts ${c.name}.`);if(fireTrap(en,'spell')=='seal'){lg('The spell is negated!');p.gy.push(c);return check()}
 if(id=='heal')healF(p,1000);else if(id=='insight'){draw(p);draw(p)}
 else if(id=='grow')p.board.forEach(x=>{if(x){x.max+=300;x.hp+=300;FXT[x.uid]='+300'}});
 else if(id=='inferno')en.board.forEach((x,k)=>{if(x)hurt(en,k,300,'fire')});
 else if(id=='fireball')hurt(en,ti,600,'fire');
 else if(id=='chain')en.board.forEach((x,k)=>{if(x)hurt(en,k,k==ti?500:250,'storm')});
 else if(id=='frost'){const t=en.board[ti];t.frozen=true;FX[t.uid]='hit|ice'}
 else if(id=='mend')healC(p.board[ti],900);
 else if(id=='surge'){const t=p.board[ti];t.atkMod+=300;FX[t.uid]='hit|storm';FXT[t.uid]='+300 '+nf(IC.atk,'ia')}
 else if(id=='raise')revive(p);else if(id=='recall')recall(p,2);
 else if(id=='grave')hurt(en,ti,150*p.gy.length,'storm');
 else if(id=='devour'){const n=p.gy.length+en.gy.length;p.gy=[];en.gy=[];healF(p,150*n)}
 else if(id=='charge'){p.en+=3;FXT['f'+pi]='+3 '+nf(IC.en)}
 else if(id=='tithe'){const n=p.gy.length>>1;p.en+=n;FXT['f'+pi]='+'+n+' '+nf(IC.en)}
 else if(id=='hide'){const x=p.board[ti];p.board[ti]=null;if(!x.token){const b=CARDS[x.id];Object.assign(x,{atk:b.atk,max:b.hp,hp:b.hp,ready:false,frozen:false,burn:0,atkMod:0,ward:has(x,'ward')});p.hand.push(x)}lg(`${x.name} returns to ${p.name}'s hand.`)}
  else if(id=='pact'){hurt(p,ti,99999,'shadow');p.en+=2;draw(p)}
 else if(id=='leech'){en.en=Math.max(0,en.en-3);p.en+=2}
 else if(id=='bless'){const t=p.board[ti];t.atk+=200;t.max+=300;t.hp+=300;t.ward=true;FX[t.uid]='hit|light';FXT[t.uid]='+200 '+nf(IC.atk,'ia')}
 else if(id=='aegis')p.board.forEach(x=>{if(x)x.ward=true});
 else if(id=='corrode'){const t=en.board[ti];t.atk=Math.max(0,t.atk-300);FX[t.uid]='hit|metal';FXT[t.uid]='-300 '+nf(IC.atk,'ia')}
 else if(id=='hex')discard(en,2);
 else if(id=='overload')faceHit(en,150*p.en);
 else if(id=='echo'){const g=p.gy.filter(x=>x.kind=='s').pop();if(g){p.gy.splice(p.gy.indexOf(g),1);p.hand.push(g)}}
 else if(id=='cataclysm')en.board.forEach((x,k)=>{if(x)hurt(en,k,99999,'storm')});
 else if(id=='sealswords')en.board.forEach(x=>{if(x)x.frozen=true});
 else if(id=='smash'){const t=idxs(en.board).sort((a,b)=>en.board[b].hp-en.board[a].hp)[0];if(t!==undefined)hurt(en,t,99999,'metal')}
 else if(id=='purge'){en.gy.push(...en.traps.splice(0));lg('All enemy traps are destroyed.')}
 else if(id=='breaker'){if(en.traps.length){const t=en.traps.splice(Math.random()*en.traps.length|0,1)[0];en.gy.push(t);lg(`${t.name} is destroyed.`)}}
 else if(id=='rift'){[p,en].forEach(q=>q.board.forEach((x,k)=>{if(x)hurt(q,k,99999,'shadow')}))}
 else if(id=='fissure'){const t=idxs(en.board).sort((a,b)=>ea(en.board[a])-ea(en.board[b]))[0];if(t!==undefined)hurt(en,t,99999,'fire')}
 else if(id=='seize'){const x=en.board[ti],sl=p.board.indexOf(null);if(x&&sl>=0){en.board[ti]=null;p.board[sl]=x;x.ready=false;x.frozen=false;FX[x.uid]='new';lg(`${p.name} takes control of ${x.name}!`)}}
 else if(id=='mulligan'){const n=p.hand.length;p.gy.push(...p.hand.splice(0));for(let k=0;k<n;k++)draw(p)}
 else if(id=='reincarnate'){discard(p,1);const g=p.gy.filter(isC).sort((a,b)=>b.atk+b.max-a.atk-a.max)[0];if(g&&p.hand.length<8){p.gy.splice(p.gy.indexOf(g),1);g.hp=g.max;p.hand.push(g)}}
 else if(id=='rouse')p.board.forEach(x=>{if(x){x.ready=true;x.used=false}});
 else if(id=='execution')hurt(en,ti,99999,'shadow');
 else if(id=='berserk'){const t=p.board[ti];t.atkMod+=ea(t);FX[t.uid]='hit|fire';FXT[t.uid]='x2 '+nf(IC.atk,'ia')}
 p.gy.push(c);p.board.slice().forEach(x=>{if(x&&p.board.includes(x)&&x.A.t=='C')run(p,x)});check()}
const need=(c,me,en)=>{const id=c.id,gc=me.gy.some(isC);return id=='raise'&&(!gc||!me.board.includes(null))?'Nothing to raise.':(id=='recall'||id=='reincarnate')&&!gc?'No creatures in your graveyard.':id=='echo'&&!me.gy.some(x=>x.kind=='s')?'No spell in your graveyard.':id=='seize'&&!me.board.includes(null)?'Your arena is full.':id=='breaker'&&!en.traps.length?'The foe has no traps.':''};
function aiSpell(ai,pl,L){const pe=idxs(pl.board).filter(i=>!has(pl.board[i],'immune')),me=idxs(ai.board),big=pe.slice().sort((a,b)=>pl.board[b].atk-pl.board[a].atk)[0],gc=ai.gy.filter(isC);
 for(let hi=0;hi<ai.hand.length;hi++){const c=ai.hand[hi],id=c.id;if(c.kind!='s'||c.cost>ai.en)continue;
  if(id=='heal'&&ai.life<=2400)return[hi,0];if(id=='insight'&&ai.hand.length<=5)return[hi,0];
  if(id=='inferno'&&pe.length>=2)return[hi,0];if(id=='grow'&&me.length>=2)return[hi,0];
  if(id=='fireball'&&pe.length){const k=pe.find(i=>pl.board[i].hp<=600);return[hi,k!==undefined?k:big]}
  if(id=='chain'&&pe.length>=2)return[hi,big];if(id=='frost'&&L&&pe.length)return[hi,big];
  if(id=='mend'){const k=me.find(i=>ai.board[i].hp<ai.board[i].max*.6);if(k!==undefined)return[hi,k]}
  if(id=='surge'){const m=me.filter(i=>ai.board[i].ready);if(m.length)return[hi,m[0]]}
  if(id=='raise'&&gc.length&&ai.board.includes(null))return[hi,0];
  if(id=='recall'&&gc.length>=2&&ai.hand.length<=5)return[hi,0];
  if(id=='grave'&&pe.length&&ai.gy.length>=3)return[hi,big];
  if(id=='devour'&&L&&ai.gy.length+pl.gy.length>=5)return[hi,0];
  if(id=='charge'&&ai.hand.some(x=>x.cost>ai.en&&x.cost<=ai.en+2))return[hi,0];
  if(id=='tithe'&&ai.gy.length>=4)return[hi,0];
  if(id=='leech'&&pl.en>=3)return[hi,0];
  if(id=='bless'&&me.length)return[hi,me.slice().sort((a,b)=>ai.board[b].atk-ai.board[a].atk)[0]];
  if(id=='aegis'&&me.length>=2)return[hi,0];
  if(id=='corrode'&&big!==undefined&&pl.board[big].atk>=400)return[hi,big];
  if(id=='hex'&&pl.hand.length>=3)return[hi,0];
  if(id=='overload'&&(ai.en-c.cost)*150>=Math.min(pl.life,2500))return[hi,0];
  if(id=='echo'&&ai.gy.some(x=>x.kind=='s')&&ai.en>=c.cost+2)return[hi,0];
  if(id=='pact'){const k=me.find(i=>ai.board[i].A.t=='D');if(k!==undefined)return[hi,k]}
  if(id=='cataclysm'&&pe.length>=3&&me.length<=1)return[hi,0];
  if(id=='rift'&&pe.length>=3&&me.length<=1)return[hi,0];
  if(id=='sealswords'&&L&&pe.length>=2)return[hi,0];
  if(id=='smash'&&L&&pe.length)return[hi,0];
  if(id=='fissure'&&pe.length)return[hi,0];
  if(id=='execution'&&pe.length)return[hi,big];
  if(id=='seize'&&pe.length&&ai.board.includes(null))return[hi,big];
  if(id=='purge'&&pl.traps.length>=2)return[hi,0];
  if(id=='breaker'&&L&&pl.traps.length)return[hi,0];
  if(id=='mulligan'&&ai.hand.length<=1)return[hi,0];
  if(id=='reincarnate'&&gc.length&&ai.hand.length<=5)return[hi,0];
  if(id=='rouse'&&me.some(i=>!ai.board[i].ready&&!ai.board[i].frozen))return[hi,0];
  if(id=='berserk'){const m=me.filter(i=>ai.board[i].ready&&ea(ai.board[i])>=400);if(m.length)return[hi,m[0]]}}return null}
async function aiTurn(){const g=G,[pl,ai]=g.p,L=g.opp.lvl;g.busy=true;if(!await HOOKS.step(g,400))return;
 if(ai.hand.length>=3){const cm=ai.hand.filter(c=>c.kind=='c'&&!c.sp),cand=cm.filter(c=>c.cost>ai.en).sort((a,b)=>b.cost-a.cost)[0]||(cm.length>=2?cm.sort((a,b)=>a.cost-b.cost)[0]:null);if(cand){charge(ai,ai.hand.indexOf(cand));if(!await HOOKS.step(g,350))return}}
 for(const c of ai.hand.filter(x=>x.sp)){if(!L&&Math.random()<.5)continue;if(canSpecial(ai,c)){const sp=c.sp,pk=sp.k=='tribute'?idxs(ai.board).sort((a,b)=>ai.board[a].atk+ai.board[a].hp-ai.board[b].atk-ai.board[b].hp).slice(0,sp.n):[];doSpecial(1,c,pk);if(!await HOOKS.step(g,400))return}}
 while(ai.board.includes(null)){const cs=ai.hand.filter(c=>c.kind=='c'&&!c.sp&&c.cost<=ai.en);if(!cs.length)break;const sc=c=>c.atk+c.hp+(L?0:Math.random()*600);
  summon(1,cs.sort((a,b)=>L==2?(b.cost-a.cost)||(sc(b)-sc(a)):sc(b)-sc(a))[0]);if(!await HOOKS.step(g,350))return}
 for(;;){if(!L&&Math.random()<.5)break;const s=aiSpell(ai,pl,L);if(!s)break;cast(1,s[0],s[1]);if(!await HOOKS.step(g,400))return}
 while(ai.traps.length<5){const t=ai.hand.findIndex(c=>c.kind=='t'&&c.cost<=ai.en);if(t<0)break;const tc=ai.hand.splice(t,1)[0];ai.en-=tc.cost;ai.traps.push(tc);lg(`${ai.name} sets a trap face down.`)}
 for(let q=0;q<6;q++){const si=q%3,a=ai.board[si];if(!a||!a.ready)continue;const tg=legal(pl.board,a);
  const fc=canFace(pl.board,a,si);if(!tg.length||(fc&&Math.random()<.6))attack(1,si,-1);
  else{let best=-1,bs=-1e9,bad=false;for(const ti of tg){const d=pl.board[ti],dm=ea(a),bk=ea(d),kill=dm>=d.hp,die=bk>=a.hp,sc=(kill?d.atk+d.hp+300:dm)-(die?a.atk+a.hp:bk*.5)+(L?0:Math.random()*800-400)+(L==2&&has(d,'guard')?300:0);if(sc>bs){bs=sc;best=ti;bad=die&&!kill}}
   if((L&&bad)||(!L&&Math.random()<.25))continue;attack(1,si,best)}
  if(!await HOOKS.step(g,750))return}
 endTurn();g.busy=false;render()}
function openHand(p){for(let k=0;k<5;k++)p.hand.push(p.deck.pop());const ok=c=>c.kind=='c'&&!c.sp&&c.cost<=3;
 if(!p.hand.some(ok)){const i=p.deck.findIndex(ok);if(i>=0){let j=p.hand.findIndex(c=>c.kind!='c');if(j<0)j=p.hand.length-1;const c=p.hand[j];p.hand[j]=p.deck.splice(i,1)[0];p.deck.unshift(c)}}}
const ko=c=>c.kind=='c'?(c.sp?1:0):c.kind=='s'?2:3,kg=c=>c.kind=='c'?0:c.kind=='s'?1:2,handCmp=(a,b)=>kg(a)-kg(b)||ORD.indexOf(a.type)-ORD.indexOf(b.type)||(a.sp?99:a.cost)-(b.sp?99:b.cost)||a.name.localeCompare(b.name);
const info=c=>`${c.name}: ${atext(c.A)}`;
function battleAct(a,i){if(G.over||G.busy||G.turn!=0)return;const me=G.p[0],en=G.p[1];G.msg='';G.pv=null;if(a!='end')G.cf=0;
 if(a=='cancel'){G.mode=null;G.sel=null}
 else if(a=='end'){if(!G.cf&&G.tn==1&&!G.charged&&me.hand.some(c=>c.kind=='c'||c.kind=='s')){G.cf=1;G.msg='You have not charged a core yet. Press End turn again to confirm.'}else{G.cf=0;endTurn();if(!G.net)aiTurn()}}
 else if(a=='hand'){const c=me.hand[i],t=STGT[c.id];
  if(G.mode&&G.mode.t=='core'){if(c.kind!='c'&&c.kind!='s')G.msg='Only monster and spell cards can be charged as cores.';else charge(me,i)}
  else if(c.sp){if(!canSpecial(me,c))G.msg=condText(c.sp);else if(c.sp.k=='tribute'){G.mode={t:'trib',hi:i,need:c.sp.n,picks:[]};G.sel=null;G.msg=`Pick ${c.sp.n} of your creatures to sacrifice.`}else doSpecial(0,c,[])}
  else if(me.en<cost(me,c))G.msg=`Not enough energy (${cost(me,c)} needed).`;
  else if(c.kind=='c'){if(!me.board.includes(null))G.msg='Your arena is full.';else summon(0,c)}
  else if(c.kind=='t'){if(me.traps.length>=5)G.msg='Your trap lane is full.';else{me.hand.splice(i,1);me.en-=cost(me,c);me.disc=0;me.traps.push(c);lg(me.name=='You'?'You set a trap face down.':me.name+' sets a trap face down.')}}
  else if(need(c,me,en))G.msg=need(c,me,en);
  else if(!t)cast(0,i);else if(!(t=='mine'?me:en).board.some(x=>x&&(t=='mine'||!has(x,'immune'))))G.msg='No valid target.';else{G.mode={t,hi:i};G.sel=null;G.msg='Pick a target.'}}
 else if(a=='mine'){const c=me.board[i];if(G.mode&&G.mode.t=='trib'){const m=G.mode,k=m.picks.indexOf(i);if(k>=0)m.picks.splice(k,1);else m.picks.push(i);if(m.picks.length==m.need){const card=me.hand[m.hi];G.mode=null;doSpecial(0,card,m.picks)}else G.msg=`Pick ${m.need-m.picks.length} more.`}else if(G.mode&&G.mode.t=='mine')cast(0,G.mode.hi,i);else{G.msg=info(c);if(c.ready)G.sel=G.sel==i?null:i}}
 else if(a=='foe'){if(G.mode&&G.mode.t=='enemy'){if(has(en.board[i],'immune'))G.msg='That creature cannot be targeted.';else cast(0,G.mode.hi,i)}else if(G.sel!=null){if(!legal(en.board,me.board[G.sel]).includes(i))G.msg='A Guard must be defeated first.';else{attack(0,G.sel,i);G.sel=null}}else G.msg=info(en.board[i])}
 else if(a=='core'){if(G.charged)G.msg='You already charged a core this turn.';else if(!me.hand.some(x=>x.kind=='c'||x.kind=='s'))G.msg='You have no monster or spell cards to charge.';else{G.mode={t:'core'};G.sel=null;G.msg='Pick a monster or spell card from your hand to charge as a core.'}}
 else if(a=='trap')G.msg=me.traps[i].name+': '+me.traps[i].ab;
 else if(a=='face'&&G.sel!=null){const at=me.board[G.sel];if(!canFace(en.board,at,G.sel))G.msg=idxs(en.board).length?'Defeat the enemy creatures before attacking the foe directly.':'';else{attack(0,G.sel,-1);G.sel=null}}}
const okDrop=(d,z)=>{if(!G)return false;if(d.src=='mine')return z=='foe'||z=='face';const c=G.p[0].hand[d.i];if(!c)return false;if(z=='core')return(c.kind=='c'||c.kind=='s')&&!G.charged;if(c.kind=='c')return z=='field'||z=='mine';if(c.kind=='t')return z=='lane';const n=STGT[c.id];return n=='enemy'?z=='foe':n=='mine'?z=='mine':z=='field'||z=='mine'||z=='foe'};
function dropOn(d,zone,idx){const me=G.p[0];G.msg='';if(!okDrop(d,zone))return;
 if(d.src=='hand'){const c=me.hand[d.i];if(!c)return;
  if(zone=='core'){battleAct('core');if(G.mode&&G.mode.t=='core'){battleAct('hand',d.i);G.mode=null}return}
  if(c.kind=='s'&&STGT[c.id]){const need=STGT[c.id];battleAct('hand',d.i);if(G.mode&&G.mode.hi==d.i&&((zone=='foe'&&need=='enemy')||(zone=='mine'&&need=='mine')))battleAct(zone,idx);return}
  if(c.kind=='s'){if(zone!='face')battleAct('hand',d.i);return}
  if(['field','lane','mine'].includes(zone))battleAct('hand',d.i)}
 else if(d.src=='mine'){G.sel=null;G.mode=null;battleAct('mine',d.i);if(G.sel!=d.i)return;if(zone=='foe')battleAct('foe',idx);else if(zone=='face')battleAct('face')}}
const validDeck=d=>Array.isArray(d)&&d.length==60&&d.every(x=>typeof x=='string'&&CARDS[x]&&d.filter(y=>y==x).length<=LIM[CARDS[x].rar]);
const mirrorPos=s=>typeof s=='string'?s.replace(/^face-(\d)$/,(m,d)=>'face-'+(1-d)).replace(/^(\d)-/,(m,d)=>(1-d)+'-'):s;
const swapF=o=>{const r={};for(const k in o){const m=/^f([01])$/.exec(k);r[m?'f'+(1-m[1]):k]=o[k]}return r};
const mirrorEv=e=>({fx:swapF(e.fx||{}),fxt:swapF(e.fxt||{}),gh:(e.gh||[]).map(x=>({...x,s:1-x.s})),fxq:(e.fxq||[]).map(x=>({...x,a:mirrorPos(x.a),t:mirrorPos(x.t)})),dfx:e.dfx?[e.dfx[1],e.dfx[0]]:null,tch:e.tch});
const flipG=g=>{g.p.reverse();g.turn=1-g.turn;g.first=1-g.first;if(g.dfx)g.dfx.reverse();if(g.fxq)g.fxq.forEach(x=>{x.a=mirrorPos(x.a);x.t=mirrorPos(x.t)})};
function netStart(d0,d1,n0,n1){uid=1;FX={};FXT={};GH=[];G={p:[mkP(n0,d0),mkP(n1,d1)],log:[],msg:'',over:null,busy:false,net:1,ui:[{},{}],dfx:[0,0],fxq:[]};G.p.forEach(openHand);const f=Math.random()<.5?0:1;G.first=f;G.p[1-f].en+=1;lg(`Coin flip: ${G.p[f].name} goes first. ${G.p[1-f].name} gets 1 extra starting energy as the second player.`);beginTurn(f);G.p.forEach(p=>{p.hand.sort(handCmp);p.hand.forEach(c=>FX[c.uid]='draw')});const ev={fx:FX,fxt:FXT,gh:GH,fxq:[],dfx:[G.p[0].hand.length,G.p[1].hand.length],tch:true};G.fxq=[];G.dfx=[0,0];return{g:G,uid,ev}}
const ACTS=['hand','mine','foe','core','trap','face','end','cancel'],ZONES=['core','field','lane','mine','foe','face'],okI=x=>x===undefined||x===null||(Number.isInteger(x)&&x>=0&&x<20);
function netAct(st,k,req){
 if(!req||typeof req!='object')return{err:'Bad request'};
 if(req.t=='drop'){if(!req.d||!['hand','mine'].includes(req.d.src)||!Number.isInteger(req.d.i)||req.d.i<0||req.d.i>20||!ZONES.includes(req.zone)||!okI(req.idx))return{err:'Bad request'}}
 else if(req.t=='act'){if(!ACTS.includes(req.a)||!okI(req.i))return{err:'Bad request'}}
 else return{err:'Bad request'};
 G=st.g;uid=st.uid;FX={};FXT={};GH=[];G.fxq=[];G.dfx=[0,0];
 if(G.over)return{err:'The match is over'};
 if(G.turn!=k)return{err:'It is not your turn'};
 const t0=G.turn;
 if(k==1)flipG(G);
 const u=G.ui[k]||{};G.mode=u.mode||null;G.sel=u.sel==null?null:u.sel;G.cf=u.cf||0;G.msg='';G.tn=G.p[0].tn||0;
 const me=G.p[0],en=G.p[1],bad=(()=>{if(req.t=='act'){const i=req.i;if(req.a=='hand')return!me.hand[i];if(req.a=='mine')return!me.board[i];if(req.a=='foe')return!en.board[i];if(req.a=='trap')return!me.traps[i];return false}const d=req.d;if(d.src=='hand'&&!me.hand[d.i])return true;if(d.src=='mine'&&!me.board[d.i])return true;if(req.zone=='mine'||req.zone=='foe')return!(Number.isInteger(req.idx)&&(req.zone=='mine'?me:en).board[req.idx]);return false})();
 if(bad)return{err:'Invalid action'};
 try{if(req.t=='drop')dropOn(req.d,req.zone,Number.isInteger(req.idx)?req.idx:undefined);else battleAct(req.a,Number.isInteger(req.i)?req.i:undefined)}catch(e){return{err:'Invalid action'}}
 const mode=G.mode,sel=G.sel,cf=G.cf,msg=G.msg,over=G.over;
 let ev={fx:FX,fxt:FXT,gh:GH,fxq:[],dfx:null};if(k==1){G.over=null;flipG(G);ev=mirrorEv(ev)}
 ev.fxq=G.fxq;ev.dfx=G.dfx;ev.tch=G.turn!=t0;
 G.ui[k]={mode,sel,cf,msg};if(ev.tch)G.ui[1-k]={};
 delete G.mode;delete G.sel;delete G.cf;delete G.msg;delete G.pv;delete G.d;
 G.msg='';G.bn='';G.fxq=[];G.dfx=[0,0];
 if(over){G.over='done';G.winner=over=='win'?k:1-k}
 G.p.forEach(p=>p.hand.sort(handCmp));
 return{st:{g:G,uid,ev}}}
function netView(st,k){
 const g=JSON.parse(JSON.stringify(st.g));if(k==1)flipG(g);
 const u=(st.g.ui&&st.g.ui[k])||{};g.mode=u.mode||null;g.sel=u.sel==null?null:u.sel;g.cf=u.cf||0;g.msg=u.msg||'';
 const m=g.p[0],o=g.p[1];o.hand=o.hand.map(()=>({hidden:1,kind:'?',name:'?'}));o.deck=o.deck.map(()=>0);m.deck=m.deck.map(()=>0);o.traps=o.traps.map(()=>({hidden:1,kind:'t',name:'Trap'}));
 g.over=st.g.over?(st.g.winner==k?'win':'lose'):null;delete g.ui;delete g.winner;g.log=g.log.slice(-120);g.tn=m.tn||0;g.net=1;
 const e=st.ev?(k==1?mirrorEv(st.ev):st.ev):{fx:{},fxt:{},gh:[],fxq:[],dfx:null};
 g.fxq=e.fxq||[];g.dfx=e.dfx||[0,0];g.bn='';if(e.tch&&!g.over)g.bn=g.turn==0?'Your turn':o.name+"'s turn";
 return{g,ev:{fx:e.fx||{},fxt:e.fxt||{},gh:e.gh||[]}}}
const EC={CARDS,LIM,RN,PRE,validDeck,netStart,netAct,netView};

return EC}
