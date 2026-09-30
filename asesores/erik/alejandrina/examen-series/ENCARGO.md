Crea una nueva sesión de práctica de **sucesiones y series aritméticas y geométricas** dentro del sitio existente.

## Forma de trabajo

Implementa esta sesión **por etapas, en el orden indicado**. No intentes construir todo de una sola vez.

Al terminar cada etapa:
1. Comprueba que funciona correctamente.
2. Conserva todo lo ya implementado.
3. Continúa con la siguiente etapa.
4. Si el proceso se interrumpe, debe poder retomarse desde la última etapa terminada sin rehacer las anteriores.

Respeta el diseño, componentes, navegación y convenciones ya existentes en el sitio.

## Reglas globales

- Usa LaTeX para la notación matemática, especialmente fracciones, raíces, potencias y subíndices.
- Salvo los mini exámenes, los ejercicios deben generarse automáticamente y permitir práctica prácticamente ilimitada.
- Dificultad progresiva: primeros ejercicios sencillos; después negativos, fracciones y casos más complejos.
- Mantén números y resultados razonables.
- Acepta fracciones equivalentes.
- Validación inmediata de respuestas.
- No agregues teoría ni explicaciones innecesarias: yo explicaré los procedimientos.
- Cuando corresponda, incluye el selector **Ambas | Solo aritméticas | Solo geométricas**.
- Cada caso dentro de una actividad debe aparecer como una sección independiente, una debajo de otra.
- Mantén navegación clara mediante **Siguiente/Continuar** y acceso desde el menú principal de la sesión.

---

# ETAPA 1 — Menú + Identificación

Crea el menú de actividades de la sesión.

### Actividad 1 — Identificar la sucesión

Genera sucesiones y pregunta únicamente:

**Aritmética | Geométrica**

Empieza con enteros sencillos y aumenta progresivamente la dificultad con negativos y fracciones.

No mostrar explicaciones.

Agregar **Continuar**.

---

# ETAPA 2 — Hallar \(d\) o \(r\)

Agregar selector **Ambas | Solo aritméticas | Solo geométricas**.

Crear estas secciones:

### Caso 1 — Se proporciona la sucesión
Debe hallar \(d\) o \(r\).

### Caso 2 — Dos términos consecutivos
Ejemplo:

\[
a_5=12,\qquad a_6=17
\]

Debe hallar \(d\) o \(r\).

### Caso 3 — Se proporcionan \(a_1\) y \(a_n\)

Indicar si es aritmética o geométrica y mostrar:

\[
d=\frac{a_n-a_1}{n-1}
\]

\[
r=\sqrt[n-1]{\frac{a_n}{a_1}}
\]

### Caso 4 — Dos términos cualesquiera \(a_m\) y \(a_n\)

Indicar el tipo y mostrar:

\[
d=\frac{a_n-a_m}{n-m}
\]

\[
r=\sqrt[n-m]{\frac{a_n}{a_m}}
\]

Variar los índices.

### Razones negativas

Normalmente preguntar **“Halla \(r\)”**.

Solo cuando una raíz de índice par permita ambas posibilidades, especificar aleatoriamente:

**Halla \(r\) positiva.**

o

**Halla \(r\) negativa.**

No explicar el \(\pm\).

Los primeros 3 ejercicios de cada sección deben ser sencillos. Después introducir gradualmente negativos, fracciones, \(d\) y \(r\) fraccionarias e índices más separados.

---

# ETAPA 3 — Hallar \(a_1\)

Crear tres secciones:

### Caso 1
Se proporciona una sucesión y debe identificar \(a_1\).

### Caso 2
Se proporciona \(a_n\), \(n\) y \(d\) o \(r\).

Mostrar:

\[
a_1=a_n-(n-1)d
\]

\[
a_1=\frac{a_n}{r^{n-1}}
\]

### Caso 3
Se proporcionan dos términos cualesquiera \(a_m\) y \(a_n\).

Primero debe hallar \(d\) o \(r\) y después \(a_1\):

\[
a_1=a_m-(m-1)d
\]

\[
a_1=\frac{a_m}{r^{m-1}}
\]

---

# ETAPA 4 — Hallar \(a_n\) y \(n\)

Ambos pertenecen a la misma actividad, en dos secciones.

### Hallar \(a_n\)

Proporcionar \(a_1\), \(d\) o \(r\), y \(n\).

\[
a_n=a_1+(n-1)d
\]

\[
a_n=a_1r^{n-1}
\]

### Hallar \(n\)

Proporcionar \(a_1\), \(a_n\) y \(d\) o \(r\).

\[
n=\frac{a_n-a_1}{d}+1
\]

\[
n=\frac{\ln\left(\frac{a_n}{a_1}\right)}{\ln(r)}+1
\]

En los geométricos para hallar \(n\), usar \(r>0\), \(r\neq1\) y generar siempre resultados con \(n\) entero.

---

# ETAPA 5 — Sumas

Usar solamente estas dos fórmulas base:

\[
S_n=\frac{n(a_1+a_n)}{2}
\]

\[
S_n=\frac{a_1(r^n-1)}{r-1}
\]

Crear cinco secciones:

### Caso 1
Dar \(a_1\), \(a_n\) y \(n\), indicando el tipo. Debe obtener lo necesario y calcular \(S_n\).

### Caso 2
Dar una sucesión y \(n\). Debe identificar \(a_1\), hallar \(d/r\), calcular \(a_n\) y finalmente \(S_n\).

### Caso 3
Dar dos términos \(a_i\) y \(a_j\) y pedir \(S_n\). Debe hallar \(d/r\), \(a_1\), \(a_n\) y finalmente \(S_n\).

### Caso 4 — Despejes

Para aritméticas:

\[
n=\frac{2S_n}{a_1+a_n}
\]

\[
a_1=\frac{2S_n}{n}-a_n
\]

\[
a_n=\frac{2S_n}{n}-a_1
\]

Para geométricas:

\[
a_1=\frac{S_n(r-1)}{r^n-1}
\]

\[
n=\frac{\ln\left(\frac{S_n(r-1)}{a_1}+1\right)}{\ln(r)}
\]

### Caso 5 — Suma entre posiciones

Pedir la suma desde \(a_m\) hasta \(a_n\):

\[
\text{Suma de }a_m\text{ a }a_n=S_n-S_{m-1}
\]

---

# ETAPA 6 — Mini examen de ejercicios

Esta sección es diferente: **NO generar ejercicios automáticamente**.

Crea un conjunto fijo y prehecho de ejercicios bien diseñados.

Debe incluir aproximadamente un ejercicio de cada tipo trabajado, pero presentados en orden aleatorio.

Mezclar preguntas de:

- \(d/r\)
- \(a_1\)
- \(a_n\)
- \(n\)
- \(S_n\)
- suma entre posiciones
- combinaciones de los casos anteriores

No indicar qué fórmula ni qué caso corresponde. La alumna debe decidir el procedimiento.

Mantener selector:

**Ambas | Solo aritméticas | Solo geométricas**

---

# ETAPA 7 — Mini examen de problemas aplicados

Crear otro conjunto **fijo/prehecho**, no generado automáticamente.

Usar problemas contextualizados en situaciones reales que involucren sucesiones o series aritméticas y geométricas.

Mezclar objetivos: hallar \(d/r\), términos, posiciones, sumas, cantidades acumuladas, sumas entre posiciones, etc.

No indicar qué fórmula utilizar.

Los problemas pueden diferir ligeramente de los formatos practicados para comprobar comprensión real.

Mantener:

**Ambas | Solo aritméticas | Solo geométricas**

Debe haber suficientes problemas fijos para que cada filtro conserve una cantidad representativa.

---

# ETAPA 8 — Medios aritméticos y geométricos

Esta será la última actividad y tendrá dos secciones separadas.

### Medios aritméticos

Mostrar:

\[
d=\frac{b-a}{k+1}
\]

donde \(k\) es la cantidad de medios a insertar.

Generar ejercicios dando los dos extremos y \(k\).

Representarlos visualmente mediante una casilla editable por cada medio. Ejemplo:

\[
4\quad [\ ]\quad[\ ]\quad[\ ]\quad20
\]

La alumna debe completar todas las casillas.

Empezar con resultados enteros y después introducir negativos y fracciones.

### Medios geométricos

Mostrar:

\[
r=\sqrt[k+1]{\frac{b}{a}}
\]

Usar la misma dinámica visual:

\[
2\quad[\ ]\quad[\ ]\quad54
\]

La alumna debe completar todos los medios.

Empezar con razones enteras y raíces exactas y aumentar progresivamente la dificultad.

Primero presentar y trabajar los **medios aritméticos** y después los **medios geométricos**.

---

# ETAPA 9 — Revisión final

Cuando todas las etapas estén implementadas:

- verifica navegación y menú;
- verifica generación y validación de respuestas;
- comprueba los filtros aritmética/geométrica;
- comprueba LaTeX;
- comprueba respuestas con fracciones;
- comprueba que los generadores no produzcan ejercicios inválidos;
- comprueba dificultad progresiva;
- confirma que los dos mini exámenes permanezcan fijos y no se regeneren;
- revisa funcionamiento en móvil y escritorio;
- corrige cualquier error encontrado.

No rediseñes innecesariamente partes existentes del sitio. Implementa la sesión siguiendo estas etapas y comienza por la **ETAPA 1**.