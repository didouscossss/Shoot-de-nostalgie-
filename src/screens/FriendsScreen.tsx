import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Alert } from "react-native";
import { useAuth } from "../hooks/useAuth";
import {
  createRelationshipInvite,
  joinRelationshipByCode,
  subscribeToMyRelationships,
} from "../services/relationships";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import type { Relationship, UserProfile } from "../models/types";
import { theme } from "../theme/theme";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../navigation/RootNavigator";

function RelationshipRow({
  relationship,
  myUid,
  onStartPresence,
  onViewHistory,
}: {
  relationship: Relationship;
  myUid: string;
  onStartPresence: (r: Relationship, otherName: string) => void;
  onViewHistory: (r: Relationship, otherName: string) => void;
}) {
  const [otherName, setOtherName] = useState("...");
  const otherUid = relationship.memberUids.find((uid) => uid !== myUid);

  useEffect(() => {
    if (!otherUid) return;
    getDoc(doc(db, "users", otherUid)).then((snap) => {
      const p = snap.data() as UserProfile | undefined;
      setOtherName(p?.displayName ?? "Quelqu'un");
    });
  }, [otherUid]);

  if (relationship.status === "pending") {
    return (
      <View style={styles.row}>
        <Text style={styles.rowTitle}>Invitation en attente</Text>
        <Text style={styles.rowMeta}>Code à partager : {relationship.inviteCode}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.row} onPress={() => onStartPresence(relationship, otherName)}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowTitle}>{otherName}</Text>
        <TouchableOpacity onPress={() => onViewHistory(relationship, otherName)}>
          <Text style={styles.historyLink}>Historique</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.rowMeta}>Démarrer une Présence →</Text>
    </TouchableOpacity>
  );
}

export default function FriendsScreen() {
  const { user } = useAuth();
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [joinCode, setJoinCode] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!user) return;
    return subscribeToMyRelationships(user.uid, setRelationships);
  }, [user]);

  async function handleInvite() {
    if (!user) return;
    const rel = await createRelationshipInvite(user.uid);
    Alert.alert("Invitation créée", `Partage ce code avec ton proche : ${rel.inviteCode}`);
  }

  async function handleJoin() {
    if (!user || !joinCode.trim()) return;
    try {
      await joinRelationshipByCode(user.uid, joinCode.trim());
      setJoinCode("");
    } catch (err) {
      Alert.alert("Oups", "Ce code n'est pas valide ou a déjà été utilisé.");
    }
  }

  function handleStartPresence(relationship: Relationship, otherName: string) {
    if (!user) return;
    navigation.navigate("Presence", {
      relationshipId: relationship.id,
      participantUids: relationship.memberUids,
      otherName,
    });
  }

  function handleViewHistory(relationship: Relationship, otherName: string) {
    navigation.navigate("History", { relationshipId: relationship.id, otherName });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes proches</Text>

      <FlatList
        data={relationships}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) =>
          user ? (
            <RelationshipRow
              relationship={item}
              myUid={user.uid}
              onStartPresence={handleStartPresence}
              onViewHistory={handleViewHistory}
            />
          ) : null
        }
        ListEmptyComponent={<Text style={styles.empty}>Ajoute un premier proche pour commencer.</Text>}
        style={{ marginBottom: 20 }}
      />

      <TouchableOpacity style={styles.primaryBtn} onPress={handleInvite}>
        <Text style={styles.primaryBtnLabel}>+ Inviter un proche</Text>
      </TouchableOpacity>

      <View style={styles.joinRow}>
        <TextInput
          style={styles.joinInput}
          placeholder="Code reçu"
          placeholderTextColor={theme.colors.muted}
          autoCapitalize="characters"
          value={joinCode}
          onChangeText={setJoinCode}
        />
        <TouchableOpacity style={styles.joinBtn} onPress={handleJoin}>
          <Text style={styles.joinBtnLabel}>Rejoindre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 20, paddingTop: 60 },
  title: { color: theme.colors.text, fontSize: 22, fontWeight: "700", marginBottom: 16 },
  row: {
    backgroundColor: theme.colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },
  rowHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  rowTitle: { color: theme.colors.text, fontWeight: "700", fontSize: 16 },
  rowMeta: { color: theme.colors.muted, marginTop: 4, fontSize: 13 },
  historyLink: { color: theme.colors.accent2, fontSize: 13, fontWeight: "700" },
  empty: { color: theme.colors.muted, textAlign: "center", marginTop: 20 },
  primaryBtn: { backgroundColor: theme.colors.accent, borderRadius: 999, paddingVertical: 14, alignItems: "center" },
  primaryBtnLabel: { color: "#1b1a2e", fontWeight: "800" },
  joinRow: { flexDirection: "row", gap: 8, marginTop: 12 },
  joinInput: {
    flex: 1,
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 12,
    paddingHorizontal: 14,
    color: theme.colors.text,
  },
  joinBtn: { backgroundColor: theme.colors.surface, borderRadius: 12, paddingHorizontal: 16, justifyContent: "center" },
  joinBtnLabel: { color: theme.colors.text, fontWeight: "700" },
});
