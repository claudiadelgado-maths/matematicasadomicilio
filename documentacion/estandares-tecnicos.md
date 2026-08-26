# Estándares técnicos

## HTML

- HTML5 semántico, `lang="es-MX"` y un único `h1`.
- Títulos en orden lógico; controles con etiqueta o nombre accesible.
- `aria-live` para resultados dinámicos importantes.
- Enlaces externos con `rel="noopener noreferrer"` cuando abren otra pestaña.
- Anchura y altura declaradas en imágenes cuando se conocen.

## CSS

- Diseño móvil y fluido; preferir `clamp`, grid y flex.
- Usar variables existentes antes de inventar valores.
- Selectores locales bajo una clase de módulo.
- Cada `index.html` debe enlazar un `estilos.css` ubicado en su misma carpeta.
- `recursos/css/base.css` contiene solo la base realmente común; no recibe reglas particulares de áreas o módulos.
- Sin `!important` salvo una utilidad documentada.
- Mantener el diseño específico dentro del módulo, incluso si existe cierta repetición entre carpetas que deben poder copiarse de forma independiente.

## JavaScript

- JavaScript nativo y encapsulado en una IIFE o módulo.
- Salir sin error cuando el componente esperado no existe.
- Funciones pequeñas, nombres descriptivos y validación de entradas.
- No crear estado global.
- No incorporar paquetes de producción para una operación sencilla.
- Conservar navegación por teclado y mensajes accesibles.
- Guardar el comportamiento particular junto a su página y no crear archivos JavaScript vacíos.

## SVG

- `viewBox` obligatorio, trazos escalables y etiquetas accesibles si comunica contenido.
- `aria-hidden="true"` si es decorativo.
- Sin texto esencial incrustado cuando puede ser HTML.
- SVG específico dentro de `recursos/` del módulo; iconos globales en `/recursos/svg/`.

## Datos y privacidad

- Los módulos públicos no recopilan datos personales.
- `localStorage` solo guarda información local no sensible y debe documentarse.
- No incluir claves, tokens ni datos privados en el repositorio.

## Validación

Ejecuta `npm run validar`, revisa la consola y prueba interacciones con ratón y teclado. Un cambio de recurso compartido requiere revisar sus consumidores, no solo la página donde se detectó.
