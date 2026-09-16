// ---------------------------------------------------------------------------
// Base de cartes — À REMPLACER par la vraie liste une fois les visuels
// récupérés depuis le dépôt GitHub. Ces entrées sont des exemples pour
// tester le moteur de tirage et la collection.
//
// Champs :
//   id       identifiant unique stable (ne change jamais, même si le nom change)
//   number   numéro affiché sur la carte (ex: "013" ou "S03")
//   name     nom de la carte
//   category Personnage / Véhicule / Lieu / Environnement / Arme / Autre
//   rarity   doit correspondre à une clé de RARITY_CONFIG (voir script.js)
//   tagline  courte accroche
//   image    chemin vers l'image (ex: "cards/013.jpg") — laisser vide/absent
//            tant que l'image n'est pas dispo : un visuel de repli s'affiche
// ---------------------------------------------------------------------------

const CARDS = [
  { id: "c001", number: "001", name: "Leonida Skyline", category: "Lieu", rarity: "normale", tagline: "La ville qui ne dort jamais." },
  { id: "c002", number: "002", name: "Ocean Beach", category: "Lieu", rarity: "normale", tagline: "Soleil, sable et liberté." },
  { id: "c003", number: "003", name: "Leonida City Bus", category: "Véhicule", rarity: "normale", tagline: "Le transport qui fait tourner la ville." },
  { id: "c004", number: "004", name: "Classic Lowrider", category: "Véhicule", rarity: "normale", tagline: "Un style qui ne meurt jamais." },
  { id: "c005", number: "005", name: "Lucia Caminos", category: "Personnage", rarity: "rare", tagline: "Plus qu'un nom, une révolution." },
  { id: "c006", number: "006", name: "Jason Duval", category: "Personnage", rarity: "rare", tagline: "Un homme. Mille combats." },
  { id: "c007", number: "007", name: "Sofia Cruz", category: "Personnage", rarity: "normale", tagline: "Moteurs. Rêves. Sans limites." },
  { id: "c008", number: "008", name: "Cal Hampton", category: "Personnage", rarity: "rare", tagline: "Un vrai ami, toujours là." },
  { id: "c011", number: "011", name: "Marcus Reyes", category: "Personnage", rarity: "rare", tagline: "Des contacts. Des résultats." },
  { id: "c016", number: "016", name: "Aqua Vice", category: "Véhicule", rarity: "rare", tagline: "Cap sur de nouveaux horizons." },
  { id: "c095", number: "095", name: "Leonida Highway Pursuit", category: "Véhicule", rarity: "rare", tagline: "Des routes sans limites, des histoires sans fin." },
  { id: "c009", number: "009", name: "Raul Mendoza", category: "Personnage", rarity: "epique", tagline: "Le réseau n'a pas de frontières." },
  { id: "c012", number: "012", name: "Valentina Ruiz", category: "Personnage", rarity: "epique", tagline: "Plus loin toujours." },
  { id: "c014", number: "014", name: "Enrico Vargas", category: "Personnage", rarity: "epique", tagline: "Les relations font la force." },
  { id: "c010", number: "010", name: "Roxy Torres", category: "Personnage", rarity: "legendaire", tagline: "Même rue. Même famille." },
  { id: "c013", number: "013", name: "Franklin Diaz", category: "Personnage", rarity: "legendaire", tagline: "L'expérience fait la différence." },
  { id: "c015", number: "015", name: "Leonida", category: "Environnement", rarity: "legendaire", tagline: "Plus qu'une ville." },
  { id: "c017", number: "017", name: "Vice Estates", category: "Environnement", rarity: "legendaire", tagline: "Plus qu'une propriété." },
  { id: "c099", number: "099", name: "Leonida Skyline (Vue Aérienne)", category: "Lieu", rarity: "ultra", tagline: "Des rêves sans limites." },
  { id: "c100", number: "100", name: "Leonida Ocean Drive", category: "Lieu", rarity: "ultra", tagline: "La nuit n'oublie jamais." },
  { id: "cS01", number: "S01", name: "Leonida Files", category: "Environnement", rarity: "secrete", tagline: "Certaines vérités restent cachées." },
  { id: "cS02", number: "S02", name: "Welcome to Leonida", category: "Environnement", rarity: "secrete", tagline: "Ici, tout est possible." },
  { id: "cS03", number: "S03", name: "The Leonida State", category: "Environnement", rarity: "secrete", tagline: "Légende au-delà du jeu." },
];
