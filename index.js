let cards = [];

const grid = document.getElementById("cardGrid");
const searchInput = document.getElementById("search");
const typeFilter = document.getElementById("typeFilter");
const minAttackInput = document.getElementById("minAttack");
const maxAttackInput = document.getElementById("maxAttack");
const minDefenseInput = document.getElementById("minDefense");
const maxDefenseInput = document.getElementById("maxDefense");
const minCostInput = document.getElementById("minCost");
const maxCostInput = document.getElementById("maxCost");
const themeToggle = document.getElementById("themeToggle");
const toggleAdvanced = document.getElementById("toggleAdvanced");
const advancedFilters = document.getElementById("advancedFilters");
const aboutBtn = document.getElementById("aboutBtn");
const howToPlayBtn = document.getElementById("howToPlayBtn");
const randomCardBtn = document.getElementById("randomCardBtn");

const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");

const infoModal = document.getElementById("infoModal");
const infoTitle = document.getElementById("infoTitle");
const infoContent = document.getElementById("infoContent");
const infoCloseBtn = document.getElementById("infoCloseBtn");

modal.classList.add("hidden");
infoModal.classList.add("hidden");

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  document.querySelector("header").classList.add("light");
  document.querySelector("footer").classList.add("light");
  themeToggle.textContent = "☀️";
} else {
  themeToggle.textContent = "🌙";
}

fetch("nano-data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = data.map((card) => ({ ...card, image: `nano-data/${card.image}` }));
    renderCards(cards);
  });

function renderCards(data) {
  grid.innerHTML = "";
  data.forEach((card) => {
    const div = document.createElement("div");
    div.className = "card";

    const img = document.createElement("img");
    img.src = card.image;
    img.onerror = () => {
      img.src = "nano-data/media/nano-couchnap.png";
    };

    const body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML = `
      <div>
        <div class="card-title">${card.name}</div>
        <div class="stats">ATK ${card.attack} / DEF ${card.defense}</div>
      </div>
      <div class="stats">Cost: ${card.treatCost.join(", ")}</div>
    `;

    div.appendChild(img);
    div.appendChild(body);
    div.addEventListener("click", () => openModal(card));

    grid.appendChild(div);
  });
}

function openModal(card) {
  document.getElementById("modalImg").src = card.image;
  document.getElementById("modalName").textContent = card.name;
  document.getElementById("modalType").textContent =
    `${card.type} — ${card.role}`;
  document.getElementById("modalStats").textContent =
    `Cost: ${card.treatCost.join(", ")} | ATK ${card.attack} / DEF ${card.defense}`;
  document.getElementById("modalRules").textContent = card.rulesText;
  document.getElementById("modalFlavor").textContent = card.flavorText;
  document.getElementById("modalDetails").textContent = card.details;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}
closeBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light");
  document.querySelector("header").classList.toggle("light");
  document.querySelector("footer").classList.toggle("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  themeToggle.textContent = isLight ? "☀️" : "🌙";
});

toggleAdvanced.addEventListener("click", () => {
  advancedFilters.classList.toggle("hidden");
});

aboutBtn.addEventListener("click", () => {
  infoTitle.textContent = "About Nano: the Gathering";
  infoContent.innerHTML = `
    <p>Nano: the Gathering is an epic card game where players collect and battle with cards inspired by the adventures of Nano, the white Sealyham Terrier.</p>
    <p>Each card features unique abilities, stats, and thematic flavor text that immerses players in Nano's magical universe.</p>
    <p>The game was designed to blend strategic deck-building with dynamic board interactions, emphasizing creativity and tactical decision-making.</p>
    <p>Players can explore countless combinations of characters, treats, and spells to outwit their opponents and claim victory.</p>
    <p>From casual duels to competitive tournaments, Nano: the Gathering provides an engaging experience for both new and veteran players alike.</p>
  `;
  infoModal.classList.remove("hidden");
});

howToPlayBtn.addEventListener("click", () => {
  infoTitle.textContent = "How to Play";
  infoContent.innerHTML = `
    <p>Players start with a deck of Nano cards, each with attack, defense, and treat costs.</p>
    <p>On a turn, a player may summon Nano cards by paying their treat cost, attack opposing Nanos, and activate special abilities.</p>
    <p>The goal is to reduce the opponent’s life points while managing your own board state effectively.</p>
    <p>Cards can interact in numerous ways; some provide card advantage, others disrupt opponent strategies, and some synergize with certain roles.</p>
    <p>Winning requires careful planning, understanding card interactions, and anticipating your opponent's moves. Strategic deck-building before the match is essential.</p>
  `;
  infoModal.classList.remove("hidden");
});

infoCloseBtn.addEventListener("click", () => {
  infoModal.classList.add("hidden");
});
infoModal.addEventListener("click", (e) => {
  if (e.target === infoModal) infoModal.classList.add("hidden");
});

randomCardBtn.addEventListener("click", () => {
  if (cards.length === 0) return;
  const randomCard = cards[Math.floor(Math.random() * cards.length)];
  openModal(randomCard);
});

[
  searchInput,
  typeFilter,
  minAttackInput,
  maxAttackInput,
  minDefenseInput,
  maxDefenseInput,
  minCostInput,
  maxCostInput,
].forEach((el) => el.addEventListener("input", applyFilters));

function applyFilters() {
  const search = searchInput.value.toLowerCase();
  const type = typeFilter.value;
  const minAtk = parseInt(minAttackInput.value) || -Infinity;
  const maxAtk = parseInt(maxAttackInput.value) || Infinity;
  const minDef = parseInt(minDefenseInput.value) || -Infinity;
  const maxDef = parseInt(maxDefenseInput.value) || Infinity;
  const minCost = minCostInput.value
    ? minCostInput.value.split(",").map((n) => parseInt(n.trim()))
    : null;
  const maxCost = maxCostInput.value
    ? maxCostInput.value.split(",").map((n) => parseInt(n.trim()))
    : null;

  const filtered = cards.filter((card) => {
    const matchesSearch =
      card.name.toLowerCase().includes(search) ||
      card.rulesText.toLowerCase().includes(search);
    const matchesType = type ? card.type === type : true;
    const matchesAttack = card.attack >= minAtk && card.attack <= maxAtk;
    const matchesDefense = card.defense >= minDef && card.defense <= maxDef;
    let matchesCost = true;
    if (minCost)
      matchesCost = card.treatCost.some(
        (v, i) => v >= minCost[i] || isNaN(minCost[i]),
      );
    if (maxCost)
      matchesCost =
        matchesCost &&
        card.treatCost.every((v, i) => v <= maxCost[i] || isNaN(maxCost[i]));
    return (
      matchesSearch &&
      matchesType &&
      matchesAttack &&
      matchesDefense &&
      matchesCost
    );
  });

  renderCards(filtered);
}
