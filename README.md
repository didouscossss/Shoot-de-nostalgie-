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

- **Sans compte configuré (mode invité)** : la collection est sauvegardée
  dans le `localStorage` du navigateur, propre à chaque appareil, boosters
  illimités — c'est le comportement par défaut tant que Firebase n'est pas
  configuré (voir plus bas).
- **Avec un compte** : la collection, les boosters disponibles et les
  pièces sont stockés dans le cloud (Firestore), synchronisés entre
  appareils.

## Comptes, monnaie virtuelle et récompense hebdomadaire (Firebase)

Aucun argent réel n'est impliqué : c'est un fan-projet non officiel, il
n'y a donc pas de vraie boutique. À la place :

- **10 boosters offerts** + **600 "Pièces Leonida"** (monnaie 100% virtuelle)
  à la création du compte.
- **+1 booster gratuit chaque semaine**, réclamable dès le lundi 7h (heure
  du joueur) jusqu'au lundi suivant — pas besoin d'être connecté pile à
  l'heure, la bannière reste affichée toute la semaine tant qu'il n'a pas
  été réclamé.
- **Boutique** : dépenser des pièces contre des boosters supplémentaires.

### Mise en place (à faire une seule fois)

Ce site reste 100% statique (aucun serveur à héberger) : Firebase fournit
juste l'authentification et la base de données depuis le navigateur.

1. Va sur https://console.firebase.google.com et crée un nouveau projet
   (gratuit, offre "Spark").
2. Dans le projet, clique sur l'icône **`</>`** ("Ajouter une application
   Web"), donne-lui un nom, puis copie l'objet `firebaseConfig` qui
   s'affiche.
3. Colle ces valeurs dans `firebase-config.js` à la place des
   `"REMPLACE_MOI"`.
4. **Authentication** → onglet *Sign-in method* → active le fournisseur
   **Email/Password**.
5. **Firestore Database** → *Créer une base de données* → mode production,
   région au choix (ex: `eur3`).
6. Dans Firestore → onglet **Règles**, colle ceci puis publie :

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
     }
   }
   ```

   Ces règles garantissent que chaque joueur ne peut lire/modifier que ses
   propres données (impossible de voir ou modifier le compte d'un autre
   joueur).
7. Commit + push `firebase-config.js` avec tes vraies valeurs, puis
   redéploie (GitHub Pages se met à jour automatiquement après un push).

Tant que `firebase-config.js` garde ses valeurs par défaut, le site
détecte l'absence de configuration et reste en mode invité (aucun bouton
de connexion visible, comportement identique à avant les comptes) — donc
rien ne casse si tu déploies avant d'avoir fini cette étape.

### Ajuster l'économie

Dans `auth.js` : `STARTING_BOOSTERS` (10) et `STARTING_COINS` (600).
Dans `index.html`, section `#tab-shop` : le prix (`data-price`) et la
quantité (`data-qty`) de chaque objet de la boutique.
Dans `auth.js`, fonction `_mostRecentMondaySevenAM` : le jour/heure de la
récompense hebdomadaire (actuellement lundi 7h, heure locale du joueur).
