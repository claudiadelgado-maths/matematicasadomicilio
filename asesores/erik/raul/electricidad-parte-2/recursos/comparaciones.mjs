import {coulomb,wire} from './motor.mjs';

// Each experiment fixes all other controls. Values use the units of the lab controls.
export const defaults={
 coulomb:{sign1:-1,q1:16,sign2:1,q2:18,distance:60},
 corriente:{charge:12,time:4},voltaje:{voltage:12},
 resistencia:{material:1.72e-8,length:10,diameter:1},
 ohm:{voltage:12,resistance:6},potencia:{voltage:12,resistance:6},
 joule:{current:1,resistance:5}
};
export function measurement(topic,s){
 if(topic==='coulomb')return {value:coulomb(s.q1*1e-6,s.q2*1e-6,s.distance*.001),unit:'N',label:'Fuerza'};
 if(topic==='corriente')return {value:s.charge/s.time,unit:'A',label:'Corriente'};
 if(topic==='voltaje')return {value:s.voltage,unit:'J',label:'Energía para 1 C'};
 if(topic==='resistencia')return {value:wire(s.material,s.length,s.diameter*.001).R,unit:'Ω',label:'Resistencia'};
 if(topic==='ohm')return {value:s.voltage/s.resistance,unit:'A',label:'Corriente'};
 if(topic==='potencia')return {value:s.voltage**2/s.resistance,unit:'W',label:'Potencia'};
 return {value:s.current**2*s.resistance,unit:'W',label:'Potencia disipada'};
}
const experiment=(title,question,change,answer,explanation)=>({title,question,change,answer,explanation});
export const experiments={
 coulomb:[
  experiment('Alejar las cargas','Separamos las mismas cargas de 60 a 120 mm. ¿Qué pasa con la magnitud de la fuerza?',{distance:120},'Se reduce a la cuarta parte.','La distancia está al cuadrado: al duplicarla, el denominador se multiplica por cuatro. La fuerza pasa de 720 N a 180 N; sigue siendo atracción.'),
  experiment('Cambiar el signo','Cambiamos q₁ de negativa a positiva, conservando su magnitud y la distancia. ¿Qué pasa con la magnitud de la fuerza?',{sign1:1},'Permanece igual.','La fuerza conserva 720 N. Lo que cambia es el sentido: antes se atraían y ahora se repelen. El signo determina la interacción; no vuelve negativa la magnitud.'),
  experiment('Reducir una carga','Reducimos q₂ de 18 a 9 μC sin mover las cargas. ¿Qué pasa con la fuerza?',{q2:9},'Se reduce a la mitad.','La fuerza es proporcional a cada carga. Al reducir una a la mitad, F pasa de 720 N a 360 N. El modelo representa cargas puntuales, no un globo completo.')
 ],
 corriente:[
  experiment('La misma carga, más rápido','Pasan 12 C por una sección del cable. Si tardan 2 s en lugar de 4 s, ¿qué pasa con la corriente promedio?',{time:2},'Se duplica.','Pasa la misma carga en la mitad del tiempo: 12 C / 2 s = 6 A. Antes eran 3 A. Como al contar personas que cruzan una puerta, importa cuántas pasan por segundo.'),
  experiment('Más carga en el mismo tiempo','Pasan 24 C en 4 s, en lugar de 12 C en 4 s. ¿Qué pasa con la corriente?',{charge:24},'Se duplica.','En cada segundo cruza el doble de carga. La corriente pasa de 3 A a 6 A; el ampere mide coulombs por segundo.'),
  experiment('Tomarse más tiempo','La misma carga de 12 C ahora tarda 8 s. ¿Qué pasa con la corriente promedio?',{time:8},'Se reduce a la mitad.','12 C repartidos entre 8 s dan 1.5 A. Menos corriente no significa necesariamente menos carga total: aquí solo cambió el tiempo.')
 ],
 voltaje:[
  experiment('Comparar 12 V y 6 V','Una fuente eleva el potencial de 1 C de carga positiva. Si usamos 6 V en lugar de 12 V, ¿cómo cambia la energía suministrada?',{voltage:6},'Se reduce a la mitad.','Cada coulomb recibe 6 J en lugar de 12 J. El voltaje indica energía por carga, no cuánta carga atraviesa el dispositivo.'),
  experiment('Comparar 12 V y 3 V','Para la misma carga positiva de 1 C, cambiamos de 12 V a 3 V. ¿Cómo cambia la energía suministrada?',{voltage:3},'Se reduce a la cuarta parte.','E = qV: con q = 1 C, 3 V corresponden a 3 J. Esto compara fuentes ideales; los aparatos reales necesitan el voltaje especificado para ellos.')
 ],
 resistencia:[
  experiment('Un cable más largo','Comparamos cables de cobre del mismo grosor y temperatura. Uno mide 20 m en lugar de 10 m. ¿Cómo cambia R?',{length:20},'Se duplica.','Con el mismo material y área, R es proporcional a L. Un cable del doble de longitud ofrece el doble de resistencia.'),
  experiment('Un cable más grueso','El diámetro del cable pasa de 1 a 2 mm. Mantenemos material, longitud y temperatura. ¿Cómo cambia R?',{diameter:2},'Se reduce a la cuarta parte.','Al duplicar el diámetro también se duplica el radio. El área πr² se cuadruplica; por eso la resistencia se divide entre cuatro, no entre dos.'),
  experiment('Menos recorrido','Acortamos el mismo tipo de cable de 10 a 5 m. ¿Cómo cambia su resistencia?',{length:5},'Se reduce a la mitad.','La resistividad del cobre permanece igual. Cambia la resistencia de este cable porque su longitud es menor: R = ρL/A.')
 ],
 ohm:[
  experiment('Aumentar el voltaje','Un resistor óhmico de 6 Ω recibe 24 V en lugar de 12 V. ¿Cómo cambia la corriente?',{voltage:24},'Se duplica.','I = V/R: pasa de 2 A a 4 A. Esta comparación supone que R permanece en 6 Ω, sin cambios de temperatura que alteren su valor.'),
  experiment('Mayor resistencia','Conservamos una fuente de 12 V y cambiamos de 6 Ω a 12 Ω. ¿Cómo cambia la corriente?',{resistance:12},'Se reduce a la mitad.','A voltaje fijo, duplicar R divide I entre dos: 12/12 = 1 A. Es una comparación de resistores ideales, como los de un circuito de práctica.'),
  experiment('Bajar el voltaje','El mismo resistor de 6 Ω recibe 6 V en lugar de 12 V. ¿Cómo cambia la corriente?',{voltage:6},'Se reduce a la mitad.','La corriente pasa de 2 A a 1 A. Voltaje y corriente son proporcionales cuando la resistencia se mantiene fija.')
 ],
 potencia:[
  experiment('Doble voltaje','En el mismo resistor de 6 Ω, subimos de 12 V a 24 V. ¿Cómo cambia la potencia?',{voltage:24},'Se cuadruplica.','También se duplica la corriente: de 2 A a 4 A. Por eso VI se multiplica por cuatro: de 24 W a 96 W. No basta mirar solo el voltaje.'),
  experiment('Mitad del voltaje','El resistor de 6 Ω recibe 6 V en lugar de 12 V. ¿Cómo cambia su potencia?',{voltage:6},'Se reduce a la cuarta parte.','P = V²/R: pasa de 24 W a 6 W. En un elemento calefactor ideal, esto significa menos energía transformada cada segundo.'),
  experiment('Más resistencia a igual voltaje','La fuente permanece en 12 V. Cambiamos de 6 Ω a 12 Ω. ¿Cómo cambia la potencia?',{resistance:12},'Se reduce a la mitad.','La corriente baja de 2 A a 1 A; P baja de 24 W a 12 W. Aquí V está fijo. No podemos usar I²R suponiendo que I sigue igual.')
 ],
 joule:[
  experiment('Doble corriente','Un elemento resistivo de 5 Ω conduce 2 A en lugar de 1 A. ¿Cómo cambia la potencia disipada?',{current:2},'Se cuadruplica.','P = I²R: de 5 W pasa a 20 W. El doble de corriente produce cuatro veces la energía por segundo, mientras R se conserve.'),
  experiment('Más resistencia a igual corriente','Mantenemos 1 A y cambiamos de 5 Ω a 10 Ω. ¿Cómo cambia la potencia disipada?',{resistance:10},'Se duplica.','A corriente fija, P es proporcional a R: de 5 W a 10 W. Mantener 1 A requiere que la fuente ajuste el voltaje; no es el mismo caso que mantener V fijo.'),
  experiment('Sin corriente','La corriente baja de 1 A a 0 A en el mismo resistor. ¿Qué pasa con la potencia eléctrica disipada?',{current:0},'Se vuelve cero.','Sin corriente, I²R = 0 W. Un objeto que ya estaba caliente puede seguir caliente un tiempo: potencia disipada y temperatura no son lo mismo.')
 ]
};
