# Shoot de Nostalgie 📼

Choisis une année sur le curseur, et l'application t'affiche les objets et
tendances cultes qui ont marqué cette époque (des années 50 aux années 2020) :
pogs et cartes Pokémon des années 90, Minitel et Walkman des années 80,
Tamagotchi, MSN, fidget spinners...

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

- `index.html` — structure de la page (sélecteur d'année + zone de résultats).
- `style.css` — thème visuel, avec une palette de couleurs différente par décennie.
- `script.js` — données des décennies (objets cultes) et logique d'affichage.

## Ajouter/modifier des objets cultes

Toutes les données sont dans le tableau `DECADES` en haut de `script.js`.
Chaque décennie a une plage d'années (`start`/`end`), un nom, une accroche,
un thème CSS et une liste d'`items` (`icon`, `name`, `desc`).
