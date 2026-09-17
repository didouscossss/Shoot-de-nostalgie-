// ---------------------------------------------------------------------------
// Sessions Présence : démarrage, fin, calcul des Moments gagnés, mise à jour
// du solde de chaque participant et du temps cumulé de leur compagnon.
//
// Pour le MVP, le déclenchement est MANUEL (les deux personnes confirment
// qu'elles sont ensemble) — voir le README pour la justification technique
// (fiabilité du BLE en arrière-plan très inégale selon les OS/appareils).
// ---------------------------------------------------------------------------

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  onSnapshot,
  increment,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";
import type { DetectionMethod, PresenceSession, UserProfile } from "../models/types";
import { computeTotalMomentsEarned } from "./momentsEconomy";
import { addPresenceSecondsToCompanion } from "./companion";

export async function startPresenceSession(
  relationshipId: string,
  participantUids: string[],
  detectionMethod: DetectionMethod = "manual"
): Promise<PresenceSession> {
  const startedAt = new Date().toISOString();
  const ref = await addDoc(collection(db, "presenceSessions"), {
    relationshipId,
    participantUids,
    startedAt,
    endedAt: null,
    durationSeconds: null,
    detectionMethod,
    momentsEarned: null,
  });
  return {
    id: ref.id,
    relationshipId,
    participantUids,
    startedAt,
    endedAt: null,
    durationSeconds: null,
    detectionMethod,
    momentsEarned: null,
  };
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 = dimanche
  const diffToMonday = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diffToMonday);
  d.setHours(0, 0, 0, 0);
  return d;
}

async function countSessionsThisWeek(relationshipId: string, before: Date): Promise<number> {
  const weekStart = startOfWeek(before).toISOString();
  const q = query(
    collection(db, "presenceSessions"),
    where("relationshipId", "==", relationshipId),
    where("startedAt", ">=", weekStart)
  );
  const snap = await getDocs(q);
  return snap.size;
}

export async function endPresenceSession(
  session: PresenceSession
): Promise<{ durationSeconds: number; momentsEarned: number }> {
  const endedAt = new Date();
  const startedAt = new Date(session.startedAt);
  const durationSeconds = Math.max(0, Math.round((endedAt.getTime() - startedAt.getTime()) / 1000));

  const sessionsBefore = await countSessionsThisWeek(session.relationshipId, startedAt);
  const momentsEarned = computeTotalMomentsEarned(durationSeconds, Math.max(0, sessionsBefore - 1));

  await updateDoc(doc(db, "presenceSessions", session.id), {
    endedAt: endedAt.toISOString(),
    durationSeconds,
    momentsEarned,
  });

  // Crédite chaque participant et fait progresser son compagnon personnel.
  await Promise.all(
    session.participantUids.map(async (uid) => {
      await updateDoc(doc(db, "users", uid), { momentsBalance: increment(momentsEarned) });
      const userSnap = await getDoc(doc(db, "users", uid));
      const profile = userSnap.data() as UserProfile | undefined;
      if (profile?.companionId) {
        await addPresenceSecondsToCompanion(profile.companionId, durationSeconds);
      }
    })
  );

  return { durationSeconds, momentsEarned };
}

export function subscribeToSessionHistory(relationshipId: string, callback: (sessions: PresenceSession[]) => void) {
  const q = query(
    collection(db, "presenceSessions"),
    where("relationshipId", "==", relationshipId),
    orderBy("startedAt", "desc")
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PresenceSession, "id">) })));
  });
}
