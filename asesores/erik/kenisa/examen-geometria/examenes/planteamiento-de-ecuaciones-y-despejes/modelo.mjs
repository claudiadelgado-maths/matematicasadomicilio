import { crearBanco, mezclar } from './banco.mjs?v=20261010-1';

// Intercalar las familias evita presentar doce cambios numéricos seguidos del mismo problema.
export function ordenarBanco(banco, azar = Math.random) {
  const grupos = new Map();
  banco.forEach(q => { if (!grupos.has(q.familia)) grupos.set(q.familia, []); grupos.get(q.familia).push(q.id); });
  for (const [id, preguntas] of grupos) grupos.set(id, mezclar(preguntas, azar));
  const orden = []; let anterior = null;
  while ([...grupos.values()].some(preguntas => preguntas.length)) {
    const familias = mezclar([...grupos.keys()].filter(id => grupos.get(id).length), azar);
    if (familias.length > 1 && familias[0] === anterior) [familias[0], familias[1]] = [familias[1], familias[0]];
    familias.forEach(id => { orden.push(grupos.get(id).pop()); anterior = id; });
  }
  return orden;
}

export function crearPractica(banco = crearBanco(), azar = Math.random) {
  return { banco, indice: new Map(banco.map(q => [q.id, q])), orden: ordenarBanco(banco, azar), vistas: new Set(), ronda: 1, tema: 'todos', actual: null, respuesta: null, azar };
}
export function siguiente(estado) {
  if (estado.actual && !estado.respuesta && (estado.tema === 'todos' || estado.actual.tema === estado.tema)) return estado.actual;
  const id = estado.orden.find(id => !estado.vistas.has(id) && (estado.tema === 'todos' || estado.indice.get(id).tema === estado.tema));
  estado.actual = id ? estado.indice.get(id) : null;
  estado.respuesta = null;
  return estado.actual;
}
export function cambiarTema(estado, tema) {
  if (tema !== 'todos' && !estado.banco.some(q => q.tema === tema)) return false;
  estado.tema = tema;
  siguiente(estado);
  return true;
}
export function responder(estado, id) {
  const q = estado.actual;
  if (!q || estado.respuesta || !q.opciones.some(o => o.id === id)) return null;
  const correcta = id === q.correcta;
  estado.respuesta = { id, correcta };
  estado.vistas.add(q.id);
  return correcta;
}
export function progreso(estado) {
  const seleccion = estado.banco.filter(q => estado.tema === 'todos' || q.tema === estado.tema);
  return { completadas: estado.vistas.size, total: estado.banco.length, temaCompletadas: seleccion.filter(q => estado.vistas.has(q.id)).length, temaTotal: seleccion.length, terminado: estado.vistas.size === estado.banco.length };
}
export function nuevaRonda(estado) {
  if (!progreso(estado).terminado) return false;
  const ultima = estado.actual?.id;
  estado.orden = ordenarBanco(estado.banco, estado.azar);
  if (estado.orden[0] === ultima && estado.orden.length > 1) [estado.orden[0], estado.orden[1]] = [estado.orden[1], estado.orden[0]];
  estado.vistas.clear(); estado.actual = null; estado.respuesta = null; estado.tema = 'todos'; estado.ronda++;
  siguiente(estado);
  return true;
}
