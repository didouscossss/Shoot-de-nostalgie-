# GTA VI Boosters 🎴

Projet de fan non officiel (sans lien avec Rockstar Games ni Take-Two
Interactive). Ouvre des boosters de 3 cartes originales et complète ta
collection. Plus une carte est rare, plus elle est dure à obtenir.

## Utilisation

Aucune installation nécessaire : c'est un site statique en HTML/CSS/JS pur.

- Ouvrir `index.html` directement dans un navigateur, ou
- Servir le dossier avec n'importe quel serveur statique, par exemple :

```bash
npx serve .
```

## Déploiement (GitHub Pages)

1. Dans les paramètres du dépôt GitHub, section **Pages**.
2. Choisir la branche `main` et le dossier `/ (root)`.
3. Le site est alors disponible à l'adresse fournie par GitHub Pages.

## Structure

- `index.html` — structure de la page (onglets Boosters / Collection).
- `style.css` — thème visuel (cadre coloré selon la rareté, animations d'ouverture et de flip).
- `cards-data.js` — la liste des cartes (`CARDS`). **C'est ce fichier à remplacer/compléter avec la vraie liste.**
- `script.js` — moteur du jeu : tirage pondéré par rareté, collection (localStorage), rendu.

## Format d'une carte (`cards-data.js`)

```js
{
  id: "c013",              // identifiant unique et stable (ne change jamais)
  number: "013",           // numéro affiché sur la carte
  name: "Franklin Diaz",   // nom de la carte
  category: "Personnage",  // Personnage / Véhicule / Lieu / Environnement / Autre
  rarity: "legendaire",    // normale / rare / ultra / epique / legendaire / secrete
  tagline: "...",          // courte accroche
  image: "cards/013.jpg",  // optionnel : chemin vers le visuel de la carte
}
```

Si `image` est absent, une pastille de repli s'affiche à la place (pas de
photo/artwork officiel du jeu utilisé).

## Réglage des probabilités de tirage

Dans `script.js`, le tableau `RARITY_CONFIG` définit le poids de chaque
rareté (plus le poids est petit, plus elle est rare) :

```js
const RARITY_CONFIG = [
  { key: "normale",    label: "Normale",     weight: 55,  color: "#9aa5b1" },
  { key: "rare",       label: "Rare",        weight: 27,  color: "#3b82f6" },
  { key: "ultra",      label: "Ultra Rare",  weight: 10,  color: "#14b8a6" },
  { key: "epique",     label: "Épique",      weight: 5.5, color: "#a855f7" },
  { key: "legendaire", label: "Légendaire",  weight: 2,   color: "#f5a623" },
  { key: "secrete",    label: "Secrète",     weight: 0.5, color: "#ff2e97" },
];
```

Chaque booster tire 3 cartes indépendamment (une carte peut donc, en
théorie, sortir plusieurs fois dans le même booster).

## Collection

La collection (cartes obtenues + nombre d'exemplaires) est sauvegardée dans
le `localStorage` du navigateur : propre à chaque appareil/navigateur, sans
compte ni serveur.
