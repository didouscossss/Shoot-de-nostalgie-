// ---------------------------------------------------------------------------
// Relations entre deux personnes : création d'une invitation, ajout d'un
// proche via un code, écoute de mes relations actives.
// ---------------------------------------------------------------------------

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db, FIREBASE_IS_CONFIGURED } from "../firebase/config";
import * as demo from "./demoBackend";
import type { Relationship } from "../models/types";

function generateInviteCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // sans caractères ambigus (0/O, 1/I)
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

/** Crée une invitation en attente : l'autre personne la rejoint avec le code. */
export async function createRelationshipInvite(uid: string): Promise<Relationship> {
  if (!FIREBASE_IS_CONFIGURED) return demo.createRelationshipInviteDemo(uid);
  const inviteCode = generateInviteCode();
  const ref = await addDoc(collection(db, "relationships"), {
    memberUids: [uid],
    status: "pending",
    sharedCompanionId: null,
    createdAt: new Date().toISOString(),
    inviteCode,
  });
  return {
    id: ref.id,
    memberUids: [uid],
    status: "pending",
    sharedCompanionId: null,
    createdAt: new Date().toISOString(),
    inviteCode,
  };
}

/** Rejoint une relation en attente grâce à son code d'invitation. */
export async function joinRelationshipByCode(uid: string, inviteCode: string): Promise<Relationship> {
  if (!FIREBASE_IS_CONFIGURED) return demo.joinRelationshipByCodeDemo(uid, inviteCode);
  const q = query(
    collection(db, "relationships"),
    where("inviteCode", "==", inviteCode.toUpperCase()),
    where("status", "==", "pending")
  );
  const snap = await getDocs(q);
  if (snap.empty) {
    throw new Error("invite-not-found");
  }
  const relDoc = snap.docs[0];
  const rel = relDoc.data() as Omit<Relationship, "id">;

  if (rel.memberUids.includes(uid)) {
    throw new Error("cannot-join-own-invite");
  }

  const updatedMembers = [...rel.memberUids, uid];
  await updateDoc(doc(db, "relationships", relDoc.id), {
    memberUids: updatedMembers,
    status: "active",
  });

  return { id: relDoc.id, ...rel, memberUids: updatedMembers, status: "active" };
}

/** Écoute en temps réel toutes les relations actives (ou en attente) d'un utilisateur. */
export function subscribeToMyRelationships(uid: string, callback: (relationships: Relationship[]) => void) {
  if (!FIREBASE_IS_CONFIGURED) return demo.subscribeToMyRelationshipsDemo(uid, callback);
  const q = query(collection(db, "relationships"), where("memberUids", "array-contains", uid));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Relationship, "id">) })));
  });
}
