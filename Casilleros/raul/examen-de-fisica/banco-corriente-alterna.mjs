export const preguntasCA = [
  {
    "pregunta": "¿Qué caracteriza a la corriente alterna?",
    "opciones": [
      "Mantiene siempre la misma dirección y magnitud.",
      "Su magnitud y dirección cambian periódicamente.",
      "Solo circula por capacitores.",
      "No puede transferir energía."
    ],
    "correcta": 1,
    "explicacion": "En CA, la corriente cambia periódicamente de valor y de sentido."
  },
  {
    "pregunta": "¿Qué representa el valor efectivo o RMS de una corriente?",
    "opciones": [
      "Su valor máximo.",
      "Su frecuencia.",
      "La corriente constante que produciría el mismo calentamiento en un resistor.",
      "El tiempo que dura un ciclo."
    ],
    "correcta": 2,
    "explicacion": "RMS permite comparar el efecto térmico de la corriente alterna con el de una corriente constante."
  },
  {
    "pregunta": "¿Qué significa que voltaje y corriente estén en fase en un resistor puro?",
    "opciones": [
      "Alcanzan sus máximos y pasan por cero al mismo tiempo.",
      "La corriente se adelanta un cuarto de ciclo.",
      "El voltaje se adelanta medio ciclo.",
      "Tienen necesariamente el mismo valor numérico."
    ],
    "correcta": 0,
    "explicacion": "Estar en fase describe la coincidencia temporal, no la igualdad de magnitudes o unidades."
  },
  {
    "pregunta": "¿Cómo se calcula la corriente efectiva en un resistor puro?",
    "opciones": [
      "Ief = Vef × R.",
      "Ief = R/Vef.",
      "Ief = Vef + R.",
      "Ief = Vef/R."
    ],
    "correcta": 3,
    "explicacion": "La ley de Ohm también se aplica con valores efectivos en un resistor puro."
  },
  {
    "pregunta": "¿Qué es la reactancia?",
    "opciones": [
      "La energía almacenada por segundo.",
      "La oposición a la corriente alterna causada por capacitores e inductores, medida en ohms.",
      "La cantidad de ciclos por segundo, medida en hertz.",
      "La carga almacenada, medida en coulombs."
    ],
    "correcta": 1,
    "explicacion": "La reactancia se mide en Ω y depende de la frecuencia y del capacitor o inductor."
  },
  {
    "pregunta": "¿Qué ocurre en un capacitor conectado a corriente alterna?",
    "opciones": [
      "Permanece siempre con la misma carga.",
      "Se convierte en un resistor puro.",
      "Se carga y descarga continuamente al cambiar el voltaje.",
      "Su capacitancia cambia de signo en cada ciclo."
    ],
    "correcta": 2,
    "explicacion": "La variación de voltaje hace variar la carga de sus placas. Esto no significa que la capacitancia cambie de signo."
  },
  {
    "pregunta": "En un capacitor puro, ¿cómo se relacionan corriente y voltaje?",
    "opciones": [
      "La corriente adelanta al voltaje 90°.",
      "El voltaje adelanta a la corriente 90°.",
      "Están siempre en fase.",
      "La corriente se retrasa 180°."
    ],
    "correcta": 0,
    "explicacion": "La corriente alcanza sus máximos un cuarto de ciclo antes que el voltaje."
  },
  {
    "pregunta": "Si aumenta la frecuencia y la capacitancia no cambia, ¿qué ocurre con XC?",
    "opciones": [
      "Aumenta proporcionalmente.",
      "Permanece constante.",
      "Se vuelve negativa.",
      "Disminuye."
    ],
    "correcta": 3,
    "explicacion": "XC = 1/(2πfC): al aumentar el denominador, la reactancia capacitiva disminuye."
  },
  {
    "pregunta": "¿A qué se opone un inductor?",
    "opciones": [
      "A la existencia de cualquier voltaje.",
      "A los cambios de corriente.",
      "Únicamente a las cargas positivas.",
      "Al área de las placas de un capacitor."
    ],
    "correcta": 1,
    "explicacion": "La bobina almacena energía en un campo magnético y se opone a las variaciones de corriente."
  },
  {
    "pregunta": "En un inductor puro, ¿qué ocurre con la fase?",
    "opciones": [
      "La corriente adelanta al voltaje 90°.",
      "Voltaje y corriente siempre están en fase.",
      "El voltaje adelanta a la corriente 90°.",
      "El voltaje se retrasa 180°."
    ],
    "correcta": 2,
    "explicacion": "La corriente alcanza sus máximos un cuarto de ciclo después que el voltaje."
  },
  {
    "pregunta": "Si aumenta la frecuencia y la inductancia no cambia, ¿qué ocurre con XL?",
    "opciones": [
      "Aumenta.",
      "Disminuye.",
      "No cambia.",
      "Siempre se anula."
    ],
    "correcta": 0,
    "explicacion": "XL = 2πfL: la frecuencia multiplica, por lo que una frecuencia mayor produce mayor reactancia inductiva."
  },
  {
    "pregunta": "¿Para qué conexión se usan X = XL − XC y Z = √(R² + X²) en esta guía?",
    "opciones": [
      "Para cualquier conexión sin distinguir su forma.",
      "Solo para capacitores en paralelo.",
      "Para cualquier circuito de corriente continua.",
      "Para un circuito RLC en serie."
    ],
    "correcta": 3,
    "explicacion": "En serie, la misma corriente pasa por R, L y C. Estas fórmulas no se trasladan directamente a una conexión en paralelo."
  },
  {
    "pregunta": "¿Qué representa Z en Ief = Vef/Z?",
    "opciones": [
      "Solo la reactancia del capacitor.",
      "La magnitud de la impedancia, que combina resistencia y reactancia.",
      "El voltaje máximo.",
      "La potencia activa."
    ],
    "correcta": 1,
    "explicacion": "Z se mide en ohms. En el circuito RLC en serie permite calcular la corriente efectiva a partir del voltaje efectivo."
  },
  {
    "pregunta": "Si XC es mayor que XL en un RLC en serie, ¿cómo es el circuito?",
    "opciones": [
      "Inductivo, con X positiva.",
      "Resonante, con X igual a cero.",
      "Capacitivo, con X negativa y corriente adelantada al voltaje.",
      "Puramente resistivo, sin desfase."
    ],
    "correcta": 2,
    "explicacion": "Como X = XL − XC, el resultado es negativo. Predomina el efecto capacitivo y φ es negativo."
  },
  {
    "pregunta": "¿Qué sucede en resonancia en un RLC en serie con R mayor que cero?",
    "opciones": [
      "XL = XC, X = 0, Z = R y φ = 0°.",
      "R desaparece y Z siempre vale cero.",
      "XL y XC necesariamente valen cero por separado.",
      "La corriente necesariamente vale cero."
    ],
    "correcta": 0,
    "explicacion": "Las reactancias se compensan, aunque cada una puede ser distinta de cero. La resistencia sigue presente."
  },
  {
    "pregunta": "¿Qué indica el factor de potencia cos(φ)?",
    "opciones": [
      "El número de ciclos por segundo.",
      "La relación entre corriente máxima y efectiva.",
      "La carga que almacena el capacitor.",
      "Qué parte de Vef Ief corresponde a potencia activa."
    ],
    "correcta": 3,
    "explicacion": "La potencia activa es P = Vef Ief cos(φ). El factor de potencia no tiene unidades."
  },
  {
    "pregunta": "Para una señal sinusoidal, ¿cómo se relacionan el valor efectivo y el máximo?",
    "opciones": [
      "El efectivo es mayor que el máximo.",
      "El efectivo es el máximo dividido entre √2.",
      "Ambos son siempre iguales.",
      "El efectivo es el máximo multiplicado por dos."
    ],
    "correcta": 1,
    "explicacion": "Ief = Imax/√2 y Vef = Vmax/√2. El valor efectivo es aproximadamente el 70.7 % del máximo."
  },
  {
    "pregunta": "Al usar cos⁻¹(R/Z), ¿qué cuidado hay que tener con el ángulo de fase?",
    "opciones": [
      "Siempre debe tomarse como negativo.",
      "El resultado da directamente el signo en cualquier circuito.",
      "Da la magnitud del ángulo; el signo depende de si predomina XL o XC.",
      "Debe sumarse siempre un ángulo de 90°."
    ],
    "correcta": 2,
    "explicacion": "En RLC en serie, φ es positivo si predomina XL y negativo si predomina XC. La arcotangente de X/R conserva ese signo cuando R es positiva."
  }
];
