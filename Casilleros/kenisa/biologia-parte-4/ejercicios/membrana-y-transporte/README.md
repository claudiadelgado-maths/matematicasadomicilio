# Actividad 01 · Membrana plasmática y transporte celular

Primera actividad de Biología parte 4 de KENISA. ID `membrana-y-transporte-biologia-4-kenisa-erik`; sesión `biologia-parte-4-kenisa-erik`; ruta pública `/Casilleros/kenisa/biologia-parte-4/ejercicios/membrana-y-transporte/index.html`.

## Contenido y prácticas

Guía de membrana, bicapa, proteínas, colesterol, mosaico fluido, permeabilidad selectiva, transporte pasivo, ósmosis y tonicidad, transporte activo, bomba sodio-potasio y transporte en vesículas. Incluye tabla comparativa, ejemplos y tres afirmaciones desplegables. ATP se define brevemente para comprender las bombas. El cierre enlaza a Metabolismo/ATP de la actividad 02, completa con cinco laboratorios, guía y examen; respiración y fermentación se reservan para después.

- **Membrana:** cinco componentes seleccionables mediante números y botones con nombres; resaltado, función, detalle y contador sin duplicados. Cinco relaciones función/componente, validación de vacío, corrección por campo y reinicio.
- **Pasivo:** difusión simple, facilitada y ósmosis; tres pasos por mecanismo con anterior, siguiente y repetir, sin reproducción automática. Cantidad de partículas conservada en los pasos. En difusión facilitada se supone ausencia de diferencia eléctrica adicional. Ósmosis muestra tendencia, no un equilibrio final calculado.
- **Ósmosis:** selector animal/vegetal y control de concentración exterior de 0 a 10; interior inicial 5. Predicción de entrada, salida o ausencia de flujo neto. Error explicado y reintento; acierto muestra forma, flechas y consecuencia. Tras acertar, las opciones quedan desactivadas hasta cambiar una condición. Se cuentan seis combinaciones tipo celular/medio, una vez cada una. Reinicio independiente.
- **Activo:** cuatro momentos de la bomba sodio-potasio, con tres Na⁺ al exterior, dos K⁺ al interior y un ATP por ciclo; anterior/siguiente/repetir.
- **Vesículas:** fagocitosis, pinocitosis y exocitosis, con tres esquemas y explicaciones por proceso. Cambiar de mecanismo vuelve al primer paso.
- **Doce casos:** elegir mecanismo y energía. Siete mecanismos posibles, validación de ambas decisiones, explicación, corrección, borradores por caso durante la visita, avance libre y contador de logros únicos. Reinicio propio.
- **Examen:** 60 preguntas originales, 10 categorías de seis. Rondas de 10/20, mezcla sin repetición hasta agotar variantes, explicación, resultado, revisión y práctica de errores con nota inicial conservada. `preguntas.md` es la copia docente del banco; mantenerla sincronizada.

## Implementación y dependencias

`index.html`/`estilos.css`: contenido y diseño. `modelo.mjs`: componentes, casos, etapas, modelo osmótico y evaluación pura. `script.mjs`: controles y SVG dinámico nativo. `banco-preguntas.mjs`: fuente del examen. `modelo.test.mjs`: cinco pruebas de límites y estados osmóticos, combinaciones válidas, SVG y anclajes, banco y rondas/puntuación.

`recursos/membrana.svg` es una ilustración original de membrana animal, también usada por el menú. Su copia exacta está incrustada para permitir resaltar componentes. Las coordenadas de los botones están en `modelo.mjs`.

Depende de `../../recursos/sesion.css` (también consumido por la portada) y de `../../../biologia-parte-1/recursos/cuestionarios.css`, `cuestionarios.mjs` y `modelo-repaso.mjs` (reutilizados sin cambios). Conserva recursos globales de marca, base, navegación, pie y flotantes. Sin librerías nuevas, almacenamiento, solicitudes de respuestas ni datos personales.

## Criterios científicos

- Membrana presente en todos los tipos celulares; pared y membrana no se sustituyen. Colesterol contextualizado en célula animal, sin atribuirlo como componente universal a todas las membranas.
- El gradiente de concentración compara la misma sustancia. Para iones se introduce brevemente el gradiente electroquímico. Proteína no equivale a gasto de ATP: canales y transportadoras pueden participar en transporte pasivo.
- El modelo de tonicidad considera un mismo soluto no penetrante, membrana permeable al agua y concentraciones iniciales en unidades relativas. No representa valores fisiológicos, tiempos, volúmenes exactos ni evolución de concentraciones tras el cambio. Los puntos son símbolos de concentración; las flechas indican tendencia neta y mantienen la idea de intercambio en ambos sentidos.
- Hipotónico/hipertónico son relativos al interior. Isotónico permite movimiento molecular sin flujo neto. La pared limita la expansión vegetal. Turgencia, plasmólisis, flacidez, hemólisis de eritrocitos y crenación se distinguen. No toda entrada de agua rompe una célula.
- Transporte activo requiere energía, directa en bombas ATPasas o indirecta mediante gradientes; no se equipara todo transporte activo con hidrólisis directa de ATP. Ejemplo central: bomba Na⁺/K⁺, 3 fuera y 2 dentro por ATP.
- Pinocitosis incorpora líquido en vesículas; no se confunde con paso osmótico. Exocitosis sirve tanto para secreción como para expulsión. Los mecanismos vesiculares requieren energía y no se definen por el gradiente de un soluto.

Referencias de consulta verificadas el 2026-10-17: OpenStax Biology 2e 5.1–5.4, enlazadas al pie. Texto, preguntas, casos y esquemas originales conforme al temario docente.

## Accesibilidad y verificación

Controles nativos con etiquetas, foco visible, botones seleccionados con `aria-pressed`, mensajes accesibles y texto de corrección además de color. Selector de concentración operable con flechas, Home/End. No hay arrastre obligatorio ni temporizadores. Estilos respetan movimiento reducido. Tablas con región enfocable y desplazamiento interno. Elementos opcionales sin contenido permanecen ocultos.

Ejecutar `node --test Casilleros/kenisa/biologia-parte-4/ejercicios/membrana-y-transporte/modelo.test.mjs`, `node --check Casilleros/kenisa/biologia-parte-4/ejercicios/membrana-y-transporte/script.mjs`, `npm run catalogo` y `npm run validar`.

Probar cinco componentes y funciones vacías/incorrectas/correctas/reinicio; nueve etapas pasivas; las seis condiciones osmóticas, error, cambio y reinicio; cuatro etapas de bomba; nueve etapas vesiculares; doce casos, vacíos, error, borradores y reinicio. Comprobar rondas 10/20, revisión de errores y nota original, teclado, consola, enlaces y pantallas 360/768/1024/1440 px.

Verificado el 2026-10-17: cinco pruebas aprobadas y sintaxis válida. Navegador: cinco componentes por teclado; funciones vacías, 4/5, 5/5 y reinicio; nueve etapas pasivas; seis combinaciones osmóticas correctas, error/reintento y reinicio; cuatro etapas de bomba y nueve vesiculares; doce casos correctos, vacíos, error, borradores y contador sin duplicados; examen 19/20 y repaso 1/1 conservando la nota inicial, más inicio de ronda 10. Se revisó visualmente el examen móvil y la turgencia/plasmólisis. Menú Enter/Escape y foco correctos, cero IDs duplicados, sin errores de consola, sin imágenes rotas ni desbordamiento a 360/768/1024/1440 px. El README de sesión registra catálogo, auditoría de enlaces y las limitaciones previas del validador general.
