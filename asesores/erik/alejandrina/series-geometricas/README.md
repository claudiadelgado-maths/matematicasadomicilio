# Series geométricas

Sesión de Alejandrina con Erik. Menú y trece páginas progresivas, ejemplos con LaTeX, prácticas generativas guiadas y misión final de 24 retos. Fecha editorial original: 2026-09-22.

## Estructura

- `index.html`: menú, marcas de temas practicados, enlace a sesiones y misión.
- `explicacion/`: patrón, elementos, fórmula, término, primer término, raíces, razón, posición, dos términos, sumas, aplicaciones, medios y combinación. Ejemplos desplegables, variantes y campos vacíos. Continuar y Menú siempre disponibles.
- `juegos/mision-constelacion/`: dos problemas por cada una de doce familias, opciones y datos aleatorios, recorrido guardado y repaso. Sin reloj ni penalización que impida corregir.
- `recursos/modelo.mjs`: generadores puros semillados, validación numérica y misiones. `modelo.test.mjs` comprueba resultados y estado.
- `recursos/practica.mjs`: resolución guiada, operaciones correctas visibles, recorrido de potencias y cancelación de sumas.
- `recursos/mision-estado.mjs`: estado validado, reanudación y repaso. `ui.mjs`: presentación y almacenamiento. `sesion.css`: diseño exclusivo.

Las prácticas se integran en explicaciones; no existe una carpeta independiente de ejercicios. Por eso componentes.ejercicios sigue en false. No anunciar componentes vacíos.

## Matemáticas y estado

Se aceptan fracciones y decimales con punto o coma. Los campos vacíos no se evalúan como cero. Raíces: impar negativa, dos raíces reales y ausencia de raíz real. Reconstrucción y medios especifican razón positiva. Posiciones: pertenencia sin redondear y caso r = 1. Sumatorias finitas.

Claves `alejandrina-geometria-v2-*` para prácticas y marcas; `alejandrina-geometria-mision-v2` para misión. Se guardan semillas, variantes, respuestas, borrador y avance. Al restaurar se regeneran los problemas y validan los pasos: un cursor almacenado no permite saltar preguntas. Si localStorage falla, la actividad continúa en memoria e informa que no puede guardar. Nueva misión pide confirmar dentro de la página.

## Contrato y dependencias

Conservar id `series-geometricas-alejandrina`, slug `series-geometricas`, tipo `sesion`, usuario `alejandrina`, ruta `/asesores/erik/alejandrina/series-geometricas/`, estado publicado y fecha editorial. No renombrar carpeta ni entradas. Sincronizar metadatos y READMEs de cada módulo.

Sin framework ni recursos de otros alumnos. Recursos globales permitidos: base.css, navegacion.js y SVG de identidad. Conservar navegación, logotipo, pie, salto al contenido y controles flotantes. URLs relativas con directorio/index.html. KaTeX 0.18.1 mediante CDN con SRI; respaldo legible en explicación estática y expresión fuente en prácticas si falta el CDN.

## Entrega y comprobación

Entregar la carpeta completa series-geometricas conservando ubicación. Depende de la base compartida: no es un sitio autónomo. Modificar solo esta sesión y documentación/índices dependientes necesarios.

Desde la raíz: `node --test asesores/erik/alejandrina/series-geometricas/recursos/modelo.test.mjs`, `npm run catalogo` y `npm run validar`. Probar blanco/error/acierto, fracciones, variantes, otro ejercicio, recarga, misión completa, repaso y reinicio. Revisar móvil, escritorio, teclado, enlaces, consola y LaTeX. Alcance en ETAPAS.md.

## Cierre final

Menú con mapa desplegable de seis fórmulas, resumen de temas practicados, estado de misión y enlace para retomar la última página. La variante Disminuir alterna razones entre 0 y 1. Se rechazan fracciones con operandos numéricos no finitos. Se conserva la compatibilidad de las partidas existentes.

Actualización de variedad: prácticas con razones enteras 2–6 y fraccionarias 1/4, 1/2, 3/4, 3/2 y 5/2 según el tema. Otro ejercicio evita repetir la razón cuando la variante admite alternativas. Fórmula y término usan constructor de casillas, vista LaTeX en vivo y comprobación de los datos; Calcular muestra el término obtenido. Los borradores de estas prácticas se guardan por separado de la misión existente. Recursos: constructor.mjs y generatePractice/nextPractice de modelo.mjs.

Presentación fraccionaria: las cantidades no enteras se renderizan mediante LaTeX con fracciones reducidas; la entrada del alumno sigue aceptando decimales y fracciones. Recorre los saltos permite editar numerador y denominador de a₁ y r, conserva el deslizador y usa aritmética racional exacta (fracciones.mjs y explorador.mjs). Denominador cero y campos incompletos muestran un mensaje sin conservar una sucesión desactualizada.

El explorador inicia con campos simples a₁ y r. Usar fracciones cambia a numerador/denominador, con el símbolo y el signo igual a la izquierda; volver a campos simples conserva los valores y la posición. Las sucesiones se separan con comas y el enunciado del constructor se renderiza con KaTeX al crearlo.
