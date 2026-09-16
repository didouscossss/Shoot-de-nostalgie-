// ---------------------------------------------------------------------------
// Configuration Firebase — À REMPLACER par les vraies clés de TON projet.
//
// Comment les obtenir (voir aussi README.md pour le détail complet) :
//   1. https://console.firebase.google.com → Créer un projet
//   2. Ajouter une application Web (icône </>)
//   3. Copier l'objet "firebaseConfig" qui s'affiche et le coller ci-dessous
//   4. Activer Authentication → Sign-in method → Email/Password
//   5. Créer une base Firestore (mode production) et coller les règles du
//      README dans Firestore → Règles
//
// Tant que ces valeurs sont encore les placeholders ci-dessous, l'appli
// affiche un message "configuration requise" au lieu du formulaire de
// connexion (voir auth.js).
// ---------------------------------------------------------------------------

const FIREBASE_CONFIG = {
  apiKey: "REMPLACE_MOI",
  authDomain: "REMPLACE_MOI.firebaseapp.com",
  projectId: "REMPLACE_MOI",
  storageBucket: "REMPLACE_MOI.appspot.com",
  messagingSenderId: "REMPLACE_MOI",
  appId: "REMPLACE_MOI",
};

const FIREBASE_IS_CONFIGURED = FIREBASE_CONFIG.apiKey !== "REMPLACE_MOI";
