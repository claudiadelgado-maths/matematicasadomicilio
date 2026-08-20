# Matemáticas a Domicilio

Sitio estático de Matemáticas a Domicilio: información del servicio, biblioteca educativa y espacios personalizados para alumnos. Está construido con HTML, CSS, JavaScript y SVG, sin framework, base de datos ni proceso de compilación obligatorio.

## Principios de la arquitectura

- **Módulos aislados:** cada tema, ejercicio, juego, calculadora, examen, usuario y sesión vive en una carpeta identificable.
- **URLs limpias:** la URL pública de un módulo termina en `/` y corresponde a un directorio con `index.html`.
- **Recursos equilibrados:** navegación e identidad visual son compartidas; la lógica educativa permanece dentro de cada módulo.
- **Componentes opcionales:** un tema o sesión solo anuncia los componentes que existen.
- **Compatibilidad:** las antiguas páginas `.html` redirigen a sus nuevas rutas mientras se conservan enlaces externos.
- **Publicación estática:** el resultado funciona en GitHub Pages, tanto en un dominio propio como bajo la ruta de un repositorio.

## Mapa principal

```text
/
├── index.html
├── nosotros/
├── contacto/
├── legal/
├── biblioteca/
│   ├── temas/
│   │   └── [tema]/
│   │       ├── explicacion/
│   │       ├── ejercicios/[ejercicio]/
│   │       ├── juegos/[juego]/
│   │       └── calculadoras/[calculadora]/
│   ├── calculadoras/
│   └── examenes/[examen]/
├── usuarios/
│   └── index.html (catálogo de salones)
├── [asesor]/
│   ├── maestro.json
│   ├── index.html
│   └── [alumno]/
│       ├── usuario.json
│       └── [sesion]/
├── plantillas/
│   ├── maestro/
│   ├── alumno/
│   └── sesion/
├── recursos/
│   ├── css/
│   ├── js/
│   ├── svg/
│   ├── imagenes/
│   └── datos/
├── documentacion/
├── herramientas/
└── páginas antiguas .html (redirecciones)
```

El árbol detallado y las responsabilidades están en [documentacion/arquitectura.md](documentacion/arquitectura.md).

## Trabajar en una sola carpeta

Cada módulo concreto contiene:

- `index.html`: interfaz pública;
- `README.md`: objetivo, límites y pruebas del módulo;
- un JSON de metadatos;
- `estilos.css` cuando necesita estilos propios;
- `script.js` cuando tiene interacción;
- `recursos/` solo cuando utiliza archivos exclusivos.

Una IA que reciba únicamente esa carpeta debe leer primero su `README.md` y su JSON. No debe cambiar rutas públicas ni copiar dentro del módulo el sistema global. Para una modificación local, los únicos recursos externos que debe asumir son:

- `/recursos/css/sistema-visual.css`;
- `/recursos/css/modulos.css`;
- `/recursos/js/navegacion.js`;
- `/recursos/svg/` para la identidad general.

## Desarrollo local

Abrir el sitio mediante un servidor HTTP permite comprobar las rutas limpias:

```powershell
python -m http.server 8000
```

Después visita `http://localhost:8000/`. Abrir los archivos directamente con `file://` no representa correctamente la navegación de GitHub Pages.

## Comprobaciones

No hay dependencias de producción. Con Node.js disponible:

```powershell
npm run catalogo
npm run validar
```

`catalogo` reconstruye `recursos/datos/catalogo.json` desde los metadatos. `validar` comprueba JSON, rutas internas, archivos enlazados, identificadores repetidos y estructura básica.

La revisión completa también incluye:

1. escritorio y móvil, especialmente 360, 768, 1024 y 1440 px;
2. navegación por teclado y foco visible;
3. menú móvil y tecla `Escape`;
4. consola del navegador sin errores;
5. ejercicios, calculadoras y juegos;
6. PDF del examen;
7. redirecciones heredadas;
8. ausencia de desplazamiento horizontal.

## Publicación diaria con un solo commit

1. Trabaja todos los cambios del día.
2. Ejecuta `npm run catalogo`.
3. Ejecuta `npm run validar`.
4. Revisa el sitio localmente en móvil y escritorio.
5. Consulta `git status` y confirma que el lote contiene solo cambios intencionales.
6. Crea un único commit descriptivo, por ejemplo:

   ```powershell
   git add .
   git commit -m "Actualiza recursos educativos del 23 de julio"
   git push
   ```

GitHub Pages publica directamente los archivos de la rama configurada. No se debe añadir una fase de servidor o compilación sin documentar y justificar el cambio.

## Guías

- [Arquitectura](documentacion/arquitectura.md)
- [Auditoría, migración y decisiones](documentacion/auditoria-y-migracion.md)
- [Sistema visual](documentacion/estilo-visual.md)
- [Estándares técnicos](documentacion/estandares-tecnicos.md)
- [Crear un tema](documentacion/creacion-de-temas.md)
- [Crear una explicación o demostración](documentacion/creacion-de-explicaciones.md)
- [Crear un ejercicio](documentacion/creacion-de-ejercicios.md)
- [Crear un juego](documentacion/creacion-de-juegos.md)
- [Crear una calculadora](documentacion/creacion-de-calculadoras.md)
- [Crear un examen](documentacion/creacion-de-examenes.md)
- [Crear un asesor](documentacion/creacion-de-maestros.md)
- [Crear un usuario](documentacion/creacion-de-usuarios.md)
- [Crear una sesión](documentacion/creacion-de-sesiones.md)
- [Gestión de asesores, alumnos y sesiones](documentacion/gestion-academica.md)
- [Publicación y validación](documentacion/publicacion.md)

## Datos globales sensibles al cambio

El número de WhatsApp visible es `999 129 34 97` y el enlace usa `529991293497`. El correo es `contacto@matematicasadomicilio.com`. Los precios, duración, modalidad, máximo de alumnos, ubicación y disponibilidad de cada asesor se administran técnicamente en su `maestro.json` y se publican mediante `npm run catalogo`; no deben duplicarse manualmente en la portada.

El proyecto no debe presentar testimonios, credenciales, resultados, clientes, redes sociales ni servicios que no hayan sido confirmados.
