// ---------------------------------------------------------------------------
// Illustrations vectorielles (SVG dessinées à la main) pour les objets les
// plus emblématiques. Pas de photo réelle : ce sont des dessins originaux,
// stylisés façon icône, sans dépendance réseau ni risque de droit d'auteur.
// Clé = nom exact de l'objet dans script.js. Les objets non listés ici
// gardent leur emoji dans la carte.
// ---------------------------------------------------------------------------

const ICONS = {
  "Juke-box": `
    <svg viewBox="0 0 120 120">
      <path d="M30 108V55c0-16 13-29 30-29s30 13 30 29v53z" fill="#c0392b"/>
      <path d="M40 108V58c0-10 9-18 20-18s20 8 20 18v50z" fill="#f4e3c1"/>
      <circle cx="60" cy="52" r="13" fill="#2c3e50"/>
      <circle cx="60" cy="52" r="6" fill="#f4e3c1"/>
      <rect x="45" y="78" width="30" height="6" rx="2" fill="#f1c40f"/>
      <rect x="45" y="88" width="30" height="6" rx="2" fill="#27ae60"/>
      <rect x="45" y="98" width="30" height="6" rx="2" fill="#2980b9"/>
      <rect x="26" y="104" width="68" height="6" rx="2" fill="#7f2315"/>
    </svg>`,

  "Vélosolex": `
    <svg viewBox="0 0 120 120">
      <circle cx="34" cy="90" r="16" fill="none" stroke="#2c2c2c" stroke-width="5"/>
      <circle cx="90" cy="90" r="16" fill="none" stroke="#2c2c2c" stroke-width="5"/>
      <path d="M34 90 L58 55 L80 55 L90 90" fill="none" stroke="#7f8c8d" stroke-width="4"/>
      <path d="M58 55 L46 90" stroke="#7f8c8d" stroke-width="4"/>
      <rect x="52" y="40" width="26" height="15" rx="4" fill="#c0392b"/>
      <path d="M58 55 L50 40" stroke="#2c2c2c" stroke-width="4"/>
      <path d="M34 40 L58 40" stroke="#2c2c2c" stroke-width="4"/>
    </svg>`,

  "Coccinelle Volkswagen": `
    <svg viewBox="0 0 120 120">
      <path d="M15 82 Q15 45 60 42 Q105 45 105 82 Z" fill="#2e86ab"/>
      <path d="M32 78 Q34 58 60 56 Q86 58 88 78 Z" fill="#bfe3f0"/>
      <circle cx="34" cy="86" r="12" fill="#1c1c1c"/>
      <circle cx="86" cy="86" r="12" fill="#1c1c1c"/>
      <rect x="14" y="80" width="92" height="8" rx="4" fill="#1c5d7a"/>
    </svg>`,

  "La 2 CV Citroën": `
    <svg viewBox="0 0 120 120">
      <path d="M12 86 Q14 55 40 52 L46 44 L84 44 L92 56 Q108 58 108 86 Z" fill="#b0b7a8"/>
      <path d="M48 52 L56 44 M64 52 L72 44" stroke="#7c8272" stroke-width="3"/>
      <rect x="46" y="56" width="34" height="16" rx="2" fill="#dfe6d8"/>
      <circle cx="34" cy="90" r="11" fill="#1c1c1c"/>
      <circle cx="92" cy="90" r="11" fill="#1c1c1c"/>
      <rect x="12" y="84" width="96" height="6" rx="3" fill="#8f9686"/>
    </svg>`,

  "Poupée Barbie": `
    <svg viewBox="0 0 120 120">
      <circle cx="60" cy="34" r="16" fill="#f2c199"/>
      <path d="M44 26 Q60 6 76 26 Q80 40 70 40 L50 40 Q40 40 44 26" fill="#f4d35e"/>
      <path d="M46 50 L74 50 L82 100 L38 100 Z" fill="#ff6f91"/>
      <rect x="52" y="98" width="6" height="14" fill="#f2c199"/>
      <rect x="62" y="98" width="6" height="14" fill="#f2c199"/>
      <path d="M46 50 Q60 62 74 50" fill="none" stroke="#e85c7a" stroke-width="3"/>
    </svg>`,

  "Transistor radio": `
    <svg viewBox="0 0 120 120">
      <rect x="22" y="34" width="76" height="54" rx="6" fill="#d9772e"/>
      <circle cx="46" cy="61" r="15" fill="#2c2c2c"/>
      <circle cx="46" cy="61" r="6" fill="#f4e3c1"/>
      <rect x="68" y="48" width="20" height="6" rx="3" fill="#f4e3c1"/>
      <rect x="68" y="60" width="20" height="6" rx="3" fill="#f4e3c1"/>
      <rect x="68" y="72" width="12" height="6" rx="3" fill="#f4e3c1"/>
      <path d="M30 34 L30 22 M90 34 L90 22" stroke="#2c2c2c" stroke-width="4"/>
    </svg>`,

  "Baby-foot": `
    <svg viewBox="0 0 120 120">
      <rect x="14" y="30" width="92" height="60" rx="4" fill="#2f9e44"/>
      <rect x="14" y="30" width="92" height="60" rx="4" fill="none" stroke="#f4e3c1" stroke-width="3"/>
      <line x1="60" y1="30" x2="60" y2="90" stroke="#f4e3c1" stroke-width="2"/>
      <line x1="30" y1="30" x2="30" y2="90" stroke="#1c1c1c" stroke-width="4"/>
      <line x1="90" y1="30" x2="90" y2="90" stroke="#1c1c1c" stroke-width="4"/>
      <circle cx="30" cy="45" r="3.5" fill="#f4e3c1"/>
      <circle cx="30" cy="60" r="3.5" fill="#f4e3c1"/>
      <circle cx="30" cy="75" r="3.5" fill="#f4e3c1"/>
      <circle cx="90" cy="45" r="3.5" fill="#f4e3c1"/>
      <circle cx="90" cy="60" r="3.5" fill="#f4e3c1"/>
      <circle cx="90" cy="75" r="3.5" fill="#f4e3c1"/>
      <circle cx="60" cy="60" r="4" fill="#fff"/>
    </svg>`,

  "Boule à facettes disco": `
    <svg viewBox="0 0 120 120">
      <line x1="60" y1="10" x2="60" y2="34" stroke="#7f8c8d" stroke-width="2"/>
      <circle cx="60" cy="66" r="32" fill="#cfd8dc"/>
      <path d="M28 66 H92 M60 34 V98 M38 44 L82 88 M82 44 L38 88" stroke="#90a4ae" stroke-width="1.5"/>
      <circle cx="45" cy="50" r="2" fill="#fff"/>
      <circle cx="75" cy="55" r="2" fill="#fff"/>
      <circle cx="55" cy="80" r="2" fill="#fff"/>
      <path d="M15 30 L22 34 M105 30 L98 34 M20 90 L26 86" stroke="#f1c40f" stroke-width="3" stroke-linecap="round"/>
    </svg>`,

  "Console Pong": `
    <svg viewBox="0 0 120 120">
      <rect x="16" y="24" width="88" height="60" rx="4" fill="#1c1c1c"/>
      <rect x="24" y="32" width="72" height="44" fill="#0d3b0d"/>
      <rect x="30" y="42" width="4" height="14" fill="#7bed9f"/>
      <rect x="86" y="52" width="4" height="14" fill="#7bed9f"/>
      <circle cx="60" cy="54" r="3" fill="#7bed9f"/>
      <rect x="40" y="92" width="14" height="8" rx="2" fill="#555"/>
      <rect x="66" y="92" width="14" height="8" rx="2" fill="#555"/>
    </svg>`,

  "Walkman": `
    <svg viewBox="0 0 120 120">
      <rect x="30" y="28" width="60" height="66" rx="6" fill="#3b3b3b"/>
      <rect x="38" y="36" width="44" height="26" rx="3" fill="#dcdcdc"/>
      <circle cx="50" cy="49" r="7" fill="#3b3b3b"/>
      <circle cx="70" cy="49" r="7" fill="#3b3b3b"/>
      <rect x="40" y="68" width="40" height="6" rx="2" fill="#f1c40f"/>
      <rect x="40" y="78" width="18" height="8" rx="2" fill="#e74c3c"/>
      <rect x="62" y="78" width="18" height="8" rx="2" fill="#2980b9"/>
      <path d="M38 28 Q60 8 82 28" fill="none" stroke="#3b3b3b" stroke-width="4"/>
      <circle cx="38" cy="28" r="5" fill="#3b3b3b"/>
      <circle cx="82" cy="28" r="5" fill="#3b3b3b"/>
    </svg>`,

  "Rubik's Cube": `
    <svg viewBox="0 0 120 120">
      <g stroke="#1c1c1c" stroke-width="2">
        <rect x="20" y="20" width="26" height="26" fill="#e74c3c"/>
        <rect x="47" y="20" width="26" height="26" fill="#f1c40f"/>
        <rect x="74" y="20" width="26" height="26" fill="#2980b9"/>
        <rect x="20" y="47" width="26" height="26" fill="#27ae60"/>
        <rect x="47" y="47" width="26" height="26" fill="#f4e3c1"/>
        <rect x="74" y="47" width="26" height="26" fill="#e67e22"/>
        <rect x="20" y="74" width="26" height="26" fill="#f1c40f"/>
        <rect x="47" y="74" width="26" height="26" fill="#e74c3c"/>
        <rect x="74" y="74" width="26" height="26" fill="#2980b9"/>
      </g>
    </svg>`,

  "Minitel": `
    <svg viewBox="0 0 120 120">
      <rect x="26" y="24" width="68" height="44" rx="4" fill="#e8dfc8"/>
      <rect x="33" y="30" width="54" height="32" rx="2" fill="#1c2b4a"/>
      <rect x="40" y="38" width="30" height="4" fill="#7bed9f"/>
      <rect x="40" y="46" width="20" height="4" fill="#7bed9f"/>
      <rect x="20" y="72" width="80" height="22" rx="3" fill="#d7cdb0"/>
      <g fill="#a89c78">
        <rect x="26" y="77" width="8" height="6" rx="1"/>
        <rect x="38" y="77" width="8" height="6" rx="1"/>
        <rect x="50" y="77" width="8" height="6" rx="1"/>
        <rect x="62" y="77" width="8" height="6" rx="1"/>
        <rect x="74" y="77" width="8" height="6" rx="1"/>
        <rect x="86" y="77" width="8" height="6" rx="1"/>
        <rect x="26" y="85" width="8" height="6" rx="1"/>
        <rect x="38" y="85" width="8" height="6" rx="1"/>
        <rect x="50" y="85" width="8" height="6" rx="1"/>
      </g>
    </svg>`,

  "Nintendo NES": `
    <svg viewBox="0 0 120 120">
      <rect x="16" y="46" width="88" height="30" rx="4" fill="#d8d8d8"/>
      <rect x="16" y="46" width="88" height="10" fill="#7f7f7f"/>
      <rect x="40" y="52" width="30" height="16" rx="2" fill="#3b3b3b"/>
      <circle cx="88" cy="61" r="6" fill="#e74c3c"/>
      <rect x="30" y="90" width="60" height="18" rx="3" fill="#e0e0e0"/>
      <rect x="36" y="94" width="12" height="12" fill="#3b3b3b"/>
      <circle cx="68" cy="99" r="4" fill="#c0392b"/>
      <circle cx="80" cy="99" r="4" fill="#c0392b"/>
    </svg>`,

  "Game Boy": `
    <svg viewBox="0 0 120 120">
      <rect x="34" y="14" width="52" height="94" rx="8" fill="#c9c9c9"/>
      <rect x="41" y="24" width="38" height="32" rx="2" fill="#8fae3c"/>
      <rect x="45" y="28" width="30" height="24" fill="#33481f"/>
      <circle cx="45" cy="72" r="4" fill="#3b3b3b"/>
      <path d="M38 82 h14 M45 75 v14" stroke="#3b3b3b" stroke-width="4"/>
      <circle cx="70" cy="80" r="5" fill="#a13a5c"/>
      <circle cx="82" cy="86" r="5" fill="#a13a5c"/>
      <rect x="44" y="98" width="10" height="3" fill="#8f8f8f"/>
      <rect x="64" y="98" width="10" height="3" fill="#8f8f8f"/>
    </svg>`,

  "Tamagotchi": `
    <svg viewBox="0 0 120 120">
      <ellipse cx="60" cy="60" rx="34" ry="40" fill="#f2e14c"/>
      <circle cx="60" cy="50" r="17" fill="#3b3b3b"/>
      <circle cx="60" cy="50" r="13" fill="#bfe6c4"/>
      <circle cx="54" cy="48" r="2.5" fill="#2c2c2c"/>
      <circle cx="66" cy="48" r="2.5" fill="#2c2c2c"/>
      <path d="M54 55 Q60 59 66 55" stroke="#2c2c2c" stroke-width="2" fill="none"/>
      <circle cx="46" cy="86" r="5" fill="#3b3b3b"/>
      <circle cx="60" cy="90" r="5" fill="#3b3b3b"/>
      <circle cx="74" cy="86" r="5" fill="#3b3b3b"/>
    </svg>`,

  "Cartes Pokémon": `
    <svg viewBox="0 0 120 120">
      <rect x="38" y="18" width="52" height="72" rx="5" fill="#2a75bb" transform="rotate(8 60 60)"/>
      <rect x="30" y="22" width="52" height="72" rx="5" fill="#f4e3c1" stroke="#f1c40f" stroke-width="4"/>
      <rect x="38" y="30" width="36" height="26" rx="3" fill="#a6d8ff"/>
      <circle cx="56" cy="43" r="9" fill="#f1c40f" stroke="#e67e22" stroke-width="2"/>
      <rect x="38" y="62" width="36" height="5" rx="2" fill="#d0c39a"/>
      <rect x="38" y="70" width="36" height="5" rx="2" fill="#d0c39a"/>
      <rect x="38" y="78" width="20" height="5" rx="2" fill="#d0c39a"/>
    </svg>`,

  "Sony PlayStation": `
    <svg viewBox="0 0 120 120">
      <rect x="22" y="40" width="76" height="50" rx="6" fill="#dcdcdc"/>
      <rect x="22" y="40" width="76" height="14" rx="6" fill="#bdbdbd"/>
      <circle cx="82" cy="66" r="8" fill="#c9c9c9" stroke="#8f8f8f" stroke-width="2"/>
      <path d="M42 58 v16 M34 66 h16" stroke="#3b3b3b" stroke-width="3"/>
      <path d="M60 26 l4 8 h-8 z" fill="#7fd1e0"/>
      <circle cx="76" cy="30" r="4" fill="#f19bc9"/>
    </svg>`,

  "Nokia à clapet / 3310": `
    <svg viewBox="0 0 120 120">
      <rect x="40" y="14" width="40" height="92" rx="10" fill="#3b4b3b"/>
      <rect x="46" y="24" width="28" height="24" rx="2" fill="#a6c98a"/>
      <g fill="#dcdcdc">
        <circle cx="52" cy="60" r="5"/><circle cx="68" cy="60" r="5"/>
        <circle cx="52" cy="74" r="5"/><circle cx="68" cy="74" r="5"/>
        <circle cx="52" cy="88" r="5"/><circle cx="68" cy="88" r="5"/>
      </g>
      <rect x="56" y="10" width="8" height="6" fill="#1c1c1c"/>
    </svg>`,

  "iPod": `
    <svg viewBox="0 0 120 120">
      <rect x="38" y="12" width="44" height="96" rx="9" fill="#f4f4f4" stroke="#d0d0d0" stroke-width="2"/>
      <rect x="46" y="22" width="28" height="24" rx="2" fill="#3b3b3b"/>
      <circle cx="60" cy="80" r="20" fill="#eaeaea" stroke="#d0d0d0" stroke-width="2"/>
      <circle cx="60" cy="80" r="6" fill="#dcdcdc"/>
    </svg>`,

  "Nintendo DS": `
    <svg viewBox="0 0 120 120">
      <rect x="18" y="14" width="46" height="38" rx="4" fill="#c9c9c9"/>
      <rect x="24" y="20" width="34" height="26" fill="#3b3b3b"/>
      <path d="M40 52 L60 62 L40 72 Z" fill="#9a9a9a"/>
      <rect x="56" y="58" width="46" height="46" rx="4" fill="#c9c9c9"/>
      <rect x="62" y="64" width="34" height="26" fill="#3b3b3b"/>
      <circle cx="66" cy="96" r="4" fill="#3b3b3b"/>
      <circle cx="92" cy="96" r="4" fill="#a13a5c"/>
    </svg>`,

  "Wii et la Wiimote": `
    <svg viewBox="0 0 120 120">
      <rect x="46" y="14" width="28" height="86" rx="8" fill="#f4f4f4" stroke="#dcdcdc" stroke-width="2"/>
      <rect x="52" y="26" width="16" height="12" rx="2" fill="#a6c9ff"/>
      <circle cx="60" cy="52" r="6" fill="#eaeaea" stroke="#c9c9c9" stroke-width="1.5"/>
      <circle cx="60" cy="68" r="4" fill="#c0392b"/>
      <circle cx="60" cy="90" r="3" fill="#dcdcdc"/>
      <rect x="70" y="94" width="18" height="6" rx="3" fill="#c9c9c9" transform="rotate(30 70 94)"/>
    </svg>`,

  "Smartphones et selfies": `
    <svg viewBox="0 0 120 120">
      <rect x="38" y="14" width="44" height="86" rx="8" fill="#2c2c2c"/>
      <rect x="42" y="20" width="36" height="66" rx="2" fill="#8ecbe6"/>
      <circle cx="60" cy="96" r="4" fill="#555"/>
      <circle cx="60" cy="45" r="12" fill="#f2c199"/>
      <path d="M48 68 Q60 56 72 68 L72 76 L48 76 Z" fill="#e67e22"/>
    </svg>`,

  "Fidget spinner": `
    <svg viewBox="0 0 120 120">
      <g fill="#8e44ad">
        <circle cx="60" cy="30" r="15"/>
        <circle cx="34" cy="80" r="15"/>
        <circle cx="86" cy="80" r="15"/>
      </g>
      <path d="M60 45 L45 72 L75 72 Z" fill="#5e3370"/>
      <circle cx="60" cy="60" r="12" fill="#dcdcdc" stroke="#9a9a9a" stroke-width="2"/>
      <circle cx="60" cy="60" r="4" fill="#3b3b3b"/>
    </svg>`,

  "Pokémon GO": `
    <svg viewBox="0 0 120 120">
      <rect x="38" y="14" width="44" height="86" rx="8" fill="#2c2c2c"/>
      <rect x="42" y="20" width="36" height="66" rx="2" fill="#bfe6c4"/>
      <circle cx="60" cy="48" r="14" fill="#fff" stroke="#2c2c2c" stroke-width="2"/>
      <path d="M46 48 h28" stroke="#2c2c2c" stroke-width="2"/>
      <circle cx="60" cy="48" r="4" fill="#e74c3c" stroke="#2c2c2c" stroke-width="1.5"/>
      <path d="M54 66 q6 -10 12 0 q-6 14 -12 0" fill="#e74c3c"/>
    </svg>`,

  "TikTok": `
    <svg viewBox="0 0 120 120">
      <rect x="38" y="14" width="44" height="86" rx="8" fill="#111"/>
      <rect x="42" y="20" width="36" height="66" rx="2" fill="#1c1c1c"/>
      <path d="M66 34 q0 14 12 16 v10 q-8 0 -12 -5 v18 a12 12 0 1 1 -10 -12" fill="none" stroke="#25f4ee" stroke-width="4"/>
      <path d="M64 32 q0 14 12 16 v10 q-8 0 -12 -5 v18 a12 12 0 1 1 -10 -12" fill="none" stroke="#fe2c55" stroke-width="4"/>
    </svg>`,

  "IA générative": `
    <svg viewBox="0 0 120 120">
      <rect x="34" y="38" width="52" height="42" rx="10" fill="#5b7fdb"/>
      <circle cx="50" cy="58" r="6" fill="#fff"/>
      <circle cx="70" cy="58" r="6" fill="#fff"/>
      <rect x="56" y="20" width="8" height="16" fill="#5b7fdb"/>
      <circle cx="60" cy="16" r="5" fill="#f1c40f"/>
      <path d="M20 96 q40 -20 80 0" fill="none" stroke="#dcdcdc" stroke-width="4"/>
      <circle cx="20" cy="96" r="4" fill="#5b7fdb"/>
      <circle cx="100" cy="96" r="4" fill="#5b7fdb"/>
    </svg>`,

  "Jeux Olympiques de Paris": `
    <svg viewBox="0 0 120 120">
      <path d="M50 20 L70 20 L78 42 L60 56 L42 42 Z" fill="#8ea9c9"/>
      <circle cx="60" cy="72" r="26" fill="#f1c40f" stroke="#c9971f" stroke-width="3"/>
      <path d="M60 56 L68 72 L60 88 L52 72 Z" fill="#fff5d6"/>
      <g stroke-width="4" fill="none">
        <circle cx="40" cy="60" r="8" stroke="#0085c7"/>
        <circle cx="55" cy="60" r="8" stroke="#f4c300"/>
        <circle cx="70" cy="60" r="8" stroke="#000"/>
      </g>
    </svg>`,
};
