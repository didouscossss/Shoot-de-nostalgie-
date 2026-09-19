// ---------------------------------------------------------------------------
// Module natif Android — détection de proximité par Bluetooth Low Energy.
// Chaque appareil annonce (BLE advertising) un petit jeton (l'uid du compte)
// dans le "service data" d'une annonce BLE, et scanne en parallèle les
// annonces des autres instances de l'app. Le filtrage "est-ce mon proche ?"
// se fait côté JS (voir src/services/proximity.ts) : ce module se contente
// d'émettre chaque jeton capté avec l'intensité du signal (RSSI).
//
// ⚠️ NON COMPILÉ NI TESTÉ dans cet environnement (pas de SDK Android/
// émulateur disponible ici). Code de référence à vérifier/adapter.
//
// Limites réelles assumées (voir README) : fonctionne seulement quand l'app
// est au premier plan des deux côtés (pas de foreground service ici), et
// sur Android < 12 exige en plus la permission de localisation (contrainte
// système pour le scan BLE, indépendante de notre usage réel).
// ---------------------------------------------------------------------------

package com.presenceapp

import android.Manifest
import android.bluetooth.BluetoothManager
import android.bluetooth.le.AdvertiseCallback
import android.bluetooth.le.AdvertiseData
import android.bluetooth.le.AdvertiseSettings
import android.bluetooth.le.BluetoothLeAdvertiser
import android.bluetooth.le.BluetoothLeScanner
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanFilter
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.content.Context
import android.content.pm.PackageManager
import android.os.Build
import android.os.ParcelUuid
import androidx.core.content.ContextCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener

class ProximityModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext),
  PermissionListener {

  override fun getName() = "ProximityModule"

  private val bluetoothManager
    get() = reactContext.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager

  private var advertiser: BluetoothLeAdvertiser? = null
  private var advertiseCallback: AdvertiseCallback? = null
  private var scanner: BluetoothLeScanner? = null
  private var scanCallback: ScanCallback? = null
  private var permissionPromise: Promise? = null

  private fun requiredPermissions(): Array<String> =
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
      arrayOf(
        Manifest.permission.BLUETOOTH_SCAN,
        Manifest.permission.BLUETOOTH_ADVERTISE,
        Manifest.permission.BLUETOOTH_CONNECT
      )
    } else {
      arrayOf(Manifest.permission.ACCESS_FINE_LOCATION)
    }

  @ReactMethod
  fun hasPermissions(promise: Promise) {
    val granted = requiredPermissions().all {
      ContextCompat.checkSelfPermission(reactContext, it) == PackageManager.PERMISSION_GRANTED
    }
    promise.resolve(granted)
  }

  @ReactMethod
  fun requestPermissions(promise: Promise) {
    val activity = currentActivity as? PermissionAwareActivity
    if (activity == null) {
      promise.resolve(false)
      return
    }
    permissionPromise = promise
    activity.requestPermissions(requiredPermissions(), PERMISSION_REQUEST_CODE, this)
  }

  override fun onRequestPermissionsResult(
    requestCode: Int,
    permissions: Array<String>,
    grantResults: IntArray
  ): Boolean {
    if (requestCode != PERMISSION_REQUEST_CODE) return false
    val granted = grantResults.isNotEmpty() && grantResults.all { it == PackageManager.PERMISSION_GRANTED }
    permissionPromise?.resolve(granted)
    permissionPromise = null
    return true
  }

  @ReactMethod
  fun startAdvertising(token: String, promise: Promise) {
    val adapter = bluetoothManager?.adapter
    if (adapter == null || !adapter.isEnabled) {
      promise.reject("bluetooth-unavailable", "Le Bluetooth n'est pas activé sur cet appareil.")
      return
    }
    val leAdvertiser = adapter.bluetoothLeAdvertiser
    if (leAdvertiser == null) {
      promise.reject("ble-unsupported", "Cet appareil ne supporte pas l'annonce BLE.")
      return
    }
    advertiser = leAdvertiser

    val settings = AdvertiseSettings.Builder()
      .setAdvertiseMode(AdvertiseSettings.ADVERTISE_MODE_LOW_LATENCY)
      .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
      .setConnectable(false)
      .build()
    val data = AdvertiseData.Builder()
      .setIncludeDeviceName(false)
      .addServiceUuid(PRESENCE_SERVICE_UUID)
      .addServiceData(PRESENCE_SERVICE_UUID, token.toByteArray(Charsets.UTF_8))
      .build()

    val callback = object : AdvertiseCallback() {
      override fun onStartSuccess(settingsInEffect: AdvertiseSettings?) {
        promise.resolve(true)
      }
      override fun onStartFailure(errorCode: Int) {
        promise.reject("advertise-failed", "Échec du démarrage de l'annonce BLE (code $errorCode).")
      }
    }
    advertiseCallback = callback

    try {
      leAdvertiser.startAdvertising(settings, data, callback)
    } catch (e: SecurityException) {
      promise.reject("permission-denied", "Permission Bluetooth manquante pour annoncer.")
    }
  }

  @ReactMethod
  fun stopAdvertising(promise: Promise) {
    try {
      advertiseCallback?.let { advertiser?.stopAdvertising(it) }
    } catch (e: SecurityException) {
      // Permission retirée entre-temps par l'utilisateur : rien à faire.
    }
    advertiseCallback = null
    promise.resolve(null)
  }

  @ReactMethod
  fun startScanning(promise: Promise) {
    val leScanner = bluetoothManager?.adapter?.bluetoothLeScanner
    if (leScanner == null) {
      promise.reject("ble-unsupported", "Le scan BLE est indisponible sur cet appareil.")
      return
    }
    scanner = leScanner

    val filter = ScanFilter.Builder().setServiceUuid(PRESENCE_SERVICE_UUID).build()
    val settings = ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).build()

    val callback = object : ScanCallback() {
      override fun onScanResult(callbackType: Int, result: ScanResult) {
        val serviceData = result.scanRecord?.getServiceData(PRESENCE_SERVICE_UUID) ?: return
        val token = String(serviceData, Charsets.UTF_8)
        val map = Arguments.createMap()
        map.putString("token", token)
        map.putInt("rssi", result.rssi)
        reactContext
          .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
          .emit("PresenceNearbyDeviceFound", map)
      }
      // onScanFailed : le scan tourne en tâche de fond sans promise à tenir
      // ouverte, on ne peut pas la rejeter après coup — pas d'action ici.
    }
    scanCallback = callback

    try {
      leScanner.startScan(listOf(filter), settings, callback)
      promise.resolve(true)
    } catch (e: SecurityException) {
      promise.reject("permission-denied", "Permission Bluetooth manquante pour scanner.")
    }
  }

  @ReactMethod
  fun stopScanning(promise: Promise) {
    try {
      scanCallback?.let { scanner?.stopScan(it) }
    } catch (e: SecurityException) {
      // Permission retirée entre-temps par l'utilisateur : rien à faire.
    }
    scanCallback = null
    promise.resolve(null)
  }

  // Requis par NativeEventEmitter côté JS (RCTEventEmitter attend ces deux
  // méthodes même quand on ne s'en sert pas pour gérer nous-mêmes le compte
  // d'abonnés).
  @ReactMethod
  fun addListener(eventName: String) {}

  @ReactMethod
  fun removeListeners(count: Int) {}

  companion object {
    private const val PERMISSION_REQUEST_CODE = 8422

    // UUID propre à Présence, choisi arbitrairement (pas un UUID Bluetooth
    // SIG enregistré) : suffisant puisqu'on filtre déjà côté JS sur l'uid
    // attendu du proche recherché.
    private val PRESENCE_SERVICE_UUID = ParcelUuid.fromString("8f0f1b2e-8f0a-4a34-9b3c-8e2f9f7f3a10")
  }
}

/*
AndroidManifest.xml — à ajouter (en plus des permissions d'AppBlockerModule) :

<uses-permission android:name="android.permission.BLUETOOTH_ADVERTISE" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN"
    android:usesPermissionFlags="neverForLocation" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"
    android:maxSdkVersion="30" />

`neverForLocation` sur BLUETOOTH_SCAN est légitime ici : on ne déduit jamais
la position GPS de l'utilisateur à partir du scan, seulement "un proche est
à portée BLE ou non". Ça évite d'avoir à demander ACCESS_FINE_LOCATION sur
Android 12+ (elle reste nécessaire uniquement sur Android < 12, d'où le
`maxSdkVersion="30"`).

N'oublie pas d'enregistrer ce module dans le package React Native généré par
`expo prebuild` (fichier ...MainApplication.kt / un ReactPackage listant
AppBlockerModule ET ProximityModule).
*/
