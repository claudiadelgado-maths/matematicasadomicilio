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
})();
