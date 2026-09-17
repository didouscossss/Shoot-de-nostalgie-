import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { Companion } from "../models/types";
import { getSpeciesOption } from "../services/companion";
import { theme } from "../theme/theme";

export const COSMETIC_EMOJI: Record<string, string> = {
  "hat-cap": "🧢",
  "hat-flower": "🌸",
  "glasses-round": "🕶️",
  "color-sunset": "🌅",
  "outfit-scarf": "🧣",
  "accessory-star": "✨",
};

export default function CompanionPreview({
  companion,
  size = 80,
  showName = true,
}: {
  companion: Companion | null;
  size?: number;
  showName?: boolean;
}) {
  const species = companion ? getSpeciesOption(companion.species) : undefined;
  const emoji = species?.emoji ?? "🥚";
  const equippedEmojis = companion ? Object.values(companion.equippedCosmetics) : [];

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: size }}>{emoji}</Text>
      {equippedEmojis.length > 0 && (
        <View style={styles.equippedRow}>
          {equippedEmojis.map((id) => (
            <Text key={id} style={styles.equippedEmoji}>
              {COSMETIC_EMOJI[id] ?? "❔"}
            </Text>
          ))}
        </View>
      )}
      {showName && <Text style={styles.name}>{companion?.name ?? "Ton compagnon"}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  equippedRow: { flexDirection: "row", gap: 4, marginTop: 4 },
  equippedEmoji: { fontSize: 20 },
  name: { color: theme.colors.text, fontSize: 18, fontWeight: "700", marginTop: 8 },
});
