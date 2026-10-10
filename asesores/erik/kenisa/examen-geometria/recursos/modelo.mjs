import { EXAMENES } from './examenes.mjs?v=20261010-1';

export function crearIntento(version) {
  const examen = EXAMENES[version];
  if (!examen) throw new RangeError('Examen desconocido');
  return { version, respuestas: Array(examen.preguntas.length).fill(null), entregado: false, mostrarRespuestas: false };
}

export function elegirRespuesta(intento, numero, letra) {
  const pregunta = EXAMENES[intento.version].preguntas[numero - 1];
  if (intento.entregado || !pregunta || !pregunta.opciones.some(opcion => opcion.letra === letra)) return false;
  intento.respuestas[numero - 1] = letra;
  return true;
}

export function contarRespondidas(intento) {
  return intento.respuestas.filter(respuesta => respuesta !== null).length;
}

export function calificacion(intento) {
  if (!intento.entregado) return null;
  const preguntas = EXAMENES[intento.version].preguntas;
  const detalle = preguntas.map((pregunta, indice) => ({
    numero: pregunta.numero,
    elegida: intento.respuestas[indice],
    correcta: pregunta.correcta,
    estado: intento.respuestas[indice] === null ? 'sin-responder' : intento.respuestas[indice] === pregunta.correcta ? 'correcta' : 'incorrecta'
  }));
  const aciertos = detalle.filter(item => item.estado === 'correcta').length;
  return {
    total: preguntas.length,
    aciertos,
    incorrectas: detalle.filter(item => item.estado === 'incorrecta').length,
    sinResponder: detalle.filter(item => item.estado === 'sin-responder').length,
    nota: Math.round(aciertos * 100 / preguntas.length),
    detalle
  };
}

export function entregar(intento) {
  if (intento.entregado) return false;
  intento.entregado = true;
  return true;
}

export function alternarRespuestas(intento) {
  if (!intento.entregado) return false;
  intento.mostrarRespuestas = !intento.mostrarRespuestas;
  return intento.mostrarRespuestas;
}
