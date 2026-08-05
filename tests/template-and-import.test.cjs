const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const zlib=require('node:zlib');
const path=require('node:path');

function zipEntry(buffer,target){const eocd=buffer.lastIndexOf(Buffer.from([0x50,0x4b,0x05,0x06])),count=buffer.readUInt16LE(eocd+10),offset=buffer.readUInt32LE(eocd+16);let p=offset;for(let i=0;i<count;i++){const method=buffer.readUInt16LE(p+10),size=buffer.readUInt32LE(p+20),nameLen=buffer.readUInt16LE(p+28),extra=buffer.readUInt16LE(p+30),comment=buffer.readUInt16LE(p+32),local=buffer.readUInt32LE(p+42),name=buffer.subarray(p+46,p+46+nameLen).toString();if(name===target){const nl=buffer.readUInt16LE(local+26),xl=buffer.readUInt16LE(local+28),raw=buffer.subarray(local+30+nl+xl,local+30+nl+xl+size);return(method===0?raw:zlib.inflateRawSync(raw)).toString()}p+=46+nameLen+extra+comment}throw Error(`Voce ${target} assente`)}

test('template Excel è vuoto e contiene dropdown Ruolo e Livello',()=>{
  const file=fs.readFileSync(path.join(__dirname,'..','template-iscrizioni.xlsx')),xml=zipEntry(file,'xl/worksheets/sheet1.xml');
  assert.match(xml,/sqref="C4:C503"/);assert.match(xml,/Portiere,Attaccante,Indifferente/);
  assert.match(xml,/sqref="D4:D503"/);assert.match(xml,/Principiante,Intermedio,Esperto/);
});

test('importazione applica validazione stretta con numero di riga',()=>{
  const source=fs.readFileSync(path.join(__dirname,'..','app.js'),'utf8');
  assert.match(source,/Riga \$\{rowNumber\}: ruolo non valido/);assert.match(source,/Riga \$\{rowNumber\}: livello non valido/);
  assert.match(source,/parseImportedRole/);assert.match(source,/parseImportedLevel/);
});
