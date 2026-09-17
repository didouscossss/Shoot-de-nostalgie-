// ---------------------------------------------------------------------------
// Mode démo : tant que Firebase n'est pas configuré (voir
// src/firebase/config.ts, FIREBASE_IS_CONFIGURED), toute l'app tourne en
// mémoire (aucun réseau, aucun compte réel) pour qu'on puisse essayer le
// vrai parcours sans créer de projet Firebase au préalable. Chaque service
// (auth, companion, relationships, presence) bascule ici automatiquement ;
// dès qu'un vrai projet Firebase est renseigné, ce fichier n'est plus
// jamais utilisé.
//
// Une "amie de démo" (Léa) est créée automatiquement à l'inscription, avec
// une relation déjà active et une session passée, pour que Mes proches /
// Historique aient tout de suite du contenu réel à explorer.
// ---------------------------------------------------------------------------

import { SPECIES_UNSELECTED } from "../models/types";
import { computeTotalMomentsEarned } from "./momentsEconomy";
import type { UserProfile, Relationship, PresenceSession, Companion, InventoryEntry } from "../models/types";

type Unsubscribe = () => void;

function makeStore<T>() {
  const items = new Map<string, T>();
  const listeners = new Set<() => void>();
  function notify() {
    listeners.forEach((l) => l());
  }
  return {
    set(key: string, value: T) {
      items.set(key, value);
      notify();
    },
    patch(key: string, patch: Partial<T>) {
      const current = items.get(key);
      if (current) {
        items.set(key, { ...current, ...patch });
        notify();
      }
    },
    get(key: string): T | undefined {
      return items.get(key);
    },
    values(): T[] {
      return Array.from(items.values());
    },
    subscribeToOne(key: string, callback: (value: T | null) => void): Unsubscribe {
      const fire = () => callback(items.get(key) ?? null);
      fire();
      listeners.add(fire);
      return () => listeners.delete(fire);
    },
    subscribeToMany(predicate: (value: T) => boolean, callback: (values: T[]) => void): Unsubscribe {
      const fire = () => callback(Array.from(items.values()).filter(predicate));
      fire();
      listeners.add(fire);
      return () => listeners.delete(fire);
    },
  };
}

const users = makeStore<UserProfile>();
const companions = makeStore<Companion>();
const relationships = makeStore<Relationship>();
const sessions = makeStore<PresenceSession>();
const inventoryItems = new Map<string, InventoryEntry>(); // clé `${uid}:${cosmeticItemId}`
const inventoryListeners = new Set<() => void>();

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

// --- Auth ("session" courante, sans mot de passe réel) ---------------------

type AuthListener = (uid: string | null) => void;
let currentUid: string | null = null;
const authListeners = new Set<AuthListener>();

function setCurrentUid(uid: string | null) {
  currentUid = uid;
  authListeners.forEach((l) => l(uid));
}

export function subscribeToAuthStateDemo(callback: AuthListener): Unsubscribe {
  callback(currentUid);
  authListeners.add(callback);
  return () => authListeners.delete(callback);
}

export function subscribeToUserProfileDemo(uid: string, callback: (profile: UserProfile | null) => void) {
  return users.subscribeToOne(uid, callback);
}

export function getUserProfileOnceDemo(uid: string): UserProfile | null {
  return users.get(uid) ?? null;
}

function seedDemoFriend(newUid: string) {
  const friendUid = "demo-lea";
  if (!users.get(friendUid)) {
    const friendCompanionId = "demo-lea-companion";
    companions.set(friendCompanionId, {
      id: friendCompanionId,
      ownerType: "user",
      ownerId: friendUid,
      name: "Mimi",
      species: "chat",
      totalPresenceSeconds: 4800,
      equippedCosmetics: { hat: "hat-flower" },
      createdAt: new Date().toISOString(),
    });
    users.set(friendUid, {
      uid: friendUid,
      displayName: "Léa",
      email: "lea@demo.presence",
      createdAt: new Date().toISOString(),
      companionId: friendCompanionId,
      momentsBalance: 90,
      distractingApps: [],
    });
  }

  const relationshipId = `demo-rel-${newUid}`;
  relationships.set(relationshipId, {
    id: relationshipId,
    memberUids: [newUid, friendUid],
    status: "active",
    sharedCompanionId: null,
    createdAt: new Date().toISOString(),
    inviteCode: "DEMO01",
  });

  const past = new Date(Date.now() - 3 * 24 * 3600 * 1000);
  const pastEnd = new Date(past.getTime() + 50 * 60 * 1000);
  const pastSessionId = nextId("session");
  sessions.set(pastSessionId, {
    id: pastSessionId,
    relationshipId,
    participantUids: [newUid, friendUid],
    startedAt: past.toISOString(),
    endedAt: pastEnd.toISOString(),
    durationSeconds: 50 * 60,
    detectionMethod: "manual",
    momentsEarned: 50,
  });
}

export function signUpDemo(email: string, displayName: string): { uid: string } {
  const uid = nextId("user");
  const companionId = nextId("companion");
  companions.set(companionId, {
    id: companionId,
    ownerType: "user",
    ownerId: uid,
    name: "Mon compagnon",
    species: SPECIES_UNSELECTED,
    totalPresenceSeconds: 0,
    equippedCosmetics: {},
    createdAt: new Date().toISOString(),
  });
  users.set(uid, {
    uid,
    displayName: displayName || "Moi",
    email,
    createdAt: new Date().toISOString(),
    companionId,
    momentsBalance: 0,
    distractingApps: [],
  });
  seedDemoFriend(uid);
  setCurrentUid(uid);
  return { uid };
}

export function logInDemo(email: string): { uid: string } {
  const existing = users.values().find((u) => u.email === email && u.uid !== "demo-lea");
  if (!existing) {
    throw new Error("user-not-found");
  }
  setCurrentUid(existing.uid);
  return { uid: existing.uid };
}

export function logOutDemo() {
  setCurrentUid(null);
}

export function updateDistractingAppsDemo(uid: string, apps: string[]) {
  users.patch(uid, { distractingApps: apps });
}

// --- Compagnon ---------------------------------------------------------

export function createCompanionDemo(params: {
  ownerType: Companion["ownerType"];
  ownerId: string;
  name?: string;
  species?: string;
}): Companion {
  const id = nextId("companion");
  const companion: Companion = {
    id,
    ownerType: params.ownerType,
    ownerId: params.ownerId,
    name: params.name ?? "Mon compagnon",
    species: params.species ?? SPECIES_UNSELECTED,
    totalPresenceSeconds: 0,
    equippedCosmetics: {},
    createdAt: new Date().toISOString(),
  };
  companions.set(id, companion);
  return companion;
}

export function subscribeToCompanionDemo(companionId: string, callback: (companion: Companion | null) => void) {
  return companions.subscribeToOne(companionId, callback);
}

export function addPresenceSecondsDemo(companionId: string, seconds: number) {
  const current = companions.get(companionId);
  if (current) companions.patch(companionId, { totalPresenceSeconds: current.totalPresenceSeconds + seconds });
}

export function equipCosmeticDemo(companionId: string, slot: string, cosmeticItemId: string) {
  const current = companions.get(companionId);
  if (current) {
    companions.patch(companionId, { equippedCosmetics: { ...current.equippedCosmetics, [slot]: cosmeticItemId } });
  }
}

export function chooseCompanionSpeciesDemo(companionId: string, speciesId: string, name?: string) {
  const patch: Partial<Companion> = { species: speciesId };
  if (name && name.trim()) patch.name = name.trim();
  companions.patch(companionId, patch);
}

// --- Boutique ------------------------------------------------------------

export function purchaseCosmeticDemo(uid: string, item: { id: string; price: number }, currentBalance: number) {
  if (currentBalance < item.price) {
    throw new Error("insufficient-moments");
  }
  inventoryItems.set(`${uid}:${item.id}`, {
    cosmeticItemId: item.id,
    acquiredAt: new Date().toISOString(),
    source: "purchase",
  });
  inventoryListeners.forEach((l) => l());
  const profile = users.get(uid);
  if (profile) users.patch(uid, { momentsBalance: profile.momentsBalance - item.price });
}

export function subscribeToInventoryDemo(uid: string, callback: (entries: InventoryEntry[]) => void): Unsubscribe {
  const fire = () => {
    const entries = Array.from(inventoryItems.entries())
      .filter(([key]) => key.startsWith(`${uid}:`))
      .map(([, value]) => value);
    callback(entries);
  };
  fire();
  inventoryListeners.add(fire);
  return () => inventoryListeners.delete(fire);
}

// --- Relations -------------------------------------------------------------

function nextInviteCode(): string {
  return `DEMO${Math.floor(10 + Math.random() * 89)}`;
}

export function createRelationshipInviteDemo(uid: string): Relationship {
  const id = nextId("relationship");
  const rel: Relationship = {
    id,
    memberUids: [uid],
    status: "pending",
    sharedCompanionId: null,
    createdAt: new Date().toISOString(),
    inviteCode: nextInviteCode(),
  };
  relationships.set(id, rel);
  return rel;
}

export function joinRelationshipByCodeDemo(uid: string, inviteCode: string): Relationship {
  const pending = relationships.values().find((r) => r.inviteCode === inviteCode.toUpperCase() && r.status === "pending");
  if (!pending) throw new Error("invite-not-found");
  if (pending.memberUids.includes(uid)) throw new Error("cannot-join-own-invite");
  const updatedMembers = [...pending.memberUids, uid];
  relationships.patch(pending.id, { memberUids: updatedMembers, status: "active" });
  return { ...pending, memberUids: updatedMembers, status: "active" };
}

export function subscribeToMyRelationshipsDemo(uid: string, callback: (relationships: Relationship[]) => void) {
  return relationships.subscribeToMany((r) => r.memberUids.includes(uid), callback);
}

// --- Sessions Présence -----------------------------------------------------

function startOfWeekDemo(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diffToMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function startPresenceSessionDemo(relationshipId: string, participantUids: string[]): PresenceSession {
  const id = nextId("session");
  const session: PresenceSession = {
    id,
    relationshipId,
    participantUids,
    startedAt: new Date().toISOString(),
    endedAt: null,
    durationSeconds: null,
    detectionMethod: "manual",
    momentsEarned: null,
  };
  sessions.set(id, session);
  return session;
}

export function endPresenceSessionDemo(session: PresenceSession): { durationSeconds: number; momentsEarned: number } {
  const endedAt = new Date();
  const startedAt = new Date(session.startedAt);
  const durationSeconds = Math.max(0, Math.round((endedAt.getTime() - startedAt.getTime()) / 1000));

  const weekStart = startOfWeekDemo(startedAt).toISOString();
  const sessionsBefore = sessions
    .values()
    .filter((s) => s.relationshipId === session.relationshipId && s.startedAt >= weekStart).length;
  const momentsEarned = computeTotalMomentsEarned(durationSeconds, Math.max(0, sessionsBefore - 1));

  sessions.patch(session.id, { endedAt: endedAt.toISOString(), durationSeconds, momentsEarned });

  session.participantUids.forEach((uid) => {
    const profile = users.get(uid);
    if (profile) {
      users.patch(uid, { momentsBalance: profile.momentsBalance + momentsEarned });
      addPresenceSecondsDemo(profile.companionId, durationSeconds);
    }
  });

  return { durationSeconds, momentsEarned };
}

export function subscribeToSessionHistoryDemo(relationshipId: string, callback: (sessions: PresenceSession[]) => void) {
  return sessions.subscribeToMany(
    (s) => s.relationshipId === relationshipId,
    (list) => callback([...list].sort((a, b) => b.startedAt.localeCompare(a.startedAt)))
  );
}
