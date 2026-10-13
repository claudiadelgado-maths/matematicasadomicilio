# Ticket bajo la lupa

Juego educativo publicado como cierre de la sesión Porcentajes de Andrés. Convierte descuentos e IVA en una misión breve de auditoría que se juega únicamente mediante clics, sin cronómetro ni escritura de cantidades.

## Objetivo educativo

Aplicar en una sola cadena tres relaciones estudiadas en la teoría:

1. `cantidad después del descuento = original · (1 − descuento/100)`;
2. `IVA = cantidad después del descuento · tasa/100`;
3. `total = cantidad después del descuento + IVA`.

Cada producto declara qué cantidad representa 100% y qué descuento se anunció. Al elegirlo, el juego sortea una tasa entre 10%, 12%, 16%, 19% y 21%; la imprime en el ticket como **tasa ficticia del juego** y la usa en todos los cálculos de esa ronda. No pretende comunicar una tasa fiscal vigente: su función es evitar que el alumno memorice un único número. El ticket conserva la base y muestra únicamente las tres líneas que deben auditarse.

## Bucle de juego

1. Elegir uno de tres productos generados desde el catálogo.
2. Revisar su cantidad original y descuento anunciado.
3. Decidir si el ticket está correcto o contiene una línea alterada.
4. Cuando se reclama un ticket defectuoso, seleccionar directamente la línea sospechosa.
5. Leer una explicación que compara operación, valor impreso y valor correcto.
6. Continuar hasta alcanzar victoria o derrota.

No existen campos de texto, arrastre, límite de tiempo ni cálculos de muchas líneas. Las decisiones se toman con botones y un ticket requiere como máximo tres operaciones.

## Victoria, derrota y apoyo

- **Victoria:** conseguir cuatro sellos de auditor antes de agotar las oportunidades.
- **Derrota:** acumular tres dictámenes incorrectos.
- **Duración máxima:** seis tickets; una partida siempre termina a más tardar en la sexta ronda.
- **Pistas:** dos por partida y como máximo una por ronda. La pista recuerda el factor que queda después del descuento, la tasa impresa y la base sobre la que debe calcularse IVA.
- **Reinicio:** disponible desde cualquier estado, además de la revancha inmediata al finalizar.

La derrota utiliza un tono formativo y conserva la explicación matemática. No hay sonido, presión de velocidad, clasificación ni datos permanentes.

## Generación y regla de error único

`script.mjs` contiene diez productos con cantidades y descuentos preparados para generar operaciones breves, además de cinco tasas ficticias posibles. Cada partida mezcla exactamente tres tickets correctos y tres defectuosos; el orden cambia y no se comunica al jugador.

Un ticket se calcula primero como libro contable canónico en centavos enteros. Si debe contener un defecto, se copia y se modifica exactamente uno de estos campos:

- cantidad después del descuento;
- IVA;
- total.

El campo correcto permanece almacenado por separado. Las demás líneas no se recalculan desde el valor alterado, por lo que existe una sola respuesta registrada y la explicación siempre puede señalarla con precisión.

## Interfaz y accesibilidad

- Producto, descuento y acciones tienen nombres accesibles completos.
- Las líneas del ticket se convierten en botones solo durante la localización del error.
- Los cambios de ronda, sello, oportunidad y cierre se anuncian en una región viva.
- El foco se traslada al título de cada nueva pantalla.
- Todos los objetivos táctiles superan aproximadamente 44 px y tienen foco visible.
- Estado de victoria, oportunidades y errores se expresan con texto, no únicamente con color.
- Las animaciones son decorativas, breves y se eliminan con `prefers-reduced-motion`.
- La composición se adapta a 360, 768, 1024 y 1440 px sin desplazamiento horizontal de la página.

## Archivos

- `index.html`: escena, pantallas de partida, ticket semántico, instrucciones y navegación.
- `estilos.css`: identidad colorida, tienda, recibo, estados, foco y diseño responsivo.
- `script.mjs`: catálogo, cálculo canónico, mutación única, controlador de partida y funciones puras exportadas.
- `../../matematicas.mjs`: renderizado compartido con KaTeX para pistas y comprobaciones dinámicas.
- `juego.json`: metadatos publicados del componente.

## Pruebas que deben conservarse

- los diez productos y las cinco tasas producen centavos enteros y respetan descuento antes de IVA;
- un ticket correcto no modifica ningún campo;
- cada ticket defectuoso modifica exactamente una de tres líneas;
- cada patrón contiene tres tickets correctos y tres defectuosos;
- una victoria ocurre al cuarto sello y una derrota al tercer error;
- una reclamación de ticket defectuoso exige localizar la línea;
- aceptar un ticket alterado o reclamar uno correcto consume una oportunidad;
- las dos pistas se descuentan y no pueden repetirse en una ronda;
- reinicio, revancha, teclado, menú móvil, consola y enlaces funcionan correctamente.

Las pistas y explicaciones de cierre presentan productos y cocientes con KaTeX; las razones porcentuales usan fracciones verticales legibles en lugar de signos de división en línea.
