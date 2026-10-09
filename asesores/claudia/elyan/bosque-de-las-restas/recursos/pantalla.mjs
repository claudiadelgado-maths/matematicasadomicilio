// Se llama directamente desde un clic: los navegadores requieren ese gesto.
export async function pantallaCompleta(elemento) {
  try {
    if (elemento.requestFullscreen) await elemento.requestFullscreen({ navigationUI: 'hide' });
    else if (elemento.webkitRequestFullscreen) await elemento.webkitRequestFullscreen();
    else return false;
    return true;
  } catch { return false; }
}
export const elementoCompleto = documento => documento.fullscreenElement ?? documento.webkitFullscreenElement;
export async function salirDePantalla(documento) {
  if (!elementoCompleto(documento)) return;
  try {
    if (documento.exitFullscreen) await documento.exitFullscreen();
    else if (documento.webkitExitFullscreen) await documento.webkitExitFullscreen();
  } catch { /* Salir del juego sigue disponible aunque el navegador ya haya salido. */ }
}
