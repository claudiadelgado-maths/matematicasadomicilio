# Casilleros

Cada estudiante tiene una carpeta directa en `/Casilleros/[slug]/`, con `index.html`, `estilos.css`, `README.md` y `usuario.json`. Las sesiones viven directamente dentro de su casillero y se reconocen por `sesion.json`.

La portada es el único catálogo de casilleros. Lee `recursos/datos/academia.json`, muestra los banners originales y permite buscar por nombre en todos los estudiantes, con 7 resultados por página. Los casilleros activos se ordenan por la fecha más reciente de sus sesiones publicadas; los empates y la ausencia de sesiones se resuelven por nombre.

Los banners de la portada se muestran completos, centrados y a escala del 75 % en ancho y alto, incluidos texto y adornos. Kenisa, Alejandrina, Raúl, Elyan, Andrés, José Pérez y Renata reutilizan el diseño, las proporciones y la adaptación móvil de la cabecera interior de su casillero mediante su propio `recursos/identidad.css`. La escala se aplica únicamente desde los estilos de la portada. Los demás conservan sus colores y símbolos con la misma reducción proporcional.

Cada sesión conserva su identidad, estructura, recursos, estilos y funciones. No existe un formato educativo genérico obligatorio. Solo se comparten recursos que ya tienen consumidores reales, documentados en `recursos/README.md`.

Los IDs técnicos se mantienen estables para conservar relaciones y progreso local; no definen agrupaciones ni carpetas intermedias. El nombre, ID y slug del casillero renombrado son `Ulises`, `ulises` y `ulises`.

Ejecuta `npm run catalogo` y `npm run validar` al actualizar metadatos. Para una sesión nueva: `npm run crear-sesion -- "Estudiante" "Título" [AAAA-MM-DD]`. No registres alumnos ni sesiones manualmente en los JSON generados.
