# Electricidad 1 — avance y continuidad

Solicitud: attachment a4fb0e92-9968-4151-b329-01ed649b46d3/pasted-text.txt y tabla explícita del usuario (21 filas, yotta a yocto y sin prefijo).

## Decisiones
- Renombrar lo visible a Electricidad 1 conservando la URL y el ID existentes para no romper enlaces.
- Doce páginas: introducción; prefijos; voltaje; corriente; carga; tiempo; resistencia; potencia; frecuencia; capacitancia; inductancia; conversor.
- Fondo azul eléctrico muy claro, lienzo abierto, controles nativos accesibles, LaTeX y feedback coherentes.
- Prefijos con símbolo μ y mayúsculas exactas. Tabla decimal completa, tarjetas compactas. Prioridad de generación M,k,sin prefijo,m,μ,n,p.
- Conversión decimal precisa usando enteros BigInt/racionales, sin redondeos binarios visibles. Minutos solo para tiempo.
- Actividades y estado locales, sin registro ni dependencia nueva.

## Estado
- [x] Leer solicitud y documentación local.
- [x] Crear datos SI, motor de conversiones y pruebas (completadas).
- [x] Crear estructura de doce páginas y navegación.
- [x] Implementar ruleta y tarjetas de prefijos.
- [x] Implementar las nueve actividades de magnitudes.
- [x] Implementar conversor final.
- [x] Revisar móvil, escritorio, teclado, consola, enlaces y casos matemáticos.
- [x] Sincronizar README/JSON y ejecutar npm run catalogo y npm run validar.

## Cómo retomar
Leer este archivo, README.md de la sesión y los archivos ya creados; no reiniciar el trabajo ni descartar otros cambios de Raúl. El estado se actualizará al cerrar cada bloque.

## Ampliación solicitada durante la revisión
- [x] Retirar migas y menú Temas de Electricidad 1 de las doce páginas.
- [x] Reescribir ocho preguntas de ruleta con situaciones cotidianas y respuestas completas.
- [x] Añadir doce ejemplos de vida diaria con ilustraciones SVG, equivalencia o idea principal y pregunta con explicación.
- [x] Verificar conversor y diseños finales en móvil/escritorio.

## Cierre verificado

- Doce páginas implementadas y recorrido completo probado en navegador.
- Todas las actividades comprobadas: ocho preguntas sin repetición y reinicio durante giro; prefijos con teclado y arrastre real en viewport móvil; medidor con teclado; flujo y pausa; carga incorrecta/correcta; tiempo con Enter; cables; potencia; frecuencia y pausa; capacitores con arrastre real; sopa resuelta por extremos y teclado.
- Conversor probado: 150 mA=0.15 A, 20 μF=20000 nF, 30 min=1800 s, 1 s en minutos periódico, M frente a m, yotta→yocto, texto inválido, cambio de magnitud y exclusión de minutos fuera de tiempo. Pruebas automáticas de todos los pares de prefijos, exactitud racional, valores extremos y miles de rondas.
- Doce páginas revisadas a 360, 768 y 1440 px: sin menú interno ni migas, con ejemplo cotidiano y sin errores KaTeX. Se corrigió el desbordamiento de las instrucciones de corriente y potencia en 360 px y se volvieron a verificar.
- Consola sin errores. Se corrigieron también los destinos globales Salones de los módulos internos.
- README y metadatos sincronizados. Validación de proyecto y catálogo ejecutados.

No quedan contenidos de esta solicitud pendientes. La sesión conserva su URL histórica `fisica-parte-1`, pero se presenta como Electricidad 1.
