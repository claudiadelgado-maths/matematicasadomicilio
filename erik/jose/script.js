(() => {
  const taskBoard = document.querySelector("[data-task-board]");

  if (taskBoard) {
    const storageKey = "matematicasADomicilio_usuario_jose_tareas_v1";
    const initialTasks = [
      {
        id: "jose-inicial-barrer",
        title: "Barrer",
        description:
          "Usar la escoba y moverla de un lado a otro para juntar la basura. Recogerla con el recogedor y terminar la actividad antes de las 3:00.",
        zone: "available",
        position: 0,
        createdAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "jose-inicial-trapear",
        title: "Trapear",
        description:
          "Preparar el agua utilizando media tapita de Pinol. Trapear el espacio indicado y dejar el piso limpio.",
        zone: "available",
        position: 1,
        createdAt: "2026-01-01T00:00:01.000Z",
      },
      {
        id: "jose-inicial-sacudir",
        title: "Sacudir",
        description:
          "Empezar con los cajones de atrás y avanzar hacia los que están al frente. Retirar el polvo con cuidado y volver a colocar los objetos en su lugar.",
        zone: "available",
        position: 2,
        createdAt: "2026-01-01T00:00:02.000Z",
      },
      {
        id: "jose-inicial-formatear",
        title: "Formatear",
        description:
          "Usar los siguientes comandos: escribe aquí los comandos y el procedimiento necesario para realizar el formateo.",
        zone: "available",
        position: 3,
        createdAt: "2026-01-01T00:00:03.000Z",
      },
      {
        id: "jose-inicial-publicacion",
        title: "Crear publicación",
        description:
          "Usar ChatGPT tomando en consideración que: escribe aquí el objetivo, el público, el formato, el tono y la información que debe contener la publicación.",
        zone: "available",
        position: 4,
        createdAt: "2026-01-01T00:00:04.000Z",
      },
    ];
    const zones = {
      available: {
        label: "Tareas disponibles",
        status: "Disponible",
        symbol: "☰",
        next: "todo",
        moveLabel: "Mover a Por hacer",
        empty: "No hay tareas disponibles. Crea una nueva tarea.",
      },
      todo: {
        label: "Por hacer",
        status: "Pendiente",
        symbol: "◷",
        next: "done",
        moveLabel: "Marcar como hecha",
        empty: "No hay tareas pendientes. Mueve una actividad aquí cuando quieras comenzar.",
      },
      done: {
        label: "Hechas",
        status: "Completada",
        symbol: "✓",
        next: "available",
        moveLabel: "Regresar a Tareas",
        empty: "Todavía no hay tareas completadas.",
      },
    };
    const lists = {
      available: taskBoard.querySelector('[data-task-list="available"]'),
      todo: taskBoard.querySelector('[data-task-list="todo"]'),
      done: taskBoard.querySelector('[data-task-list="done"]'),
    };
    const statusElement = document.querySelector("[data-task-status]");
    const newTaskButton = document.querySelector("[data-new-task]");
    const resetTasksButton = document.querySelector("[data-reset-tasks]");
    const editorDialog = document.querySelector("#task-editor-dialog");
    const editorForm = document.querySelector("#task-editor-form");
    const editorEyebrow = document.querySelector("[data-task-editor-eyebrow]");
    const editorTitle = document.querySelector("[data-task-editor-title]");
    const editorSubmit = document.querySelector("[data-task-editor-submit]");
    const editorError = document.querySelector("[data-task-editor-error]");
    const titleInput = document.querySelector("#task-title");
    const descriptionInput = document.querySelector("#task-description");
    const closeEditorButton = document.querySelector("[data-close-task-editor]");
    const deleteDialog = document.querySelector("#task-delete-dialog");
    const deleteForm = document.querySelector("#task-delete-form");
    const deleteName = document.querySelector("[data-task-delete-name]");
    const closeDeleteButton = document.querySelector("[data-close-task-delete]");
    let tasks = [];
    let editingTaskId = null;
    let deletingTaskId = null;
    let draggingTaskId = null;
    let savingTask = false;
    let storageAvailable = true;

    const cloneInitialTasks = () => initialTasks.map((task) => ({ ...task }));

    const saveTasks = () => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(tasks));
        storageAvailable = true;
      } catch {
        storageAvailable = false;
        statusElement.textContent =
          "Los cambios funcionan en esta página, pero el navegador no permitió guardarlos localmente.";
      }
    };

    const loadTasks = () => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved === null) {
          tasks = cloneInitialTasks();
          saveTasks();
          return;
        }
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed)) throw new Error("Formato inválido");
        tasks = parsed
          .filter(
            (task) =>
              task &&
              typeof task.id === "string" &&
              typeof task.title === "string" &&
              Object.prototype.hasOwnProperty.call(zones, task.zone)
          )
          .map((task, index) => ({
            id: task.id,
            title: task.title.trim() || "Tarea sin título",
            description: typeof task.description === "string" ? task.description : "",
            zone: task.zone,
            position: Number.isFinite(task.position) ? task.position : index,
            createdAt: typeof task.createdAt === "string" ? task.createdAt : new Date().toISOString(),
          }));
      } catch {
        storageAvailable = false;
        tasks = cloneInitialTasks();
        statusElement.textContent =
          "No fue posible leer las tareas guardadas. Se muestran las tareas iniciales sin eliminar la información anterior.";
      }
    };

    const sortedTasks = (zone) =>
      tasks.filter((task) => task.zone === zone).sort((first, second) => first.position - second.position);

    const normalizePositions = (zone) => {
      sortedTasks(zone).forEach((task, index) => {
        task.position = index;
      });
    };

    const announce = (message) => {
      statusElement.textContent = message;
    };

    const openDialog = (dialog) => {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    };

    const closeDialog = (dialog) => {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
    };

    const createButton = (label, className, handler) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = className;
      button.textContent = label;
      button.addEventListener("click", handler);
      return button;
    };

    const moveTask = (taskId) => {
      const task = tasks.find((candidate) => candidate.id === taskId);
      if (!task) return;
      const previousZone = task.zone;
      const targetZone = zones[previousZone].next;
      task.zone = targetZone;
      task.position = sortedTasks(targetZone).length;
      normalizePositions(previousZone);
      normalizePositions(targetZone);
      saveTasks();
      renderBoard();
      announce(`“${task.title}” se movió de ${zones[previousZone].label} a ${zones[targetZone].label}.`);
    };

    const reorderTask = (taskId, direction) => {
      const task = tasks.find((candidate) => candidate.id === taskId);
      if (!task) return;
      const zoneTasks = sortedTasks(task.zone);
      const index = zoneTasks.findIndex((candidate) => candidate.id === taskId);
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= zoneTasks.length) return;
      const otherTask = zoneTasks[targetIndex];
      [task.position, otherTask.position] = [otherTask.position, task.position];
      saveTasks();
      renderBoard();
      announce(`“${task.title}” cambió de posición dentro de ${zones[task.zone].label}.`);
    };

    const openEditor = (taskId = null) => {
      editingTaskId = taskId;
      editorError.textContent = "";
      if (taskId) {
        const task = tasks.find((candidate) => candidate.id === taskId);
        if (!task) return;
        editorEyebrow.textContent = "Modificar actividad";
        editorTitle.textContent = "Editar tarea";
        editorSubmit.textContent = "Guardar cambios";
        titleInput.value = task.title;
        descriptionInput.value = task.description;
      } else {
        editorEyebrow.textContent = "Nueva actividad";
        editorTitle.textContent = "Nueva tarea";
        editorSubmit.textContent = "Agregar tarea";
        editorForm.reset();
      }
      openDialog(editorDialog);
      titleInput.focus();
    };

    const openDeleteConfirmation = (taskId) => {
      const task = tasks.find((candidate) => candidate.id === taskId);
      if (!task) return;
      deletingTaskId = taskId;
      deleteName.textContent = `Tarea: “${task.title}”`;
      openDialog(deleteDialog);
    };

    const createTaskCard = (task, index, zoneTasks) => {
      const article = document.createElement("article");
      article.className = `task-card task-card-${task.zone}`;
      article.dataset.taskId = task.id;
      article.draggable = true;

      const status = document.createElement("p");
      status.className = "task-card-status";
      status.textContent = `${zones[task.zone].symbol} ${zones[task.zone].status}`;
      const title = document.createElement("h4");
      title.textContent = task.title;
      const description = document.createElement("p");
      description.className = "task-card-description";
      description.textContent = task.description || "Sin descripción.";

      const mainActions = document.createElement("div");
      mainActions.className = "task-card-main-actions";
      mainActions.append(
        createButton(zones[task.zone].moveLabel, "task-action task-action-move", () => moveTask(task.id)),
        createButton("Editar", "task-action", () => openEditor(task.id)),
        createButton("Eliminar", "task-action task-action-delete", () =>
          openDeleteConfirmation(task.id)
        )
      );

      const orderActions = document.createElement("div");
      orderActions.className = "task-card-order-actions";
      const upButton = createButton("Subir", "task-order-button", () => reorderTask(task.id, -1));
      const downButton = createButton("Bajar", "task-order-button", () => reorderTask(task.id, 1));
      upButton.disabled = index === 0;
      downButton.disabled = index === zoneTasks.length - 1;
      orderActions.append(upButton, downButton);

      article.append(status, title, description, mainActions, orderActions);
      article.addEventListener("dragstart", (event) => {
        draggingTaskId = task.id;
        article.classList.add("is-dragging");
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", task.id);
      });
      article.addEventListener("dragend", () => {
        draggingTaskId = null;
        article.classList.remove("is-dragging");
        Object.values(lists).forEach((list) => list.classList.remove("is-drop-target"));
      });
      article.addEventListener("dragover", (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      });
      article.addEventListener("drop", (event) => {
        event.preventDefault();
        event.stopPropagation();
        handleDrop(draggingTaskId || event.dataTransfer.getData("text/plain"), task.zone, task.id);
      });
      return article;
    };

    const renderBoard = () => {
      Object.entries(lists).forEach(([zone, list]) => {
        const zoneTasks = sortedTasks(zone);
        list.replaceChildren();
        document.querySelector(`[data-zone-count="${zone}"]`).textContent = zoneTasks.length;
        if (zoneTasks.length === 0) {
          const empty = document.createElement("p");
          empty.className = "task-empty-state";
          empty.textContent = zones[zone].empty;
          list.append(empty);
        } else {
          zoneTasks.forEach((task, index) => list.append(createTaskCard(task, index, zoneTasks)));
        }
      });
    };

    const reorderByDrop = (task, targetZone, beforeTaskId = null) => {
      const zoneTasks = sortedTasks(targetZone).filter((candidate) => candidate.id !== task.id);
      const targetIndex = beforeTaskId
        ? Math.max(
            0,
            zoneTasks.findIndex((candidate) => candidate.id === beforeTaskId)
          )
        : zoneTasks.length;
      zoneTasks.splice(targetIndex, 0, task);
      zoneTasks.forEach((candidate, index) => {
        candidate.position = index;
      });
    };

    const handleDrop = (taskId, targetZone, beforeTaskId = null) => {
      const task = tasks.find((candidate) => candidate.id === taskId);
      if (!task || !Object.prototype.hasOwnProperty.call(zones, targetZone)) return;
      if (task.id === beforeTaskId) return;
      const previousZone = task.zone;
      if (targetZone !== previousZone && targetZone !== zones[previousZone].next) {
        announce(
          `Ese movimiento no forma parte del ciclo. Desde ${zones[previousZone].label} la siguiente zona es ${zones[zones[previousZone].next].label}.`
        );
        return;
      }
      task.zone = targetZone;
      reorderByDrop(task, targetZone, beforeTaskId);
      if (previousZone !== targetZone) normalizePositions(previousZone);
      saveTasks();
      renderBoard();
      announce(
        previousZone === targetZone
          ? `“${task.title}” cambió de posición.`
          : `“${task.title}” se movió a ${zones[targetZone].label}.`
      );
    };

    Object.entries(lists).forEach(([zone, list]) => {
      list.addEventListener("dragover", (event) => {
        event.preventDefault();
        list.classList.add("is-drop-target");
      });
      list.addEventListener("dragleave", (event) => {
        if (!list.contains(event.relatedTarget)) list.classList.remove("is-drop-target");
      });
      list.addEventListener("drop", (event) => {
        event.preventDefault();
        list.classList.remove("is-drop-target");
        handleDrop(draggingTaskId || event.dataTransfer.getData("text/plain"), zone);
      });
    });

    editorForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (savingTask) return;
      const title = titleInput.value.trim();
      const description = descriptionInput.value.trim();
      if (!title) {
        editorError.textContent = "Escribe un título para la tarea.";
        titleInput.focus();
        return;
      }

      savingTask = true;
      editorSubmit.disabled = true;
      if (editingTaskId) {
        const task = tasks.find((candidate) => candidate.id === editingTaskId);
        if (task) {
          task.title = title;
          task.description = description;
          announce(`Se guardaron los cambios de “${task.title}”.`);
        }
      } else {
        tasks.push({
          id: `jose-tarea-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          title,
          description,
          zone: "available",
          position: sortedTasks("available").length,
          createdAt: new Date().toISOString(),
        });
        announce(`Se agregó “${title}” a Tareas disponibles.`);
      }
      saveTasks();
      renderBoard();
      closeDialog(editorDialog);
      editorForm.reset();
      editingTaskId = null;
      savingTask = false;
      editorSubmit.disabled = false;
    });

    deleteForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const task = tasks.find((candidate) => candidate.id === deletingTaskId);
      if (!task) return;
      tasks = tasks.filter((candidate) => candidate.id !== deletingTaskId);
      normalizePositions(task.zone);
      saveTasks();
      renderBoard();
      closeDialog(deleteDialog);
      announce(`Se eliminó la tarea “${task.title}”.`);
      deletingTaskId = null;
    });

    newTaskButton.addEventListener("click", () => openEditor());
    closeEditorButton.addEventListener("click", () => {
      editingTaskId = null;
      editorError.textContent = "";
      closeDialog(editorDialog);
    });
    closeDeleteButton.addEventListener("click", () => {
      deletingTaskId = null;
      closeDialog(deleteDialog);
    });
    [editorDialog, deleteDialog].forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) closeDialog(dialog);
      });
      dialog.addEventListener("cancel", () => {
        editingTaskId = null;
        deletingTaskId = null;
      });
    });
    resetTasksButton.addEventListener("click", () => {
      if (!window.confirm("¿Deseas eliminar las tareas actuales y recuperar las cinco tareas iniciales?")) {
        return;
      }
      tasks = cloneInitialTasks();
      saveTasks();
      renderBoard();
      announce("El tablero se restableció con las cinco tareas iniciales.");
    });

    loadTasks();
    renderBoard();
    if (storageAvailable && !statusElement.textContent) {
      announce("Las tareas se guardan automáticamente en este dispositivo.");
    }
  }
})();
