import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from "react-native";
import { useAuth } from "../hooks/useAuth";
import {
  STARTER_CATALOG,
  purchaseCosmetic,
  subscribeToInventory,
  equipCosmetic,
  subscribeToCompanion,
} from "../services/companion";
import type { CosmeticItem, InventoryEntry, Companion } from "../models/types";
import { theme } from "../theme/theme";

const RARITY_COLOR: Record<CosmeticItem["rarity"], string> = {
  normale: "#9aa5b1",
  rare: "#7ee8c3",
  epique: "#c58bff",
  legendaire: "#ffb26b",
};

export default function ShopScreen() {
  const { user, profile } = useAuth();
  const [inventory, setInventory] = useState<InventoryEntry[]>([]);
  const [companion, setCompanion] = useState<Companion | null>(null);

  useEffect(() => {
    if (!user) return;
    return subscribeToInventory(user.uid, setInventory);
  }, [user]);

  useEffect(() => {
    if (!profile?.companionId) return;
    return subscribeToCompanion(profile.companionId, setCompanion);
  }, [profile?.companionId]);

  const ownedIds = new Set(inventory.map((i) => i.cosmeticItemId));

  async function handleBuyOrEquip(item: CosmeticItem) {
    if (!user || !profile) return;

    if (!ownedIds.has(item.id)) {
      if (profile.momentsBalance < item.price) {
        Alert.alert("Pas assez de Moments", "Passe plus de temps avec tes proches pour en gagner ✨");
        return;
      }
      await purchaseCosmetic(user.uid, item, profile.momentsBalance);
    }

    if (profile.companionId) {
      await equipCosmetic(profile.companionId, item.slot, item.id);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personnalisation</Text>
      <Text style={styles.balance}>✨ {profile?.momentsBalance ?? 0} Moments</Text>

      <FlatList
        data={STARTER_CATALOG}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ gap: 12 }}
        renderItem={({ item }) => {
          const owned = ownedIds.has(item.id);
          const equipped = companion?.equippedCosmetics[item.slot] === item.id;
          return (
            <TouchableOpacity
              style={[styles.item, { borderColor: RARITY_COLOR[item.rarity] }, equipped && styles.itemEquipped]}
              onPress={() => handleBuyOrEquip(item)}
            >
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemMeta}>{owned ? (equipped ? "Équipé" : "Possédé — toucher pour équiper") : `${item.price} ✨`}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 20, paddingTop: 60 },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: "700" },
  balance: { color: theme.colors.accent, fontWeight: "700", marginBottom: 16 },
  item: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    borderWidth: 2,
    padding: 14,
    alignItems: "center",
  },
  itemEquipped: { backgroundColor: theme.colors.surfaceAlt },
  itemName: { color: theme.colors.text, fontWeight: "700", textAlign: "center" },
  itemMeta: { color: theme.colors.muted, fontSize: 12, marginTop: 6, textAlign: "center" },
});
