import { TOTAL } from './modelo.mjs';
export const CLAVE = 'mad-bosque-restas-v1';
let disponible = true;
let memoria = { completadas: 0, semilla: Math.floor(Math.random() * 4294967296) };
export function leerProgreso() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    if (guardado && Number.isInteger(guardado.completadas) && guardado.completadas >= 0 && guardado.completadas <= TOTAL
      && Number.isInteger(guardado.semilla) && guardado.semilla >= 0 && guardado.semilla <= 4294967295) memoria = guardado;
  } catch { disponible = false; }
  return { ...memoria };
}
export function guardarProgreso(progreso) {
  memoria = { completadas: progreso.completadas, semilla: progreso.semilla };
  try { localStorage.setItem(CLAVE, JSON.stringify(memoria)); } catch { disponible = false; }
  return { ...memoria };
}
export const puedeGuardar = () => disponible;
