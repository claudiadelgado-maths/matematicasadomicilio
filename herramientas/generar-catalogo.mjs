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
  "maestro.json",
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

const publishedTeachers = (byType.maestro ?? []).filter((teacher) => teacher.estado === "activo");
const activeStudents = (byType.usuario ?? []).filter((student) => student.estado === "activo");
const publishedSessions = (byType.sesion ?? []).filter((session) => session.estado === "publicado");

const compareNames = (a, b) =>
  (a.nombreVisible ?? a.titulo).localeCompare(b.nombreVisible ?? b.titulo, "es");

const academic = {
  esquema: 1,
  generadoDesde: "maestro.json, usuario.json y sesion.json",
  maestros: publishedTeachers
    .map((teacher) => {
      const students = activeStudents
        .filter((student) => student.maestro === teacher.id)
        .map((student) => {
          const sessions = publishedSessions
            .filter((session) => session.usuario === student.id)
            .sort((a, b) => {
              const dateOrder = b.fecha.localeCompare(a.fecha, "es");
              return dateOrder !== 0 ? dateOrder : a.titulo.localeCompare(b.titulo, "es");
            })
            .map((session) => ({
              id: session.id,
              titulo: session.titulo,
              descripcion: session.descripcion,
              fecha: session.fecha,
              ruta: session.ruta,
            }));

          return {
            id: student.id,
            nombreVisible: student.nombreVisible,
            descripcion: student.descripcion,
            ruta: student.ruta,
            personalizacion: student.personalizacion ?? {},
            ultimaActividad: sessions[0]?.fecha ?? null,
            sesiones: sessions,
          };
        })
        .sort((a, b) => {
          if (a.ultimaActividad && b.ultimaActividad) {
            const activityOrder = b.ultimaActividad.localeCompare(a.ultimaActividad, "es");
            if (activityOrder !== 0) return activityOrder;
          } else if (a.ultimaActividad) return -1;
          else if (b.ultimaActividad) return 1;
          return compareNames(a, b);
        });

      return {
        id: teacher.id,
        nombreVisible: teacher.nombreVisible,
        rol: teacher.rol,
        titulo: teacher.titulo,
        descripcion: teacher.descripcion,
        sobre: teacher.sobre,
        metodologia: teacher.metodologia,
        estado: teacher.estado,
        ruta: teacher.ruta,
        imagen: teacher.imagen,
        imagenAlt: teacher.imagenAlt,
        banner: teacher.banner,
        ubicacion: teacher.ubicacion,
        disponibilidad: teacher.disponibilidad,
        precios: teacher.precios,
        alumnos: students,
      };
    })
    .sort(compareNames),
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
fs.writeFileSync(academicOutput, `${JSON.stringify(academic, null, 2)}\n`, "utf8");
console.log(
  `Catálogo generado: ${modules.length} módulos públicos y ${academic.maestros.length} maestro(s) activo(s).`,
);
