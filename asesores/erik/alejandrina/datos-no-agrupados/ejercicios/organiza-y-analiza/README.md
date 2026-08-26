# Ejercicio: organiza y analiza

Práctica de cinco actividades conectadas:

1. ordenar datos, identificar valores distintos, \(n\) y una frecuencia;
2. completar columnas variables de \(f_i\), \(h_i\), \(p_i\), \(F_i\) y \(P_i\);
3. interpretar una tabla completa;
4. calcular media, mediana y moda en casos pares, impares, bimodales, sin moda y con valores extremos;
5. calcular media y mediana desde una tabla resumida.

## Archivos

- `index.html`: consignas, controles accesibles, tablas y regiones de retroalimentación.
- `script.mjs`: generación, validación por campo y procedimientos.
- `estilos.css`: incorpora `../../estadistica.css`.
- `ejercicio.json`: metadatos.

`script.mjs` importa la lógica matemática de `../../estadistica.mjs`. No dupliques esas funciones.

## Criterios y pruebas

- \(h_i\) se responde con dos decimales y los porcentajes con uno; se admiten diferencias razonables de redondeo.
- La tabla debe comprobar \(\sum f_i=n\), \(\sum h_i=1\), \(\sum p_i=100\%\), \(F_{\text{final}}=n\) y \(P_{\text{final}}=100\%\).
- La moda admite una, varias o la respuesta “sin moda”.
- Prueba respuestas vacías, parciales, incorrectas y corregidas; varias generaciones; teclado; 360–1440 px; KaTeX y consola.
