/* ===== Morfi: espacios propios =====
   'familia' = los datos originales (data.js, claves morfi_*), intactos.
   Los demás espacios guardan sus personas y comidas en este dispositivo (localStorage),
   sin cuentas ni servidor. Las comidas se cargan pegando un JSON (ver wsPrompt).
   Cada cambio de personas/comidas se guarda y recarga la app para reconstruir todo limpio. */

var WS_KEYS='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
var WS_COLORS=['#0d9488','#16a34a','#d97706','#0284c7','#9333ea','#db2777','#dc2626','#4f46e5','#65a30d','#0891b2'];
var WS_MAX_MEALS=500;

/* ---------- almacenamiento ---------- */
function wsGet(k,d){try{var v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch(e){return d;}}
function wsPut(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
function wsDel(k){try{localStorage.removeItem(k);}catch(e){}}
function wsHasLegacy(){try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('morfi_')===0)return true;}}catch(e){}return false;}
function wsNorm(s){return String(s==null?'':s).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().replace(/\s+/g,' ').trim();}
function wsClean(s,max){return String(s==null?'':s).replace(/&/g,' y ').replace(/[<>"`\\\u0000-\u001f]/g,' ').replace(/\s+/g,' ').trim().slice(0,max||80);}
function wsEsc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}

/* ---------- arranque: qué espacio se usa ---------- */
function wsBoot(){
  var w={family:true,welcome:false,id:'familia',pfx:'morfi_',data:null};
  var want=null;
  try{var m=/[?&]espacio=([^&#]*)/.exec(location.search);if(m)want=decodeURIComponent(m[1]);}catch(e){}
  var active=wsGet('morfiws_active',null);
  if(want==='familia'){active='familia';wsPut('morfiws_hasfam',1);}
  else if(!active&&wsHasLegacy()){active='familia';wsPut('morfiws_hasfam',1);}
  if(active&&active!=='familia'&&!wsGet('morfiws_d_'+active,null))active=null;
  if(!active){
    if(wsGet('morfiws_hasfam',0)||wsHasLegacy())active='familia';
    else{var l=wsGet('morfiws_list',[]);if(l.length)active=l[0].id;}
  }
  if(!active){w.family=false;w.welcome=true;w.id=null;return w;}
  wsPut('morfiws_active',active);
  if(active==='familia')return w;
  var d=wsGet('morfiws_d_'+active,null);
  w.family=false;w.id=active;w.pfx='morfiws_s_'+active+'_';w.data=d;
  PROFILES.length=0;
  d.profiles.forEach(function(p){PROFILES.push({k:p.k,n:p.n,c:p.c});});
  return w;
}
function wsMeals(){
  if(WS.welcome)return [];
  if(WS.family)return buildData().MEALS;
  return WS.data.meals.map(function(m){
    return{id:m.id,name:m.name,type:m.type,k:false,tip:m.tip||'',ok:m.ok,
      ings:m.ings.map(function(i){return{n:i.n,q:i.q,u:i.u,c:i.c,f:''};})};
  });
}
function wsTab(){var t='hoy';try{t=sessionStorage.getItem('mw_tab')||'hoy';sessionStorage.removeItem('mw_tab');}catch(e){}return t;}
function wsReload(keepTab){
  try{if(keepTab&&typeof S!=='undefined')sessionStorage.setItem('mw_tab',S.tab);}catch(e){}
  location.reload();
}

/* ---------- personas y espacios ---------- */
function wsAddProfile(d,name){
  name=wsClean(name,20);if(!name)return null;
  var nn=wsNorm(name);
  for(var i=0;i<d.profiles.length;i++){if(wsNorm(d.profiles[i].n)===nn)return d.profiles[i];}
  var used={},cu={};d.profiles.forEach(function(p){used[p.k]=1;cu[p.c]=1;});
  var k=null;for(var j=0;j<WS_KEYS.length;j++){if(!used[WS_KEYS[j]]){k=WS_KEYS[j];break;}}
  if(!k)return null;
  var c=null;for(var x=0;x<WS_COLORS.length;x++){if(!cu[WS_COLORS[x]]){c=WS_COLORS[x];break;}}
  if(!c)c=WS_COLORS[d.profiles.length%WS_COLORS.length];
  var p={k:k,n:name,c:c};d.profiles.push(p);return p;
}
function wsNewId(name){
  var s=wsNorm(name).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,20)||'espacio';
  return s+'-'+Math.random().toString(36).slice(2,6);
}
function wsCreate(name,people){
  var id=wsNewId(name);
  var d={v:1,id:id,name:name,profiles:[],meals:[],nextId:1};
  people.forEach(function(n){wsAddProfile(d,n);});
  wsPut('morfiws_d_'+id,d);
  var list=wsGet('morfiws_list',[]);list.push({id:id,name:name});wsPut('morfiws_list',list);
  wsPut('morfiws_active',id);
  return id;
}
function wsSpaces(){
  var a=[];
  if(WS.family||wsGet('morfiws_hasfam',0))a.push({id:'familia',name:'Morfi Familiar'});
  wsGet('morfiws_list',[]).forEach(function(s){a.push(s);});
  return a;
}
function wsSave(d){wsPut('morfiws_d_'+WS.id,d);}
function wsClone(){return JSON.parse(JSON.stringify(wsGet('morfiws_d_'+WS.id,null)||WS.data));}

/* ---------- lectura del JSON de comidas ---------- */
function wsMomento(v){
  var s=wsNorm(v),o='';
  if(/^[acm]+$/.test(s)){['A','C','M'].forEach(function(x){if(s.indexOf(x.toLowerCase())>=0)o+=x;});}
  else{
    if(s.indexOf('almuerzo')>=0)o+='A';
    if(s.indexOf('cena')>=0)o+='C';
    if(s.indexOf('merienda')>=0||s.indexOf('desayuno')>=0||s.indexOf('snack')>=0)o+='M';
  }
  return (o==='A'||o==='C'||o==='AC'||o==='M')?o:null;
}
function wsQty(v){
  if(typeof v==='number')return v;
  var s=String(v==null?'':v).trim().replace(',','.');
  var f=/^(\d+)\s*\/\s*(\d+)$/.exec(s);if(f&&+f[2]>0)return +f[1]/+f[2];
  var m=s.match(/[0-9]*\.?[0-9]+/);return m?parseFloat(m[0]):NaN;
}
function wsUnit(u,q){
  var s=wsNorm(u).replace(/\./g,'');
  var M={g:['g',1],gr:['g',1],grs:['g',1],gramo:['g',1],gramos:['g',1],kg:['g',1000],kilo:['g',1000],kilos:['g',1000],
    ml:['ml',1],cc:['ml',1],l:['ml',1000],lt:['ml',1000],litro:['ml',1000],litros:['ml',1000],
    u:['u',1],un:['u',1],unid:['u',1],unidad:['u',1],unidades:['u',1],
    cda:['ml',15],cucharada:['ml',15],cucharadas:['ml',15],cdita:['ml',5],cucharadita:['ml',5],cucharaditas:['ml',5],taza:['ml',240],tazas:['ml',240]};
  var r=M[s];return r?{u:r[0],q:Math.round(q*r[1]*100)/100}:null;
}
function wsCat(c){
  var s=wsNorm(c);
  if(/^[cvla]$/.test(s))return s.toUpperCase();
  if(/carne|pesc|pollo|fiambre|prote/.test(s))return 'C';
  if(/verdu|fruta|hortal|veg/.test(s))return 'V';
  if(/lact|huevo|queso|leche/.test(s))return 'L';
  return 'A';
}
function wsParse(text){
  var t=String(text||'').trim();
  if(!t)throw new Error('Pegá primero el texto con las comidas.');
  t=t.replace(/```[a-z]*/gi,'');
  var a=t.indexOf('{'),b=t.lastIndexOf('}'),a2=t.indexOf('['),b2=t.lastIndexOf(']'),raw;
  try{
    if(a>=0&&(a2<0||a<a2))raw=JSON.parse(t.slice(a,b+1));
    else if(a2>=0)raw=JSON.parse(t.slice(a2,b2+1));
    else throw 0;
  }catch(e){throw new Error('No pude leer el texto como JSON. Revisá que esté completo: tiene que empezar con { y terminar con }.');}
  var com=Array.isArray(raw)?raw:(raw.comidas||raw.meals||null);
  if(!Array.isArray(com)||!com.length)throw new Error('No encontré la lista "comidas" en el texto.');
  return{personas:Array.isArray(raw)?[]:(raw.personas||raw.people||[]),comidas:com};
}
function wsPara(d,v,person){
  if(v==null||v==='')return d.profiles.map(function(p){return p.k;});
  var arr=Array.isArray(v)?v:String(v).split(/[,;]+/),keys=[],everyone=false;
  arr.forEach(function(n){
    var c=wsClean(n,20);if(!c)return;
    if(/^(todos|todas|all)$/.test(wsNorm(c))){everyone=true;return;}
    var p=person(c);if(!p)throw new Error('demasiadas personas (máximo '+WS_KEYS.length+')');
    if(keys.indexOf(p.k)<0)keys.push(p.k);
  });
  if(everyone||!keys.length)return d.profiles.map(function(p){return p.k;});
  return keys;
}
function wsExplicit(v){
  if(v==null||v==='')return false;
  var arr=Array.isArray(v)?v:String(v).split(/[,;]+/);
  return arr.some(function(n){var c=wsNorm(wsClean(n,20));return c&&!/^(todos|todas|all)$/.test(c);});
}
/* Aplica el import sobre d (una copia). Devuelve el informe; no toca el almacenamiento. */
function wsApplyImport(d,parsed,mode){
  var rep={added:0,merged:0,dups:0,omit:[],people:[],low:[]};
  function person(n){var had=d.profiles.length,p=wsAddProfile(d,n);if(p&&d.profiles.length>had)rep.people.push(p.n);return p;}
  (parsed.personas||[]).forEach(function(n){
    if(n&&typeof n==='object')n=n.nombre||n.name;
    if(!wsClean(n,20))return;
    if(!person(n))throw new Error('Se alcanzó el máximo de personas.');
  });
  if(mode==='replace')d.meals=[];
  var pk=null;
  if(mode&&String(mode).indexOf('person:')===0){
    pk=String(mode).slice(7);
    if(!d.profiles.some(function(p){return p.k===pk;}))throw new Error('Esa persona ya no existe.');
    d.meals.forEach(function(m){Object.keys(m.ok).forEach(function(s){m.ok[s]=m.ok[s].split(pk).join('');});});
    d.meals=d.meals.filter(function(m){return Object.keys(m.ok).some(function(s){return m.ok[s].length>0;});});
  }
  var names={},ingN={};
  d.meals.forEach(function(m){names[wsNorm(m.name)]=m;m.ings.forEach(function(i){ingN[wsNorm(i.n)]=i.n;});});
  parsed.comidas.forEach(function(r,idx){
    var label='#'+(idx+1);
    try{
      if(!r||typeof r!=='object')throw new Error('no es una comida válida');
      var name=wsClean(r.nombre||r.name||r.comida,80);
      if(!name)throw new Error('sin nombre');
      label=name;
      var type=wsMomento(r.momento||r.tipo||r.type);
      if(!type)throw new Error('momento inválido (usá A, C, AC o M)');
      var key=wsNorm(name);
      var pv=r.para!==undefined?r.para:r.for,explicit=wsExplicit(pv);
      if(names[key]){
        var ex=names[key],mk=pk&&!explicit?[pk]:(explicit?wsPara(d,pv,person):null),added=false;
        if(mk)Object.keys(ex.ok).forEach(function(s){mk.forEach(function(k){if(ex.ok[s].indexOf(k)<0){ex.ok[s]+=k;added=true;}});});
        if(added)rep.merged++;else rep.dups++;
        return;
      }
      var ri=r.ingredientes||r.ingredients;
      if(!Array.isArray(ri)||!ri.length)throw new Error('sin ingredientes');
      if(ri.length>40)throw new Error('demasiados ingredientes');
      var ings=ri.map(function(x){
        if(!x||typeof x!=='object')throw new Error('ingrediente inválido');
        var n=wsClean(x.nombre||x.name||x.n,40);if(!n)throw new Error('ingrediente sin nombre');
        var q=wsQty(x.cantidad!==undefined?x.cantidad:(x.q!==undefined?x.q:x.qty));
        if(!(q>0))throw new Error('cantidad inválida en '+n);
        var u=wsUnit(x.unidad||x.u||x.unit,q);
        if(!u)throw new Error('unidad no reconocida en '+n+' (usá g, ml o u)');
        var nk=wsNorm(n);if(ingN[nk])n=ingN[nk];else ingN[nk]=n;
        return{n:n,q:u.q,u:u.u,c:wsCat(x.categoria||x.cat||x.c)};
      });
      if(d.meals.length>=WS_MAX_MEALS)throw new Error('se alcanzó el máximo de '+WS_MAX_MEALS+' comidas');
      var keys=pk&&!explicit?[pk]:wsPara(d,pv,person);
      var ok={};type.split('').forEach(function(s){ok[s]=keys.join('');});
      var nm2={id:d.nextId++,name:name,type:type,ok:ok,ings:ings,tip:wsClean(r.tip||r.consejo,300)};
      d.meals.push(nm2);names[key]=nm2;rep.added++;
    }catch(e){rep.omit.push(label+': '+e.message);}
  });
  d.profiles.forEach(function(p){
    [['A','almuerzos',7],['C','cenas',7],['M','meriendas',3]].forEach(function(s){
      var n=d.meals.filter(function(m){return m.ok[s[0]]!==undefined&&m.ok[s[0]].indexOf(p.k)>=0;}).length;
      if(n<s[2])rep.low.push(p.n+': '+n+' '+s[1]);
    });
  });
  return rep;
}

/* ---------- backup (mismo formato que el import) ---------- */
function wsExportObj(only){
  var d=wsGet('morfiws_d_'+WS.id,null)||WS.data,nm={};d.profiles.forEach(function(p){nm[p.k]=p.n;});
  var meals=d.meals;
  if(only)meals=meals.filter(function(m){return Object.keys(m.ok).some(function(s){return m.ok[s].indexOf(only)>=0;});});
  return{espacio:d.name,personas:only?[nm[only]]:d.profiles.map(function(p){return p.n;}),comidas:meals.map(function(m){
    var first=Object.keys(m.ok)[0],ks=(m.ok[first]||'').split('');
    return{nombre:m.name,momento:m.type,para:only?[nm[only]]:ks.map(function(k){return nm[k];}).filter(Boolean),
      ingredientes:m.ings.map(function(i){return{nombre:i.n,cantidad:i.q,unidad:i.u,categoria:i.c};}),tip:m.tip||''};
  })};
}
function wsSlug(x){return wsNorm(x).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'x';}
function wsExportName(only){
  var d=WS.data,pn='';
  if(only)d.profiles.forEach(function(p){if(p.k===only)pn='-'+wsSlug(p.n);});
  return 'morfi-'+wsSlug(d.name)+pn+'.json';
}
function wsExportDL(only){
  var obj=wsExportObj(only);
  if(only&&!obj.comidas.length){wsToast('Esa persona todavía no tiene comidas');return;}
  var t=JSON.stringify(obj,null,1);
  try{
    var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'application/json'}));
    a.download=wsExportName(only);document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},1000);wsToast(only?'Archivo descargado':'Backup descargado');
  }catch(e){wsExportCopy(only);}
}
function wsExportCopy(only){wsCopy(JSON.stringify(wsExportObj(only),null,1),only?'JSON copiado':'Backup copiado');}

/* ---------- prompt para la IA ---------- */
function wsPrompt(){
  var names=WS.data.profiles.map(function(p){return p.n;});
  var ex=JSON.stringify({personas:names,comidas:[{nombre:'Omelette de espinaca y queso',momento:'AC',para:names.slice(0,2),
    ingredientes:[{nombre:'Huevo',cantidad:3,unidad:'u',categoria:'L'},{nombre:'Espinaca',cantidad:80,unidad:'g',categoria:'V'},{nombre:'Queso fresco',cantidad:40,unidad:'g',categoria:'L'}],tip:''}]},null,1);
  return 'Necesito un banco de comidas para mi app de planificación semanal y lista de compras.\n\n'+
  'PERSONAS: '+names.join(', ')+'\n\n'+
  'PAUTAS DE CADA PERSONA (dieta, restricciones, gustos, plan de la nutricionista):\n[PEGÁ ACÁ LO DE CADA UNA]\n\n'+
  'Reglas:\n'+
  '- Armá entre 40 y 70 comidas. Para cada persona tienen que alcanzar al menos 10 almuerzos o cenas y 4 meriendas distintos; si hay varias personas, incluí también comidas que sirvan a varias juntas.\n'+
  '- Respetá estrictamente las pautas: si una persona no puede comer algo, no la pongas en "para" de esa comida. No inventes restricciones que no te di.\n'+
  '- Ingredientes comunes y cantidades POR PERSONA (una porción).\n'+
  '- "momento": A = almuerzo, C = cena, AC = almuerzo o cena, M = merienda.\n'+
  '- "para": lista con los nombres exactos de las personas a las que les sirve esa comida.\n'+
  '- "unidad": solo g, ml o u (unidades). "categoria": C = carnes, pescados y fiambres; V = verduras y frutas; L = lácteos y huevos; A = almacén, cereales, legumbres, semillas.\n'+
  '- Revisá que el JSON sea válido antes de entregarlo.\n\n'+
  'ENTREGA: dame el resultado como un ARCHIVO DESCARGABLE llamado comidas.json (no lo pegues en el chat). Dentro del archivo tiene que ir solamente el JSON, con este formato:\n'+ex+'\n\n'+
  'Si no podés generar archivos, respondé únicamente con el JSON dentro de un solo bloque de código, sin texto antes ni después.';
}
function wsCopyPrompt(){wsCopy(wsPrompt(),'Prompt copiado');}
function wsCopy(t,msg){
  function fb(){
    var ta=document.createElement('textarea');ta.value=t;ta.style.cssText='position:fixed;opacity:0;top:0';
    document.body.appendChild(ta);ta.select();var ok=false;try{ok=document.execCommand('copy');}catch(e){}ta.remove();
    wsToast(ok?msg:'No pude copiar');
  }
  try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(function(){wsToast(msg);},fb);return;}}catch(e){}
  fb();
}
function wsToast(t){
  var el=document.getElementById('wstoast');
  if(!el){el=document.createElement('div');el.id='wstoast';document.body.appendChild(el);}
  el.textContent=t;el.className='show';clearTimeout(wsToast._t);
  wsToast._t=setTimeout(function(){el.className='';},2200);
}
function wsModal(h){document.getElementById('mbox').innerHTML=h;document.getElementById('modal').classList.add('show');}
function wsErr(id,t){var e=document.getElementById(id);if(e){e.className='warn';e.textContent=t;}}

/* ---------- pantalla de bienvenida ---------- */
function wsWelcome(){
  document.querySelector('header').style.display='none';
  document.getElementById('nav').style.display='none';
  document.getElementById('main').innerHTML=
  '<div class="card"><h1 style="font-size:22px;margin-bottom:6px">🥑 Morfi</h1>'+
  '<p class="mut" style="font-size:14px">Planificá la semana, armá la lista de compras y decidí qué comer hoy, con las comidas de tu casa.</p>'+
  '<div class="cat">Nombre de tu espacio</div><input type="text" id="wn" maxlength="30" placeholder="Ej: Casa de Ana">'+
  '<div class="cat">¿Quiénes comen? (separá con comas)</div><input type="text" id="wp" maxlength="120" placeholder="Ana, Luis, Sofi">'+
  '<div id="wserr"></div><button class="btn pri" onclick="wsWelcomeGo()">Crear mi espacio</button>'+
  '<details style="margin-top:10px"><summary>¿Cómo funciona?</summary><p>1. Creás tu espacio con las personas que comen.<br>2. Copiás un prompt y se lo pegás a una IA (Claude, ChatGPT…) con la dieta de cada uno: te devuelve un archivo con las comidas.<br>3. Elegís ese archivo en la app y listo: semana, compras, ruleta y “tengo en casa” funcionan solos.<br>Todo queda guardado en este dispositivo, sin cuentas.</p></details></div>';
}
function wsParsePeople(t){
  var out=[],seen={};
  String(t||'').split(/[,;\n]+/).forEach(function(n){n=wsClean(n,20);var k=wsNorm(n);if(n&&!seen[k]){seen[k]=1;out.push(n);}});
  return out;
}
function wsWelcomeGo(){
  var name=wsClean(document.getElementById('wn').value,30),ppl=wsParsePeople(document.getElementById('wp').value);
  if(!name)return wsErr('wserr','Poné un nombre para tu espacio.');
  if(!ppl.length)return wsErr('wserr','Poné al menos una persona.');
  wsCreate(name,ppl);
  try{sessionStorage.setItem('mw_open','import');}catch(e){}
  wsReload(false);
}
function wsNewUI(){
  wsModal('<div class="bar"><b>➕ Espacio nuevo</b><button onclick="closeModal()">✕</button></div>'+
  '<div class="cat">Nombre del espacio</div><input type="text" id="wn" maxlength="30" placeholder="Ej: Casa de Ana">'+
  '<div class="cat">¿Quiénes comen? (separá con comas)</div><input type="text" id="wp" maxlength="120" placeholder="Ana, Luis, Sofi">'+
  '<div id="wserr"></div><button class="btn pri" onclick="wsWelcomeGo()">Crear</button><button class="btn" onclick="openSettings()">Volver</button>');
}

/* ---------- ajustes ---------- */
function wsHeader(){
  var t=document.getElementById('ttl');
  if(t)t.textContent=WS.family?'🥑 Morfi Familiar':'🥑 '+WS.data.name;
}
function openSettings(){
  var h='<div class="bar"><b>⚙️ '+wsEsc(WS.family?'Morfi Familiar':WS.data.name)+'</b><button onclick="closeModal()">✕</button></div>';
  if(!WS.family){
    var d=WS.data;
    h+='<div class="cat">👥 Personas</div>';
    d.profiles.forEach(function(p){
      h+='<div class="it"><span class="pb" style="background:'+p.c+'">'+wsEsc(p.n[0])+'</span><span>'+wsEsc(p.n)+'</span><button class="ic" style="margin-left:auto" aria-label="Descargar las comidas de '+wsEsc(p.n)+'" onclick="wsExportDL(\''+p.k+'\')">📤 JSON</button><button class="ic" style="margin-left:6px" onclick="wsRemovePerson(\''+p.k+'\')">Quitar</button></div>';
    });
    h+='<div class="mut" style="margin-top:6px">📤 JSON descarga las comidas de esa persona: podés pasárselas a la IA para ajustarlas y volver a importarlas con “Reemplazar solo las comidas de…”.</div>';
    h+='<div style="margin-top:8px"><button class="btn" onclick="wsAddPersonUI()">➕ Agregar persona</button></div>';
    h+='<div class="cat">🍽️ Comidas ('+d.meals.length+')</div>'+
    '<button class="btn pri" onclick="wsImportUI()">📥 Importar comidas</button><button class="btn" onclick="wsExportDL()">📤 Backup</button><button class="btn" onclick="wsExportCopy()">📋 Copiar backup</button>';
    h+='<div class="cat">✏️ Nombre del espacio</div><input type="text" id="wsname" maxlength="30" value="'+wsEsc(d.name)+'"><button class="btn" onclick="wsRename()">Guardar nombre</button>';
  }
  h+='<div class="cat">🏠 Mis espacios</div>';
  var others=wsGet('morfiws_list',[]).length>0;
  wsSpaces().forEach(function(s){
    var cur=s.id===WS.id;
    h+='<button class="btn'+(cur?' pri':'')+'"'+(cur?' disabled':'')+' onclick="wsSwitch(\''+s.id+'\')">'+(cur?'✓ ':'')+wsEsc(s.name)+'</button>';
    if(s.id==='familia'&&!cur&&others)h+='<button class="ic" style="margin:0 8px 8px 0" aria-label="Eliminar Morfi Familiar" onclick="wsDeleteFamily()">🗑</button>';
  });
  h+='<div><button class="btn" onclick="wsNewUI()">➕ Crear un espacio nuevo</button></div>';
  if(!WS.family)h+='<div style="margin-top:14px"><button class="btn" style="color:#dc2626" onclick="wsDeleteSpace()">🗑 Eliminar este espacio</button></div>';
  else if(others)h+='<div style="margin-top:14px"><button class="btn" style="color:#dc2626" onclick="wsDeleteFamily()">🗑 Eliminar este espacio</button><div class="mut">Borra de este dispositivo tus semanas armadas, exclusiones y compras tildadas. Se puede volver a abrir cuando quieras.</div></div>';
  wsModal(h);
}
function wsSwitch(id){wsPut('morfiws_active',id);wsReload(false);}
function wsRename(){
  var n=wsClean(document.getElementById('wsname').value,30);if(!n)return;
  var d=wsClone();d.name=n;wsSave(d);
  wsPut('morfiws_list',wsGet('morfiws_list',[]).map(function(s){return s.id===WS.id?{id:s.id,name:n}:s;}));
  wsReload(true);
}
function wsDeleteSpace(){
  if(!confirm('¿Eliminar el espacio "'+WS.data.name+'" con todas sus comidas y personas? No se puede deshacer.'))return;
  var id=WS.id,rm=[];
  try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&(k==='morfiws_d_'+id||k.indexOf('morfiws_s_'+id+'_')===0))rm.push(k);}}catch(e){}
  rm.forEach(wsDel);
  wsPut('morfiws_list',wsGet('morfiws_list',[]).filter(function(s){return s.id!==id;}));
  wsDel('morfiws_active');
  wsReload(false);
}

function wsDeleteFamily(){
  var list=wsGet('morfiws_list',[]);
  if(!list.length){wsToast('Primero creá otro espacio');return;}
  if(!confirm('¿Eliminar "Morfi Familiar" de este dispositivo? Se borran tus semanas armadas, exclusiones y compras tildadas. Si la querés de nuevo, abrí la app con ?espacio=familia al final del link.'))return;
  var rm=[];
  try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('morfi_')===0)rm.push(k);}}catch(e){}
  rm.forEach(wsDel);
  wsDel('morfiws_hasfam');
  var cur=wsGet('morfiws_active',null);
  if(cur==='familia'||!cur)wsPut('morfiws_active',list[0].id);
  wsReload(false);
}

/* ---------- personas ---------- */
function wsAddPersonUI(){
  var opts='<option value="">Ninguna (las marco yo después)</option>'+WS.data.profiles.map(function(p,i){return '<option value="'+p.k+'"'+(i===0?' selected':'')+'>Las mismas que '+wsEsc(p.n)+'</option>';}).join('');
  wsModal('<div class="bar"><b>➕ Agregar persona</b><button onclick="closeModal()">✕</button></div>'+
  '<div class="cat">Nombre</div><input type="text" id="wspn" maxlength="20">'+
  '<div class="cat">Empieza comiendo…</div><select id="wspc" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-size:15px;margin-bottom:10px">'+opts+'</select>'+
  '<div class="mut" style="margin-bottom:8px">Después podés ajustar comida por comida con el botón 👥 en la pestaña Comidas.</div>'+
  '<div id="wserr"></div><button class="btn pri" onclick="wsDoAddPerson()">Agregar</button><button class="btn" onclick="openSettings()">Volver</button>');
}
function wsDoAddPerson(){
  var n=wsClean(document.getElementById('wspn').value,20);
  if(!n)return wsErr('wserr','Poné un nombre.');
  var d=wsClone(),had=d.profiles.length,p=wsAddProfile(d,n);
  if(!p)return wsErr('wserr','Se alcanzó el máximo de personas.');
  if(d.profiles.length===had)return wsErr('wserr','Ya hay alguien con ese nombre.');
  var from=document.getElementById('wspc').value;
  if(from)d.meals.forEach(function(m){Object.keys(m.ok).forEach(function(s){if(m.ok[s].indexOf(from)>=0)m.ok[s]+=p.k;});});
  wsSave(d);wsReload(true);
}
function wsRemovePerson(k){
  var d=wsClone();
  if(d.profiles.length<=1){wsToast('Tiene que quedar al menos una persona');return;}
  var p=d.profiles.filter(function(x){return x.k===k;})[0];if(!p)return;
  if(!confirm('¿Quitar a '+p.n+'? Las comidas se mantienen para los demás.'))return;
  d.profiles=d.profiles.filter(function(x){return x.k!==k;});
  d.meals.forEach(function(m){Object.keys(m.ok).forEach(function(s){m.ok[s]=m.ok[s].split(k).join('');});});
  S.sel=S.sel.filter(function(x){return x!==k;});
  if(!S.sel.length)S.sel=[d.profiles[0].k];
  delete S.excl[k];save();
  wsSave(d);wsReload(true);
}

/* ---------- comidas: quién la come / borrar ---------- */
function wsEditMeal(id){
  var m=WS.data.meals.filter(function(x){return x.id===id;})[0];if(!m)return;
  var cur='';Object.keys(m.ok).forEach(function(s){cur+=m.ok[s];});
  var h='<div class="bar"><b>👥 '+wsEsc(m.name)+'</b><button onclick="closeModal()">✕</button></div><div class="mut" style="margin-bottom:8px">¿Quién puede comerla?</div>';
  WS.data.profiles.forEach(function(p){h+='<label class="it"><input type="checkbox" class="wsp" value="'+p.k+'"'+(cur.indexOf(p.k)>=0?' checked':'')+'><span>'+wsEsc(p.n)+'</span></label>';});
  h+='<div style="margin-top:12px"><button class="btn pri" onclick="wsSaveMeal('+id+')">Guardar</button><button class="btn" onclick="closeModal()">Cancelar</button><button class="btn" style="color:#dc2626" onclick="wsDelMeal('+id+')">🗑 Eliminar comida</button></div>';
  wsModal(h);
}
function wsSaveMeal(id){
  var ks='',bs=document.querySelectorAll('.wsp');
  for(var i=0;i<bs.length;i++){if(bs[i].checked)ks+=bs[i].value;}
  var d=wsClone();
  d.meals.forEach(function(m){if(m.id===id)Object.keys(m.ok).forEach(function(s){m.ok[s]=ks;});});
  wsSave(d);wsReload(true);
}
function wsDelMeal(id){
  if(!confirm('¿Eliminar esta comida?'))return;
  var d=wsClone();d.meals=d.meals.filter(function(m){return m.id!==id;});
  wsSave(d);wsReload(true);
}

/* ---------- importar ---------- */
function wsImportUI(){
  var has=WS.data.meals.length>0;
  var h='<div class="bar"><b>📥 Importar comidas</b><button onclick="closeModal()">✕</button></div>'+
  '<div class="mut" style="margin-bottom:8px"><b>1)</b> Copiá el prompt y pegáselo a Claude, ChatGPT o la IA que uses, junto con la dieta de cada persona. Te va a devolver un archivo <b>comidas.json</b>.<br><b>2)</b> Descargá ese archivo y elegilo acá.</div>'+
  '<button class="btn" onclick="wsCopyPrompt()">📋 Copiar prompt para IA</button>'+
  '<label class="btn pri" style="display:inline-block;cursor:pointer">📁 Elegir archivo<input type="file" id="wsfile" hidden onchange="wsReadFile(this)"></label>'+
  '<details style="margin-top:4px"><summary>¿La IA no te dio un archivo? Pegá el texto</summary><textarea id="wsjson" rows="8" placeholder="Pegá acá el JSON…"></textarea></details>';
  if(has)h+='<label class="it"><input type="radio" name="wsmode" value="add" checked><span>Agregar a las que ya tengo (se saltean las repetidas)</span></label>'+
    '<label class="it"><input type="radio" name="wsmode" value="person"><span>Reemplazar solo las comidas de <select id="wsperson" onfocus="document.querySelector(\'input[value=person]\').checked=true" style="padding:6px;border-radius:8px;border:1px solid var(--bd);background:var(--card);color:var(--tx);font-size:14px">'+
      WS.data.profiles.map(function(p){return '<option value="'+p.k+'">'+wsEsc(p.n)+'</option>';}).join('')+'</select></span></label>'+
    '<label class="it"><input type="radio" name="wsmode" value="replace"><span>Reemplazar todas (borra las actuales)</span></label>';
  h+='<div id="wsres" style="margin-top:8px"></div><button class="btn pri" onclick="wsDoImport()">Importar</button><button class="btn" onclick="closeModal()">'+(has?'Cancelar':'Importar después')+'</button>';
  wsModal(h);
}
function wsReadFile(inp){
  var f=inp.files&&inp.files[0];if(!f)return;
  var r=new FileReader();
  r.onerror=function(){wsErr('wsres','No pude leer el archivo. Probá de nuevo.');};
  r.onload=function(){
    var t=String(r.result||'');document.getElementById('wsjson').value=t;
    try{
      var n=wsParse(t).comidas.length,e=document.getElementById('wsres');
      if(e){e.className='ok';e.textContent='📄 '+f.name+': '+n+' comida'+(n===1?'':'s')+' lista'+(n===1?'':'s')+' para importar. Tocá Importar.';}
    }catch(x){wsErr('wsres',f.name+': '+x.message);}
  };
  r.readAsText(f);
}
function wsDoImport(){
  var mode='add',r=document.querySelector('input[name=wsmode]:checked');if(r)mode=r.value;
  if(mode==='person'){var sp=document.getElementById('wsperson');mode='person:'+(sp?sp.value:'');}
  try{
    var parsed=wsParse(document.getElementById('wsjson').value);
    var d=wsClone(),rep=wsApplyImport(d,parsed,mode);
    if(!rep.added&&!rep.merged){
      var why=rep.dups?'Todas las comidas ya existían.':'No se pudo importar ninguna comida.';
      if(rep.omit.length)why+=' '+rep.omit.slice(0,3).join(' · ');
      return wsErr('wsres',why);
    }
    wsSave(d);
    if(mode==='replace')['plans','excl','checked','pantry'].forEach(function(k){wsDel(WS.pfx+k);});
    try{sessionStorage.setItem('mw_report',JSON.stringify(rep));}catch(e){}
    wsReload(false);
  }catch(e){wsErr('wsres',e.message);}
}
function wsReportUI(rep){
  var h='<div class="bar"><b>📥 Importación lista</b><button onclick="closeModal()">✕</button></div>';
  h+='<p class="ok">✅ '+rep.added+' comida'+(rep.added===1?'':'s')+' agregada'+(rep.added===1?'':'s')+'</p>';
  if(rep.merged)h+='<p class="mut">'+rep.merged+' ya existían: se mantuvieron sus ingredientes y se sumaron las personas indicadas.</p>';
  if(rep.dups)h+='<p class="mut">'+rep.dups+' ya existían y se saltearon.</p>';
  if(rep.people&&rep.people.length)h+='<p class="mut">Personas nuevas: '+rep.people.map(wsEsc).join(', ')+'. Revisá que no sea un error de tipeo.</p>';
  if(rep.low&&rep.low.length)h+='<div class="warn">Pocas opciones (conviene tener 7 o más almuerzos y cenas): '+rep.low.slice(0,8).map(wsEsc).join(' · ')+'</div>';
  if(rep.omit&&rep.omit.length)h+='<div class="warn">⚠️ '+rep.omit.length+' omitida'+(rep.omit.length===1?'':'s')+':<br>'+rep.omit.slice(0,8).map(wsEsc).join('<br>')+(rep.omit.length>8?'<br>…':'')+'</div>';
  h+='<button class="btn pri" onclick="closeModal()">Listo</button>';
  wsModal(h);
}
function wsAfterBoot(){
  if(WS.family||WS.welcome)return;
  try{
    var rp=sessionStorage.getItem('mw_report');
    if(rp){sessionStorage.removeItem('mw_report');wsReportUI(JSON.parse(rp));return;}
    if(sessionStorage.getItem('mw_open')==='import'){sessionStorage.removeItem('mw_open');wsImportUI();}
  }catch(e){}
}
function wsAfterRender(){
  if(WS.family||WS.welcome||MEALS.length)return;
  document.getElementById('main').insertAdjacentHTML('afterbegin','<div class="card"><b>Todavía no cargaste comidas</b><div class="mut" style="margin:6px 0 10px">Armá tu banco de comidas con una IA y cargalo acá: tarda un minuto.</div><button class="btn pri" onclick="wsImportUI()">📥 Importar comidas</button></div>');
}

var WS=wsBoot();
