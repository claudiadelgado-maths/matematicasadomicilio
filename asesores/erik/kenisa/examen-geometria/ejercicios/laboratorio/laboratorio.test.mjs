import test from 'node:test';
import assert from 'node:assert/strict';
import { FORMULAS,bancoMemoria,opcionesMemoria,bancoDespejes,bancoLados,bancoAlgebra,bancoCirculos,crearBolsa,sacar,reiniciarBolsa,formula } from './banco.mjs';
import { comprobar,calcular,analizar,formulaHTML } from './matematicas.mjs';
const cerca=(a,b,msg)=>assert.ok(Math.abs(a-b)<1e-7,msg||`${a} ≠ ${b}`);

test('Editor: equivalencia algebraica, fracciones, exponentes, ceros y rechazo seguro',()=>{
  for(const [a,b]of [['hb/2','b*h/2'],['b/(2/h)','b*h/2'],['180-360/n','180*(N-2)/N'],['N*N/2-3*N/2','N*(N-3)/2'],['r*r*pi','pi*r^2'],['πr²','pi*r^2'],['(B*h+b*h)/2','(B+b)*h/2'],['Lₙ+…+L₂+L₁','L1+L2+resto+Ln'],['2/4','1/2'],['(2+4)/3','2'],['3π+2π','5*pi'],['-2^2','-4'],['0','0']])assert.ok(comprobar(a,b).correcta,a);
  for(const [a,b]of [['(B-b)*h/2','(B+b)*h/2'],['(pi*r)^2','pi*r^2'],['3.14*5','5*pi'],['2*L','L^2'],['360/(N-2)','360/N'],['1/2+1/3','2/5']])assert.equal(comprobar(a,b).correcta,false,a);
  for(const t of ['', '1/0','x/(x-x)','()', '2+','alert(1)','<script>','1e309','r^r','2^99','2.3.4','((1)'])assert.equal(comprobar(t,'1').valida,false,t);
  assert.equal(comprobar('x','1',{numerico:true}).valida,false);
  assert.ok(comprobar('20π/2','10*pi',{numerico:true}).correcta);
  assert.ok(comprobar('0.1+0.2','0.3').correcta);
  assert.equal(comprobar('0.999999999999999999','1').correcta,false);
  assert.equal(comprobar('0.33333333333333333*3','1').correcta,false);
  cerca(calcular('(B+b)*h/2',{B:10,b:6,h:4}),32);
  assert.match(formulaHTML('b*h/2','A'),/<mfrac>/);
  assert.match(formulaHTML('pi*r^2','A'),/<msup>/);
  assert.ok(comprobar('La suma de todos sus lados',formula('borde').expr).correcta);
  assert.ok(comprobar('180 − ángulo exterior',formula('interior').expr).correcta);
  assert.ok(comprobar('180-angulo exterior',formula('interior').expr).correcta);
  assert.equal(comprobar('180 + ángulo exterior',formula('interior').expr).correcta,false);
  assert.equal(comprobar('La suma de todos sus lados','12',{numerico:true}).valida,false);
  assert.equal(comprobar('ángulo exterior','60',{numerico:true}).valida,false);
  assert.match(formulaHTML(formula('borde').expr,'P'),/<mtext>La suma de todos sus lados<\/mtext>/);
  assert.match(formulaHTML(formula('interior').expr,'I'),/<mtext>ángulo exterior<\/mtext>/);
  assert.deepEqual(formula('borde').letras,['La suma de todos sus lados']);
  assert.deepEqual(formula('interior').letras,['ángulo exterior']);
});

test('Memorización: 14 fórmulas, 27 consignas y una sola respuesta correcta',()=>{
  assert.equal(FORMULAS.length,14);assert.equal(bancoMemoria().length,27);
  for(const f of FORMULAS){assert.ok(comprobar(f.expr,f.expr).correcta);for(const error of f.errores)assert.equal(comprobar(error,f.expr).correcta,false,f.id);}
  for(const q of bancoMemoria())for(let i=0;i<20;i++){
    const ops=opcionesMemoria(q);assert.equal(ops.length,4);assert.equal(new Set(ops.map(o=>o.valor)).size,4);assert.equal(ops.filter(o=>o.correcta).length,1);
    if(q.tipo==='formula')assert.equal(ops.filter(o=>comprobar(o.valor,q.f.expr).correcta).length,1);
    if(q.tipo==='concepto'&&q.f.id==='central')assert.ok(ops.find(o=>o.correcta).valor.includes('central o exterior'));
  }
  assert.deepEqual(FORMULAS.filter(f=>f.lhs==='P').map(f=>f.id),['borde','circunferencia']);
});

test('534 despejes: sustituir la respuesta en la fórmula recupera todos los datos',()=>{
  const bank=bancoDespejes();assert.equal(bank.length,534);assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);
  assert.equal(new Set(bank.map(q=>q.formula)).size,14);
  for(const q of bank.filter(q=>q.formula==='interior')){
    assert.ok(['I','E'].includes(q.target));
    assert.equal(q.datos.length,1);
    assert.equal(q.datos[0].nombre,q.target==='I'?'E':'I');
  }
  for(const q of bank){
    const value=calcular(q.respuesta);assert.ok(Number.isFinite(value)&&value>=0,q.id);
    assert.ok(comprobar(q.respuesta,q.respuesta,{numerico:true}).correcta,q.id);
    const coefficient=Number(q.respuesta.replace('*pi',''));assert.ok(Number.isInteger(coefficient),q.id);
    if(q.formula==='borde'){
      const known=Object.fromEntries(q.datos.map(d=>[d.nombre,Number(d.valor)]));
      if(q.target==='P')cerca(Object.values(known).reduce((a,b)=>a+b),value,q.id);else cerca(known.L1+known.L2+value,known.P,q.id);
    }else{
      const data=Object.fromEntries(q.datos.map(d=>[d.nombre,calcular(d.valor)]));data[q.target]=value;
      const f=formula(q.formula);cerca(calcular(f.expr,data),data[f.lhs],q.id);
    }
  }
});

test('240 figuras: lados ax+b correctos, positivos y consistentes con su dibujo',()=>{
  const bank=bancoLados();assert.equal(bank.length,240);assert.equal(new Set(bank.map(q=>q.id)).size,240);assert.equal(new Set(bank.map(q=>q.tipo)).size,10);
  for(const q of bank){assert.ok(!q.tipo.includes('circulo'));q.lados.forEach((l,i)=>{assert.ok(Number.isInteger(l.valor)&&l.valor>0);cerca(l.a*q.x+l.b,l.valor,q.id);cerca(calcular(l.expr,{x:q.x}),l.valor,q.id);const p=q.puntos[i],t=q.puntos[(i+1)%q.puntos.length];cerca(Math.hypot(p[0]-t[0],p[1]-t[1]),l.valor,q.id);});}
});

test('324 problemas algebraicos y 160 círculos con π exacto',()=>{
  const algebra=bancoAlgebra();assert.equal(algebra.length,324);
  for(const q of algebra){assert.ok(comprobar(q.respuesta,q.respuesta,{numerico:true}).correcta,q.id);assert.ok(Number.isInteger(Number(q.respuesta))&&Number(q.respuesta)>0);if(q.ecuacion){const {a,b,c,d}=q.ecuacion;cerca(a*q.x+b,c*q.x+d,q.id);}else {const g=q.geometria;cerca(g.P*g.a/2,g.A);cerca(2*Number(q.respuesta)+1,g.a);}}
  const circles=bancoCirculos();assert.equal(circles.length,160);assert.equal(new Set(circles.map(q=>q.pregunta)).size,160);
  for(const q of circles){cerca(q.datos.P,2*q.r);cerca(q.datos.A,q.r*q.r);const expected=q.filtro.endsWith('radio')?q.r:q.filtro==='per-area'?Math.PI*q.r*q.r:2*Math.PI*q.r;cerca(calcular(q.respuesta),expected,q.id);assert.equal(q.respuesta.includes('pi'),!q.filtro.endsWith('radio'));}
});

test('Las bolsas no repiten al cambiar de filtro y permiten reintentos sin consumir preguntas',()=>{
  for(const bank of [bancoMemoria(),bancoDespejes(),bancoLados(),bancoAlgebra(),bancoCirculos()]){
    const s=crearBolsa(bank),seen=new Set();assert.equal(reiniciarBolsa(s),false);
    for(const filtro of new Set(bank.map(q=>q.filtro))){let q;while((q=sacar(s,filtro))){assert.ok(!seen.has(q.id));seen.add(q.id);assert.equal(q.filtro,filtro);assert.equal(s.actual.id,q.id);}}
    assert.equal(seen.size,bank.length);assert.equal(sacar(s),null);assert.equal(reiniciarBolsa(s),true);assert.equal(s.vistas.size,0);assert.ok(sacar(s));assert.equal(s.ronda,2);
  }
});
