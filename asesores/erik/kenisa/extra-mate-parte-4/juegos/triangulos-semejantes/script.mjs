import * as modelo from './modelo.mjs?v=20261009-2';
import {pareja,introSVG} from './figuras.mjs?v=20261009-2';
import {iniciarPracticas} from '../../recursos/practicas-triangulos.mjs?v=20261009-2';
const {ejemploCriterio}=modelo;
const $=id=>document.getElementById(id);let criterio='AA',conclusiones=false,separados=false;
const movil=matchMedia('(max-width:600px)');
function dibujarIntro(){
 $('intro-art').innerHTML=introSVG(movil.matches);$('intro-art').classList.toggle('apart',separados);
 $('separate').setAttribute('aria-pressed',String(separados));$('separate').textContent=separados?'Juntar triángulos ↙':'Separar triángulos ↗';
 $('intro-status').textContent=separados?'A ↔ A, B ↔ X y C ↔ Y. Sus ángulos coinciden y sus lados guardan la misma proporción.':'AXY está dentro de ABC. Su base XY es paralela a BC.';
}
movil.addEventListener('change',dibujarIntro);
$('separate').addEventListener('click',()=>{
 separados=!separados;$('intro-art').classList.toggle('apart',separados);
 $('separate').setAttribute('aria-pressed',String(separados));$('separate').textContent=separados?'Juntar triángulos ↙':'Separar triángulos ↗';
 $('intro-status').textContent=separados?'A ↔ A, B ↔ X y C ↔ Y. Sus ángulos coinciden y sus lados guardan la misma proporción.':'AXY está dentro de ABC. Su base XY es paralela a BC.';
});
const explicaciones={
 AA:{dan:'Dos parejas de ángulos iguales: A = A y B = X.',concluimos:'El tercer par también es igual. Los lados correspondientes son proporcionales: la forma es la misma.',nota:'Los ángulos se muestran aproximados. Con solo ángulos no conocemos las longitudes ni la razón de escala: a, b y c representan los lados, y k el mismo factor en los tres.'},
 LAL:{dan:'AB / AX = 12 / 6 = 2 y BC / XY = 16 / 8 = 2. El ángulo de 90° está ENTRE esos dos lados en cada figura.',concluimos:'Son semejantes: el tercer par de lados tiene la misma razón y los otros ángulos correspondientes son iguales.',nota:'c representa el tercer lado grande: su pareja mide c/2. Las letras α y γ marcan ángulos correspondientes iguales; no necesitamos calcularlos.'},
 LLL:{dan:'Los tres pares tienen la misma razón: 12 / 6 = 16 / 8 = 20 / 10 = 2.',concluimos:'Son semejantes. Sus tres parejas de ángulos correspondientes son iguales.',nota:'α, β y γ marcan las parejas de ángulos iguales. No hace falta conocer sus medidas para aplicar LLL.'}
};
function dibujarCriterio(){
 const e=explicaciones[criterio];$('criteria-art').innerHTML=pareja(ejemploCriterio(criterio,conclusiones),true);
 $('criteria-given').textContent=e.dan;$('criteria-conclusion').textContent=e.concluimos;$('criteria-note').textContent=e.nota;
 $('criteria-legend').hidden=!conclusiones;$('show-conclusions').setAttribute('aria-pressed',String(conclusiones));$('show-conclusions').textContent=conclusiones?'Ver solo los datos ↺':'Mostrar lo que se deduce ✦';
 document.querySelectorAll('[data-criterion]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.criterion===criterio)));
}
document.querySelectorAll('[data-criterion]').forEach(b=>b.addEventListener('click',()=>{criterio=b.dataset.criterion;conclusiones=false;dibujarCriterio();}));
$('show-conclusions').addEventListener('click',()=>{conclusiones=!conclusiones;dibujarCriterio();});
dibujarIntro();dibujarCriterio();iniciarPracticas(modelo);
