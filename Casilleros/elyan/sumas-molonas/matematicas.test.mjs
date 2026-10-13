import test from 'node:test';
import assert from 'node:assert/strict';
import { columnas, cumple, generar, validarPaso, descomponer, valorBilletes, cambioBilletes } from './matematicas.mjs';
import { elegirVoz } from './voz.mjs';

test('todas las parejas de dos y tres cifras conservan el valor posicional', () => {
  for (const cifras of [2, 3]) {
    const min = 10 ** (cifras - 1), max = 10 ** cifras;
    for (let a = min; a < max; a += 1) for (let b = min; b < max; b += 1) {
      const pasos = columnas(a, b, cifras);
      let resultado = 0, anterior = 0;
      for (const p of pasos) {
        assert.equal(p.entrada, anterior);
        assert.equal(p.total, p.izquierda + p.derecha + anterior);
        assert.equal(p.total, p.resultado + 10 * p.salida);
        assert.ok(p.resultado >= 0 && p.resultado <= 9);
        resultado += p.resultado * 10 ** p.posicion;
        anterior = p.salida;
      }
      assert.equal(resultado, a + b);
      assert.equal(anterior, 0);
    }
  }
});

test('valida cifras y llevadas, sin aceptar vacíos ni respuesta parcial', () => {
  const [unidades, decenas] = columnas(28, 17, 2);
  assert.equal(validarPaso(unidades, '5', '1'), true);
  for (const [valor, carry] of [['', '1'], ['5', ''], ['5', '0'], ['4', '1'], ['15', '1'], ['x', '1']]) {
    assert.equal(validarPaso(unidades, valor, carry), false);
  }
  assert.equal(validarPaso(decenas, '4'), true);
  assert.equal(validarPaso(decenas, '3'), false);
  assert.deepEqual(columnas(768, 594, 3).map(p => p.resultado), [2, 6, 3, 1]);
  const cero = columnas(10, 20, 2)[0];
  assert.equal(validarPaso(cero, ''), false);
  assert.equal(validarPaso(cero, '0'), true);
});

test('generación y reservas respetan cada dificultad y cambian la operación', () => {
  for (const cifras of [2, 3]) for (const nivel of ['none', 'one', 'many', ...(cifras === 3 ? ['thousand'] : [])]) {
    let anterior = '';
    for (let i = 0; i < 150; i += 1) {
      const { a, b } = generar(cifras, nivel, anterior);
      assert.ok(cumple(a, b, cifras, nivel));
      assert.notEqual(`${a}+${b}`, anterior);
      assert.ok(a >= 10 ** (cifras - 1) && a < 10 ** cifras);
      assert.ok(b >= 10 ** (cifras - 1) && b < 10 ** cifras);
      anterior = `${a}+${b}`;
    }
    const reserva = generar(cifras, nivel, '', () => 0);
    assert.ok(cumple(reserva.a, reserva.b, cifras, nivel));
    const otra = generar(cifras, nivel, `${reserva.a}+${reserva.b}`, () => 0);
    assert.notDeepEqual(reserva, otra);
    assert.ok(cumple(otra.a, otra.b, cifras, nivel));
  }
});

test('billetes: composición y equivalencias conservan todos los valores', () => {
  for (let n = 100; n < 1000; n += 1) assert.equal(valorBilletes(descomponer(n)), n);
  for (let orden = 0; orden <= 3; orden += 1) {
    for (let a = 1; a <= 9; a += 1) for (let b = 1; b <= 9; b += 1) {
      const cambio = cambioBilletes(a, b, orden);
      assert.equal(cambio.total, (a + b) * 10 ** orden);
      assert.equal(cambio.resto * 10 ** orden + cambio.superior * 10 ** (orden + 1), cambio.total);
      assert.ok(cambio.resto >= 0 && cambio.resto <= 9);
      assert.ok(cambio.superior === 0 || cambio.superior === 1);
    }
  }
  assert.deepEqual(cambioBilletes(7, 6, 0), { total: 13, resto: 3, superior: 1, orden: 0 });
  assert.equal(cambioBilletes(5, 5, 2).resto, 0);
});

test('voz: masculino español, síntesis local, fallback y lista vacía', () => {
  const female = { name: 'Microsoft Helena', lang: 'es-ES', localService: true };
  const natural = { name: 'Microsoft Alvaro Online (Natural)', lang: 'es-ES', localService: false };
  const robot = { name: 'Microsoft Pablo Desktop', lang: 'es-ES', localService: true };
  const mexican = { name: 'Microsoft Jorge', lang: 'es-MX', localService: true };
  assert.equal(elegirVoz([female, natural, robot]), robot);
  assert.equal(elegirVoz([female, natural]), natural);
  assert.equal(elegirVoz([female, mexican]), mexican);
  assert.equal(elegirVoz([female]), female);
  assert.equal(elegirVoz([female, { name: 'English male', lang: 'en-US' }]), female);
  assert.equal(elegirVoz([]), null);
  const unknown = { name: 'Voz del sistema', lang: 'en-US', default: true };
  assert.equal(elegirVoz([unknown]), unknown);
});
