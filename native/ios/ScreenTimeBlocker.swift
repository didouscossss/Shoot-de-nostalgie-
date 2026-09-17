// ---------------------------------------------------------------------------
// Module natif iOS — Screen Time (FamilyControls / ManagedSettings).
//
// ⚠️ NON COMPILÉ NI TESTÉ dans cet environnement (pas de macOS/Xcode
// disponible). Code de référence à vérifier/adapter sur ta machine.
//
// Mise en place :
//   1. `npx expo prebuild` pour générer le dossier ios/.
//   2. Ajouter la capability "Family Controls" dans Xcode (Signing &
//      Capabilities) — nécessite un compte développeur Apple.
//   3. Copier ce fichier (et le .m ci-dessous) dans ios/<NomDuProjet>/.
//   4. `pod install` puis build depuis Xcode sur un VRAI iPhone (Family
//      Controls ne fonctionne pas dans le simulateur).
//
// Rappel important : Apple ne révèle JAMAIS à une app tierce quelles apps
// précises l'utilisateur a choisi de restreindre — FamilyActivityPicker
// renvoie une sélection opaque (ApplicationToken), qu'on ne peut que
// stocker et réutiliser pour le shield, jamais afficher par leur nom.
// ---------------------------------------------------------------------------

import Foundation
import FamilyControls
import ManagedSettings
import React

@objc(ScreenTimeBlocker)
class ScreenTimeBlocker: NSObject {

  private let store = ManagedSettingsStore()
  private let center = AuthorizationCenter.shared

  @objc
  static func requiresMainQueueSetup() -> Bool { true }

  @objc(requestAuthorization:rejecter:)
  func requestAuthorization(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      do {
        try await center.requestAuthorization(for: .individual)
        resolve(true)
      } catch {
        reject("AUTH_FAILED", error.localizedDescription, error)
      }
    }
  }

  // La sélection se fait côté SwiftUI (FamilyActivityPicker) : ce module
  // suppose une vue native présentée par ailleurs, qui appelle en retour
  // `resolveAppSelection`. Simplifié ici pour rester lisible ; en pratique,
  // il faut un composant SwiftUI hébergé (UIHostingController) présenté
  // depuis l'écran React Native correspondant.
  @objc(pickDistractingApps:rejecter:)
  func pickDistractingApps(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    // TODO (à faire sur ta machine) : présenter FamilyActivityPicker,
    // encoder la FamilyActivitySelection résultante (Codable) et la
    // renvoyer sous forme de jetons opaques (ex: base64 du Data encodé).
    reject("NOT_IMPLEMENTED", "Voir TODO : présentation de FamilyActivityPicker depuis SwiftUI.", nil)
  }

  @objc(startShielding:resolver:rejecter:)
  func startShielding(
    _ appTokens: [String],
    resolver resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    // TODO : décoder les jetons stockés en ApplicationToken, puis :
    // store.shield.applications = Set(decodedTokens)
    resolve(nil)
  }

  @objc(stopShielding:rejecter:)
  func stopShielding(
    _ resolve: @escaping RCTPromiseResolveBlock,
    rejecter reject: @escaping RCTPromiseRejectBlock
  ) {
    store.shield.applications = nil
    resolve(nil)
  }
}
