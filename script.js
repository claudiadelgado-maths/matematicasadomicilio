(() => {
  const script = document.currentScript;
  const search = document.querySelector('[data-casilleros-search]');
  const list = document.querySelector('[data-casilleros-list]');
  const pagination = document.querySelector('[data-casilleros-pages]');
  const status = document.querySelector('[data-casilleros-status]');
  if (!script || !search || !list || !pagination || !status) return;

  const siteRoot = new URL('./', script.src);
  const normalize = (value) => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es-MX').trim();
  const safeColor = (value, fallback) => /^#[0-9a-f]{6}$/i.test(value ?? '') ? value : fallback;
  const pageSize = 7;
  let students = [];
  let currentPage = 1;

  const banner = (student) => {
    const link = document.createElement('a');
    link.className = 'student-locker';
    link.href = new URL(student.ruta.replace(/^\/+/, ''), siteRoot).href;
    link.dataset.studentId = student.id;
    link.style.setProperty('--student-accent', safeColor(student.personalizacion?.acento, '#1f5fbd'));
    link.style.setProperty('--student-background', safeColor(student.personalizacion?.fondo, '#eef5ff'));
    const symbol = document.createElement('span');
    symbol.className = 'student-locker-symbol';
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = student.personalizacion?.simbolo || student.nombreVisible.charAt(0);
    const copy = document.createElement('span');
    copy.className = 'student-locker-copy';
    const name = document.createElement('strong');
    name.textContent = student.nombreVisible;
    copy.append(name);
    const arrow = document.createElement('span');
    arrow.className = 'student-locker-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    link.append(symbol, copy, arrow);
    return link;
  };

  const render = () => {
    const query = normalize(search.value);
    const filtered = students.filter((student) => normalize(student.nombreVisible).includes(query));
    const pageCount = Math.ceil(filtered.length / pageSize);
    currentPage = Math.max(1, Math.min(currentPage, pageCount));
    list.replaceChildren(...filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(banner));
    pagination.replaceChildren();
    pagination.hidden = pageCount <= 1;
    for (let page = 1; pageCount > 1 && page <= pageCount; page += 1) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = page;
      button.setAttribute('aria-label', `Página ${page}`);
      if (page === currentPage) button.setAttribute('aria-current', 'page');
      button.addEventListener('click', () => {
        currentPage = page;
        render();
        list.querySelector('a')?.focus();
      });
      pagination.append(button);
    }
    status.textContent = filtered.length
      ? `${filtered.length} ${filtered.length === 1 ? 'casillero encontrado' : 'casilleros encontrados'}. Página ${currentPage} de ${pageCount}.`
      : 'No se encontraron estudiantes con ese nombre.';
    status.classList.toggle('casilleros-status-hidden', filtered.length > 0);
  };

  search.addEventListener('input', () => { currentPage = 1; render(); });
  fetch(new URL('recursos/datos/academia.json', siteRoot), { cache: 'no-cache' })
    .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then((academic) => {
      students = academic.alumnos;
      render();
      search.disabled = false;
    })
    .catch(() => { status.textContent = 'No fue posible cargar los casilleros. Intenta recargar la página.'; });
})();
