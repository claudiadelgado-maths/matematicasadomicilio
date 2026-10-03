const missions = [
  { id: "cat-police", character: "🐱", accessory: "🚨", characterName: "Agente Miau", role: "Policía del barrio", theme: "city", kicker: "Caso de las huellas", title: "La patrulla felina", story: "La agente Miau encontró una bolsa con x huellas y 3 huellas sueltas. En total reunió 8. ¿Cuántas huellas había en la bolsa?", a: 1, b: 3, x: 5 },
  { id: "dog-firefighter", character: "🐶", accessory: "🧯", characterName: "Capitán Bruno", role: "Bombero valiente", theme: "fire", kicker: "Rescate en la estación", title: "Las cajas de emergencia", story: "Bruno rescató 2 grupos con x cajas cada uno y después encontró 4 cajas más. Ahora tiene 10. ¿Cuántas cajas había en cada grupo?", a: 2, b: 4, x: 3 },
  { id: "owl-chef", character: "🦉", accessory: "🍪", characterName: "Chef Oliva", role: "Cocinera nocturna", theme: "kitchen", kicker: "Misión en la cocina", title: "Las charolas de galletas", story: "Oliva puso x galletas en cada una de 3 charolas y agregó 2 galletas de muestra. Contó 14 en total. ¿Cuántas puso en cada charola?", a: 3, b: 2, x: 4 },
  { id: "fox-astronaut", character: "🦊", accessory: "🚀", characterName: "Comandante Fénix", role: "Explorador espacial", theme: "space", kicker: "Alerta en órbita", title: "La bolsa de rocas", story: "Fénix guardó x rocas lunares en una bolsa y dejó 5 afuera. Si encontró 11 en total, ¿cuántas quedaron dentro de la bolsa?", a: 1, b: 5, x: 6 },
  { id: "rabbit-farmer", character: "🐰", accessory: "🥕", characterName: "Granjera Lila", role: "Guardiana del huerto", theme: "farm", kicker: "Cosecha de la mañana", title: "Las cuatro canastas", story: "Lila llenó 4 canastas con x zanahorias cada una y encontró 1 zanahoria extra. Reunió 13. ¿Cuántas puso en cada canasta?", a: 4, b: 1, x: 3 },
  { id: "raccoon-detective", character: "🦝", accessory: "🔎", characterName: "Detective Rayas", role: "Investigador de pistas", theme: "night", kicker: "Expediente secreto", title: "Los sobres misteriosos", story: "Rayas guardó x pistas en cada uno de 2 sobres y anotó 3 pistas en su libreta. Tiene 15 pistas. ¿Cuántas hay en cada sobre?", a: 2, b: 3, x: 6 },
  { id: "bear-builder", character: "🐻", accessory: "🔨", characterName: "Maestro Bruno", role: "Constructor del bosque", theme: "city", kicker: "Obra en construcción", title: "Las torres de bloques", story: "Bruno armó 3 torres con x bloques cada una y usó 1 bloque para la entrada. En total utilizó 16. ¿Cuántos bloques tiene cada torre?", a: 3, b: 1, x: 5 },
  { id: "penguin-scientist", character: "🐧", accessory: "🧪", characterName: "Doctora Pía", role: "Científica polar", theme: "lab", kicker: "Experimento congelado", title: "Los tubos de colores", story: "Pía preparó 2 bandejas con x tubos cada una y dejó 6 tubos de reserva. Tiene 20 tubos. ¿Cuántos colocó en cada bandeja?", a: 2, b: 6, x: 7 },
  { id: "lion-coach", character: "🦁", accessory: "⚽", characterName: "Entrenador Leo", role: "Capitán del equipo", theme: "farm", kicker: "Entrenamiento especial", title: "Los balones del equipo", story: "Leo repartió x balones en cada uno de 4 equipos y conservó 2 balones. Había 34. ¿Cuántos recibió cada equipo?", a: 4, b: 2, x: 8 },
  { id: "frog-musician", character: "🐸", accessory: "🎵", characterName: "Maestro Croac", role: "Director de orquesta", theme: "night", kicker: "Concierto en el estanque", title: "Las notas musicales", story: "Croac escribió x notas en cada una de 3 tarjetas y añadió 3 notas finales. Escribió 12. ¿Cuántas notas hay en cada tarjeta?", a: 3, b: 3, x: 3 },
  { id: "turtle-courier", character: "🐢", accessory: "📦", characterName: "Tina Veloz", role: "Mensajera del valle", theme: "city", kicker: "Entrega importante", title: "Los paquetes del correo", story: "Tina acomodó x paquetes en cada uno de 5 carritos y llevó 2 paquetes en su mochila. Transporta 22. ¿Cuántos van en cada carrito?", a: 5, b: 2, x: 4 },
  { id: "monkey-pilot", character: "🐵", accessory: "✈️", characterName: "Piloto Coco", role: "Aviador aventurero", theme: "space", kicker: "Vuelo sobre la selva", title: "Las maletas del avión", story: "Coco cargó 2 compartimentos con x maletas cada uno y dejó 1 maleta junto a su asiento. Hay 19. ¿Cuántas van en cada compartimento?", a: 2, b: 1, x: 9 },
  { id: "unicorn-artist", character: "🦄", accessory: "🎨", characterName: "Artista Iris", role: "Pintora de arcoíris", theme: "magic", kicker: "Taller de colores", title: "Los pinceles brillantes", story: "Iris guardó x pinceles en su estuche y dejó 7 sobre la mesa. Tiene 9 pinceles. ¿Cuántos están dentro del estuche?", a: 1, b: 7, x: 2 },
  { id: "panda-doctor", character: "🐼", accessory: "🩺", characterName: "Doctora Bambú", role: "Médica del bosque", theme: "lab", kicker: "Clínica de animales", title: "Los botiquines preparados", story: "Bambú puso x vendas en cada uno de 3 botiquines y conservó 5 vendas. Reunió 23. ¿Cuántas hay en cada botiquín?", a: 3, b: 5, x: 6 },
  { id: "dinosaur-librarian", character: "🦖", accessory: "📚", characterName: "Bibliotecario Rex", role: "Guardián de los cuentos", theme: "night", kicker: "Orden en la biblioteca", title: "Los estantes de aventuras", story: "Rex acomodó x libros en cada uno de 4 estantes y dejó 4 libros para leer. Tenía 20. ¿Cuántos colocó en cada estante?", a: 4, b: 4, x: 4 },
  { id: "robot-mechanic", character: "🤖", accessory: "⚙️", characterName: "Robot Tuerca", role: "Mecánico automático", theme: "lab", kicker: "Taller de robots", title: "Las cajas de engranes", story: "Tuerca guardó x engranes en cada una de 5 cajas y utilizó 5 para una reparación. Tenía 30. ¿Cuántos guardó en cada caja?", a: 5, b: 5, x: 5 },
  { id: "bee-explorer", character: "🐝", accessory: "🗺️", characterName: "Exploradora Miel", role: "Cartógrafa del jardín", theme: "farm", kicker: "Ruta entre las flores", title: "Los caminos del mapa", story: "Miel marcó x flores en cada uno de 2 caminos y señaló 2 flores especiales. Marcó 18. ¿Cuántas flores hay en cada camino?", a: 2, b: 2, x: 8 },
  { id: "octopus-sailor", character: "🐙", accessory: "⚓", characterName: "Capitán Ocho", role: "Navegante submarino", theme: "sea", kicker: "Viaje bajo el mar", title: "Los cofres de perlas", story: "Ocho puso x perlas en cada uno de 3 cofres y encontró 4 perlas en la cubierta. Tiene 25. ¿Cuántas guardó en cada cofre?", a: 3, b: 4, x: 7 },
  { id: "chick-ranger", character: "🐥", accessory: "🌲", characterName: "Guardabosques Pío", role: "Protector del parque", theme: "farm", kicker: "Recorrido por el parque", title: "Los grupos de semillas", story: "Pío repartió x semillas en cada una de 4 zonas y conservó 3 para el vivero. Tenía 27. ¿Cuántas dejó en cada zona?", a: 4, b: 3, x: 6 },
  { id: "koala-magician", character: "🐨", accessory: "✨", characterName: "Mago Kiko", role: "Ilusionista del teatro", theme: "magic", kicker: "Función de esta noche", title: "Los sombreros mágicos", story: "Kiko colocó x estrellas en cada uno de 2 sombreros y guardó 5 estrellas en su capa. Tiene 15. ¿Cuántas puso en cada sombrero?", a: 2, b: 5, x: 5 }
];

const stage = document.querySelector("[data-stage]");
const character = document.querySelector("[data-character]");
const accessory = document.querySelector("[data-accessory]");
const characterName = document.querySelector("[data-character-name]");
const characterRole = document.querySelector("[data-role]");
const characterMessage = document.querySelector("[data-character-message]");
const kicker = document.querySelector("[data-kicker]");
const title = document.querySelector("[data-title]");
const story = document.querySelector("[data-story]");
const equation = document.querySelector("[data-equation]");
const options = document.querySelector("[data-options]");
const counter = document.querySelector("[data-counter]");
const score = document.querySelector("[data-score]");
const feedback = document.querySelector("[data-feedback]");
const nextButton = document.querySelector("[data-next]");
const restartButton = document.querySelector("[data-restart]");

const solved = new Set();
let missionOrder = [];
let position = 0;
let currentMission = null;

const shuffle = (items) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
};

const buildOrder = (avoidFirstId = "") => {
  let nextOrder = shuffle(missions);
  if (nextOrder.length > 1 && nextOrder[0].id === avoidFirstId) [nextOrder[0], nextOrder[1]] = [nextOrder[1], nextOrder[0]];
  return nextOrder;
};

const equationText = (mission) => {
  const coefficient = mission.a === 1 ? "x" : `${mission.a}x`;
  const independent = mission.b === 0 ? "" : mission.b > 0 ? ` + ${mission.b}` : ` - ${Math.abs(mission.b)}`;
  return `${coefficient}${independent} = ${mission.a * mission.x + mission.b}`;
};

const renderEquation = (mission) => {
  const text = equationText(mission);
  equation.setAttribute("aria-label", text);
  if (globalThis.katex) globalThis.katex.render(text.replaceAll(" ", ""), equation, { displayMode: true, throwOnError: false, strict: "ignore" });
  else equation.textContent = text;
};

const buildChoices = (answer) => {
  const offsets = shuffle([-3, -2, -1, 1, 2, 3]);
  const distractors = [];
  for (const offset of offsets) {
    const candidate = answer + offset;
    if (candidate > 0 && candidate !== answer && !distractors.includes(candidate)) distractors.push(candidate);
    if (distractors.length === 3) break;
  }
  return shuffle([answer, ...distractors]);
};

const updateScore = () => {
  score.textContent = `${solved.size} ${solved.size === 1 ? "estrella" : "estrellas"}`;
};

const explainAnswer = (mission) => {
  const rightSide = mission.a * mission.x + mission.b;
  const difference = rightSide - mission.b;
  if (mission.a === 1) return `Quitamos ${mission.b}: ${rightSide} − ${mission.b} = ${mission.x}. Por eso x = ${mission.x}.`;
  return `Quitamos ${mission.b}: ${rightSide} − ${mission.b} = ${difference}. Luego dividimos: ${difference} ÷ ${mission.a} = ${mission.x}.`;
};

const chooseAnswer = (button, value) => {
  if (value !== currentMission.x) {
    button.classList.add("is-wrong");
    button.disabled = true;
    button.setAttribute("aria-label", `x igual a ${value}, opción incorrecta`);
    feedback.className = "mission-feedback is-wrong";
    feedback.textContent = "Todavía no. Mira la ecuación y prueba otra opción; puedes quitar primero lo que se suma y después repartir en grupos iguales.";
    characterMessage.textContent = "¡Casi! Intenta otra vez.";
    stage.classList.remove("is-correct");
    return;
  }

  solved.add(currentMission.id);
  options.querySelectorAll("button").forEach((option) => {
    option.disabled = true;
    if (Number(option.dataset.value) === currentMission.x) option.classList.add("is-correct");
  });
  updateScore();
  feedback.className = "mission-feedback is-correct";
  feedback.textContent = solved.size === missions.length
    ? `¡Brigada completa! Resolviste las 20 misiones. ${explainAnswer(currentMission)}`
    : `¡Correcto! ${explainAnswer(currentMission)}`;
  characterMessage.textContent = "¡Misión cumplida! ⭐";
  stage.classList.add("is-correct");
  nextButton.textContent = solved.size === missions.length ? "Seguir jugando →" : "Siguiente misión →";
};

const renderChoices = (mission) => {
  options.replaceChildren();
  buildChoices(mission.x).forEach((value) => {
    const button = document.createElement("button");
    button.className = "answer-option";
    button.type = "button";
    button.dataset.value = String(value);
    button.setAttribute("aria-label", `x igual a ${value}`);
    button.textContent = `x = ${value}`;
    button.addEventListener("click", () => chooseAnswer(button, value));
    options.append(button);
  });
};

const renderMission = () => {
  currentMission = missionOrder[position];
  stage.classList.remove("is-correct");
  stage.dataset.theme = currentMission.theme;
  character.textContent = currentMission.character;
  accessory.textContent = currentMission.accessory;
  characterName.textContent = currentMission.characterName;
  characterRole.textContent = currentMission.role;
  characterMessage.textContent = "¡Necesito tu ayuda!";
  kicker.textContent = currentMission.kicker;
  title.textContent = currentMission.title;
  story.textContent = currentMission.story;
  counter.textContent = `Misión ${position + 1} de ${missions.length}`;
  feedback.textContent = "";
  feedback.className = "mission-feedback";
  nextButton.textContent = "Otra misión →";
  renderEquation(currentMission);
  renderChoices(currentMission);
  updateScore();
};

const nextMission = () => {
  position += 1;
  if (position >= missionOrder.length) {
    const previousId = currentMission.id;
    missionOrder = buildOrder(previousId);
    position = 0;
  }
  renderMission();
};

const restartGame = () => {
  solved.clear();
  position = 0;
  missionOrder = buildOrder(currentMission?.id);
  renderMission();
};

nextButton.addEventListener("click", nextMission);
restartButton.addEventListener("click", restartGame);

missionOrder = buildOrder();
renderMission();
