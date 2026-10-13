export const heating=(current,resistance)=>current*current*resistance;
export function battery(r,external,open=false){const emf=12,current=open?0:emf/(external+r);return {emf,current,loss:current*r,terminal:emf-current*r};}
export const capacitance=(area,distance,k=1)=>k*area/distance;
export const charge=(c,v)=>c*v;
export const equivalent=(a,b,parallel)=>parallel?a+b:1/(1/a+1/b);
export const junction=share=>({inA:6,inB:4,outA:share,outB:10-share});
export const loop=[
 {potential:0,part:'start',title:'Comienza en el terminal negativo',text:'Tomamos este punto como referencia. Recorreremos la malla en sentido horario.'},
 {potential:12,part:'source',title:'La batería: una subida',text:'De − a +, la fuente aporta energía por unidad de carga: el potencial sube ε.'},
 {potential:8,part:'r1',title:'Primera resistencia: una caída',text:'Siguiendo la corriente, el potencial baja IR₁. Esa energía se transfiere al material.'},
 {potential:0,part:'r2',title:'Segunda resistencia: otra caída',text:'El potencial baja IR₂. En este circuito, las dos caídas juntas igualan la subida de la batería.'},
 {potential:0,part:'end',title:'De vuelta al punto de partida',text:'La suma de cambios es cero: +ε − IR₁ − IR₂ = 0. Se conserva la energía.'}
];
