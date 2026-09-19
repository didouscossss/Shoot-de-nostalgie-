// ---------------------------------------------------------------------------
// Catalogue des réseaux sociaux à défilement infini ("scrolling") ciblés par
// le blocage. Plutôt que de proposer TOUTES les apps installées (comme un
// gestionnaire de temps d'écran générique), on ne propose que celles-ci —
// c'est le cœur du produit : mettre de côté le scroll, pas n'importe quelle
// app (la calculatrice ou la météo n'ont rien à faire ici).
// ---------------------------------------------------------------------------

export interface SocialAppOption {
  packageName: string;
  label: string;
}

export const SCROLLING_SOCIAL_APPS: SocialAppOption[] = [
  { packageName: "com.zhiliaoapp.musically", label: "TikTok" },
  { packageName: "com.ss.android.ugc.trill", label: "TikTok (build international)" },
  { packageName: "com.instagram.android", label: "Instagram" },
  { packageName: "com.facebook.katana", label: "Facebook" },
  { packageName: "com.twitter.android", label: "X (Twitter)" },
  { packageName: "com.snapchat.android", label: "Snapchat" },
  { packageName: "com.google.android.youtube", label: "YouTube (Shorts)" },
  { packageName: "com.reddit.frontpage", label: "Reddit" },
  { packageName: "com.pinterest", label: "Pinterest" },
  { packageName: "com.linkedin.android", label: "LinkedIn" },
];
