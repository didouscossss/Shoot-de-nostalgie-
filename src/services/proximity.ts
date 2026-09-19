// ---------------------------------------------------------------------------
// Détection de proximité via Bluetooth Low Energy (BLE) : chaque téléphone
// annonce (BLE advertising) un jeton propre à son compte, et scanne en même
// temps les annonces de ses proches actifs. Quand le jeton d'un proche
// attendu est capté avec un signal suffisant, on considère la personne
// "à proximité" et on démarre la session Présence automatiquement.
//
// Ceci utilise uniquement de vraies API Android (BluetoothLeAdvertiser /
// BluetoothLeScanner, voir native/android/ProximityModule.kt) — pas d'API
// inventée. Limites réelles à connaître (voir aussi le README) :
//
// - Fonctionne seulement quand l'app est au premier plan sur les DEUX
//   téléphones. Pas de service en arrière-plan pour ce MVP : ça demanderait
//   un foreground service + notification permanente (complexité, batterie,
//   et un nouveau permis système), à ajouter plus tard si confirmé utile.
// - Sur Android < 12, le scan BLE exige en plus la permission de
//   localisation (contrainte du système, pas un vrai besoin de localisation
//   de notre part) ET que la localisation soit activée au niveau système.
// - Certains constructeurs (Xiaomi, Huawei...) restreignent le scan BLE même
//   au premier plan via leurs réglages d'économie de batterie maison.
// - Le jeton annoncé (l'uid du compte) est diffusé en clair à toute
//   personne à portée avec un scanner BLE — acceptable pour un MVP, mais un
//   jeton tournant (plutôt que l'uid fixe) serait plus respectueux de la
//   vie privée dans une version future.
// ---------------------------------------------------------------------------

import { NativeModules, NativeEventEmitter, Platform } from "react-native";

interface ProximityNativeModule {
  hasPermissions(): Promise<boolean>;
  requestPermissions(): Promise<boolean>;
  startAdvertising(token: string): Promise<boolean>;
  stopAdvertising(): Promise<void>;
  startScanning(): Promise<boolean>;
  stopScanning(): Promise<void>;
}

const nativeModule = NativeModules.ProximityModule as ProximityNativeModule | undefined;
const emitter = nativeModule ? new NativeEventEmitter(NativeModules.ProximityModule) : null;

export function isProximitySupported(): boolean {
  return Platform.OS === "android" && !!nativeModule;
}

/** Demande les permissions Bluetooth (et localisation sur Android < 12) nécessaires au scan/à l'annonce BLE. */
export async function requestProximityPermissions(): Promise<boolean> {
  if (!nativeModule) return false;
  if (await nativeModule.hasPermissions()) return true;
  return nativeModule.requestPermissions();
}

export async function startBroadcastingPresence(myToken: string): Promise<void> {
  if (!nativeModule) return;
  await nativeModule.startAdvertising(myToken);
}

export async function stopBroadcastingPresence(): Promise<void> {
  if (!nativeModule) return;
  await nativeModule.stopAdvertising();
}

/**
 * Écoute les jetons captés à proximité. Le filtrage (est-ce bien le proche
 * recherché, à quelle distance approximative) reste côté JS : le natif se
 * contente de relayer tout ce qu'il capte d'autres instances de l'app.
 * Retourne une fonction pour arrêter l'écoute (et le scan natif associé).
 */
export function listenForNearbyTokens(onFound: (token: string, rssi: number) => void): () => void {
  if (!nativeModule || !emitter) {
    console.warn("[proximity] Module natif non lié — détection de proximité indisponible (attendu en Expo Go / web).");
    return () => {};
  }
  nativeModule.startScanning();
  const subscription = emitter.addListener("PresenceNearbyDeviceFound", (event: { token: string; rssi: number }) => {
    onFound(event.token, event.rssi);
  });
  return () => {
    subscription.remove();
    nativeModule?.stopScanning();
  };
}
