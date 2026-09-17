import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";
import { useAuth } from "../hooks/useAuth";
import { SPECIES_CATALOG, chooseCompanionSpecies, type SpeciesOption } from "../services/companion";
import { theme } from "../theme/theme";

export default function ChooseAnimalScreen() {
  const { profile } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selected, setSelected] = useState<SpeciesOption | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleConfirm() {
    if (!profile?.companionId || !selected) return;
    setSaving(true);
    try {
      await chooseCompanionSpecies(profile.companionId, selected.id, name.trim() || selected.name);
      navigation.replace("Home");
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choisis ton compagnon</Text>
      <Text style={styles.subtitle}>
        Il ne grandit que grâce aux vrais moments passés avec tes proches — jamais par obligation, jamais par
        culpabilité.
      </Text>

      <FlatList
        data={SPECIES_CATALOG}
        keyExtractor={(s) => s.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12, paddingBottom: 12 }}
        renderItem={({ item }) => {
          const isSelected = selected?.id === item.id;
          return (
            <TouchableOpacity
              style={[styles.card, isSelected && styles.cardSelected]}
              onPress={() => setSelected(item)}
            >
              <Text style={styles.cardEmoji}>{item.emoji}</Text>
              <Text style={styles.cardName}>{item.name}</Text>
              <Text style={styles.cardTagline}>{item.tagline}</Text>
            </TouchableOpacity>
          );
        }}
      />

      {selected && (
        <TextInput
          style={styles.input}
          placeholder={`Donne-lui un nom (ex. ${selected.name})`}
          placeholderTextColor={theme.colors.muted}
          value={name}
          onChangeText={setName}
        />
      )}

      <TouchableOpacity
        style={[styles.confirmBtn, !selected && styles.confirmBtnDisabled]}
        onPress={handleConfirm}
        disabled={!selected || saving}
      >
        {saving ? (
          <ActivityIndicator color="#1b1a2e" />
        ) : (
          <Text style={styles.confirmLabel}>{selected ? `Adopter ${selected.name}` : "Choisis un animal"}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 20, paddingTop: 60 },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: "700" },
  subtitle: { color: theme.colors.muted, marginTop: 6, marginBottom: 20, fontSize: 13 },
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "transparent",
    padding: 16,
    alignItems: "center",
  },
  cardSelected: { borderColor: theme.colors.accent, backgroundColor: theme.colors.surfaceAlt },
  cardEmoji: { fontSize: 44 },
  cardName: { color: theme.colors.text, fontWeight: "700", marginTop: 8 },
  cardTagline: { color: theme.colors.muted, fontSize: 11, marginTop: 2, textAlign: "center" },
  input: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: theme.colors.text,
    marginTop: 12,
  },
  confirmBtn: {
    backgroundColor: theme.colors.accent,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 16,
  },
  confirmBtnDisabled: { opacity: 0.4 },
  confirmLabel: { color: "#1b1a2e", fontWeight: "800", fontSize: 16 },
});
