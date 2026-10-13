const drawings = {
  agua: '<path d="M32 5C27 16 13 29 13 41a19 19 0 0 0 38 0C51 29 37 16 32 5Z" fill="currentColor" opacity=".18"/><path d="M32 5C27 16 13 29 13 41a19 19 0 0 0 38 0C51 29 37 16 32 5Z"/><path d="M22 40c0 6 3 10 8 11"/>',
  carbohidratos: '<path d="m18 10 15-7 15 7v18l-15 8-15-8Z" fill="currentColor" opacity=".15"/><path d="m18 10 15-7 15 7v18l-15 8-15-8Z"/><path d="m32 34-9 16h11l-4 12 17-22H35l7-12" fill="currentColor"/>',
  lipidos: '<g fill="currentColor" opacity=".25"><circle cx="15" cy="13" r="7"/><circle cx="32" cy="13" r="7"/><circle cx="49" cy="13" r="7"/><circle cx="15" cy="51" r="7"/><circle cx="32" cy="51" r="7"/><circle cx="49" cy="51" r="7"/></g><path d="M11 21v12m8-12v12m9-12v12m8-12v12m9-12v12m8-12v12M11 43v-8m8 8v-8m9 8v-8m8 8v-8m9 8v-8m8 8v-8"/><circle cx="15" cy="13" r="7"/><circle cx="32" cy="13" r="7"/><circle cx="49" cy="13" r="7"/><circle cx="15" cy="51" r="7"/><circle cx="32" cy="51" r="7"/><circle cx="49" cy="51" r="7"/>',
  proteinas: '<path d="m11 43 15-23 15 20 13-23"/><g fill="currentColor" opacity=".2"><circle cx="11" cy="43" r="8"/><circle cx="26" cy="20" r="8"/><circle cx="41" cy="40" r="8"/><circle cx="54" cy="17" r="8"/></g><circle cx="11" cy="43" r="8"/><circle cx="26" cy="20" r="8"/><circle cx="41" cy="40" r="8"/><circle cx="54" cy="17" r="8"/>',
  acidos: '<path d="M18 4c28 15 28 41 0 56M46 4C18 19 18 45 46 60"/><path d="M23 9h18M28 18h8M27 28h10M23 38h18M24 48h16M20 57h24"/>',
  vitaminas: '<path d="m32 4 7 17 18 3-14 13 3 20-14-10-14 10 3-20L7 24l18-3Z" fill="currentColor" opacity=".18"/><path d="m32 4 7 17 18 3-14 13 3 20-14-10-14 10 3-20L7 24l18-3Z"/><path d="M25 31h14m-7-7v14"/>',
  sales: '<g fill="currentColor" opacity=".18"><circle cx="17" cy="19" r="13"/><circle cx="45" cy="42" r="15"/></g><circle cx="17" cy="19" r="13"/><circle cx="45" cy="42" r="15"/><path d="M12 19h10m-5-5v10M38 42h14m-7-7v14M27 25l7 7"/>'
};
export function icon(id, className = '') {
  return `<svg class="${className}" viewBox="0 0 64 64" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${drawings[id] || drawings.proteinas}</svg>`;
}
