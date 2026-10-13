import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

test("catálogo plano: actividad publicada, desempates, estados y generación determinista", (t) => {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "catalogo-test-"));
  t.after(() => {
    assert.equal(path.dirname(base), fs.realpathSync(os.tmpdir()));
    assert.ok(path.basename(base).startsWith("catalogo-test-"));
    fs.rmSync(base, { recursive: true });
  });
  const script = path.join(base, "herramientas/generar-catalogo.mjs");
  fs.mkdirSync(path.dirname(script));
  fs.copyFileSync(fileURLToPath(new URL("./generar-catalogo.mjs", import.meta.url)), script);
  const put = (file, data) => {
    const target = path.join(base, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, JSON.stringify(data));
  };
  for (const [id, nombreVisible, estado] of [["ana", "Ana", "activo"], ["bea", "Béa", "activo"], ["zoe", "Zoé", "activo"], ["sin-sesiones", "Sin sesiones", "activo"], ["oculto", "Oculto", "inactivo"]]) {
    put(`Casilleros/${id}/usuario.json`, { id, tipo: "usuario", nombreVisible, estado, ruta: `/Casilleros/${id}/`, personalizacion: { simbolo: nombreVisible[0] } });
  }
  for (const [usuario, id, fecha, estado, titulo] of [
    ["ana", "antigua", "2026-09-01", "publicado", "Antigua"],
    ["ana", "borrador", "2026-12-01", "borrador", "Borrador"],
    ["bea", "segunda", "2026-10-01", "publicado", "Zeta"],
    ["bea", "primera", "2026-10-01", "publicado", "Alfa"],
    ["zoe", "reciente", "2026-10-01", "publicado", "Reciente"],
    ["zoe", "archivada", "2026-12-01", "archivado", "Archivada"],
  ]) put(`Casilleros/${usuario}/${id}/sesion.json`, { id, tipo: "sesion", usuario, fecha, estado, titulo, ruta: `/Casilleros/${usuario}/${id}/` });

  execFileSync(process.execPath, [script]);
  const output = path.join(base, "recursos/datos/academia.json");
  const original = fs.readFileSync(output, "utf8");
  const academic = JSON.parse(original);
  assert.deepEqual(Object.keys(academic), ["esquema", "generadoDesde", "alumnos"]);
  assert.deepEqual(academic.alumnos.map((student) => student.id), ["bea", "zoe", "ana", "sin-sesiones"]);
  assert.deepEqual(academic.alumnos[0].sesiones.map((session) => session.titulo), ["Alfa", "Zeta"]);
  assert.equal(academic.alumnos[0].personalizacion.simbolo, "B");
  assert.equal(academic.alumnos.at(-1).ultimaActividad, null);
  assert.equal(academic.alumnos.at(-1).sesiones.length, 0);
  const catalog = JSON.parse(fs.readFileSync(path.join(base, "recursos/datos/catalogo.json")));
  assert.equal(catalog.total, 8);
  execFileSync(process.execPath, [script]);
  assert.equal(fs.readFileSync(output, "utf8"), original);
});
