import {fija} from './banco-ejercicios.mjs?v=20260930-series2';
// Problemas redactados y resueltos de antemano. Solo cambia el orden de presentación.
const A='aritmetica',G='geometrica';
export const PROBLEMAS=Object.freeze([
 fija('pa01',A,'Las filas de una grada aumentan siempre en la misma cantidad de asientos. La fila 3 tiene 18 y la fila 4 tiene 22. ¿Cuántos asientos se agregan de una fila a la siguiente?',[],[['\\text{Asientos}','4']]),
 fija('pa02',A,'Una caminante aumenta cada día su recorrido en la misma cantidad de metros. El día 4 camina 2400 m y el día 7, 3300 m. ¿Cuántos metros caminó el primer día?',[],[['\\text{Metros}','1500']]),
 fija('pa03',A,'Alejandra lee 12 páginas el primer día y 3 páginas más que el día anterior cada día siguiente. ¿Cuántas páginas leerá el día 9?',[],[['\\text{Páginas}','36']]),
 fija('pa04',A,'La primera semana se depositan 30 pesos en una alcancía. Cada semana se depositan 10 pesos más que la anterior. ¿En qué semana el depósito de esa semana será de 150 pesos?',[],[['\\text{Semana}','13']]),
 fija('pa05',A,'Un auditorio tiene 12 filas. La primera tiene 16 asientos y cada fila siguiente tiene 2 asientos más. ¿Cuántos asientos hay en total?',[],[['\\text{Asientos}','324']]),
 fija('pa06',A,'En un entrenamiento se realizan 8 repeticiones el primer día y 4 más que el día anterior cada día siguiente. Hasta el último día se han hecho 108 repeticiones en total; ese último día se hicieron 28. ¿Cuántos días duró el entrenamiento?',[],[['\\text{Días}','6']]),
 fija('pa07',A,'El primer estante de una tienda contiene 7 cajas y cada estante siguiente tiene 3 cajas más. ¿Cuántas cajas hay juntas en los estantes 4 al 8, incluyendo ambos?',[],[['\\text{Cajas}','110']]),
 fija('pa08',A,'Seis pagos aumentan siempre en la misma cantidad. Juntos suman 2100 pesos y el sexto pago es de 600 pesos. ¿De cuántos pesos fue el primero?',[],[['\\text{Pesos}','100']]),
 fija('pa09',A,'Un sensor registra 8 °C en la primera lectura. Cada lectura siguiente marca 3 °C menos. Escribe el cambio con su signo y la temperatura de la séptima lectura.',[],[['\\text{Cambio (°C)}','-3'],['\\text{Lectura 7 (°C)}','-10']]),
 fija('pa10',A,'Se cortan listones: el primero mide 50 cm y cada siguiente mide 25 cm más. ¿Cuánto mide el sexto listón en metros? ¿Cuántos metros se necesitan para los primeros 8 listones en total?',[],[['\\text{Sexto (m)}','7/4'],['\\text{Total (m)}','11']]),
 fija('pg01',G,'En una instalación, cada nivel tiene una cantidad de luces que se obtiene multiplicando la del nivel anterior por el mismo factor positivo. El nivel 2 tiene 12 luces y el nivel 3 tiene 36. ¿Cuál es ese factor?',[],[['r','3']]),
 fija('pg02',G,'Un vivero prepara lotes de plantas. Cada lote tiene el doble de plantas que el anterior y el cuarto tiene 80. ¿Cuántas plantas tenía el primer lote?',[],[['\\text{Plantas}','10']]),
 fija('pg03',G,'Una campaña llega a 5 personas nuevas el primer día. Cada día siguiente llega al triple de personas nuevas que el día anterior. ¿A cuántas personas nuevas llegará el día 5?',[],[['\\text{Personas}','405']]),
 fija('pg04',G,'La primera tira mide 32 cm y cada tira siguiente mide la mitad de la anterior. ¿Qué número de tira mide 1 cm?',[],[['\\text{Número de tira}','6']]),
 fija('pg05',G,'En un juego ganas 3 fichas el primer día. Cada día siguiente ganas el doble de fichas nuevas que el anterior. Sin gastar ninguna, ¿cuántas fichas acumulas en 6 días?',[],[['\\text{Fichas}','189']]),
 fija('pg06',G,'El primer rebote de una pelota alcanza 160 cm. Cada rebote siguiente alcanza el 75 % de la altura del anterior. ¿Qué altura, en centímetros, alcanza el cuarto rebote?',[],[['\\text{Altura (cm)}','135/2']]),
 fija('pg07',G,'En la primera hora de una campaña llegan 4 donaciones nuevas. En cada hora siguiente llega el doble que en la anterior. ¿Cuántas donaciones llegan entre las horas 3 y 6, incluyendo ambas?',[],[['\\text{Donaciones}','240']]),
 fija('pg08',G,'Las visitas nuevas de un canal se duplican cada día respecto al anterior. En sus primeros 7 días sumó 1270 visitas. ¿Cuántas visitas recibió el primer día?',[],[['\\text{Visitas}','10']]),
 fija('pg09',G,'La primera entrega contiene 1 paquete y cada entrega siguiente contiene cuatro veces los paquetes de la anterior. Después de una entrega, el total recibido es de 341 paquetes. ¿Cuántas entregas se han recibido?',[],[['\\text{Entregas}','5']]),
 fija('pg10',G,'En una exhibición, las cuentas de cada nivel se obtienen multiplicando las del anterior por un factor positivo constante. El nivel 2 tiene 12 cuentas y el nivel 5 tiene 324. Halla ese factor, las cuentas del primer nivel y el total de los primeros 5 niveles.',[],[['r','3'],['\\text{Primer nivel}','4'],['\\text{Total}','484']])
]);
