import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "recursos", "datos", "catalogo.json");
const academicOutput = path.join(root, "recursos", "datos", "academia.json");
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

const allModules = walk(root)
  .map((file) => {
    const data = JSON.parse(fs.readFileSync(file, "utf8"));
    return {
      ...data,
      archivoMetadatos: path.relative(root, file).replaceAll("\\", "/"),
    };
  })
  .sort((a, b) => a.ruta.localeCompare(b.ruta, "es"));

const hiddenStates = new Set(["plantilla", "borrador", "archivado", "inactivo"]);
const modules = allModules.filter((module) => !hiddenStates.has(module.estado));

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

const activeStudents = (byType.usuario ?? []).filter((student) => student.estado === "activo");
const publishedSessions = (byType.sesion ?? []).filter((session) => session.estado === "publicado");

const academic = {
  esquema: 2,
  generadoDesde: "usuario.json y sesion.json",
  alumnos: activeStudents.map((student) => {
    const sessions = publishedSessions
      .filter((session) => session.usuario === student.id)
      .sort((a, b) => b.fecha.localeCompare(a.fecha, "es") || a.titulo.localeCompare(b.titulo, "es"))
      .map(({ id, titulo, descripcion, fecha, ruta }) => ({ id, titulo, descripcion, fecha, ruta }));
    return {
      id: student.id,
      nombreVisible: student.nombreVisible,
      descripcion: student.descripcion,
      ruta: student.ruta,
      personalizacion: student.personalizacion ?? {},
      ultimaActividad: sessions[0]?.fecha ?? null,
      sesiones: sessions,
    };
  }).sort((a, b) =>
    (b.ultimaActividad ?? "").localeCompare(a.ultimaActividad ?? "", "es") ||
    a.nombreVisible.localeCompare(b.nombreVisible, "es") || a.id.localeCompare(b.id, "es")),
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
fs.writeFileSync(academicOutput, `${JSON.stringify(academic, null, 2)}\n`, "utf8");
console.log(
  `Catálogo generado: ${modules.length} módulos públicos y ${academic.alumnos.length} casillero(s) activo(s).`,
);
