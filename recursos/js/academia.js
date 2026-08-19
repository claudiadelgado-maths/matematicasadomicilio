(() => {
  const script = document.currentScript;
  if (!script) return;

  const siteRoot = new URL("../../", script.src);
  const dataUrl = new URL("../datos/academia.json", script.src);
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
        <img class="teacher-card-photo" src="${resolveRoute(teacher.imagen)}" width="576" height="576" loading="lazy" alt="${escapeHtml(teacher.imagenAlt)}">
        <div class="teacher-card-body">
          <p class="teacher-card-label">${escapeHtml(teacher.rol || "Asesor")}</p>
          <h2>${escapeHtml(teacher.nombreVisible)}</h2>
          <p class="teacher-card-location">${escapeHtml(locationLabel(teacher))}</p>
          <ul class="teacher-card-prices">${teacher.precios.map((price) => `<li><span>${escapeHtml(price.titulo)}</span><small>${escapeHtml(formatDuration(price.duracionMinutos))}</small><strong>${escapeHtml(formatPrice(price))}</strong></li>`).join("")}</ul>
          <a class="button teacher-card-button" href="${resolveRoute(teacher.ruta)}">Ver salón</a>
        </div>
      </article>`;
  };

  const studentMarkup = (student) => {
    return `
      <a class="student-locker" href="${resolveRoute(student.ruta)}" data-student-id="${escapeHtml(student.id)}">
        <span class="student-locker-symbol" aria-hidden="true">${escapeHtml(student.personalizacion?.simbolo || student.nombreVisible.charAt(0))}</span>
        <span class="student-locker-copy"><strong>${escapeHtml(student.nombreVisible)}</strong></span>
        <span class="student-locker-arrow" aria-hidden="true">→</span>
      </a>`;
  };

  const applyStudentColors = (container, teachers) => {
    for (const student of container.querySelectorAll("[data-student-id]")) {
      const studentData = teachers
        .flatMap((teacher) => teacher.alumnos)
        .find((candidate) => candidate.id === student.dataset.studentId);
      if (!studentData) continue;
      student.style.setProperty(
        "--student-accent",
        safeColor(studentData.personalizacion?.acento, "#1f5fbd"),
      );
      student.style.setProperty(
        "--student-background",
        safeColor(studentData.personalizacion?.fondo, "#eef5ff"),
      );
    }
  };

  const renderTeacherRooms = (container, teachers) => {
    if (teachers.length === 0) {
      container.innerHTML = '<p class="academy-data-error">No hay asesores activos en este momento.</p>';
      return;
    }
    container.innerHTML = `<div class="container teacher-catalog">${teachers
      .map(teacherCardMarkup)
      .join("")}</div>`;
  };

  const priceMarkup = (teacher, price) => {
    return `
      <article class="academy-price-card">
        <div class="academy-price-burst"><strong class="academy-price-value">${escapeHtml(formatPrice(price))}</strong></div>
        <div class="academy-price-details"><p>${escapeHtml(teacher.ubicacion?.ciudad || locationLabel(teacher))}</p><p>${escapeHtml(formatDuration(price.duracionMinutos))}</p><p>${escapeHtml(teacher.nombreVisible)}</p></div>
        <a class="button academy-price-link" href="${resolveRoute(teacher.ruta)}">Ver salón</a>
      </article>`;
  };

  const renderPrices = (container, teachers) => {
    const options = teachers.flatMap((teacher) =>
      teacher.precios.map((price) => priceMarkup(teacher, price)),
    );
    container.innerHTML = options.length
      ? `<div class="academy-price-grid">${options.join("")}</div>`
      : '<p class="academy-data-error">No hay precios publicados en este momento.</p>';
  };

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

  const renderProfile = (container, teachers) => {
    const teacher = teachers.find((candidate) => candidate.id === container.dataset.maestroId);
    if (!teacher) {
      container.innerHTML = '<p class="academy-data-error container">El salón solicitado no está activo o no existe.</p>';
      return;
    }
    const status = availability(teacher);
    const whatsappMessage = `Hola, quisiera agendar una sesión con ${teacher.nombreVisible}.`;
    const whatsappUrl = `https://wa.me/529991293497?text=${encodeURIComponent(whatsappMessage)}`;
    container.innerHTML = `
      <div class="container advisor-room-layout">
        <article class="advisor-room-main">
          <div class="advisor-room-banner" aria-hidden="true"></div>
          <section class="advisor-room-identity">
            <img class="advisor-room-photo" src="${resolveRoute(teacher.imagen)}" width="576" height="576" alt="${escapeHtml(teacher.imagenAlt)}">
            <div class="advisor-room-identity-copy"><h1>${escapeHtml(teacher.nombreVisible)}</h1><p class="advisor-room-location">${escapeHtml(locationLabel(teacher))}</p><p class="advisor-room-lead">${escapeHtml(teacher.descripcion)}</p>${(teacher.sobre ?? []).map((item) => `<p class="advisor-room-about">${escapeHtml(item)}</p>`).join("")}</div>
          </section>
          <section class="advisor-room-section" aria-labelledby="advisor-method-title"><h2 id="advisor-method-title">Forma de trabajo</h2><ul class="advisor-method-list">${(teacher.metodologia ?? []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
          <section class="advisor-room-section" aria-labelledby="advisor-session-title"><h2 id="advisor-session-title">Sesión</h2><div class="advisor-session-options">${teacher.precios.map((price) => `<article class="advisor-session-option">${teacher.precios.length > 1 || price.titulo.toLocaleLowerCase("es-MX") !== "sesión" ? `<h3>${escapeHtml(price.titulo)}</h3>` : ""}<dl class="advisor-session-facts"><div><dt>Duración</dt><dd>${escapeHtml(formatDurationLong(price.duracionMinutos))}</dd></div><div><dt>Precio</dt><dd>${escapeHtml(formatPriceWithCode(price))}</dd></div></dl></article>`).join("")}</div></section>
          <section class="advisor-room-section advisor-availability" aria-labelledby="advisor-availability-title"><h2 id="advisor-availability-title">Disponibilidad</h2><p class="availability-pill ${status.accepts ? "is-available" : "is-unavailable"}"><span aria-hidden="true"></span>${escapeHtml(status.label)}</p><a class="button advisor-contact-button" href="${escapeHtml(whatsappUrl)}" target="_blank" rel="noopener noreferrer">Contactar</a></section>
          <p class="advisor-contact-note">La primera sesión se agenda a través de Matemáticas a Domicilio y debe ser pagada por adelantado.</p>
        </article>
        <aside class="advisor-room-lockers" aria-labelledby="advisor-lockers-title"><h2 id="advisor-lockers-title">Casilleros</h2><div class="student-locker-list">${teacher.alumnos.length ? teacher.alumnos.map(studentMarkup).join("") : '<p class="academy-empty-state">Este salón todavía no tiene casilleros activos.</p>'}</div></aside>
      </div>`;

    const banner = container.querySelector(".advisor-room-banner");
    banner?.style.setProperty(
      "--teacher-banner-start",
      safeColor(teacher.banner?.colorInicial, "#11110f"),
    );
    banner?.style.setProperty(
      "--teacher-banner-end",
      safeColor(teacher.banner?.colorFinal, "#2f5d50"),
    );
    applyStudentColors(container, teachers);
  };

  const showError = (container) => {
    container.innerHTML =
      '<p class="academy-data-error">No fue posible cargar la información académica. Intenta recargar la página.</p>';
  };

  fetch(dataUrl)
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((academic) => {
      const teachers = Array.isArray(academic.maestros) ? academic.maestros : [];
      document
        .querySelectorAll("[data-academia-maestros]")
        .forEach((container) => renderTeacherRooms(container, teachers));
      document
        .querySelectorAll("[data-academia-precios]")
        .forEach((container) => renderPrices(container, teachers));
      document
        .querySelectorAll("[data-academia-sesiones]")
        .forEach((container) => renderStudentSessions(container, teachers));
      document
        .querySelectorAll("[data-academia-perfil]")
        .forEach((container) => renderProfile(container, teachers));
    })
    .catch(() => {
      document
        .querySelectorAll(
          "[data-academia-maestros], [data-academia-precios], [data-academia-sesiones], [data-academia-perfil]",
        )
        .forEach(showError);
    });
})();
