# Revisión

Primera sesión de Daniel. Diagnóstico inicial de conocimientos matemáticos en aritmética, álgebra y geometría, con duración aproximada de **2 h 30 min**. Fecha editorial: **2026-11-04**.

## Recorrido

- `index.html`: portada con título, propósito, duración, tres áreas y botón para comenzar.
- `ejercicios/`: las tres actividades con 18 ejercicios independientes y 25 campos de respuesta; comprobación matemática y resumen por área.

Diseño minimalista y neutral. No hay teoría, pistas, procedimientos, respuestas reveladas, juegos ni calculadoras. Los resultados indican únicamente corrección o falta de respuesta. El resumen cuenta ejercicios respondidos y correctos, sin inferir un nivel académico.

La sesión usa estilos propios, `../recursos/comun.css` y la estructura global del sitio (base, navegación y SVG de marca). No requiere paquetes, fuentes remotas, KaTeX ni servicios externos. Las expresiones se presentan mediante MathML nativo y las figuras mediante SVG local en el HTML.

## Persistencia

Las actividades almacenan respuestas y última área visitada en la clave local `daniel-revision-v1`. No existe transmisión de respuestas ni sincronización entre dispositivos. Si falla el almacenamiento, la página permite seguir trabajando y comunica que debe mantenerse abierta.

## Validación

Desde la raíz:

```powershell
node --test Casilleros/daniel/revision/ejercicios/matematicas.test.mjs
npm run catalogo
npm run validar
```

Revisar la portada, acceso desde el casillero, recorrido entre áreas, persistencia tras recargar, comprobaciones y resumen; anchos de 360, 768, 1024 y 1440 px, teclado, consola, enlaces y ausencia de desbordamiento horizontal. El contrato matemático se documenta en `ejercicios/README.md`.
