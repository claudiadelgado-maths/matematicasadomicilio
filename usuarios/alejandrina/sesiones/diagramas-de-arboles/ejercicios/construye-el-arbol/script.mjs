import {
  createScenario,
  describeCollection,
  findUnusedEmoji,
  flattenTree,
  scenarioSignature,
} from "../../arboles.mjs";

const completeTree = document.querySelector("[data-complete-tree]");

if (completeTree) {
  const completeCollection = document.querySelector("[data-complete-collection]");
  const completeRule = document.querySelector("[data-complete-rule]");
  const completeStages = document.querySelector("[data-complete-stages]");
  const completePalette = document.querySelector("[data-complete-palette]");
  const completeFeedback = document.querySelector("[data-complete-feedback]");
  const completeCheck = document.querySelector("[data-complete-check]");
  const completeNew = document.querySelector("[data-complete-new]");

  const readTree = document.querySelector("[data-read-tree]");
  const readContext = document.querySelector("[data-read-context]");
  const readQuestion = document.querySelector("[data-read-question]");
  const readFeedback = document.querySelector("[data-read-feedback]");
  const readCheck = document.querySelector("[data-read-check]");
  const readNew = document.querySelector("[data-read-new]");

  const buildCollection = document.querySelector("[data-build-collection]");
  const buildRule = document.querySelector("[data-build-rule]");
  const buildStages = document.querySelector("[data-build-stages]");
  const builderTree = document.querySelector("[data-builder-tree]");
  const builderPath = document.querySelector("[data-builder-path]");
  const builderQuestion = document.querySelector("[data-builder-question]");
  const builderOptions = document.querySelector("[data-builder-options]");
  const builderClear = document.querySelector("[data-builder-clear]");
  const buildFeedback = document.querySelector("[data-build-feedback]");
  const buildCheck = document.querySelector("[data-build-check]");
  const buildNew = document.querySelector("[data-build-new]");

  const createElement = (tagName, className = "", text = "") => {
    const node = document.createElement(tagName);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  const shuffle = (items) => {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  };

  const ruleLabel = (scenario) =>
    scenario.replacement
      ? "Con repetición / con reemplazo"
      : "Sin repetición / sin reemplazo";

  const stagesLabel = (scenario) =>
    scenario.untilEnd
      ? "Hasta terminar"
      : `${scenario.stages} ${scenario.stages === 1 ? "etapa" : "etapas"}`;

  const collectionLabel = (scenario) =>
    describeCollection(scenario).join(" ");

  const setFeedback = (element, state, message) => {
    element.className = `practice-feedback${state ? ` is-${state}` : ""}`;
    element.textContent = message;
  };

  const appendRootLine = (container, interactive = false, selected = false) => {
    const line = createElement("div", "tree-root-line");
    if (!interactive) {
      line.append(createElement("strong", "", "Inicio"));
      container.append(line);
      return;
    }
    const button = createElement("button", "builder-node-button", "Inicio");
    button.type = "button";
    button.dataset.builderNode = "root";
    button.setAttribute("aria-label", "Editar ramas desde Inicio");
    if (selected) button.classList.add("is-selected");
    line.append(button);
    container.append(line);
  };

  const appendStaticTree = (container, tree) => {
    container.replaceChildren();
    appendRootLine(container);
    flattenTree(tree).forEach((row) => {
      const line = createElement("div", "tree-line");
      line.append(createElement("span", "tree-guide", row.guide));
      const label = createElement(
        "span",
        "tree-label",
        row.node.category.emoji
      );
      label.setAttribute("aria-label", row.node.category.emoji);
      line.append(label);
      container.append(line);
    });
  };

  let completeScenario;
  let completeSignature = "";
  let completeHidden = new Set();
  let completeAnswers = new Map();
  let completeSelectedCategory = "";
  let completeStates = new Map();

  const renderCompletePalette = () => {
    completePalette.replaceChildren();
    completeScenario.categories.forEach((category) => {
      const button = createElement("button", "emoji-choice", category.emoji);
      button.type = "button";
      button.dataset.completeCategory = category.id;
      button.setAttribute(
        "aria-label",
        `Elegir categoría ${category.emoji}`
      );
      button.setAttribute(
        "aria-pressed",
        String(completeSelectedCategory === category.id)
      );
      completePalette.append(button);
    });
  };

  const renderCompleteTree = () => {
    completeTree.replaceChildren();
    appendRootLine(completeTree);
    flattenTree(completeScenario.tree).forEach((row) => {
      const line = createElement("div", "tree-line");
      line.append(createElement("span", "tree-guide", row.guide));
      if (completeHidden.has(row.node.id)) {
        const answerId = completeAnswers.get(row.node.id) ?? "";
        const answerCategory = completeScenario.categories.find(
          (category) => category.id === answerId
        );
        const slot = createElement(
          "button",
          `tree-slot${answerCategory ? " is-filled" : ""}`,
          answerCategory?.emoji ?? "?"
        );
        slot.type = "button";
        slot.dataset.completeSlot = row.node.id;
        slot.setAttribute(
          "aria-label",
          answerCategory
            ? `Espacio completado con ${answerCategory.emoji}. Toca para cambiarlo.`
            : `Espacio vacío en la etapa ${row.depth}`
        );
        const state = completeStates.get(row.node.id);
        if (state) slot.classList.add(`is-${state}`);
        line.append(slot);
      } else {
        const label = createElement(
          "span",
          "tree-label",
          row.node.category.emoji
        );
        label.setAttribute("aria-label", row.node.category.emoji);
        line.append(label);
      }
      completeTree.append(line);
    });
  };

  const generateCompleteExercise = () => {
    completeScenario = createScenario("complete", completeSignature);
    completeSignature = scenarioSignature(completeScenario);
    const edges = flattenTree(completeScenario.tree);
    const hiddenCount = Math.min(
      edges.length,
      Math.floor(Math.random() * 3) + 1
    );
    completeHidden = new Set(
      shuffle(edges)
        .slice(0, hiddenCount)
        .map((row) => row.node.id)
    );
    completeAnswers = new Map();
    completeStates = new Map();
    completeSelectedCategory = "";

    completeCollection.textContent = collectionLabel(completeScenario);
    completeRule.textContent = ruleLabel(completeScenario);
    completeStages.textContent = stagesLabel(completeScenario);
    renderCompletePalette();
    renderCompleteTree();
    setFeedback(
      completeFeedback,
      "",
      `Faltan ${hiddenCount} ${
        hiddenCount === 1 ? "pieza" : "piezas"
      }. Elige una categoría y colócala en cada espacio.`
    );
  };

  completePalette.addEventListener("click", (event) => {
    const button = event.target.closest("[data-complete-category]");
    if (!button) return;
    completeSelectedCategory = button.dataset.completeCategory;
    renderCompletePalette();
    setFeedback(
      completeFeedback,
      "",
      "Categoría seleccionada. Ahora toca el espacio donde quieres colocarla."
    );
  });

  completeTree.addEventListener("click", (event) => {
    const slot = event.target.closest("[data-complete-slot]");
    if (!slot) return;
    if (!completeSelectedCategory) {
      setFeedback(
        completeFeedback,
        "incorrect",
        "Primero elige una categoría de la bandeja."
      );
      completePalette.querySelector("button")?.focus();
      return;
    }
    completeAnswers.set(slot.dataset.completeSlot, completeSelectedCategory);
    completeStates.delete(slot.dataset.completeSlot);
    renderCompleteTree();
    completeTree
      .querySelector(`[data-complete-slot="${slot.dataset.completeSlot}"]`)
      ?.focus();
  });

  completeCheck.addEventListener("click", () => {
    completeStates = new Map();
    let correctCount = 0;
    let emptyCount = 0;
    const edgeMap = new Map(
      flattenTree(completeScenario.tree).map((row) => [row.node.id, row.node])
    );
    completeHidden.forEach((nodeId) => {
      const answer = completeAnswers.get(nodeId);
      if (!answer) emptyCount += 1;
      const correct = answer === edgeMap.get(nodeId)?.category.id;
      completeStates.set(nodeId, correct ? "correct" : "incorrect");
      if (correct) correctCount += 1;
    });
    renderCompleteTree();

    if (correctCount === completeHidden.size) {
      setFeedback(
        completeFeedback,
        "correct",
        "¡Correcto! Todas las ramas completan el árbol de acuerdo con la colección y la regla."
      );
      return;
    }

    const baseHint = completeScenario.replacement
      ? "Como hay reemplazo, la colección vuelve a estar disponible en cada etapa."
      : "Recorre cada camino y pregúntate qué queda después de la extracción.";
    setFeedback(
      completeFeedback,
      "incorrect",
      `${
        emptyCount
          ? `Todavía ${emptyCount === 1 ? "queda un espacio vacío" : `quedan ${emptyCount} espacios vacíos`}. `
          : ""
      }Conserva las piezas marcadas en verde y revisa únicamente las rojas. ${baseHint}`
    );
  });

  completeNew.addEventListener("click", () => {
    generateCompleteExercise();
    completePalette.querySelector("button")?.focus();
  });

  let readMode = Math.random() < 0.5 ? "stages" : "collection";
  let readScenario;
  let readSignature = "";
  let readCounts = new Map();
  let readDistractor = null;

  const renderStageQuestion = () => {
    readQuestion.replaceChildren();
    readQuestion.append(
      createElement("p", "", "Pregunta sobre niveles"),
      createElement(
        "h3",
        "",
        "¿Cuántas etapas o niveles tiene este diagrama?"
      ),
      createElement(
        "p",
        "",
        "No cuentes ramas. Observa cuántos pasos tiene un camino desde Inicio."
      )
    );
    const options = createElement("div", "level-options");
    options.setAttribute("role", "radiogroup");
    options.setAttribute("aria-label", "Número de etapas");
    for (let value = 1; value <= 5; value += 1) {
      const label = createElement("label", "level-option");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "read-stages";
      input.value = String(value);
      const visual = createElement("span", "", String(value));
      label.append(input, visual);
      options.append(label);
    }
    readQuestion.append(options);
  };

  const renderCounterQuestion = () => {
    readQuestion.replaceChildren();
    readQuestion.append(
      createElement("p", "", "Pregunta sobre la colección"),
      createElement(
        "h3",
        "",
        "¿Cuántos elementos había de cada tipo al principio?"
      ),
      createElement(
        "p",
        "",
        "Observa un camino completo: al terminar se han utilizado todos los elementos."
      )
    );

    const categories = [...readScenario.categories];
    if (readDistractor) categories.push(readDistractor);
    const counterList = createElement("div", "counter-list");
    categories.forEach((category) => {
      const row = createElement("div", "counter-row");
      const emoji = createElement("span", "counter-emoji", category.emoji);
      emoji.setAttribute("aria-hidden", "true");
      const value = createElement(
        "strong",
        "",
        String(readCounts.get(category.id) ?? 0)
      );
      value.dataset.counterValue = category.id;

      const decrease = createElement("button", "counter-button", "−");
      decrease.type = "button";
      decrease.dataset.counterId = category.id;
      decrease.dataset.counterAction = "decrease";
      decrease.setAttribute(
        "aria-label",
        `Quitar un elemento ${category.emoji}`
      );

      const increase = createElement("button", "counter-button", "+");
      increase.type = "button";
      increase.dataset.counterId = category.id;
      increase.dataset.counterAction = "increase";
      increase.setAttribute(
        "aria-label",
        `Agregar un elemento ${category.emoji}`
      );

      row.append(emoji, value, decrease, increase);
      counterList.append(row);
    });
    readQuestion.append(counterList);
  };

  const generateReadExercise = (switchMode = false) => {
    if (switchMode) {
      readMode = readMode === "stages" ? "collection" : "stages";
    }
    const purpose =
      readMode === "stages" ? "read-stages" : "read-collection";
    readScenario = createScenario(purpose, readSignature);
    readSignature = scenarioSignature(readScenario);
    appendStaticTree(readTree, readScenario.tree);
    readTree.tabIndex = 0;

    if (readMode === "stages") {
      readContext.textContent =
        "Observa la profundidad de cualquier camino completo.";
      readCounts = new Map();
      readDistractor = null;
      renderStageQuestion();
    } else {
      readContext.textContent =
        "Regla: sin repetición · Extracciones: hasta terminar.";
      readCounts = new Map(
        readScenario.categories.map((category) => [category.id, 0])
      );
      readDistractor =
        Math.random() < 0.4
          ? {
              id: "distractor",
              emoji: findUnusedEmoji(readScenario),
              count: 0,
            }
          : null;
      if (readDistractor) readCounts.set(readDistractor.id, 0);
      renderCounterQuestion();
    }

    setFeedback(
      readFeedback,
      "",
      readMode === "stages"
        ? "Sigue un camino desde Inicio y cuenta sus pasos."
        : "Reconstruye las cantidades. El orden de los elementos no importa."
    );
  };

  readQuestion.addEventListener("click", (event) => {
    const button = event.target.closest("[data-counter-action]");
    if (!button) return;
    const categoryId = button.dataset.counterId;
    const currentValue = readCounts.get(categoryId) ?? 0;
    const nextValue =
      button.dataset.counterAction === "increase"
        ? Math.min(5, currentValue + 1)
        : Math.max(0, currentValue - 1);
    readCounts.set(categoryId, nextValue);
    renderCounterQuestion();
    readQuestion
      .querySelector(
        `[data-counter-id="${categoryId}"][data-counter-action="${button.dataset.counterAction}"]`
      )
      ?.focus();
  });

  readCheck.addEventListener("click", () => {
    if (readMode === "stages") {
      const selected = readQuestion.querySelector(
        'input[name="read-stages"]:checked'
      );
      if (!selected) {
        setFeedback(
          readFeedback,
          "incorrect",
          "Selecciona primero cuántas etapas observas."
        );
        return;
      }
      const correct = Number(selected.value) === readScenario.stages;
      setFeedback(
        readFeedback,
        correct ? "correct" : "incorrect",
        correct
          ? `¡Correcto! Cada camino completo tiene ${readScenario.stages} ${
              readScenario.stages === 1 ? "paso" : "pasos"
            }.`
          : "Revisa la profundidad: una etapa es un paso del camino, no el número total de ramas."
      );
      return;
    }

    const correct = readScenario.categories.every(
      (category) => readCounts.get(category.id) === category.count
    );
    const distractorCorrect =
      !readDistractor || readCounts.get(readDistractor.id) === 0;
    setFeedback(
      readFeedback,
      correct && distractorCorrect ? "correct" : "incorrect",
      correct && distractorCorrect
        ? "¡Correcto! Un camino completo contiene exactamente todos los elementos de la colección inicial."
        : "Las cantidades todavía no coinciden. Sigue un camino hasta el final y cuenta cuántas veces aparece cada categoría."
    );
  });

  readNew.addEventListener("click", () => {
    generateReadExercise(true);
    readQuestion.querySelector("input, button")?.focus();
  });

  let buildScenario;
  let buildSignature = "";
  let userRoot;
  let selectedUserNodeId = "root";
  let problemNodeIds = new Set();

  const createUserRoot = () => ({
    id: "root",
    parentId: null,
    category: null,
    depth: 0,
    path: [],
    children: [],
  });

  const findUserNode = (node, nodeId) => {
    if (node.id === nodeId) return node;
    for (const child of node.children) {
      const found = findUserNode(child, nodeId);
      if (found) return found;
    }
    return null;
  };

  const formatUserPath = (node) =>
    node.path.length
      ? `Inicio → ${node.path
          .map(
            (categoryId) =>
              buildScenario.categories.find(
                (category) => category.id === categoryId
              )?.emoji ?? "?"
          )
          .join(" → ")}`
      : "Inicio";

  const renderBuilderTree = () => {
    builderTree.replaceChildren();
    appendRootLine(
      builderTree,
      true,
      selectedUserNodeId === "root"
    );
    const rootButton = builderTree.querySelector("[data-builder-node='root']");
    if (problemNodeIds.has("root")) rootButton?.classList.add("is-problem");

    flattenTree(userRoot).forEach((row) => {
      const line = createElement("div", "tree-line");
      line.append(createElement("span", "tree-guide", row.guide));
      const button = createElement(
        "button",
        "builder-node-button",
        row.node.category.emoji
      );
      button.type = "button";
      button.dataset.builderNode = row.node.id;
      button.setAttribute(
        "aria-label",
        `Editar ramas desde ${formatUserPath(row.node)}`
      );
      if (selectedUserNodeId === row.node.id) {
        button.classList.add("is-selected");
      }
      if (problemNodeIds.has(row.node.id)) {
        button.classList.add("is-problem");
      }
      button.append(
        createElement(
          "span",
          "builder-node-depth",
          `etapa ${row.node.depth}`
        )
      );
      line.append(button);
      builderTree.append(line);
    });
  };

  const renderNodeEditor = () => {
    const selectedNode =
      findUserNode(userRoot, selectedUserNodeId) ?? userRoot;
    selectedUserNodeId = selectedNode.id;
    builderPath.textContent = formatUserPath(selectedNode);

    if (selectedNode.depth > buildScenario.stages) {
      builderQuestion.textContent =
        "Este camino ya supera el número de etapas indicado.";
    } else if (selectedNode.depth === buildScenario.stages) {
      builderQuestion.textContent =
        "¿El proceso debe continuar después de completar las etapas?";
    } else if (selectedNode.depth === 0) {
      builderQuestion.textContent = "¿Qué puede ocurrir primero?";
    } else {
      builderQuestion.textContent =
        "¿Qué puede ocurrir después de este camino?";
    }

    builderOptions.replaceChildren();
    if (selectedNode.depth <= buildScenario.stages) {
      buildScenario.categories.forEach((category) => {
        const active = selectedNode.children.some(
          (child) => child.category.id === category.id
        );
        const button = createElement(
          "button",
          "branch-toggle",
          category.emoji
        );
        button.type = "button";
        button.dataset.builderCategory = category.id;
        button.setAttribute("aria-pressed", String(active));
        button.setAttribute(
          "aria-label",
          `${active ? "Quitar" : "Agregar"} rama ${category.emoji} desde ${formatUserPath(selectedNode)}`
        );
        builderOptions.append(button);
      });
    } else {
      builderOptions.append(
        createElement(
          "p",
          "",
          "Selecciona un nodo anterior para corregir el árbol."
        )
      );
    }
    builderClear.disabled = selectedNode.children.length === 0;
  };

  const renderBuilder = () => {
    renderBuilderTree();
    renderNodeEditor();
  };

  const generateBuildExercise = () => {
    buildScenario = createScenario("build", buildSignature);
    buildSignature = scenarioSignature(buildScenario);
    buildCollection.textContent = collectionLabel(buildScenario);
    buildRule.textContent = ruleLabel(buildScenario);
    buildStages.textContent = stagesLabel(buildScenario);
    userRoot = createUserRoot();
    selectedUserNodeId = "root";
    problemNodeIds = new Set();
    renderBuilder();
    setFeedback(
      buildFeedback,
      "",
      "Selecciona Inicio y añade las posibilidades de la primera etapa."
    );
  };

  builderTree.addEventListener("click", (event) => {
    const button = event.target.closest("[data-builder-node]");
    if (!button) return;
    selectedUserNodeId = button.dataset.builderNode;
    renderBuilder();
    builderOptions.querySelector("button")?.focus();
  });

  builderOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-builder-category]");
    if (!button) return;
    const selectedNode = findUserNode(userRoot, selectedUserNodeId);
    if (!selectedNode) return;
    const category = buildScenario.categories.find(
      (item) => item.id === button.dataset.builderCategory
    );
    if (!category) return;

    const existingIndex = selectedNode.children.findIndex(
      (child) => child.category.id === category.id
    );
    if (existingIndex >= 0) {
      selectedNode.children.splice(existingIndex, 1);
    } else {
      const path = [...selectedNode.path, category.id];
      selectedNode.children.push({
        id: `root/${path.join("/")}`,
        parentId: selectedNode.id,
        category,
        depth: selectedNode.depth + 1,
        path,
        children: [],
      });
      selectedNode.children.sort(
        (first, second) =>
          buildScenario.categories.findIndex(
            (item) => item.id === first.category.id
          ) -
          buildScenario.categories.findIndex(
            (item) => item.id === second.category.id
          )
      );
    }
    problemNodeIds.clear();
    renderBuilder();
    builderOptions
      .querySelector(
        `[data-builder-category="${category.id}"]`
      )
      ?.focus();
  });

  builderClear.addEventListener("click", () => {
    const selectedNode = findUserNode(userRoot, selectedUserNodeId);
    if (!selectedNode) return;
    selectedNode.children = [];
    problemNodeIds.clear();
    renderBuilder();
    builderOptions.querySelector("button")?.focus();
  });

  const compareTrees = () => {
    const messages = [];
    problemNodeIds = new Set();

    const compareNode = (expectedNode, userNode) => {
      const expectedByCategory = new Map(
        expectedNode.children.map((child) => [child.category.id, child])
      );
      const userByCategory = new Map(
        userNode.children.map((child) => [child.category.id, child])
      );
      const pathText = formatUserPath(userNode);

      expectedByCategory.forEach((expectedChild, categoryId) => {
        const userChild = userByCategory.get(categoryId);
        if (!userChild) {
          problemNodeIds.add(userNode.id);
          messages.push(
            `Desde ${pathText} falta la posibilidad ${expectedChild.category.emoji}.`
          );
          return;
        }
        compareNode(expectedChild, userChild);
      });

      userByCategory.forEach((userChild, categoryId) => {
        if (expectedByCategory.has(categoryId)) return;
        problemNodeIds.add(userChild.id);
        if (expectedNode.children.length === 0) {
          messages.push(
            `El camino ${formatUserPath(userNode)} ya debía terminar en la etapa ${buildScenario.stages}.`
          );
        } else {
          messages.push(
            `La rama ${userChild.category.emoji} no es posible desde ${pathText}.`
          );
        }
      });
    };

    compareNode(buildScenario.tree, userRoot);
    return messages;
  };

  buildCheck.addEventListener("click", () => {
    const messages = compareTrees();
    renderBuilder();
    if (messages.length === 0) {
      setFeedback(
        buildFeedback,
        "correct",
        "¡Árbol correcto! Incluiste todas las posibilidades y respetaste la regla en cada camino."
      );
      return;
    }
    const uniqueMessages = [...new Set(messages)].slice(0, 3);
    setFeedback(
      buildFeedback,
      "incorrect",
      `${uniqueMessages.join(" ")} ${
        messages.length > uniqueMessages.length
          ? "Corrige estos puntos y vuelve a comprobar para encontrar los siguientes."
          : "Corrige las ramas señaladas y vuelve a comprobar."
      }`
    );
  });

  buildNew.addEventListener("click", () => {
    generateBuildExercise();
    builderTree.querySelector("[data-builder-node='root']")?.focus();
  });

  generateCompleteExercise();
  generateReadExercise();
  generateBuildExercise();
}
