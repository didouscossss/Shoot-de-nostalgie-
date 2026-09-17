import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../hooks/useAuth";
import AuthScreen from "../screens/AuthScreen";
import HomeScreen from "../screens/HomeScreen";
import FriendsScreen from "../screens/FriendsScreen";
import PresenceScreen from "../screens/PresenceScreen";
import ShopScreen from "../screens/ShopScreen";
import HistoryScreen from "../screens/HistoryScreen";
import { theme } from "../theme/theme";

export type RootStackParamList = {
  Home: undefined;
  Friends: undefined;
  Presence: { relationshipId: string; participantUids: string[]; otherName: string };
  Shop: undefined;
  History: { relationshipId: string; otherName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    card: theme.colors.surface,
    text: theme.colors.text,
    border: theme.colors.border,
    primary: theme.colors.accent,
  },
};

export default function RootNavigator() {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={theme.colors.accent} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {!user ? (
        <AuthScreen />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Friends" component={FriendsScreen} />
          <Stack.Screen name="Presence" component={PresenceScreen} />
          <Stack.Screen name="Shop" component={ShopScreen} />
          <Stack.Screen name="History" component={HistoryScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
