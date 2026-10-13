import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {FUNCIONES,TRIPLES,NIVELES,ejemplo,lados,geometria,validarFraccion,validarLados,validarIntegrador} from './modelo.mjs';

test('las seis razones conservan el orden y sus recíprocos',()=>{
  assert.deepEqual(FUNCIONES.map(f=>[f.slug,f.arriba,f.abajo]),[
    ['seno','CO','H'],['coseno','CA','H'],['tangente','CO','CA'],
    ['cotangente','CA','CO'],['secante','H','CA'],['cosecante','H','CO'],
  ]);
  assert.deepEqual(lados(4,3,5,1),{CO:3,CA:4,H:5});
  assert.deepEqual(lados(4,3,5,2),{CO:4,CA:3,H:5});
});
test('los triángulos numéricos son rectángulos y las razones nunca tienen divisor cero',()=>{
  TRIPLES.forEach(([a,b,h])=>assert.equal(a*a+b*b,h*h));
  for(let i=0;i<6;i++)for(let variation=0;variation<18;variation++){
    const e=ejemplo(i,variation),f=FUNCIONES[i];
    assert.equal(e.a*e.a+e.b*e.b,e.h*e.h);
    assert.ok(e.valores[f.abajo]>0);
    assert.ok(validarFraccion(e.valores[f.arriba]*7,e.valores[f.abajo]*7,e.valores[f.arriba],e.valores[f.abajo]).ok);
  }
  const expected=[[3,5],[12,13],[8,15],[12,5],[25,24],[17,8]];
  FUNCIONES.forEach((f,i)=>{const e=ejemplo(i);assert.deepEqual([e.valores[f.arriba],e.valores[f.abajo]],expected[i]);});
});
test('la comparación exacta acepta equivalentes y rechaza datos no válidos',()=>{
  for(const [n,d] of [['3','5'],['6','10'],['-3','-5'],['+9','15']]) assert.equal(validarFraccion(n,d,3,5).ok,true);
  for(const [n,d] of [['','5'],['3',''],['3','0'],['3','-0'],['0.6','1'],['1/2','5'],['NaN','5'],['Infinity','5'],['-3','5'],['5','3'],['3e1','50']]) assert.equal(validarFraccion(n,d,3,5).ok,false);
});
test('los tres lados se exigen completos y se distinguen de la hipotenusa',()=>{
  assert.equal(validarLados(['cateto','cateto','hipotenusa']),true);
  for(const values of [[],['cateto','cateto'],['hipotenusa','cateto','cateto'],['cateto',null,'hipotenusa'],['cateto','cateto','hipotenusa','cateto']])assert.equal(validarLados(values),false);
});
test('rotar no cambia el ángulo recto, las proporciones ni deja etiquetas fuera del lienzo',()=>{
  for(const angle of NIVELES)for(const [a,b] of TRIPLES){
    const {vertices:[c,p,q],etiquetas}=geometria(a,b,angle);
    const u=[p[0]-c[0],p[1]-c[1]],v=[q[0]-c[0],q[1]-c[1]];
    assert.ok(Math.abs(u[0]*v[0]+u[1]*v[1])<1e-8);
    assert.ok(Math.abs(Math.hypot(...u)/Math.hypot(...v)-a/b)<1e-10);
    etiquetas.forEach(([x,y])=>{assert.ok(x>35&&x<465);assert.ok(y>20&&y<340);});
  }
});
test('solo doce aciertos permiten entregar; cualquier casilla errónea invalida el resultado',()=>{
  const valid=['CO','H','CA','H','CO','CA','CA','CO','H','CA','H','CO'];
  assert.deepEqual(validarIntegrador(valid),{ok:true,correctas:Array(12).fill(true),total:12});
  for(let i=0;i<12;i++){
    const wrong=[...valid];wrong[i]='incorrecto';
    assert.equal(validarIntegrador(wrong).ok,false);assert.equal(validarIntegrador(wrong).total,11);
  }
  assert.equal(validarIntegrador(valid.slice(0,11)).ok,false);
  assert.equal(validarIntegrador([...valid,'CO']).ok,false);
  assert.equal(validarIntegrador(Array(12).fill(null)).ok,false);
});
test('la entrega conserva seis filas en columna y exactamente doce casillas de fracción',()=>{
  const page=fs.readFileSync(new URL('../ejercicios/integrador/index.html',import.meta.url),'utf8');
  assert.equal((page.match(/class="function-row"/g)||[]).length,6);
  assert.equal((page.match(/class="final-fraction"/g)||[]).length,6);
  assert.equal((page.match(/data-slot="\d+"/g)||[]).length,12);
  assert.deepEqual([...page.matchAll(/data-slot="(\d+)"/g)].map(m=>Number(m[1])),Array.from({length:12},(_,i)=>i));
  assert.match(page,/data-deliver hidden>Entregar/);
});
