import * as modelo from './modelo.mjs?v=20261009-2';
import {pareja} from '../../recursos/figuras-triangulos.mjs?v=20261009-2';
import {iniciarPracticas} from '../../recursos/practicas-triangulos.mjs?v=20261009-2';
import {iniciarClon} from './animacion.mjs?v=20261009-2';
const $=id=>document.getElementById(id);let criterio='LLL',conclusiones=false;
const explicaciones={
 LLL:{dan:'Tres pares de lados iguales: AB = XY = 6, BC = YZ = 8 y AC = XZ = 10 cm.',concluimos:'Son congruentes. Sus tres parejas de ángulos también son iguales.',nota:'Las letras α, β y γ señalan ángulos correspondientes iguales. No hace falta calcularlos para aplicar LLL.'},
 LAL:{dan:'AB = XY = 6 cm y BC = YZ = 8 cm. Los ángulos B e Y, comprendidos ENTRE esos lados, miden 90°.',concluimos:'Son congruentes. El tercer par de lados y los otros dos pares de ángulos también coinciden.',nota:'c representa la misma longitud en AC y XZ. α y γ representan las parejas de ángulos iguales. No necesitamos calcular sus medidas.'},
 ALA:{dan:'A = X ≈ 53,13° y B = Y = 90°. El lado comprendido, que une esos ángulos, también es igual: AB = XY = 6 cm.',concluimos:'Son congruentes. El tercer ángulo es igual y los dos pares de lados restantes también tienen la misma longitud.',nota:'Ángulos aproximados a dos decimales. b y c representan las medidas iguales de los otros lados. Dos ángulos sin un lado igual no bastarían para asegurar congruencia.'}
};
function dibujarCriterio(){
 const e=explicaciones[criterio];$('criteria-art').innerHTML=pareja(modelo.ejemploCriterio(criterio,conclusiones),true);
 $('criteria-given').textContent=e.dan;$('criteria-conclusion').textContent=e.concluimos;$('criteria-note').textContent=e.nota;
 $('criteria-legend').hidden=!conclusiones;$('show-conclusions').setAttribute('aria-pressed',String(conclusiones));$('show-conclusions').textContent=conclusiones?'Ver solo los datos ↺':'Mostrar lo que se deduce ✦';
 document.querySelectorAll('[data-criterion]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.criterion===criterio)));
}
document.querySelectorAll('[data-criterion]').forEach(b=>b.addEventListener('click',()=>{criterio=b.dataset.criterion;conclusiones=false;dibujarCriterio();}));
$('show-conclusions').addEventListener('click',()=>{conclusiones=!conclusiones;dibujarCriterio();});
iniciarClon();dibujarCriterio();iniciarPracticas(modelo,{simboloNo:'≇',mismaEscala:true});
