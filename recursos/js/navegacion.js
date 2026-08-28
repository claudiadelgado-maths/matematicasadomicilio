(() => {
  const script = document.currentScript;
  const siteRoot = script ? new URL("../../", script.src) : new URL("/", window.location.href);
  const sharedSpaces = [
    { label: "Talleres", route: "talleres/" },
    { label: "Laboratorios", route: "laboratorios/" },
    { label: "Anuncios", route: "anuncios/" },
  ];
  const currentPath = window.location.pathname.replace(/index\.html$/, "");
  const contactPath = new URL("contacto/", siteRoot).pathname;

  const addSharedSpaces = (list) => {
    const existingLinks = [...list.querySelectorAll("a")];
    const existingPaths = new Map(
      existingLinks.map((link) => [new URL(link.href, window.location.href).pathname, link]),
    );
    const contactItem = existingLinks
      .find((link) => new URL(link.href, window.location.href).pathname === contactPath)
      ?.closest("li");

    for (const space of sharedSpaces) {
      const url = new URL(space.route, siteRoot);
      let link = existingPaths.get(url.pathname);

      if (!link) {
        const item = document.createElement("li");
        link = document.createElement("a");
        link.href = url.href;
        link.textContent = space.label;
        item.append(link);
        list.insertBefore(item, contactItem ?? null);
      }

      if (currentPath === url.pathname || currentPath.startsWith(url.pathname)) {
        link.setAttribute("aria-current", "page");
      }
    }
  };

  document.querySelectorAll(".nav-list, .footer-nav").forEach(addSharedSpaces);

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
      if (event.key === 'Escape') {
        closeMenu();
        toggle.focus();
      }
    });

    document.addEventListener('click', (event) => {
      if (!menu.contains(event.target) && !toggle.contains(event.target)) closeMenu();
    });
  }

  document.querySelectorAll('[data-year]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const addWhatsapp = () => {
    let control = document.querySelector('.whatsapp-float');

    if (!control) {
      control = document.createElement('a');
      control.className = 'whatsapp-float';
      control.href = 'https://wa.me/529991293497?text=Hola%2C%20quiero%20informaci%C3%B3n%20sobre%20las%20asesor%C3%ADas%20de%20matem%C3%A1ticas%20a%20domicilio.';
      control.target = '_blank';
      control.rel = 'noopener noreferrer';
      control.setAttribute('aria-label', 'Escribir por WhatsApp al 999 129 3497');
      control.innerHTML = `
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d="M12.04 2a9.84 9.84 0 0 0-8.42 14.92L2.05 22l5.2-1.53A9.94 9.94 0 1 0 12.04 2Zm0 17.99a8 8 0 0 1-4.09-1.12l-.29-.17-3.09.91.92-3-.19-.31A8 8 0 1 1 12.04 20Zm4.39-5.99c-.24-.12-1.43-.7-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19a7.24 7.24 0 0 1-1.34-1.67c-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46a.88.88 0 0 0-.64.3c-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28Z"/>
        </svg>`;
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
