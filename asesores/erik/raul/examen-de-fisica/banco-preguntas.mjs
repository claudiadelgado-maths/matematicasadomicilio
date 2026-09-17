export const preguntas = [
  {
    "pregunta": "¿Qué relación hay entre el campo eléctrico y la fuerza sobre una carga?",
    "opciones": [
      "La fuerza depende directamente de la masa.",
      "La magnitud de la fuerza es proporcional a la magnitud de la carga y del campo eléctrico.",
      "La fuerza siempre es cero si la carga está en reposo.",
      "La fuerza es constante aunque cambie el campo."
    ],
    "correcta": 1,
    "explicacion": "La fuerza eléctrica cumple F = qE. Su magnitud depende de |q| y de E; una carga no necesita moverse para experimentar esta fuerza."
  },
  {
    "pregunta": "¿Qué representa el flujo magnético?",
    "opciones": [
      "La rapidez de una carga.",
      "La cantidad de espiras de una bobina.",
      "Cuánto campo magnético atraviesa una superficie.",
      "La resistencia eléctrica de un conductor."
    ],
    "correcta": 2,
    "explicacion": "El flujo depende del campo, del área y de la orientación de la superficie."
  },
  {
    "pregunta": "En Φ = BA sen(θ), ¿desde dónde se mide θ en esta guía?",
    "opciones": [
      "Desde el plano de la superficie hasta el campo.",
      "Desde la normal de la superficie hasta el campo.",
      "Entre la velocidad y la fuerza.",
      "Entre la corriente y el voltaje."
    ],
    "correcta": 0,
    "explicacion": "Aquí θ se mide respecto al plano. Si se mide respecto a la normal, se utiliza coseno."
  },
  {
    "pregunta": "Con la misma carga, rapidez y campo, ¿cuándo es máxima la fuerza magnética?",
    "opciones": [
      "Cuando la carga está en reposo.",
      "Cuando la velocidad es paralela al campo.",
      "Cuando el ángulo es 0°.",
      "Cuando la velocidad es perpendicular al campo, a 90°."
    ],
    "correcta": 3,
    "explicacion": "En Fm = |q|vB sen(θ), el seno vale 1 a 90°. A 0° o 180° la contribución magnética es cero."
  },
  {
    "pregunta": "Una carga está en reposo dentro de un campo magnético. ¿Qué fuerza magnética experimenta?",
    "opciones": [
      "Una fuerza máxima.",
      "Ninguna fuerza magnética.",
      "Una fuerza que depende solo de su masa.",
      "Una fuerza igual al campo magnético."
    ],
    "correcta": 1,
    "explicacion": "La fuerza magnética contiene el factor v. Si la velocidad es cero, esa fuerza es cero, aunque podría existir una fuerza eléctrica si también hay campo eléctrico."
  },
  {
    "pregunta": "Dos cargas de igual magnitud y signo contrario tienen la misma velocidad, perpendicular al mismo campo magnético. ¿Cómo son sus fuerzas magnéticas?",
    "opciones": [
      "Iguales en magnitud y dirección.",
      "La negativa no experimenta fuerza.",
      "Iguales en magnitud y de direcciones contrarias.",
      "Dependen del número de espiras."
    ],
    "correcta": 2,
    "explicacion": "El signo de q invierte la dirección. La regla de la mano derecha da la dirección para una carga positiva."
  },
  {
    "pregunta": "Al alejarse de un conductor recto muy largo, manteniendo su corriente, ¿qué ocurre con el campo?",
    "opciones": [
      "Disminuye.",
      "Aumenta.",
      "Permanece igual a cualquier distancia.",
      "Se convierte en campo eléctrico."
    ],
    "correcta": 0,
    "explicacion": "En B = μI/(2πr), la distancia r está en el denominador: a mayor distancia, menor campo."
  },
  {
    "pregunta": "En una bobina circular, ¿qué cambio aumenta el campo en su centro si todo lo demás permanece igual?",
    "opciones": [
      "Disminuir la corriente.",
      "Disminuir el número de espiras.",
      "Aumentar el radio.",
      "Aumentar el número de espiras."
    ],
    "correcta": 3,
    "explicacion": "En B = μNI/(2R), el número de espiras N multiplica. Más espiras producen mayor campo con la misma corriente, radio y medio."
  },
  {
    "pregunta": "¿Qué indica la permeabilidad relativa μr de un material?",
    "opciones": [
      "Su carga eléctrica neta.",
      "Cuántas veces su permeabilidad equivale a la del vacío.",
      "El voltaje que almacena.",
      "La longitud de una bobina."
    ],
    "correcta": 1,
    "explicacion": "La relación μ = μ0μr compara la permeabilidad del material con la del vacío. μr no tiene unidades."
  },
  {
    "pregunta": "¿Qué relaciona la ley de Gauss para la electricidad?",
    "opciones": [
      "El campo magnético con la masa encerrada.",
      "El voltaje inducido con el número de imanes.",
      "El flujo eléctrico neto cerrado con la carga neta encerrada.",
      "La fuerza magnética con la resistencia."
    ],
    "correcta": 2,
    "explicacion": "La carga neta encerrada determina el flujo eléctrico neto a través de la superficie cerrada."
  },
  {
    "pregunta": "Si una superficie encierra igual cantidad de carga positiva y negativa, ¿qué podemos afirmar?",
    "opciones": [
      "El flujo eléctrico neto es cero, pero puede haber campo eléctrico en la superficie.",
      "El campo eléctrico es necesariamente cero en todos sus puntos.",
      "Solo contribuyen las cargas positivas.",
      "El flujo eléctrico neto debe ser positivo."
    ],
    "correcta": 0,
    "explicacion": "Las cargas se compensan en la carga neta encerrada. Flujo neto cero no equivale a campo cero."
  },
  {
    "pregunta": "¿Qué afirma la ley de Gauss para el magnetismo?",
    "opciones": [
      "El campo magnético es cero en todas partes.",
      "Un imán solo tiene polo norte.",
      "El flujo magnético siempre sale y nunca entra.",
      "El flujo magnético neto a través de una superficie cerrada es cero."
    ],
    "correcta": 3,
    "explicacion": "El flujo entrante se compensa con el saliente. No hay polos magnéticos aislados en este modelo."
  },
  {
    "pregunta": "¿Cuál es la idea central de la ley de Ampère-Maxwell?",
    "opciones": [
      "Solo las cargas inmóviles generan campo magnético.",
      "Las corrientes y los campos eléctricos variables producen campo magnético.",
      "La circulación del campo magnético siempre es cero.",
      "El campo eléctrico depende únicamente de la masa."
    ],
    "correcta": 1,
    "explicacion": "Ampère relaciona la corriente con el campo magnético. Maxwell incorpora también la variación del flujo eléctrico."
  },
  {
    "pregunta": "Según Faraday, ¿qué es necesario para generar un voltaje inducido en una bobina?",
    "opciones": [
      "Que exista un campo constante, sin importar la bobina.",
      "Que la bobina tenga carga neta positiva.",
      "Que cambie el flujo magnético que atraviesa sus espiras.",
      "Que desaparezca toda resistencia."
    ],
    "correcta": 2,
    "explicacion": "Lo decisivo es el cambio de flujo. Puede cambiar el campo, el área o la orientación; un movimiento solo induce voltaje si modifica el flujo."
  },
  {
    "pregunta": "Una bobina rígida se traslada sin girar, completamente dentro de un campo uniforme y constante. Su área no cambia. ¿Se induce voltaje neto por ese movimiento?",
    "opciones": [
      "No, porque el flujo permanece constante.",
      "Sí, cualquier movimiento cambia necesariamente el flujo.",
      "Sí, porque el campo es uniforme.",
      "Sí, aunque el flujo no cambie."
    ],
    "correcta": 0,
    "explicacion": "Mover una bobina no basta: en este caso B, el área y la orientación no cambian, por lo que el flujo tampoco cambia."
  },
  {
    "pregunta": "¿A qué se opone el efecto de la corriente inducida según Lenz?",
    "opciones": [
      "A cualquier corriente, aunque no esté relacionada.",
      "Siempre al campo original, incluso si está disminuyendo.",
      "Al número de vueltas de la bobina.",
      "Al cambio de flujo que originó la corriente."
    ],
    "correcta": 3,
    "explicacion": "Si el flujo aumenta, el efecto inducido se opone al aumento; si disminuye, se opone a la disminución. Esto explica el signo negativo de Faraday."
  },
  {
    "pregunta": "Si una bobina abierta experimenta un cambio de flujo magnético, ¿qué puede ocurrir?",
    "opciones": [
      "No puede existir voltaje porque el circuito está abierto.",
      "Puede haber voltaje inducido, aunque no circule corriente por un circuito cerrado.",
      "Siempre circula una corriente continua por toda la bobina.",
      "El cambio de flujo deja de existir."
    ],
    "correcta": 1,
    "explicacion": "Faraday describe el voltaje inducido. Para que ese voltaje impulse una corriente sostenida por el circuito, se necesita un camino cerrado."
  },
  {
    "pregunta": "¿Qué describe la fuerza de Lorentz?",
    "opciones": [
      "Solo la fuerza entre dos imanes.",
      "Solo el voltaje de una bobina.",
      "La fuerza total eléctrica y magnética sobre una partícula cargada.",
      "El flujo magnético a través de una superficie cerrada."
    ],
    "correcta": 2,
    "explicacion": "F = q(E + v × B) reúne ambas contribuciones. La eléctrica puede actuar en reposo; la magnética depende del movimiento y de su dirección."
  }
];
