# Ejercicios: practica con diagramas de árbol

Componente interactivo de la sesión de Alejandrina. Reúne tres prácticas generativas y diferentes entre sí.

## Actividades

1. **Completa el árbol:** recibe colección, regla y etapas; oculta entre una y tres etiquetas del árbol correcto.
2. **Lee el árbol:** alterna entre contar niveles y reconstruir una colección sin reemplazo extraída hasta terminar.
3. **Construye el árbol:** permite decidir las ramas de cada nodo y compara la estructura completa con la solución matemática.

## Generación

`script.mjs` importa `../../arboles.mjs`, que recibe categorías, cantidades, regla y etapas para producir el árbol verdadero. Los escenarios respetan estos límites:

- máximo tres categorías y cinco elementos;
- máximo cinco etapas;
- los árboles utilizados por esta interfaz no superan 60 nodos;
- predominan dos categorías y dos o tres etapas;
- cada ejercicio evita repetir inmediatamente su escenario anterior.

## Interacción y retroalimentación

- Los tres bloques incluyen `Nuevo ejercicio`.
- Las respuestas correctas del primer ejercicio se conservan al revisar.
- La lectura de la colección solo se genera sin reemplazo y hasta terminar.
- El constructor permite añadir ramas imposibles, omitir posibilidades o continuar etapas de más para que exista un error real que corregir.
- La comprobación señala ramas o nodos problemáticos sin reconstruir automáticamente la solución.

## Archivos

- `index.html`: estructura de las tres actividades.
- `estilos.css`: identidades visuales, árboles desplazables y adaptación móvil.
- `script.mjs`: estado, interacción, generación y corrección.
- `ejercicio.json`: metadatos publicados.

## Comprobaciones

- Genera series amplias de escenarios y valida límites, profundidad y tamaño.
- Prueba respuestas vacías, correctas e incorrectas en los tres ejercicios.
- Comprueba reinicio, enfoque, botones, contadores, 360–1440 px y consola.
