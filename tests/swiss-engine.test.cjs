const test=require('node:test');
const assert=require('node:assert/strict');
const Swiss=require('../swiss-engine.js');

const ids=n=>Array.from({length:n},(_,i)=>`T${i+1}`);
const score=(pair,round,i)=>({id:`M${round}-${i}`,swissRound:round,...pair,played:true,ga:6,gb:i%6});

test('configurazione consigliata mantiene 8 turni e 16 qualificate per 24 squadre',()=>{
  assert.deepEqual(Swiss.clampConfig(24,8,16),{rounds:8,qualifiers:16});
});

test('ogni turno abbina una squadra una sola volta e senza rematch quando possibile',()=>{
  const teams=ids(24),r1=Swiss.pairRound(teams,[],1,id=>id);
  const used=r1.pairs.flatMap(p=>[p.a,p.b]);
  assert.equal(used.length,24);assert.equal(new Set(used).size,24);assert.equal(r1.forcedRematches,0);
  const played=r1.pairs.map((p,i)=>score(p,1,i)),r2=Swiss.pairRound(teams,played,2,id=>id);
  const old=new Set(r1.pairs.map(p=>[p.a,p.b].sort().join('|')));
  assert.equal(r2.pairs.some(p=>old.has([p.a,p.b].sort().join('|'))),false);
});

test('numero dispari assegna un solo bye e lo ruota',()=>{
  const teams=ids(5),r1=Swiss.pairRound(teams,[],1,id=>id);
  assert.ok(r1.bye);assert.equal(r1.pairs.length,2);
  const matches=[...r1.pairs.map((p,i)=>score(p,1,i)),{a:r1.bye,b:null,bye:true,played:true,swissRound:1}];
  const r2=Swiss.pairRound(teams,matches,2,id=>id);
  assert.ok(r2.bye);assert.notEqual(r2.bye,r1.bye);
});

test('classifica usa punti, Buchholz, differenza reti e gol fatti',()=>{
  const teams=ids(4),matches=[
    {a:'T1',b:'T2',played:true,ga:6,gb:1},
    {a:'T3',b:'T4',played:true,ga:6,gb:5},
    {a:'T1',b:'T3',played:true,ga:6,gb:5},
    {a:'T2',b:'T4',played:true,ga:6,gb:0}
  ];
  const table=Swiss.standings(teams,matches,id=>id);
  assert.equal(table[0].id,'T1');assert.equal(table[0].pts,6);assert.ok('buchholz' in table[0]);
});

test('bye vale tre punti ma non altera gol e differenza reti',()=>{
  const table=Swiss.standings(['A','B','C'],[{a:'C',b:null,bye:true,played:true}],id=>id);
  const c=table.find(x=>x.id==='C');assert.equal(c.pts,3);assert.equal(c.gf,0);assert.equal(c.gd,0);assert.equal(c.byes,1);
});

test('se ogni possibile coppia è già stata giocata segnala il rematch inevitabile',()=>{
  const teams=ids(4),matches=[];let n=0;for(let i=0;i<teams.length;i++)for(let j=i+1;j<teams.length;j++)matches.push({a:teams[i],b:teams[j],played:true,ga:6,gb:n++%6});
  const next=Swiss.pairRound(teams,matches,4,id=>id);
  assert.ok(next.forcedRematches>0);assert.match(next.warning,/rematch inevitabili/);
});
