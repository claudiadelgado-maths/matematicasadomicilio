import {FAMILIES,translation,directionText,HORIZONTAL_EXAMPLES,VERTICAL_EXAMPLES,MIXED_EXAMPLES,rationalValue,rationalSteps,fraction} from './modelo.mjs';
import {rationalMath,translationMath,horizontalText,verticalText} from './formulas.mjs';
import {drawGraph} from './graficas.mjs';
import {initPractice} from './practica.mjs';

const $=id=>document.getElementById(id);
const item=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;return e;};
const root=document.querySelector('[data-activity]');
if(root){
  const type=root.dataset.activity;
  let redrawLab;
  document.querySelector('.lab').hidden=false;
  if(type==='traslados'){
    let target=null;
    function render(){
      const family=$('family').value,h=Number($('shift-h').value),k=Number($('shift-k').value),q=translation(family,h,k);
      $('h-output').value=h;$('k-output').value=k;
      $('lab-formula').innerHTML=translationMath(q);
      $('movement-summary').textContent=directionText(h,k);
      const facts=[['Dominio',q.domain],['Recorrido',q.range],['Asíntota',q.horizontal!==null?`Horizontal: y = ${k}`:q.vertical!==null?`Vertical: x = ${h}`:'Esta parábola no tiene asíntotas'],['Punto de referencia',`(${q.point.join(', ')})`]];
      $('translation-facts').replaceChildren(...facts.map(([label,value])=>{const div=document.createElement('div');div.append(item('dt',label),item('dd',value));return div;}));
      drawGraph($('lab-graph'),{title:`${q.text}. ${directionText(h,k)} Dominio: ${q.domain}.`,curves:[{f:FAMILIES[family].f,color:'#aaa0b2',dashed:true,breaks:FAMILIES[family].kind==='log'?[0]:[]},{f:q.f,breaks:q.vertical===null?[]:[q.vertical]}],horizontals:q.horizontal===null?[]:[q.horizontal],verticals:q.vertical===null?[]:[q.vertical],points:[{x:q.point[0],y:q.point[1]}]});
      if(target){
        $('target-panel').hidden=false;$('target-formula').innerHTML=translationMath(target);
        $('target-status').textContent=h===target.h&&k===target.k?'¡Coinciden! Has encontrado los dos desplazamientos. Puedes pedir otro reto.':'Ajusta h y k. Recuerda: dentro, el signo se interpreta al revés.';
      }else $('target-panel').hidden=true;
    }
    $('family').addEventListener('change',()=>{target=null;render();});
    for(const id of ['shift-h','shift-k'])$(id).addEventListener('input',render);
    $('reset-transform').addEventListener('click',()=>{$('shift-h').value=0;$('shift-k').value=0;target=null;render();});
    $('target-button').addEventListener('click',()=>{
      let h,k;do{h=Math.floor(Math.random()*9)-4;k=Math.floor(Math.random()*9)-4;}while(h===Number($('shift-h').value)&&k===Number($('shift-k').value));
      target=translation($('family').value,h,k);render();
    });redrawLab=render;
  }else{
    const examples=type==='horizontales'?HORIZONTAL_EXAMPLES:type==='verticales'?VERTICAL_EXAMPLES:MIXED_EXAMPLES;
    let revealed=false;
    for(const q of examples){const o=item('option',q.label);o.value=q.id;$('lab-case').append(o);}
    const current=()=>examples.find(q=>q.id===$('lab-case').value);
    function table(caption,rows){
      const t=document.createElement('table');t.append(item('caption',caption));
      const thead=document.createElement('thead'),head=document.createElement('tr');
      for(const s of ['x','f(x)']){const th=item('th',s);th.scope='col';head.append(th);}thead.append(head);t.append(thead);
      const body=document.createElement('tbody');
      for(const [x,y] of rows){const tr=document.createElement('tr');tr.append(item('td',fraction(x)),item('td',Number.isFinite(y)?Number(y.toFixed(4)).toLocaleString('es-MX',{maximumFractionDigits:4}):'No definida'));body.append(tr);}
      t.append(body);$('values-table').replaceChildren(t);$('values-table').hidden=false;
    }
    function roots(){
      if(type!=='verticales')return;
      $('probe-root').replaceChildren(...current().roots.map((r,i)=>{const o=item('option',`x = ${fraction(r.x)}`);o.value=i;return o;}));
    }
    function render(){
      const q=current(),extent=type==='horizontales'?Number($('graph-extent').value):8;
      $('lab-formula').innerHTML=rationalMath(q);
      const visible=type!=='ambas'||revealed;
      drawGraph($('lab-graph'),{xMin:-extent,xMax:extent,title:`Función racional. ${visible?`${horizontalText(q)}. ${verticalText(q)}.`:'Revela el análisis para comprobar sus asíntotas.'}`,curves:[{f:x=>rationalValue(q,x),breaks:q.roots.map(r=>r.x)}],horizontals:visible&&type!=='verticales'&&q.horizontal!==null?[q.horizontal]:[],verticals:visible&&type!=='horizontales'?q.verticals:[],holes:visible?q.holes:[]});
      if(type==='horizontales'){
        $('lab-conclusion').textContent=rationalSteps(q)[0];
        table('¿A qué valor se acercan las alturas?',[-100,-10,10,100].map(x=>[x,rationalValue(q,x)]));
      }else if(type==='verticales'){
        $('lab-conclusion').textContent=`${verticalText(q)}.${q.holes.length?` Huecos: ${q.holes.map(p=>`(${fraction(p.x)}, ${fraction(p.y)})`).join(' y ')}.`:''}`;
        $('lab-steps').replaceChildren(...rationalSteps(q).slice(1).map(s=>item('li',s)));
        $('probe-controls').hidden=!q.roots.length;$('values-table').hidden=!q.roots.length;
        if(q.roots.length){
          const distance=[1,.5,.1,.01][Number($('probe-distance').value)],a=q.roots[Number($('probe-root').value)||0].x;
          $('distance-output').value=String(distance);
          table(`A ambos lados de x = ${fraction(a)} · distancia ${distance}`,[a-distance,a+distance].map(x=>[x,rationalValue(q,x)]));
        }
      }else{
        $('lab-conclusion').hidden=!revealed;$('lab-steps').hidden=!revealed;
        $('lab-conclusion').textContent=`${horizontalText(q)}. ${verticalText(q)}.${q.holes.length?` Hay un hueco en (${fraction(q.holes[0].x)}, ${fraction(q.holes[0].y)}).`:''}`;
        $('lab-steps').replaceChildren(...rationalSteps(q).map(s=>item('li',s)));
        $('reveal-analysis').textContent=revealed?'Ocultar el análisis':'Revelar el análisis →';
      }
    }
    $('lab-case').addEventListener('change',()=>{revealed=false;roots();render();});
    $('graph-extent')?.addEventListener('change',render);
    $('probe-root')?.addEventListener('change',render);
    $('probe-distance')?.addEventListener('input',render);
    $('reveal-analysis')?.addEventListener('click',()=>{revealed=!revealed;render();});
    roots();redrawLab=render;
  }
  redrawLab();
  const redrawPractice=initPractice(type);
  window.addEventListener('resize',()=>{redrawLab();redrawPractice();});
}
