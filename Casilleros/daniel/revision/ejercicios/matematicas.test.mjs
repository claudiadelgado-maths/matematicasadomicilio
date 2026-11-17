import test from 'node:test';
import assert from 'node:assert/strict';
import { grade, equivalent, lineEquation, numeric } from './matematicas.mjs';

const correct = {
  suma: ['19/12'], resta: ['7/12'], producto: ['-3/5'], cociente: ['9/8'],
  simplificacion: ['3/4'], jerarquia: ['276'], lineal: ['5'], cuadratica: ['2', '5'],
  binomios: ['2x^2+5x-3'], monomio: ['6x^3-8x^2+10x'],
  'fracciones-algebraicas': ['(10x+4)/(3x(x+1))'],
  trapecio: ['32', '26'], triangulo: ['24', '24'], pentagono: ['61.9', '30'],
  cuadrado: ['49', '28'], rectangulo: ['45', '28'], circulo: ['25π', '10π'], recta: ['y=2x+1'],
};
for (const [id, answers] of Object.entries(correct)) {
  test(`${id}: respuesta correcta y respuesta equivocada`, () => {
    assert.equal(grade(id, answers).correct, true);
    assert.equal(grade(id, answers.map(() => '0')).correct, false);
  });
}
test('fracciones equivalentes sin simplificar; solo la simplificación exige irreducibilidad', () => {
  for (const [id, value] of Object.entries({ suma: '38/24', resta: '14/24', producto: '−6/10', cociente: '18/16' })) assert.equal(grade(id, [value]).correct, true);
  assert.equal(grade('simplificacion', ['6/8']).correct, false);
  assert.equal(grade('simplificacion', ['0.75']).correct, false);
  assert.equal(grade('simplificacion', ['-3/-4']).correct, true);
});
test('potencias, coma decimal y precedencia de signos', () => {
  assert.equal(numeric('-2^2', -4), true);
  assert.equal(numeric('(-2)²', 4), true);
  assert.equal(numeric('2^-2', '1/4'), true);
  assert.equal(numeric('1,125', '9/8'), true);
  assert.equal(numeric('-4{-3(2+5)-8×6}', 276), true);
});
test('raíces cuadráticas sin orden, sin duplicados ni una respuesta vacía', () => {
  assert.equal(grade('cuadratica', ['10/2', '4/2']).correct, true);
  assert.equal(grade('cuadratica', ['2', '2']).correct, false);
  assert.equal(grade('cuadratica', ['2', '']).status, 'blank');
});
test('equivalencia algebraica, coeficientes exactos y rechazo de errores pequeños', () => {
  assert.equal(grade('binomios', ['-3+5*x+2*x²']).correct, true);
  assert.equal(grade('monomio', ['10x-8x²+6x³']).correct, true);
  assert.equal(equivalent('2x^2+5x-2.9999999999', '2x^2+5x-3'), false);
  assert.equal(equivalent('(2x^2+5x-3)(x-2)/(x-2)', '2x^2+5x-3'), false);
});
test('el resultado debe resolver la consigna, no copiar el enunciado', () => {
  assert.equal(grade('suma', ['3/4+5/6']).correct, false);
  assert.equal(grade('jerarquia', ['-4{-3(2+5)-8*6}']).correct, false);
  assert.equal(grade('binomios', ['(2x-1)(x+3)']).correct, false);
  assert.equal(grade('monomio', ['2x(3x^2-4x+5)']).correct, false);
  assert.equal(grade('suma', ['(38)/(24)']).correct, true);
  assert.equal(grade('binomios', ['(4/2)x^2+(10/2)x-3']).correct, true);
});
test('fracción algebraica única y equivalente', () => {
  for (const value of ['(20x+8)/(6x^2+6x)', '(4+10*x)/(3*x*(1+x))', '((10x+4)/(3x²+3x))']) assert.equal(grade('fracciones-algebraicas', [value]).correct, true, value);
  assert.equal(grade('fracciones-algebraicas', ['2/(x+1)+4/(3x)']).correct, false);
  assert.equal(grade('fracciones-algebraicas', ['(6x+4)/(3x(x+1))']).correct, false);
});
test('dominio original: no añadir polos reales, aunque se cancelen', () => {
  const target = '(10x+4)/(3x(x+1))';
  for (const factor of ['x', '(x+1)', '(x^2+1)', '(x^2+2x+2)']) {
    assert.equal(equivalent(`(10x+4)*${factor}/(3x(x+1)*${factor})`, target, [0, -1]), true, factor);
  }
  for (const factor of ['(x-2)', '(x-2)^2', '(x^2-2)', '(x^2+2x-3)', '(x^4-1)']) {
    assert.equal(equivalent(`(10x+4)*${factor}/(3x(x+1)*${factor})`, target, [0, -1]), false, factor);
  }
  assert.equal(equivalent('(10x+4)/(3x(x+1))+0/(x-2)', target, [0, -1]), false);
});
test('rectas en formas general, explícita, punto-pendiente y despejando x', () => {
  for (const value of ['2x-y+1=0', '6x-3y=-3', 'y-3=2(x-1)', '(y-1)/2=x', 'x=(y-3)/2+1', 'y=2*x+1']) assert.equal(lineEquation(value), true, value);
  for (const value of ['y=2x-1', 'y=x+2', '0=0', 'x=1', '(y-2x-1)/(x-2)=0', '(y-2x-1)^2=0']) assert.equal(lineEquation(value), false, value);
});
test('redondeo de geometría y evaluación separada de área/perímetro', () => {
  assert.equal(grade('circulo', ['78,5', '31.4']).correct, true);
  assert.equal(grade('pentagono', ['61.9365', '30']).correct, true);
  assert.equal(grade('circulo', ['78.4', '31.4']).correct, false);
  assert.deepEqual(grade('cuadrado', ['49', '27']).checks, [true, false]);
});
test('entradas vacías, malformadas, enormes e intentos de ejecutar código', () => {
  assert.equal(grade('suma', ['   ']).status, 'blank');
  for (const value of ['1/0', 'x', '((19/12)', 'alert(1)', 'globalThis.x=1', '19/12;1', '2^999', '9'.repeat(181)]) assert.equal(grade('suma', [value]).status, 'invalid', value);
  assert.equal(grade('recta', ['2x+1']).status, 'invalid');
});
