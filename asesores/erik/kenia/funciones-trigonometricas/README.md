# Funciones trigonométricas

Sesión publicada de Kenia, del asesor Erik. Actualizada el 2026-09-23. Explica y practica las seis razones respecto de un ángulo agudo de un triángulo rectángulo. No estudia todavía la circunferencia unitaria.

## Recorrido real

1. index.html: introducción breve, triángulo con dos catetos e hipotenusa y menú.
2. ejercicios/identifica-lados/: tres niveles con rotaciones de 0°, 105° y 220°. Tres tarjetas individuales; los catetos son intercambiables. Las tres posiciones deben ser correctas para avanzar.
3. explicacion/angulo-de-referencia/: cambiar entre los dos ángulos agudos intercambia C.O. y C.A.; H. no cambia.
4. explicacion/seno/, coseno/, tangente/, cotangente/, secante/, cosecante/: una página por función, fórmula LaTeX y un ejercicio numérico con numerador y denominador. Acepta fracciones equivalentes; rechaza vacíos, decimales y denominador cero. La respuesta correcta habilita continuar. Otro triángulo reinicia ese ejercicio.
5. ejercicios/integrador/: seis funciones en orden sin, cos, tan, cot, sec, csc en una única columna, dos casillas apiladas por función, exactamente doce. Tarjetas C.O., C.A. y H. reutilizables. Entregar aparece cuando están llenas las doce; solo doce respuestas correctas muestran «Sesión completada». Editar una respuesta invalida esa confirmación hasta volver a entregar.

6. juegos/consultorio-trigonometrico/: juego con 18 pacientes y tres niveles sucesivos: emojis, números y decimales. Seis casos aleatorios sin repetición de funciones por nivel. Sin castigos por errores y con reinicio al terminar.

## Contrato matemático

Seno = C.O./H.; coseno = C.A./H.; tangente = C.O./C.A.; cotangente = C.A./C.O.; secante = H./C.A.; cosecante = H./C.O. Los lados son positivos y el ángulo de referencia es agudo. C es el vértice recto; AB es siempre la hipotenusa. Las figuras se rotan y escalan sin deformarse. Los ejemplos usan ternas pitagóricas reales. La comparación de fracciones se realiza por productos cruzados con BigInt.

## Archivos y dependencias

- recursos/modelo.mjs: razones, ternas, comprobaciones puras y geometría.
- recursos/sesion.mjs: SVG, actividades, arrastre por Pointer Events y alternativa clic/teclado.
- recursos/sesion.css: diseño compartido exclusivo de esta sesión. Cada página conserva su estilos.css.
- recursos/modelo.test.mjs: pruebas con Node, sin paquetes externos.
- KaTeX 0.18.1 desde el CDN ya empleado en la plataforma; CSS base, navegación y SVG de marca mediante rutas relativas. Las actividades necesitan JavaScript; sin conexión al CDN se conserva LaTeX como texto.

No hay servidor de calificaciones, almacenamiento local ni envío de datos: Entregar valida la actividad en el navegador actual. Recargar reinicia el ejercicio. El menú permite repasar cualquier página; la entrega final comprueba sus doce casillas y no certifica haber recorrido las páginas anteriores.

## Edición y reemplazo de esta carpeta

Todo lo específico está aquí. Conserva carpeta funciones-trigonometricas, entrada index.html, estilos.css, sesion.json y README.md. No cambies id = funciones-trigonometricas-kenia-erik, slug = funciones-trigonometricas, tipo = sesion, usuario = kenia-erik ni ruta = /asesores/erik/kenia/funciones-trigonometricas/. Conserva estado publicado para aparecer en el casillero.

Puedes editar contenidos, estilos y recursos locales, sincronizando JSON y README. Conserva encabezado, pie, menú, marca, enlace de salto y navegación anterior/inicio/continuar. No dupliques controles flotantes. Cada página usa rutas relativas según su profundidad. No edites archivos externos para desarrollar la sesión. Sustituye la carpeta completa en su ubicación; ejecuta npm run catalogo y npm run validar desde la raíz para actualizar sus metadatos derivados sin registros manuales.

## Pruebas

Desde la raíz: node --test asesores/erik/kenia/funciones-trigonometricas/recursos/modelo.test.mjs. Comprueba los tres niveles, intercambio de catetos, mover una tarjeta ya utilizada, selección con teclado, arrastre real, cambio de ángulo, fracciones equivalentes/incorrectas/vacías/cero, nuevo ejemplo y reinicio. En el integrador confirma exactamente doce casillas, tarjetas reutilizables, entrega oculta si incompleto, errores corregibles y éxito solo con doce aciertos. Revisa 360, 768, 1024 y 1440 px, consola y enlaces.
