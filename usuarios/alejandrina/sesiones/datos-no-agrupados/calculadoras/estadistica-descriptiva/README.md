# Calculadora de estadística descriptiva

Analiza hasta 200 datos no agrupados enteros o decimales. Acepta comas o espacios, conserva la lista original y genera:

- datos ordenados, \(n\), suma y cantidad de valores distintos;
- tabla con \(x_i\), \(f_i\), \(h_i\), \(p_i\), \(F_i\) y \(P_i\);
- media, mediana y una, varias o ninguna moda;
- gráfica de frecuencia absoluta y gráfica porcentual;
- procedimientos y cinco comprobaciones de consistencia.

## Archivos

- `index.html`: formulario, resultados, tablas, gráficas y regiones accesibles.
- `script.mjs`: validación y renderizado; importa `../../estadistica.mjs`.
- `estilos.css`: incorpora `../../estadistica.css`.
- `calculadora.json`: metadatos.

Los cálculos internos no se redondean. La interfaz muestra \(h_i\) con hasta cuatro decimales, porcentajes con uno y medidas con hasta cuatro.

## Pruebas mínimas

- vacío, separadores inválidos, letras y más de 200 datos;
- espacios y comas;
- negativos, cero y decimales;
- cantidad par e impar;
- una moda, varias y sin moda;
- una frecuencia mucho mayor y muchos valores distintos;
- coincidencia entre tabla y gráficas, altura controlada, desplazamiento horizontal;
- limpiar, ejemplos, teclado, 360–1440 px, KaTeX y consola.
