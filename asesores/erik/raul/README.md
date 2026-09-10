# Espacio de Raúl

Casillero activo del salón de Erik (`erik-estrella`), junto a Alejandrina y Kenia. ID único: `raul-erik`. Ruta: `/asesores/erik/raul/index.html`. Es independiente del alumno Raúl del salón de Karen Mariana.

## Guía para continuar

El sitio es estático, sin framework ni base de datos. Lee el README raíz y las guías de arquitectura, gestión académica y creación de sesiones de `documentacion/` antes de intervenir. Los metadatos de cada carpeta son la fuente de verdad; `npm run catalogo` genera los índices y `npm run validar` comprueba su coherencia. No edites los índices generados a mano.

`usuario.json` registra al alumno. `index.html` usa `../../recursos/js/alumno.js` para mostrar automáticamente las sesiones publicadas. Reutiliza CSS, navegación, marca y controles flotantes globales mediante rutas relativas; el diseño propio está en `estilos.css`. No guarda datos en almacenamiento local.

## Sesiones iniciales

1. Matemáticas, parte 1: `matematicas-parte-1/`, inicio publicado. Presentación, conversaciones y plan en una página vertical; después, apoyo visual y práctica de monomios, polinomios y suma.
2. Electricidad 1: `fisica-parte-1/`, publicada; conserva la ruta histórica.

Ambas tienen README y `sesion.json`. Matemáticas usa su propio `matematicas-parte-1/recursos/sesion.css` para sus cuatro páginas. Electricidad tiene doce páginas y diseño propio en `fisica-parte-1/recursos/electricidad.css`. Cada página tiene `estilos.css`. Ambas sesiones aparecen en el listado automático.

El usuario proporcionará las especificaciones y el contenido de un formato diferente al habitual. No inventar temario, nivel, ejercicios, objetivos ni imponer la estructura de otras sesiones. Mantener la identidad y navegación del sitio. Completar cada sesión según esas indicaciones y sincronizar HTML, README y JSON antes de publicarla.

## Comprobaciones

Ejecutar `npm run catalogo` y `npm run validar`. Verificar que Raúl aparece en el salón de Erik, que Matemáticas, parte 1 aparece en su casillero, que Electricidad 1 aparece publicada y que las páginas permiten regresar al alumno. Revisar a 360, 768, 1024 y 1440 px, teclado, menú móvil, Escape, foco visible, consola y enlaces.

## Repaso

Nueva sesión publicada en `repaso/`: 25 páginas: nueve de fracciones, doce de sustitución, una de despejes sencillos y tres vistas finales de proporcionalidad directa, inversa y factorización numérica. Incluye representaciones, operaciones, sustitución de enteros, negativos, fracciones y decimales, potencias, fórmulas y retos dinámicos. Recursos independientes, fondo verde y navegación secuencial. Aparece automáticamente mediante `sesion.json`.

## Matemáticas Parte 2

Nueva sesión publicada en `matematicas-parte-2/`: inicio y ocho apartados de factorización algebraica. Incluye factor común con barrido y expansión, agrupación de cuatro o seis términos, cuadrados, trinomios, cubos y reto mixto con solución detallada. Generadores en dos niveles y recursos independientes. Se incorpora al listado automático del alumno.

## Electricidad Parte 2

Nueva sesión publicada en `electricidad-parte-2/`: diez páginas que conectan cargas y Coulomb, corriente, voltaje, resistencia, Ohm, potencia y Joule, con mapa de conexiones y reto conceptual/numérico. Siete laboratorios y 36 preguntas conceptuales con explicaciones. Recursos aislados y lienzo azul abierto.
