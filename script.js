// Données des décennies : chaque décennie a un thème visuel et une liste d'objets cultes.
const DECADES = [
  {
    start: 1950,
    end: 1959,
    name: "Les années 50",
    tagline: "Juke-box, rock'n'roll et premières télés en noir et blanc.",
    theme: "theme-50s",
    items: [
      { icon: "📻", name: "Poste radio à lampes", desc: "Le cœur du salon familial." },
      { icon: "🎷", name: "Juke-box", desc: "Le roi des bars et des bals." },
      { icon: "🚲", name: "Vélosolex", desc: "Le vélo à moteur culte des routes de campagne." },
      { icon: "📺", name: "Télé noir et blanc", desc: "Un luxe réservé à quelques foyers." },
      { icon: "🕺", name: "Rock'n'roll", desc: "La danse qui affole les pistes." },
      { icon: "🥤", name: "Milk-shake au comptoir", desc: "L'ambiance diner américain." },
    ],
  },
  {
    start: 1960,
    end: 1969,
    name: "Les années 60",
    tagline: "Vinyles 45 tours, yéyé et premiers pas sur la Lune.",
    theme: "theme-60s",
    items: [
      { icon: "💿", name: "45 tours vinyle", desc: "Le format qui a lancé les tubes yéyé." },
      { icon: "🎸", name: "Transistor", desc: "La radio de poche pour écouter les hits partout." },
      { icon: "🚀", name: "Conquête spatiale", desc: "Apollo, Spoutnik, le monde a la tête dans les étoiles." },
      { icon: "🕶️", name: "Lunettes psychédéliques", desc: "Couleurs flashy et esprit peace and love." },
      { icon: "🚗", name: "Coccinelle Volkswagen", desc: "La voiture hippie par excellence." },
      { icon: "📼", name: "Mini-jupe", desc: "La révolution mode de la décennie." },
    ],
  },
  {
    start: 1970,
    end: 1979,
    name: "Les années 70",
    tagline: "Baby-foot, disco et premières consoles de jeu.",
    theme: "theme-70s",
    items: [
      { icon: "🕹️", name: "Pong / Atari", desc: "Les premiers pixels sur un écran de télé." },
      { icon: "🪩", name: "Boule disco", desc: "L'ambiance dancefloor incontournable." },
      { icon: "🎲", name: "Rubik's Cube", desc: "Le casse-tête qui rendra fou le monde entier." },
      { icon: "⚽", name: "Baby-foot", desc: "Le meuble star des cafés et des caves." },
      { icon: "📻", name: "Cassette audio", desc: "Enregistrer ses tubes préférés à la radio." },
      { icon: "🚲", name: "BMX", desc: "Le vélo cascade des cours de récré." },
    ],
  },
  {
    start: 1980,
    end: 1989,
    name: "Les années 80",
    tagline: "Walkman, Minitel et néons synthwave.",
    theme: "theme-80s",
    items: [
      { icon: "🎧", name: "Walkman", desc: "La musique partout, enfin portable." },
      { icon: "📼", name: "Cassette VHS", desc: "Le club vidéo du samedi soir." },
      { icon: "💻", name: "Minitel", desc: "L'ancêtre français d'Internet." },
      { icon: "🎮", name: "Game & Watch", desc: "La première console de poche Nintendo." },
      { icon: "🧊", name: "Rubik's Cube", desc: "Toujours aussi addictif." },
      { icon: "🖍️", name: "Cartes Panini", desc: "La collection qui vide les tirelires." },
    ],
  },
  {
    start: 1990,
    end: 1999,
    name: "Les années 90",
    tagline: "Pogs, cartes Pokémon et Tamagotchi.",
    theme: "theme-90s",
    items: [
      { icon: "🀄", name: "Pogs / Tazos", desc: "On joue des tours entiers de récré pour les gagner." },
      { icon: "⚡", name: "Cartes Pokémon", desc: "Attrapez-les tous, échangez-les tous." },
      { icon: "🐣", name: "Tamagotchi", desc: "L'animal virtuel qu'il fallait nourrir H24." },
      { icon: "🎮", name: "Game Boy", desc: "Tetris et Mario dans la poche." },
      { icon: "💽", name: "Discman", desc: "La musique CD à emporter partout." },
      { icon: "📟", name: "Nokia 3310", desc: "Le téléphone indestructible et Snake." },
    ],
  },
  {
    start: 2000,
    end: 2009,
    name: "Les années 2000",
    tagline: "MSN, iPod et Yu-Gi-Oh.",
    theme: "theme-2000s",
    items: [
      { icon: "💬", name: "MSN Messenger", desc: "\"Ding\" un pote se connecte, vite un pseudo qui claque." },
      { icon: "🎵", name: "iPod", desc: "1000 chansons dans la poche." },
      { icon: "🃏", name: "Cartes Yu-Gi-Oh", desc: "Des duels épiques dans la cour d'école." },
      { icon: "🐧", name: "Club Penguin", desc: "Le jeu en ligne où toute une génération s'est retrouvée." },
      { icon: "📱", name: "Nokia à clapet", desc: "Le sms en T9, un art à part entière." },
      { icon: "🎡", name: "Beyblade", desc: "Les toupies qui s'affrontent dans l'arène." },
    ],
  },
  {
    start: 2010,
    end: 2019,
    name: "Les années 2010",
    tagline: "Fidget spinners, Vine et Pokémon GO.",
    theme: "theme-2010s",
    items: [
      { icon: "📱", name: "iPhone", desc: "Le smartphone qui change tout." },
      { icon: "🌀", name: "Fidget spinner", desc: "L'objet anti-stress que tout le monde fait tourner." },
      { icon: "🎥", name: "Vine", desc: "6 secondes pour devenir culte." },
      { icon: "🐉", name: "Pokémon GO", desc: "Toute la ville dehors à chasser des Pokémon." },
      { icon: "🧶", name: "Loom bands", desc: "Les bracelets élastiques faits main." },
      { icon: "🧱", name: "Minecraft", desc: "Construire des mondes entiers en cubes." },
    ],
  },
  {
    start: 2020,
    end: 2026,
    name: "Les années 2020",
    tagline: "TikTok, Wordle et visios improvisées.",
    theme: "theme-2020s",
    items: [
      { icon: "🎬", name: "TikTok", desc: "Le format court qui a pris le monde d'assaut." },
      { icon: "🟩", name: "Wordle", desc: "Le mot du jour partagé par tous en grille verte et jaune." },
      { icon: "💻", name: "Visioconférences", desc: "Réunions, cours et apéros derrière un écran." },
      { icon: "🕵️", name: "Among Us", desc: "Qui est l'imposteur ? Tout le monde y a joué." },
      { icon: "🎮", name: "Cloud gaming", desc: "Jouer à des jeux exigeants sans console dédiée." },
      { icon: "🤖", name: "IA générative", desc: "Discuter et créer avec une intelligence artificielle." },
    ],
  },
];

function getDecadeForYear(year) {
  return (
    DECADES.find((d) => year >= d.start && year <= d.end) ||
    DECADES[DECADES.length - 1]
  );
}

const yearSlider = document.getElementById("yearSlider");
const yearValue = document.getElementById("yearValue");
const yearMinus = document.getElementById("yearMinus");
const yearPlus = document.getElementById("yearPlus");
const goBtn = document.getElementById("goBtn");
const result = document.getElementById("result");
const decadeTitle = document.getElementById("decadeTitle");
const decadeTagline = document.getElementById("decadeTagline");
const itemsGrid = document.getElementById("itemsGrid");

function updateYearDisplay() {
  yearValue.textContent = yearSlider.value;
}

yearSlider.addEventListener("input", updateYearDisplay);

yearMinus.addEventListener("click", () => {
  yearSlider.value = Math.max(Number(yearSlider.min), Number(yearSlider.value) - 1);
  updateYearDisplay();
});

yearPlus.addEventListener("click", () => {
  yearSlider.value = Math.min(Number(yearSlider.max), Number(yearSlider.value) + 1);
  updateYearDisplay();
});

function renderDecade(year) {
  const decade = getDecadeForYear(year);

  document.body.className = decade.theme;

  decadeTitle.textContent = `${decade.name} (${year})`;
  decadeTagline.textContent = decade.tagline;

  itemsGrid.innerHTML = "";
  decade.items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.style.animationDelay = `${index * 90}ms`;
    card.innerHTML = `
      <div class="item-icon">${item.icon}</div>
      <h3 class="item-name">${item.name}</h3>
      <p class="item-desc">${item.desc}</p>
    `;
    itemsGrid.appendChild(card);
  });

  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

goBtn.addEventListener("click", () => {
  renderDecade(Number(yearSlider.value));
});

updateYearDisplay();
