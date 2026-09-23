(() => {
  const KEY='repaso-fisica-errores-v1';
  const source=location.pathname.split('/').filter(Boolean).at(-1);
  const memory=new Map();
  const read=(key,fallback)=>{if(memory.has(key))return memory.get(key);try{const v=JSON.parse(localStorage.getItem(key));return v??fallback;}catch{return memory.get(key)??fallback;}};
  const write=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));memory.delete(key);return true;}catch{memory.set(key,value);return false;}};
  function all(){const a=read(KEY,[]);return Array.isArray(a)?a.filter(x=>x&&typeof x.id==='string'&&typeof x.prompt==='string'&&['choice','numeric','scientific','coulomb'].includes(x.type)):[];}
  function registrar(item,correct=false,imported=false){
    if(correct||!item?.prompt)return;
    const origin=item.source||source,id=origin+'|'+item.prompt;
    const records=all(),old=records.find(x=>x.id===id);
    if(imported&&old)return;
    const entry={...item,source:origin,id,solved:false,attempts:(old?.attempts||0)+1};
    if(old)records.splice(records.indexOf(old),1,entry);else records.push(entry);
    write(KEY,records);refresh();
  }
  function resolver(id){const records=all();const item=records.find(x=>x.id===id);if(item)item.solved=true;write(KEY,records);refresh();}
  function refresh(){const pending=all().filter(x=>!x.solved);document.querySelectorAll('[data-review-link]').forEach(a=>{a.hidden=!pending.length;a.textContent=`Practicar errores pendientes (${pending.length}) →`;});}
  window.repasoFisica={registrar,resolver,pendientes:()=>all().filter(x=>!x.solved),read,write};
  refresh();window.addEventListener('storage',refresh);
})();
