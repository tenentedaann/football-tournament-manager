(function(root,factory){const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;else root.SwissEngine=api})(typeof globalThis!=="undefined"?globalThis:this,function(){
  function clampConfig(teamCount,rounds=8,qualifiers=16){
    const maxRounds=Math.max(1,teamCount-1),safeRounds=Math.max(1,Math.min(maxRounds,Number(rounds)||8));
    let safeQualifiers=1;while(safeQualifiers*2<=teamCount&&safeQualifiers*2<=128)safeQualifiers*=2;
    safeQualifiers=Math.max(2,Math.min(safeQualifiers,Number(qualifiers)||16));
    if((safeQualifiers&(safeQualifiers-1))!==0)safeQualifiers=2**Math.floor(Math.log2(safeQualifiers));
    return{rounds:safeRounds,qualifiers:safeQualifiers};
  }
  function standings(teamIds,matches,seedValue=id=>String(id)){
    const rows=new Map(teamIds.map(id=>[id,{id,pts:0,w:0,l:0,byes:0,gf:0,ga:0,gd:0,opponents:[],tie:seedValue(id)}]));
    matches.filter(m=>m.played).forEach(m=>{
      const a=rows.get(m.a);if(!a)return;
      if(m.bye||!m.b){a.pts+=3;a.w++;a.byes++;return}
      const b=rows.get(m.b);if(!b)return;
      a.opponents.push(b.id);b.opponents.push(a.id);a.gf+=m.ga;a.ga+=m.gb;b.gf+=m.gb;b.ga+=m.ga;
      const win=m.ga>m.gb?a:b,lose=win===a?b:a;win.pts+=3;win.w++;lose.l++;
    });
    const list=[...rows.values()];list.forEach(r=>{r.gd=r.gf-r.ga;r.buchholz=r.opponents.reduce((sum,id)=>sum+(rows.get(id)?.pts||0),0);r.played=r.w+r.l});
    return list.sort((a,b)=>b.pts-a.pts||b.buchholz-a.buchholz||b.gd-a.gd||b.gf-a.gf||String(a.tie).localeCompare(String(b.tie)));
  }
  function pairRound(teamIds,matches,round,seedValue=id=>String(id)){
    const ranked=standings(teamIds,matches,seedValue),playedPairs=new Set(matches.filter(m=>m.b&&!m.bye).map(m=>[m.a,m.b].sort().join("|"))),remaining=[...ranked],pairs=[];let bye=null,forcedRematches=0;
    if(remaining.length%2){const priorByes=new Set(matches.filter(m=>m.bye).map(m=>m.a));let idx=-1;for(let i=remaining.length-1;i>=0;i--)if(!priorByes.has(remaining[i].id)){idx=i;break}if(idx<0)idx=remaining.length-1;bye=remaining.splice(idx,1)[0].id}
    const key=(a,b)=>[a.id,b.id].sort().join("|"),cost=(a,b)=>Math.abs(a.pts-b.pts)*100+Math.abs(a.buchholz-b.buchholz)*5;
    function solveNoRematch(pool){if(!pool.length)return[];let pick=0,fewest=Infinity;for(let i=0;i<pool.length;i++){const legal=pool.reduce((n,b,j)=>n+(i!==j&&!playedPairs.has(key(pool[i],b))),0);if(legal<fewest){fewest=legal;pick=i}}const a=pool[pick],rest=pool.filter((_,i)=>i!==pick),candidates=rest.filter(b=>!playedPairs.has(key(a,b))).sort((x,y)=>cost(a,x)-cost(a,y));for(const b of candidates){const tail=solveNoRematch(rest.filter(x=>x!==b));if(tail)return[{a:a.id,b:b.id},...tail]}return null}
    const exact=solveNoRematch(remaining);
    if(exact)pairs.push(...exact);else while(remaining.length){const a=remaining.shift();let best=0,bestCost=Infinity;for(let i=0;i<remaining.length;i++){const b=remaining[i],candidate=(playedPairs.has(key(a,b))?100000:0)+cost(a,b)+i;if(candidate<bestCost){bestCost=candidate;best=i}}const b=remaining.splice(best,1)[0];if(playedPairs.has(key(a,b)))forcedRematches++;pairs.push({a:a.id,b:b.id})}
    return{round,pairs,bye,forcedRematches,warning:forcedRematches?`${forcedRematches} rematch inevitabili: non esisteva un abbinamento completo alternativo.`:""};
  }
  return{clampConfig,standings,pairRound};
});
