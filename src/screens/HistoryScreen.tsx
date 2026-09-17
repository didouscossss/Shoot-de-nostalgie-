import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { subscribeToSessionHistory } from "../services/presence";
import type { PresenceSession } from "../models/types";
import { theme } from "../theme/theme";

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours === 0) return `${minutes} min`;
  return `${hours}h${minutes.toString().padStart(2, "0")}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function SessionRow({ session }: { session: PresenceSession }) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.rowDate}>{formatDate(session.startedAt)}</Text>
        <Text style={styles.rowMeta}>{formatDuration(session.durationSeconds ?? 0)} ensemble</Text>
      </View>
      <Text style={styles.rowMoments}>+{session.momentsEarned ?? 0} ✨</Text>
    </View>
  );
}

export default function HistoryScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "History">>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { relationshipId, otherName } = route.params;
  const [sessions, setSessions] = useState<PresenceSession[]>([]);

  useEffect(() => {
    return subscribeToSessionHistory(relationshipId, setSessions);
  }, [relationshipId]);

  const completedSessions = sessions.filter((s) => s.endedAt !== null);
  const totalSeconds = completedSessions.reduce((sum, s) => sum + (s.durationSeconds ?? 0), 0);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>← Retour</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Avec {otherName}</Text>
      <Text style={styles.subtitle}>
        {completedSessions.length} moment{completedSessions.length > 1 ? "s" : ""} partagé
        {completedSessions.length > 1 ? "s" : ""} · {formatDuration(totalSeconds)} au total
      </Text>

      <FlatList
        data={completedSessions}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => <SessionRow session={item} />}
        contentContainerStyle={{ paddingTop: 12 }}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun moment enregistré pour l'instant. Lancez une Présence ensemble !</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 20, paddingTop: 60 },
  back: { color: theme.colors.muted, marginBottom: 16, fontSize: 15 },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: "700" },
  subtitle: { color: theme.colors.muted, marginTop: 4, fontSize: 13 },
  row: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowDate: { color: theme.colors.text, fontWeight: "700", fontSize: 15, textTransform: "capitalize" },
  rowMeta: { color: theme.colors.muted, marginTop: 4, fontSize: 13 },
  rowMoments: { color: theme.colors.accent, fontWeight: "800", fontSize: 15 },
  empty: { color: theme.colors.muted, textAlign: "center", marginTop: 40 },
});
