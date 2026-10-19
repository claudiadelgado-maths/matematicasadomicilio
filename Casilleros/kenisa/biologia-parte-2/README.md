# Biología parte 2

Sesión independiente de KENISA, usuario `kenisa-erik`. Entrada: `/Casilleros/kenisa/biologia-parte-2/index.html`. Fecha editorial: 2026-10-14.

## Alcance

La sesión está completa con cuatro actividades: **01 — ADN y cromosomas**, **02 — Mitosis: cómo se divide una célula**, **03 — Meiosis: formación de gametos** y **04 — Mitosis vs. meiosis y reproducción**. El menú y los cierres conectan las cuatro, con regreso al casillero y Biología parte 1.

`sesion.json` declara únicamente `ejercicios`; las explicaciones, ocho prácticas y cuatro evaluaciones están integradas en esas páginas. El último test integra toda la sesión. La lista del casillero se actualiza mediante el catálogo, sin editar su HTML.

## Recursos

- `index.html`, `estilos.css`: portada con ilustraciones, cuatro actividades disponibles y orientación de estudio.
- `recursos/biologia.css`: identidad exclusiva compartida entre las cinco páginas de esta sesión. Verde bosque, crema, rosa, lila y lima; tipografía redondeada local de `../recursos/fredoka.ttf` (licencia junto a esa fuente). Revisar las cinco páginas si cambia.
- `recursos/portada.svg`: ilustración original del menú.
- `recursos/diagramas.svg`: símbolos SVG locales para ADN, gen, cromatina, cromosomas simples y duplicados, anatomía, homólogos, diploidía, haploidía y división. Los consumidores son el menú, ADN y Mitosis. Descripciones accesibles en cada uso.
- `ejercicios/adn-y-cromosomas/`: explicación, dos prácticas y repaso de 14 preguntas; ver su README.
- `ejercicios/mitosis/`: célula animada, dos prácticas y repaso de 16 preguntas; ver su README. Seis vistas separan preparación, cuatro fases mitóticas y citocinesis. Conserva ocho copias de ADN y reparte una de cada color a cada hija.
- `recursos/mitosis.svg`: ilustración usada en menú y Mitosis, exportada de `escena.mjs` con `sceneMarkup(5)`.
- `ejercicios/meiosis/`: nueve vistas animadas de una a cuatro células; entrecruzamiento antes/después, distribución de homólogos, dos prácticas y 18 preguntas (tres con dibujos). Conserva ocho moléculas de ADN, sin segunda replicación. Ver su README.
- `recursos/meiosis.svg`: ilustración usada en menú y Meiosis. `node Casilleros/kenisa/biologia-parte-2/ejercicios/meiosis/generar-ilustraciones.mjs` regenera esta portada y los dibujos estáticos dentro de Meiosis después de cambiar su geometría o banco de fases.
- `recursos/repaso.css`, `repaso.mjs` y `modelo-repaso.mjs`: presentación, controlador y puntuación compartidos por los cuatro repasos. Extraídos del primero manteniendo su comportamiento; `adn-y-cromosomas/modelo.mjs` conserva la entrada anterior mediante reexportación. Cualquier cambio requiere comprobar las cuatro actividades.
- Meiosis reutiliza la escena de anafase mitótica y la mezcla de opciones de Mitosis en su práctica de separación. Ambas dependencias se documentan en los README de las actividades 02/03.
- `ejercicios/mitosis-meiosis-y-reproduccion/`: comparación en tres momentos, fecundación en tres estados, ciclo completo, diversidad, dos prácticas y test integrador de 22 preguntas (cuatro con dibujos). Su README documenta los contenidos y dependencias. Reutiliza las escenas de Mitosis y Meiosis.
- `recursos/reproduccion.svg`: portada del menú y actividad 04. Se regenera, junto con los dibujos estáticos de esta última, mediante su `generar-ilustraciones.mjs`.
- Base, logotipo, navegación, pie y controles flotantes usan los recursos globales sin cambios. Todas las rutas internas son relativas y las páginas se enlazan con `index.html`.

Sin dependencias nuevas, red para las actividades, almacenamiento, cuentas ni envío de respuestas. Solo las fuentes bibliográficas y WhatsApp enlazan fuera del sitio.

## Verificación

Desde la raíz: `npm run catalogo`, `npm run validar` y `node --test Casilleros/kenisa/biologia-parte-2/ejercicios/adn-y-cromosomas/modelo.test.mjs Casilleros/kenisa/biologia-parte-2/ejercicios/mitosis/modelo.test.mjs Casilleros/kenisa/biologia-parte-2/ejercicios/meiosis/modelo.test.mjs Casilleros/kenisa/biologia-parte-2/ejercicios/mitosis-meiosis-y-reproduccion/modelo.test.mjs`.

Revisar las cinco páginas a 360, 768, 1024 y 1440 px; menú/Escape, foco visible, navegación por teclado, recursos SVG y fuente, enlaces de ida y vuelta, consola y ausencia de desplazamiento horizontal. Comprobar además el enlace generado en el casillero. En Mitosis probar las seis fases y en Meiosis las nueve, con reproducción/pausa/final/repetición, movimiento reducido, prácticas con reintentos/reinicio y puntuaciones extremas. En actividad 04 comprobar comparación, fecundación, prácticas con reintento/deshacer/reinicio y resultados 0/22 y 22/22. Comprobar también el test de ADN si cambia el motor compartido. No modificar recursos de Biología parte 1 para extender esta sesión.

Las veinticinco pruebas de los cuatro modelos verifican bancos, claves, orden, conservación visual de ADN, intercambio y distribución por célula, además de puntuaciones extremas. La validación global conocida encuentra diez errores previos en metadatos de Interés simple y compuesto (Andrés) y Determinantes 2 × 2 (Renata), que declaran cinco carpetas inexistentes cada uno. La regeneración de los índices también sincroniza sus metadatos previos sin editar esos módulos ni los derivados a mano.

## Consumidor adicional: Biología examen (2026-10-18)

`../biologia-examen/examenes/opcion-multiple/banco.mjs` importa los bancos de todas las actividades de esta parte sin modificar sus fuentes ni motores. El README de ese examen enumera los archivos y cantidades. También consume las funciones de dibujo de las escenas de Mitosis, Meiosis y Reproducción para conservar las preguntas visuales. Al cambiar esos datos o ilustraciones, revisar el examen combinado, sus claves, persistencia y pruebas; sincronizar sus metadatos y cantidades si cambia el total.
