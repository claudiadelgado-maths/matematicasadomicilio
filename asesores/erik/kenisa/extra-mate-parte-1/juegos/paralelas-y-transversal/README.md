# Paralelas y transversal

Actividad 2 de Extra mate parte 1, KENISA → Erik. Ruta pública: `/asesores/erik/kenisa/extra-mate-parte-1/juegos/paralelas-y-transversal/`. Sigue a `../../ejercicios/clasifica-angulos/` y vuelve a `../../index.html`. Al final ofrece Continuar hacia `../triangulos/index.html`, la actividad 3.

## Aprender y explorar

Dos paralelas horizontales r y s, transversal t y ocho regiones numeradas. La franja indica el interior. En cada cruce los números avanzan en sentido antihorario desde el rayo horizontal derecho: arriba 1,2,3,4 y abajo 5,6,7,8. Los números identifican posiciones; no son medidas.

Tocar dos controles selecciona A y B y muestra nombre, explicación y ecuación numérica. Se puede quitar una selección, elegir otra pareja, mezclar y ocultar las medidas. Un deslizador de 40° a 140° cambia la inclinación real (medida de ∠1); incluye 90°, donde todos son iguales y suplementarios. El mapa desplegable explica las relaciones y sus sinónimos.

Las 28 parejas tienen respuesta: 4 opuestas por vértice, 8 pares lineales adyacentes, 4 correspondientes, 2 alternas internas, 2 alternas externas, 2 colaterales internas, 2 colaterales externas y 4 parejas indirectas. Estas últimas no reciben un nombre habitual directo: se justifica su suplemento mediante un correspondiente y un par lineal. No se confunde igualdad numérica con nombre de posición.

Referencia pedagógica: [Ángulos entre paralelas, Ministerio de Educación de Chile](https://www.curriculumnacional.cl/estudiante/621/articles-26277_recurso_pdf.pdf). Las reglas se aplican a rectas paralelas.

## Cuatro juegos

Cada juego genera 20 retos: cuatro rondas de cinco. Las etiquetas 1–8 se permutan en cada reto para observar posiciones geométricas sin memorizar parejas de números. Internamente el modelo usa las ocho regiones estables y el dibujo traduce sus etiquetas, referencias y feedback. Se puede cambiar de juego conservando el estado en memoria y crear series nuevas sin límite. No hay temporizador, sonido obligatorio ni almacenamiento persistente.

1. **Identifica la relación:** dos regiones A/B resaltadas, cuatro opciones mezcladas, una correcta. Cubre las siete relaciones habituales, con distintos pares e inclinaciones.
2. **Completa todos los ángulos:** un valor dado y siete campos numéricos vacíos directamente sobre el dibujo. La alumna escribe las medidas y confirma con Enter o al salir del campo. Cada acierto muestra ✅ y queda bloqueado; un error muestra ❌ y permite corregir. Incluye un reto de 90° en cada serie.
3. **Encuentra x:** un ángulo numérico y otro ax+b. El dibujo muestra la expresión completa, por ejemplo 3x o 2x+5, y un campo aparte para escribir la medida de esa región. La alumna ingresa y comprueba x sin seleccionar una ecuación. Desde el inicio puede apuntar numéricamente los otros siete ángulos, incluido el de la expresión. Al comprobar x correctamente, las medidas pendientes se completan automáticamente y se habilita Siguiente.
4. **Reto con x e y:** dos pares distintos de expresión/referencia numérica. Cada variable se resuelve exclusivamente con su propia referencia: dos ecuaciones lineales independientes, sin sistemas ni dependencia del resultado de la otra. Se ingresan y comprueban x e y en cualquier orden, sin preguntas para elegir ecuaciones. Las expresiones completas permanecen visibles en sus regiones y los seis campos de medidas están disponibles desde el inicio. El dibujo solo se completa automáticamente cuando x e y están comprobados y correctos; acertar uno solo no rellena ningún campo.

En los juegos algebraicos el par resaltado cambia al trabajar con la variable. La expresión real se conserva en el dibujo junto a su campo numérico, incluso después de resolver x o y; una etiqueta suelta de variable no sustituye a ax+b. Las medidas pueden escribirse directamente como apoyo. Al confirmar todas las variables correctas se rellenan los campos pendientes con las medidas reales de los ángulos, se corrigen los borradores o errores pendientes y se conservan las medidas ya aceptadas. Las marcas de error se limpian, pero los errores anteriores siguen contando para el puntaje al primer intento. El juego 2 mantiene la resolución manual de sus siete campos. Los campos vacíos no muestran signos de interrogación ni ofrecen tarjetas para elegir valores. La primera ronda usa coeficientes 2–4 y constantes pequeñas; las siguientes incorporan constantes positivas/negativas y coeficientes hasta 6. El generador construye expresiones a partir de medidas y soluciones enteras positivas, garantizando validez. Todas las medidas están entre 40° y 140° y el dibujo refleja la inclinación real.

## Reglas, avance y reinicio

Feedback inmediato con ✅/❌ y texto; nunca depende solo del color. Errores no bloquean el aprendizaje. El reto termina al acertar la relación o tener correctas las ocho medidas y, en los juegos algebraicos, las variables. Se pueden completar las medidas y resolver las variables en cualquier orden; en álgebra basta con confirmar correctamente x, o x e y según el juego, para que el dibujo se complete y el reto termine. Siguiente solo se habilita al cumplir todos los objetivos del reto. Cada ronda acaba con una celebración breve y un resumen; la serie completa muestra los 20 retos y el puntaje de retos al primer intento. Un reto no puede puntuar dos veces. Reintentar el mismo reto conserva el registro del error; Nueva serie/Intentar de nuevo genera problemas nuevos y reinicia ese juego. Cambiar de juego conserva los demás.

El explorador y el juego de relaciones usan ocho botones HTML superpuestos al SVG. Los juegos de medidas y álgebra usan campos numéricos accesibles en esas regiones, con áreas de interacción de al menos 44 px y foco visible. Tab recorre los controles; Enter confirma una medida y también se verifica al salir del campo. Los botones admiten Enter y Espacio. Estado anunciado con aria-live, foco en el título al avanzar y controles etiquetados. Los aciertos quedan bloqueados para evitar doble verificación o puntuación. Animación de celebración respeta movimiento reducido. Navegación, logotipo, pie y controles flotantes son los globales a seis niveles.

Los campos conservan el foco y los borradores mientras se escribe. No se penalizan vacíos ni cada dígito, y Enter seguido de salir del campo no registra dos veces el mismo error. Cambiar de juego conserva también entradas sin confirmar y marcas de error. El dibujo numérico usa cruces en y=140/360 y etiquetas a radio 82 dentro del mismo viewBox 500×500 para separar los campos móviles; sectores y transversal conservan sus medidas exactas.

## Archivos y pruebas

Entrada `index.html`, estilos locales `estilos.css`, controlador `script.mjs`, modelo puro `modelo.mjs`, pruebas `modelo.test.mjs`, `juego.json` y README. Reutiliza `../../recursos/geometria.css` sin modificarlo. No añade dependencias.

```powershell
node --test asesores/erik/kenisa/extra-mate-parte-1/juegos/paralelas-y-transversal/modelo.test.mjs
npm run catalogo
npm run validar
```

Las pruebas verifican las 28 parejas, dibujo/controles, 8000 problemas, cobertura de relaciones, ecuaciones independientes, soluciones, progreso y bloqueo de puntuación duplicada. Incluyen 600 retos completados escribiendo primero medidas y resolviendo y antes de x, borradores/vacíos sin penalización, coma decimal, errores sin duplicados, reintento y la distinción entre x=40 y el ángulo 3x=120°. También prueban autocompletado con dibujo vacío o parcial, errores y borradores pendientes, ambos órdenes x/y, ausencia de relleno al escribir sin confirmar o responder mal, avance, reinicio, medidas manuales del juego 2 y puntaje sin duplicados. Un barrido de 40° a 140° revisa la separación de los campos móviles. Verificar también que las expresiones completas coincidan con los datos de cada reto, que los campos estén vacíos y disponibles desde el inicio, que Enter y salir del campo den feedback correcto, que un error permita corregir y que un acierto quede bloqueado. Comprobar x e y en ambos órdenes, sin selección de ecuación; conservar los valores al cambiar de juego y no duplicar puntaje al repetir una confirmación. Revisar móvil/escritorio a 360,768,1024,1440 px, tacto, teclado, reintentos, cinco retos por ronda, cuatro rondas, nueva serie, foco, consola, navegación y enlaces.
