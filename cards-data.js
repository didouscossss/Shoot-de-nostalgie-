// ---------------------------------------------------------------------------
// Base de cartes — transcrite à partir des visuels de cartes envoyés dans
// le chat (numéro, nom, catégorie, rareté). Les IMAGES elles-mêmes ne sont
// pas encore intégrées (elles doivent être uploadées sur GitHub, voir
// README.md) : chaque carte affiche un visuel de repli en attendant.
//
// Il en manque probablement (~100+ cartes annoncées, ~58 transcrites ici).
// Pour compléter/corriger : envoie la suite en texte (numéro - nom -
// catégorie - rareté), c'est beaucoup plus fiable et rapide que les images.
//
// ⚠️ Conflit détecté dans la source : le numéro 019 a été vu sur deux
// cartes différentes ("Vice Pursuit" / Action et "Vice Festival" /
// Événement). Les deux sont incluses avec des id différents ; à corriger
// quand tu auras l'info.
//
// Champs :
//   id       identifiant unique stable (ne change jamais, même si le nom change)
//   number   numéro affiché sur la carte (ex: "013" ou "S03")
//   name     nom de la carte
//   category catégorie affichée sur la carte
//   rarity   normale / rare / ultra / epique / legendaire / secrete
//   tagline  courte accroche affichée sur la carte
//   image    chemin vers l'image (ex: "cards/013.jpg") — absent pour l'instant
// ---------------------------------------------------------------------------

const CARDS = [
  // --- Personnages ---
  { id: "c005", number: "005", name: "Lucia Caminos", category: "Personnage", rarity: "rare", tagline: "Plus qu'un nom, une révolution." },
  { id: "c006", number: "006", name: "Jason Duval", category: "Personnage", rarity: "rare", tagline: "Un homme. Mille combats." },
  { id: "c007", number: "007", name: "Sofia Cruz", category: "Personnage", rarity: "normale", tagline: "Moteurs. Rêves. Sans limites." },
  { id: "c008", number: "008", name: "Cal Hampton", category: "Personnage", rarity: "rare", tagline: "Un vrai ami, toujours là." },
  { id: "c009", number: "009", name: "Raul Mendoza", category: "Personnage", rarity: "epique", tagline: "Le réseau n'a pas de frontières." },
  { id: "c010", number: "010", name: "Roxy Torres", category: "Personnage", rarity: "legendaire", tagline: "Même rue. Même famille." },
  { id: "c011", number: "011", name: "Marcus Reyes", category: "Personnage", rarity: "rare", tagline: "Des contacts. Des résultats." },
  { id: "c012", number: "012", name: "Valentina Ruiz", category: "Personnage", rarity: "epique", tagline: "Plus loin toujours." },
  { id: "c013", number: "013", name: "Franklin Diaz", category: "Personnage", rarity: "legendaire", tagline: "L'expérience fait la différence." },
  { id: "c014", number: "014", name: "Enrico Vargas", category: "Personnage", rarity: "epique", tagline: "Les relations font la force." },

  // --- Lieux / véhicules / environnement ---
  { id: "c002", number: "002", name: "Ocean Beach", category: "Lieu", rarity: "normale", tagline: "Soleil, sable et liberté." },
  { id: "c004", number: "004", name: "Classic Lowrider", category: "Véhicule", rarity: "normale", tagline: "Un style qui ne meurt jamais." },
  { id: "c015", number: "015", name: "Leonida", category: "Environnement", rarity: "legendaire", tagline: "Plus qu'une ville." },
  { id: "c016", number: "016", name: "Aqua Vice", category: "Véhicule", rarity: "rare", tagline: "Cap sur de nouveaux horizons." },
  { id: "c017", number: "017", name: "Vice Estates", category: "Environnement", rarity: "legendaire", tagline: "Plus qu'une propriété." },
  { id: "c099", number: "099", name: "Leonida Skyline", category: "Lieu", rarity: "ultra", tagline: "Des rêves sans limites." },
  { id: "c100", number: "100", name: "Leonida Ocean Drive", category: "Lieu", rarity: "ultra", tagline: "La nuit n'oublie jamais." },

  // --- Série "Vice" (thèmes/activités) ---
  { id: "c018", number: "018", name: "Vice Network", category: "Réseau", rarity: "epique", tagline: "Des liens sans frontières." },
  { id: "c019", number: "019", name: "Vice Pursuit", category: "Action", rarity: "epique", tagline: "Plus vite que les règles." },
  { id: "c019b", number: "019", name: "Vice Festival", category: "Événement", rarity: "epique", tagline: "Plus qu'un événement." },
  { id: "c020", number: "020", name: "Vice Exploration", category: "Exploration", rarity: "rare", tagline: "Au-delà des limites." },
  { id: "c021", number: "021", name: "Vice Customs", category: "Customisation", rarity: "epique", tagline: "Plus qu'une voiture." },
  { id: "c022", number: "022", name: "Vice Lifestyle", category: "Lifestyle", rarity: "rare", tagline: "Vivre autrement." },
  { id: "c023", number: "023", name: "Vice Pursuit", category: "Poursuite", rarity: "epique", tagline: "Certaines limites sont faites pour être franchies." },
  { id: "c024", number: "024", name: "Vice Détente", category: "Détente", rarity: "legendaire", tagline: "Prendre le temps." },
  { id: "c025", number: "025", name: "Vice Exploration", category: "Exploration Ancienne", rarity: "legendaire", tagline: "Le passé inspire le présent." },
  { id: "c026", number: "026", name: "Vice Aventure", category: "Aventure", rarity: "rare", tagline: "Le monde n'attend pas." },
  { id: "c027", number: "027", name: "Vice Street Race", category: "Événement", rarity: "epique", tagline: "La vitesse comme liberté." },
  { id: "c028", number: "028", name: "Vice Braquage", category: "Braquage", rarity: "epique", tagline: "Un plan. Une échappatoire. Une nouvelle vie." },
  { id: "c029", number: "029", name: "Vice Plage", category: "Fête sur la Plage", rarity: "epique", tagline: "Plus qu'une fête, un état d'esprit." },
  { id: "c030", number: "030", name: "Vice Wildlife", category: "Exploration Sauvage", rarity: "rare", tagline: "Là où la ville s'efface." },
  { id: "c035", number: "035", name: "Vice Life", category: "Quartier Résidentiel", rarity: "epique", tagline: "Des voisins. Des histoires. Un même quartier." },
  { id: "c036", number: "036", name: "Vice Nature", category: "Airboat dans les Marais", rarity: "epique", tagline: "Plus sauvage que jamais." },
  { id: "c037", number: "037", name: "Vice Business", category: "Supérette de Port Gellhorn", rarity: "epique", tagline: "Petits braquages. Grandes histoires." },
  { id: "c038", number: "038", name: "Vice Ocean", category: "Pêche Interdite", rarity: "epique", tagline: "Mêmes eaux. Autres règles." },
  { id: "c039", number: "039", name: "Vice Ocean", category: "Pêche Bioluminescente", rarity: "epique", tagline: "Des rencontres qui illuminent." },
  { id: "c040", number: "040", name: "Vice Nature", category: "Exploration Nocturne", rarity: "epique", tagline: "La nuit révèle l'extraordinaire." },
  { id: "c041", number: "041", name: "Vice Nature", category: "Baie aux Lucioles de Mer", rarity: "epique", tagline: "Là où la mer brille." },
  { id: "c042", number: "042", name: "Vice Ocean", category: "Plongée des Légendes", rarity: "epique", tagline: "Plonger. Découvrir. Préserver." },
  { id: "c043", number: "043", name: "Carte de Leonida", category: "Carte", rarity: "epique", tagline: "Plus qu'une carte, un état d'esprit." },

  // --- Série "cartes postales" (quotidien à Leonida) ---
  { id: "c049", number: "049", name: "Plage & Détente", category: "Lieu", rarity: "normale", tagline: "Plus qu'une plage, un état d'esprit." },
  { id: "c051", number: "051", name: "Supérette 24/7", category: "Lieu", rarity: "normale", tagline: "Toujours ouverte. Toujours utile." },
  { id: "c052", number: "052", name: "Skatepark Sunset", category: "Lieu", rarity: "normale", tagline: "Rouler. Partager. Progresser." },
  { id: "c053", number: "053", name: "Salon de Tatouage", category: "Lieu", rarity: "normale", tagline: "Des histoires sur la peau, pour toujours." },
  { id: "c054", number: "054", name: "Food Truck Tacos", category: "Lieu", rarity: "normale", tagline: "Des saveurs qui rassemblent." },
  { id: "c055", number: "055", name: "Plage de Leonida", category: "Lieu", rarity: "normale", tagline: "Soleil, liberté, horizons sans fin." },
  { id: "c056", number: "056", name: "Nuits de Leonida", category: "Lieu", rarity: "normale", tagline: "Mêmes rues. Mille histoires." },
  { id: "c057", number: "057", name: "Terrain Libre", category: "Lieu", rarity: "normale", tagline: "Plus qu'un jeu, un état d'esprit." },
  { id: "c058", number: "058", name: "Art à Ciel Ouvert", category: "Lieu", rarity: "normale", tagline: "Des murs qui racontent des histoires." },
  { id: "c059", number: "059", name: "Horizons de Leonida", category: "Lieu", rarity: "normale", tagline: "Mêmes plages, toujours plus d'histoires." },
  { id: "c065", number: "065", name: "Routes de Leonida", category: "Lieu", rarity: "normale", tagline: "Mêmes routes, toujours plus de liberté." },
  { id: "c066", number: "066", name: "Leonida Escape", category: "Lieu", rarity: "normale", tagline: "Prendre le large, toujours plus loin." },
  { id: "c067", number: "067", name: "Leonida Heights", category: "Lieu", rarity: "normale", tagline: "Prendre de la hauteur, toujours plus loin." },
  { id: "c068", number: "068", name: "Leonida Roadtrip", category: "Lieu", rarity: "normale", tagline: "Des routes infinies, des souvenirs éternels." },
  { id: "c069", number: "069", name: "Leonida Nights", category: "Lieu", rarity: "normale", tagline: "Mêmes étoiles, d'autres rêves." },

  // --- Secrètes ---
  { id: "cS01", number: "S01", name: "Leonida Files", category: "Environnement", rarity: "secrete", tagline: "Certaines vérités restent cachées." },
  { id: "cS02", number: "S02", name: "Welcome to Leonida", category: "Environnement", rarity: "secrete", tagline: "Ici, tout est possible." },
  { id: "cS03", number: "S03", name: "The Leonida State", category: "Environnement", rarity: "secrete", tagline: "Légende au-delà du jeu." },
];
