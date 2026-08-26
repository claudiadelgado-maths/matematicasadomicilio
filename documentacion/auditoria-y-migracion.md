# Auditoría, migración y decisiones

## Inventario original

La versión anterior concentraba el sitio en 18 páginas HTML de raíz, una hoja CSS de más de 5 000 líneas, tres scripts globales, seis SVG, una fotografía y un PDF.

Contenido educativo detectado:

- 2 temas;
- 2 ejercicios dinámicos;
- 2 calculadoras temáticas;
- 1 juego temático;
- 1 examen PDF;
- 2 usuarios;
- 1 sesión con explicación, ejercicio, calculadora y juego.

No se detectaron archivos idénticos antes de la migración. Sí existía acoplamiento: `recursos.js` y `usuarios.js` contenían varios módulos independientes en un mismo archivo.

## Correspondencia de rutas

| Ruta anterior | Ruta canónica nueva |
|---|---|
| `biblioteca.html` | `/biblioteca/` |
| `temas.html` | `/biblioteca/temas/` |
| `calculadoras.html` | `/biblioteca/calculadoras/` |
| `examen.html` | `/biblioteca/examenes/simulador-admision-universidad/` |
| `usuarios.html` | `/asesores/` |
| `jose.html` | `/asesores/erik/jose/` |
| `alejandrina.html` | `/asesores/erik/alejandrina/` |
| `datos-no-agrupados.html` | `/asesores/erik/alejandrina/datos-no-agrupados/` |
| `nosotros.html` | `/nosotros/` |
| `contacto.html` | `/contacto/` |
| `aviso-privacidad.html` | `/legal/aviso-de-privacidad/` |
| `terminos-condiciones.html` | `/legal/terminos-y-condiciones/` |
| `servicios.html` | `/#servicios` |

`ejercicios.html` y `juegos.html` ahora dirigen a los temas, porque los ejercicios y juegos pertenecen a un tema o sesión, no a una colección pública separada.

## Archivos reemplazados

- `assets/css/styles.css` → `recursos/css/base.css` y los `estilos.css` locales de cada página.
- `assets/js/main.js` → `recursos/js/navegacion.js`.
- `assets/js/recursos.js` → scripts locales de cinco módulos.
- `assets/js/usuarios.js` → scripts locales del usuario José y tres componentes de sesión.
- `assets/img/*` → `recursos/svg/*`.
- `admin.jpg` → `asesores/erik/recursos/admin.jpg`.
- `Simulador.pdf` → recursos exclusivos del módulo de examen.

Los originales se eliminaron después de verificar sus copias. Las páginas HTML antiguas no contienen la aplicación duplicada: son redirecciones pequeñas de compatibilidad.

## Decisiones técnicas

1. **Sin framework:** la escala actual no justifica una cadena de compilación.
2. **Índices escritos en HTML:** siguen siendo legibles y editables sin herramientas; el catálogo JSON sirve como fuente estructurada para automatización futura.
3. **CSS propiedad de cada página:** todo `index.html` conserva un `estilos.css` hermano; la base compartida contiene únicamente identidad y estructura universal. Esta separación permite copiar asesores y módulos completos sin arrastrar reglas ajenas.
4. **JavaScript por módulo:** un error en un juego no carga ni afecta otras páginas.
5. **Metadatos cercanos al contenido:** una IA aislada comprende objetivo, estado, ruta y relaciones.
6. **Rutas académicas directas:** los módulos viven en `asesores/[asesor]/[alumno]/[sesion]/`, sin carpetas intermedias llamadas `alumnos` o `sesiones`.
7. **PDF dentro del examen:** el módulo puede moverse o entregarse completo.
8. **Sin carpetas opcionales vacías:** la estructura pública describe solo recursos reales.
9. **Catálogo determinista:** se regenera sin fecha variable para evitar cambios innecesarios en cada commit.
10. **Validación sin dependencias:** puede ejecutarse con Node.js en cualquier clon del repositorio.
