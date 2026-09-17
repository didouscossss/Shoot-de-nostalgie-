// ---------------------------------------------------------------------------
// Thème visuel — chaleureux et doux plutôt que néon agressif : l'app parle
// de présence et de compagnon, pas de compétition.
// ---------------------------------------------------------------------------

export const theme = {
  colors: {
    background: "#1b1a2e",
    surface: "#26243f",
    surfaceAlt: "#302d4f",
    text: "#f5f2ff",
    muted: "#a79fc2",
    accent: "#ffb26b", // chaleureux (coucher de soleil), pas néon
    accent2: "#7ee8c3", // vert doux (croissance, nature)
    danger: "#ff8a8a",
    border: "rgba(255,255,255,0.12)",
  },
  radius: 18,
  spacing: (n: number) => n * 8,
};

export type Theme = typeof theme;
