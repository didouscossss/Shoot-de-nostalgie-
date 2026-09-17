// ---------------------------------------------------------------------------
// Compagnon virtuel : création, personnalisation, boutique de cosmétiques.
// Le compagnon ne perd jamais rien (pas de "santé", pas de régression) :
// uniquement des gains.
// ---------------------------------------------------------------------------

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  increment,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db, FIREBASE_IS_CONFIGURED } from "../firebase/config";
import * as demo from "./demoBackend";
import { SPECIES_UNSELECTED } from "../models/types";
import type { Companion, CompanionOwnerType, CosmeticItem, InventoryEntry } from "../models/types";

export { SPECIES_UNSELECTED };

export interface SpeciesOption {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
}

// Pas de vrais assets illustrés pour le MVP : un emoji représente chaque
// espèce, comme pour les cosmétiques. Facile à remplacer par de vraies
// illustrations plus tard sans toucher au modèle de données (species reste
// un simple identifiant string).
export const SPECIES_CATALOG: SpeciesOption[] = [
  { id: "renard", name: "Renard", emoji: "🦊", tagline: "Curieux et fidèle" },
  { id: "chat", name: "Chat", emoji: "🐱", tagline: "Calme et attachant" },
  { id: "chien", name: "Chien", emoji: "🐶", tagline: "Joyeux et loyal" },
  { id: "lapin", name: "Lapin", emoji: "🐰", tagline: "Doux et discret" },
  { id: "panda", name: "Panda", emoji: "🐼", tagline: "Tranquille et câlin" },
  { id: "poussin", name: "Poussin", emoji: "🐥", tagline: "Léger et plein de vie" },
  { id: "hibou", name: "Hibou", emoji: "🦉", tagline: "Sage et observateur" },
  { id: "dragon", name: "Petit dragon", emoji: "🐲", tagline: "Rare et malicieux" },
];

export function getSpeciesOption(speciesId: string): SpeciesOption | undefined {
  return SPECIES_CATALOG.find((s) => s.id === speciesId);
}

export async function createCompanion(params: {
  ownerType: CompanionOwnerType;
  ownerId: string;
  name?: string;
  species?: string;
}): Promise<Companion> {
  if (!FIREBASE_IS_CONFIGURED) return demo.createCompanionDemo(params);
  const ref = await addDoc(collection(db, "companions"), {
    ownerType: params.ownerType,
    ownerId: params.ownerId,
    name: params.name ?? "Mon compagnon",
    species: params.species ?? SPECIES_UNSELECTED,
    totalPresenceSeconds: 0,
    equippedCosmetics: {},
    createdAt: new Date().toISOString(),
  });
  const snap = await getDoc(ref);
  return { id: ref.id, ...(snap.data() as Omit<Companion, "id">) };
}

export async function chooseCompanionSpecies(companionId: string, speciesId: string, name?: string) {
  if (!FIREBASE_IS_CONFIGURED) return demo.chooseCompanionSpeciesDemo(companionId, speciesId, name);
  const updates: Record<string, string> = { species: speciesId };
  if (name && name.trim()) updates.name = name.trim();
  await updateDoc(doc(db, "companions", companionId), updates);
}

export function subscribeToCompanion(companionId: string, callback: (companion: Companion | null) => void) {
  if (!FIREBASE_IS_CONFIGURED) return demo.subscribeToCompanionDemo(companionId, callback);
  return onSnapshot(doc(db, "companions", companionId), (snap) => {
    callback(snap.exists() ? ({ id: snap.id, ...(snap.data() as Omit<Companion, "id">) }) : null);
  });
}

export async function addPresenceSecondsToCompanion(companionId: string, seconds: number) {
  if (!FIREBASE_IS_CONFIGURED) return demo.addPresenceSecondsDemo(companionId, seconds);
  await updateDoc(doc(db, "companions", companionId), {
    totalPresenceSeconds: increment(seconds),
  });
}

export async function equipCosmetic(companionId: string, slot: string, cosmeticItemId: string) {
  if (!FIREBASE_IS_CONFIGURED) return demo.equipCosmeticDemo(companionId, slot, cosmeticItemId);
  await updateDoc(doc(db, "companions", companionId), {
    [`equippedCosmetics.${slot}`]: cosmeticItemId,
  });
}

// --- Boutique -------------------------------------------------------------

export function subscribeToShopCatalog(callback: (items: CosmeticItem[]) => void) {
  // Catalogue statique pour le MVP (peu d'objets) : pas besoin d'une vraie
  // collection Firestore tant que le catalogue ne change pas dynamiquement.
  callback(STARTER_CATALOG);
  return () => {};
}

export const STARTER_CATALOG: CosmeticItem[] = [
  { id: "hat-cap", name: "Casquette", slot: "hat", rarity: "normale", price: 50, assetRef: "hat-cap" },
  { id: "hat-flower", name: "Couronne de fleurs", slot: "hat", rarity: "rare", price: 150, assetRef: "hat-flower" },
  { id: "glasses-round", name: "Lunettes rondes", slot: "glasses", rarity: "normale", price: 50, assetRef: "glasses-round" },
  { id: "color-sunset", name: "Couleur coucher de soleil", slot: "color", rarity: "rare", price: 120, assetRef: "color-sunset" },
  { id: "outfit-scarf", name: "Écharpe", slot: "outfit", rarity: "normale", price: 60, assetRef: "outfit-scarf" },
  { id: "accessory-star", name: "Étoile scintillante", slot: "accessory", rarity: "epique", price: 300, assetRef: "accessory-star" },
];

export async function purchaseCosmetic(uid: string, item: CosmeticItem, currentBalance: number) {
  if (!FIREBASE_IS_CONFIGURED) return demo.purchaseCosmeticDemo(uid, item, currentBalance);
  if (currentBalance < item.price) {
    throw new Error("insufficient-moments");
  }
  const entryRef = doc(db, "inventory", uid, "items", item.id);
  const entry: InventoryEntry = {
    cosmeticItemId: item.id,
    acquiredAt: new Date().toISOString(),
    source: "purchase",
  };
  await setDoc(entryRef, entry);
  await updateDoc(doc(db, "users", uid), {
    momentsBalance: increment(-item.price),
  });
}

export function subscribeToInventory(uid: string, callback: (entries: InventoryEntry[]) => void) {
  if (!FIREBASE_IS_CONFIGURED) return demo.subscribeToInventoryDemo(uid, callback);
  return onSnapshot(collection(db, "inventory", uid, "items"), (snap) => {
    callback(snap.docs.map((d) => d.data() as InventoryEntry));
  });
}
