# Morfi Familiar

Planificador semanal de comidas y lista de compras para la familia.

- **Semana:** calendario de almuerzos y cenas, con cambio por comida.
- **Comidas:** banco de 65 comidas filtrable por perfil.
- **Compras:** lista armada sola según la semana.
- **Hoy:** ruleta de comidas y sugerencias según los ingredientes que hay en casa.

Es un único `index.html`, sin dependencias ni login. Se publica con GitHub Pages.

## Espacios propios

Además del espacio de la familia (datos de `data.js`), cualquiera puede crear su propio espacio:
nombre, personas y comidas importadas con un JSON (la app trae un botón "Copiar prompt para IA").
Todo queda en el dispositivo (localStorage), sin cuentas. Código en `workspace.js`.
El espacio de la familia se abre con `?espacio=familia` en dispositivos nuevos.
