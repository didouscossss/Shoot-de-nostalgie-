// ---------------------------------------------------------------------------
// Calcul des Moments gagnés. Valeurs volontairement simples et arrondies —
// À ÉQUILIBRER PLUS TARD, ce ne sont pas des chiffres définitifs (comme
// demandé). Fonctions pures et testables indépendamment de Firebase/UI.
// ---------------------------------------------------------------------------

/** Moments gagnés pour une session Présence d'une durée donnée. */
export function computeMomentsForSession(durationSeconds: number): number {
  const minutes = durationSeconds / 60;

  if (minutes < 15) return 0; // trop court pour compter (évite les sessions de quelques secondes)
  if (minutes < 30) return 20;
  if (minutes < 60) return 50;
  if (minutes < 120) return 120;

  // Au-delà de 2h : bonus dégressif par tranche de 30 min supplémentaires.
  const extraHalfHours = Math.floor((minutes - 120) / 30);
  return 120 + extraHalfHours * 40;
}

/** Bonus de régularité selon le nombre de sessions déjà réalisées cette semaine. */
export function computeWeeklyStreakBonus(sessionsThisWeekBeforeThisOne: number): number {
  const total = sessionsThisWeekBeforeThisOne + 1;
  if (total >= 5) return 150;
  if (total >= 3) return 60;
  if (total >= 2) return 20;
  return 0;
}

/** Moments totaux (session + régularité) pour une session qui vient de se terminer. */
export function computeTotalMomentsEarned(
  durationSeconds: number,
  sessionsThisWeekBeforeThisOne: number
): number {
  return (
    computeMomentsForSession(durationSeconds) +
    computeWeeklyStreakBonus(sessionsThisWeekBeforeThisOne)
  );
}
