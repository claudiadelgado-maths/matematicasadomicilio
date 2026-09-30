export const ANGLE_TYPES = [
  { key: 'nulo', name: 'Nulo', range: '0°', example: 0, color: '#65748b', rule: 'No hubo giro: los dos lados coinciden.' },
  { key: 'agudo', name: 'Agudo', range: '0° < α < 90°', example: 45, color: '#267b80', rule: 'Es mayor que 0° y menor que 90°.' },
  { key: 'recto', name: 'Recto', range: '90°', example: 90, color: '#386fb0', rule: 'Mide exactamente 90°: un cuarto de vuelta.' },
  { key: 'obtuso', name: 'Obtuso', range: '90° < α < 180°', example: 135, color: '#a76a20', rule: 'Es mayor que 90° y menor que 180°.' },
  { key: 'llano', name: 'Llano', range: '180°', example: 180, color: '#b54d65', rule: 'Mide exactamente 180°: media vuelta.' },
  { key: 'concavo', name: 'Cóncavo / reflejo', range: '180° < α < 360°', example: 300, color: '#7c53ac', rule: 'Es mayor que 180° y menor que 360°.' },
  { key: 'completo', name: 'Completo / perigonal', range: '360°', example: 360, color: '#23784b', rule: 'El giro recorrió una vuelta entera: 360°.' }
];

export function clampAngle(value) {
  const angle = Number(value);
  return Number.isFinite(angle) ? Math.max(0, Math.min(360, angle)) : 0;
}

export function classifyAngle(value) {
  const angle = clampAngle(value);
  const index = angle === 0 ? 0 : angle < 90 ? 1 : angle === 90 ? 2 : angle < 180 ? 3 : angle === 180 ? 4 : angle < 360 ? 5 : 6;
  return ANGLE_TYPES[index];
}

export function polarPoint(degrees, radius, cx = 240, cy = 240) {
  const radians = degrees * Math.PI / 180;
  return { x: cx + radius * Math.cos(radians), y: cy - radius * Math.sin(radians) };
}

const coordinates = ({ x, y }) => `${x.toFixed(3)} ${y.toFixed(3)}`;

// SVG tiene y positiva hacia abajo; sweep=0 dibuja el giro antihorario.
// Una circunferencia completa requiere dos arcos, porque sus extremos coinciden.
export function anglePaths(value, radius = 156, cx = 240, cy = 240) {
  const angle = clampAngle(value);
  const start = `${cx + radius} ${cy}`;
  if (angle === 0) return { arc: '', sector: '' };
  if (angle === 360) {
    const arc = `M${start}A${radius} ${radius} 0 1 0 ${cx - radius} ${cy}A${radius} ${radius} 0 1 0 ${start}`;
    return { arc, sector: `${arc}Z` };
  }
  const segment = `A${radius} ${radius} 0 ${angle > 180 ? 1 : 0} 0 ${coordinates(polarPoint(angle, radius, cx, cy))}`;
  return { arc: `M${start}${segment}`, sector: `M${cx} ${cy}L${start}${segment}Z` };
}

// Conserva la cantidad de giro; no aplica módulo 360 al valor mostrado.
export class AngleTurn {
  constructor(angle = 0, raw = angle) { this.turn = clampAngle(angle); this.raw = raw; }
  move(raw) {
    const delta = ((raw - this.raw + 540) % 360) - 180;
    this.turn += delta;
    this.raw = raw;
    return clampAngle(this.turn);
  }
}

export function createQuestionGenerator(random = Math.random) {
  let deck = [];
  let lastKey = null;
  return () => {
    if (!deck.length) {
      deck = [...ANGLE_TYPES];
      for (let index = deck.length - 1; index > 0; index--) {
        const other = Math.floor(random() * (index + 1));
        [deck[index], deck[other]] = [deck[other], deck[index]];
      }
      if (deck[0].key === lastKey) [deck[0], deck[1]] = [deck[1], deck[0]];
    }
    const type = deck.shift();
    lastKey = type.key;
    const integer = (min, max) => min + Math.floor(random() * (max - min + 1));
    const angle = type.key === 'agudo' ? integer(1, 89) : type.key === 'obtuso' ? integer(91, 179) : type.key === 'concavo' ? integer(181, 359) : type.example;
    return { angle, type };
  };
}
