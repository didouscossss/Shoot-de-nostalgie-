// ---------------------------------------------------------------------------
// Shoot de Nostalgie — moteur de données
//
// Principe : chaque décennie a un "pool" d'objets/tendances cultes, chacun
// avec une année d'apparition réelle (introYear). Pour une année donnée :
//   1) les objets dont introYear === année sont mis en avant ("Nouveauté")
//   2) le reste de la sélection tourne parmi les objets déjà sortis
//      (de la décennie en cours + fin de la décennie précédente)
// Résultat : deux années, même proches, n'affichent jamais exactement la
// même combinaison, et chaque objet apparaît à partir de sa vraie date.
//
// En plus des objets, YEAR_EVENTS liste les faits marquants réels de chaque
// année (politique française, monde, disparitions, sport) pour resituer le
// contexte historique.
// ---------------------------------------------------------------------------

const TARGET_ITEMS = 9;

const DECADES = [
  {
    start: 1950,
    end: 1959,
    name: "Les années 50",
    tagline: "Juke-box, rock'n'roll et premières télés en noir et blanc.",
    theme: "theme-50s",
    pool: [
      { icon: "📻", name: "Poste radio à lampes", desc: "Le cœur du salon familial : on s'y presse chaque soir pour écouter feuilletons, variétés et informations. Il faut le laisser chauffer quelques secondes avant que le son n'arrive.", introYear: 1950 },
      { icon: "🎷", name: "Juke-box", desc: "La star des bars, des bals populaires et des débuts de fast-foods à l'américaine. On glisse une pièce, on choisit un disque, et toute la salle danse.", introYear: 1950 },
      { icon: "🚲", name: "Vélosolex", desc: "Le vélo à moteur auxiliaire monté sur la roue avant, fabriqué en France, qui motorise toute une génération de facteurs et d'ouvriers.", introYear: 1950 },
      { icon: "🚗", name: "Coccinelle Volkswagen", desc: "La petite voiture ronde au moteur à l'arrière, conçue en Allemagne, qui devient un symbole de la voiture populaire et fiable dans toute l'Europe.", introYear: 1950 },
      { icon: "📺", name: "Télévision noir et blanc", desc: "Un luxe rare réservé à quelques foyers aisés : les voisins se rassemblent devant l'unique poste du quartier pour suivre les premières émissions.", introYear: 1950 },
      { icon: "🚂", name: "Trains électriques Jouef", desc: "Le grand jouet que l'on installe sous le sapin de Noël, avec ses rails à assembler soi-même et sa petite locomotive qui fume.", introYear: 1951 },
      { icon: "🧊", name: "Frigidaire à une porte", desc: "L'électroménager qui change la vie des foyers français en permettant enfin de conserver les aliments sans glacière ni cave.", introYear: 1952 },
      { icon: "🛵", name: "Vespa et scooters italiens", desc: "Le deux-roues élégant venu d'Italie, avec sa carrosserie en coque qui protège du vent et de la crasse du moteur.", introYear: 1953 },
      { icon: "🥛", name: "Yaourts en pot de verre consigné", desc: "Le laitage que l'on rapporte à l'épicerie une fois le pot vide, à une époque où presque tout se vend en verre consigné.", introYear: 1953 },
      { icon: "💿", name: "Disques 45 tours", desc: "Le format qui lance le rock'n'roll en France : un petit disque avec un grand trou, parfait pour les nouveaux tourne-disques portables.", introYear: 1954 },
      { icon: "🍲", name: "Cocotte-minute SEB", desc: "L'autocuiseur français qui divise par trois le temps de cuisson des plats mijotés, révolutionnant la cuisine de millions de foyers.", introYear: 1954 },
      { icon: "🪆", name: "Poupées en porcelaine", desc: "Le jouet précieux que l'on n'ose presque pas toucher, offert pour une occasion spéciale et gardé en vitrine toute l'année.", introYear: 1955 },
      { icon: "🕺", name: "Rock'n'roll à la radio", desc: "Une musique venue des États-Unis qui affole les jeunes et scandalise leurs parents, entre Bill Haley et les premiers imitateurs français.", introYear: 1956 },
      { icon: "🎶", name: "Tourne-disque portable", desc: "Une petite valise avec un haut-parleur intégré qui permet d'emporter sa musique en pique-nique ou chez des amis.", introYear: 1957 },
      { icon: "👖", name: "Blue-jeans importés des États-Unis", desc: "Le pantalon en toile de denim, popularisé par le cinéma américain, qui commence à s'imposer chez les jeunes Français.", introYear: 1958 },
      { icon: "🍖", name: "Barbecue et vie pavillonnaire", desc: "Le symbole du nouveau mode de vie en lotissement, avec jardin et grill, qui se développe autour des grandes villes.", introYear: 1958 },
    ],
  },
  {
    start: 1960,
    end: 1969,
    name: "Les années 60",
    tagline: "Vinyles yéyé, Coccinelle et conquête spatiale.",
    theme: "theme-60s",
    pool: [
      { icon: "📻", name: "Transistor radio", desc: "La radio de poche, sans lampes ni fil, qui permet d'écouter les hits en vélo, à la plage ou en cachette sous la couette.", introYear: 1960 },
      { icon: "☎️", name: "Cabine téléphonique à jetons", desc: "Il faut faire la queue et garder sa monnaie pour passer un coup de fil depuis la rue, jeton après jeton.", introYear: 1960 },
      { icon: "🛵", name: "Mobylette", desc: "Le deux-roues Peugeot ou Motobécane qui donne son indépendance à toute une jeunesse dès 14 ans.", introYear: 1960 },
      { icon: "🧵", name: "Bracelets scoubidou", desc: "Des fils de plastique tressés en carrés ou en spirales, fabriqués à la chaîne à la récré et en colonie de vacances.", introYear: 1960 },
      { icon: "🚙", name: "La 2 CV Citroën", desc: "La voiture populaire française par excellence, économique et increvable, surnommée affectueusement \"deuche\".", introYear: 1960 },
      { icon: "👸", name: "Poupée Barbie", desc: "La poupée mannequin venue des États-Unis, avec sa garde-robe à collectionner, qui débarque dans les rayons de jouets français.", introYear: 1961 },
      { icon: "🔧", name: "Meccano", desc: "Le jeu de construction en pièces de métal perforées, boulons et écrous, pour bâtir grues et ponts miniatures.", introYear: 1962 },
      { icon: "🎤", name: "Salut les Copains et le yéyé", desc: "L'émission de radio culte qui rassemble des millions de jeunes auditeurs et lance la vague yéyé en France.", introYear: 1962 },
      { icon: "💿", name: "Disques yéyé", desc: "Sheila, Johnny Hallyday, Sylvie Vartan et France Gall font danser toute une jeunesse sur les tourne-disques familiaux.", introYear: 1963 },
      { icon: "👖", name: "Jean's Levi's 501", desc: "Le jean américain devient un vêtement de mode à part entière, plus seulement une tenue de travail.", introYear: 1965 },
      { icon: "👗", name: "Mini-jupe", desc: "La révolution mode lancée par la styliste Mary Quant, qui raccourcit les jupes et choque une partie de la société.", introYear: 1965 },
      { icon: "🛋️", name: "Mobilier en Skaï et formes rondes", desc: "Les fauteuils \"œuf\" et les canapés en similicuir coloré qui redessinent les salons modernes.", introYear: 1966 },
      { icon: "📺", name: "Télévision couleur", desc: "Les images passent enfin de la grisaille au relief des couleurs, avec la norme SECAM adoptée en France.", introYear: 1967 },
      { icon: "🚀", name: "Alunissage d'Apollo 11", desc: "L'humanité marche sur la Lune en direct à la télévision : Neil Armstrong et Buzz Aldrin captivent la planète entière.", introYear: 1969 },
      { icon: "✈️", name: "Concorde, le rêve supersonique", desc: "Le premier vol de l'avion franco-britannique qui promet de traverser l'Atlantique en un peu plus de trois heures.", introYear: 1969 },
    ],
  },
  {
    start: 1970,
    end: 1979,
    name: "Les années 70",
    tagline: "Baby-foot, disco et premiers jeux vidéo.",
    theme: "theme-70s",
    pool: [
      { icon: "⚽", name: "Baby-foot", desc: "Le meuble star des cafés, des caves et des colonies de vacances, autour duquel se jouent des tournois interminables.", introYear: 1970 },
      { icon: "🦘", name: "Ballon sauteur (Space Hopper)", desc: "Un gros ballon à oreilles sur lequel on s'assoit pour rebondir dans le jardin, très en vogue dans les cours de récré.", introYear: 1970 },
      { icon: "👖", name: "Pattes d'éléphant", desc: "Le jean évasé au niveau des chevilles, indissociable du look disco et funk de la décennie.", introYear: 1972 },
      { icon: "🧮", name: "Calculatrice de poche", desc: "L'objet qui sonne la fin programmée du calcul mental et des tables de logarithmes à l'école.", introYear: 1972 },
      { icon: "🕹️", name: "Console Pong", desc: "Les tout premiers pixels s'affichent sur l'écran de télé : une balle, deux raquettes, et des heures de duel en famille.", introYear: 1972 },
      { icon: "🎲", name: "Jeu de société Uno", desc: "Le jeu de cartes familial venu des États-Unis, simple à apprendre, qui s'invite dans toutes les soirées jeux.", introYear: 1973 },
      { icon: "👞", name: "Chaussures à semelles compensées", desc: "Les fameuses \"platform shoes\" qui font gagner plusieurs centimètres, portées aussi bien par les filles que par les garçons.", introYear: 1973 },
      { icon: "🎬", name: "Figurines Star Wars Kenner", desc: "Toute une génération rêve de sabres laser après la sortie du film, et se rue sur les petites figurines articulées à collectionner.", introYear: 1977 },
      { icon: "📡", name: "Talkie-walkie CB", desc: "\"Bien reçu, à vous\" : le nouveau langage codé des ados qui communiquent en direct depuis leur chambre ou leur voiture.", introYear: 1977 },
      { icon: "🚲", name: "BMX", desc: "Le petit vélo tout-terrain conçu pour les figures et le saut, qui débarque des États-Unis dans les cours d'école.", introYear: 1978 },
      { icon: "🪩", name: "Boule à facettes disco", desc: "L'ambiance dancefloor incontournable des soirées, sous les tubes de Bee Gees et de Claude François.", introYear: 1978 },
      { icon: "📼", name: "Premiers magnétoscopes", desc: "Un appareil encore très cher qui permet, pour la première fois, d'enregistrer une émission pour la regarder plus tard.", introYear: 1978 },
      { icon: "🛹", name: "Skateboard", desc: "La planche à roulettes venue de Californie, adoptée par toute une génération dans les parkings et les cours d'immeuble.", introYear: 1978 },
      { icon: "📻", name: "Cassette vierge pour enregistrer la radio", desc: "On colle son oreille au poste, doigt sur \"pause\", pour enregistrer son tube préféré sans le générique de l'animateur.", introYear: 1979 },
    ],
  },
  {
    start: 1980,
    end: 1989,
    name: "Les années 80",
    tagline: "Walkman, Minitel et néons synthwave.",
    theme: "theme-80s",
    pool: [
      { icon: "🎧", name: "Walkman", desc: "Le baladeur à cassette de Sony qui rend la musique enfin portable, casque sur les oreilles, dans la rue comme dans le bus.", introYear: 1980 },
      { icon: "🧩", name: "Rubik's Cube", desc: "Le casse-tête hongrois à 43 trillions de combinaisons qui rend fou le monde entier, avec ses championnats de vitesse.", introYear: 1980 },
      { icon: "🎮", name: "Game & Watch", desc: "La toute première console de poche de Nintendo, avec un seul jeu par appareil et un écran à cristaux liquides.", introYear: 1980 },
      { icon: "🍬", name: "Chewing-gum Malabar et autocollants", desc: "Le chewing-gum avec sa bande dessinée à l'intérieur de l'emballage et ses autocollants à collectionner.", introYear: 1980 },
      { icon: "📻", name: "Radio-cassette (ghetto blaster)", desc: "On le pose sur l'épaule et on met le son à fond dans la rue, symbole de toute une culture urbaine naissante.", introYear: 1981 },
      { icon: "💻", name: "Minitel", desc: "L'ancêtre français d'Internet, distribué gratuitement par France Télécom, qui permet de consulter l'annuaire et bien plus.", introYear: 1982 },
      { icon: "📼", name: "Cassette vierge TDK/Maxell", desc: "La cassette que l'on customise à la main avec son titre et sa pochette dessinée, pour faire la compilation parfaite.", introYear: 1982 },
      { icon: "🏃", name: "Legwarmers et sweat fluo", desc: "Le look aérobic inspiré des cassettes de fitness de Jane Fonda, avec bandeau et couleurs criardes.", introYear: 1983 },
      { icon: "👟", name: "Baskets montantes hip-hop", desc: "Les grosses baskets en cuir, lacets larges non serrés, adoptées par toute la culture hip-hop naissante.", introYear: 1984 },
      { icon: "📱", name: "Téléphone portable \"brique\"", desc: "Un pavé d'un kilo, antenne comprise, réservé à une poignée de privilégiés pour passer un appel depuis la rue.", introYear: 1984 },
      { icon: "🎀", name: "Bandana et gants sans doigts", desc: "Le look inspiré de Madonna, entre dentelle, bijoux fantaisie empilés et gants coupés aux doigts.", introYear: 1985 },
      { icon: "🖼️", name: "Cartes Panini à coller", desc: "L'album qu'il faut absolument compléter, en échangeant les doubles dans la cour d'école contre les vignettes manquantes.", introYear: 1985 },
      { icon: "💾", name: "Ordinateurs familiaux (Amstrad, C64)", desc: "Les premiers jeux vidéo à la maison, chargés depuis une cassette audio après de longues minutes d'attente.", introYear: 1985 },
      { icon: "🕹️", name: "Nintendo NES", desc: "Mario et Zelda débarquent dans les salons français avec leur manette rectangulaire à croix directionnelle.", introYear: 1986 },
      { icon: "🎮", name: "Console Sega Master System", desc: "La rivale de la NES, avec Alex Kidd, qui lance la grande rivalité Nintendo-Sega en France.", introYear: 1987 },
      { icon: "🧥", name: "Blouson en cuir façon Top Gun", desc: "Le blouson aviateur popularisé par Tom Cruise, adopté aussi bien en ville que pour aller au collège.", introYear: 1987 },
      { icon: "🐢", name: "Figurines Tortues Ninja", desc: "Cowabunga ! La déferlante de figurines venue des égouts de New York envahit les cours de récré.", introYear: 1988 },
    ],
  },
  {
    start: 1990,
    end: 1999,
    name: "Les années 90",
    tagline: "Pogs, cartes Pokémon et Tamagotchi.",
    theme: "theme-90s",
    pool: [
      { icon: "🎮", name: "Game Boy", desc: "Tetris et Mario tiennent enfin dans la poche, sur un petit écran vert qui a bercé toute une génération de trajets en voiture.", introYear: 1990 },
      { icon: "💽", name: "Discman", desc: "La musique CD à emporter partout, à condition de ne pas trop bouger pour éviter les sauts de lecture.", introYear: 1990 },
      { icon: "🕹️", name: "Super Nintendo", desc: "Mario Kart et Street Fighter II envahissent les salons, avec des graphismes en 16 bits qui impressionnent tout le monde.", introYear: 1992 },
      { icon: "🃏", name: "Cartes Magic : l'Assemblée", desc: "Le tout premier jeu de cartes à collectionner et à échanger, qui déchaîne les passions entre lycéens.", introYear: 1994 },
      { icon: "🖥️", name: "Cybercafé et premiers pas sur Internet", desc: "On paie à l'heure pour naviguer sur le tout jeune World Wide Web et lire ses premiers e-mails.", introYear: 1994 },
      { icon: "💿", name: "CD-ROM encyclopédies (Encarta)", desc: "L'encyclopédie multimédia sur un seul disque, avec vidéos et animations, qui remplace peu à peu les gros dictionnaires.", introYear: 1995 },
      { icon: "🀄", name: "Pogs et Tazos", desc: "De petits disques en carton illustrés que l'on empile et que l'on fait sauter d'un coup de \"slammer\" pour les gagner.", introYear: 1995 },
      { icon: "🛼", name: "Rollers en ligne", desc: "Tout le monde glisse dans la rue et au skatepark avec ses patins à roues alignées, protections aux genoux obligatoires.", introYear: 1995 },
      { icon: "🕹️", name: "Sony PlayStation", desc: "La console qui fait entrer le jeu vidéo dans une nouvelle dimension avec la 3D, portée par des hits comme Crash Bandicoot.", introYear: 1995 },
      { icon: "🎤", name: "Boys bands et Spice Girls", desc: "Posters punaisés sur les murs de chambre et cassettes usées à force d'être réécoutées en boucle.", introYear: 1996 },
      { icon: "🎒", name: "Cartable à roulettes", desc: "La solution miracle contre le mal de dos, que l'on traîne bruyamment dans les couloirs du collège.", introYear: 1997 },
      { icon: "🐣", name: "Tamagotchi", desc: "L'animal virtuel japonais qu'il faut nourrir, soigner et divertir toutes les heures, sous peine de le voir dépérir.", introYear: 1997 },
      { icon: "🎮", name: "Nintendo 64", desc: "Mario 64 en 3D fait l'effet d'une claque visuelle, avec une manette à la forme si particulière.", introYear: 1997 },
      { icon: "🎵", name: "Baladeur MP3 (Rio PMP300)", desc: "Un des tout premiers lecteurs MP3 grand public, capable de stocker environ une heure de musique sans aucune pièce mobile.", introYear: 1998 },
      { icon: "🦉", name: "Furby", desc: "La peluche robotique qui parle toute seule la nuit et semble apprendre le français au fil des jours.", introYear: 1998 },
      { icon: "🎬", name: "Titanic en VHS", desc: "Le film que toute la classe a vu (et revu), avec la chanson de Céline Dion qui tourne en boucle à la radio.", introYear: 1998 },
      { icon: "🪀", name: "Yoyo Yomega", desc: "Le grand retour du yoyo, avec ses figures façon \"sleeper\" popularisées par des tournées de démonstration dans les écoles.", introYear: 1998 },
      { icon: "⚡", name: "Cartes Pokémon", desc: "Attrapez-les tous, échangez-les tous : le jeu de cartes japonais qui déferle sur les cours de récré françaises.", introYear: 1999 },
      { icon: "💿", name: "Minidisc", desc: "Le petit disque dans son boîtier rigide, censé remplacer la cassette, qui restera finalement un format de niche.", introYear: 1999 },
    ],
  },
  {
    start: 2000,
    end: 2009,
    name: "Les années 2000",
    tagline: "MSN, iPod et Yu-Gi-Oh.",
    theme: "theme-2000s",
    pool: [
      { icon: "📱", name: "Nokia à clapet / 3310", desc: "Le téléphone increvable, célèbre pour sa résistance aux chutes, avec Snake pour tuer le temps en cours.", introYear: 2000 },
      { icon: "🎮", name: "Console PlayStation 2", desc: "La console la plus vendue de l'histoire, qui fait aussi office de lecteur DVD dans le salon familial.", introYear: 2000 },
      { icon: "🛼", name: "Chaussures à roulettes Heelys", desc: "Les baskets avec une roulette cachée dans le talon, pour glisser dans les couloirs sans prévenir les surveillants.", introYear: 2000 },
      { icon: "📀", name: "DVD et lecteurs portables", desc: "Le film à la maison en bien meilleure qualité que la VHS, avec bonus et scènes coupées à découvrir.", introYear: 2001 },
      { icon: "🃏", name: "Cartes Yu-Gi-Oh", desc: "Des duels épiques échangés dans la cour d'école, portés par la série animée diffusée juste avant les devoirs.", introYear: 2002 },
      { icon: "🌀", name: "Beyblade", desc: "Les toupies qui s'affrontent dans une arène en plastique, lancées à l'aide d'un lanceur à ficelle.", introYear: 2002 },
      { icon: "🎵", name: "iPod", desc: "Mille chansons dans la poche, une molette pour tout naviguer : l'appareil d'Apple qui sonne le glas du lecteur CD.", introYear: 2002 },
      { icon: "🎮", name: "Console GameCube", desc: "La petite console cubique de Nintendo, avec ses jeux sur mini-disques et sa manette aux boutons colorés.", introYear: 2002 },
      { icon: "💬", name: "MSN Messenger", desc: "Un \"ding\", un pote se connecte : vite, un pseudo qui claque avec des paroles de chanson et des émoticônes.", introYear: 2003 },
      { icon: "📝", name: "Skyblog", desc: "Chacun a le sien, avec sa musique qui se lance automatiquement et son design bricolé en HTML.", introYear: 2003 },
      { icon: "🕹️", name: "Jeux flash en ligne", desc: "Des sites comme Miniclip ou jeuxvideo.com que l'on ouvre en cachette pendant la pause déjeuner au collège.", introYear: 2003 },
      { icon: "🧵", name: "Bracelets brésiliens", desc: "Tressés à la main avec du fil à broder pendant les cours et les vacances, échangés entre amis en signe d'amitié.", introYear: 2004 },
      { icon: "🎮", name: "Nintendo DS", desc: "Deux écrans, un stylet, et Nintendogs qui aboie dans toutes les cours de récré de France.", introYear: 2005 },
      { icon: "🎮", name: "PSP", desc: "La console portable de Sony qui fait aussi lecteur de films et de musique, avec son grand écran large.", introYear: 2005 },
      { icon: "🐾", name: "Webkinz et Neopets", desc: "Élever des animaux virtuels sur l'ordinateur familial, entre jeux, décoration et petite économie en pièces virtuelles.", introYear: 2005 },
      { icon: "📹", name: "YouTube", desc: "La plateforme qui permet à n'importe qui de publier ses propres vidéos, encore balbutiante mais déjà addictive.", introYear: 2006 },
      { icon: "🎮", name: "Wii et la Wiimote", desc: "Toute la famille se lève pour jouer au tennis ou au bowling dans le salon, manette brandie dans les airs.", introYear: 2006 },
      { icon: "🐧", name: "Club Penguin", desc: "Le jeu en ligne où toute une génération se retrouve derrière un avatar de pingouin pour jouer et discuter.", introYear: 2007 },
      { icon: "📘", name: "Facebook et Twitter arrivent en France", desc: "Les premiers réseaux sociaux grand public, où l'on retrouve ses camarades de classe et poste ses premières photos.", introYear: 2008 },
      { icon: "📱", name: "iPhone première génération", desc: "Le smartphone à écran tactile qui rebat toutes les cartes et lance la course aux applications mobiles.", introYear: 2008 },
    ],
  },
  {
    start: 2010,
    end: 2019,
    name: "Les années 2010",
    tagline: "Fidget spinners, Vine et Pokémon GO.",
    theme: "theme-2010s",
    pool: [
      { icon: "🧱", name: "Minecraft", desc: "Construire des mondes entiers en cubes, seul ou avec des amis, dans un jeu qui devient un phénomène planétaire.", introYear: 2011 },
      { icon: "🤳", name: "Smartphones et selfies", desc: "Un appareil photo dans chaque poche, en permanence, qui change la façon de se photographier et de partager sa vie.", introYear: 2011 },
      { icon: "📷", name: "Instagram", desc: "Les photos carrées avec filtre deviennent un réflexe quotidien, avant même de savoir ce qu'est un \"like\".", introYear: 2012 },
      { icon: "🍬", name: "Candy Crush", desc: "Le jeu de bonbons à aligner qui aspire des heures entières et fait le tour des groupes de discussion familiaux.", introYear: 2012 },
      { icon: "🎥", name: "Vine", desc: "Six secondes chrono pour devenir culte, avec des boucles vidéo reprises et citées dans les cours de récré.", introYear: 2013 },
      { icon: "👻", name: "Snapchat", desc: "Les messages et les filtres à oreilles de chien qui disparaissent après quelques secondes seulement.", introYear: 2013 },
      { icon: "💬", name: "WhatsApp généralisé", desc: "La messagerie qui remplace peu à peu les SMS payants, avec ses groupes de classe qui n'arrêtent jamais de vibrer.", introYear: 2013 },
      { icon: "🎮", name: "Console PS4 / Xbox One", desc: "La nouvelle génération de consoles qui mise sur le jeu en ligne et le partage de parties en direct.", introYear: 2013 },
      { icon: "🧶", name: "Loom bands", desc: "Les petits élastiques colorés tissés sur un métier miniature, pour fabriquer bracelets et bagues à l'infini.", introYear: 2014 },
      { icon: "🎬", name: "Netflix arrive en France", desc: "Le service de streaming qui change la manière de regarder des séries, d'un coup, sans attendre la semaine suivante.", introYear: 2014 },
      { icon: "🚗", name: "Applications Uber et Tinder", desc: "Commander une voiture ou faire une rencontre d'un simple glissement de doigt sur l'écran de son téléphone.", introYear: 2014 },
      { icon: "🛹", name: "Hoverboard", desc: "La planche à deux roues autoéquilibrée qui déferle dans les rues et les couloirs de collège, non sans quelques chutes.", introYear: 2015 },
      { icon: "🎨", name: "Coloriages anti-stress mandala", desc: "Le carnet de coloriage pour adultes, crayons de couleur à la main, devient un phénomène de librairie.", introYear: 2015 },
      { icon: "😂", name: "Emoji et stickers omniprésents", desc: "Les petites images colorées envahissent les conversations, au point de remplacer parfois des phrases entières.", introYear: 2015 },
      { icon: "🐉", name: "Pokémon GO", desc: "Toute la ville dehors, téléphone en main, à la chasse aux Pokémon en réalité augmentée dans les parcs.", introYear: 2016 },
      { icon: "🎧", name: "Écouteurs sans fil (AirPods)", desc: "La fin des fils qui s'emmêlent dans la poche, avec ce petit boîtier blanc qui devient vite un objet culte.", introYear: 2017 },
      { icon: "🌀", name: "Fidget spinner", desc: "L'objet anti-stress à trois branches que tout le monde fait tourner en classe, interdit dans plusieurs écoles.", introYear: 2017 },
      { icon: "🔊", name: "Enceintes Bluetooth portables", desc: "La musique partout, sans fil, à la plage comme au parc, avec des basses parfois plus fortes que prévu.", introYear: 2017 },
      { icon: "🛴", name: "Trottinettes électriques en libre-service", desc: "Elles envahissent les trottoirs des grandes villes, à récupérer et à laisser n'importe où via une application.", introYear: 2018 },
    ],
  },
  {
    start: 2020,
    end: 2026,
    name: "Les années 2020",
    tagline: "TikTok, Wordle et visios improvisées.",
    theme: "theme-2020s",
    pool: [
      { icon: "💻", name: "Visioconférences", desc: "Réunions, cours et apéros derrière un écran, avec la fameuse phrase \"vous m'entendez ?\" répétée à chaque appel.", introYear: 2020 },
      { icon: "🕵️", name: "Among Us", desc: "Qui est l'imposteur ? Un petit jeu multijoueur devient soudain le phénomène de tout un confinement.", introYear: 2020 },
      { icon: "🎬", name: "TikTok", desc: "Le format vidéo très court qui prend le monde d'assaut, avec ses danses et ses tendances qui changent chaque semaine.", introYear: 2020 },
      { icon: "🍔", name: "Livraison de repas par application", desc: "Les livreurs à vélo qui sillonnent les villes pour apporter le repas commandé en quelques clics.", introYear: 2020 },
      { icon: "🦑", name: "Séries virales mondiales", desc: "Une série sort et toute la planète en parle en même temps, costumes et répliques repris jusque dans la cour d'école.", introYear: 2021 },
      { icon: "🎮", name: "Cloud gaming", desc: "Jouer à des jeux exigeants sans console dédiée, directement diffusés depuis un serveur distant.", introYear: 2021 },
      { icon: "🔋", name: "Voitures électriques grand public", desc: "Les bornes de recharge se multiplient en ville, et la voiture électrique cesse d'être un objet rare et coûteux.", introYear: 2021 },
      { icon: "🟩", name: "Wordle", desc: "Le mot du jour partagé par tous, en grille verte, jaune et grise, copié-collé chaque matin sur les réseaux.", introYear: 2022 },
      { icon: "🤳", name: "BeReal", desc: "Une notification surprise, deux minutes chrono pour poster une photo spontanée, sans filtre ni retouche.", introYear: 2022 },
      { icon: "🤖", name: "IA générative", desc: "Discuter et créer du texte, des images ou du code avec une intelligence artificielle, en quelques secondes à peine.", introYear: 2023 },
      { icon: "🏅", name: "Jeux Olympiques de Paris", desc: "La France entière derrière ses athlètes, avec une cérémonie d'ouverture inédite sur la Seine, l'été 2024.", introYear: 2024 },
    ],
  },
];

// Faits marquants réels par année : politique française, monde, disparitions, sport.
// Types : france, monde, deces, sport, culture.
const YEAR_EVENTS = {
  1950: [{ type: "france", text: "Robert Schuman propose la création de la Communauté européenne du charbon et de l'acier." }],
  1951: [{ type: "france", text: "Signature du traité de Paris, qui fonde la CECA, première pierre de la construction européenne." }],
  1952: [{ type: "monde", text: "Élisabeth II devient reine du Royaume-Uni à la mort de son père, George VI." }],
  1953: [{ type: "monde", text: "Mort de Joseph Staline, dirigeant de l'Union soviétique." }],
  1954: [
    { type: "france", text: "Défaite de Diên Biên Phu, qui marque la fin de la guerre d'Indochine." },
    { type: "france", text: "L'abbé Pierre lance son appel radiophonique pour venir en aide aux sans-abri." },
  ],
  1955: [{ type: "monde", text: "Rosa Parks refuse de céder sa place dans un bus, en Alabama." }],
  1956: [{ type: "france", text: "Indépendance du Maroc et de la Tunisie, alors sous protectorat français." }],
  1957: [
    { type: "france", text: "Signature du traité de Rome, qui fonde la Communauté économique européenne." },
    { type: "monde", text: "L'URSS lance Spoutnik, premier satellite artificiel de l'histoire." },
  ],
  1958: [{ type: "france", text: "Retour au pouvoir du général de Gaulle et naissance de la Ve République." }],
  1959: [{ type: "france", text: "Charles de Gaulle devient le premier président de la Ve République." }],
  1960: [{ type: "deces", text: "Mort de l'écrivain Albert Camus dans un accident de voiture." }],
  1961: [
    { type: "monde", text: "Construction du mur de Berlin, qui coupe la ville en deux." },
    { type: "france", text: "Putsch manqué des généraux à Alger." },
  ],
  1962: [
    { type: "france", text: "Accords d'Évian et indépendance de l'Algérie, après huit ans de guerre." },
    { type: "monde", text: "Crise des missiles de Cuba, le monde frôle la guerre nucléaire." },
    { type: "deces", text: "Mort de l'actrice américaine Marilyn Monroe." },
  ],
  1963: [
    { type: "monde", text: "Assassinat du président américain John F. Kennedy à Dallas." },
    { type: "deces", text: "Édith Piaf et Jean Cocteau meurent le même jour, à quelques heures d'intervalle." },
  ],
  1965: [{ type: "france", text: "Charles de Gaulle est réélu président au suffrage universel direct, une première." }],
  1966: [{ type: "france", text: "La France se retire du commandement militaire intégré de l'OTAN." }],
  1967: [{ type: "monde", text: "La guerre des Six Jours oppose Israël à plusieurs pays arabes voisins." }],
  1968: [{ type: "france", text: "Mai 68 secoue la France : grèves générales et manifestations étudiantes paralysent le pays." }],
  1969: [
    { type: "france", text: "Le général de Gaulle démissionne après un référendum perdu ; Georges Pompidou lui succède." },
    { type: "monde", text: "L'humanité marche sur la Lune avec la mission Apollo 11." },
  ],
  1970: [
    { type: "deces", text: "Mort du général de Gaulle à Colombey-les-Deux-Églises." },
    { type: "deces", text: "Mort du guitariste Jimi Hendrix, à 27 ans." },
  ],
  1971: [{ type: "deces", text: "Mort du trompettiste et chanteur américain Louis Armstrong." }],
  1972: [{ type: "monde", text: "Prise d'otages meurtrière aux Jeux olympiques de Munich." }],
  1973: [
    { type: "monde", text: "Premier choc pétrolier, qui plonge l'économie mondiale dans la crise." },
    { type: "deces", text: "Mort du peintre Pablo Picasso." },
  ],
  1974: [{ type: "deces", text: "Mort du président Georges Pompidou en cours de mandat ; Valéry Giscard d'Estaing est élu président." }],
  1975: [
    { type: "france", text: "La loi Veil légalise l'interruption volontaire de grossesse en France." },
    { type: "monde", text: "Fin de la guerre du Vietnam." },
  ],
  1976: [{ type: "monde", text: "Mort de Mao Zedong, dirigeant historique de la Chine." }],
  1977: [
    { type: "france", text: "Jacques Chirac devient le premier maire élu de Paris." },
    { type: "deces", text: "Mort du chanteur Elvis Presley." },
  ],
  1978: [{ type: "monde", text: "Naissance du premier \"bébé-éprouvette\", conçu par fécondation in vitro." }],
  1979: [{ type: "france", text: "Élection du tout premier Parlement européen au suffrage universel." }],
  1980: [
    { type: "deces", text: "Mort du philosophe Jean-Paul Sartre." },
    { type: "deces", text: "Le chanteur John Lennon est assassiné à New York." },
  ],
  1981: [
    { type: "france", text: "François Mitterrand est élu président de la République, première alternance à gauche de la Ve République." },
    { type: "france", text: "Abolition de la peine de mort en France, portée par Robert Badinter." },
  ],
  1982: [{ type: "france", text: "Passage à la semaine de 39 heures et à la cinquième semaine de congés payés." }],
  1984: [{ type: "sport", text: "L'équipe de France de Michel Platini remporte le Championnat d'Europe de football à domicile." }],
  1985: [{ type: "france", text: "Coluche crée les Restos du Cœur pour venir en aide aux plus démunis." }],
  1986: [
    { type: "deces", text: "Mort de l'humoriste Coluche dans un accident de moto." },
    { type: "monde", text: "Catastrophe nucléaire de Tchernobyl, en Ukraine soviétique." },
  ],
  1988: [{ type: "france", text: "François Mitterrand est réélu président de la République." }],
  1989: [
    { type: "monde", text: "Chute du mur de Berlin, symbole de la fin de la guerre froide." },
    { type: "france", text: "La France célèbre le bicentenaire de la Révolution française." },
  ],
  1990: [{ type: "monde", text: "Réunification de l'Allemagne, un an après la chute du mur." }],
  1991: [
    { type: "monde", text: "Guerre du Golfe après l'invasion du Koweït par l'Irak." },
    { type: "deces", text: "Mort du chanteur Freddie Mercury, leader du groupe Queen." },
    { type: "deces", text: "Mort de l'acteur et chanteur Yves Montand." },
  ],
  1992: [
    { type: "france", text: "Signature du traité de Maastricht, qui ouvre la voie à l'Union européenne et à l'euro." },
    { type: "sport", text: "Les Jeux olympiques d'hiver se tiennent à Albertville, en France." },
  ],
  1994: [
    { type: "france", text: "Ouverture du tunnel sous la Manche, reliant la France au Royaume-Uni par le rail." },
  ],
  1995: [
    { type: "france", text: "Jacques Chirac est élu président de la République." },
    { type: "france", text: "La France reprend ses essais nucléaires dans le Pacifique, provoquant une vague de protestations." },
  ],
  1996: [
    { type: "deces", text: "Mort de François Mitterrand, ancien président de la République." },
    { type: "deces", text: "Mort de l'écrivaine Marguerite Duras." },
  ],
  1997: [
    { type: "france", text: "Dissolution de l'Assemblée nationale ; Lionel Jospin devient Premier ministre en cohabitation." },
    { type: "deces", text: "Mort de Diana, princesse de Galles, dans un accident à Paris." },
    { type: "deces", text: "Mort de Mère Teresa." },
  ],
  1998: [{ type: "sport", text: "La France est championne du monde de football, à domicile, face au Brésil." }],
  1999: [{ type: "france", text: "Violentes tempêtes de fin décembre en France, qui font de nombreux dégâts et victimes." }],
  2000: [{ type: "sport", text: "L'équipe de France remporte le Championnat d'Europe de football aux Pays-Bas et en Belgique." }],
  2001: [{ type: "monde", text: "Les attentats du 11 septembre à New York et Washington bouleversent le monde." }],
  2002: [
    { type: "france", text: "Passage à l'euro dans les portefeuilles, qui remplace le franc." },
    { type: "france", text: "Jean-Marie Le Pen se qualifie pour le second tour de l'élection présidentielle, provoquant un choc politique." },
  ],
  2003: [{ type: "france", text: "Une canicule meurtrière frappe la France durant l'été." }],
  2005: [
    { type: "france", text: "Des émeutes éclatent dans plusieurs banlieues françaises à l'automne." },
    { type: "france", text: "Les Français rejettent par référendum le traité établissant une Constitution pour l'Europe." },
    { type: "deces", text: "Mort du pape Jean-Paul II." },
  ],
  2006: [
    { type: "france", text: "Fortes contestations étudiantes et lycéennes contre le contrat première embauche (CPE)." },
    { type: "sport", text: "La France est finaliste de la Coupe du monde de football, marquée par le coup de tête de Zinédine Zidane." },
  ],
  2007: [
    { type: "france", text: "Nicolas Sarkozy est élu président de la République." },
    { type: "deces", text: "Mort de l'abbé Pierre, fondateur d'Emmaüs." },
  ],
  2008: [{ type: "monde", text: "La crise financière mondiale, déclenchée aux États-Unis, frappe l'économie mondiale." }],
  2009: [{ type: "deces", text: "Mort du chanteur Michael Jackson." }],
  2010: [{ type: "france", text: "D'importantes manifestations contre la réforme des retraites mobilisent la France." }],
  2011: [
    { type: "france", text: "L'affaire DSK, impliquant Dominique Strauss-Kahn, secoue la vie politique française." },
    { type: "deces", text: "Mort de Steve Jobs, cofondateur d'Apple." },
  ],
  2012: [{ type: "france", text: "François Hollande est élu président de la République." }],
  2013: [{ type: "france", text: "La loi ouvrant le mariage aux couples de même sexe est adoptée en France." }],
  2015: [{ type: "france", text: "La France est frappée par les attentats de Charlie Hebdo en janvier, puis par ceux du Bataclan et de Saint-Denis en novembre." }],
  2016: [
    { type: "france", text: "Un attentat frappe Nice le soir du 14 juillet, lors des célébrations de la fête nationale." },
    { type: "monde", text: "Le Royaume-Uni vote pour sa sortie de l'Union européenne (Brexit)." },
    { type: "monde", text: "Donald Trump est élu président des États-Unis." },
  ],
  2017: [{ type: "france", text: "Emmanuel Macron est élu président de la République, à seulement 39 ans." }],
  2018: [
    { type: "sport", text: "La France est de nouveau championne du monde de football, en Russie." },
    { type: "france", text: "Le mouvement des Gilets jaunes débute, contestant le prix des carburants puis bien plus." },
  ],
  2019: [{ type: "france", text: "L'incendie de la cathédrale Notre-Dame de Paris bouleverse la France et le monde entier." }],
  2020: [{ type: "monde", text: "La pandémie de Covid-19 entraîne des confinements dans le monde entier." }],
  2021: [{ type: "monde", text: "La sortie progressive de la pandémie s'accompagne de la campagne mondiale de vaccination." }],
  2022: [
    { type: "france", text: "Emmanuel Macron est réélu président de la République." },
    { type: "monde", text: "La Russie envahit l'Ukraine, déclenchant une guerre en Europe." },
    { type: "deces", text: "Mort de la reine Élisabeth II, après soixante-dix ans de règne." },
  ],
  2023: [{ type: "france", text: "Une réforme des retraites très contestée provoque d'importantes mobilisations en France." }],
  2024: [
    { type: "sport", text: "Paris accueille les Jeux Olympiques et Paralympiques d'été." },
    { type: "france", text: "La cathédrale Notre-Dame de Paris rouvre ses portes après cinq ans de reconstruction." },
  ],
};

const EVENT_ICONS = {
  france: "🇫🇷",
  monde: "🌍",
  deces: "🕯️",
  sport: "🏆",
  culture: "🎬",
};

function decadeIndexForYear(year) {
  const idx = DECADES.findIndex((d) => year >= d.start && year <= d.end);
  if (idx !== -1) return idx;
  return year < DECADES[0].start ? 0 : DECADES.length - 1;
}

function buildYearSelection(year) {
  const decadeIdx = decadeIndexForYear(year);
  const decade = DECADES[decadeIdx];
  const prevDecade = decadeIdx > 0 ? DECADES[decadeIdx - 1] : null;

  const eligible = [
    ...decade.pool,
    ...(prevDecade ? prevDecade.pool : []),
  ].filter((item) => item.introYear <= year);

  const newItems = eligible.filter((item) => item.introYear === year);
  const olderItems = eligible.filter((item) => item.introYear < year);

  const need = Math.max(0, TARGET_ITEMS - newItems.length);
  const selectedOlder = [];
  if (need > 0 && olderItems.length > 0) {
    const offset = ((year % olderItems.length) + olderItems.length) % olderItems.length;
    for (let i = 0; i < Math.min(need, olderItems.length); i++) {
      selectedOlder.push(olderItems[(offset + i) % olderItems.length]);
    }
  }

  return {
    decade,
    items: [...newItems, ...selectedOlder].map((item) => ({
      ...item,
      isNew: item.introYear === year,
    })),
  };
}

const yearSlider = document.getElementById("yearSlider");
const yearValue = document.getElementById("yearValue");
const yearMinus = document.getElementById("yearMinus");
const yearPlus = document.getElementById("yearPlus");
const goBtn = document.getElementById("goBtn");
const result = document.getElementById("result");
const decadeTitle = document.getElementById("decadeTitle");
const decadeTagline = document.getElementById("decadeTagline");
const eventsSection = document.getElementById("eventsSection");
const eventsList = document.getElementById("eventsList");
const itemsCountEl = document.getElementById("itemsCount");
const itemsGrid = document.getElementById("itemsGrid");

function updateYearDisplay() {
  yearValue.textContent = yearSlider.value;
}

yearSlider.addEventListener("input", updateYearDisplay);

yearMinus.addEventListener("click", () => {
  yearSlider.value = Math.max(Number(yearSlider.min), Number(yearSlider.value) - 1);
  updateYearDisplay();
});

yearPlus.addEventListener("click", () => {
  yearSlider.value = Math.min(Number(yearSlider.max), Number(yearSlider.value) + 1);
  updateYearDisplay();
});

function renderYear(year) {
  const { decade, items } = buildYearSelection(year);

  document.body.className = decade.theme;

  decadeTitle.textContent = `${year} — ${decade.name}`;
  decadeTagline.textContent = decade.tagline;

  const events = YEAR_EVENTS[year];
  if (events && events.length > 0) {
    eventsList.innerHTML = events
      .map((ev) => `<li><span class="event-icon">${EVENT_ICONS[ev.type] || "📌"}</span><span>${ev.text}</span></li>`)
      .join("");
    eventsSection.hidden = false;
  } else {
    eventsList.innerHTML = "";
    eventsSection.hidden = true;
  }

  itemsCountEl.textContent = `${items.length} référence${items.length > 1 ? "s" : ""} culte${items.length > 1 ? "s" : ""} pour ${year}`;

  itemsGrid.innerHTML = "";
  items.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.style.animationDelay = `${index * 80}ms`;
    card.innerHTML = `
      ${item.isNew ? `<span class="item-badge">Nouveauté ${item.introYear}</span>` : ""}
      <div class="item-photo">
        <span class="item-icon">${item.icon}</span>
      </div>
      <h3 class="item-name">${item.name}</h3>
      <p class="item-desc">${item.desc}</p>
      <p class="item-year">Apparu en ${item.introYear}</p>
    `;
    itemsGrid.appendChild(card);
  });

  result.hidden = false;
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

goBtn.addEventListener("click", () => {
  renderYear(Number(yearSlider.value));
});

updateYearDisplay();
