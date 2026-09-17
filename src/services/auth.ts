// ---------------------------------------------------------------------------
// Compte utilisateur : inscription, connexion, déconnexion, profil Firestore.
// ---------------------------------------------------------------------------

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { auth, db, FIREBASE_IS_CONFIGURED } from "../firebase/config";
import * as demo from "./demoBackend";
import { createCompanion } from "./companion";
import type { UserProfile } from "../models/types";

export const STARTING_MOMENTS = 0; // on démarre à zéro : les Moments se gagnent en vivant l'app, pas offerts

export function subscribeToAuthState(callback: (user: User | null) => void) {
  if (!FIREBASE_IS_CONFIGURED) {
    return demo.subscribeToAuthStateDemo((uid) => callback(uid ? ({ uid } as unknown as User) : null));
  }
  return onAuthStateChanged(auth, callback);
}

export function subscribeToUserProfile(uid: string, callback: (profile: UserProfile | null) => void) {
  if (!FIREBASE_IS_CONFIGURED) return demo.subscribeToUserProfileDemo(uid, callback);
  return onSnapshot(doc(db, "users", uid), (snap) => {
    callback((snap.data() as UserProfile) ?? null);
  });
}

export async function getUserProfileOnce(uid: string): Promise<UserProfile | null> {
  if (!FIREBASE_IS_CONFIGURED) return demo.getUserProfileOnceDemo(uid);
  const snap = await getDoc(doc(db, "users", uid));
  return (snap.data() as UserProfile) ?? null;
}

export async function updateDistractingApps(uid: string, apps: string[]) {
  if (!FIREBASE_IS_CONFIGURED) return demo.updateDistractingAppsDemo(uid, apps);
  await updateDoc(doc(db, "users", uid), { distractingApps: apps });
}

export async function signUp(email: string, password: string, displayName: string) {
  if (!FIREBASE_IS_CONFIGURED) {
    const { uid } = demo.signUpDemo(email, displayName);
    return { uid } as unknown as User;
  }

  const cred = await createUserWithEmailAndPassword(auth, email, password);

  // Chaque compte a son compagnon personnel dès la création.
  const companion = await createCompanion({ ownerType: "user", ownerId: cred.user.uid });

  const profile: UserProfile = {
    uid: cred.user.uid,
    displayName,
    email,
    createdAt: new Date().toISOString(),
    companionId: companion.id,
    momentsBalance: STARTING_MOMENTS,
    distractingApps: [],
  };

  await setDoc(doc(db, "users", cred.user.uid), profile);
  return cred.user;
}

export function logIn(email: string, password: string) {
  if (!FIREBASE_IS_CONFIGURED) {
    const { uid } = demo.logInDemo(email);
    return Promise.resolve({ uid } as unknown as User);
  }
  return signInWithEmailAndPassword(auth, email, password);
}

export function logOut() {
  if (!FIREBASE_IS_CONFIGURED) {
    demo.logOutDemo();
    return Promise.resolve();
  }
  return firebaseSignOut(auth);
}

export function authErrorMessage(err: unknown): string {
  const code = (err as { code?: string })?.code ?? "";
  const map: Record<string, string> = {
    "auth/email-already-in-use": "Un compte existe déjà avec cet email.",
    "auth/invalid-email": "Adresse email invalide.",
    "auth/weak-password": "Mot de passe trop court (6 caractères minimum).",
    "auth/user-not-found": "Aucun compte avec cet email.",
    "auth/wrong-password": "Mot de passe incorrect.",
    "auth/invalid-credential": "Email ou mot de passe incorrect.",
  };
  return map[code] ?? "Une erreur est survenue, réessaie.";
}

// serverTimestamp ré-exporté pour les autres services qui en ont besoin.
export { serverTimestamp };
