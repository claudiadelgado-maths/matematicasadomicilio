import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ignoredDirectories = new Set([".git", "node_modules"]);
const metadataNames = new Set([
  "tema.json",
  "componente.json",
  "ejercicio.json",
  "juego.json",
  "calculadora.json",
  "examen.json",
  "usuario.json",
  "sesion.json",
]);
const errors = [];
const warnings = [];

const relative = (file) => path.relative(root, file).replaceAll("\\", "/");
const walk = (directory) => {
  const results = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignoredDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...walk(fullPath));
    else results.push(fullPath);
  }
  return results;
};

const files = walk(root);
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const metadataFiles = files.filter((file) => metadataNames.has(path.basename(file)));
const ids = new Map();
const metadata = [];

const reportError = (message) => errors.push(message);
const reportWarning = (message) => warnings.push(message);
const external = /^(?:[a-z]+:|\/\/|#)/i;

const validateLocalReference = (file, originalReference, context = "referencia") => {
  if (!originalReference || external.test(originalReference)) return;
  let reference = originalReference.split("#")[0].split("?")[0];
  if (!reference) return;
  try {
    reference = decodeURIComponent(reference);
  } catch {
    reportError(`${relative(file)}: URL no válida "${originalReference}".`);
    return;
  }
  const target = reference.startsWith("/")
    ? path.resolve(root, reference.replace(/^\/+/, ""))
    : path.resolve(path.dirname(file), reference);
  const expected =
    reference.endsWith("/") || (fs.existsSync(target) && fs.statSync(target).isDirectory())
      ? path.join(target, "index.html")
      : target;
  if (!fs.existsSync(expected)) {
    reportError(`${relative(file)}: ${context} inexistente "${originalReference}".`);
  }
};

for (const file of metadataFiles) {
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    reportError(`${relative(file)}: JSON inválido (${error.message}).`);
    continue;
  }
  metadata.push({ data, file });

  for (const key of ["id", "tipo", "titulo", "estado", "ruta"]) {
    if (!data[key]) reportError(`${relative(file)}: falta "${key}".`);
  }
  if (data.id) {
    if (ids.has(data.id)) {
      reportError(
        `ID repetido "${data.id}" en ${relative(file)} y ${relative(ids.get(data.id))}.`,
      );
    } else {
      ids.set(data.id, file);
    }
  }
  if (data.ruta) {
    const route = data.ruta.replace(/^\/+/, "");
    const routeIndex = path.join(root, route, "index.html");
    if (!fs.existsSync(routeIndex)) {
      reportError(`${relative(file)}: la ruta ${data.ruta} no tiene index.html.`);
    }
  }
  for (const required of ["README.md", "index.html"]) {
    const expected = path.join(path.dirname(file), required);
    if (!fs.existsSync(expected)) {
      reportError(`${relative(file)}: falta ${required} en el módulo.`);
    }
  }
  if (data.componentes && typeof data.componentes === "object") {
    for (const [component, available] of Object.entries(data.componentes)) {
      if (available && !fs.existsSync(path.join(path.dirname(file), component))) {
        reportError(
          `${relative(file)}: declara "${component}" disponible, pero no existe su carpeta.`,
        );
      }
    }
  }
}

const metadataById = new Map(metadata.filter(({ data }) => data.id).map(({ data }) => [data.id, data]));
const allowedStates = {
  usuario: new Set(["activo", "inactivo", "plantilla"]),
  sesion: new Set(["publicado", "borrador", "archivado", "plantilla"]),
};

for (const { data, file } of metadata) {
  const states = allowedStates[data.tipo];
  if (states && !states.has(data.estado)) {
    reportError(`${relative(file)}: estado "${data.estado}" no permitido para ${data.tipo}.`);
  }

  if (data.tipo === "usuario" && data.estado !== "plantilla") {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug ?? "")) {
      reportError(`${relative(file)}: el casillero necesita un slug válido sin espacios ni acentos.`);
    }
    const expectedRoute = `/Casilleros/${data.slug}/`;
    if (data.ruta !== expectedRoute || relative(path.dirname(file)) !== expectedRoute.slice(1, -1)) {
      reportError(`${relative(file)}: el casillero debe vivir directamente en ${expectedRoute}.`);
    }
    for (const key of ["acento", "fondo"]) {
      const color = data.personalizacion?.[key];
      if (color && !/^#[0-9a-f]{6}$/i.test(color)) {
        reportError(`${relative(file)}: color "${key}" inválido; usa #RRGGBB.`);
      }
    }
  }

  if (data.tipo === "sesion" && data.estado === "publicado") {
    const student = metadataById.get(data.usuario);
    if (!student || student.tipo !== "usuario") {
      reportError(`${relative(file)}: referencia al alumno inexistente "${data.usuario}".`);
    } else {
      if (student.estado !== "activo") {
        reportError(`${relative(file)}: el alumno "${data.usuario}" no está activo.`);
      }
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug ?? "")) {
        reportError(`${relative(file)}: la sesión necesita un slug válido sin espacios ni acentos.`);
      }
      const expectedRoute = `${student.ruta}${data.slug}/`;
      if (data.ruta !== expectedRoute) {
        reportError(`${relative(file)}: la ruta publicada debe ser ${expectedRoute}.`);
      }
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.fecha ?? "")) {
      reportError(`${relative(file)}: una sesión publicada necesita fecha YYYY-MM-DD.`);
    } else if (
      Number.isNaN(Date.parse(`${data.fecha}T00:00:00Z`)) ||
      new Date(`${data.fecha}T00:00:00Z`).toISOString().slice(0, 10) !== data.fecha
    ) {
      reportError(`${relative(file)}: fecha inválida "${data.fecha}".`);
    }
  }
}

for (const file of htmlFiles) {
  const source = fs.readFileSync(file, "utf8");
  const references = [...source.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)];
  for (const [, originalReference] of references) {
    validateLocalReference(file, originalReference);
  }

  const metaTags = [...source.matchAll(/<meta\b[^>]*>/gi)].map((match) => match[0]);
  for (const metaTag of metaTags) {
    if (!/http-equiv=["']refresh["']/i.test(metaTag)) continue;
    const content = metaTag.match(/\bcontent=["']([^"']+)["']/i)?.[1] ?? "";
    const target = content.match(/\burl\s*=\s*(.+)$/i)?.[1]?.trim();
    if (!target) reportError(`${relative(file)}: redirección sin URL.`);
    else validateLocalReference(file, target, "destino de redirección");
  }

  const htmlIds = [...source.matchAll(/\bid=["']([^"']+)["']/gi)].map((match) => match[1]);
  const seen = new Set();
  for (const id of htmlIds) {
    if (seen.has(id)) reportError(`${relative(file)}: id HTML repetido "${id}".`);
    seen.add(id);
  }

  if (!/<main\b/i.test(source) && !/http-equiv=["']refresh["']/i.test(source)) {
    reportWarning(`${relative(file)}: no contiene <main>.`);
  }
  if (/<img\b(?![^>]*\balt=)[^>]*>/i.test(source)) {
    reportError(`${relative(file)}: hay una imagen sin atributo alt.`);
  }
  if (/\bclass=["'][^"']*\b(?:whatsapp-float|back-to-top)\b/i.test(source)) {
    reportError(
      `${relative(file)}: los controles flotantes se generan desde recursos/js/navegacion.js; no los dupliques en el HTML.`,
    );
  }
}

const sharedStyle = path.join(root, "recursos", "css", "base.css");
const globalSelectors = [
  ".site-header",
  ".header-inner",
  ".brand",
  ".brand img",
  ".site-nav",
  ".nav-list",
  ".nav-list a",
  '.nav-list a[aria-current="page"]',
  ".menu-toggle",
  ".menu-toggle-lines",
  ".menu-toggle-lines::before",
  ".menu-toggle-lines::after",
  ".site-nav.is-open",
  ".nav-list li:last-child a",
  ".site-footer",
  ".site-footer .brand img",
  ".footer-grid",
  ".footer-brand p",
  ".footer-brand a",
  ".footer-nav",
  ".footer-nav a",
  ".footer-nav a:hover",
  ".footer-legal",
  ".footer-legal p",
  ".footer-copyright",
  ".footer-legal-links",
  ".footer-legal-links a",
  ".footer-location",
  ".back-to-top",
  ".whatsapp-float",
  ".back-to-top svg",
  ".whatsapp-float img",
];
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

for (const file of files.filter((item) => item.endsWith(".css"))) {
  const source = fs.readFileSync(file, "utf8");
  for (const [, cssReference] of source.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
    validateLocalReference(file, cssReference, "recurso CSS");
  }

  if (file !== sharedStyle) {
    for (const selector of globalSelectors) {
      const selectorPattern = new RegExp(
        `(?:^|[{},])\\s*${escapeRegExp(selector)}\\s*(?=[,{])`,
        "m",
      );
      if (selectorPattern.test(source)) {
        reportError(
          `${relative(file)}: repite el selector global "${selector}"; debe vivir solo en recursos/css/base.css.`,
        );
      }
    }
    if (/@(?:-webkit-)?keyframes\s+nav-panel-enter\b/i.test(source)) {
      reportError(
        `${relative(file)}: repite la animación global "nav-panel-enter".`,
      );
    }
  }

  const firstImport = source.search(/@import\b/i);
  const firstRule = source.search(/\{/);
  if (firstImport >= 0 && firstRule >= 0 && firstImport > firstRule) {
    reportError(`${relative(file)}: @import debe aparecer antes de cualquier regla CSS.`);
  }
}

for (const file of files.filter((item) => item.endsWith(".svg"))) {
  const source = fs.readFileSync(file, "utf8");
  if (!/<svg\b/i.test(source)) reportError(`${relative(file)}: no contiene un elemento <svg>.`);
  if (!/\bviewBox=["'][^"']+["']/i.test(source)) {
    reportError(`${relative(file)}: falta viewBox.`);
  }
}

for (const file of files.filter((item) => item.endsWith(".js"))) {
  try {
    new vm.Script(fs.readFileSync(file, "utf8"), { filename: relative(file) });
  } catch (error) {
    reportError(`${relative(file)}: JavaScript inválido (${error.message}).`);
  }
}

for (const file of files.filter((item) => /\.m?js$/.test(item))) {
  const source = fs.readFileSync(file, "utf8");
  const imports = [...source.matchAll(/(?:\bfrom\s+|\bimport\s*\(|\bimport\s+)["']([^"']+)["']/g)];
  for (const [, reference] of imports) {
    if (reference.startsWith(".")) validateLocalReference(file, reference, "importación");
    else if (!external.test(reference) && /\.m?js(?:[?#]|$)/.test(reference)) {
      reportError(`${relative(file)}: la importación local "${reference}" debe usar ./ o ../.`);
    }
  }
}

for (const warning of warnings) console.warn(`AVISO: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);

if (errors.length > 0) {
  console.error(`\nValidación fallida: ${errors.length} error(es), ${warnings.length} aviso(s).`);
  process.exitCode = 1;
} else {
  console.log(
    `Validación correcta: ${htmlFiles.length} HTML, ${metadataFiles.length} metadatos, ${warnings.length} aviso(s).`,
  );
}
