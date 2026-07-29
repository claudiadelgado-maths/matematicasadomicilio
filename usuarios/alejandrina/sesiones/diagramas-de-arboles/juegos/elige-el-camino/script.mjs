export const EMOJI_THEMES = [
  ["🐱", "🐶", "🐰", "🐸", "🐵", "🦊"],
  ["🍎", "🍊", "🍌", "🍇", "🍓", "🍐"],
  ["⭐", "🌙", "☀️", "🪐", "🌎", "☄️"],
  ["🌸", "🌻", "🌵", "🍀", "🌲", "🌺"],
  ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠"],
  ["⚽", "🏀", "🎾", "🏐", "🎯", "🪁"],
  ["🚗", "🚲", "🚀", "⛵", "🚁", "🚂"]
];

export const MAZE_TEMPLATES = [
  {
    id: "doble-bifurcacion",
    branches: [[[], []], [[], []]]
  },
  {
    id: "pasillo-asimetrico",
    branches: [[[[], []], []], [[]]]
  },
  {
    id: "tres-salones",
    branches: [[[]], [[], [], []]]
  },
  {
    id: "torre-cuatro-niveles",
    branches: [[[[[], []], []], []], [[], [[], []]]]
  },
  {
    id: "escalera-partida",
    branches: [[[[]], []], [[], [[]]]]
  },
  {
    id: "tres-entradas",
    branches: [[[]], [[]], [[]]]
  },
  {
    id: "torre-cinco-niveles",
    branches: [[[[[[]], []]], []], [[], []]]
  },
  {
    id: "jardin-cruzado",
    branches: [[[], [[], []]], [[[]], []]]
  }
];

export function shuffle(values, random = Math.random) {
  const copy = [...values];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }

  return copy;
}

function randomItem(values, random) {
  return values[Math.floor(random() * values.length)];
}

function collectLeaves(node, leaves = []) {
  if (!node.children.length && node.parent) {
    leaves.push(node);
    return leaves;
  }

  node.children.forEach((child) => collectLeaves(child, leaves));
  return leaves;
}

function createGoalPath(goal) {
  const path = [];
  let current = goal;

  while (current?.parent) {
    path.unshift(current);
    current = current.parent;
  }

  return path;
}

export function createMaze(previousTemplateId = "", random = Math.random) {
  const availableTemplates = MAZE_TEMPLATES.filter(
    (template) => template.id !== previousTemplateId
  );
  const template = randomItem(
    availableTemplates.length ? availableTemplates : MAZE_TEMPLATES,
    random
  );

  let nodeSequence = 0;
  const levelThemes = shuffle(EMOJI_THEMES, random);
  const root = {
    id: "root",
    emoji: null,
    depth: 0,
    parent: null,
    children: []
  };

  const buildChildren = (shapes, parent, depth) => {
    const theme = levelThemes[(depth - 1) % levelThemes.length];
    const emojis = shuffle(theme, random).slice(0, shapes.length);

    return shapes.map((shape, index) => {
      nodeSequence += 1;
      const node = {
        id: `node-${nodeSequence}`,
        emoji: emojis[index],
        depth,
        parent,
        children: []
      };
      node.children = buildChildren(shape, node, depth + 1);
      return node;
    });
  };

  root.children = buildChildren(template.branches, root, 1);

  const leaves = collectLeaves(root);
  const maximumDepth = Math.max(...leaves.map((leaf) => leaf.depth));
  const deepestLeaves = leaves.filter((leaf) => leaf.depth === maximumDepth);
  const goal = randomItem(deepestLeaves, random);
  const goalPath = createGoalPath(goal);

  return {
    templateId: template.id,
    root,
    goal,
    goalPath,
    goalPathIds: new Set(goalPath.map((node) => node.id)),
    route: goalPath.map((node) => node.emoji),
    depth: goal.depth,
    nodeCount: nodeSequence
  };
}

function createElement(tagName, className, text) {
  const node = document.createElement(tagName);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function initialiseMazeGame() {
  const game = document.querySelector("[data-maze-game]");
  if (!game) return;

  const mazeNumber = game.querySelector("[data-maze-number]");
  const levelProgress = game.querySelector("[data-level-progress]");
  const gameStatus = game.querySelector("[data-game-status]");
  const mapDetails = game.querySelector("[data-map-details]");
  const mapTree = game.querySelector("[data-map-tree]");
  const room = game.querySelector("[data-room]");
  const roomTitle = game.querySelector("[data-room-title]");
  const roomInstruction = game.querySelector("[data-room-instruction]");
  const routeMemory = game.querySelector("[data-route-memory]");
  const doorsContainer = game.querySelector("[data-doors]");
  const transition = game.querySelector("[data-maze-transition]");
  const victory = game.querySelector("[data-maze-victory]");
  const victoryTitle = game.querySelector("[data-victory-title]");
  const victoryMessage = game.querySelector("[data-victory-message]");
  const victoryRoute = game.querySelector("[data-victory-route]");
  const playAgain = game.querySelector("[data-play-again]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const movementDelay = reducedMotion ? 40 : 280;
  const changeDelay = reducedMotion ? 100 : 760;

  const state = {
    maze: null,
    currentNode: null,
    travelled: [],
    labyrinthNumber: 0,
    attemptsThisRound: 0,
    locked: false
  };

  const renderMapNode = (node) => {
    const item = createElement("li", "map-branch");
    item.dataset.mapNode = node.id;

    const nodeLine = createElement("div", "map-node");
    nodeLine.setAttribute("role", "img");
    const emoji = createElement("span", "map-emoji", node.emoji);
    emoji.setAttribute("aria-hidden", "true");
    nodeLine.append(emoji);

    if (node.id === state.maze.goal.id) {
      const marker = createElement("strong", "goal-marker", "🌀 Salida");
      marker.dataset.goalMarker = "";
      marker.setAttribute("aria-hidden", "true");
      nodeLine.append(marker);
      nodeLine.setAttribute(
        "aria-label",
        `${node.emoji}, esta hoja contiene la salida`
      );
    } else {
      nodeLine.setAttribute("aria-label", `Rama ${node.emoji}`);
    }

    item.append(nodeLine);

    if (node.children.length) {
      const childList = createElement("ul", "map-children");
      node.children.forEach((child) => childList.append(renderMapNode(child)));
      item.append(childList);
    }

    return item;
  };

  const renderMap = () => {
    const list = createElement("ul", "map-tree");
    state.maze.root.children.forEach((child) => list.append(renderMapNode(child)));
    mapTree.replaceChildren(list);
  };

  const renderRouteMemory = () => {
    routeMemory.replaceChildren(createElement("strong", "", "Inicio"));

    state.travelled.forEach((node) => {
      const arrow = createElement("span", "route-arrow", "→");
      arrow.setAttribute("aria-hidden", "true");
      const step = createElement("span", "route-step", node.emoji);
      step.setAttribute("aria-label", `Después ${node.emoji}`);
      routeMemory.append(arrow, step);
    });
  };

  const finishMaze = () => {
    state.locked = true;
    doorsContainer.hidden = true;
    room.classList.remove("is-moving");
    room.classList.add("is-victory");
    victory.hidden = false;
    victoryRoute.textContent = `Inicio → ${state.travelled
      .map((node) => node.emoji)
      .join(" → ")} → 🌀`;
    victoryMessage.textContent =
      state.attemptsThisRound === 1
        ? `Escapaste con el primer mapa y recorriste ${state.travelled.length} puertas sin perderte.`
        : `Escapaste después de consultar ${state.attemptsThisRound} mapas y recorriste ${state.travelled.length} puertas en la ruta final.`;
    gameStatus.textContent = "Encontraste el portal y escapaste del laberinto.";
    victoryTitle.focus({ preventScroll: true });
  };

  const renderRoom = ({ moveFocus = true } = {}) => {
    const level = state.currentNode.depth + 1;
    state.locked = false;
    room.classList.remove("is-moving", "is-victory");
    victory.hidden = true;
    doorsContainer.hidden = false;
    mazeNumber.textContent = `Laberinto ${state.labyrinthNumber}`;
    levelProgress.textContent = `Nivel ${level} de ${state.maze.depth}`;
    roomTitle.textContent = `Nivel ${level}`;
    roomInstruction.textContent = "¿Qué puerta continúa el camino hacia 🌀?";
    renderRouteMemory();

    doorsContainer.replaceChildren();
    const doors = shuffle(state.currentNode.children);
    doorsContainer.dataset.doorCount = String(doors.length);

    doors.forEach((node) => {
      const button = createElement("button", "maze-door");
      button.type = "button";
      button.dataset.doorNode = node.id;
      button.setAttribute("aria-label", `Puerta ${node.emoji}`);

      const frame = createElement("span", "door-frame");
      frame.setAttribute("aria-hidden", "true");
      frame.append(
        createElement("span", "door-emblem", node.emoji),
        createElement("span", "door-handle")
      );

      const label = createElement("span", "door-label", `Puerta ${node.emoji}`);
      button.append(frame, label);
      button.addEventListener("click", () => chooseDoor(node, button));
      doorsContainer.append(button);
    });

    gameStatus.textContent = `Laberinto ${state.labyrinthNumber}. Nivel ${level} de ${state.maze.depth}. Hay ${doors.length} ${doors.length === 1 ? "puerta disponible" : "puertas disponibles"}.`;

    if (moveFocus) roomTitle.focus({ preventScroll: true });
  };

  const startNewMaze = ({ focusRoom = true } = {}) => {
    const previousTemplate = state.maze?.templateId ?? "";
    state.maze = createMaze(previousTemplate);
    state.currentNode = state.maze.root;
    state.travelled = [];
    state.labyrinthNumber += 1;
    state.attemptsThisRound += 1;
    state.locked = false;
    mapDetails.open = true;
    transition.hidden = true;
    transition.classList.remove("is-active");
    renderMap();
    renderRoom({ moveFocus: focusRoom });
  };

  const changeLabyrinth = () => {
    state.locked = true;
    doorsContainer.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
    });
    transition.hidden = false;
    requestAnimationFrame(() => transition.classList.add("is-active"));
    gameStatus.textContent = "El laberinto está cambiando. Recibirás un mapa nuevo.";

    window.setTimeout(() => {
      startNewMaze();
    }, changeDelay);
  };

  function chooseDoor(node, button) {
    if (state.locked) return;

    const expectedNode = state.maze.goalPath[state.travelled.length];
    if (node.id !== expectedNode.id) {
      button.classList.add("is-wrong-path");
      changeLabyrinth();
      return;
    }

    state.locked = true;
    button.classList.add("is-opening");
    room.classList.add("is-moving");
    state.travelled.push(node);

    window.setTimeout(() => {
      if (node.id === state.maze.goal.id) {
        finishMaze();
        return;
      }

      state.currentNode = node;
      renderRoom();
    }, movementDelay);
  }

  playAgain.addEventListener("click", () => {
    state.attemptsThisRound = 0;
    startNewMaze();
  });

  startNewMaze({ focusRoom: false });
}

if (typeof document !== "undefined") {
  initialiseMazeGame();
}
