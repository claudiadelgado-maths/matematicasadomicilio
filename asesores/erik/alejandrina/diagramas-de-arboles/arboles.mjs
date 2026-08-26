export const CATEGORY_THEMES = [
  ["🐱", "🐶", "🐰"],
  ["🐸", "🐵", "🐻"],
  ["🍎", "🍊", "🍇"],
  ["🍓", "🍌", "🍐"],
  ["🔴", "🔵", "🟡"],
  ["🟢", "🟣", "🟠"],
  ["⚽", "🏀", "🎾"],
  ["🌸", "🌻", "🌷"],
  ["⭐", "🌙", "☀️"],
  ["🚗", "🚲", "🚌"],
];

const randomInteger = (minimum, maximum) =>
  Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;

const randomItem = (items) => items[randomInteger(0, items.length - 1)];

const chooseCategoryCount = (allowOne = false) => {
  const value = Math.random();
  if (allowOne && value < 0.12) return 1;
  return value < 0.86 ? 2 : 3;
};

const distributeCounts = (categoryCount, total) => {
  const counts = Array(categoryCount).fill(1);
  let remaining = total - categoryCount;
  while (remaining > 0) {
    counts[randomInteger(0, categoryCount - 1)] += 1;
    remaining -= 1;
  }
  return counts;
};

const createCategories = (categoryCount, total) => {
  const theme = randomItem(CATEGORY_THEMES);
  const counts = distributeCounts(categoryCount, total);
  return theme.slice(0, categoryCount).map((emoji, index) => ({
    id: `c${index}`,
    emoji,
    count: counts[index],
  }));
};

const remainingTotal = (remaining) =>
  Object.values(remaining).reduce((total, count) => total + count, 0);

export const buildTree = (scenario) => {
  const initialRemaining = Object.fromEntries(
    scenario.categories.map((category) => [category.id, category.count])
  );

  const createNode = ({
    category = null,
    depth = 0,
    id = "root",
    parentId = null,
    path = [],
    remaining = initialRemaining,
  }) => {
    const node = {
      id,
      parentId,
      category,
      depth,
      path,
      remaining: { ...remaining },
      children: [],
    };

    if (depth >= scenario.stages || remainingTotal(remaining) === 0) {
      return node;
    }

    scenario.categories.forEach((nextCategory) => {
      if ((remaining[nextCategory.id] ?? 0) <= 0) return;
      const nextRemaining = { ...remaining };
      if (!scenario.replacement) {
        nextRemaining[nextCategory.id] -= 1;
      }
      const nextPath = [...path, nextCategory.id];
      node.children.push(
        createNode({
          category: nextCategory,
          depth: depth + 1,
          id: `root/${nextPath.join("/")}`,
          parentId: id,
          path: nextPath,
          remaining: nextRemaining,
        })
      );
    });

    return node;
  };

  return createNode({});
};

export const flattenTree = (root) => {
  const rows = [];

  const visit = (node, ancestorHasNext = []) => {
    node.children.forEach((child, index) => {
      const isLast = index === node.children.length - 1;
      const guide = `${ancestorHasNext
        .map((hasNext) => (hasNext ? "│   " : "    "))
        .join("")}${isLast ? "└── " : "├── "}`;
      rows.push({
        node: child,
        parent: node,
        guide,
        isLast,
        depth: child.depth,
      });
      visit(child, [...ancestorHasNext, !isLast]);
    });
  };

  visit(root);
  return rows;
};

export const countTreeNodes = (root) =>
  1 + root.children.reduce((total, child) => total + countTreeNodes(child), 0);

export const scenarioSignature = (scenario) =>
  [
    scenario.categories
      .map((category) => `${category.emoji}:${category.count}`)
      .join(","),
    scenario.replacement ? "con" : "sin",
    scenario.stages,
    scenario.untilEnd ? "fin" : "pasos",
  ].join("|");

const createScenarioOnce = (purpose) => {
  let categoryCount = 2;
  let total = 3;
  let replacement = false;
  let stages = 2;
  let untilEnd = false;

  if (purpose === "read-stages") {
    stages = randomItem([1, 2, 2, 2, 3, 3, 3, 4, 5]);
    if (stages >= 4) {
      categoryCount = 1;
      replacement = true;
      total = randomInteger(1, 3);
    } else {
      categoryCount = chooseCategoryCount(true);
      replacement = Math.random() < 0.5;
      total = randomInteger(
        Math.max(categoryCount, replacement ? categoryCount : stages),
        5
      );
    }
  } else if (purpose === "read-collection") {
    categoryCount = Math.random() < 0.82 ? 2 : 3;
    total = randomInteger(categoryCount, 4);
    replacement = false;
    stages = total;
    untilEnd = true;
  } else {
    categoryCount = chooseCategoryCount(false);
    total = randomInteger(categoryCount, 5);
    replacement = Math.random() < 0.42;
    if (categoryCount === 3) {
      stages = Math.min(2, replacement ? 2 : total);
    } else {
      const preferredStages =
        purpose === "complete"
          ? randomItem([2, 2, 2, 3])
          : randomItem([2, 2, 3]);
      stages = replacement
        ? preferredStages
        : Math.min(preferredStages, total);
    }
  }

  const categories = createCategories(categoryCount, total);
  const scenario = {
    purpose,
    categories,
    replacement,
    stages,
    untilEnd,
  };
  scenario.tree = buildTree(scenario);
  return scenario;
};

export const createScenario = (purpose, previousSignature = "") => {
  let scenario = createScenarioOnce(purpose);
  let attempts = 0;
  while (
    attempts < 30 &&
    (scenarioSignature(scenario) === previousSignature ||
      countTreeNodes(scenario.tree) > 60)
  ) {
    scenario = createScenarioOnce(purpose);
    attempts += 1;
  }
  return scenario;
};

export const describeCollection = (scenario) =>
  scenario.categories.flatMap((category) =>
    Array(category.count).fill(category.emoji)
  );

export const findUnusedEmoji = (scenario) => {
  const used = new Set(
    scenario.categories.map((category) => category.emoji)
  );
  return CATEGORY_THEMES.flat().find((emoji) => !used.has(emoji)) ?? "❔";
};
