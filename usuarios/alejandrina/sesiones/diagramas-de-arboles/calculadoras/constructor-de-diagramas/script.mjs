import {
  CATEGORY_THEMES,
  buildTree,
  countTreeNodes,
  flattenTree
} from "../../arboles.mjs";

const MAX_ITEMS = 5;
const MAX_CATEGORIES = 3;
const MAX_VISIBLE_NODES = 120;

const form = document.querySelector("[data-tree-calculator]");
const collectionDisplay = document.querySelector("[data-collection-display]");
const stagesSelect = document.querySelector("[data-stages]");
const replacementInput = document.querySelector("[data-replacement]");
const ruleHelp = document.querySelector("[data-rule-help]");
const message = document.querySelector("[data-calculator-message]");
const results = document.querySelector("[data-results]");
const resultsTitle = document.querySelector("[data-results-title]");
const resultCollection = document.querySelector("[data-result-collection]");
const resultRequested = document.querySelector("[data-result-requested]");
const resultBuilt = document.querySelector("[data-result-built]");
const resultRule = document.querySelector("[data-result-rule]");
const stageWarning = document.querySelector("[data-stage-warning]");
const treeContainer = document.querySelector("[data-result-tree]");
const pathWalk = document.querySelector("[data-path-walk]");
const dialog = document.querySelector("[data-collection-dialog]");
const draftCollectionContainer = document.querySelector("[data-draft-collection]");
const collectionStatus = document.querySelector("[data-collection-status]");
const emojiGroupsContainer = document.querySelector("[data-emoji-groups]");

const PRESETS = {
  mascotas: ["🐱", "🐱", "🐶"],
  frutas: ["🍎", "🍌"],
  colores: ["🔴", "🔵", "🟡"]
};

const PICKER_GROUPS = [
  { label: "Animales", emojis: CATEGORY_THEMES[0] },
  { label: "Frutas", emojis: CATEGORY_THEMES[2] },
  { label: "Colores", emojis: CATEGORY_THEMES[4] },
  { label: "Deportes", emojis: CATEGORY_THEMES[6] },
  { label: "Naturaleza", emojis: CATEGORY_THEMES[8] }
];

let collection = [...PRESETS.mascotas];
let draftCollection = [];
let hasGenerated = false;

function element(tagName, className, text) {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function plural(value, singular, pluralForm = `${singular}s`) {
  return `${value} ${value === 1 ? singular : pluralForm}`;
}

function uniqueEmojis(items) {
  return [...new Set(items)];
}

function groupCollection(items) {
  const groups = [];

  items.forEach((emoji) => {
    const current = groups.find((group) => group.emoji === emoji);
    if (current) {
      current.count += 1;
    } else {
      groups.push({
        id: `category-${groups.length + 1}`,
        emoji,
        label: emoji,
        count: 1
      });
    }
  });

  return groups;
}

function collectionText(items) {
  if (!items.length) return "Sin elementos";
  return groupCollection(items)
    .map((category) => `${category.emoji} × ${category.count}`)
    .join(" · ");
}

function renderCollection() {
  collectionDisplay.replaceChildren();

  if (!collection.length) {
    collectionDisplay.append(element("p", "empty-collection", "La colección está vacía. Edítala para agregar elementos."));
    return;
  }

  collection.forEach((emoji) => {
    const token = element("span", "collection-token", emoji);
    token.setAttribute("aria-hidden", "true");
    collectionDisplay.append(token);
  });
}

function updateRuleHelp() {
  ruleHelp.textContent = replacementInput.checked
    ? "Con repetición: cada elemento que sale vuelve a estar disponible."
    : "Sin repetición: cada elemento que sale deja de estar disponible.";
}

function setMessage(text = "", kind = "") {
  message.textContent = text;
  if (kind) {
    message.dataset.kind = kind;
  } else {
    delete message.dataset.kind;
  }
}

function markChanged() {
  updateRuleHelp();

  if (!hasGenerated) return;

  results.hidden = true;
  setMessage("Los datos cambiaron. Genera de nuevo el diagrama para ver el resultado actualizado.");
}

function renderPickerGroups() {
  emojiGroupsContainer.replaceChildren();

  PICKER_GROUPS.forEach((group) => {
    const section = element("section", "emoji-group");
    const heading = element("h3", "", group.label);
    const grid = element("div", "emoji-grid");

    group.emojis.forEach((emoji) => {
      const button = element("button", "emoji-option", emoji);
      button.type = "button";
      button.dataset.addEmoji = emoji;
      button.setAttribute("aria-label", `Agregar ${emoji}`);
      grid.append(button);
    });

    section.append(heading, grid);
    emojiGroupsContainer.append(section);
  });
}

function renderDraftCollection() {
  draftCollectionContainer.replaceChildren();

  if (!draftCollection.length) {
    draftCollectionContainer.append(element("p", "empty-collection", "Aún no has elegido elementos."));
  } else {
    draftCollection.forEach((emoji, index) => {
      const button = element("button", "draft-token", emoji);
      button.type = "button";
      button.dataset.removeIndex = String(index);
      button.setAttribute("aria-label", `Quitar ${emoji} de la colección`);
      draftCollectionContainer.append(button);
    });
  }

  const categoryCount = uniqueEmojis(draftCollection).length;
  collectionStatus.textContent = `${draftCollection.length}/${MAX_ITEMS} elementos · ${categoryCount}/${MAX_CATEGORIES} tipos`;

  emojiGroupsContainer.querySelectorAll("[data-add-emoji]").forEach((button) => {
    const emoji = button.dataset.addEmoji;
    const isNewCategory = !draftCollection.includes(emoji);
    button.disabled = draftCollection.length >= MAX_ITEMS
      || (isNewCategory && categoryCount >= MAX_CATEGORIES);
  });
}

function openCollectionDialog() {
  draftCollection = [...collection];
  renderDraftCollection();
  dialog.showModal();
  dialog.querySelector(".dialog-shell").scrollTop = 0;
}

function cancelCollectionDialog() {
  dialog.close("cancel");
}

function acceptCollection() {
  collection = [...draftCollection];
  renderCollection();
  dialog.close("accept");
  markChanged();
}

function buildScenario(stages, replacement) {
  return {
    categories: groupCollection(collection),
    stages,
    replacement,
    untilEnd: false
  };
}

function formatRemaining(node, categories) {
  if (!node.remaining) return "La colección vuelve a quedar igual.";

  const available = categories
    .map((category) => ({
      ...category,
      count: node.remaining[category.id] ?? 0
    }))
    .filter((category) => category.count > 0);

  if (!available.length) return "La colección queda vacía.";

  const text = available
    .map((category) => `${category.emoji} × ${category.count}`)
    .join(" · ");

  return `Queda: ${text}`;
}

function renderTree(root, scenario) {
  treeContainer.replaceChildren();

  const rootRow = element("div", "tree-root");
  rootRow.append(
    element("strong", "", "Inicio"),
    element("span", "", collectionText(collection))
  );
  treeContainer.append(rootRow);

  flattenTree(root).forEach((rowData) => {
    const { node } = rowData;
    const row = element("div", "tree-row");
    row.style.setProperty("--row-depth", String(node.depth));

    const depth = element("span", "tree-depth", `E${node.depth}`);
    const emoji = element("span", "tree-emoji", node.category.emoji);
    emoji.setAttribute("aria-hidden", "true");
    const path = element(
      "span",
      "tree-path-label",
      node.path
        .map(
          (categoryId) =>
            scenario.categories.find(
              (category) => category.id === categoryId
            )?.emoji ?? "?"
        )
        .join(" → ")
    );

    row.append(depth, emoji, path);
    treeContainer.append(row);
  });
}

function firstPath(root) {
  const path = [];
  let current = root;

  while (current.children?.length) {
    current = current.children[0];
    path.push(current);
  }

  return path;
}

function renderPathWalk(root, scenario) {
  pathWalk.replaceChildren();

  const start = element("article", "path-step");
  start.append(
    element("span", "path-step-number", "Inicio"),
    element("strong", "", collection.map((emoji) => emoji).join(" ")),
    element("p", "", "Todos los elementos están disponibles.")
  );
  pathWalk.append(start);

  firstPath(root).forEach((node, index) => {
    const card = element("article", "path-step");
    const remainingText = scenario.replacement
      ? "Regresa y vuelve a estar disponible."
      : formatRemaining(node, scenario.categories);

    card.append(
      element("span", "path-step-number", `Etapa ${index + 1}`),
      element("strong", "", `Sale ${node.category.emoji}`),
      element("p", "", remainingText)
    );
    pathWalk.append(card);
  });
}

function showResult(root, scenario, requestedStages, builtStages) {
  resultCollection.textContent = collectionText(collection);
  resultRequested.textContent = plural(requestedStages, "etapa");
  resultBuilt.textContent = plural(builtStages, "etapa");
  resultRule.textContent = scenario.replacement ? "Con repetición" : "Sin repetición";

  if (!scenario.replacement && builtStages < requestedStages) {
    stageWarning.hidden = false;
    stageWarning.textContent = `Solicitaste ${plural(requestedStages, "etapa")}, pero sin repetición solo se pueden construir ${plural(builtStages, "etapa")} porque la colección tiene ${plural(collection.length, "elemento")}. Al terminarse los elementos, ya no puede salir una rama nueva.`;
  } else {
    stageWarning.hidden = true;
    stageWarning.textContent = "";
  }

  renderTree(root, scenario);
  renderPathWalk(root, scenario);
  results.hidden = false;
  resultsTitle.focus({ preventScroll: true });
  results.scrollIntoView({ behavior: "smooth", block: "start" });
}

function generateTree() {
  setMessage();
  results.hidden = true;

  if (!collection.length) {
    setMessage("Agrega al menos un elemento a la colección antes de generar el diagrama.", "error");
    document.querySelector("[data-open-collection]").focus();
    return;
  }

  const requestedStages = Number(stagesSelect.value);
  const replacement = replacementInput.checked;
  const builtStages = replacement
    ? requestedStages
    : Math.min(requestedStages, collection.length);
  const scenario = buildScenario(builtStages, replacement);
  const root = buildTree(scenario);
  const nodeCount = countTreeNodes(root);

  if (nodeCount > MAX_VISIBLE_NODES) {
    setMessage(
      "Esta combinación produce un árbol demasiado grande para estudiarlo con claridad. Reduce las etapas, usa menos tipos o desactiva la repetición.",
      "error"
    );
    return;
  }

  hasGenerated = true;
  showResult(root, scenario, requestedStages, builtStages);
  setMessage("Diagrama generado. Puedes modificar los datos y volver a comparar.", "success");
}

renderPickerGroups();
renderCollection();
updateRuleHelp();

document.querySelector("[data-open-collection]").addEventListener("click", openCollectionDialog);
document.querySelectorAll("[data-collection-cancel]").forEach((button) => {
  button.addEventListener("click", cancelCollectionDialog);
});
document.querySelector("[data-collection-accept]").addEventListener("click", acceptCollection);

emojiGroupsContainer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add-emoji]");
  if (!button || button.disabled) return;

  draftCollection.push(button.dataset.addEmoji);
  renderDraftCollection();
});

draftCollectionContainer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-index]");
  if (!button) return;

  draftCollection.splice(Number(button.dataset.removeIndex), 1);
  renderDraftCollection();
});

document.querySelectorAll("[data-preset]").forEach((button) => {
  button.addEventListener("click", () => {
    collection = [...PRESETS[button.dataset.preset]];
    renderCollection();
    markChanged();
  });
});

stagesSelect.addEventListener("change", markChanged);
replacementInput.addEventListener("change", markChanged);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  generateTree();
});
