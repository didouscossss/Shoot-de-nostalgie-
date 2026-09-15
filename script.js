// ---------------------------------------------------------------------------
// Shoot de Nostalgie — moteur de données
//
// Principe : chaque décennie a un "pool" d'objets/tendances cultes, chacun
// avec une année d'apparition réelle (introYear). Pour une année donnée :
//   1) les objets dont introYear === année sont mis en avant ("Nouveauté")
//   2) le reste de la sélection tourne parmi les objets déjà sortis
//      (de la décennie en cours + fin de la décennie précédente)
// Résultat : deux années, même proches, n'affichent jamais exactement la
// même combinaison, et chaque objet apparaît à partir de sa vraie date.
// ---------------------------------------------------------------------------

const TARGET_ITEMS = 9;

const DECADES = [
  {
    start: 1950,
    end: 1959,
    name: "Les années 50",
    tagline: "Juke-box, rock'n'roll et premières télés en noir et blanc.",
    theme: "theme-50s",
    pool: [
      { icon: "📻", name: "Poste radio à lampes", desc: "Le cœur du salon, pour écouter feuilletons et musique.", introYear: 1950 },
      { icon: "🎷", name: "Juke-box", desc: "La star des bars et des bals populaires.", introYear: 1950 },
      { icon: "🚲", name: "Vélosolex", desc: "Le vélo à moteur qui envahit les routes de campagne.", introYear: 1950 },
      { icon: "🚗", name: "Coccinelle Volkswagen", desc: "La petite voiture ronde qui conquiert l'Europe.", introYear: 1950 },
      { icon: "📺", name: "Télévision noir et blanc", desc: "Un luxe rare, réservé à quelques foyers.", introYear: 1950 },
      { icon: "🚂", name: "Trains électriques Jouef", desc: "Le grand jouet sous le sapin.", introYear: 1951 },
      { icon: "🧊", name: "Frigidaire à une porte", desc: "L'électroménager qui change la vie des foyers.", introYear: 1952 },
      { icon: "💿", name: "Disques 45 tours", desc: "Le format qui lance le rock'n'roll.", introYear: 1954 },
      { icon: "🪆", name: "Poupées en porcelaine", desc: "Le jouet précieux que l'on garde en vitrine.", introYear: 1955 },
      { icon: "🕺", name: "Rock'n'roll à la radio", desc: "Une nouvelle musique qui affole les jeunes.", introYear: 1956 },
    ],
  },
  {
    start: 1960,
    end: 1969,
    name: "Les années 60",
    tagline: "Vinyles yéyé, Coccinelle et conquête spatiale.",
    theme: "theme-60s",
    pool: [
      { icon: "📻", name: "Transistor radio", desc: "La radio de poche pour écouter les hits partout.", introYear: 1960 },
      { icon: "☎️", name: "Cabine téléphonique à jetons", desc: "Il faut faire la queue pour passer un coup de fil.", introYear: 1960 },
      { icon: "🛵", name: "Mobylette", desc: "Le deux-roues qui donne des ailes à la jeunesse.", introYear: 1960 },
      { icon: "🧵", name: "Bracelets scoubidou", desc: "On en tresse à la récré et en colo.", introYear: 1960 },
      { icon: "👸", name: "Poupée Barbie", desc: "La poupée mannequin qui débarque des États-Unis.", introYear: 1961 },
      { icon: "🔧", name: "Meccano", desc: "Le jeu de construction en métal des apprentis ingénieurs.", introYear: 1962 },
      { icon: "🕺", name: "Disques yéyé", desc: "Sheila, Johnny et Sylvie font danser toute la France.", introYear: 1963 },
      { icon: "👗", name: "Mini-jupe", desc: "La révolution mode qui choque et qui plaît.", introYear: 1965 },
      { icon: "📺", name: "Télévision couleur", desc: "Les images passent enfin de la grisaille à la couleur.", introYear: 1967 },
      { icon: "🚀", name: "Alunissage d'Apollo 11", desc: "L'humanité marche sur la Lune en direct à la télé.", introYear: 1969 },
      { icon: "✈️", name: "Concorde, le rêve supersonique", desc: "L'avion qui va traverser l'Atlantique plus vite que le son.", introYear: 1969 },
    ],
  },
  {
    start: 1970,
    end: 1979,
    name: "Les années 70",
    tagline: "Baby-foot, disco et premiers jeux vidéo.",
    theme: "theme-70s",
    pool: [
      { icon: "⚽", name: "Baby-foot", desc: "Le meuble star des cafés, des caves et des colonies.", introYear: 1970 },
      { icon: "🦘", name: "Ballon sauteur (Space Hopper)", desc: "Le jouet qui fait rebondir toute la cour de récré.", introYear: 1970 },
      { icon: "🧮", name: "Calculatrice de poche", desc: "La fin du calcul mental à l'école.", introYear: 1972 },
      { icon: "🕹️", name: "Console Pong", desc: "Les premiers pixels s'affichent sur l'écran de télé.", introYear: 1972 },
      { icon: "🎬", name: "Figurines Star Wars", desc: "Toute une génération rêve de sabres laser.", introYear: 1977 },
      { icon: "📡", name: "Talkie-walkie CB", desc: "\"Bien reçu\", le nouveau langage des ados.", introYear: 1977 },
      { icon: "🚲", name: "BMX", desc: "Le vélo à figures qui débarque dans les cours d'école.", introYear: 1978 },
      { icon: "🪩", name: "Boule à facettes disco", desc: "L'ambiance dancefloor incontournable des soirées.", introYear: 1978 },
      { icon: "📼", name: "Premiers magnétoscopes", desc: "On peut enfin enregistrer ses émissions préférées.", introYear: 1978 },
    ],
  },
  {
    start: 1980,
    end: 1989,
    name: "Les années 80",
    tagline: "Walkman, Minitel et néons synthwave.",
    theme: "theme-80s",
    pool: [
      { icon: "🎧", name: "Walkman", desc: "La musique devient enfin portable, casque sur les oreilles.", introYear: 1980 },
      { icon: "🧩", name: "Rubik's Cube", desc: "Le casse-tête qui rend fou le monde entier.", introYear: 1980 },
      { icon: "🎮", name: "Game & Watch", desc: "La toute première console de poche Nintendo.", introYear: 1980 },
      { icon: "📻", name: "Radio-cassette (ghetto blaster)", desc: "On le pose sur l'épaule et on met le son à fond.", introYear: 1981 },
      { icon: "💻", name: "Minitel", desc: "L'ancêtre français d'Internet, dans presque tous les foyers.", introYear: 1982 },
      { icon: "🏃", name: "Legwarmers et sweat fluo", desc: "Le look aérobic inspiré de Jane Fonda.", introYear: 1983 },
      { icon: "📱", name: "Téléphone portable \"brique\"", desc: "Un pavé kilo pour passer un appel dans la rue.", introYear: 1984 },
      { icon: "🖼️", name: "Cartes Panini à coller", desc: "L'album qu'il faut absolument compléter.", introYear: 1985 },
      { icon: "💾", name: "Ordinateurs familiaux (Amstrad, C64)", desc: "Les premiers jeux vidéo à la maison, cassette dans le lecteur.", introYear: 1985 },
      { icon: "🕹️", name: "Nintendo NES", desc: "Mario et Zelda débarquent dans les salons français.", introYear: 1986 },
      { icon: "🐢", name: "Figurines Tortues Ninja", desc: "Cowabunga ! La déferlante venue des égouts de New York.", introYear: 1988 },
    ],
  },
  {
    start: 1990,
    end: 1999,
    name: "Les années 90",
    tagline: "Pogs, cartes Pokémon et Tamagotchi.",
    theme: "theme-90s",
    pool: [
      { icon: "🎮", name: "Game Boy", desc: "Tetris et Mario tiennent enfin dans la poche.", introYear: 1990 },
      { icon: "💽", name: "Discman", desc: "La musique CD à emporter partout, mais gare aux sauts de lecture.", introYear: 1990 },
      { icon: "🕹️", name: "Super Nintendo", desc: "Mario Kart et Street Fighter envahissent les salons.", introYear: 1992 },
      { icon: "🃏", name: "Cartes Magic : l'Assemblée", desc: "Le jeu de cartes à collectionner qui déchaîne les passions.", introYear: 1994 },
      { icon: "🀄", name: "Pogs et Tazos", desc: "On joue des parties entières de récré pour les gagner.", introYear: 1995 },
      { icon: "🛼", name: "Rollers en ligne", desc: "Tout le monde glisse dans la rue et au skatepark.", introYear: 1995 },
      { icon: "🎤", name: "Boys bands et Spice Girls", desc: "Posters sur les murs et cassettes usées à force d'écoute.", introYear: 1996 },
      { icon: "🐣", name: "Tamagotchi", desc: "L'animal virtuel qu'il faut nourrir et soigner H24.", introYear: 1997 },
      { icon: "🎮", name: "Nintendo 64", desc: "Mario 64 en 3D, une claque visuelle pour toute une génération.", introYear: 1997 },
      { icon: "🦉", name: "Furby", desc: "La peluche robot qui parle toute seule la nuit.", introYear: 1998 },
      { icon: "🎬", name: "Titanic en VHS", desc: "Le film que toute la classe a vu (et revu).", introYear: 1998 },
      { icon: "🪀", name: "Yoyo Yomega", desc: "Le retour en force du yoyo, figures à l'appui.", introYear: 1998 },
      { icon: "⚡", name: "Cartes Pokémon", desc: "Attrapez-les tous, échangez-les tous dans la cour de récré.", introYear: 1999 },
      { icon: "💿", name: "Minidisc", desc: "Le petit disque qui devait remplacer la cassette.", introYear: 1999 },
    ],
  },
  {
    start: 2000,
    end: 2009,
    name: "Les années 2000",
    tagline: "MSN, iPod et Yu-Gi-Oh.",
    theme: "theme-2000s",
    pool: [
      { icon: "📱", name: "Nokia à clapet / 3310", desc: "Le téléphone increvable et Snake pour tuer le temps.", introYear: 2000 },
      { icon: "📀", name: "DVD et lecteurs portables", desc: "Le film à la maison en bien meilleure qualité.", introYear: 2001 },
      { icon: "🃏", name: "Cartes Yu-Gi-Oh", desc: "Des duels épiques échangés dans la cour d'école.", introYear: 2002 },
      { icon: "🌀", name: "Beyblade", desc: "Les toupies qui s'affrontent dans l'arène en plastique.", introYear: 2002 },
      { icon: "🎵", name: "iPod", desc: "Mille chansons dans la poche, la fin du CD.", introYear: 2002 },
      { icon: "💬", name: "MSN Messenger", desc: "Un \"ding\", un pote se connecte, vite un pseudo qui claque.", introYear: 2003 },
      { icon: "📝", name: "Skyblog", desc: "Chacun a le sien, avec sa musique qui se lance toute seule.", introYear: 2003 },
      { icon: "🧵", name: "Bracelets brésiliens", desc: "Tressés à la main pendant les cours et les vacances.", introYear: 2004 },
      { icon: "🎮", name: "Nintendo DS", desc: "Deux écrans, un stylet, et Nintendogs partout.", introYear: 2005 },
      { icon: "🎮", name: "PSP", desc: "La console portable qui fait aussi lecteur multimédia.", introYear: 2005 },
      { icon: "🐾", name: "Webkinz et Neopets", desc: "Élever des animaux virtuels sur l'ordinateur familial.", introYear: 2005 },
      { icon: "🎮", name: "Wii et la Wiimote", desc: "Toute la famille se lève pour jouer au tennis dans le salon.", introYear: 2006 },
      { icon: "🐧", name: "Club Penguin", desc: "Le jeu en ligne où toute une génération se retrouve.", introYear: 2007 },
      { icon: "📱", name: "iPhone première génération", desc: "Le smartphone qui rebat toutes les cartes.", introYear: 2008 },
    ],
  },
  {
    start: 2010,
    end: 2019,
    name: "Les années 2010",
    tagline: "Fidget spinners, Vine et Pokémon GO.",
    theme: "theme-2010s",
    pool: [
      { icon: "🧱", name: "Minecraft", desc: "Construire des mondes entiers en cubes, à l'infini.", introYear: 2011 },
      { icon: "🤳", name: "Smartphones et selfies", desc: "Un appareil photo dans chaque poche, en permanence.", introYear: 2011 },
      { icon: "📷", name: "Instagram", desc: "Les photos avec filtre deviennent un réflexe quotidien.", introYear: 2012 },
      { icon: "🍬", name: "Candy Crush", desc: "Le jeu de bonbons qui aspire des heures entières.", introYear: 2012 },
      { icon: "🎥", name: "Vine", desc: "Six secondes chrono pour devenir culte.", introYear: 2013 },
      { icon: "👻", name: "Snapchat", desc: "Les messages et les filtres qui disparaissent.", introYear: 2013 },
      { icon: "🧶", name: "Loom bands", desc: "Les bracelets élastiques faits main, partout dans les cours d'école.", introYear: 2014 },
      { icon: "🛹", name: "Hoverboard", desc: "La planche à roulettes électrique qui déferle dans les rues.", introYear: 2015 },
      { icon: "🎨", name: "Coloriages anti-stress mandala", desc: "Le carnet de coloriage devient un objet pour adultes.", introYear: 2015 },
      { icon: "🐉", name: "Pokémon GO", desc: "Toute la ville dehors, téléphone en main, à la chasse aux Pokémon.", introYear: 2016 },
      { icon: "🌀", name: "Fidget spinner", desc: "L'objet anti-stress que tout le monde fait tourner en classe.", introYear: 2017 },
      { icon: "🔊", name: "Enceintes Bluetooth portables", desc: "La musique partout, sans fil, à la plage comme au parc.", introYear: 2017 },
    ],
  },
  {
    start: 2020,
    end: 2026,
    name: "Les années 2020",
    tagline: "TikTok, Wordle et visios improvisées.",
    theme: "theme-2020s",
    pool: [
      { icon: "💻", name: "Visioconférences", desc: "Réunions, cours et apéros derrière un écran.", introYear: 2020 },
      { icon: "🕵️", name: "Among Us", desc: "Qui est l'imposteur ? Tout le monde y a joué en 2020.", introYear: 2020 },
      { icon: "🎬", name: "TikTok", desc: "Le format court qui prend le monde d'assaut.", introYear: 2020 },
      { icon: "🎧", name: "Écouteurs sans fil", desc: "Les fils, c'est fini, même pour le sport.", introYear: 2020 },
      { icon: "🦑", name: "Séries virales mondiales", desc: "Une série sort et toute la planète en parle en même temps.", introYear: 2021 },
      { icon: "🎮", name: "Cloud gaming", desc: "Jouer à des jeux exigeants sans console dédiée.", introYear: 2021 },
      { icon: "🟩", name: "Wordle", desc: "Le mot du jour partagé par tous, en grille verte et jaune.", introYear: 2022 },
      { icon: "🤖", name: "IA générative", desc: "Discuter et créer avec une intelligence artificielle, en quelques secondes.", introYear: 2023 },
      { icon: "🏅", name: "Jeux Olympiques de Paris", desc: "La France entière derrière ses athlètes, l'été 2024.", introYear: 2024 },
    ],
  },
];

// Petites touches de contexte "ambiance de l'année" (facultatif, quand disponible).
const YEAR_CONTEXT = {
  1968: "Mai 68 secoue la France.",
  1969: "L'humanité marche sur la Lune, en direct à la télé.",
  1977: "Star Wars envahit les salles de cinéma.",
  1981: "François Mitterrand devient président de la République.",
  1986: "La comète de Halley repasse près de la Terre.",
  1989: "La chute du mur de Berlin change le monde.",
  1991: "Le Minitel est à son apogée dans les foyers français.",
  1995: "Toy Story, premier film d'animation entièrement en images de synthèse.",
  1998: "La France est championne du monde de football.",
  2001: "Le 11 septembre bouleverse le monde.",
  2002: "Passage à l'euro dans les portefeuilles.",
  2008: "La crise financière mondiale frappe l'économie.",
  2015: "Les attentats de Paris marquent l'année.",
  2018: "La France est de nouveau championne du monde de football.",
  2019: "L'incendie de Notre-Dame de Paris bouleverse le pays.",
  2020: "Le confinement mondial lié au Covid-19 change le quotidien de tous.",
  2022: "Guerre en Ukraine et Coupe du monde au Qatar.",
  2023: "L'explosion de l'intelligence artificielle générative.",
  2024: "Les Jeux Olympiques et Paralympiques de Paris rassemblent le pays.",
};

function decadeIndexForYear(year) {
  const idx = DECADES.findIndex((d) => year >= d.start && year <= d.end);
  if (idx !== -1) return idx;
  return year < DECADES[0].start ? 0 : DECADES.length - 1;
}

function buildYearSelection(year) {
  const decadeIdx = decadeIndexForYear(year);
  const decade = DECADES[decadeIdx];
  const prevDecade = decadeIdx > 0 ? DECADES[decadeIdx - 1] : null;

  const eligible = [
    ...decade.pool,
    ...(prevDecade ? prevDecade.pool : []),
  ].filter((item) => item.introYear <= year);

  const newItems = eligible.filter((item) => item.introYear === year);
  const olderItems = eligible.filter((item) => item.introYear < year);

  const need = Math.max(0, TARGET_ITEMS - newItems.length);
  const selectedOlder = [];
  if (need > 0 && olderItems.length > 0) {
    const offset = ((year % olderItems.length) + olderItems.length) % olderItems.length;
    for (let i = 0; i < Math.min(need, olderItems.length); i++) {
      selectedOlder.push(olderItems[(offset + i) % olderItems.length]);
    }
  }

  return {
    decade,
    items: [...newItems, ...selectedOlder].map((item) => ({
      ...item,
      isNew: item.introYear === year,
    })),
  };
}

const yearSlider = document.getElementById("yearSlider");
const yearValue = document.getElementById("yearValue");
const yearMinus = document.getElementById("yearMinus");
const yearPlus = document.getElementById("yearPlus");
const goBtn = document.getElementById("goBtn");
const result = document.getElementById("result");
const decadeTitle = document.getElementById("decadeTitle");
const decadeTagline = document.getElementById("decadeTagline");
const yearContextEl = document.getElementById("yearContext");
const itemsCountEl = document.getElementById("itemsCount");
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

function renderYear(year) {
  const { decade, items } = buildYearSelection(year);

  document.body.className = decade.theme;

  decadeTitle.textContent = `${year} — ${decade.name}`;
  decadeTagline.textContent = decade.tagline;

  const context = YEAR_CONTEXT[year];
  if (context) {
    yearContextEl.textContent = `🗓️ ${context}`;
    yearContextEl.hidden = false;
  } else {
    yearContextEl.hidden = true;
  }

  itemsCountEl.textContent = `${items.length} référence${items.length > 1 ? "s" : ""} culte${items.length > 1 ? "s" : ""} pour ${year}`;

  itemsGrid.innerHTML = "";
  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.style.animationDelay = `${index * 80}ms`;
    card.innerHTML = `
      ${item.isNew ? `<span class="item-badge">Nouveauté ${item.introYear}</span>` : ""}
      <div class="item-photo">
        <span class="item-icon">${item.icon}</span>
      </div>
      <h3 class="item-name">${item.name}</h3>
      <p class="item-desc">${item.desc}</p>
      <p class="item-year">Apparu en ${item.introYear}</p>
    `;
    itemsGrid.appendChild(card);
  });

  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

goBtn.addEventListener("click", () => {
  renderYear(Number(yearSlider.value));
});

updateYearDisplay();
