/* Numeración antihoraria desde el rayo horizontal derecho en cada cruce.
   Arriba: 1,2,3,4. Abajo: 5,6,7,8. La inclinación es la medida de ∠1. */
export const RELACIONES = [
  { id: 'verticales', nombre: 'Opuestos por el vértice', regla: 'igual', pares: [[1,3],[2,4],[5,7],[6,8]], pista: 'Comparten vértice y sus lados son prolongaciones opuestas.' },
  { id: 'adyacentes', nombre: 'Adyacentes · par lineal', regla: 'suplementario', pares: [[1,2],[2,3],[3,4],[1,4],[5,6],[6,7],[7,8],[5,8]], pista: 'Comparten vértice y un lado; los otros lados forman una recta.' },
  { id: 'correspondientes', nombre: 'Correspondientes', regla: 'igual', pares: [[1,5],[2,6],[3,7],[4,8]], pista: 'Ocupan la misma posición en los dos cruces: uno interior y otro exterior.' },
  { id: 'alternos-internos', nombre: 'Alternos internos', regla: 'igual', pares: [[3,5],[4,6]], pista: 'Están entre las paralelas y a lados opuestos de la transversal.' },
  { id: 'alternos-externos', nombre: 'Alternos externos', regla: 'igual', pares: [[1,7],[2,8]], pista: 'Están fuera de las paralelas y a lados opuestos de la transversal.' },
  { id: 'colaterales-internos', nombre: 'Colaterales internos', regla: 'suplementario', pares: [[3,6],[4,5]], pista: 'Están entre las paralelas y al mismo lado de la transversal.' },
  { id: 'colaterales-externos', nombre: 'Colaterales externos', regla: 'suplementario', pares: [[1,8],[2,7]], pista: 'Están fuera de las paralelas y al mismo lado de la transversal.' },
  { id: 'otra', nombre: 'Otra pareja · relación por pasos', regla: 'suplementario', pares: [[1,6],[2,5],[3,8],[4,7]], pista: 'No forman directamente una de las parejas anteriores. Usa un correspondiente y después un par lineal: también suman 180°.' }
];
export function relacion(a, b) {
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b > 8 || b < 1 || a > 8 || a === b) throw new RangeError('Elige dos ángulos distintos del 1 al 8.');
  const low = Math.min(a,b), high = Math.max(a,b);
  return RELACIONES.find(r => r.pares.some(p => p[0] === low && p[1] === high));
}
export const medida = (numero, inclinacion) => numero % 2 ? inclinacion : 180 - inclinacion;
export const medidas = inclinacion => Array.from({length:8}, (_,i) => medida(i+1,inclinacion));
export function mezcla(items, azar = Math.random) {
  const result = [...items];
  for (let i = result.length-1; i > 0; i--) { const j = Math.floor(azar()*(i+1)); [result[i],result[j]] = [result[j],result[i]]; }
  return result;
}
const entero = (min,max,azar) => min + Math.floor(azar()*(max-min+1));
export function expresion(a,b,variable) { return `${a === 1 ? '' : a}${variable}${b > 0 ? ` + ${b}` : b < 0 ? ` − ${-b}` : ''}`; }
export function crearVariable(variable, target, reference, inclinacion, ronda, azar = Math.random) {
  const targetValue = medida(target,inclinacion);
  let a, b, solucion;
  if (ronda === 0) { a = entero(2,4,azar); b = targetValue % a; solucion = (targetValue-b)/a; }
  else {
    a = entero(2,ronda < 2 ? 4 : 6,azar);
    solucion = Math.max(1, Math.round(targetValue/a) + entero(-3,3,azar));
    b = targetValue - a*solucion;
  }
  const refValue = medida(reference,inclinacion);
  return { variable, target, reference, a, b, solucion, refValue, targetValue,
    regla: relacion(target,reference).regla, texto: expresion(a,b,variable) };
}
export function ecuacion(v) {
  return v.regla === 'igual' ? `${v.texto} = ${v.refValue}` : `(${v.texto}) + ${v.refValue} = 180`;
}
export function explicacionVariable(v, numeros=[1,2,3,4,5,6,7,8]) {
  const r = relacion(v.target,v.reference);
  return `∠${numeros[v.target-1]} y ∠${numeros[v.reference-1]}: ${r.nombre.toLowerCase()}. ${ecuacion(v)}. La expresión debe valer ${v.targetValue}°; ${v.a}${v.variable} = ${v.targetValue-v.b}, así que ${v.variable} = ${v.solucion}.`;
}
/* Cada serie tiene 20 retos. La selección por posición garantiza que las
   siete relaciones habituales aparezcan y que igualdad/suplemento alternen. */
export function crearSerie(modo, azar = Math.random) {
  if (![1,2,3,4].includes(modo)) throw new RangeError('Juego desconocido');
  const order = mezcla(RELACIONES.slice(0,7),azar);
  const acute = mezcla([40,44,48,50,52,56,60,64,68,70,72,76,80,84],azar);
  return Array.from({length:20},(_,index) => {
    const ronda = Math.floor(index/5);
    const kind = order[index%order.length];
    const pair = mezcla(kind.pares[entero(0,kind.pares.length-1,azar)],azar);
    let inclination = acute[index%acute.length];
    if (index%2) inclination = 180-inclination;
    if (modo === 2 && index === 12) inclination = 90;
    const question = { modo, ronda, index, inclinacion: inclination, valores: medidas(inclination), par:pair, relacion:kind.id,
      opciones: mezcla([kind, ...mezcla(order.filter(r=>r!==kind),azar).slice(0,3)],azar).map(r=>r.id),
      numeros: mezcla([1,2,3,4,5,6,7,8],azar), dados: {}, variables: [] };
    if (modo === 2) { const given = entero(1,8,azar); question.dados[given] = medida(given,inclination); }
    if (modo >= 3) {
      // En x e y usamos referencias numéricas distintas. Ninguna expresión
      // depende de la otra variable ni de su resultado.
      const reference = pair[1], target = pair[0];
      question.dados[reference] = medida(reference,inclination);
      question.variables.push(crearVariable('x',target,reference,inclination,ronda,azar));
      if (modo === 4) {
        const remaining = mezcla([1,2,3,4,5,6,7,8].filter(n=>n!==reference && n!==target),azar);
        const yReference = remaining[0];
        // Alterna ecuaciones iguales y suplementarias para y, independientemente de x.
        const desired = index%2 ? 'igual' : 'suplementario';
        const yTarget = remaining.slice(1).find(n=>relacion(n,yReference).regla === desired);
        question.dados[yReference] = medida(yReference,inclination);
        question.variables.push(crearVariable('y',yTarget,yReference,inclination,ronda,azar));
      }
    }
    return question;
  });
}
export function crearProgreso(modo, azar = Math.random) {
  return { modo, serie:crearSerie(modo,azar), index:0, aciertos:0, errores:0, huboError:false, completado:false,
    fase:'pregunta', ...camposVacios() };
}
const camposVacios = () => ({respuestas:{},resueltas:{},valoresVariables:{},borradores:{},revisados:{},erroresAngulos:{},revisadasVariables:{},erroresVariables:{}});
export function reiniciarRespuestas(state) { Object.assign(state,camposVacios()); }
export function leerNumero(raw) {
  const text=String(raw).trim();
  if (!text) return null;
  if (!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(text)) return NaN;
  return Number(text.replace(',','.'));
}
export function guardarMedida(state,slot,raw) {
  const q=state.serie[state.index];
  if (state.completado || q.dados[slot]!==undefined || state.respuestas[slot]!==undefined) return;
  if (state.borradores[slot]!==raw) {
    state.borradores[slot]=raw; delete state.revisados[slot]; delete state.erroresAngulos[slot];
  }
}
export function guardarVariable(state,variable,raw) {
  if (state.completado || state.resueltas[variable]) return;
  if (state.valoresVariables[variable]!==raw) {
    state.valoresVariables[variable]=raw; delete state.revisadasVariables[variable]; delete state.erroresVariables[variable];
  }
}
/* Confirmar solo en Enter/blur. El mismo texto no genera otro error al salir
   del campo después de Enter, y un borrador vacío nunca penaliza. */
function confirmarCampo(state,raw,expected,revisados,key) {
  const text=String(raw).trim(), value=leerNumero(text);
  if (value===null) return {tipo:'vacio'};
  if (revisados[key]===text) return {tipo:'repetido'};
  revisados[key]=text;
  if (value===expected) return {tipo:'correcto',valor:value};
  state.huboError=true; state.errores++;
  return {tipo:'incorrecto'};
}
export function confirmarMedida(state,slot) {
  const q=state.serie[state.index];
  if (!Number.isInteger(slot) || slot<1 || slot>8 || state.completado || q.dados[slot]!==undefined || state.respuestas[slot]!==undefined) return {tipo:'bloqueado'};
  const result=confirmarCampo(state,state.borradores[slot]??'',q.valores[slot-1],state.revisados,slot);
  if (result.tipo==='correcto') {state.respuestas[slot]=result.valor;state.borradores[slot]=String(result.valor);delete state.erroresAngulos[slot];}
  else if (result.tipo==='incorrecto') state.erroresAngulos[slot]=true;
  return result;
}
export function confirmarVariable(state,variable) {
  const v=state.serie[state.index].variables.find(item=>item.variable===variable);
  if (!v || state.completado || state.resueltas[variable]) return {tipo:'bloqueado'};
  const result=confirmarCampo(state,state.valoresVariables[variable]??'',v.solucion,state.revisadasVariables,variable);
  if (result.tipo==='correcto') {
    state.resueltas[variable]=true;state.valoresVariables[variable]=String(result.valor);delete state.erroresVariables[variable];
    result.autocompletadas=completarMedidasPendientes(state);
  }
  else if (result.tipo==='incorrecto') state.erroresVariables[variable]=true;
  return result;
}
function completarMedidasPendientes(state) {
  const q=state.serie[state.index];
  if (![3,4].includes(q.modo) || !q.variables.every(v=>state.resueltas[v.variable])) return 0;
  let total=0;
  q.valores.forEach((value,index)=>{
    const slot=index+1;
    if (q.dados[slot]!==undefined || state.respuestas[slot]!==undefined) return;
    state.respuestas[slot]=value;state.borradores[slot]=String(value);
    delete state.erroresAngulos[slot];delete state.revisados[slot];total++;
  });
  return total;
}
export function retoNumericoResuelto(state) {
  const q=state.serie[state.index];
  return q.modo>=2 && Object.keys(q.dados).length+Object.keys(state.respuestas).length===8 && q.variables.every(v=>state.resueltas[v.variable]);
}
export function terminarReto(state) {
  if (state.completado) return false;
  state.completado = true;
  if (!state.huboError) state.aciertos++;
  return true;
}
export function avanzar(state) {
  if (!state.completado || state.index >= 19) return false;
  state.index++;
  Object.assign(state, {huboError:false,completado:false,fase:'pregunta',...camposVacios()});
  return true;
}
export function geometria(inclinacion, camposNumericos=false) {
  const rad = inclinacion * Math.PI/180;
  const distance=camposNumericos ? 110 : 92;
  const dx = distance / Math.tan(rad);
  const vertices = [{x:250+dx,y:250-distance},{x:250-dx,y:250+distance}];
  const bounds = [0,inclinacion,180,180+inclinacion,360];
  const point = (v,r,deg) => ({x:v.x+r*Math.cos(deg*Math.PI/180),y:v.y-r*Math.sin(deg*Math.PI/180)});
  const angles = Array.from({length:8}, (_,i) => {
    const v = vertices[Math.floor(i/4)], quadrant=i%4;
    const start=bounds[quadrant], end=bounds[quadrant+1];
    const from=point(v,70,start), to=point(v,70,end), label=point(v,camposNumericos ? 82 : 74,(start+end)/2);
    return {numero:i+1, label, path:`M ${v.x} ${v.y} L ${from.x} ${from.y} A 70 70 0 0 0 ${to.x} ${to.y} Z`};
  });
  const upper = {x:250+220/Math.tan(rad),y:30}, lower = {x:250-220/Math.tan(rad),y:470};
  return { vertices, angles, upper, lower };
}
