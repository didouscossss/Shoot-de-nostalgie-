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
import { db } from "../firebase/config";
import type { Companion, CompanionOwnerType, CosmeticItem, InventoryEntry } from "../models/types";

export async function createCompanion(params: {
  ownerType: CompanionOwnerType;
  ownerId: string;
  name?: string;
  species?: string;
}): Promise<Companion> {
  const ref = await addDoc(collection(db, "companions"), {
    ownerType: params.ownerType,
    ownerId: params.ownerId,
    name: params.name ?? "Mon compagnon",
    species: params.species ?? "poussin-lumineux",
    totalPresenceSeconds: 0,
    equippedCosmetics: {},
    createdAt: new Date().toISOString(),
  });
  const snap = await getDoc(ref);
  return { id: ref.id, ...(snap.data() as Omit<Companion, "id">) };
}

export function subscribeToCompanion(companionId: string, callback: (companion: Companion | null) => void) {
  return onSnapshot(doc(db, "companions", companionId), (snap) => {
    callback(snap.exists() ? ({ id: snap.id, ...(snap.data() as Omit<Companion, "id">) }) : null);
  });
}

export async function addPresenceSecondsToCompanion(companionId: string, seconds: number) {
  await updateDoc(doc(db, "companions", companionId), {
    totalPresenceSeconds: increment(seconds),
  });
}

export async function equipCosmetic(companionId: string, slot: string, cosmeticItemId: string) {
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
  return onSnapshot(collection(db, "inventory", uid, "items"), (snap) => {
    callback(snap.docs.map((d) => d.data() as InventoryEntry));
  });
}
