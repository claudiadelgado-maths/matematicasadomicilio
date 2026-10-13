import test from 'node:test';
import assert from 'node:assert/strict';
import { crearBanco, CATALOGO, TEMAS, evaluarObjetivo, aleatorioSemilla } from './banco.mjs';
import { crearPractica, siguiente, responder, cambiarTema, progreso, nuevaRonda } from './modelo.mjs';

const banco = crearBanco();
const cerca = (a,b) => assert.ok(Math.abs(a-b)<1e-7, `${a} no coincide con ${b}`);
const suma = lista => lista.reduce((a,b)=>a+b,0);
function triangulo(lados) { assert.ok(lados.every(v=>v>0)); assert.ok(2*Math.max(...lados)<suma(lados)); }

test('768 preguntas distintas: ecuación con solución única, objetivo correcto y cuatro opciones únicas', () => {
  assert.equal(CATALOGO.length,64);
  assert.equal(banco.length,768);
  assert.equal(new Set(banco.map(q=>q.id)).size,768);
  assert.equal(new Set(banco.map(q=>q.enunciado)).size,768);
  for(const f of CATALOGO) assert.equal(banco.filter(q=>q.familia===f.id).length,12);
  for(const q of banco) {
    const {a,b,c,d}=q.ecuacion;
    assert.notEqual(a,c,q.id);
    const solucion=(d-b)/(a-c);
    cerca(a*solucion+b,c*solucion+d);
    cerca(q.x,solucion);
    assert.ok(Number.isInteger(solucion)&&solucion>0,q.id);
    assert.ok(Number.isInteger(q.respuesta)&&q.respuesta>0,q.id);
    cerca(q.respuesta,evaluarObjetivo(q.objetivo,solucion));
    assert.equal(q.opciones.length,4,q.id);
    assert.equal(new Set(q.opciones.map(o=>o.texto)).size,4,q.id);
    assert.equal(new Set(q.opciones.map(o=>o.valor)).size,4,q.id);
    assert.equal(q.opciones.filter(o=>Math.abs(o.valor-q.respuesta)<1e-7).length,1,q.id);
    cerca(q.opciones.find(o=>o.id===q.correcta).valor,q.respuesta);
    assert.ok(q.pasos.length>=3&&q.pasos.every(p=>typeof p==='string'&&p.length>5),q.id);
    assert.ok(TEMAS[q.tema]);
    assert.doesNotMatch(q.enunciado+q.pasos.join(' '),/undefined|NaN|Infinity|<svg|<img|https?:/);
  }
});

test('Geometría real: ángulos, desigualdad triangular, perímetros, áreas, semejanza y Pitágoras', () => {
  for(const q of banco) {
    const g=q.geometria;
    switch(g.tipo) {
      case 'suma-angulos': assert.ok(g.angulos.every(v=>v>0&&v<360),q.id); cerca(suma(g.angulos),g.total); break;
      case 'iguales-angulos': cerca(g.angulos[0],g.angulos[1]); assert.ok(g.angulos.every(v=>v>0&&v<180)); break;
      case 'triangulo-angulos': assert.ok(g.angulos.every(v=>v>0&&v<180)); cerca(suma(g.angulos),180); break;
      case 'rectangulo': assert.ok(g.base>0&&g.altura>0); if(g.perimetro)cerca(2*(g.base+g.altura),g.perimetro); if(g.area)cerca(g.base*g.altura,g.area); break;
      case 'romboide': assert.equal(g.lados[0],g.lados[2]); assert.equal(g.lados[1],g.lados[3]); cerca(suma(g.lados),g.perimetro); break;
      case 'cerca': assert.ok(g.largo>g.corto&&g.corto>0); cerca(2*g.corto+g.largo,g.total); break;
      case 'cerca-cuadrado': assert.ok(g.entrada>0&&g.entrada<g.lado); cerca(2*(4*g.lado-g.entrada),g.total); break;
      case 'triangulo-lados': triangulo(g.lados); cerca(suma(g.lados),g.perimetro); break;
      case 'trapecio-isosceles': assert.ok(g.B>g.b&&g.b>0&&g.l>(g.B-g.b)/2); cerca(g.b+g.B+2*g.l,g.perimetro); break;
      case 'triangulo-area': assert.ok(g.base>0&&g.altura>0); cerca(g.base*g.altura/2,g.area); break;
      case 'isosceles-area': cerca((g.base/2)**2+g.altura**2,g.lado**2); cerca(g.base*g.altura/2,g.area); cerca(g.base+2*g.lado,g.perimetro); break;
      case 'trapecio-area': assert.ok(g.B>g.b&&g.b>0&&g.h>0); cerca((g.B+g.b)*g.h/2,g.area); break;
      case 'areas-iguales': cerca(g.rectBase*g.rectAltura,g.area); cerca(g.triBase*g.triAltura/2,g.area); cerca(3*q.x+6,g.triAltura); break;
      case 'circulo': assert.ok(g.radio>0); cerca(2*g.radio,g.longitudCoef); if(g.areaCoef)cerca(g.radio**2,g.areaCoef); break;
      case 'circulos-relacion': assert.ok(g.pequeno>0); cerca(g.grande-3,g.pequeno); cerca(2*g.grande,g.longitudCoef); cerca(g.pequeno**2,g.areaCoef); break;
      case 'poligono':
        assert.ok(Number.isInteger(g.n)&&g.n>=3);
        if(g.P)cerca(g.n*g.L,g.P);
        if(g.interior)cerca(180-360/g.n,g.interior);
        if(g.exterior)cerca(360/g.n,g.exterior);
        if(g.central)cerca(360/g.n,g.central);
        if(g.suma)cerca((g.n-2)*180,g.suma);
        if(g.diagonalesVertice)cerca(g.n-3,g.diagonalesVertice);
        break;
      case 'poligono-area-aproximada':
        assert.ok(Math.abs(g.a-g.L/(2*Math.tan(Math.PI/g.n)))<=.5);
        cerca(g.n*g.L,g.P); cerca(g.P*g.a/2,g.A);
        assert.match(q.enunciado,/redondea/); assert.match(q.enunciado,/aproximad/);
        break;
      case 'poligono-cuadrado': assert.equal(g.n,4); cerca(g.a*2,g.L); cerca(4*g.L,g.P); break;
      case 'semejanza': cerca(g.par1[1]/g.par1[0],g.par2[1]/g.par2[0]); if(g.lados)triangulo(g.lados); break;
      case 'pitagoras':
        assert.ok(g.a>0&&g.b>0&&g.c>g.a&&g.c>g.b); cerca(g.a**2+g.b**2,g.c**2);
        cerca(q.ecuacion.d,g[g.incognita]);
        if(g.area)cerca(g.a*g.b/2,g.area);
        if(g.perimetro)cerca(2*(g.a+g.b),g.perimetro);
        break;
      default: assert.fail(`Verificación geométrica ausente: ${q.id}`);
    }
  }
});

test('Cada opción se comprueba contra la magnitud pedida, incluso tras operaciones adicionales', () => {
  for(const q of banco) {
    const o=q.objetivo;
    const soluciones=q.opciones.filter(op=>{
      // Invertir la respuesta pedida recupera la incógnita de la ecuación.
      const x=o.tipo==='inverso'?o.k/op.valor:o.tipo==='cuadrado'?Math.sqrt(op.valor/o.k)-o.b:(op.valor-o.b)/o.a;
      const {a,b,c,d}=q.ecuacion;
      return Math.abs(a*x+b-c*x-d)<1e-7;
    });
    assert.equal(soluciones.length,1,q.id);
    assert.equal(soluciones[0].id,q.correcta,q.id);
  }
});

test('Ronda completa sin repetir, orden variado por familias y sin nota final', () => {
  const e=crearPractica(banco,aleatorioSemilla(7));
  const primeras=e.orden.slice(0,64).map(id=>e.indice.get(id).familia);
  assert.equal(new Set(primeras).size,64);
  assert.equal(nuevaRonda(e),false);
  const vistas=new Set();
  for(let i=0;i<banco.length;i++) {
    const q=siguiente(e); assert.ok(q); assert.ok(!vistas.has(q.id));
    assert.equal(siguiente(e).id,q.id,'No saltar sin responder');
    assert.equal(responder(e,'z'),null);
    const opcion=i%2?q.correcta:q.opciones.find(o=>o.id!==q.correcta).id;
    assert.equal(responder(e,opcion),opcion===q.correcta);
    assert.equal(responder(e,q.correcta),null,'Una sola respuesta por pregunta');
    vistas.add(q.id); assert.equal(progreso(e).completadas,i+1);
  }
  assert.equal(siguiente(e),null); assert.ok(progreso(e).terminado);
  assert.ok(!('nota' in progreso(e))); assert.ok(!('aciertos' in progreso(e)));
  const anterior=[...e.orden]; assert.ok(nuevaRonda(e)); assert.equal(e.ronda,2);
  assert.equal(progreso(e).completadas,0); assert.notDeepEqual(e.orden,anterior);
});

test('Cambiar de tema conserva la memoria de todas las respuestas y no consume las pendientes', () => {
  const e=crearPractica(banco,aleatorioSemilla(42)),vistas=new Set();
  const pendiente=siguiente(e).id;
  cambiarTema(e,'pitagoras'); assert.equal(e.vistas.size,0);
  cambiarTema(e,'todos'); assert.ok(!e.vistas.has(pendiente)); assert.equal(e.vistas.size,0);
  for(const tema of Object.keys(TEMAS)) {
    cambiarTema(e,tema);
    let q;
    while((q=siguiente(e))) {
      assert.equal(q.tema,tema); assert.ok(!vistas.has(q.id));
      responder(e,q.correcta); vistas.add(q.id);
    }
    const p=progreso(e); assert.equal(p.temaCompletadas,p.temaTotal);
    if(vistas.size<banco.length) assert.equal(nuevaRonda(e),false);
  }
  cambiarTema(e,'todos'); assert.equal(e.actual,null); assert.equal(vistas.size,768);
  assert.equal(cambiarTema(e,'inexistente'),false);
});
