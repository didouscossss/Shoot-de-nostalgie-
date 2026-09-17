import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { subscribeToCompanion } from "../services/companion";
import { logOut } from "../services/auth";
import type { Companion } from "../models/types";
import { theme } from "../theme/theme";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/RootNavigator";

const COSMETIC_EMOJI: Record<string, string> = {
  "hat-cap": "🧢",
  "hat-flower": "🌸",
  "glasses-round": "🕶️",
  "color-sunset": "🌅",
  "outfit-scarf": "🧣",
  "accessory-star": "✨",
};

export default function HomeScreen() {
  const { profile } = useAuth();
  const [companion, setCompanion] = useState<Companion | null>(null);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!profile?.companionId) return;
    return subscribeToCompanion(profile.companionId, setCompanion);
  }, [profile?.companionId]);

  const hoursTogether = companion ? (companion.totalPresenceSeconds / 3600).toFixed(1) : "0";
  const equippedEmojis = companion ? Object.values(companion.equippedCosmetics) : [];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.greeting}>Salut {profile?.displayName ?? ""} 👋</Text>

      <View style={styles.companionCard}>
        <Text style={styles.companionEmoji}>🐣</Text>
        <View style={styles.equippedRow}>
          {equippedEmojis.map((id) => (
            <Text key={id} style={styles.equippedEmoji}>
              {COSMETIC_EMOJI[id] ?? "❔"}
            </Text>
          ))}
        </View>
        <Text style={styles.companionName}>{companion?.name ?? "Ton compagnon"}</Text>
        <Text style={styles.companionMeta}>{hoursTogether} h passées ensemble</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>✨ Moments</Text>
        <Text style={styles.balanceValue}>{profile?.momentsBalance ?? 0}</Text>
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate("Friends")}>
        <Text style={styles.primaryBtnLabel}>Retrouver un proche</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate("Shop")}>
        <Text style={styles.secondaryBtnLabel}>🎨 Personnaliser mon compagnon</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => logOut()} style={styles.logoutBtn}>
        <Text style={styles.logoutLabel}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: theme.colors.background,
    flexGrow: 1,
    gap: 16,
  },
  greeting: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "700",
  },
  companionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius,
    padding: 24,
    alignItems: "center",
  },
  companionEmoji: { fontSize: 80 },
  equippedRow: { flexDirection: "row", gap: 4, marginTop: 4 },
  equippedEmoji: { fontSize: 20 },
  companionName: { color: theme.colors.text, fontSize: 18, fontWeight: "700", marginTop: 8 },
  companionMeta: { color: theme.colors.muted, fontSize: 13, marginTop: 4 },
  balanceCard: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: theme.radius,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  balanceLabel: { color: theme.colors.text, fontWeight: "700" },
  balanceValue: { color: theme.colors.accent, fontWeight: "800", fontSize: 20 },
  primaryBtn: {
    backgroundColor: theme.colors.accent,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  primaryBtnLabel: { color: "#1b1a2e", fontWeight: "800", fontSize: 16 },
  secondaryBtn: {
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
  },
  secondaryBtnLabel: { color: theme.colors.text, fontWeight: "700" },
  logoutBtn: { alignItems: "center", marginTop: 8 },
  logoutLabel: { color: theme.colors.muted, textDecorationLine: "underline" },
});
