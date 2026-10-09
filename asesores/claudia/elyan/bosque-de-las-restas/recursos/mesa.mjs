import { comprobar, intercambiar, valor, NOMBRES } from './modelo.mjs';
import { $, dibujarTablero, actualizarCambios, mensaje, pista, textoCambio, destellos, tintin } from './interfaz.mjs';

// Tablero común a la aventura y la práctica. Cada página conserva su progreso.
export class Mesa {
  constructor(opciones) {
    this.opciones = opciones;
    [1, 2].forEach(fuente => $(`cambio-${fuente}`).addEventListener('click', () => this.cambiar(fuente)));
    $('deshacer').addEventListener('click', () => this.deshacer());
    $('reiniciar').addEventListener('click', () => this.reiniciar());
    $('pista').addEventListener('click', () => mensaje(pista(this.estado, ++this.pistas)));
  }
  preparar(reto, objetos) {
    this.reto = reto;
    this.objetos = objetos;
    this.canonico = !objetos || reto.mundo === 3;
    this.reiniciar(false);
  }
  reiniciar(avisar = true) {
    this.estado = { inicial: [...this.reto.inicial], actual: [...this.reto.inicial], pedido: [...this.reto.pedido], respuesta: Array(3).fill(this.opciones.teclado ? null : 0), historial: [], resuelto: false, marcas: [] };
    this.pistas = 0;
    this.dibujar();
    this.opciones.alReiniciar?.();
    if (avisar) mensaje('Todo vuelve a su lugar. ¡Prueba de nuevo, sin prisa!');
  }
  dibujar() {
    dibujarTablero($('tablero'), this.estado, { objetos: this.objetos, teclado: this.opciones.teclado, maxRespuesta: this.canonico ? 9 : 20 });
    actualizarCambios(this.estado);
    $('comprobar').disabled = this.estado.resuelto;
    $('pista').disabled = this.estado.resuelto;
    $('valor-total').replaceChildren();
    if (this.reto.a !== undefined) {
      $('valor-total').append('Valor antes de entregar: ');
      const numero = document.createElement('strong');
      numero.textContent = valor(this.estado.actual);
      $('valor-total').append(numero);
    }
  }
  cambiar(fuente) {
    if (this.estado.resuelto || this.reto.mundo === 1 || this.estado.actual[fuente - 1] > 9) return;
    const nuevo = intercambiar(this.estado.actual, fuente);
    if (!nuevo) return;
    this.estado.actual = nuevo;
    this.estado.historial.push([...nuevo]);
    this.estado.marcas = [];
    this.pistas = 0;
    this.dibujar();
    destellos($('tablero'), fuente);
    tintin();
    mensaje(textoCambio(fuente, nuevo));
  }
  deshacer() {
    if (this.estado.resuelto || !this.estado.historial.length) return;
    this.estado.historial.pop();
    this.estado.actual = [...(this.estado.historial.at(-1) ?? this.estado.inicial)];
    this.estado.marcas = [];
    this.pistas = 0;
    this.dibujar();
    mensaje('Deshicimos el último intercambio. Tus respuestas siguen aquí para que las revises.');
  }
  comprobar() {
    if (this.estado.resuelto) return;
    const resultado = comprobar(this.estado.actual, this.estado.pedido, this.estado.respuesta, this.canonico);
    if (resultado.faltan !== -1) {
      mensaje(pista(this.estado, ++this.pistas), 'revisa');
      return;
    }
    if (this.canonico && this.estado.actual.some((n, i) => n - this.estado.pedido[i] > 9)) {
      mensaje('Hay un intercambio de más. Pulsa Deshacer: el resultado lleva una sola cifra en cada columna.', 'revisa');
      return;
    }
    this.estado.marcas = resultado.columnas;
    this.estado.resuelto = resultado.correcto;
    this.dibujar();
    if (resultado.correcto) this.opciones.alAcertar(this.estado);
    else {
      const p = resultado.columnas.findIndex(correcto => !correcto);
      mensaje(`¡Vamos poco a poco! Revisa las ${NOMBRES[p]}: de ${this.estado.actual[p]} quitas ${this.estado.pedido[p]}. Las columnas con ✓ ya están bien.`, 'revisa');
      const control = $('tablero').querySelector(this.opciones.teclado ? `#respuesta-${p}` : `[data-mas="${p}"]`);
      if (!control.disabled) control.focus({ preventScroll: true });
    }
  }
}
