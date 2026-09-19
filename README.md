# Présence 💛

Une application pour aider à être réellement présent avec ses proches.
Retrouve quelqu'un que tu apprécies, mets tes réseaux sociaux de côté le
temps de la rencontre, et fais grandir ton compagnon virtuel en passant du
vrai temps ensemble.

> Ce projet est né d'un pivot complet depuis un précédent prototype
> ("Shoot de Nostalgie" → jeu de cartes GTA6). L'architecture technique
> (Firebase Auth + Firestore, discipline de test) a été reprise ; le
> concept de tirage de cartes a été entièrement retiré.

## Pourquoi une vraie application mobile (et pas un site web) ?

Deux fonctionnalités au cœur du produit sont **techniquement impossibles
dans un navigateur** :

- **Bloquer/mettre de côté d'autres applications** : ça n'existe que via
  des API natives (Screen Time sur iOS, Accessibility Service sur
  Android). Aucune API web n'y donne accès.
- **Détecter la présence de quelqu'un en arrière-plan** (Bluetooth) : le
  Web Bluetooth n'existe quasiment pas sur mobile (absent de Safari iOS,
  très limité sur Chrome Android, jamais en arrière-plan).

C'est pourquoi ce dépôt contient un projet **React Native (Expo) +
TypeScript**, avec deux modules natifs de référence (`native/ios`,
`native/android`) à intégrer via `expo prebuild`.

**Pour la première version, seul Android est ciblé** (iOS reste en
référence dans `native/ios` pour plus tard).

## ⚠️ Limites de cet environnement de développement

Ce code a été écrit et vérifié (TypeScript, logique métier testée) dans un
environnement **sans SDK Android ni simulateur/émulateur** — donc jamais
lancé sur un appareil réel ni un émulateur. Avant de considérer une
fonctionnalité comme acquise, teste-la sur un vrai téléphone Android.
Les modules natifs (`native/android/*.kt`) sont du code de référence
correct sur le papier, mais non compilés ici.

## Mise en route

```bash
npm install
```

### 0. Essayer tout de suite, sans rien configurer (mode démo)

Tant que `src/firebase/config.ts` garde ses valeurs `"REMPLACE_MOI"`,
l'app bascule automatiquement en **mode démo** : chaque service
(`auth.ts`, `companion.ts`, `relationships.ts`, `presence.ts`) route
vers `src/services/demoBackend.ts`, un backend en mémoire (aucun
réseau, aucun compte réel). Une amie de démo ("Léa") est créée
automatiquement à l'inscription, avec une relation déjà active et une
session passée, pour que "Mes proches" et "Historique" aient tout de
suite du contenu à explorer. Pratique pour tester le parcours complet
(inscription → choix de l'animal → session Présence → Moments →
boutique) avant même de créer un projet Firebase.

Pour l'essayer dans un navigateur (utile là où Expo Go n'est pas
disponible) :

```bash
npm install react-dom react-native-web   # une seule fois
npx expo export --platform web --output-dir dist
npx serve dist                            # ou tout autre serveur statique
```

Le mode démo s'efface tout seul dès que `FIREBASE_CONFIG` contient de
vraies valeurs (étape 1 ci-dessous).

### 1. Firebase (comptes + base de données)

1. https://console.firebase.google.com → crée un projet (gratuit).
2. Ajoute une application Web (`</>`) — oui, "Web", même pour un projet
   mobile : c'est ce type d'app qui donne le `firebaseConfig` utilisé par
   le SDK JS Firebase, y compris depuis React Native.
3. Colle les valeurs obtenues dans `src/firebase/config.ts`
   (`FIREBASE_CONFIG`).
4. **Authentication** → *Sign-in method* → active **Email/Password**.
5. **Firestore Database** → créer une base (mode production).
6. Dans Firestore → **Règles**, colle le contenu de `firestore.rules`
   (à la racine du repo) et publie.

### 2. Lancer l'app en développement (Expo Go — sans blocage réel)

```bash
npx expo start
```

Scanne le QR code avec l'app **Expo Go** sur un téléphone Android. Tout
fonctionne (comptes, proches, compagnon, économie de Moments) **sauf** le
blocage réel des apps : Expo Go ne peut pas charger de modules natifs
personnalisés. Le minuteur de session tourne quand même, sans blocage
effectif (`console.warn` visible dans les logs).

### 3. Build natif (avec le vrai blocage Android)

```bash
npx expo prebuild --platform android
```

Puis copie les fichiers de `native/android/` (`AppBlockerModule.kt`,
`AppBlockerAccessibilityService.kt`, `ShieldActivity.kt`,
`ProximityModule.kt`) dans le dossier généré
`android/app/src/main/java/.../` (adapter le nom de package), déclare les
services/activités et les permissions dans
`android/app/src/main/AndroidManifest.xml` (voir les commentaires en bas
de chaque fichier `.kt`), enregistre `AppBlockerModule` ET
`ProximityModule` dans le `ReactPackage` du projet généré, puis :

```bash
npx expo run:android
```

(Nécessite Android Studio / le SDK Android installés sur ta machine —
absents de cet environnement de développement.)

## Architecture

```
App.tsx                        point d'entrée, monte RootNavigator
src/
  firebase/config.ts           connexion Firebase (Auth + Firestore)
  models/types.ts              types partagés (User, Relationship, PresenceSession, Companion, ...)
  services/
    auth.ts                    inscription / connexion / profil
    relationships.ts           inviter un proche / rejoindre par code
    presence.ts                démarrer/terminer une session, calcul des Moments
    momentsEconomy.ts          fonctions pures de calcul (à équilibrer plus tard)
    companion.ts                compagnon + boutique de cosmétiques
    appBlocking.ts             abstraction JS du blocage natif
    proximity.ts               abstraction JS de la détection BLE
    socialApps.ts               catalogue des réseaux à défilement infini
  hooks/useAuth.ts             état de connexion + profil en temps réel
  screens/                     Auth, Home, Friends, Presence, Shop
  navigation/RootNavigator.tsx
native/
  android/
    AppBlockerModule.kt          UsageStats + Accessibility + overlay
    AppBlockerAccessibilityService.kt   détecte l'app au premier plan
    ShieldActivity.kt            écran affiché par-dessus une app bloquée
    ProximityModule.kt           annonce/scan BLE pour détecter un proche
  ios/                     module Swift (Screen Time) — référence pour plus tard
firestore.rules                règles de sécurité à publier sur Firebase
```

## Modèle de données (Firestore)

Voir `src/models/types.ts` pour le détail des champs. Collections :
`users`, `relationships`, `presenceSessions`, `companions`, `inventory/{uid}/items`, `memories` (souvenirs — pas encore branchés dans l'UI du MVP).

## Périmètre du MVP actuel

✅ Inscription/connexion · choix de l'animal du compagnon (8 espèces,
modifiable à tout moment) · ajout d'un proche par code d'invitation ·
**détection automatique d'un proche à proximité (BLE, premier plan)** ·
choix des réseaux sociaux à défilement infini à mettre de côté (Android) ·
session Présence avec minuteur, démarrage automatique dès détection (ou
manuel en secours) · calcul et attribution des Moments · personnalisation
basique du compagnon (6 cosmétiques) · historique des sessions par proche
· le compagnon ne régresse jamais.

⏳ Pas encore fait (volontairement, voir le plan de migration) :
détection BLE **en arrière-plan** (nécessite un foreground service, voir
ci-dessous), compagnon commun entre deux personnes, souvenirs avec photo,
notifications, achievements, vraies illustrations pour les espèces (emoji
pour le MVP).

## Détection de proximité : comment ça marche réellement, et ses limites

La détection est faite avec de vraies API Android (`BluetoothLeAdvertiser`
/ `BluetoothLeScanner`, voir `native/android/ProximityModule.kt`), pas une
API inventée. Le principe : quand tu ouvres l'écran Présence avec un
proche, ton téléphone **annonce** (BLE advertising) ton identifiant de
compte, et **scanne** en même temps les annonces des autres téléphones qui
font tourner l'app. Dès que le jeton du proche recherché est capté avec un
signal suffisant, la session démarre automatiquement (blocage des réseaux
inclus).

Limites réelles, assumées volontairement pour ce MVP :

- **Ça ne fonctionne que si l'app est ouverte des deux côtés** (pas de
  service en arrière-plan). Une détection qui marche même app fermée
  demanderait un *foreground service* Android avec une notification
  permanente — plus de complexité, plus de batterie, une permission
  supplémentaire (`FOREGROUND_SERVICE`) — volontairement pas fait tant que
  la détection au premier plan n'est pas validée sur de vrais appareils.
- **Sur Android < 12**, le scan BLE exige en plus la permission de
  localisation (contrainte du système, indépendante de notre usage réel :
  on ne lit jamais la position GPS). Sur Android 12+, on déclare
  `BLUETOOTH_SCAN` avec `neverForLocation`, donc pas besoin de cette
  permission.
- Le RSSI (intensité du signal Bluetooth) est un indicateur de distance
  **approximatif** : le seuil `NEARBY_RSSI_THRESHOLD` dans
  `PresenceScreen.tsx` est une valeur de départ à ajuster une fois testée
  sur de vrais téléphones (le signal varie beaucoup selon le modèle et
  l'environnement).
- Certains constructeurs (Xiaomi, Huawei, Samsung...) restreignent le scan
  BLE via leurs réglages d'économie de batterie, même app ouverte.
- Un bouton **"Démarrer quand même"** reste toujours visible : si le
  Bluetooth est indisponible, la permission refusée, ou que l'autre
  personne n'a pas l'app ouverte, la session peut toujours démarrer
  manuellement — le comportement d'origine du MVP reste le filet de
  sécurité.

## Blocage : quels réseaux, et comment

Plutôt que de proposer de bloquer n'importe quelle app installée, l'écran
de sélection (`src/services/socialApps.ts`) ne propose que des réseaux à
défilement infini reconnus (TikTok, Instagram, Facebook, X, Snapchat,
YouTube, Reddit, Pinterest, LinkedIn) — c'est le cœur du produit : mettre
de côté le scroll, pas la calculatrice. Le blocage lui-même reste ce qui
est réellement possible sur Android (voir plus haut) : détection de l'app
au premier plan par un service d'accessibilité +
`AppBlockerAccessibilityService.kt`, écran de rappel par-dessus
(`ShieldActivity.kt`) — jamais un vrai "empêchement" système, Android ne
le permet pas pour une app tierce.

## Économie des Moments (valeurs provisoires)

Dans `src/services/momentsEconomy.ts` — commenté comme temporaire dans le
code, à ajuster une fois testé avec de vrais utilisateurs :

- Moins de 15 min : 0 Moment (évite les sessions symboliques).
- 15-30 min : 20 · 30-60 min : 50 · 1h-2h : 120 · au-delà : bonus dégressif.
- Bonus de régularité par relation : +20 (2ᵉ session de la semaine),
  +60 (3ᵉ), +150 (5ᵉ et au-delà).

## Philosophie produit (à ne jamais perdre de vue en ajoutant une feature)

- Renforcement positif uniquement : le compagnon ne meurt, ne souffre et
  ne culpabilise jamais.
- Jamais de comparaison sociale entre relations ("tu vois plus X que Y").
- Le ton est "quelqu'un que tu apprécies est avec toi", jamais "tu utilises
  trop ton téléphone".
