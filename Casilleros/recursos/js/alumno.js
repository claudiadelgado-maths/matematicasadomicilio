(() => {
  const script = document.currentScript;
  if (!script) return;

  const siteRoot = new URL(document.querySelector(".brand")?.href || "/", window.location.href);
  const dataUrl = new URL("recursos/datos/academia.json", siteRoot);
  const dataVersion = new URL(script.src, window.location.href).searchParams.get("v");
  if (dataVersion) dataUrl.searchParams.set("v", dataVersion);
  const escapeHtml = (value = "") =>
    String(value).replace(
      /[&<>'"]/g,
      (character) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[
          character
        ],
    );
  const resolveRoute = (route) => new URL(String(route).replace(/^\/+/, ""), siteRoot).href;
  const safeColor = (value, fallback) =>
    /^#[0-9a-f]{6}$/i.test(value ?? "") ? value : fallback;
  const formatDate = (date) =>
    new Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${date}T00:00:00Z`));

  const renderStudentSessions = (container, students) => {
    const student = students
      .find((candidate) => candidate.id === container.dataset.alumnoId);
    if (!student) {
      container.innerHTML =
        '<p class="academy-data-error">El alumno solicitado no está activo o no existe.</p>';
      return;
    }
    if (student.sesiones.length === 0) {
      container.innerHTML =
        '<p class="academy-empty-state">Todavía no hay sesiones publicadas en este espacio.</p>';
      return;
    }
    container.innerHTML = student.sesiones
      .map(
        (session) => `
          <a class="student-session-link" href="${resolveRoute(session.ruta)}">
            <span class="student-session-date"><time datetime="${escapeHtml(session.fecha)}">${escapeHtml(formatDate(session.fecha))}</time></span>
            <span><strong>${escapeHtml(session.titulo)}</strong><small>${escapeHtml(session.descripcion)}</small></span>
            <span aria-hidden="true">→</span>
          </a>`,
      )
      .join("");
    container.style.setProperty(
      "--student-accent",
      safeColor(student.personalizacion?.acento, "#1f5fbd"),
    );
  };

  const showError = (container) => {
    container.innerHTML =
      '<p class="academy-data-error">No fue posible cargar la información académica. Intenta recargar la página.</p>';
  };

  fetch(dataUrl)
    .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then((academic) => {
      const students = Array.isArray(academic.alumnos) ? academic.alumnos : [];
      document.querySelectorAll("[data-academia-sesiones]").forEach((container) => renderStudentSessions(container, students));
    })
    .catch(() => document.querySelectorAll("[data-academia-sesiones]").forEach(showError));
})();
