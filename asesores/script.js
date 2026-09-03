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

  const teacherCardMarkup = (teacher) => {
    return `
      <article class="teacher-card">
        <img class="teacher-card-photo" data-image-fit="${imageFit(teacher)}" src="${resolveRoute(teacher.imagen)}" width="576" height="576" loading="lazy" alt="${escapeHtml(teacher.imagenAlt)}">
        <div class="teacher-card-body">
          <p class="teacher-card-label">${escapeHtml(teacher.rol || "Asesor")}</p>
          <h2>${escapeHtml(teacher.nombreVisible)}</h2>
          <p class="teacher-card-location">${escapeHtml(locationLabel(teacher))}</p>
          <p class="teacher-card-modality">${escapeHtml(formatModality(teacher))}</p>
          <ul class="teacher-card-prices">${teacher.precios.map((price) => `<li><span>${escapeHtml(price.titulo)}</span><small>${escapeHtml(formatDuration(price.duracionMinutos))}</small><strong>${escapeHtml(formatPrice(price))}</strong></li>`).join("")}</ul>
          <a class="button teacher-card-button" href="${resolveRoute(teacher.ruta)}">Ver salón</a>
        </div>
      </article>`;
  };

  const renderTeacherRooms = (container, teachers) => {
    if (teachers.length === 0) {
      container.innerHTML = '<p class="academy-data-error">No hay asesores activos en este momento.</p>';
      return;
    }
    const randomizedTeachers = shuffle(teachers);
    const searchInput = container.id
      ? document.querySelector(`[data-academia-search][aria-controls="${container.id}"]`)
      : null;
    const status = searchInput
      ?.closest(".teacher-directory")
      ?.querySelector("[data-academia-search-status]");

    const render = () => {
      const query = normalizeSearch(searchInput?.value);
      const visibleTeachers = query
        ? teachers
            .filter((teacher) => normalizeSearch(teacher.nombreVisible).includes(query))
            .sort(compareTeacherNames)
        : randomizedTeachers;

      container.innerHTML = `<div class="container teacher-catalog">${visibleTeachers.length
        ? visibleTeachers.map(teacherCardMarkup).join("")
        : '<p class="teacher-search-empty">No encontramos un asesor con ese nombre.</p>'}</div>`;

      if (status) {
        if (!query) {
          status.textContent = `${visibleTeachers.length} asesores disponibles en orden aleatorio.`;
        } else {
          const noun = visibleTeachers.length === 1 ? "asesor encontrado" : "asesores encontrados";
          status.textContent = `${visibleTeachers.length} ${noun}, en orden alfabético.`;
        }
      }
    };

    render();
    searchInput?.addEventListener("input", render);
  };

  const showError = (container) => {
    container.innerHTML =
      '<p class="academy-data-error">No fue posible cargar la información académica. Intenta recargar la página.</p>';
  };

  fetch(dataUrl)
    .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then((academic) => {
      const teachers = Array.isArray(academic.maestros) ? academic.maestros : [];
      document.querySelectorAll("[data-academia-maestros]").forEach((container) => renderTeacherRooms(container, teachers));
    })
    .catch(() => document.querySelectorAll("[data-academia-maestros]").forEach(showError));
})();
