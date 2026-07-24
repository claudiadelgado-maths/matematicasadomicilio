import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "recursos", "datos", "catalogo.json");
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

const walk = (directory) => {
  const results = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) results.push(...walk(fullPath));
    else if (metadataNames.has(entry.name)) results.push(fullPath);
  }
  return results;
};

const modules = walk(root)
  .map((file) => {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return {
      ...data,
      archivoMetadatos: path.relative(root, file).replaceAll("\\", "/"),
    };
  })
  .sort((a, b) => a.ruta.localeCompare(b.ruta, "es"));

const byType = {};
for (const module of modules) {
  if (!byType[module.tipo]) byType[module.tipo] = [];
  byType[module.tipo].push(module);
}

const catalog = {
  esquema: 1,
  generadoDesde: "metadatos locales",
  total: modules.length,
  tipos: byType,
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`Catálogo generado: ${modules.length} módulos.`);
