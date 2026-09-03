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
  const imageFit = (teacher) => teacher.imagenAjuste === "contain" ? "contain" : "cover";
  const normalizeSearch = (value = "") =>
    String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es-MX")
      .trim();
  const compareTeacherNames = (a, b) =>
    a.nombreVisible.localeCompare(b.nombreVisible, "es-MX", { sensitivity: "base" });
  const shuffle = (values) => {
    const shuffled = [...values];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
  };
  const locationLabel = (teacher) =>
    [teacher.ubicacion?.ciudad, teacher.ubicacion?.region].filter(Boolean).join(", ");
  const availability = (teacher) => {
    const accepts = Boolean(teacher.disponibilidad?.aceptaNuevosAlumnos);
    return {
      accepts,
      label: accepts
        ? teacher.disponibilidad?.etiquetaDisponible || "Acepta nuevos alumnos"
        : teacher.disponibilidad?.etiquetaNoDisponible || "Sin disponibilidad",
    };
  };
  const formatModality = (teacher) => {
    const modality = teacher.modalidad;
    if (modality?.tipo === "grupal") {
      return Number.isInteger(modality.maximoAlumnos)
        ? `Grupal · Máx. ${modality.maximoAlumnos} alumnos`
        : "Grupal";
    }
    return "Individual";
  };
  const priceLocale = (currency) => (currency === "EUR" ? "es-ES" : "es-MX");
  const formatPrice = (price) =>
    new Intl.NumberFormat(priceLocale(price.moneda), {
      style: "currency",
      currency: price.moneda || "MXN",
      maximumFractionDigits: Number.isInteger(price.importe) ? 0 : 2,
    }).format(price.importe);
  const formatDuration = (minutes) => {
    if (!Number.isFinite(minutes)) return "Duración por confirmar";
    if (minutes === 60) return "60 min";
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    if (hours && remainder) return `${hours} h ${remainder} min`;
    if (hours) return `${hours} h`;
    return `${remainder} min`;
  };
  const formatDurationLong = (minutes) => {
    if (!Number.isFinite(minutes)) return "Por confirmar";
    if (minutes === 60) return "60 minutos";
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    const hourLabel = hours === 1 ? "hora" : "horas";
    if (hours && remainder === 30) return `${hours} ${hourLabel} y media`;
    if (hours && remainder) {
      return `${hours} ${hourLabel} y ${remainder} minutos`;
    }
    if (hours) return `${hours} ${hourLabel}`;
    return `${remainder} minutos`;
  };
  const formatPriceWithCode = (price) => {
    if (price.moneda === "EUR") return formatPrice(price);
    const amount = new Intl.NumberFormat(priceLocale(price.moneda), {
      maximumFractionDigits: Number.isInteger(price.importe) ? 0 : 2,
    }).format(price.importe);
    return `${amount} ${price.moneda || "MXN"}`;
  };
  const formatDate = (date) =>
    new Intl.DateTimeFormat("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${date}T00:00:00Z`));

  const renderStudentSessions = (container, teachers) => {
    const student = teachers
      .flatMap((teacher) => teacher.alumnos)
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
      const teachers = Array.isArray(academic.maestros) ? academic.maestros : [];
      document.querySelectorAll("[data-academia-sesiones]").forEach((container) => renderStudentSessions(container, teachers));
    })
    .catch(() => document.querySelectorAll("[data-academia-sesiones]").forEach(showError));
})();
