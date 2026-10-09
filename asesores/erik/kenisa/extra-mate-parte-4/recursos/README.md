# Recursos de los laboratorios de triángulos

Familia local de Extra mate parte 4. Consumidores: juegos/triangulos-semejantes/, juegos/triangulos-congruentes/ y juegos/mini-examen/. Mini examen utiliza aritmética, geometría y CSS; tiene su propia interfaz de opciones y estado de evaluación. No son recursos globales ni deben importarse desde otras sesiones.

- matematicas-triangulos.mjs: fracciones racionales, lectura de respuestas equivalentes, construcción geométrica, etiquetas y fábrica de estado/corrección. Cada actividad aporta sus propios casos, opciones y generador.
- figuras-triangulos.mjs: renderer SVG con vértices, lados, ángulos, etiquetas y transformación. pareja(triangulos, mismaEscala) conserva una escala común cuando el argumento es true. Semejanza usa escala independiente en prácticas para legibilidad y común en criterios; congruencia usa común en ambos. Mini examen usa escala común en las preguntas de relación entre triángulos.
- practicas-triangulos.mjs (solo semejanza y congruencia): tres modos de práctica, selectores, pistas, respuestas, reintentos, feedback temporal, solución, progreso y navegación por hash. iniciarPracticas recibe el modelo de la actividad y opciones para el símbolo de no correspondencia y la escala visual.
- laboratorio-triangulos.css: diseño compartido de pestañas, figuras, criterios y prácticas bajo el contenedor triangle-lab. Las animaciones específicas de congruencia permanecen en su módulo.

Sin dependencias adicionales ni almacenamiento. Al editar, ejecutar los modelo.test.mjs de los consumidores afectados y revisar su interfaz, teclado, móvil, consola y navegación. La aritmética, SVG y CSS tienen tres consumidores; practicas-triangulos.mjs conserva dos. Los módulos documentan su contrato de datos y sus diferencias pedagógicas. Mantener las versiones de imports y estilos coherentes si se modifica un recurso.
