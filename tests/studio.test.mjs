import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import vm from "node:vm";
const read=(file)=>readFileSync(new URL("../"+file,import.meta.url),"utf8");
const studio=read("studio.html"),home=read("index.html");
test("document shell and distinct brand",()=>{
  assert.match(studio,/<!doctype html>/i);
  assert.match(studio,/<html lang="pt-BR">/);
  assert.match(studio,/<title>DUCK STUDIO/);
  assert.match(home,/<title>DUCK/);
});
test("inline scripts are syntactically valid",()=>{
  for(const [name,html] of [["studio",studio],["home",home]]){
    const parts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)];
    assert.ok(parts.length,name+" has inline JavaScript");
    for(const [,source] of parts) new vm.Script(source,{filename:name+".js"});
  }
});
test("required workstation controls are available",()=>{
  const ids=[...studio.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
  assert.equal(ids.length,new Set(ids).size,"duplicate HTML IDs");
  for(const id of ["sequencer","keys","wave","cutoff","tuning","voice","mixer","sampleFile","mic","monitor","reverb","delay","distortion","chorus","record","save","load","bpm","status"])assert.ok(ids.includes(id),"missing "+id);
  const js=studio.match(/<script>([\s\S]*?)<\/script>/)?.[1]??"";
  const refs=[...js.matchAll(/\$\(["']([\w-]+)["']\)/g)].map(m=>m[1]);
  for(const ref of refs)assert.ok(ids.includes(ref),"unknown DOM ref: "+ref);
});
test("preserves all original sections and links to working studio",()=>{
  for(const id of ["music","studio","about","contact"])assert.ok(home.includes('id="'+id+'"'),"missing section "+id);
  assert.match(home,/href="studio\.html/);
  assert.match(studio,/Web Audio API/);
  assert.match(studio,/MediaRecorder/);
  assert.match(studio,/localStorage/);
  assert.match(studio,/getUserMedia/);
  assert.match(studio,/validatePattern/);
});
test("linked workstation anchors resolve",()=>{
  const ids=new Set([...studio.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]));
  for(const [,anchor] of home.matchAll(/href="studio\.html#([^"]+)"/g)){if(anchor.includes("${"))continue;assert.ok(ids.has(anchor),"broken studio anchor: "+anchor)}
});
