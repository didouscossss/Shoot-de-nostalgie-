import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Platform } from "react-native";
import { useRoute, type RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { useAuth } from "../hooks/useAuth";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import {
  isBlockingSupported,
  requestBlockingPermissions,
  listInstalledAppsAndroid,
  startBlocking,
  stopBlocking,
} from "../services/appBlocking";
import { startPresenceSession, endPresenceSession } from "../services/presence";
import type { PresenceSession } from "../models/types";
import { theme } from "../theme/theme";

type PresenceRoute = RouteProp<RootStackParamList, "Presence">;

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
}

export default function PresenceScreen() {
  const { params } = useRoute<PresenceRoute>();
  const { user, profile } = useAuth();
  const [appPickerOpen, setAppPickerOpen] = useState(false);
  const [installedApps, setInstalledApps] = useState<{ packageName: string; label: string }[]>([]);
  const [selectedApps, setSelectedApps] = useState<Set<string>>(new Set(profile?.distractingApps ?? []));
  const [session, setSession] = useState<PresenceSession | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<{ durationSeconds: number; momentsEarned: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  async function openAppPicker() {
    const apps = await listInstalledAppsAndroid();
    setInstalledApps(apps);
    setAppPickerOpen(true);
  }

  function toggleApp(pkg: string) {
    setSelectedApps((prev) => {
      const next = new Set(prev);
      if (next.has(pkg)) next.delete(pkg);
      else next.add(pkg);
      return next;
    });
  }

  async function saveSelectedApps() {
    if (!user) return;
    const list = Array.from(selectedApps);
    await updateDoc(doc(db, "users", user.uid), { distractingApps: list });
    setAppPickerOpen(false);
  }

  async function handleStart() {
    if (!user) return;

    if (isBlockingSupported()) {
      const granted = await requestBlockingPermissions();
      if (!granted) {
        Alert.alert(
          "Permissions nécessaires",
          Platform.OS === "android"
            ? "Active l'accès aux stats d'usage, l'accessibilité et l'affichage par-dessus dans les réglages pour que le mode Présence puisse fonctionner."
            : "Autorise Screen Time pour que le mode Présence puisse fonctionner."
        );
        return;
      }
      await startBlocking(profile?.distractingApps ?? []);
    } else {
      console.warn("[Presence] Blocage natif non disponible (Expo Go / avant build natif) — session sans blocage réel.");
    }

    const newSession = await startPresenceSession(params.relationshipId, params.participantUids);
    setSession(newSession);
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  }

  async function handleEnd() {
    if (!session) return;
    if (timerRef.current) clearInterval(timerRef.current);
    await stopBlocking();
    const outcome = await endPresenceSession(session);
    setSession(null);
    setResult(outcome);
  }

  if (result) {
    return (
      <View style={styles.container}>
        <Text style={styles.resultEmoji}>💛</Text>
        <Text style={styles.resultTitle}>
          Vous avez passé {formatDuration(result.durationSeconds)} avec {params.otherName}
        </Text>
        <Text style={styles.resultMoments}>+{result.momentsEarned} ✨ Moments</Text>
        <Text style={styles.resultHint}>
          (L'ajout d'un souvenir — photo, quelques mots — arrive dans une prochaine version.)
        </Text>
      </View>
    );
  }

  if (session) {
    return (
      <View style={styles.container}>
        <Text style={styles.withLabel}>Avec {params.otherName}</Text>
        <Text style={styles.timer}>{formatDuration(elapsed)}</Text>
        <Text style={styles.hint}>Quelqu'un que tu apprécies est avec toi. Profite du moment 💛</Text>
        <TouchableOpacity style={styles.endBtn} onPress={handleEnd}>
          <Text style={styles.endBtnLabel}>Terminer la Présence</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (appPickerOpen) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Apps à mettre de côté</Text>
        <FlatList
          data={installedApps}
          keyExtractor={(a) => a.packageName}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.appRow} onPress={() => toggleApp(item.packageName)}>
              <Text style={styles.appLabel}>{item.label}</Text>
              <Text style={styles.appCheck}>{selectedApps.has(item.packageName) ? "✅" : "⬜️"}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.hint}>
              Liste vide : normal tant que le module natif Android n'est pas compilé sur un vrai appareil.
            </Text>
          }
        />
        <TouchableOpacity style={styles.primaryBtn} onPress={saveSelectedApps}>
          <Text style={styles.primaryBtnLabel}>Valider ({selectedApps.size})</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Présence avec {params.otherName}</Text>
      <Text style={styles.hint}>
        {(profile?.distractingApps.length ?? 0) > 0
          ? `${profile?.distractingApps.length} app(s) seront mises de côté pendant la session.`
          : "Choisis d'abord les apps distrayantes à mettre de côté."}
      </Text>

      <TouchableOpacity style={styles.secondaryBtn} onPress={openAppPicker}>
        <Text style={styles.secondaryBtnLabel}>📵 Choisir les apps distrayantes</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleStart}>
        <Text style={styles.primaryBtnLabel}>Démarrer la Présence</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 24, paddingTop: 80, gap: 16 },
  title: { color: theme.colors.text, fontSize: 20, fontWeight: "700", textAlign: "center" },
  hint: { color: theme.colors.muted, textAlign: "center" },
  primaryBtn: { backgroundColor: theme.colors.accent, borderRadius: 999, paddingVertical: 16, alignItems: "center" },
  primaryBtnLabel: { color: "#1b1a2e", fontWeight: "800", fontSize: 16 },
  secondaryBtn: { backgroundColor: theme.colors.surface, borderRadius: 999, paddingVertical: 14, alignItems: "center" },
  secondaryBtnLabel: { color: theme.colors.text, fontWeight: "700" },
  appRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  appLabel: { color: theme.colors.text },
  appCheck: { fontSize: 16 },
  withLabel: { color: theme.colors.muted, textAlign: "center", fontSize: 16 },
  timer: { color: theme.colors.text, fontSize: 48, fontWeight: "800", textAlign: "center" },
  endBtn: { backgroundColor: theme.colors.surface, borderRadius: 999, paddingVertical: 16, alignItems: "center" },
  endBtnLabel: { color: theme.colors.text, fontWeight: "700" },
  resultEmoji: { fontSize: 64, textAlign: "center" },
  resultTitle: { color: theme.colors.text, fontSize: 18, fontWeight: "700", textAlign: "center" },
  resultMoments: { color: theme.colors.accent, fontSize: 28, fontWeight: "800", textAlign: "center" },
  resultHint: { color: theme.colors.muted, fontSize: 12, textAlign: "center" },
});
