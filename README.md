# Matemáticas a Domicilio

Sitio estático de Matemáticas a Domicilio: información del servicio, biblioteca educativa y espacios personalizados para alumnos. Está construido con HTML, CSS, JavaScript y SVG, sin framework, base de datos ni proceso de compilación obligatorio.

## Principios de la arquitectura

- **Módulos aislados:** cada tema, ejercicio, juego, calculadora, examen, usuario y sesión vive en una carpeta identificable.
- **Fuente directa:** todos los asesores viven en `asesores/`; cada alumno es una subcarpeta directa de su asesor y cada sesión una subcarpeta directa de su alumno.
- **URLs físicas:** la URL pública termina en `/` y corresponde directamente a una carpeta versionada con `index.html`.
- **Recursos locales:** cada página conserva junto a su `index.html` su propio `estilos.css`; la lógica y los estilos repetidos dentro de una misma familia se comparten desde el ancestro común más cercano.
- **Base global mínima:** solo la identidad, la estructura común, la navegación y los SVG de marca permanecen compartidos.
- **Componentes opcionales:** un tema o sesión solo anuncia los componentes que existen.
- **Publicación estática:** el resultado funciona en GitHub Pages, tanto en un dominio propio como bajo la ruta de un repositorio.

## Mapa principal

```text
/
├── index.html
├── estilos.css
├── nosotros/
│   ├── index.html
│   └── estilos.css
├── contacto/
│   ├── index.html
│   └── estilos.css
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
├── asesores/
│   ├── index.html
│   ├── recursos/js/
│   └── [asesor]/
│       ├── maestro.json
│       ├── index.html
│       ├── estilos.css
│       ├── recursos/
│       └── [alumno]/
│           ├── usuario.json
│           ├── index.html
│           ├── estilos.css
│           └── [sesion]/
│               ├── index.html
│               └── estilos.css
├── plantillas/
├── recursos/
│   ├── css/base.css
│   ├── js/navegacion.js
│   ├── svg/
│   └── datos/
├── documentacion/
└── herramientas/
```

El árbol detallado y las responsabilidades están en [documentacion/arquitectura.md](documentacion/arquitectura.md).

## Trabajar en una sola carpeta

Cada módulo concreto contiene:

- `index.html`: interfaz pública;
- `estilos.css`: estilos propios de esa página, obligatorio junto a cada `index.html`;
- `README.md`: objetivo, límites y pruebas del módulo;
- un JSON de metadatos;
- `script.js` cuando tiene interacción exclusiva; si el comportamiento es idéntico en una familia, se enlaza el recurso compartido de esa familia;
- `recursos/` solo cuando utiliza archivos exclusivos.

Una IA que reciba únicamente esa carpeta debe leer primero su `README.md` y su JSON. No debe cambiar rutas públicas. Para una modificación local, los únicos recursos externos que puede asumir son:

- `/recursos/css/base.css`, para la base realmente común;
- `/recursos/js/navegacion.js`;
- `/recursos/svg/` para la identidad general;
- un recurso compartido de su propia familia, cuando el `README.md` del módulo lo documente.

El diseño particular de una página, un asesor, un alumno o una sesión no se agrega a los archivos globales. Permanece en su carpeta o en un recurso compartido por su familia cuando la implementación es exactamente la misma; no se copia en cada descendiente.

## Desarrollo local

Genera los datos públicos y abre la raíz directamente con un servidor HTTP estándar:

```powershell
npm run catalogo
python -m http.server 8000
```

Después visita `http://localhost:8000/`. Las rutas funcionan porque `asesores/`, cada asesor, cada alumno y cada sesión existen físicamente en la rama. Abrir los archivos directamente con `file://` no representa correctamente la navegación de GitHub Pages.

## Comprobaciones

No hay dependencias de producción. Con Node.js disponible:

```powershell
npm run catalogo
npm run validar
```

`catalogo` reconstruye `recursos/datos/catalogo.json` y `recursos/datos/academia.json` desde los metadatos modulares. `validar` comprueba directamente la rama: JSON, relaciones académicas, rutas, archivos enlazados, identificadores repetidos y estructura básica.

La revisión completa también incluye:

1. escritorio y móvil, especialmente 360, 768, 1024 y 1440 px;
2. navegación por teclado y foco visible;
3. menú móvil y tecla `Escape`;
4. consola del navegador sin errores;
5. ejercicios, calculadoras y juegos;
6. PDF del examen;
7. ausencia de desplazamiento horizontal.

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

GitHub Pages publica directamente los archivos de `main`. No existe fase de construcción, servidor especial ni artefacto intermedio.

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
- [Crear un asesor](documentacion/creacion-de-asesores.md)
- [Crear un usuario](documentacion/creacion-de-usuarios.md)
- [Crear una sesión](documentacion/creacion-de-sesiones.md)
- [Gestión de asesores, alumnos y sesiones](documentacion/gestion-academica.md)
- [Publicación y validación](documentacion/publicacion.md)

## Datos globales sensibles al cambio

El número de WhatsApp visible es `999 129 34 97` y el enlace usa `529991293497`. El correo es `contacto@matematicasadomicilio.com`. Los precios, duración, modalidad, máximo de alumnos, ubicación y disponibilidad de cada asesor se administran técnicamente en su `maestro.json` y se muestran en Salones y en el perfil del asesor; no deben duplicarse manualmente en la portada.

El proyecto no debe presentar testimonios, credenciales, resultados, clientes, redes sociales ni servicios que no hayan sido confirmados.
