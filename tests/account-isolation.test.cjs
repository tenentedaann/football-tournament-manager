const test=require('node:test');
const assert=require('node:assert/strict');
const isolation=require('../account-isolation.js');
const fs=require('node:fs');
function memoryStorage(){const data=new Map();return{setItem:(k,v)=>data.set(k,String(v)),getItem:k=>data.get(k)??null,removeItem:k=>data.delete(k),has:k=>data.has(k)}}
test('due account usano cache diverse',()=>{assert.notEqual(isolation.key('account-a'),isolation.key('account-b'))});
test('account B non vede i tornei di account A o legacy',()=>{const rows=[{id:'a',ownerId:'account-a'},{id:'b',ownerId:'account-b'},{id:'legacy'}];assert.deepEqual(isolation.filterOwned(rows,'account-b').map(x=>x.id),['b'])});
test('controllo proprietario rifiuta ID di altro account',()=>{assert.equal(isolation.owns({id:'a',ownerId:'account-a'},'account-b'),false);assert.equal(isolation.owns({id:'b',ownerId:'account-b'},'account-b'),true)});
test('query CRUD contiene sempre owner_id',()=>{assert.equal(isolation.ownerQuery('user/a'),'owner_id=eq.user%2Fa')});
test('logout elimina cache utente e chiavi legacy',()=>{const s=memoryStorage();s.setItem(isolation.key('account-a'),'A');s.setItem(isolation.key('account-b'),'B');s.setItem('calcio-balilla-library-v2','legacy');isolation.clearUserStorage(s,'account-a');assert.equal(s.getItem(isolation.key('account-a')),null);assert.equal(s.getItem('calcio-balilla-library-v2'),null);assert.equal(s.getItem(isolation.key('account-b')),'B')});
test('lettura, modifica ed eliminazione applicano il filtro proprietario',()=>{const source=fs.readFileSync(require.resolve('../app.js'),'utf8');assert.match(source,/tournaments\?\$\{AccountIsolation\.ownerQuery\(userId\)\}/);assert.match(source,/AccountIsolation\.ownerQuery\(userId\)[\s\S]{0,180}method:"PATCH"/);assert.match(source,/AccountIsolation\.ownerQuery\(userId\)[\s\S]{0,180}method:"DELETE"/)});
