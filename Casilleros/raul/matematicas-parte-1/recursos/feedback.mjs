export function showFeedback(element, text = '', state = '') {
  element.textContent = text;
  element.dataset.result = state;
  element.getAnimations?.().forEach((animation) => animation.cancel());
  if (state === 'correct' && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    element.animate([{ transform: 'translateY(5px)', opacity: .5 }, { transform: 'translateY(0)', opacity: 1 }], { duration: 240, easing: 'ease-out' });
  }
}
