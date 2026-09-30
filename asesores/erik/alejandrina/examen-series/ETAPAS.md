# Registro de implementación — Examen series

Encargo íntegro: `ENCARGO.md`. Trabajar en orden, comprobar cada etapa antes de iniciar la siguiente y conservar sus archivos. El registro describe el avance de desarrollo, no calificaciones de la alumna.

| Etapa | Alcance | Estado |
|---|---|---|
| 1 | Menú e identificación | Completada: modelo, respuestas, LaTeX y móvil verificados |
| 2 | Hallar d o r, cuatro casos | Completada: 2.000 variantes, filtros, fracciones, raíces y móvil comprobados |
| 3 | Hallar a₁, tres casos | Completada: 1.200 variantes y desbloqueo d/r → a₁ comprobados |
| 4 | Hallar aₙ y n | Completada: 1.200 variantes, logaritmos, LaTeX y móvil comprobados |
| 5 | Sumas, cinco casos | Completada: 3.000 variantes, despejes y flujo de cuatro respuestas comprobados |
| 6 | Mini examen fijo de ejercicios | Completada: 31 preguntas fijas, soluciones, recorrido completo, repetición y filtros comprobados |
| 7 | Mini examen fijo de problemas aplicados | Pendiente |
| 8 | Medios aritméticos y geométricos | Pendiente |
| 9 | Revisión integral | Pendiente |

## Cómo retomar

**Pausa solicitada por el usuario el 30 de septiembre de 2026.** Detener el trabajo hasta que indique continuar. La siguiente etapa es la 7 (mini examen de problemas aplicados). Las etapas 1–6 están guardadas en el árbol de trabajo; no se ha publicado ni hecho commit.

Última verificación: `modelo.test.mjs` pasa sus 7 pruebas, incluidos miles de variantes generadas y el banco fijo contrastado con sucesiones de referencia. En navegador se completaron las 31 preguntas, se comprobó la pantalla final, la repetición y los filtros (16 aritméticas / 15 geométricas). Sin errores de consola. Las etapas anteriores se comprobaron también en ancho móvil de 360 px.

Al retomar: leer este registro y `ENCARGO.md`; implementar y verificar etapa 7, luego 8 (medios) y 9 (revisión integral). Actualizar el README del casillero con la sesión nueva. Al finalizar, ejecutar de nuevo `npm run catalogo` y `npm run validar`, pues la última generación global fue anterior a las actividades 2–6. El constructor local ya produjo las seis actividades y sus enlaces. Conservar los cambios existentes de Kenia y los demás cambios ajenos a esta sesión.

Leer README, ENCARGO y este registro. Continuar la primera etapa no completada. No volver a crear la sesión ni modificar sus IDs. Los archivos HTML ya funcionan por HTTP; `herramientas/construir.mjs` actualiza menú, enlaces, páginas y metadatos de las actividades registradas en `recursos/actividades.mjs`. No registrar módulos vacíos. Los generadores y pruebas crecen por etapa.

Comandos desde la raíz del repositorio:

```powershell
node asesores/erik/alejandrina/examen-series/herramientas/construir.mjs
node --test asesores/erik/alejandrina/examen-series/recursos/modelo.test.mjs
npm run catalogo
npm run validar
```

