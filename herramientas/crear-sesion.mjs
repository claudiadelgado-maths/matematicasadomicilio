import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const normalizar = (value) => String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
const slugValido = (value) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/.test(value);
const html = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const leer = (file) => JSON.parse(fs.readFileSync(file, "utf8"));

function entidades(directory, filename) {
  return fs.readdirSync(directory, { withFileTypes: true }).filter((entry) => entry.isDirectory())
    .map((entry) => path.join(directory, entry.name))
    .filter((dir) => fs.existsSync(path.join(dir, filename)))
    .map((dir) => ({ dir, data: leer(path.join(dir, filename)) }));
}

function elegir(items, name, tipo) {
  const matches = items.filter(({ data }) => [data.id, data.slug, data.nombreVisible, data.titulo]
    .some((value) => value && normalizar(value) === normalizar(name)));
  if (matches.length !== 1) throw new Error(`${tipo}: "${name}" no existe o es ambiguo; usa su ID o slug.`);
  if (matches[0].data.estado !== "activo") throw new Error(`${tipo}: debe estar activo.`);
  return matches[0];
}

export function crearSesion(base, asesor, alumno, titulo, fecha = new Date().toLocaleDateString("sv-SE")) {
  if (![asesor, alumno, titulo].every((value) => typeof value === "string" && value.trim())) throw new Error("Uso: npm run crear-sesion -- \"Erik\" \"Andres\" \"Título\" [AAAA-MM-DD]");
  titulo = titulo.trim();
  if (/[\x00-\x1f\x7f]/.test(titulo) || titulo.length > 160) throw new Error("Título inválido o demasiado largo (máximo 160 caracteres).");
  const slug = normalizar(titulo).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!slugValido(slug)) throw new Error("El título no produce un slug válido.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha) || Number.isNaN(Date.parse(`${fecha}T00:00:00Z`)) || new Date(`${fecha}T00:00:00Z`).toISOString().slice(0, 10) !== fecha) throw new Error("Fecha inválida; usa AAAA-MM-DD.");
  const teacher = elegir(entidades(path.join(base, "asesores"), "maestro.json"), asesor, "Asesor");
  const student = elegir(entidades(teacher.dir, "usuario.json"), alumno, "Alumno");
  if (student.data.maestro !== teacher.data.id) throw new Error("El alumno no pertenece al asesor.");
  for (const entity of [teacher, student]) {
    const rutaReal = `/${path.relative(base, entity.dir).replaceAll("\\", "/")}/`;
    if (entity.data.ruta !== rutaReal || !slugValido(entity.data.slug) || path.basename(entity.dir) !== entity.data.slug) throw new Error("La ruta de los metadatos no coincide con la carpeta.");
  }
  const destination = path.join(student.dir, slug);
  if (fs.existsSync(destination)) throw new Error(`La carpeta ya existe; no se sobrescribe: ${destination}`);
  const id = `${slug}-${student.data.id}`;
  const comprobarId = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if ([".git", "node_modules"].includes(entry.name)) continue;
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) comprobarId(file);
      else if (/^(tema|componente|ejercicio|juego|calculadora|examen|usuario|sesion|maestro)\.json$/.test(entry.name) && leer(file).id === id) throw new Error(`ID ya registrado: ${id}`);
    }
  };
  comprobarId(base);
  const template = path.join(base, "plantillas/alumno/nueva-sesion");
  let page = fs.readFileSync(path.join(template, "index.html"), "utf8");
  const sustituir = (original, replacement) => {
    if (!page.includes(original)) throw new Error(`La plantilla cambió; falta: ${original}`);
    page = page.replaceAll(original, () => replacement);
  };
  sustituir("../../../", "../../../../");
  sustituir("../../maestro/", "../../");
  sustituir("Nombre del asesor", html(teacher.data.nombreVisible));
  sustituir("Nombre del alumno", html(student.data.nombreVisible));
  sustituir("Descripción breve de la sesión.", "Sesión en preparación.");
  sustituir("Reemplaza esta introducción con el propósito real de la sesión.", "Sesión en preparación.");
  sustituir("Título de la sesión", html(titulo));
  page = page.replace(/<section class="user-module-section"[\s\S]*?<\/section>/, "<!-- Desarrolla el contenido de esta sesión aquí. -->");
  const data = { ...leer(path.join(template, "sesion.json")), id, slug, usuario: student.data.id,
    titulo, descripcion: "Sesión en preparación.", objetivo: "Pendiente de desarrollar por el profesor.",
    fecha, estado: "publicado", ruta: `${student.data.ruta}${slug}/` };
  const instructions = `# ${titulo}

Sesión independiente de ${student.data.nombreVisible}, del asesor ${teacher.data.nombreVisible}.
Estado actual: vanilla visible, sin contenido educativo ni componentes. La fecha editorial inicial es ${fecha}.
Lee este README y sesion.json antes de trabajar, también si eres una IA.

## Trabaja solamente en esta carpeta

- index.html es la entrada pública: desarrolla el contenido dentro de main, sustituyendo el aviso «Sesión en preparación».
- estilos.css contiene el diseño local y puede ampliarse libremente.
- Añade JavaScript, imágenes y recursos propios aquí cuando hagan falta; usa recursos/ para archivos exclusivos. No crees archivos ni secciones opcionales vacías.
- Puedes crear componentes en subcarpetas con index.html, estilos.css, README.md y sus metadatos según las convenciones del proyecto. Enlázalos desde esta sesión.
- Actualiza descripcion, objetivo, conocimientosPrevios y componentes en sesion.json para describir lo que realmente existe; sincroniza este README. Conserva titulo coherente con la página.

## Contrato que debes conservar

- No renombres la carpeta ${slug}, index.html, estilos.css, sesion.json ni README.md.
- No cambies estos campos de sesion.json: id = ${id}; slug = ${slug}; tipo = sesion; usuario = ${student.data.id}; ruta = ${data.ruta}.
- Conserva estado = publicado para que siga apareciendo en el alumno. Aquí publicado significa visible, aunque el contenido esté en preparación. No vuelvas a registrar la sesión.
- La fecha editorial la administra quien incorpora la versión; conserva ${fecha} hasta que esa persona decida actualizarla en este JSON.
- Conserva encabezado, logotipo, menú, pie, enlace de salto y main con id contenido; las migas enlazan al alumno (../) y al asesor (../../).
- Conserva las referencias relativas a ../../../../recursos/css/base.css, ../../../../recursos/js/navegacion.js y ../../../../recursos/svg/. El script global genera los controles flotantes: no los dupliques.
- No hay exports, props ni componentes de framework obligatorios. No requiere JavaScript propio ni imports de otros alumnos.
- No edites archivos fuera de esta carpeta. La carpeta utiliza recursos de la plataforma: por sí sola no es una copia autónoma del sitio.

## Entrega y sustitución

Devuelve la carpeta completa ${slug}, sin una carpeta adicional anidada. El responsable sustituye la carpeta en ${data.ruta} conservando nombre y ubicación.
Los cambios de HTML, CSS y recursos se sirven directamente al recargar por HTTP. Si hay caché, recarga sin caché; al publicar, sube los archivos actualizados.
Para reflejar también cambios de metadatos en las listas, el responsable ejecuta desde la raíz npm run catalogo y npm run validar. Estos comandos actualizan derivados automáticamente; no se edita ningún registro externo manualmente.

## Verificación de entrega

Abre la URL ${data.ruta} desde el servidor de la plataforma. Revisa móvil, escritorio, teclado, menú con Escape, consola, enlaces al alumno y al asesor y ausencia de desbordamiento horizontal. Comprueba que los componentes declarados existen y que no se anuncian componentes vacíos.
`;
  const styles = fs.readFileSync(path.join(template, "estilos.css"), "utf8").replace("plantillas/alumno/nueva-sesion/index.html", `${data.ruta.slice(1)}index.html`);
  fs.mkdirSync(destination); // Falla también ante una creación concurrente; nunca sobrescribe.
  fs.writeFileSync(path.join(destination, "index.html"), page);
  fs.writeFileSync(path.join(destination, "estilos.css"), styles);
  fs.writeFileSync(path.join(destination, "sesion.json"), `${JSON.stringify(data, null, 2)}\n`);
  fs.writeFileSync(path.join(destination, "README.md"), instructions);
  return destination;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.length < 5 || process.argv.length > 6) throw new Error('Uso: npm run crear-sesion -- "Asesor" "Alumno" "Título" [AAAA-MM-DD]');
    const destination = crearSesion(root, ...process.argv.slice(2));
    console.log(`Sesión creada: ${destination}`);
    for (const script of ["generar-catalogo.mjs", "validar-proyecto.mjs"]) execFileSync(process.execPath, [path.join(root, "herramientas", script)], { stdio: "inherit" });
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
