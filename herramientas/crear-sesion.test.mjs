import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { crearSesion } from "./crear-sesion.mjs";

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
function fixture(t) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "sesion-vanilla-test-"));
  t.after(() => {
    assert.equal(path.dirname(base), fs.realpathSync(os.tmpdir()));
    assert.ok(path.basename(base).startsWith("sesion-vanilla-test-"));
    fs.rmSync(base, { recursive: true });
  });
  fs.cpSync(path.join(repo, "plantillas/alumno/nueva-sesion"), path.join(base, "plantillas/alumno/nueva-sesion"), { recursive: true });
  const put = (file, data) => { const target = path.join(base, file); fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, JSON.stringify(data)); };
  put("asesores/erik/maestro.json", { id: "erik-estrella", slug: "erik", nombreVisible: "Erik", ruta: "/asesores/erik/", estado: "activo" });
  put("asesores/erik/andres/usuario.json", { id: "andres", slug: "andres", nombreVisible: "Andrés", maestro: "erik-estrella", ruta: "/asesores/erik/andres/", estado: "activo" });
  return { base, put };
}

test("crea la unidad mínima, resuelve acentos y conserva las rutas de integración", (t) => {
  const { base } = fixture(t);
  const dir = crearSesion(base, "Erik", "Andres", "Teorema de Tales", "2026-09-22");
  assert.deepEqual(fs.readdirSync(dir).sort(), ["README.md", "estilos.css", "index.html", "sesion.json"]);
  const data = JSON.parse(fs.readFileSync(path.join(dir, "sesion.json")));
  assert.equal(data.usuario, "andres"); assert.equal(data.estado, "publicado");
  assert.equal(data.ruta, "/asesores/erik/andres/teorema-de-tales/");
  assert.ok(Object.values(data.componentes).every((value) => value === false));
  const page = fs.readFileSync(path.join(dir, "index.html"), "utf8");
  assert.match(page, /href="\.\.\/\.\.\/\.\.\/\.\.\/recursos\/css\/base.css/);
  assert.match(page, /href="\.\.\/\.\.\/">Erik/);
  assert.match(page, /href="\.\.\/">Andrés/);
  assert.doesNotMatch(page, /Contenido de la sesión|Añade aquí|Nombre del/);
});

test("rechaza duplicados sin alterar la sesión entregada", (t) => {
  const { base } = fixture(t);
  const dir = crearSesion(base, "erik-estrella", "andres", "Teorema de Tales");
  const file = path.join(dir, "index.html"); fs.writeFileSync(file, "Trabajo del profesor");
  assert.throws(() => crearSesion(base, "Erik", "Andrés", "Teorema de Tales"), /ya existe/);
  assert.equal(fs.readFileSync(file, "utf8"), "Trabajo del profesor");
});

test("rechaza entradas inválidas y propietarios inexistentes sin crear carpetas", (t) => {
  const { base } = fixture(t);
  for (const title of ["", "...", "CON", "💡", "a\nb"]) assert.throws(() => crearSesion(base, "Erik", "Andres", title));
  assert.throws(() => crearSesion(base, "Erik", "Andres", "Nueva", "2026-02-30"), /Fecha/);
  assert.throws(() => crearSesion(base, "Otro", "Andres", "Nueva"), /no existe/);
  assert.throws(() => crearSesion(base, "Erik", "Otro", "Nueva"), /no existe/);
  assert.deepEqual(fs.readdirSync(path.join(base, "asesores/erik/andres")), ["usuario.json"]);
});

test("rechaza ambigüedad, propietarios inactivos, relaciones y rutas inconsistentes", (t) => {
  const { base, put } = fixture(t);
  put("asesores/otro/maestro.json", { id: "otro", nombreVisible: "Erik", estado: "activo" });
  assert.throws(() => crearSesion(base, "Erik", "andres", "Nueva"), /ambiguo/);
  put("asesores/erik/andres/usuario.json", { id: "andres", estado: "inactivo" });
  assert.throws(() => crearSesion(base, "erik-estrella", "andres", "Nueva"), /activo/);
  put("asesores/erik/andres/usuario.json", { id: "andres", estado: "activo", maestro: "otro" });
  assert.throws(() => crearSesion(base, "erik-estrella", "andres", "Nueva"), /no pertenece/);
  put("asesores/erik/andres/usuario.json", { id: "andres", estado: "activo", maestro: "erik-estrella", ruta: "/otra/" });
  assert.throws(() => crearSesion(base, "erik-estrella", "andres", "Nueva"), /ruta/);
});

test("rechaza un ID ocupado fuera del alumno y escapa el título en HTML", (t) => {
  const { base, put } = fixture(t);
  put("otro/sesion.json", { id: "nueva-andres" });
  assert.throws(() => crearSesion(base, "Erik", "Andres", "Nueva"), /ID ya registrado/);
  const dir = crearSesion(base, "Erik", "Andres", 'Ángulos <b> & "medidas"');
  const page = fs.readFileSync(path.join(dir, "index.html"), "utf8");
  assert.ok(page.includes("Ángulos &lt;b&gt; &amp; &quot;medidas&quot;"));
  assert.doesNotMatch(page, /<b>/);
});
