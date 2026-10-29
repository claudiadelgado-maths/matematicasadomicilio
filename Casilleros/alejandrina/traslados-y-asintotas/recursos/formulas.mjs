import { FAMILIES, polynomialText, fraction, trim } from './modelo.mjs';
const number = n => `<mn>${n}</mn>`;
export function polynomialMath(p) {
  const terms = trim(p).map((c,i)=>({c,i})).reverse().filter(t=>t.c!==0);
  return `<mrow>${terms.map(({c,i},j)=>`${c<0?'<mo>−</mo>':j?'<mo>+</mo>':''}${i&&Math.abs(c)===1?'':number(Math.abs(c))}${i?(i===1?'<mi>x</mi>':`<msup><mi>x</mi>${number(i)}</msup>`):''}`).join('')||number(0)}</mrow>`;
}
export function rationalMath(q) {
  return `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="f de x igual a ${polynomialText(q.numerator)} dividido entre ${polynomialText(q.denominator)}"><mrow><mi>f</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo><mfrac>${polynomialMath(q.numerator)}${polynomialMath(q.denominator)}</mfrac></mrow></math>`;
}
export function translationMath(q, name = 'g') {
  const family = FAMILIES[q.family];
  const inside = `<mrow><mi>x</mi>${q.h?`<mo>${q.h>0?'−':'+'}</mo>${number(Math.abs(q.h))}`:''}</mrow>`;
  const arg = `<mrow><mo>(</mo>${inside}<mo>)</mo></mrow>`;
  const base = family.base === .5 ? '<mrow><mo>(</mo><mfrac><mn>1</mn><mn>2</mn></mfrac><mo>)</mo></mrow>' : number(family.base);
  const expr = family.kind === 'exp' ? `<msup>${base}${inside}</msup>` : family.kind === 'log' ? `${q.family==='natural'?'<mi>ln</mi>':`<msub><mi>log</mi>${number(family.base)}</msub>`}${arg}` : `<msup>${arg}<mn>2</mn></msup>`;
  return `<math xmlns="http://www.w3.org/1998/Math/MathML" display="block" aria-label="${q.text.replace(/^g\(x\)/,`${name}(x)`)}"><mrow><mi>${name}</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>=</mo>${expr}${q.k?`<mo>${q.k>0?'+':'−'}</mo>${number(Math.abs(q.k))}`:''}</mrow></math>`;
}
export const horizontalText = q => q.horizontal === null ? 'No hay asíntota horizontal' : `y = ${fraction(q.horizontal)}`;
export const verticalText = q => q.verticals.length ? q.verticals.map(x=>`x = ${fraction(x)}`).join(' y ') : 'No hay asíntotas verticales';
