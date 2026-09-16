// ---------------------------------------------------------------------------
// Comptes utilisateurs (Firebase Auth + Firestore).
//
// Tant que firebase-config.js contient encore les valeurs placeholder,
// FIREBASE_IS_CONFIGURED vaut false : l'appli reste alors en mode "invité"
// (progression locale au navigateur, boosters illimités, comme avant les
// comptes) et n'affiche pas les boutons de connexion/boutique. Dès que la
// config Firebase est renseignée, les comptes s'activent automatiquement.
//
// Économie (100% virtuelle, aucun lien avec de l'argent réel) :
//   - Nouveau compte : 10 boosters offerts + 600 pièces Leonida.
//   - +1 booster offert chaque semaine, réclamable dès le lundi 7h (heure
//     locale du joueur) et jusqu'au lundi suivant.
//   - Boutique : dépenser des pièces contre des boosters supplémentaires.
// ---------------------------------------------------------------------------

const STARTING_BOOSTERS = 10;
const STARTING_COINS = 600;

const Account = {
  enabled: typeof FIREBASE_IS_CONFIGURED !== "undefined" && FIREBASE_IS_CONFIGURED,
  user: null,
  data: null,
  ready: false,
  _listeners: [],
  _unsubDoc: null,
};

function _notify() {
  Account._listeners.forEach((cb) => {
    try {
      cb(Account);
    } catch (e) {
      console.error(e);
    }
  });
}

Account.onChange = function (callback) {
  Account._listeners.push(callback);
  if (Account.ready) callback(Account);
};

function _localCollectionForMigration() {
  try {
    const raw = localStorage.getItem("gta6-boosters-collection-v1");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function _mostRecentMondaySevenAM(now) {
  const d = new Date(now);
  const day = d.getDay(); // 0 = dimanche, 1 = lundi, ...
  const diffToMonday = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diffToMonday);
  d.setHours(7, 0, 0, 0);
  if (d.getTime() > now.getTime()) {
    d.setDate(d.getDate() - 7);
  }
  return d;
}

Account.isWeeklyClaimAvailable = function () {
  if (!Account.data) return false;
  const threshold = _mostRecentMondaySevenAM(new Date());
  const last = Account.data.lastWeeklyClaim ? new Date(Account.data.lastWeeklyClaim) : null;
  return !last || last.getTime() < threshold.getTime();
};

Account.claimWeekly = async function () {
  if (!Account.isWeeklyClaimAvailable()) return false;
  await Account.saveData({
    boosterCount: (Account.data.boosterCount || 0) + 1,
    lastWeeklyClaim: new Date().toISOString(),
  });
  return true;
};

Account.saveData = async function (partial) {
  if (!Account.user) return;
  Account.data = { ...Account.data, ...partial };
  _notify();
  await firebase.firestore().collection("users").doc(Account.user.uid).set(partial, { merge: true });
};

Account.signUp = async function (email, password) {
  const cred = await firebase.auth().createUserWithEmailAndPassword(email, password);
  const initialCollection = _localCollectionForMigration();
  await firebase.firestore().collection("users").doc(cred.user.uid).set({
    email,
    createdAt: new Date().toISOString(),
    boosterCount: STARTING_BOOSTERS,
    coins: STARTING_COINS,
    lastWeeklyClaim: null,
    collection: initialCollection,
  });
  return cred.user;
};

Account.logIn = function (email, password) {
  return firebase.auth().signInWithEmailAndPassword(email, password);
};

Account.logOut = function () {
  return firebase.auth().signOut();
};

if (Account.enabled) {
  firebase.initializeApp(FIREBASE_CONFIG);

  firebase.auth().onAuthStateChanged((user) => {
    if (Account._unsubDoc) {
      Account._unsubDoc();
      Account._unsubDoc = null;
    }

    Account.user = user;

    if (!user) {
      Account.data = null;
      Account.ready = true;
      _notify();
      return;
    }

    Account._unsubDoc = firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .onSnapshot((snap) => {
        Account.data = snap.data() || null;
        Account.ready = true;
        _notify();
      });
  });
} else {
  Account.ready = true;
}
