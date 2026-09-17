// ---------------------------------------------------------------------------
// Configuration Firebase — À REMPLACER par les vraies clés de TON projet
// (voir README.md pour la marche à suivre pas à pas).
//
// Persistance de l'auth : sur React Native, Firebase Auth a besoin qu'on lui
// fournisse explicitement un stockage persistant (AsyncStorage), sinon la
// session ne survit pas au redémarrage de l'app.
// ---------------------------------------------------------------------------

import { initializeApp, getApps, getApp } from "firebase/app";
// @ts-expect-error — getReactNativePersistence existe bien dans le build React
// Native de @firebase/auth (résolu par Metro via la condition "react-native"
// du package.json), mais le package "firebase" qui l'enveloppe ne déclare pas
// cette condition dans SON propre export map, donc `tsc` seul (sans Metro) ne
// le voit pas. C'est un faux positif de vérification de type, pas un bug —
// fonctionne correctement une fois bundlé par Metro.
import { initializeAuth, getReactNativePersistence, getAuth, type Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const FIREBASE_CONFIG = {
  apiKey: "REMPLACE_MOI",
  authDomain: "REMPLACE_MOI.firebaseapp.com",
  projectId: "REMPLACE_MOI",
  storageBucket: "REMPLACE_MOI.appspot.com",
  messagingSenderId: "REMPLACE_MOI",
  appId: "REMPLACE_MOI",
};

export const FIREBASE_IS_CONFIGURED = FIREBASE_CONFIG.apiKey !== "REMPLACE_MOI";

const app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);

let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  // initializeAuth ne peut être appelé qu'une fois : utile en Fast Refresh,
  // où ce module est ré-évalué sans redémarrer l'app — on récupère alors
  // l'instance déjà créée au lieu d'en recréer une.
  auth = getAuth(app);
}

export const db = getFirestore(app);
export { auth };
