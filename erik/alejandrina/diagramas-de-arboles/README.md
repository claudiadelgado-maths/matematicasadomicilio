# Diagramas de árboles

Fecha editorial de la versión publicada: `2026-07-29`.

## Estado

Sesión publicada para el espacio de Alejandrina. La explicación, los ejercicios, la calculadora y el juego están disponibles.

## Objetivo

Comprender y utilizar diagramas de árbol para organizar posibilidades y representar procesos por etapas. La teoría actual se concentra en la estructura y no introduce cálculos de probabilidad.

## Componentes

- `explicacion/`: teoría publicada sobre colección, regla, etapas, construcción e interpretación.
- `ejercicios/construye-el-arbol/`: tres ejercicios generativos publicados.
- `calculadoras/constructor-de-diagramas/`: calculadora publicada para crear colecciones y estudiar cómo cambian las ramas.
- `juegos/elige-el-camino/`: juego generativo publicado para recorrer un árbol como mapa.

Los cuatro componentes están marcados como `publicado`.

## Lógica compartida

`arboles.mjs` genera la estructura matemática basada en categorías, cantidades, regla y etapas para los ejercicios y la calculadora. El juego usa plantillas propias porque representa un mapa asimétrico y no una colección de extracciones; conserva la misma estructura lógica de nodos, ramas, caminos y hojas.

## Para una IA

Trabaja únicamente dentro de esta sesión salvo por los archivos de Alejandrina que la integran. Antes de desarrollar un componente, lee su README y JSON, actualiza su estado cuando el contenido sea real y añade interacción solo cuando sea necesaria. Conserva navegación, rutas relativas, diseño móvil y relación con Alejandrina.
