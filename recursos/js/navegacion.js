(() => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');

  if (toggle && menu) {
    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      menu.classList.toggle('is-open', !isOpen);
    });

    menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  }

  const addWhatsapp = () => {
    let control = document.querySelector('.whatsapp-float');

    if (!control) {
      const defaultHref = 'https://wa.me/529991293497?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20las%20asesor%C3%ADas%20de%20matem%C3%A1ticas%20a%20domicilio.';
      const defaultLabel = 'Escribir por WhatsApp al 999 129 3497';
      const scriptUrl = document.currentScript?.src;
      const iconUrl = scriptUrl
        ? new URL('../svg/whatsapp-mono.svg', scriptUrl).href
        : 'recursos/svg/whatsapp-mono.svg';

      control = document.createElement('a');
      control.className = 'whatsapp-float';
      control.href = document.body.dataset.whatsappHref || defaultHref;
      control.target = '_blank';
      control.rel = 'noopener noreferrer';
      control.setAttribute('aria-label', document.body.dataset.whatsappLabel || defaultLabel);

      const icon = document.createElement('img');
      icon.src = iconUrl;
      icon.alt = '';
      icon.width = 34;
      icon.height = 34;
      control.append(icon);
      document.body.append(control);
    }

    return control;
  };

  const addBackToTop = () => {
    let control = document.querySelector('.back-to-top');

    if (!control) {
      control = document.createElement('a');
      control.className = 'back-to-top';
      control.href = '#inicio';
      control.setAttribute('aria-label', 'Volver al inicio de la página');
      control.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M9 12H5.414a1 1 0 0 1-.707-1.707l6.586-6.586a1 1 0 0 1 1.414 0l6.586 6.586A1 1 0 0 1 18.586 12H15v6H9v-6"/>
          <path d="M9 21h6"/>
        </svg>`;

      const whatsapp = document.querySelector('.whatsapp-float');
      if (whatsapp) whatsapp.before(control);
      else document.body.append(control);
    }

    control.addEventListener('click', (event) => {
      event.preventDefault();
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  };

  addWhatsapp();
  addBackToTop();
})();
