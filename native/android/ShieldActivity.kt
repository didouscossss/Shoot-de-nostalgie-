// ---------------------------------------------------------------------------
// Écran affiché par-dessus une app bloquée, lancé par
// AppBlockerAccessibilityService.kt quand une app de la liste bloquée passe
// au premier plan. Construit en code (pas de layout XML) pour rester un
// fichier autonome.
//
// Le ton reste positif, jamais culpabilisant (voir la philosophie produit
// dans le README) : pas de minuteur qui décompte, pas de "tu as perdu du
// temps" — juste un rappel chaleureux et un chemin de retour vers l'app.
//
// ⚠️ NON COMPILÉ NI TESTÉ dans cet environnement (pas de SDK Android/
// émulateur disponible ici). Code de référence à vérifier/adapter.
// ---------------------------------------------------------------------------

package com.presenceapp

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.view.Gravity
import android.view.WindowManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView

class ShieldActivity : Activity() {

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    window.addFlags(
      WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
    )

    val root = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER
      setBackgroundColor(Color.parseColor("#1b1a2e"))
      val padding = (48 * resources.displayMetrics.density).toInt()
      setPadding(padding, padding, padding, padding)
    }

    val emoji = TextView(this).apply {
      text = "💛"
      textSize = 48f
      gravity = Gravity.CENTER
    }

    val title = TextView(this).apply {
      text = "Quelqu'un que tu apprécies est avec toi"
      setTextColor(Color.parseColor("#f5f2ff"))
      textSize = 20f
      gravity = Gravity.CENTER
      val vPad = (24 * resources.displayMetrics.density).toInt()
      setPadding(0, vPad, 0, 8)
    }

    val subtitle = TextView(this).apply {
      text = "Cette appli attendra — profite du moment."
      setTextColor(Color.parseColor("#a79fc2"))
      textSize = 14f
      gravity = Gravity.CENTER
      val vPad = (24 * resources.displayMetrics.density).toInt()
      setPadding(0, 0, 0, vPad)
    }

    val button = Button(this).apply {
      text = "Revenir à Présence"
      setBackgroundColor(Color.parseColor("#ffb26b"))
      setTextColor(Color.parseColor("#1b1a2e"))
      setOnClickListener { returnToApp() }
    }

    root.addView(emoji)
    root.addView(title)
    root.addView(subtitle)
    root.addView(button)
    setContentView(root)
  }

  // Le retour arrière ramène normalement à l'app bloquée en arrière-plan :
  // on le détourne explicitement vers Présence pour rester cohérent avec le
  // bouton ci-dessus, plutôt que de laisser revenir sur l'app mise de côté.
  @Deprecated("Deprecated in Java")
  override fun onBackPressed() {
    returnToApp()
  }

  private fun returnToApp() {
    val intent = packageManager.getLaunchIntentForPackage(packageName)
    intent?.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
    if (intent != null) startActivity(intent)
    finish()
  }
}

/*
AndroidManifest.xml — à ajouter :

<activity
    android:name=".ShieldActivity"
    android:exported="false"
    android:theme="@android:style/Theme.NoTitleBar.Fullscreen"
    android:excludeFromRecents="true"
    android:launchMode="singleTask" />
*/
