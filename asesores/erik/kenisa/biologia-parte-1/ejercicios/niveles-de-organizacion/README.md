# 03 — Niveles de organización biológica

Actividad de Biología parte 1, KENISA → Erik, para primero de preparatoria. Entrada desde la tarjeta 03 del menú y Continuar al final de Biomoléculas. Conserva el estilo, los controles y la identidad de la sesión. HTML/CSS/JavaScript/SVG nativos sin dependencias, imágenes remotas ni almacenamiento.

## Recorrido

Ocho paradas disponibles desde la carga: Átomo → Molécula → Organelo → Célula → Tejido → Órgano → Sistema o aparato → Organismo. Cada parada tiene ilustración propia, definición breve, ejemplos, conexión con el siguiente nivel y botones anterior/siguiente. Las visitas se marcan, sin bloquear ningún contenido.

El comparador Persona/Bacteria explica pluricelular y unicelular. Construye la escalera permite tocar o activar con teclado las ocho tarjetas mezcladas en orden. Cada acierto añade un peldaño verde; el error deja una tarjeta roja, × temporal de 1.1 segundos y una pista. El error no avanza y permite corregir. Cuenta colocadas y aciertos al primer intento. Mezclar y repetir reinicia solo ese juego.

La evaluación Detective de niveles aparece directamente: 24 preguntas originales, tres por nivel, en rondas de 8 o 16. Cada ronda cubre los ocho niveles; opciones y preguntas mezcladas, sin repetición interna y agotando variantes antes de reciclar. La primera respuesta puntúa una vez. Verde/✓ y rojo/× acompañan la explicación; la siguiente pregunta requiere respuesta. Al finalizar hay puntaje, porcentaje, temas por repasar y explicación de errores. Practicar mis errores conserva visible la calificación inicial y tiene estado propio; un segundo repaso conserva esa misma calificación. Otra ronda comienza una evaluación nueva. Los paneles opcionales se omiten si no hay errores.

## Criterios científicos

El átomo es la unidad que conserva la identidad de un elemento, no una afirmación de que no existan partículas subatómicas. Las moléculas reúnen átomos enlazados; organelos y órganos son niveles distintos. Tejidos, órganos y sistemas se explican en organismos como una persona. El organismo no se define obligatoriamente como un conjunto de sistemas: una bacteria es un organismo unicelular sin tejidos, órganos ni sistemas.

Se relacionan tejido muscular, corazón y sistema circulatorio; el digestivo es otro ejemplo, sin colocar el corazón en él. Se incluye una hoja como órgano de una planta. La cadena es de organización: no es una transformación de agua en mitocondria ni una secuencia del desarrollo. Los dibujos son esquemas sin escala.

Fuentes de verificación: [OpenStax Biology 2e, organización de los seres vivos](https://openstax.org/books/biology-2e/pages/1-2-themes-and-concepts-of-biology), [Anatomy and Physiology 2e, organización del cuerpo humano](https://openstax.org/books/anatomy-and-physiology-2e/pages/1-2-structural-organization-of-the-human-body) y [átomos y moléculas](https://openstax.org/books/biology-2e/pages/2-1-atoms-isotopes-ions-and-molecules-the-building-blocks). Preguntas y dibujos originales; no se copian las ilustraciones de esas fuentes.

## Archivos y alcance

datos.mjs: conceptos y banco de 24 preguntas. ilustraciones.mjs: nueve esquemas reutilizables (ocho niveles y bacteria), SVG accesible o decorativo según contexto. modelo.mjs: estado de construcción de la escalera. script.mjs: explorador, comparación, juego y evaluación. estilos.css: composición local.

Se reutilizan ../../recursos/biologia.css y el motor ../../recursos/modelo-repaso.mjs sin editarlos; el motor también lo consumen célula y biomoléculas. Recursos globales de marca a seis niveles. No hay dependencias con Matemáticas ni con otras sesiones.

## Accesibilidad y verificación

Botones nativos, Tab/Enter/Espacio, foco visible, títulos enfocables, textos junto a colores, barras etiquetadas y avisos aria-live. El juego puede completarse sin arrastrar. Ilustraciones legibles en móvil, textos sin alturas fijas y animaciones cortas desactivadas con prefers-reduced-motion. No hay temporizador ni sonidos obligatorios.

node --test asesores/erik/kenisa/biologia-parte-1/ejercicios/niveles-de-organizacion/modelo.test.mjs revisa los ocho niveles, 24 preguntas, colocación, errores/duplicados, 500 rondas, cobertura y variantes, puntaje único y repaso que no altera la calificación original. Ejecutar también las pruebas existentes de la sesión, npm run catalogo y npm run validar.

Navegador: ocho paradas, ambas comparaciones, escalera completa con error/reinicio, evaluación de 8/16, rondas perfectas/con errores, repaso, teclado, toque, movimiento reducido y navegación de las cuatro páginas en 360/768/1024/1440 px; consola sin errores.
