import test from 'node:test';
import assert from 'node:assert/strict';
import { RELACIONES, relacion, medida, medidas, geometria, crearSerie, crearProgreso, terminarReto, avanzar, leerNumero, guardarMedida, guardarVariable, confirmarMedida, confirmarVariable, retoNumericoResuelto, reiniciarRespuestas } from './modelo.mjs';

function seeded(seed=91) { return ()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;}; }
test('las 28 parejas tienen una clasificación única y una regla correcta',()=>{
  const pairs=RELACIONES.flatMap(r=>r.pares.map(p=>p.join(',')));
  assert.equal(pairs.length,28); assert.equal(new Set(pairs).size,28);
  for (let a=1;a<=8;a++) for(let b=a+1;b<=8;b++) {
    const r=relacion(a,b); assert.equal(relacion(b,a),r);
    for(const inclination of [40,61,90,107,140]) {
      if(r.regla==='igual') assert.equal(medida(a,inclination),medida(b,inclination));
      else assert.equal(medida(a,inclination)+medida(b,inclination),180);
    }
  }
  assert.throws(()=>relacion(3,3)); assert.throws(()=>relacion(0,3));
});
test('el dibujo coincide con la medida y mantiene controles separados a 360 px',()=>{
  for(let inclination=40;inclination<=140;inclination++) {
    const g=geometria(inclination);
    assert.equal(g.angles.length,8);
    assert.equal(g.vertices[0].y,158); assert.equal(g.vertices[1].y,342);
    // El vector entre los cruces es el de la transversal mostrada.
    const deg=Math.atan2(g.vertices[1].y-g.vertices[0].y,g.vertices[0].x-g.vertices[1].x)*180/Math.PI;
    assert.ok(Math.abs(deg-inclination)<1e-8);
    for (const angle of g.angles) {
      assert.ok(angle.label.x>35 && angle.label.x<465);
      assert.ok(angle.label.y>60 && angle.label.y<440);
    }
    for (let i=0;i<8;i++) for(let j=i+1;j<8;j++) {
      const a=g.angles[i].label,b=g.angles[j].label;
      // El área disponible mínima es de 310 px; controles de 52 por 44 px.
      assert.ok(Math.abs(a.x-b.x)*.62>=52 || Math.abs(a.y-b.y)*.62>=44,`Se superponen ${i+1}/${j+1} a ${inclination}°`);
    }
  }
});
test('8000 problemas válidos, variedad, cobertura y dos ecuaciones independientes',()=>{
  const random=seeded();
  for(let repetition=0;repetition<100;repetition++) for(let mode=1;mode<=4;mode++) {
    const serie=crearSerie(mode,random); assert.equal(serie.length,20);
    assert.equal(new Set(serie.map(q=>q.relacion)).size,7);
    assert.ok(new Set(serie.map(q=>q.inclinacion)).size>=10);
    for(const q of serie) {
      assert.equal(q.ronda,Math.floor(q.index/5));
      assert.ok(q.inclinacion>=40 && q.inclinacion<=140);
      assert.equal(q.valores.length,8);
      assert.deepEqual([...q.numeros].sort((a,b)=>a-b),[1,2,3,4,5,6,7,8]);
      assert.equal(new Set(q.opciones).size,4); assert.ok(q.opciones.includes(q.relacion));
      for(let n=1;n<=8;n++) assert.equal(q.valores[n-1],medida(n,q.inclinacion));
      for(const [n,value] of Object.entries(q.dados)) assert.equal(value,q.valores[n-1]);
      assert.equal(q.variables.length,mode>=3 ? mode-2 : 0);
      if (mode>=3) assert.notEqual(q.inclinacion,90); // En 90° ambas ecuaciones serían válidas.
      for(const v of q.variables) {
        assert.ok(Number.isInteger(v.solucion) && v.solucion>0);
        assert.equal(v.a*v.solucion+v.b,v.targetValue);
        assert.equal(v.targetValue,q.valores[v.target-1]);
        assert.equal(v.refValue,q.dados[v.reference]);
        assert.equal(v.regla,relacion(v.target,v.reference).regla);
        if(v.regla==='igual') assert.equal(v.targetValue,v.refValue);
        else assert.equal(v.targetValue+v.refValue,180);
        assert.ok(!v.texto.includes(v.variable==='x' ? 'y' : 'x'));
        assert.equal(q.dados[v.target],undefined);
      }
      if(mode===4) {
        assert.equal(new Set(q.variables.flatMap(v=>[v.target,v.reference])).size,4);
        assert.equal(q.variables[0].variable,'x');assert.equal(q.variables[1].variable,'y');
      }
    }
    if(mode===2) {assert.equal(serie[12].inclinacion,90);assert.equal(new Set(serie[12].valores).size,1);}
  }
});
test('progreso: veinte retos, sin puntos dobles ni avance incompleto',()=>{
  const s=crearProgreso(4,seeded());
  assert.equal(avanzar(s),false);
  for(let i=0;i<20;i++) {
    assert.equal(s.index,i);s.huboError=i%3===0;
    assert.equal(terminarReto(s),true);assert.equal(terminarReto(s),false);
    assert.equal(avanzar(s),i<19);
  }
  assert.equal(s.aciertos,13); assert.equal(s.index,19);
});
test('los campos numéricos y las expresiones permanecen separados en todo el intervalo móvil',()=>{
  for(let inclination=40;inclination<=140;inclination++) {
    const g=geometria(inclination,true);
    assert.equal(g.vertices[0].y,140);assert.equal(g.vertices[1].y,360);
    const deg=Math.atan2(220,g.vertices[0].x-g.vertices[1].x)*180/Math.PI;
    assert.ok(Math.abs(deg-inclination)<1e-8);
    for(let i=0;i<8;i++)for(let j=i+1;j<8;j++){
      const a=g.angles[i].label,b=g.angles[j].label;
      assert.ok(Math.abs(a.x-b.x)*.62>=52 || Math.abs(a.y-b.y)*.62>=64,`Se superponen campos ${i+1}/${j+1} a ${inclination}°`);
    }
  }
});
test('vacíos y borradores no penalizan; confirmar, corregir y reintentar conservan un puntaje honesto',()=>{
  const s=crearProgreso(3,seeded()),q=s.serie[0],v=q.variables[0],slot=v.target;
  assert.equal(confirmarMedida(s,slot).tipo,'vacio');assert.equal(confirmarVariable(s,'x').tipo,'vacio');
  guardarMedida(s,slot,'1');guardarMedida(s,slot,'12');assert.equal(s.errores,0);
  assert.equal(confirmarMedida(s,slot).tipo,'incorrecto');assert.equal(s.errores,1);
  assert.equal(confirmarMedida(s,slot).tipo,'repetido');assert.equal(s.errores,1);
  guardarMedida(s,slot,String(v.targetValue));assert.equal(s.erroresAngulos[slot],undefined);
  assert.equal(confirmarMedida(s,slot).tipo,'correcto');assert.equal(confirmarMedida(s,slot).tipo,'bloqueado');
  assert.equal(retoNumericoResuelto(s),false);reiniciarRespuestas(s);
  assert.deepEqual(s.borradores,{});assert.deepEqual(s.respuestas,{});assert.equal(s.huboError,true);
  assert.equal(leerNumero(' 60,0 '),60);assert.equal(leerNumero('60.0'),60);assert.equal(leerNumero(''),null);
  assert.ok(Number.isNaN(leerNumero('3x')));assert.ok(Number.isNaN(leerNumero('Infinity')));
});
test('al acertar x, 3x conserva su expresión y se completa con la medida del ángulo',()=>{
  const s=crearProgreso(3,seeded());
  Object.assign(s.serie[0],{inclinacion:60,valores:medidas(60),dados:{4:120},variables:[{variable:'x',target:6,reference:4,a:3,b:0,solucion:40,targetValue:120,refValue:120,texto:'3x',regla:'igual'}]});
  guardarMedida(s,6,'40');assert.equal(confirmarMedida(s,6).tipo,'incorrecto');
  guardarVariable(s,'x','40');assert.equal(confirmarVariable(s,'x').tipo,'correcto');
  assert.equal(confirmarMedida(s,6).tipo,'bloqueado');
  assert.equal(s.serie[0].variables[0].texto,'3x');assert.equal(s.respuestas[6],120);assert.equal(s.valoresVariables.x,'40');
  assert.equal(retoNumericoResuelto(s),true);assert.equal(s.huboError,true);assert.equal(s.erroresAngulos[6],undefined);
});

test('autocompletar exige todas las variables correctas y conserva apuntes aceptados y errores previos',()=>{
  const random=seeded(902);
  for(const mode of [3,4])for(let repetition=0;repetition<20;repetition++){
    const s=crearProgreso(mode,random),q=s.serie[0],slots=[1,2,3,4,5,6,7,8].filter(n=>q.dados[n]===undefined);
    const variables=repetition%2 ? [...q.variables].reverse() : q.variables;
    // Alterna dibujos vacíos con medidas aceptadas, errores y borradores sin confirmar.
    if(repetition%2){
      guardarMedida(s,slots[0],String(q.valores[slots[0]-1]));confirmarMedida(s,slots[0]);
      guardarMedida(s,slots[1],'999');confirmarMedida(s,slots[1]);
      guardarMedida(s,slots[2],'1');
    }
    const before=structuredClone({respuestas:s.respuestas,borradores:s.borradores,erroresAngulos:s.erroresAngulos});
    variables.forEach((v,i)=>{
      guardarVariable(s,v.variable,String(v.solucion));
      assert.deepEqual(s.respuestas,before.respuestas); // Escribir sin comprobar no completa nada.
      if(i===variables.length-1){
        guardarVariable(s,v.variable,'999');assert.equal(confirmarVariable(s,v.variable).tipo,'incorrecto');
        assert.deepEqual(s.respuestas,before.respuestas);
        guardarVariable(s,v.variable,String(v.solucion));
      }
      const result=confirmarVariable(s,v.variable);assert.equal(result.tipo,'correcto');
      if(i<variables.length-1){
        assert.equal(result.autocompletadas,0);assert.equal(retoNumericoResuelto(s),false);
        assert.deepEqual({respuestas:s.respuestas,borradores:s.borradores,erroresAngulos:s.erroresAngulos},before);
      }else assert.equal(result.autocompletadas,slots.length-Object.keys(before.respuestas).length);
    });
    assert.equal(retoNumericoResuelto(s),true);assert.deepEqual(s.erroresAngulos,{});
    for(const slot of slots){assert.equal(s.respuestas[slot],q.valores[slot-1]);assert.equal(s.borradores[slot],String(q.valores[slot-1]));}
    assert.equal(terminarReto(s),true);assert.equal(terminarReto(s),false);assert.equal(s.aciertos,0);
    assert.equal(avanzar(s),true);assert.deepEqual(s.respuestas,{});assert.deepEqual(s.resueltas,{});
  }
});

test('x correcto basta con el dibujo vacío; completar medidas conserva su resolución manual',()=>{
  for(const mode of [2,3,4]){
    const s=crearProgreso(mode,seeded());
    for(const v of s.serie[0].variables){guardarVariable(s,v.variable,String(v.solucion));confirmarVariable(s,v.variable);}
    assert.equal(retoNumericoResuelto(s),mode>=3);
    if(mode===2){assert.deepEqual(s.respuestas,{});assert.equal(confirmarVariable(s,'x').tipo,'bloqueado');}
    else{assert.equal(terminarReto(s),true);assert.equal(s.aciertos,1);assert.equal(terminarReto(s),false);assert.equal(s.aciertos,1);}
  }
});
test('600 retos numéricos: medidas antes de las variables, y antes de x, bloqueo y reinicio',()=>{
  const random=seeded(370);
  for(let repeat=0;repeat<10;repeat++)for(const mode of [2,3,4]){
    const s=crearProgreso(mode,random);
    for(let index=0;index<20;index++){
      const q=s.serie[index];assert.equal(retoNumericoResuelto(s),false);
      for(let slot=1;slot<=8;slot++)if(q.dados[slot]===undefined){
        guardarMedida(s,slot,`${q.valores[slot-1]},0`);assert.equal(confirmarMedida(s,slot).tipo,'correcto');
        assert.equal(confirmarMedida(s,slot).tipo,'bloqueado');
      }
      assert.equal(retoNumericoResuelto(s),mode===2);
      for(const v of [...q.variables].reverse()){
        guardarVariable(s,v.variable,String(v.solucion));assert.equal(confirmarVariable(s,v.variable).tipo,'correcto');
        assert.equal(confirmarVariable(s,v.variable).tipo,'bloqueado');
      }
      assert.equal(retoNumericoResuelto(s),true);assert.equal(terminarReto(s),true);assert.equal(terminarReto(s),false);
      assert.equal(avanzar(s),index<19);
      if(index<19){assert.deepEqual(s.borradores,{});assert.deepEqual(s.resueltas,{});assert.deepEqual(s.erroresAngulos,{});}
    }
    assert.equal(s.aciertos,20);assert.equal(s.errores,0);
  }
});
