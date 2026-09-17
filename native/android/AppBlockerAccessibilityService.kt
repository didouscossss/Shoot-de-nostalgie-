// ---------------------------------------------------------------------------
// Service d'accessibilité : détecte l'app au premier plan et affiche un
// écran "Shield" par-dessus dès qu'une app de la liste bloquée s'ouvre.
//
// ⚠️ NON COMPILÉ NI TESTÉ ici (pas de SDK Android dans cet environnement).
// ---------------------------------------------------------------------------

package com.presenceapp

import android.accessibilityservice.AccessibilityService
import android.content.Context
import android.content.Intent
import android.view.accessibility.AccessibilityEvent

class AppBlockerAccessibilityService : AccessibilityService() {

  override fun onAccessibilityEvent(event: AccessibilityEvent?) {
    val packageName = event?.packageName?.toString() ?: return
    if (packageName == applicationContext.packageName) return // jamais se bloquer soi-même

    val prefs = applicationContext.getSharedPreferences("presence_blocklist", Context.MODE_PRIVATE)
    val blocked = prefs.getStringSet("blocked", emptySet()) ?: emptySet()

    if (blocked.contains(packageName)) {
      val shieldIntent = Intent(this, ShieldActivity::class.java).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
      }
      startActivity(shieldIntent)
    }
  }

  override fun onInterrupt() {}
}

/*
res/xml/accessibility_service_config.xml — à créer :

<?xml version="1.0" encoding="utf-8"?>
<accessibility-service xmlns:android="http://schemas.android.com/apk/res/android"
    android:accessibilityEventTypes="typeWindowStateChanged"
    android:accessibilityFeedbackType="feedbackGeneric"
    android:accessibilityFlags="flagDefault"
    android:canRetrieveWindowContent="false"
    android:notificationTimeout="100" />

ShieldActivity : une simple Activity plein écran, thème transparent/overlay,
qui affiche un message chaleureux ("Quelqu'un que tu apprécies est avec toi
— profite du moment 💛") avec un bouton "Revenir à Présence" qui ramène vers
l'app principale. Volontairement pas construite ici (c'est de la UI native
simple, à faire directement dans le projet Android généré).
*/
