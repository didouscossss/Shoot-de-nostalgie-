// ---------------------------------------------------------------------------
// Module natif Android — détection de l'app au premier plan + écran de
// blocage par-dessus (overlay), via UsageStatsManager + AccessibilityService.
//
// ⚠️ NON COMPILÉ NI TESTÉ dans cet environnement (pas de SDK Android/
// émulateur disponible ici). Code de référence à vérifier/adapter.
//
// Mise en place :
//   1. `npx expo prebuild` pour générer le dossier android/.
//   2. Copier ce fichier + AppBlockerAccessibilityService.kt dans
//      android/app/src/main/java/.../ (adapter le `package`).
//   3. Déclarer le service et les permissions dans AndroidManifest.xml
//      (voir commentaire en bas de fichier).
//   4. Build depuis Android Studio sur un vrai appareil (l'accessibilité
//      et l'overlay sont peu fiables/à éviter en émulateur).
//
// Ce n'est pas un vrai "blocage système" : Android ne permet pas à une app
// tierce d'empêcher le lancement d'une autre. On la détecte au premier plan
// (UsageStatsManager) et on affiche aussitôt un écran par-dessus (overlay)
// qui invite à revenir à l'app — fonctionnellement équivalent pour
// l'utilisateur, c'est l'approche standard (Freedom, StayFree, etc.).
// ---------------------------------------------------------------------------

package com.presenceapp

import android.app.AppOpsManager
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Process
import android.provider.Settings
import com.facebook.react.bridge.*

class AppBlockerModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "AppBlocker"

  @ReactMethod
  fun hasUsagePermission(promise: Promise) {
    val appOps = reactApplicationContext.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
    val mode = appOps.checkOpNoThrow(
      AppOpsManager.OPSTR_GET_USAGE_STATS,
      Process.myUid(),
      reactApplicationContext.packageName
    )
    promise.resolve(mode == AppOpsManager.MODE_ALLOWED)
  }

  @ReactMethod
  fun requestUsagePermission(promise: Promise) {
    val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK
    }
    reactApplicationContext.startActivity(intent)
    promise.resolve(null)
  }

  @ReactMethod
  fun hasAccessibilityPermission(promise: Promise) {
    // TODO : vérifier via Settings.Secure.ACCESSIBILITY_ENABLED + la liste
    // des services activés (comparer au nom qualifié du service ci-dessous).
    promise.resolve(false)
  }

  @ReactMethod
  fun requestAccessibilityPermission(promise: Promise) {
    val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK
    }
    reactApplicationContext.startActivity(intent)
    promise.resolve(null)
  }

  @ReactMethod
  fun hasOverlayPermission(promise: Promise) {
    promise.resolve(Settings.canDrawOverlays(reactApplicationContext))
  }

  @ReactMethod
  fun requestOverlayPermission(promise: Promise) {
    val intent = Intent(
      Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
      Uri.parse("package:${reactApplicationContext.packageName}")
    ).apply { flags = Intent.FLAG_ACTIVITY_NEW_TASK }
    reactApplicationContext.startActivity(intent)
    promise.resolve(null)
  }

  @ReactMethod
  fun listInstalledApps(promise: Promise) {
    val pm = reactApplicationContext.packageManager
    val apps = pm.getInstalledApplications(0)
    val result = Arguments.createArray()
    for (app in apps) {
      // On ne propose que les apps avec une icône de lancement (pas les
      // composants système invisibles).
      if (pm.getLaunchIntentForPackage(app.packageName) != null) {
        val entry = Arguments.createMap()
        entry.putString("packageName", app.packageName)
        entry.putString("label", pm.getApplicationLabel(app).toString())
        result.pushMap(entry)
      }
    }
    promise.resolve(result)
  }

  @ReactMethod
  fun startBlocking(packageNames: ReadableArray, promise: Promise) {
    val prefs = reactApplicationContext.getSharedPreferences("presence_blocklist", Context.MODE_PRIVATE)
    val set = mutableSetOf<String>()
    for (i in 0 until packageNames.size()) packageNames.getString(i)?.let { set.add(it) }
    prefs.edit().putStringSet("blocked", set).apply()
    // Le service d'accessibilité (toujours actif une fois la permission
    // accordée) lit cette liste à chaque changement de fenêtre au premier
    // plan — voir AppBlockerAccessibilityService.kt.
    promise.resolve(null)
  }

  @ReactMethod
  fun stopBlocking(promise: Promise) {
    val prefs = reactApplicationContext.getSharedPreferences("presence_blocklist", Context.MODE_PRIVATE)
    prefs.edit().putStringSet("blocked", emptySet()).apply()
    promise.resolve(null)
  }
}

/*
AndroidManifest.xml — à ajouter :

<uses-permission android:name="android.permission.PACKAGE_USAGE_STATS"
    tools:ignore="ProtectedPermissions" />
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />

<service
    android:name=".AppBlockerAccessibilityService"
    android:permission="android.permission.BIND_ACCESSIBILITY_SERVICE"
    android:exported="false">
    <intent-filter>
        <action android:name="android.accessibilityservice.AccessibilityService" />
    </intent-filter>
    <meta-data
        android:name="android.accessibilityservice"
        android:resource="@xml/accessibility_service_config" />
</service>
*/
