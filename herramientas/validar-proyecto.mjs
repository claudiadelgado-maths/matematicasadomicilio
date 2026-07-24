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
}

for (const file of files.filter((item) => item.endsWith(".css"))) {
  const source = fs.readFileSync(file, "utf8");
  for (const [, cssReference] of source.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
    validateLocalReference(file, cssReference, "recurso CSS");
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
