// ---------------------------------------------------------------------------
// Base de cartes — transcrite et illustrée à partir des vrais visuels de
// cartes envoyés dans le chat (numéro, nom, catégorie, rareté, image).
// Les images sont dans le dossier cards/ (extraites et renommées d'après
// leur numéro de carte).
//
// Cartes encore manquantes (numérotation vue : jusqu'à 100 + S01-S03,
// avec des trous : 001, 003, 031-034, 044-048, 050, 060-064, 070-076,
// 078-082, 089, 096) : envoie la suite en texte (numéro - nom - catégorie
// - rareté) ou uploade les images restantes sur GitHub.
//
// ⚠️ Conflit détecté dans la source : le numéro 019 a été vu sur deux
// cartes différentes ("Vice Pursuit" / Action et "Vice Festival" /
// Événement). Les deux sont incluses avec des id différents ("c019" et
// "c019b") ; à corriger quand tu auras l'info.
//
// Champs :
//   id       identifiant unique stable (ne change jamais, même si le nom change)
//   number   numéro affiché sur la carte (ex: "013" ou "S03")
//   name     nom de la carte
//   category catégorie affichée sur la carte
//   rarity   normale / rare / ultra / epique / legendaire / secrete
//   tagline  courte accroche affichée sur la carte
//   image    chemin vers l'image (ex: "cards/013.webp")
// ---------------------------------------------------------------------------

const CARDS = [
  // --- Personnages ---
  { id: "c005", number: "005", name: "Lucia Caminos", category: "Personnage", rarity: "rare", tagline: "Plus qu'un nom, une révolution.", image: "cards/005.webp" },
  { id: "c006", number: "006", name: "Jason Duval", category: "Personnage", rarity: "rare", tagline: "Un homme. Mille combats.", image: "cards/006.webp" },
  { id: "c007", number: "007", name: "Sofia Cruz", category: "Personnage", rarity: "normale", tagline: "Moteurs. Rêves. Sans limites.", image: "cards/007.webp" },
  { id: "c008", number: "008", name: "Cal Hampton", category: "Personnage", rarity: "rare", tagline: "Un vrai ami, toujours là.", image: "cards/008.webp" },
  { id: "c009", number: "009", name: "Raul Mendoza", category: "Personnage", rarity: "epique", tagline: "Le réseau n'a pas de frontières.", image: "cards/009.webp" },
  { id: "c010", number: "010", name: "Roxy Torres", category: "Personnage", rarity: "legendaire", tagline: "Même rue. Même famille.", image: "cards/010.webp" },
  { id: "c011", number: "011", name: "Marcus Reyes", category: "Personnage", rarity: "rare", tagline: "Des contacts. Des résultats.", image: "cards/011.webp" },
  { id: "c012", number: "012", name: "Valentina Ruiz", category: "Personnage", rarity: "epique", tagline: "Plus loin toujours.", image: "cards/012.webp" },
  { id: "c013", number: "013", name: "Franklin Diaz", category: "Personnage", rarity: "legendaire", tagline: "L'expérience fait la différence.", image: "cards/013.webp" },
  { id: "c014", number: "014", name: "Enrico Vargas", category: "Personnage", rarity: "epique", tagline: "Les relations font la force.", image: "cards/014.webp" },

  // --- Lieux / véhicules / environnement ---
  { id: "c002", number: "002", name: "Ocean Beach", category: "Lieu", rarity: "normale", tagline: "Soleil, sable et liberté.", image: "cards/002.webp" },
  { id: "c004", number: "004", name: "Classic Lowrider", category: "Véhicule", rarity: "normale", tagline: "Un style qui ne meurt jamais.", image: "cards/004.webp" },
  { id: "c015", number: "015", name: "Leonida", category: "Environnement", rarity: "legendaire", tagline: "Plus qu'une ville.", image: "cards/015.webp" },
  { id: "c016", number: "016", name: "Aqua Vice", category: "Véhicule", rarity: "rare", tagline: "Cap sur de nouveaux horizons.", image: "cards/016.webp" },
  { id: "c017", number: "017", name: "Vice Estates", category: "Environnement", rarity: "legendaire", tagline: "Plus qu'une propriété.", image: "cards/017.webp" },
  { id: "c099", number: "099", name: "Leonida Skyline", category: "Lieu", rarity: "ultra", tagline: "Des rêves sans limites.", image: "cards/099.webp" },
  { id: "c100", number: "100", name: "Leonida Ocean Drive", category: "Lieu", rarity: "ultra", tagline: "La nuit n'oublie jamais.", image: "cards/100.webp" },

  // --- Série "Vice" (thèmes/activités) ---
  { id: "c018", number: "018", name: "Vice Network", category: "Réseau", rarity: "epique", tagline: "Des liens sans frontières.", image: "cards/018.webp" },
  { id: "c019", number: "019", name: "Vice Pursuit", category: "Action", rarity: "epique", tagline: "Plus vite que les règles.", image: "cards/019.webp" },
  { id: "c019b", number: "019", name: "Vice Festival", category: "Événement", rarity: "epique", tagline: "Plus qu'un événement.", image: "cards/019b.webp" },
  { id: "c020", number: "020", name: "Vice Exploration", category: "Exploration", rarity: "rare", tagline: "Au-delà des limites.", image: "cards/020.webp" },
  { id: "c021", number: "021", name: "Vice Customs", category: "Customisation", rarity: "epique", tagline: "Plus qu'une voiture.", image: "cards/021.webp" },
  { id: "c022", number: "022", name: "Vice Lifestyle", category: "Lifestyle", rarity: "rare", tagline: "Vivre autrement.", image: "cards/022.webp" },
  { id: "c023", number: "023", name: "Vice Pursuit", category: "Poursuite", rarity: "epique", tagline: "Certaines limites sont faites pour être franchies.", image: "cards/023.webp" },
  { id: "c024", number: "024", name: "Vice Détente", category: "Détente", rarity: "legendaire", tagline: "Prendre le temps.", image: "cards/024.webp" },
  { id: "c025", number: "025", name: "Vice Exploration", category: "Exploration Ancienne", rarity: "legendaire", tagline: "Le passé inspire le présent.", image: "cards/025.webp" },
  { id: "c026", number: "026", name: "Vice Aventure", category: "Aventure", rarity: "rare", tagline: "Le monde n'attend pas.", image: "cards/026.webp" },
  { id: "c027", number: "027", name: "Vice Street Race", category: "Événement", rarity: "epique", tagline: "La vitesse comme liberté.", image: "cards/027.webp" },
  { id: "c028", number: "028", name: "Vice Braquage", category: "Braquage", rarity: "epique", tagline: "Un plan. Une échappatoire. Une nouvelle vie.", image: "cards/028.webp" },
  { id: "c029", number: "029", name: "Vice Plage", category: "Fête sur la Plage", rarity: "epique", tagline: "Plus qu'une fête, un état d'esprit.", image: "cards/029.webp" },
  { id: "c030", number: "030", name: "Vice Wildlife", category: "Exploration Sauvage", rarity: "rare", tagline: "Là où la ville s'efface.", image: "cards/030.webp" },
  { id: "c035", number: "035", name: "Vice Life", category: "Quartier Résidentiel", rarity: "epique", tagline: "Des voisins. Des histoires. Un même quartier.", image: "cards/035.webp" },
  { id: "c036", number: "036", name: "Vice Nature", category: "Airboat dans les Marais", rarity: "epique", tagline: "Plus sauvage que jamais.", image: "cards/036.webp" },
  { id: "c037", number: "037", name: "Vice Business", category: "Supérette de Port Gellhorn", rarity: "epique", tagline: "Petits braquages. Grandes histoires.", image: "cards/037.webp" },
  { id: "c038", number: "038", name: "Vice Ocean", category: "Pêche Interdite", rarity: "epique", tagline: "Mêmes eaux. Autres règles.", image: "cards/038.webp" },
  { id: "c039", number: "039", name: "Vice Ocean", category: "Pêche Bioluminescente", rarity: "epique", tagline: "Des rencontres qui illuminent.", image: "cards/039.webp" },
  { id: "c040", number: "040", name: "Vice Nature", category: "Exploration Nocturne", rarity: "epique", tagline: "La nuit révèle l'extraordinaire.", image: "cards/040.webp" },
  { id: "c041", number: "041", name: "Vice Nature", category: "Baie aux Lucioles de Mer", rarity: "epique", tagline: "Là où la mer brille.", image: "cards/041.webp" },
  { id: "c042", number: "042", name: "Vice Ocean", category: "Plongée des Légendes", rarity: "epique", tagline: "Plonger. Découvrir. Préserver.", image: "cards/042.webp" },
  { id: "c043", number: "043", name: "Carte de Leonida", category: "Carte", rarity: "epique", tagline: "Plus qu'une carte, un état d'esprit.", image: "cards/043.webp" },

  // --- Série "cartes postales" (quotidien à Leonida) ---
  { id: "c049", number: "049", name: "Plage & Détente", category: "Lieu", rarity: "normale", tagline: "Plus qu'une plage, un état d'esprit.", image: "cards/049.webp" },
  { id: "c051", number: "051", name: "Supérette 24/7", category: "Lieu", rarity: "normale", tagline: "Toujours ouverte. Toujours utile.", image: "cards/051.webp" },
  { id: "c052", number: "052", name: "Skatepark Sunset", category: "Lieu", rarity: "normale", tagline: "Rouler. Partager. Progresser.", image: "cards/052.webp" },
  { id: "c053", number: "053", name: "Salon de Tatouage", category: "Lieu", rarity: "normale", tagline: "Des histoires sur la peau, pour toujours.", image: "cards/053.webp" },
  { id: "c054", number: "054", name: "Food Truck Tacos", category: "Lieu", rarity: "normale", tagline: "Des saveurs qui rassemblent.", image: "cards/054.webp" },
  { id: "c055", number: "055", name: "Plage de Leonida", category: "Lieu", rarity: "normale", tagline: "Soleil, liberté, horizons sans fin.", image: "cards/055.webp" },
  { id: "c056", number: "056", name: "Nuits de Leonida", category: "Lieu", rarity: "normale", tagline: "Mêmes rues. Mille histoires.", image: "cards/056.webp" },
  { id: "c057", number: "057", name: "Terrain Libre", category: "Lieu", rarity: "normale", tagline: "Plus qu'un jeu, un état d'esprit.", image: "cards/057.webp" },
  { id: "c058", number: "058", name: "Art à Ciel Ouvert", category: "Lieu", rarity: "normale", tagline: "Des murs qui racontent des histoires.", image: "cards/058.webp" },
  { id: "c059", number: "059", name: "Horizons de Leonida", category: "Lieu", rarity: "normale", tagline: "Mêmes plages, toujours plus d'histoires.", image: "cards/059.webp" },
  { id: "c065", number: "065", name: "Routes de Leonida", category: "Lieu", rarity: "normale", tagline: "Mêmes routes, toujours plus de liberté.", image: "cards/065.webp" },
  { id: "c066", number: "066", name: "Leonida Escape", category: "Lieu", rarity: "normale", tagline: "Prendre le large, toujours plus loin.", image: "cards/066.webp" },
  { id: "c067", number: "067", name: "Leonida Heights", category: "Lieu", rarity: "normale", tagline: "Prendre de la hauteur, toujours plus loin.", image: "cards/067.webp" },
  { id: "c068", number: "068", name: "Leonida Roadtrip", category: "Lieu", rarity: "normale", tagline: "Des routes infinies, des souvenirs éternels.", image: "cards/068.webp" },
  { id: "c069", number: "069", name: "Leonida Nights", category: "Lieu", rarity: "normale", tagline: "Mêmes étoiles, d'autres rêves.", image: "cards/069.webp" },

  // --- Série "road trip" (77, 83-98) ---
  { id: "c077", number: "077", name: "Leonida Coastal Cruiser", category: "Lieu", rarity: "normale", tagline: "Des routes infinies, des souvenirs partout.", image: "cards/077.webp" },
  { id: "c083", number: "083", name: "Leonida Gas Station", category: "Lieu", rarity: "normale", tagline: "Plus qu'un plein, une halte sur la route.", image: "cards/083.webp" },
  { id: "c084", number: "084", name: "Leonida Dirt Explorer", category: "Lieu", rarity: "normale", tagline: "Des sentiers, des défis, des libertés.", image: "cards/084.webp" },
  { id: "c085", number: "085", name: "Leonida Mountain Ride", category: "Lieu", rarity: "normale", tagline: "Des routes qui élèvent l'esprit.", image: "cards/085.webp" },
  { id: "c086", number: "086", name: "Leonida Lake View", category: "Lieu", rarity: "normale", tagline: "Des horizons qui apaisent.", image: "cards/086.webp" },
  { id: "c087", number: "087", name: "Leonida Beach Escape", category: "Lieu", rarity: "normale", tagline: "Des plages qui changent tout.", image: "cards/087.webp" },
  { id: "c088", number: "088", name: "Leonida Coastal Roadtrip", category: "Lieu", rarity: "normale", tagline: "Des plages, des virages, des histoires.", image: "cards/088.webp" },
  { id: "c090", number: "090", name: "Leonida City Bus", category: "Lieu", rarity: "normale", tagline: "Le transport qui fait tourner la ville.", image: "cards/090.webp" },
  { id: "c091", number: "091", name: "Leonida Everglades Expedition", category: "Lieu", rarity: "normale", tagline: "Une nature sauvage, toujours plus vivante.", image: "cards/091.webp" },
  { id: "c092", number: "092", name: "Leonida Muscle Beach", category: "Lieu", rarity: "normale", tagline: "Des corps qui s'inspirent, une vie qui bouge.", image: "cards/092.webp" },
  { id: "c093", number: "093", name: "Leonida Redneck Bar", category: "Lieu", rarity: "normale", tagline: "Des rencontres qu'on n'oublie pas.", image: "cards/093.webp" },
  { id: "c094", number: "094", name: "Leonida Nightclub", category: "Lieu", rarity: "rare", tagline: "Des nuits qui écrivent les légendes.", image: "cards/094.webp" },
  { id: "c095", number: "095", name: "Leonida Highway Pursuit", category: "Lieu", rarity: "rare", tagline: "Des routes sans limites, des histoires sans fin.", image: "cards/095.webp" },
  { id: "c097", number: "097", name: "Leonida State Prison", category: "Lieu", rarity: "normale", tagline: "Des secondes chances, des histoires qui continuent.", image: "cards/097.webp" },
  { id: "c098", number: "098", name: "Leonida Everglades Tour", category: "Lieu", rarity: "normale", tagline: "Des rencontres sauvages, des souvenirs inoubliables.", image: "cards/098.webp" },

  // --- Secrètes ---
  { id: "cS01", number: "S01", name: "Leonida Files", category: "Environnement", rarity: "secrete", tagline: "Certaines vérités restent cachées.", image: "cards/S01.webp" },
  { id: "cS02", number: "S02", name: "Welcome to Leonida", category: "Environnement", rarity: "secrete", tagline: "Ici, tout est possible.", image: "cards/S02.webp" },
  { id: "cS03", number: "S03", name: "The Leonida State", category: "Environnement", rarity: "secrete", tagline: "Légende au-delà du jeu.", image: "cards/S03.webp" },
];
