import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { signUp, logIn, authErrorMessage } from "../services/auth";
import { theme } from "../theme/theme";

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        await logIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password, displayName.trim() || "Moi");
      }
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>Présence</Text>
      <Text style={styles.subtitle}>
        Retrouve tes proches, laisse ton téléphone de côté, fais grandir ton compagnon.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{isLogin ? "Connexion" : "Créer un compte"}</Text>

        {error && <Text style={styles.error}>{error}</Text>}

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Ton prénom"
            placeholderTextColor={theme.colors.muted}
            value={displayName}
            onChangeText={setDisplayName}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={theme.colors.muted}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          placeholderTextColor={theme.colors.muted}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#1b1a2e" />
          ) : (
            <Text style={styles.submitLabel}>{isLogin ? "Se connecter" : "Créer mon compte"}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setMode(isLogin ? "signup" : "login")}>
          <Text style={styles.switchLabel}>
            {isLogin ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: theme.colors.text,
    textAlign: "center",
  },
  subtitle: {
    color: theme.colors.muted,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 32,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius,
    padding: 20,
    gap: 12,
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  error: {
    color: theme.colors.danger,
    fontSize: 13,
    textAlign: "center",
  },
  input: {
    backgroundColor: theme.colors.surfaceAlt,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: theme.colors.text,
  },
  submitBtn: {
    backgroundColor: theme.colors.accent,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  submitLabel: {
    color: "#1b1a2e",
    fontWeight: "800",
    fontSize: 16,
  },
  switchLabel: {
    color: theme.colors.accent2,
    textAlign: "center",
    marginTop: 8,
    fontSize: 13,
  },
});
