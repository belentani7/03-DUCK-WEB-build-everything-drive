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
    const scriptPattern = new RegExp("<script([^>]*)>([\\s\\S]*?)</script>", "g");
    const parts=[...html.matchAll(scriptPattern)];
    assert.ok(parts.length,name+" has inline JavaScript");
    for(const [,attrs,source] of parts){if(attrs.includes("application/ld+json"))JSON.parse(source);else new vm.Script(source,{filename:name+".js"});}
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

test("non-canonical DUCK design archive cannot impersonate artist discography",()=>{
  assert.match(home,/name="robots" content="noindex,nofollow,noarchive"/);
  assert.match(studio,/name="robots" content="noindex,nofollow,noarchive"/);
  assert.equal([...home.matchAll(/name="description"/g)].length,1);
  assert.doesNotMatch(home,/Judas|Mon Amour|Sleep Talking|Apaga a Luz/);
  assert.doesNotMatch(home,/spotify\.com\/artist\/belentani|mailto:belentani7pedro@gmail\.com/);
  assert.match(home,/const TRACKS = \[/);
  assert.match(home,/Arquitetura sonora/);
  assert.match(home,/Variante não indexável do projeto DUCK/);
});

test("archive catalog and accessible navigation are truthful",()=>{
  assert.doesNotMatch(home,/Novo single · 2026|Nuevo single · 2026|New single · 2026/);
  assert.match(home,/const CATALOG_TRANSLATIONS = \{/);
  assert.match(home,/Dirección creativa/);
  assert.match(home,/Creative direction/);
  assert.match(home,/render\(lang\)/);
  assert.match(home,/aria-expanded="false" aria-controls="navLinks"/);
  assert.match(home,/e\.key==='Escape'/);
});

test("switching language changes rendered process, tools and producer cards",()=>{
  const events={},docEvents={},elements={};
  function element(){
    const classes=new Set(),listeners={},attrs={};
    return {innerHTML:"",textContent:"",dataset:{},listeners,attrs,
      classList:{add:k=>classes.add(k),remove:k=>classes.delete(k),contains:k=>classes.has(k),
        toggle:k=>{if(classes.has(k)){classes.delete(k);return false}classes.add(k);return true}},
      addEventListener:(k,fn)=>listeners[k]=fn,setAttribute:(k,v)=>attrs[k]=v,
      getAttribute:k=>attrs[k],querySelectorAll:()=>[]};
  }
  for(const id of ["discGrid","toolsGrid","aboutGrid","contactLinks","hamburger","navLinks"])elements[id]=element();
  const buttons=["pt","es","en"].map(lang=>{const b=element();b.dataset.lang=lang;return b});
  const badge=element();badge.attrs["data-i18n"]="hero.badge";
  const document={documentElement:{lang:"pt"},getElementById:id=>elements[id],
    querySelectorAll:s=>s===".lang-switch button"?buttons:s==="[data-i18n]"?[badge]:[],
    addEventListener:(k,fn)=>docEvents[k]=fn};
  const sandbox={document,IntersectionObserver:class{observe(){}unobserve(){}}};
  vm.createContext(sandbox);
  vm.runInContext(home.match(/<script>([\s\S]*?)<\/script>/)?.[1]??"",sandbox);
  assert.match(elements.discGrid.innerHTML,/Direção criativa/);
  buttons[1].listeners.click();
  assert.equal(document.documentElement.lang,"es");
  assert.match(elements.discGrid.innerHTML,/Dirección creativa/);
  assert.match(elements.toolsGrid.innerHTML,/Caja de ritmos/);
  buttons[2].listeners.click();
  assert.match(elements.discGrid.innerHTML,/Creative direction/);
  assert.match(elements.aboutGrid.innerHTML,/Music production/);
  elements.hamburger.listeners.click();
  assert.equal(elements.hamburger.attrs["aria-expanded"],"true");
  docEvents.keydown({key:"Escape"});
  assert.equal(elements.hamburger.attrs["aria-expanded"],"false");
});
