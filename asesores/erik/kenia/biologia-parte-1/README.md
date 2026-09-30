# Biología parte 1

Sesión independiente de Kenia, del asesor Erik. Incluye un menú de inicio y la Actividad 1: **Partes de la célula animal**. La sesión puede ampliarse con más actividades; actualmente existe solo esta primera actividad. La fecha editorial se conserva en 2026-09-29.

Lee este README y sesion.json antes de trabajar, también si eres una IA.

## Estructura y contenido real

- index.html: presentación de la sesión, botón Comenzar y lista de actividades disponibles.
- estilos.css: composición exclusiva del menú.
- recursos/biologia.css: identidad local común al menú y a la actividad; revisar ambas páginas cuando cambie.
- recursos/celula-animal.svg: ilustración educativa vectorial de 680 × 820, común a las dos páginas. Membrana turquesa y organelos diferenciados por forma y color; revisar las coordenadas de los indicadores de la actividad cuando se modifique.
- ejercicios/partes-de-la-celula-animal/: Actividad 1, con su entrada, CSS, JavaScript, README y ejercicio.json. Banco vertical izquierdo, casillas con líneas resaltables y célula a la derecha; hasta 950 px, el dibujo queda arriba y las dos columnas de tarjetas debajo. Relaciona once nombres mediante arrastre, toque o teclado y evalúa cada colocación: verde/✓ para aciertos, rojo y tachita durante 1200 ms para errores. El rojo permanece hasta corregir; puntaje y barra se actualizan inmediatamente. Permite corregir, comprobar y reiniciar sin revelar soluciones.
- sesion.json declara únicamente ejercicios como componente disponible. No existen explicaciones, demostraciones, juegos ni calculadoras.

La lista del inicio se amplía añadiendo únicamente enlaces a actividades reales. La navegación final de la actividad 1 regresa al menú; Siguiente actividad permanece deshabilitado hasta que exista la actividad 2. No crear tarjetas o módulos futuros vacíos.

## Contrato que debes conservar

- No renombrar biologia-parte-1, index.html, estilos.css, sesion.json ni README.md.
- Conservar id = biologia-parte-1-kenia-erik; slug = biologia-parte-1; tipo = sesion; usuario = kenia-erik; ruta = /asesores/erik/kenia/biologia-parte-1/.
- Conservar estado = publicado para aparecer en el casillero. La sesión sigue en desarrollo, aunque su primera actividad ya está disponible.
- Conservar fecha editorial = 2026-09-29 hasta que el responsable de incorporación decida actualizarla.
- Mantener encabezado, logotipo, menú, pie, enlace de salto y main con id contenido. Las migas del inicio enlazan al alumno (../) y al asesor (../../).
- Mantener las referencias relativas a ../../../../recursos/css/base.css, ../../../../recursos/js/navegacion.js y ../../../../recursos/svg/ desde el inicio. Las páginas descendientes ajustan su profundidad. El script global genera los controles flotantes; no duplicarlos.
- Trabajar en esta carpeta. Actualizar descripción, objetivo, conocimientos previos y componentes según el contenido real; sincronizar este README.
- Sitio estático con JavaScript nativo, sin framework, dependencias de producción ni almacenamiento de respuestas.

## Entrega y sustitución

La carpeta completa biologia-parte-1 conserva su ubicación dentro de /asesores/erik/kenia/. No es una copia autónoma del sitio: utiliza los recursos globales documentados.

Los cambios se sirven directamente al recargar por HTTP. Para reflejar metadatos en el casillero, ejecutar desde la raíz npm run catalogo y npm run validar; no editar los índices derivados manualmente.

## Verificación

Abrir /asesores/erik/kenia/biologia-parte-1/ desde el servidor local. Revisar Inicio → Comenzar → Actividad 1 → Volver al inicio y el acceso directo desde la lista. Probar las once correspondencias, arrastre de escritorio, toques de móvil, teclado, respuestas vacías e incorrectas, reintentos, 11 / 11 y reinicio con nueva mezcla. Revisar las dos páginas en 360, 768, 1024 y 1440 px, menú con Escape, consola, enlaces al alumno y asesor y ausencia de desbordamiento horizontal.
