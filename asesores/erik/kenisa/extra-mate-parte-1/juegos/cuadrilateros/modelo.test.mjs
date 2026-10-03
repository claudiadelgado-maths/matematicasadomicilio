import test from 'node:test';
import assert from 'node:assert/strict';
import {TIPOS,TRAPECIOS,cerca,propiedades,clasificar,tipoTrapecio,crearFigura,transformar,crearSerie,crearEstado,responder,avanzar} from './modelo.mjs';
function random(seed=310){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
test('8000 figuras convexas conservan su clasificación y propiedades al girar y cambiar tamaño',()=>{
  const r=random();
  for(let n=0;n<1000;n++)for(const tipo of TIPOS)for(const sub of tipo==='trapecio'?TRAPECIOS:['isósceles']){
    const f=crearFigura(tipo,sub,r),p=propiedades(f.puntos),view=transformar(f);
    assert.equal(clasificar(f.puntos),tipo);assert.equal(clasificar(view.puntos),tipo);
    assert.ok(cerca(p.angulos.reduce((a,b)=>a+b,0),360));assert.ok(p.angulos.every(a=>a>0&&a<180));
    const crosses=f.puntos.map((a,i)=>{const b=f.puntos[(i+1)%4],c=f.puntos[(i+2)%4];return (b.x-a.x)*(c.y-b.y)-(b.y-a.y)*(c.x-b.x);});assert.ok(crosses.every(v=>v>0));
    assert.ok(view.puntos.every(v=>v.x>=100-1e-7&&v.x<=420+1e-7&&v.y>=85&&v.y<=325));
    if(tipo==='trapecio'){
      assert.equal(tipoTrapecio(f.puntos),sub);assert.equal(tipoTrapecio(view.puntos),sub);
      assert.ok(cerca(p.angulos[0]+p.angulos[3],180));assert.ok(cerca(p.angulos[1]+p.angulos[2],180));
      assert.equal(cerca(...p.diagonales),sub==='isósceles');
      if(sub==='isósceles'){assert.ok(cerca(p.lados[1],p.lados[3]));assert.ok(cerca(p.angulos[0],p.angulos[1]));}
      assert.equal(p.rectos.length,sub==='rectángulo'?2:0);
      const a=view.puntos[0],b=view.puntos[1],d=view.puntos[3],h=view.altura;
      assert.ok(Math.abs((d.x-h.x)*(b.x-a.x)+(d.y-h.y)*(b.y-a.y))<1e-6);
    }
  }
});
test('convención exclusiva de trapecios e inclusión de cuadrados en rectángulos y rombos',()=>{
  const f=crearFigura('cuadrado',undefined,random()),p=propiedades(f.puntos);
  assert.equal(p.paralelos.length,2);assert.equal(p.rectos.length,4);assert.equal(p.iguales,true);assert.equal(tipoTrapecio(f.puntos),null);
  assert.equal(propiedades(crearFigura('trapezoide',undefined,random()).puntos).paralelos.length,0);
});
test('16000 retos variados, opciones únicas, seis nombres cubiertos y resultados limpios coherentes',()=>{
  const r=random(51),subtypes=new Set(),partTypes=new Set();
  for(let n=0;n<500;n++)for(const etapa of [1,2]){
    const serie=crearSerie(etapa,r);assert.equal(serie.length,16);
    if(etapa===1)assert.equal(new Set(serie.filter(q=>q.formato==='opciones'||q.formato==='pistas').map(q=>q.respuesta)).size,6);
    for(const [i,q] of serie.entries()){
      const p=propiedades(q.figura.puntos);
      assert.equal(q.etapa,etapa);assert.equal(clasificar(q.figura.puntos),q.figura.tipo);
      if(q.opciones){assert.equal(new Set(q.opciones.map(o=>o.id)).size,q.opciones.length);assert.ok(q.opciones.some(o=>o.id===q.respuesta));}
      if(q.formato==='opciones'||q.formato==='pistas')assert.equal(q.respuesta,etapa===1?clasificar(q.figura.puntos):tipoTrapecio(q.figura.puntos));
      if(q.formato==='parte'){partTypes.add(q.enfoque);assert.equal(q.respuesta,q.enfoque);}
      if(q.figura.subtipo)subtypes.add(q.figura.subtipo);
      if(q.formato==='numero'){
        assert.ok(Number.isInteger(q.respuesta)&&q.respuesta>0);assert.ok(i>=12);
        if(q.unidad==='cm'){assert.ok(cerca(p.diagonales[0],q.respuesta));assert.ok(cerca(p.diagonales[1],q.respuesta));}
        else{const target=q.medidas.indexOf('?');assert.ok(cerca(p.angulos[target],q.respuesta));q.medidas.forEach((v,j)=>{if(v!==''&&v!=='?')assert.ok(cerca(Number(v),p.angulos[j]));});}
      }
    }
    const binary=serie.filter(q=>q.formato==='sino');assert.equal(binary.length,4);assert.equal(binary.filter(q=>q.respuesta).length,2);
  }
  assert.equal(subtypes.size,3);assert.equal(partTypes.size,4);
});
test('reintentar, cambiar de recorrido, responder dos veces y empezar otra serie no inflan el avance',()=>{
  const other=crearEstado(2,random());
  for(const etapa of [1,2]){
    const s=crearEstado(etapa,random());assert.equal(avanzar(s),false);
    for(let i=0;i<16;i++){
      const q=s.serie[i];assert.equal(responder(s,''),'vacio');assert.equal(s.intentos,0);
      if(i%4===0){assert.equal(responder(s,q.formato==='numero'?'999':q.opciones.find(o=>o.id!==q.respuesta).id),'incorrecto');assert.equal(avanzar(s),false);}
      assert.equal(responder(s,q.formato==='numero'?`${q.respuesta},0`:q.respuesta),'correcto');
      assert.equal(responder(s,q.formato==='numero'?String(q.respuesta):q.respuesta),'bloqueado');assert.equal(s.resueltos,i+1);
      assert.equal(avanzar(s),i<15);
    }
    assert.equal(s.primerIntento,12);assert.equal(crearEstado(etapa,random()).resueltos,0);
  }
  assert.equal(other.resueltos,0);assert.equal(other.indice,0);
});
