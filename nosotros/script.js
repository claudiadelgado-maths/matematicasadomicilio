(() => {
  const controls = document.querySelector('.about-controls');
  if (!controls) return;

  const buttons = controls.querySelectorAll('button[aria-controls]');
  const panels = document.querySelectorAll('[data-about-panel]');

  const showPanel = (button) => {
    const panelId = button.getAttribute('aria-controls');
    buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    panels.forEach((panel) => { panel.hidden = panel.id !== panelId; });
  };

  buttons.forEach((button) => button.addEventListener('click', () => showPanel(button)));
  showPanel(buttons[0]);
  controls.hidden = false;
})();
