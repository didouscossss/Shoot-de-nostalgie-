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

Puis copie les fichiers de `native/android/` dans le dossier généré
`android/app/src/main/java/.../` (adapter le nom de package), déclare le
service et les permissions dans `android/app/src/main/AndroidManifest.xml`
(voir les commentaires en bas de `AppBlockerModule.kt` et
`AppBlockerAccessibilityService.kt`), puis :

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
    appBlocking.ts             abstraction JS des modules natifs
  hooks/useAuth.ts             état de connexion + profil en temps réel
  screens/                     Auth, Home, Friends, Presence, Shop
  navigation/RootNavigator.tsx
native/
  android/                     module Kotlin (UsageStats + Accessibility + overlay)
  ios/                         module Swift (Screen Time) — référence pour plus tard
firestore.rules                règles de sécurité à publier sur Firebase
```

## Modèle de données (Firestore)

Voir `src/models/types.ts` pour le détail des champs. Collections :
`users`, `relationships`, `presenceSessions`, `companions`, `inventory/{uid}/items`, `memories` (souvenirs — pas encore branchés dans l'UI du MVP).

## Périmètre du MVP actuel

✅ Inscription/connexion · ajout d'un proche par code d'invitation ·
choix des apps distrayantes (Android) · session Présence manuelle avec
minuteur · calcul et attribution des Moments · personnalisation basique
du compagnon (6 cosmétiques) · le compagnon ne régresse jamais.

⏳ Pas encore fait (volontairement, voir le plan de migration) :
détection automatique par Bluetooth, compagnon commun entre deux
personnes, souvenirs avec photo, historique détaillé des sessions,
notifications, achievements.

## Détection de proximité : pourquoi manuelle pour l'instant

Le déclenchement d'une session est **manuel** (les deux personnes
confirment explicitement), plutôt qu'une détection Bluetooth automatique
en arrière-plan. Raison : le BLE en arrière-plan est peu fiable de façon
inégale selon les appareils (agressif "battery saving" sur beaucoup
d'Android — Xiaomi, Huawei, Samsung tuent les services en fond), et
demanderait une permission de localisation en arrière-plan intrusive pour
un gain de fiabilité incertain. Une détection automatique reste un sujet
à explorer une fois la boucle centrale (présence manuelle → Moments →
compagnon) validée avec de vrais utilisateurs.

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
