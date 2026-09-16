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

// Raretés qui reçoivent l'effet holographique 3D (Ultra Rare et au-dessus).
const HOLO_RARITIES = new Set(["ultra", "epique", "legendaire", "secrete"]);

// --- Effet holographique 3D (tilt + reflet qui suit la souris) ---------

function attachHoloTilt(el, maxTilt) {
  if (!el || el.dataset.holoBound) return;
  el.dataset.holoBound = "1";
  el.classList.add("holo");

  const setFromPoint = (clientX, clientY) => {
    const rect = el.getBoundingClientRect();
    const px = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
    const py = Math.min(Math.max((clientY - rect.top) / rect.height, 0), 1);
    el.style.setProperty("--holo-x", `${px * 100}%`);
    el.style.setProperty("--holo-y", `${py * 100}%`);
    el.style.setProperty("--tilt-x", `${(0.5 - py) * 2 * maxTilt}deg`);
    el.style.setProperty("--tilt-y", `${(px - 0.5) * 2 * maxTilt}deg`);
    el.classList.add("holo-active");
  };

  const reset = () => {
    el.classList.remove("holo-active");
    el.style.setProperty("--tilt-x", "0deg");
    el.style.setProperty("--tilt-y", "0deg");
  };

  el.addEventListener("mousemove", (e) => setFromPoint(e.clientX, e.clientY));
  el.addEventListener("mouseleave", reset);
  el.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches[0]) setFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );
  el.addEventListener("touchend", reset);
}

// Effets de révélation : l'intensité (nombre de particules, vitesse de la
// montée en tension avant le flip, rayons, flash d'écran, tremblement)
// grimpe avec la rareté pour un effet "wahou" de plus en plus fort.
const RARITY_FX = {
  normale: { particles: 0, rays: false, flash: false, shake: false, pulseSpeed: 0, colors: ["#c7ccd1"] },
  rare: { particles: 8, rays: false, flash: false, shake: false, pulseSpeed: 1.5, pulseSize: "16px", colors: ["#3b82f6", "#93c5fd"] },
  ultra: { particles: 14, rays: false, flash: false, shake: false, pulseSpeed: 1.1, pulseSize: "20px", colors: ["#14b8a6", "#5eead4"] },
  epique: { particles: 20, rays: true, flash: false, shake: false, pulseSpeed: 0.85, pulseSize: "26px", colors: ["#a855f7", "#d8b4fe", "#f0abfc"] },
  legendaire: { particles: 30, rays: true, flash: true, shake: true, pulseSpeed: 0.6, pulseSize: "32px", colors: ["#f5a623", "#ffd76a", "#fff3c4"] },
  secrete: { particles: 44, rays: true, flash: true, shake: true, pulseSpeed: 0.4, pulseSize: "40px", colors: ["#ff2e97", "#00e5ff", "#a855f7", "#f5a623", "#7bed9f"] },
};

function fxOf(key) {
  return RARITY_FX[key] || RARITY_FX.normale;
}

function spawnParticles(container, count, colors) {
  for (let i = 0; i < count; i++) {
    const p = document.createElement("span");
    p.className = "fx-particle";
    const angle = Math.random() * Math.PI * 2;
    const dist = 55 + Math.random() * 100;
    p.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    p.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    p.style.setProperty("--p-color", colors[i % colors.length]);
    p.style.setProperty("--p-size", `${5 + Math.random() * 6}px`);
    p.style.animationDelay = `${Math.random() * 0.2}s`;
    container.appendChild(p);
    setTimeout(() => p.remove(), 1400);
  }
}

function triggerRarityFX(slotEl, rarityKey) {
  const fx = fxOf(rarityKey);

  if (fx.rays) {
    const ray = document.createElement("div");
    ray.className = "fx-rays";
    ray.style.setProperty("--ray-color", fx.colors[0]);
    slotEl.appendChild(ray);
    setTimeout(() => ray.remove(), 1300);
  }

  if (fx.particles > 0) {
    spawnParticles(slotEl, fx.particles, fx.colors);
  }

  if (fx.flash) {
    const flash = document.getElementById("screenFlash");
    flash.style.setProperty("--flash-color", fx.colors[0]);
    flash.classList.remove("active");
    void flash.offsetWidth;
    flash.classList.add("active");
  }

  if (fx.shake) {
    document.body.classList.remove("shake");
    void document.body.offsetWidth;
    document.body.classList.add("shake");
  }
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
  if (card.image) {
    // Le visuel contient déjà le numéro, le nom et la rareté : on l'affiche
    // en plein cadre, sans le redoubler avec du texte par-dessus.
    return `
      <div class="card-front has-image rarity-${card.rarity}" style="--rarity-color:${rarity.color}; --rarity-glow:${rarity.color}66;">
        ${isNew ? `<span class="new-pill">Nouveau</span>` : ""}
        <img class="card-full-image" src="${card.image}" alt="${card.name}" loading="lazy" />
      </div>
    `;
  }
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
      const rarity = rarityOf(card.rarity);
      const fx = fxOf(card.rarity);
      const cardEl = slot.querySelector(".card");

      slot.classList.remove("dealt");
      cardEl.classList.remove("flipped", "charging");
      cardEl.dataset.fxDone = "";
      cardEl.querySelector(".card-front").outerHTML = cardFrontHTML(card, currentlyNew[i]);
      void slot.offsetWidth;
      slot.classList.add("dealt");
      slot.style.animationDelay = `${i * 120}ms`;

      // La couleur/lueur de rareté est posée sur .card (donc héritée par
      // .card-back) pour pouvoir faire "chauffer" le dos de la carte avant
      // même qu'elle soit retournée.
      cardEl.style.setProperty("--rarity-color", rarity.color);
      cardEl.style.setProperty("--rarity-glow", `${rarity.color}aa`);
      if (fx.pulseSpeed > 0) {
        cardEl.style.setProperty("--pulse-speed", `${fx.pulseSpeed}s`);
        cardEl.style.setProperty("--pulse-size", fx.pulseSize);
        setTimeout(() => cardEl.classList.add("charging"), 500 + i * 120);
      }

      if (HOLO_RARITIES.has(card.rarity)) {
        attachHoloTilt(cardEl.querySelector(".card-front"), 14);
      }

      cardEl.onclick = () => {
        if (cardEl.classList.contains("flipped")) {
          openLightbox(card);
        } else {
          revealCard(slot, cardEl, card);
        }
      };
    });
  }, 400);
}

function revealCard(slot, cardEl, card) {
  cardEl.classList.add("flipped");
  cardEl.classList.remove("charging");
  if (cardEl.dataset.fxDone) return;
  cardEl.dataset.fxDone = "1";
  setTimeout(() => triggerRarityFX(slot, card.rarity), 300);
}

// --- Vue plein écran (lightbox) -----------------------------------------

const lightbox = document.getElementById("lightbox");
const lightboxCardEl = document.getElementById("lightboxCard");
const lightboxBackdrop = document.getElementById("lightboxBackdrop");
const lightboxClose = document.getElementById("lightboxClose");

function openLightbox(card) {
  const rarity = rarityOf(card.rarity);
  lightboxCardEl.innerHTML = `
    <div class="lightbox-card rarity-${card.rarity}" style="--rarity-color:${rarity.color}; --rarity-glow:${rarity.color}88;">
      ${card.image ? `<img src="${card.image}" alt="${card.name}" />` : ""}
    </div>
    <div class="lightbox-caption">
      <p class="lb-name">#${card.number} — ${card.name}</p>
      <p class="lb-meta">${card.category || ""} · ${rarity.label}</p>
    </div>
  `;
  if (HOLO_RARITIES.has(card.rarity)) {
    attachHoloTilt(lightboxCardEl.querySelector(".lightbox-card"), 16);
  }
  lightbox.hidden = false;
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxCardEl.innerHTML = "";
}

lightboxBackdrop.addEventListener("click", closeLightbox);
lightboxClose.addEventListener("click", closeLightbox);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
});

openBtn.addEventListener("click", startBoosterOpening);
boosterPack.addEventListener("click", startBoosterOpening);

revealAllBtn.addEventListener("click", () => {
  cardsReveal.querySelectorAll(".card-slot").forEach((slot, i) => {
    const cardEl = slot.querySelector(".card");
    revealCard(slot, cardEl, currentDraw[i]);
  });
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
        <div class="coll-card ${isOwned ? "" : "locked"}" data-id="${card.id}" style="--rarity-color:${rarity.color}; --rarity-glow:${rarity.color}55;">
          <div class="coll-card-visual">${isOwned ? cardVisualHTML(card) : "❔"}</div>
          <p class="coll-card-number">#${card.number}</p>
          <p class="coll-card-name">${isOwned ? card.name : "???"}</p>
          <p class="coll-card-count">${isOwned ? `${rarity.label} · x${count}` : rarity.label}</p>
        </div>
      `;
    })
    .join("");

  sorted.forEach((card) => {
    if (!HOLO_RARITIES.has(card.rarity) || !(collection[card.id] > 0)) return;
    const visualEl = collectionGrid.querySelector(`.coll-card[data-id="${card.id}"] .coll-card-visual`);
    if (visualEl) attachHoloTilt(visualEl, 12);
  });
}

collectionGrid.addEventListener("click", (e) => {
  const el = e.target.closest(".coll-card:not(.locked)");
  if (!el) return;
  const card = CARDS.find((c) => c.id === el.dataset.id);
  if (card) openLightbox(card);
});

// --- Init ---------------------------------------------------------------

buildRarityFilters();
resetBoosterUI();
