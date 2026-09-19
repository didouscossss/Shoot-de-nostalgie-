import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Platform } from "react-native";
import { useRoute, type RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { useAuth } from "../hooks/useAuth";
import { updateDistractingApps } from "../services/auth";
import {
  isBlockingSupported,
  requestBlockingPermissions,
  listInstalledAppsAndroid,
  startBlocking,
  stopBlocking,
} from "../services/appBlocking";
import {
  isProximitySupported,
  requestProximityPermissions,
  startBroadcastingPresence,
  stopBroadcastingPresence,
  listenForNearbyTokens,
} from "../services/proximity";
import { SCROLLING_SOCIAL_APPS } from "../services/socialApps";
import { startPresenceSession, endPresenceSession } from "../services/presence";
import type { PresenceSession } from "../models/types";
import { theme } from "../theme/theme";

// En dessous de ce seuil de RSSI (signal plus faible = appareil plus loin),
// on considère le proche "trop loin" pour déclencher une Présence — valeur
// approximative (le RSSI dépend beaucoup du modèle de téléphone et de
// l'environnement), à ajuster une fois testé sur de vrais appareils.
const NEARBY_RSSI_THRESHOLD = -80;

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
  const [searching, setSearching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const triggeredRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Recherche automatique du proche à proximité (BLE) : tourne tant qu'on
  // n'est ni en session, ni sur un résultat, ni en train de choisir les apps.
  // Le bouton "Démarrer quand même" reste le filet de sécurité si le
  // Bluetooth n'est pas disponible, la permission refusée, ou que l'autre
  // personne n'a pas l'app ouverte au même moment.
  useEffect(() => {
    if (session || result || appPickerOpen || !user) return;
    const friendUid = params.participantUids.find((uid) => uid !== user.uid);
    if (!friendUid || !isProximitySupported()) return;

    let cancelled = false;
    let cleanupListener: (() => void) | null = null;
    triggeredRef.current = false;

    (async () => {
      const granted = await requestProximityPermissions();
      if (!granted || cancelled) return;
      setSearching(true);
      await startBroadcastingPresence(user.uid);
      if (cancelled) return;
      cleanupListener = listenForNearbyTokens((token, rssi) => {
        if (triggeredRef.current) return;
        if (token === friendUid && rssi >= NEARBY_RSSI_THRESHOLD) {
          triggeredRef.current = true;
          handleStart();
        }
      });
    })();

    return () => {
      cancelled = true;
      setSearching(false);
      cleanupListener?.();
      stopBroadcastingPresence();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, result, appPickerOpen, user]);

  async function openAppPicker() {
    const installed = await listInstalledAppsAndroid();
    const installedPackages = new Set(installed.map((a) => a.packageName));
    // Hors build natif (Expo Go / web), listInstalledAppsAndroid() renvoie
    // toujours [] : on propose alors le catalogue complet plutôt qu'un écran
    // vide, pour rester utilisable en démo.
    const relevant =
      installedPackages.size > 0
        ? SCROLLING_SOCIAL_APPS.filter((a) => installedPackages.has(a.packageName))
        : SCROLLING_SOCIAL_APPS;
    setInstalledApps(relevant);
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
    await updateDistractingApps(user.uid, list);
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
        <Text style={styles.title}>Réseaux à mettre de côté</Text>
        <Text style={styles.hint}>Seuls les réseaux à défilement infini installés sur ton téléphone sont proposés.</Text>
        <FlatList
          data={installedApps}
          keyExtractor={(a) => a.packageName}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.appRow} onPress={() => toggleApp(item.packageName)}>
              <Text style={styles.appLabel}>{item.label}</Text>
              <Text style={styles.appCheck}>{selectedApps.has(item.packageName) ? "✅" : "⬜️"}</Text>
            </TouchableOpacity>
          )}
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

      {searching ? (
        <>
          <Text style={styles.searchingEmoji}>🔍</Text>
          <Text style={styles.hint}>Recherche de {params.otherName} à proximité (Bluetooth)…</Text>
          <Text style={styles.hintSmall}>La session démarrera automatiquement dès sa détection.</Text>
        </>
      ) : (
        <Text style={styles.hint}>
          {(profile?.distractingApps.length ?? 0) > 0
            ? `${profile?.distractingApps.length} réseau(x) seront mis de côté pendant la session.`
            : "Choisis d'abord les réseaux à mettre de côté."}
        </Text>
      )}

      <TouchableOpacity style={styles.secondaryBtn} onPress={openAppPicker}>
        <Text style={styles.secondaryBtnLabel}>📵 Choisir les réseaux à mettre de côté</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleStart}>
        <Text style={styles.primaryBtnLabel}>
          {searching ? "Démarrer quand même" : "Démarrer la Présence"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 24, paddingTop: 80, gap: 16 },
  title: { color: theme.colors.text, fontSize: 20, fontWeight: "700", textAlign: "center" },
  hint: { color: theme.colors.muted, textAlign: "center" },
  hintSmall: { color: theme.colors.muted, textAlign: "center", fontSize: 12 },
  searchingEmoji: { fontSize: 40, textAlign: "center" },
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
