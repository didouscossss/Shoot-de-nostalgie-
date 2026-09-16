// ---------------------------------------------------------------------------
// GTA VI Boosters — moteur du jeu
//
// - RARITY_CONFIG définit les 6 niveaux de rareté, leur poids de tirage
//   (plus le poids est petit, plus la carte est dure à obtenir) et leur
//   couleur d'affichage.
// - CARDS (cards-data.js) est la liste des cartes possibles.
// - Un booster tire 3 cartes indépendamment les unes des autres, chacune
//   selon la pondération des raretés.
// - La collection (cartes obtenues + nombre d'exemplaires) est sauvegardée
//   dans le navigateur (localStorage), propre à chaque appareil.
// ---------------------------------------------------------------------------

const RARITY_CONFIG = [
  { key: "normale", label: "Normale", weight: 55, color: "#9aa5b1" },
  { key: "rare", label: "Rare", weight: 27, color: "#3b82f6" },
  { key: "ultra", label: "Ultra Rare", weight: 10, color: "#14b8a6" },
  { key: "epique", label: "Épique", weight: 5.5, color: "#a855f7" },
  { key: "legendaire", label: "Légendaire", weight: 2, color: "#f5a623" },
  { key: "secrete", label: "Secrète", weight: 0.5, color: "#ff2e97" },
];

const RARITY_BY_KEY = Object.fromEntries(RARITY_CONFIG.map((r) => [r.key, r]));
const STORAGE_KEY = "gta6-boosters-collection-v1";

function rarityOf(key) {
  return RARITY_BY_KEY[key] || RARITY_CONFIG[0];
}

// --- Tirage pondéré ---------------------------------------------------

function pickWeightedRarity() {
  const total = RARITY_CONFIG.reduce((sum, r) => sum + r.weight, 0);
  let roll = Math.random() * total;
  for (const r of RARITY_CONFIG) {
    if (roll < r.weight) return r;
    roll -= r.weight;
  }
  return RARITY_CONFIG[0];
}

function drawOneCard() {
  // Essaie jusqu'à 10 fois de tomber sur une rareté qui a au moins une carte
  // (au cas où une rareté n'aurait encore aucune carte définie).
  for (let attempt = 0; attempt < 10; attempt++) {
    const rarity = pickWeightedRarity();
    const pool = CARDS.filter((c) => c.rarity === rarity.key);
    if (pool.length > 0) {
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }
  return CARDS[Math.floor(Math.random() * CARDS.length)];
}

function openBooster() {
  return [drawOneCard(), drawOneCard(), drawOneCard()];
}

// --- Collection (localStorage) ----------------------------------------

function loadCollection() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCollection(collection) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
  } catch {
    // stockage indisponible (navigation privée...) : on continue sans persister
  }
}

function addToCollection(card) {
  const collection = loadCollection();
  const wasNew = !collection[card.id];
  collection[card.id] = (collection[card.id] || 0) + 1;
  saveCollection(collection);
  return wasNew;
}

// --- Rendu d'une carte ---------------------------------------------------

function cardVisualHTML(card) {
  if (card.image) {
    return `<img src="${card.image}" alt="${card.name}" loading="lazy" />`;
  }
  const initial = (card.category || card.name || "?").charAt(0).toUpperCase();
  return `<span>${initial}</span>`;
}

function cardFrontHTML(card, isNew) {
  const rarity = rarityOf(card.rarity);
  return `
    <div class="card-front rarity-${card.rarity}" style="--rarity-color:${rarity.color}; --rarity-glow:${rarity.color}66;">
      ${isNew ? `<span class="new-pill">Nouveau</span>` : ""}
      <span class="card-number">#${card.number}</span>
      <div class="card-visual">${cardVisualHTML(card)}</div>
      <span class="card-cat">${card.category || ""}</span>
      <span class="card-title">${card.name}</span>
      <span class="card-rarity-badge" style="--rarity-color:${rarity.color}">${rarity.label}</span>
    </div>
  `;
}

// --- Onglets ---------------------------------------------------------

const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => {
      b.classList.remove("active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-selected", "true");

    const target = btn.dataset.tab;
    tabPanels.forEach((p) => p.classList.remove("active"));
    document.getElementById(`tab-${target}`).classList.add("active");

    if (target === "collection") renderCollection();
  });
});

// --- Booster : ouverture + révélation ---------------------------------

const boosterPack = document.getElementById("boosterPack");
const openBtn = document.getElementById("openBtn");
const cardsReveal = document.getElementById("cardsReveal");
const revealAllBtn = document.getElementById("revealAllBtn");
const againBtn = document.getElementById("againBtn");
const pityHint = document.getElementById("pityHint");

let currentDraw = [];
let currentlyNew = [];

function resetBoosterUI() {
  cardsReveal.hidden = true;
  revealAllBtn.hidden = true;
  againBtn.hidden = true;
  boosterPack.hidden = false;
  openBtn.hidden = false;
  openBtn.disabled = false;
}

function startBoosterOpening() {
  openBtn.disabled = true;
  boosterPack.classList.add("opening");

  setTimeout(() => {
    currentDraw = openBooster();
    currentlyNew = currentDraw.map((card) => addToCollection(card));

    boosterPack.hidden = true;
    openBtn.hidden = true;
    cardsReveal.hidden = false;
    revealAllBtn.hidden = false;

    const slots = cardsReveal.querySelectorAll(".card-slot");
    slots.forEach((slot, i) => {
      const card = currentDraw[i];
      const cardEl = slot.querySelector(".card");
      slot.classList.remove("dealt");
      cardEl.classList.remove("flipped");
      cardEl.querySelector(".card-front").outerHTML = cardFrontHTML(card, currentlyNew[i]);
      void slot.offsetWidth;
      slot.classList.add("dealt");
      slot.style.animationDelay = `${i * 120}ms`;

      cardEl.onclick = () => cardEl.classList.toggle("flipped");
    });
  }, 400);
}

openBtn.addEventListener("click", startBoosterOpening);
boosterPack.addEventListener("click", startBoosterOpening);

revealAllBtn.addEventListener("click", () => {
  cardsReveal.querySelectorAll(".card").forEach((cardEl) => cardEl.classList.add("flipped"));
  revealAllBtn.hidden = true;
  againBtn.hidden = false;
});

againBtn.addEventListener("click", resetBoosterUI);

// --- Collection : rendu -------------------------------------------------

const collectionGrid = document.getElementById("collectionGrid");
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");
const rarityFiltersEl = document.getElementById("rarityFilters");

let activeRarityFilter = null;

function buildRarityFilters() {
  const allBtn = document.createElement("button");
  allBtn.className = "rarity-filter-btn active";
  allBtn.textContent = "Toutes";
  allBtn.dataset.rarity = "";
  rarityFiltersEl.appendChild(allBtn);

  RARITY_CONFIG.forEach((r) => {
    const btn = document.createElement("button");
    btn.className = "rarity-filter-btn";
    btn.textContent = r.label;
    btn.dataset.rarity = r.key;
    btn.style.setProperty("--rarity-color", r.color);
    rarityFiltersEl.appendChild(btn);
  });

  rarityFiltersEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".rarity-filter-btn");
    if (!btn) return;
    rarityFiltersEl.querySelectorAll(".rarity-filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeRarityFilter = btn.dataset.rarity || null;
    renderCollection();
  });
}

function renderCollection() {
  const collection = loadCollection();
  const owned = Object.keys(collection).length;
  const total = CARDS.length;

  progressFill.style.width = total > 0 ? `${(owned / total) * 100}%` : "0%";
  progressText.textContent = `${owned} / ${total} cartes découvertes`;

  const cardsToShow = activeRarityFilter
    ? CARDS.filter((c) => c.rarity === activeRarityFilter)
    : CARDS;

  const sorted = [...cardsToShow].sort((a, b) => {
    const ra = RARITY_CONFIG.findIndex((r) => r.key === a.rarity);
    const rb = RARITY_CONFIG.findIndex((r) => r.key === b.rarity);
    if (ra !== rb) return ra - rb;
    return a.number.localeCompare(b.number, undefined, { numeric: true });
  });

  collectionGrid.innerHTML = sorted
    .map((card) => {
      const count = collection[card.id] || 0;
      const isOwned = count > 0;
      const rarity = rarityOf(card.rarity);
      return `
        <div class="coll-card ${isOwned ? "" : "locked"}" style="--rarity-color:${rarity.color}; --rarity-glow:${rarity.color}55;">
          <div class="coll-card-visual">${isOwned ? cardVisualHTML(card) : "❔"}</div>
          <p class="coll-card-number">#${card.number}</p>
          <p class="coll-card-name">${isOwned ? card.name : "???"}</p>
          <p class="coll-card-count">${isOwned ? `${rarity.label} · x${count}` : rarity.label}</p>
        </div>
      `;
    })
    .join("");
}

// --- Init ---------------------------------------------------------------

buildRarityFilters();
resetBoosterUI();
