// ---------------------------------------------------------------------------
// Abstraction du blocage natif. Le blocage réel est IMPOSSIBLE en JS pur :
// - iOS : Screen Time (FamilyControls + ManagedSettings + DeviceActivity)
// - Android : UsageStatsManager + AccessibilityService + overlay
// Ces deux modules natifs (voir /native/ios et /native/android) doivent être
// intégrés via `expo prebuild` puis compilés depuis Xcode / Android Studio
// sur un vrai appareil (aucun des deux ne fonctionne en simulateur/émulateur
// pour ces API précises). Tant qu'ils ne sont pas liés (ex: dans Expo Go),
// ce module se comporte en no-op sans planter l'app.
// ---------------------------------------------------------------------------

import { NativeModules, Platform } from "react-native";

interface ScreenTimeBlockerModule {
  requestAuthorization(): Promise<boolean>;
  pickDistractingApps(): Promise<string[]>; // renvoie des jetons opaques (iOS ne révèle jamais le nom réel)
  startShielding(appTokens: string[]): Promise<void>;
  stopShielding(): Promise<void>;
}

interface AndroidAppBlockerModule {
  hasUsagePermission(): Promise<boolean>;
  requestUsagePermission(): Promise<void>;
  hasAccessibilityPermission(): Promise<boolean>;
  requestAccessibilityPermission(): Promise<void>;
  hasOverlayPermission(): Promise<boolean>;
  requestOverlayPermission(): Promise<void>;
  listInstalledApps(): Promise<{ packageName: string; label: string }[]>;
  startBlocking(packageNames: string[]): Promise<void>;
  stopBlocking(): Promise<void>;
}

const iosModule = NativeModules.ScreenTimeBlocker as ScreenTimeBlockerModule | undefined;
const androidModule = NativeModules.AppBlocker as AndroidAppBlockerModule | undefined;

export function isBlockingSupported(): boolean {
  if (Platform.OS === "ios") return !!iosModule;
  if (Platform.OS === "android") return !!androidModule;
  return false;
}

/**
 * Demande les permissions nécessaires. Sur iOS c'est une seule autorisation
 * Family Controls ; sur Android il faut enchaîner 3 permissions séparées
 * (usage stats, accessibilité, overlay) — chacune ouvre un écran système
 * différent, l'utilisateur doit revenir dans l'app entre chaque étape.
 */
export async function requestBlockingPermissions(): Promise<boolean> {
  if (Platform.OS === "ios") {
    if (!iosModule) return false;
    return iosModule.requestAuthorization();
  }
  if (Platform.OS === "android") {
    if (!androidModule) return false;
    if (!(await androidModule.hasUsagePermission())) await androidModule.requestUsagePermission();
    if (!(await androidModule.hasAccessibilityPermission())) await androidModule.requestAccessibilityPermission();
    if (!(await androidModule.hasOverlayPermission())) await androidModule.requestOverlayPermission();
    return (
      (await androidModule.hasUsagePermission()) &&
      (await androidModule.hasAccessibilityPermission()) &&
      (await androidModule.hasOverlayPermission())
    );
  }
  return false;
}

/** iOS uniquement : ouvre le sélecteur système FamilyActivityPicker. */
export async function pickDistractingAppsIOS(): Promise<string[]> {
  if (!iosModule) return [];
  return iosModule.pickDistractingApps();
}

/** Android uniquement : liste les apps installées pour que l'utilisateur choisisse. */
export async function listInstalledAppsAndroid(): Promise<{ packageName: string; label: string }[]> {
  if (!androidModule) return [];
  return androidModule.listInstalledApps();
}

export async function startBlocking(appIdentifiers: string[]): Promise<void> {
  if (Platform.OS === "ios" && iosModule) {
    await iosModule.startShielding(appIdentifiers);
  } else if (Platform.OS === "android" && androidModule) {
    await androidModule.startBlocking(appIdentifiers);
  } else {
    console.warn("[appBlocking] Module natif non lié — aucun blocage réel (attendu en Expo Go / avant prebuild).");
  }
}

export async function stopBlocking(): Promise<void> {
  if (Platform.OS === "ios" && iosModule) {
    await iosModule.stopShielding();
  } else if (Platform.OS === "android" && androidModule) {
    await androidModule.stopBlocking();
  }
}
