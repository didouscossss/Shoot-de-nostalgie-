// ---------------------------------------------------------------------------
// Modèles de données (miroir des collections Firestore décrites dans le
// README). Types partagés par les écrans et les services.
// ---------------------------------------------------------------------------

export type CosmeticSlot = "hat" | "glasses" | "outfit" | "color" | "accessory";

// Tant que ce sentinel est en place, l'app considère que le compagnon n'a
// pas encore d'animal choisi et redirige vers l'écran de choix. Défini ici
// (plutôt que dans companion.ts) pour que demoBackend.ts puisse le réutiliser
// sans import circulaire.
export const SPECIES_UNSELECTED = "non-choisi";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  createdAt: string; // ISO
  companionId: string;
  momentsBalance: number;
  /**
   * Identifiants d'apps à restreindre pendant une session Présence.
   * iOS : jetons opaques renvoyés par FamilyActivityPicker (on ne connaît
   * jamais le nom réel de l'app, par design de confidentialité d'Apple).
   * Android : noms de paquets (ex: "com.zhiliaoapp.musically" pour TikTok).
   */
  distractingApps: string[];
}

export type RelationshipStatus = "pending" | "active";

export interface Relationship {
  id: string;
  /** Un seul uid tant que la relation est "pending" (en attente que l'autre rejoigne), deux une fois "active". */
  memberUids: string[];
  status: RelationshipStatus;
  sharedCompanionId: string | null;
  createdAt: string;
  /** Code court à partager pour que l'autre personne rejoigne la relation. */
  inviteCode: string;
}

export type DetectionMethod = "manual" | "ble";

export interface PresenceSession {
  id: string;
  relationshipId: string;
  participantUids: string[];
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
  detectionMethod: DetectionMethod;
  momentsEarned: number | null;
}

export type CompanionOwnerType = "user" | "relationship";

export interface Companion {
  id: string;
  ownerType: CompanionOwnerType;
  ownerId: string; // uid ou relationshipId
  name: string;
  species: string;
  totalPresenceSeconds: number; // cumul, sert de "niveau"
  equippedCosmetics: Partial<Record<CosmeticSlot, string>>; // slot -> cosmeticItemId
  createdAt: string;
}

export interface CosmeticItem {
  id: string;
  name: string;
  slot: CosmeticSlot;
  rarity: "normale" | "rare" | "epique" | "legendaire";
  price: number; // en Moments
  assetRef: string;
}

export interface InventoryEntry {
  cosmeticItemId: string;
  acquiredAt: string;
  source: "purchase" | "achievement" | "starter";
}

export interface Memory {
  id: string;
  presenceSessionId: string;
  relationshipId: string;
  photoUrl?: string;
  note?: string;
  location?: string; // uniquement si partagé explicitement par les deux
  createdAt: string;
}

export interface Achievement {
  id: string;
  unlockedAt: string;
}
