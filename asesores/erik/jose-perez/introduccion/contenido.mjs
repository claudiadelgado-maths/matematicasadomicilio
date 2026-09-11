// Contenido editorial. String.raw conserva los comandos de LaTeX sin escapes dobles.
const m = String.raw;
const e = (title, steps) => ({ title, steps });
const q = (prompt, options, correct, why) => ({ prompt, options, correct, why });
export const topics = [
  {
    id:'bases', title:'Empezar por las bases', group:'Bases',
    idea:'No hace falta saberlo todo para empezar. Probemos unas herramientas que reaparecen en todo el recorrido. Si algo cuesta, lo anotamos y lo trabajamos juntos.',
    formula:m`-40+70=30`,
    notes:['Primero paréntesis; después potencias y raíces; luego multiplicación y división, de izquierda a derecha; al final suma y resta, de izquierda a derecha.','En una suma, combina cantidades con su signo. En un producto o cociente: signos iguales dan positivo y signos diferentes, negativo. No se divide entre cero.'],
    life:'Un saldo de −$40 y un depósito de $70 dejan $30. El signo indica si la cantidad representa una deuda o un saldo a favor.',
    examples:[
      e('Signos y orden', [['Resuelve el producto antes de sumar.',m`-8+3(2-5)=-8+3(-3)`],['El producto es negativo.',m`-8-9=-17`],['El signo menos fuera de una potencia también importa.',m`(-3)^2=9,\qquad -3^2=-(3^2)=-9`]]),
      e('Sumar y restar fracciones', [['Busca un denominador común: 12.',m`\frac23+\frac14=\frac8{12}+\frac3{12}=\frac{11}{12}`],['Para restar, el denominador común se conserva.',m`\frac23-\frac14=\frac8{12}-\frac3{12}=\frac5{12}`],['No se suman los denominadores. Representan el tamaño de las partes.',m`\frac14+\frac14=\frac24=\frac12`]]),
      e('Multiplicar, dividir y simplificar', [['Multiplica numeradores y denominadores.',m`\frac23\cdot\frac45=\frac8{15}`],['Dividir entre una fracción no nula equivale a multiplicar por su recíproco.',m`\frac23\div\frac45=\frac23\cdot\frac54=\frac56`],['Divide arriba y abajo entre el mismo número no nulo.',m`\frac{18}{24}=\frac{18\div6}{24\div6}=\frac34`]]),
      e('Potencias y raíces', [['Una potencia repite un producto.',m`2^3=2\cdot2\cdot2=8`],['Con la misma base, al multiplicar se suman exponentes.',m`x^2x^3=x^5`],['La raíz cuadrada principal es no negativa. Resolver una ecuación puede dar dos soluciones.',m`\sqrt{25}=5,\qquad x^2=25\Rightarrow x=\pm5`],['Un exponente negativo indica un recíproco; la base no puede ser cero.',m`2^{-3}=\frac1{2^3}=\frac18`]]),
      e('Álgebra y despejes', [['Solo se combinan términos con la misma parte literal.',m`3x+2x-4+x^2=x^2+5x-4`],['Distribuye el factor a todos los términos.',m`2(x+3)=2x+6`],['Resta 3 en ambos lados. Después divide ambos lados entre 2.',m`2x+3=11\Rightarrow2x=8\Rightarrow x=4`],['Comprueba sustituyendo.',m`2(4)+3=11`]]),
      e('Factorizar', [['Factorizar es escribir una suma como producto. Extrae lo que se repite.',m`6x+9=3(2x+3)`],['Una diferencia de cuadrados se descompone así.',m`x^2-4=(x-2)(x+2)`],['Busca dos números que sumen 5 y cuyo producto sea 6.',m`x^2+5x+6=(x+2)(x+3)`],['Multiplicar los factores permite comprobar.',m`(x+2)(x+3)=x^2+3x+2x+6`]])
    ],
    quiz:q('¿Qué harías primero en 6 + 2 × 5?',['Sumar 6 + 2','Multiplicar 2 × 5','Sumar 6 + 5'],1,'La multiplicación tiene prioridad: 6 + 10 = 16.'), practice:'bases',
    bridge:'Con los números y signos podemos describir posiciones.'
  },
  {
    id:'puntos', title:'Ubicar un punto', group:'Geometría',
    idea:'Un punto (x, y) indica una posición: primero te mueves horizontalmente y después verticalmente. El origen es (0, 0).',
    formula:m`P=(x,y)`, notes:['El eje x es horizontal: derecha positiva, izquierda negativa. El eje y es vertical: arriba positivo, abajo negativo.','Cuadrantes: I (+,+), II (−,+), III (−,−), IV (+,−). Los puntos sobre los ejes no pertenecen a ningún cuadrante.'],
    life:'En el plano de un taller, un punto puede indicar dónde está una máquina respecto de una esquina tomada como origen.', graph:'points',
    examples:[e('Leer las coordenadas',[['Tres a la derecha y dos arriba.',m`(3,2)\in\text{I}`],['Dos a la izquierda y cuatro arriba.',m`(-2,4)\in\text{II}`],['Tres a la izquierda y uno abajo; o cuatro a la derecha y dos abajo.',m`(-3,-1)\in\text{III},\quad(4,-2)\in\text{IV}`]])],
    quiz:q('¿Dónde está (−2, 4)?',['Izquierda y arriba','Derecha y abajo','Izquierda y abajo'],0,'x = −2 mueve a la izquierda y y = 4 mueve hacia arriba. Es el cuadrante II.'), bridge:'Dos posiciones permiten medir un desplazamiento y una distancia.'
  },
  {
    id:'distancia',title:'La distancia entre puntos',group:'Geometría',
    idea:'La distancia es la longitud del segmento que une dos puntos. Los cambios horizontal y vertical forman los catetos de un triángulo rectángulo.',
    formula:m`d=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}`,
    notes:[m`\Delta x=x_2-x_1,\quad\Delta y=y_2-y_1.\quad\text{Pitágoras: }c^2=a^2+b^2.`, 'Los cambios pueden ser negativos; la distancia siempre es no negativa. Usa las mismas unidades en ambos ejes.'],
    life:'Para tender un cable recto entre dos posiciones del plano, importa la distancia directa, no la suma del recorrido horizontal y vertical.',graph:'distance',
    examples:[e('Un triángulo 3–4–5',[['Toma P₁ = (0, 0) y P₂ = (3, 4). Resta en el mismo orden.',m`\Delta x=3-0=3,\qquad\Delta y=4-0=4`],['Eleva los cambios al cuadrado y suma.',m`d^2=3^2+4^2=25`],['Toma la raíz no negativa.',m`d=5`]])],
    quiz:q('Si intercambiamos los dos puntos, ¿cambia la distancia?',['Sí, se vuelve negativa','No, es la misma','Se vuelve cero'],1,'Las diferencias cambian de signo, pero sus cuadrados son iguales. La distancia sigue siendo 5.'),practice:'distance',bridge:'La relación entre los dos cambios es la pendiente.'
  },
  {
    id:'pendiente',title:'Cuánto cambia por cada unidad',group:'Geometría',
    idea:'La pendiente compara el cambio vertical con el horizontal: cuánto cambia y por cada unidad de x.',
    formula:m`m=\frac{y_2-y_1}{x_2-x_1}=\frac{\Delta y}{\Delta x},\qquad\Delta x\ne0`,
    notes:['De izquierda a derecha: una recta que sube tiene pendiente positiva; una que baja, negativa.','Una recta horizontal tiene pendiente cero. Una recta vertical tiene Δx = 0: su pendiente no está definida, porque no podemos dividir entre cero.'],
    life:'Si un depósito recibe 2 litros por minuto a ritmo constante, la gráfica de litros añadidos frente al tiempo tiene pendiente 2 L/min.',graph:'slope',
    examples:[e('Comparar cambios',[['De (1, 2) a (4, 8), y aumenta 6 mientras x aumenta 3.',m`m=\frac{8-2}{4-1}=\frac63=2`],['Por cada unidad horizontal hay dos unidades verticales.',m`\Delta y=2\,\Delta x`]])],
    quiz:q('Una recta baja 6 unidades al avanzar 3. ¿Cuál es su pendiente?',['2','−2','−6'],1,'El cambio vertical es −6 y el horizontal es 3: m = −6/3 = −2.'),practice:'slope',bridge:'La pendiente y un punto bastan para construir una recta no vertical.'
  },
  {
    id:'recta',title:'Construir la ecuación de una recta',group:'Geometría',
    idea:'La pendiente dice cómo cambia la recta. Un punto fija por dónde pasa.',
    formula:m`y-y_1=m(x-x_1)\quad\longleftrightarrow\quad y=mx+b`,
    notes:['m es la pendiente; b es el valor de y cuando x = 0, la intersección con el eje y.','La forma y = mx + b describe rectas no verticales. Una vertical se escribe x = c. Dos puntos distintos determinan una recta.'],
    life:'Un taxi cobra $30 al iniciar y $8 por kilómetro: costo = 8 × kilómetros + 30. La tarifa inicial es la intersección, no la pendiente.',graph:'line',
    examples:[e('De dos puntos a una ecuación',[['Usa (1, 5) y (3, 9).',m`m=\frac{9-5}{3-1}=2`],['Sustituye la pendiente y el primer punto.',m`y-5=2(x-1)`],['Distribuye y suma 5 en ambos lados.',m`y=2x-2+5=2x+3`],['Ambos puntos satisfacen la ecuación.',m`2(1)+3=5,\qquad2(3)+3=9`]])],
    quiz:q('En y = 2x + 3, ¿dónde cruza la recta el eje y?',['(3, 0)','(0, 2)','(0, 3)'],2,'En el eje y, x = 0. Por eso y = 3 y el punto es (0, 3).'),bridge:'Podemos entender esa ecuación como una regla de entrada y salida.'
  },
  {
    id:'funciones',title:'Una entrada, una salida',group:'Funciones',
    idea:'Una función asigna a cada elemento de su dominio una única salida. f(x) se lee «f de x»; no significa f multiplicada por x.',
    formula:m`x\longmapsto f(x),\qquad (x,f(x))`,
    notes:['Escribir y = 2x + 3 o f(x) = 2x + 3 expresa la misma regla.','Entradas distintas pueden dar la misma salida. Lo que no se permite es que una misma entrada tenga dos salidas en la misma función.'],
    life:'Una máquina que convierte metros a centímetros aplica la función f(x) = 100x. La entrada tiene unidades de metros y la salida, de centímetros.',graph:'function',
    examples:[e('Evaluar f(x) = 2x + 3',[['Reemplaza todas las x por la entrada.',m`f(2)=2(2)+3=7`],['Si la entrada es negativa, conserva su signo.',m`f(-1)=2(-1)+3=1`],['El resultado también define un punto de la gráfica.',m`f(5)=13\quad\Rightarrow\quad(5,13)`]])],
    quiz:q('Si f(x) = x², ¿pueden −2 y 2 tener la misma salida?',['Sí, ambas dan 4','No, cada salida debe ser diferente','Solo si x es positivo'],0,'La salida de cada entrada es única. Dos entradas diferentes sí pueden compartir una salida.'),practice:'function',bridge:'Ahora preguntamos qué entradas se pueden usar y qué salidas aparecen.'
  },
  {
    id:'dominio',title:'Qué puede entrar y qué puede salir',group:'Funciones',
    idea:'El dominio reúne las entradas permitidas. El rango o imagen reúne las salidas que la función realmente alcanza. Aquí trabajamos con números reales.',
    formula:m`\text{Dominio: valores de }x\qquad\text{Rango: valores de }f(x)`,
    notes:['En una gráfica, proyecta horizontalmente para reconocer el dominio y verticalmente para reconocer el rango. La ventana dibujada puede mostrar solo una parte.','Una raíz cuadrada real necesita un radicando ≥ 0. Un denominador no puede ser cero. Los corchetes incluyen el extremo; los paréntesis lo excluyen. El infinito nunca se incluye.'],
    life:'Si x representa una longitud física, un modelo puede restringir x a valores no negativos aunque su fórmula algebraica permita más entradas.',graph:'domain',
    examples:[e('Raíz cuadrada',[['No hay raíz cuadrada real de una entrada negativa.',m`f(x)=\sqrt{x},\quad D=[0,\infty)`],['La raíz principal tampoco produce salidas negativas.',m`\operatorname{Im}(f)=[0,\infty)`]]),e('El recíproco',[['Se excluye x = 0 porque produciría una división entre cero.',m`f(x)=\frac1x,\quad D=\mathbb R\setminus\{0\}`],['La salida puede acercarse a cero, pero nunca ser cero.',m`\operatorname{Im}(f)=\mathbb R\setminus\{0\}`]])],
    quiz:q('Para f(x) = √x, ¿qué entrada no está permitida en los reales?',['0','9','−1'],2,'La raíz cuadrada de −1 no es un número real. En cambio √0 = 0 y √9 = 3.'),bridge:'Distintas fórmulas producen distintas formas de gráfica.'
  },
  {
    id:'familias',title:'Reconocer la forma de una función',group:'Funciones',
    idea:'No necesitas memorizar todas las curvas hoy. Observa su forma, dónde existen y cómo cambian. Elige una familia para compararla.',
    formula:m`\text{Fórmula}\quad\longleftrightarrow\quad\text{gráfica}\quad\longleftrightarrow\quad\text{comportamiento}`,
    notes:['En ax² + bx + c, a ≠ 0 para que la función sea cuadrática. En cálculo se usan radianes en las funciones trigonométricas.','A y b pueden cambiar la inclinación o la posición de una recta; los coeficientes de una cuadrática cambian la apertura y la posición de la parábola.'],
    life:'Una señal alterna se parece a una onda seno; el área de un cuadrado crece como el cuadrado de su lado. La forma ayuda a elegir un modelo.',graph:'families',
    examples:[e('Mirar antes de calcular',[['La recta tiene pendiente constante; la parábola cambia su pendiente.',m`f(x)=mx+b,\qquad g(x)=ax^2+bx+c\;(a\ne0)`],['Exponencial y logaritmo natural son funciones inversas.',m`\ln(e^x)=x,\qquad e^{\ln x}=x\quad(x>0)`]])],
    quiz:q('¿Qué función oscila periódicamente?',['eˣ','sen(x)','x³'],1,'Seno repite sus valores cada 2π radianes. La exponencial y la cúbica no son periódicas.'),bridge:'Además de evaluar, podemos estudiar a qué valor se aproxima una función.'
  },
  {
    id:'limites',title:'Acercarse a un valor',group:'Cambio',
    idea:'Un límite describe a qué valor se aproxima f(x) cuando x se acerca a un número. No exige que x sea exactamente ese número.',
    formula:m`\lim_{x\to a}f(x)=L`,
    notes:['Para una función continua en a, basta evaluar f(a). Por ejemplo, el límite de 2x + 3 cuando x → 2 es 7.','0/0 es una forma indeterminada: no es una respuesta ni significa que el límite no exista. Debemos estudiar la expresión.'],
    life:'Puedes observar hacia qué temperatura se acerca un sensor aunque falte justo una lectura. Aproximarse y tener una lectura exacta son preguntas distintas.',graph:'limit',
    examples:[e('Un hueco que no impide el límite',[['La sustitución directa da 0/0.',m`\lim_{x\to2}\frac{x^2-4}{x-2}`],['Factoriza la diferencia de cuadrados.',m`x^2-4=(x-2)(x+2)`],['Cancela solo para x ≠ 2. La función original sigue sin estar definida en 2.',m`\frac{(x-2)(x+2)}{x-2}=x+2\quad(x\ne2)`],['Al acercarse x a 2, x + 2 se acerca a 4.',m`\lim_{x\to2}\frac{x^2-4}{x-2}=4`]])],
    quiz:q('En este ejemplo, ¿qué sabemos en x = 2?',['La función vale 4','La función no está definida, pero su límite es 4','El límite es 0/0'],1,'La expresión original tiene denominador cero en 2. Su comportamiento alrededor de 2 sí se aproxima a 4.'),bridge:'Para confirmar un límite, miramos lo que ocurre desde ambos lados.'
  },
  {
    id:'laterales',title:'Mirar desde los dos lados',group:'Cambio',
    idea:'El límite por la izquierda usa entradas menores que a. El límite por la derecha usa entradas mayores. Un límite bilateral finito existe si ambos laterales existen y coinciden.',
    formula:m`\lim_{x\to a^-}f(x)=\lim_{x\to a^+}f(x)=L`,
    notes:['Una función es continua en a si f(a) está definida, existe el límite y el límite es f(a).','Un círculo vacío marca un punto excluido; un punto relleno indica el valor asignado. Cambiar solo el valor en a no cambia los límites laterales.'],
    life:'Al pasar un umbral, una tarifa puede saltar de $20 a $30. Acercarse al umbral desde precios de un lado o del otro puede llevar a valores diferentes.',graph:'continuity',
    examples:[e('Cuatro situaciones',[['Continua: el valor y el límite coinciden.',m`f(x)=x+2:\quad\lim_{x\to2}f(x)=f(2)=4`],['Hueco: el límite existe aunque no haya valor en ese punto.',m`f(x)=x+2\;(x\ne2):\quad\lim_{x\to2}f(x)=4`],['Valor distinto: asignar f(2) = 1 no altera la aproximación.',m`\lim_{x\to2}f(x)=4\ne f(2)=1`],['Salto: si los laterales difieren, no hay límite bilateral.',m`\lim_{x\to2^-}f(x)=1,\quad\lim_{x\to2^+}f(x)=3`]])],
    quiz:q('El límite izquierdo es 1 y el derecho es 3. ¿Cuál es el límite bilateral?',['2, el promedio','3','No existe'],2,'No se promedian los límites laterales. Deben coincidir para que exista un mismo límite bilateral.'),bridge:'Acercar dos puntos de una curva nos lleva a la derivada.'
  },
  {
    id:'derivada',title:'Del cambio promedio al instantáneo',group:'Cambio',
    idea:'Una secante une dos puntos de una curva. Cuando el segundo se acerca al primero, sus pendientes pueden aproximarse a la pendiente de la tangente: la derivada.',
    formula:m`f'(x)=\lim_{h\to0}\frac{f(x+h)-f(x)}h`,
    notes:['El cociente mide un cambio promedio para h ≠ 0. Su límite, cuando existe, mide el cambio instantáneo.','Una función puede no tener derivada en algún punto. Por ejemplo, |x| tiene una esquina en x = 0.'],
    life:'La velocidad promedio usa una distancia y un intervalo de tiempo. La velocidad instantánea describe el cambio de posición en un instante.',graph:'derivative',
    examples:[e('Derivar x² desde la definición',[['Sustituye f(x + h) y f(x).',m`\frac{(x+h)^2-x^2}{h}`],['Desarrolla el cuadrado y simplifica.',m`\frac{x^2+2xh+h^2-x^2}{h}=\frac{2xh+h^2}{h}`],['Divide entre h mientras h ≠ 0.',m`2x+h`],['Ahora toma el límite.',m`f'(x)=\lim_{h\to0}(2x+h)=2x`],['En x = 1, la tangente tiene pendiente 2.',m`f'(1)=2`]])],
    quiz:q('Si f(x) = x², ¿cuál es la pendiente instantánea en x = 3?',['9','6','3'],1,'La derivada es f′(x) = 2x. Evaluada en 3 vale 6; f(3) = 9 es la altura, no la pendiente.'),practice:'derivative',bridge:'Las reglas permiten derivar sin volver siempre a la definición.'
  },
  {
    id:'reglas',title:'Elegir la regla de derivación',group:'Cambio',
    idea:'Primero reconoce la estructura: ¿hay una suma, un producto, un cociente o una función dentro de otra? Después aplica su regla.',
    formula:m`(x^n)'=nx^{n-1},\quad(c)'=0,\quad(cf)'=cf',\quad(f\pm g)'=f'\pm g'`,
    notes:[m`(fg)'=f'g+fg',\qquad\left(\frac fg\right)'=\frac{f'g-fg'}{g^2}\;(g\ne0)`,m`(f\circ g)'(x)=f'(g(x))g'(x)`,m`(e^x)'=e^x,\quad(\ln x)'=1/x\;(x>0),\quad(\sin x)'=\cos x,\quad(\cos x)'=-\sin x`, 'Estas reglas se usan donde las funciones involucradas son derivables. La regla de potencia se interpreta en el dominio donde la potencia y su derivada están definidas.'],
    life:'Si una longitud depende del tiempo y el área depende de esa longitud, el cambio del área combina ambos cambios: esa composición usa la regla de la cadena.',
    examples:[e('Suma y constantes',[['Deriva cada término, conservando sus factores.',m`(3x^2-4x+7)'=3(2x)-4(1)+0=6x-4`]]),e('Producto',[['No basta con multiplicar las derivadas.',m`(x^2e^x)'=(2x)e^x+x^2e^x`]]),e('Cociente',[['Identifica numerador f = x y denominador g = x + 1.',m`\left(\frac{x}{x+1}\right)'=\frac{1(x+1)-x(1)}{(x+1)^2}`],['Simplifica. El punto x = −1 sigue excluido.',m`\frac1{(x+1)^2}\quad(x\ne-1)`]]),e('Cadena',[['La función exterior eleva al cuadrado y la interior es 3x + 1.',m`((3x+1)^2)'=2(3x+1)\cdot3`],['Incluye siempre la derivada de la función interior.',m`6(3x+1)`]])],
    quiz:q('Para derivar sen(x²), ¿qué regla necesitas además de la derivada de seno?',['Cadena','Solo suma','Solo cociente'],0,'Hay una función dentro de otra: la derivada es cos(x²) · 2x.'),bridge:'En varias dimensiones necesitaremos describir cambios con más componentes.'
  },
  {
    id:'vectores',title:'Una cantidad con dirección',group:'Varias variables',
    idea:'Un punto señala una ubicación. Un vector describe un desplazamiento u otra cantidad con componentes y dirección; puede representarse con una flecha desde distintos puntos.',
    formula:m`\vec v=(v_1,v_2),\quad(v_1,v_2,v_3),\quad(v_1,\ldots,v_n)`,
    notes:['Suma y resta componente a componente. Un escalar multiplica todas las componentes.','En tres dimensiones aparece una tercera dirección; en n dimensiones se conserva la misma idea algebraica.'],
    life:'Una fuerza puede descomponerse en una parte horizontal y otra vertical. Sumar fuerzas exige sumar sus componentes, no solo sus tamaños.',graph:'vectors',
    examples:[e('Operar componente a componente',[['Suma a = (2, 1) y b = (−1, 3).',m`(2,1)+(-1,3)=(1,4)`],['Resta las componentes correspondientes.',m`(2,1)-(-1,3)=(3,-2)`],['Un factor negativo también invierte el sentido.',m`-2(2,1)=(-4,-2)`],['El desplazamiento de un punto a otro es un vector.',m`\overrightarrow{PQ}=(x_Q-x_P,y_Q-y_P)`]])],
    quiz:q('¿Cuánto es 3(2, −1)?',['(6, −3)','(5, 2)','(6, −1)'],0,'Multiplica ambas componentes por 3: (3·2, 3·(−1)) = (6, −3).'),bridge:'Una salida también puede depender de varias entradas a la vez.'
  },
  {
    id:'varias',title:'Cuando la salida depende de dos entradas',group:'Varias variables',
    idea:'En y = f(x) hay una entrada. En z = f(x, y) hay dos entradas independientes y una salida. Una gráfica en tres dimensiones puede representar una superficie.',
    formula:m`z=f(x,y)=x^2+3xy+y^2`,
    notes:['Evaluar sigue siendo sustituir: reemplaza cada variable por su valor.','Una tabla o un mapa de colores también puede representar la salida para distintas parejas de entradas. No confundas el valor de salida con una tercera entrada.'],
    life:'La temperatura de una lámina depende de dónde se mida: T(x, y). Dos coordenadas ubican el punto y la salida indica su temperatura.',graph:'surface',
    examples:[e('Evaluar dos entradas',[['Usa x = 1 y y = 2.',m`f(1,2)=1^2+3(1)(2)+2^2`],['Haz primero potencias y productos.',m`f(1,2)=1+6+4=11`]])],
    quiz:q('En z = f(x, y), ¿qué representan x e y?',['Dos entradas','Dos salidas','Una entrada y una derivada'],0,'La pareja (x, y) forma la entrada; z es el único valor de salida de esa pareja.'),practice:'surface',bridge:'Podemos estudiar el cambio en una dirección manteniendo fija la otra entrada.'
  },
  {
    id:'parciales',title:'Cambiar una variable a la vez',group:'Varias variables',
    idea:'Una derivada parcial mide cómo cambia una función al variar una entrada y mantener constantes las demás.',
    formula:m`\frac{\partial f}{\partial x}=2x+3y,\qquad\frac{\partial f}{\partial y}=3x+2y`,
    notes:['Estas expresiones corresponden a f(x, y) = x² + 3xy + y². Se aplican las reglas de una variable.','Constante no significa cero: al derivar respecto de x, 3y actúa como un coeficiente y la derivada de 3yx es 3y. Un término entero sin x sí deriva a cero.'],
    life:'Para estudiar cómo cambia la temperatura al caminar hacia el este, mantienes fija tu coordenada norte-sur. Es un cambio en una dirección específica.',graph:'partial',
    examples:[e('Respecto de x',[['Considera y constante.',m`\frac{\partial}{\partial x}(x^2+3xy+y^2)=2x+3y+0`],['En (1, 2), el cambio en la dirección x es 8.',m`f_x(1,2)=2(1)+3(2)=8`]]),e('Respecto de y',[['Ahora x es constante.',m`\frac{\partial}{\partial y}(x^2+3xy+y^2)=0+3x+2y`],['En el mismo punto, la dirección y da otro cambio.',m`f_y(1,2)=3(1)+2(2)=7`]])],
    quiz:q('Al derivar 3xy respecto de x, ¿qué obtienes?',['3x','3y','0'],1,'y permanece constante. Es como derivar (3y)·x: su derivada respecto de x es 3y.'),bridge:'La integración plantea una pregunta inversa: ¿qué función tiene esta derivada?'
  },
  {
    id:'indefinida',title:'Reconstruir una función',group:'Acumulación',
    idea:'Una integral indefinida representa una familia de antiderivadas: funciones cuya derivada es el integrando.',
    formula:m`\int3x^2\,dx=x^3+C`,
    notes:['∫ es el símbolo de integral; 3x² es el integrando; dx indica que integramos respecto de x; C es una constante arbitraria.','Las funciones que difieren en una constante tienen la misma derivada. En un intervalo, se conserva +C para representar toda la familia.',m`\int x^n\,dx=\frac{x^{n+1}}{n+1}+C\quad(n\ne-1)`,m`\int\frac1x\,dx=\ln|x|+C\quad\text{en intervalos que no contienen }0`],
    life:'Conocer una velocidad permite recuperar una posición mediante integración. Hace falta un dato inicial para fijar la constante.',
    examples:[e('La regla de potencia',[['Aumenta el exponente en 1 y divide entre ese nuevo exponente.',m`\int4x^3\,dx=4\frac{x^4}{4}+C=x^4+C`],['La integral de una constante c es cx + C.',m`\int(2x+5)\,dx=x^2+5x+C`],['Comprueba derivando el resultado.',m`(x^2+5x+C)'=2x+5`]]),e('Por qué aparece C',[['Todas estas funciones tienen derivada 3x².',m`(x^3)'=(x^3+7)'=(x^3-2)'=3x^2`],['Un dato adicional permite elegir una de ellas.',m`F(0)=7\quad\Rightarrow\quad F(x)=x^3+7`]])],
    quiz:q('¿Qué representa C en una integral indefinida?',['Una constante arbitraria','La variable de integración','Siempre cero'],0,'Derivar una constante da cero. Por eso muchas funciones distintas comparten la misma derivada.'),bridge:'Si fijamos un intervalo, podemos calcular una acumulación concreta.'
  },
  {
    id:'definida',title:'Acumular sobre un intervalo',group:'Acumulación',
    idea:'La integral definida mide acumulación. En una gráfica de y = f(x), corresponde al área con signo entre la curva y el eje x: arriba suma, abajo resta.',
    formula:m`\int_a^b f(x)\,dx=F(b)-F(a),\qquad F'=f`,
    notes:['Para f continua en [a, b], el teorema fundamental permite calcular esta acumulación con una antiderivada F.','La indefinida da una familia de funciones; la definida, un número. La constante se cancela al restar los valores de F.','El área geométrica total no resta las regiones bajo el eje: se obtiene integrando |f(x)|.'],
    life:'Si el caudal de entrada es 2 litros por minuto durante 3 minutos, la integral acumula 6 litros. Las unidades de salida son caudal × tiempo.',graph:'area',
    examples:[e('Integrar 2x de 0 a 2',[['Encuentra una antiderivada.',m`F(x)=x^2`],['Evalúa en el extremo superior y resta el inferior.',m`\int_0^2 2x\,dx=[x^2]_0^2=4-0=4`],['En la gráfica también es un triángulo de base 2 y altura 4.',m`A=\frac{2\cdot4}{2}=4`]]),e('Área con signo',[['Para f(x) = x, las contribuciones de −1 a 0 y de 0 a 1 se cancelan.',m`\int_{-1}^{1}x\,dx=\frac12-\frac12=0`],['Las dos áreas geométricas son positivas.',m`\int_{-1}^{1}|x|\,dx=1`]])],
    quiz:q('Una integral definida vale 0. ¿Puede haber regiones con área no nula?',['Sí, pueden cancelarse las contribuciones','No, la gráfica tiene que ser el eje x','No existe esa integral'],0,'Una parte positiva y una negativa pueden cancelarse. Integral con signo y área geométrica total no siempre son iguales.'),practice:'area',bridge:'No toda integral se resuelve con una sola regla de potencia.'
  },
  {
    id:'metodos',title:'Reconocer qué método puede ayudar',group:'Acumulación',
    idea:'La forma del integrando orienta la técnica. Hoy basta con reconocer la idea y seguir un ejemplo; dominar los métodos requerirá práctica posterior.',
    formula:m`u=g(x)\qquad\qquad\int u\,dv=uv-\int v\,du`,
    notes:['Sustitución: deshace una composición y está relacionada con la regla de la cadena. Busca una función interior junto con su derivada.','Por partes: nace de la regla del producto. Una elección útil de u y dv debe simplificar la integral restante.','Otras herramientas: fracciones parciales para ciertos cocientes; identidades trigonométricas para reescribir productos o potencias; sustituciones trigonométricas para ciertas raíces; simplificación algebraica antes de integrar.'],
    life:'Antes de calcular una acumulación en un modelo de ingeniería, reescribir la expresión puede convertir una integral difícil en una conocida.',
    examples:[e('Sustitución',[['Elige la expresión interior y calcula su diferencial.',m`\int2x\cos(x^2)\,dx,\qquad u=x^2,\quad du=2x\,dx`],['La nueva integral es directa.',m`\int\cos u\,du=\sin u+C`],['Regresa a la variable original.',m`\sin(x^2)+C`]]),e('Por partes',[['Elige u = x y dv = eˣ dx.',m`du=dx,\qquad v=e^x`],['Aplica la fórmula.',m`\int xe^x\,dx=xe^x-\int e^x\,dx`],['Completa la integral restante.',m`xe^x-e^x+C`]]),e('Simplificar antes',[['Divide cada término entre x; considera x ≠ 0.',m`\int\frac{x^2+x}{x}\,dx=\int(x+1)\,dx`],['Ahora basta la regla de potencia.',m`\frac{x^2}{2}+x+C`]])],
    quiz:q('En ∫ 2x cos(x²) dx, ¿qué sustitución conecta con 2x dx?',['u = x²','u = cos(x)','u = 2'],0,'Si u = x², entonces du = 2x dx. La integral se convierte en ∫ cos(u) du.'),bridge:'También podemos acumular sobre una región de dos dimensiones.'
  },
  {
    id:'multiples',title:'Acumular sobre una región',group:'Acumulación',
    idea:'Una integral doble suma contribuciones sobre una región del plano. En un rectángulo puede calcularse integrando una variable y después la otra.',
    formula:m`\iint_R f(x,y)\,dA=\int_a^b\!\int_c^d f(x,y)\,dy\,dx`,
    notes:['Aquí R = [a, b] × [c, d]. Para funciones continuas sobre este rectángulo, la integral doble se puede escribir así.','Se comienza por la integral interior: dy indica integrar respecto de y, manteniendo x constante. Después se integra respecto de x.','Si f ≥ 0 representa una altura, la integral doble mide volumen bajo la superficie. Si representa densidad superficial, mide masa.','Más adelante: regiones con límites variables, cambio del orden de integración e integrales triples. Cambiar el orden exige describir la misma región correctamente.'],
    life:'Una lámina puede tener distinta densidad en cada punto. La integral doble acumula la masa de pequeñas porciones de toda la lámina.',graph:'double',
    examples:[e('Un rectángulo sencillo',[['Integra x + y en 0 ≤ x ≤ 1 y 0 ≤ y ≤ 2.',m`\int_0^1\!\int_0^2(x+y)\,dy\,dx`],['Primero y; x actúa como constante.',m`\int_0^2(x+y)\,dy=\left[xy+\frac{y^2}{2}\right]_0^2=2x+2`],['Queda una integral de una variable.',m`\int_0^1(2x+2)\,dx=[x^2+2x]_0^1=3`]])],
    quiz:q('En la integral iterada con dy dx, ¿qué variable se integra primero?',['x','y','Ambas al mismo tiempo'],1,'El diferencial interior es dy: integras primero y, con x constante. Luego integras el resultado respecto de x.'),bridge:'Todo el recorrido comparte unas pocas ideas: representar, medir cambios y acumular.'
  },
  {
    id:'cierre',title:'Decidir por dónde seguir',group:'Tu recorrido',
    idea:'Este recorrido es una primera conversación, no una prueba de velocidad. Haber visto un tema no significa tener que dominarlo. El siguiente paso es elegir qué bases conviene trabajar.',
    formula:m`\text{Representar}\quad\to\quad\text{medir cambios}\quad\to\quad\text{acumular}`,
    notes:['Aritmética y álgebra → puntos → rectas → funciones → límites → derivadas → integrales.','Vectores → funciones de varias variables → derivadas parciales → integrales múltiples.','Si cuesta operar o despejar, empieza ahí. Si las operaciones fluyen, practica funciones y gráficas antes de profundizar en límites, derivadas e integrales.'],
    life:'En un proyecto, primero identificas las cantidades y construyes un modelo. Después puedes preguntar cómo cambia y cuánto acumula. Ese es el hilo común del cálculo.',
    examples:[], bridge:'El resumen de abajo sirve para conversar con Erik y preparar la siguiente sesión.'
  }
];

export const families = [
  {id:'linear',name:'Lineal / afín',tex:m`f(x)=2x+1`,fn:x=>2*x+1,domain:'Dominio: ℝ. Rango: ℝ en este ejemplo.',detail:'Recta de pendiente 2 e intersección 1. La forma general es mx + b; si m = 0, el rango es solo {b}.'},
  {id:'square',name:'Cuadrática',tex:m`f(x)=x^2`,fn:x=>x*x,domain:'Dominio: ℝ. Rango: [0, ∞).',detail:'Parábola con mínimo en (0, 0). Entradas opuestas tienen la misma salida.'},
  {id:'cube',name:'Cúbica',tex:m`f(x)=x^3`,fn:x=>x*x*x,domain:'Dominio: ℝ. Rango: ℝ.',detail:'Crece de izquierda a derecha; conserva el signo de la entrada.'},
  {id:'reciprocal',name:'Racional',tex:m`f(x)=1/x`,fn:x=>1/x,domain:'Dominio: ℝ excepto 0. Rango: ℝ excepto 0.',detail:'Dos ramas. Se acerca a los ejes sin tocarlos. No hay un tramo que una las ramas a través de x = 0.'},
  {id:'root',name:'Radical',tex:m`f(x)=\sqrt{x}`,fn:x=>Math.sqrt(x),domain:'Dominio: [0, ∞). Rango: [0, ∞).',detail:'Comienza en (0, 0), crece y se va haciendo menos inclinada.'},
  {id:'absolute',name:'Valor absoluto',tex:m`f(x)=|x|`,fn:x=>Math.abs(x),domain:'Dominio: ℝ. Rango: [0, ∞).',detail:'Tiene forma de V. Mide la distancia de x a 0; nunca da valores negativos.'},
  {id:'sine',name:'Seno',tex:m`f(x)=\sin x`,fn:Math.sin,domain:'Dominio: ℝ. Rango: [−1, 1].',detail:'Onda de período 2π. Aquí x se mide en radianes y la gráfica pasa por (0, 0).'},
  {id:'cosine',name:'Coseno',tex:m`f(x)=\cos x`,fn:Math.cos,domain:'Dominio: ℝ. Rango: [−1, 1].',detail:'Onda de período 2π, con f(0) = 1. Aquí x se mide en radianes.'},
  {id:'exp',name:'Exponencial',tex:m`f(x)=e^x`,fn:Math.exp,domain:'Dominio: ℝ. Rango: (0, ∞).',detail:'Siempre positiva; pasa por (0, 1). Su crecimiento se acelera hacia la derecha.'},
  {id:'log',name:'Logaritmo natural',tex:m`f(x)=\ln x`,fn:Math.log,domain:'Dominio: (0, ∞). Rango: ℝ.',detail:'Solo admite x > 0. Pasa por (1, 0) y crece cada vez más despacio.'}
];

export function numberValue(raw) {
  const s=String(raw).trim().replace(',', '.').replace(/−/g,'-');
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\s*\/\s*[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(s)) return NaN;
  const [a,b]=s.split('/').map(Number);
  return b===undefined?a:(b===0?NaN:a/b);
}
export function makePractice(kind, seed) {
  const n=2+seed%5;
  switch(kind) {
    case 'bases': return {tex:m`\frac{${n}}{6}+\frac16`,answer:(n+1)/6,explain:m`\frac{${n}+1}{6}=\frac{${n+1}}6`,hint:'El denominador ya es común. Suma los numeradores y simplifica si puedes.'};
    case 'distance': return {tex:m`P=(0,0),\ Q=(${3*n},${4*n}).\quad d=?`,answer:5*n,explain:m`d=\sqrt{${3*n}^2+${4*n}^2}=${5*n}`,hint:'Usa Pitágoras: eleva al cuadrado ambos cambios, suma y toma la raíz.'};
    case 'slope': return {tex:m`\Delta y=${-2*n},\quad\Delta x=${n}.\quad m=?`,answer:-2,explain:m`m=\frac{${-2*n}}{${n}}=-2`,hint:'Divide el cambio vertical entre el horizontal, conservando los signos.'};
    case 'function': return {tex:m`f(x)=2x+3.\quad f(${n})=?`,answer:2*n+3,explain:m`f(${n})=2(${n})+3=${2*n+3}`,hint:'Sustituye x por la entrada. Multiplica antes de sumar.'};
    case 'derivative': return {tex:m`f(x)=x^2.\quad f'(${n})=?`,answer:2*n,explain:m`f'(x)=2x\Rightarrow f'(${n})=${2*n}`,hint:'Primero deriva; luego evalúa. La altura x² no es la pendiente.'};
    case 'surface': return {tex:m`f(x,y)=x^2+3xy+y^2.\quad f(1,${n})=?`,answer:1+3*n+n*n,explain:m`1+3(${n})+${n}^2=${1+3*n+n*n}`,hint:'Reemplaza x por 1 e y por el valor dado en los tres términos.'};
    case 'area': return {tex:m`\int_0^{${n}}2x\,dx=?`,answer:n*n,explain:m`[x^2]_0^{${n}}=${n}^2-0=${n*n}`,hint:'Una antiderivada es x². Evalúa arriba y resta el valor de abajo.'};
    default: throw new Error('Práctica desconocida');
  }
}
