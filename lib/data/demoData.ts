import { ContributorArticle, FeedPost, Supplier } from '../supabase/types';

export const DEMO_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    business_name: 'AgroBio Cameroun & Alevinage Pro',
    owner_name: 'Dr. Joseph Ndoumbe',
    category: 'Alevins & Sujets',
    phone: '+237 677 89 45 12',
    whatsapp: '+237 677 89 45 12',
    region: 'Centre',
    city: 'Yaoundé (Mendong)',
    address: 'Carrefour Simbock, face station Tradex',
    latitude: 3.8290,
    longitude: 11.4810,
    verified: true,
    rating: 4.9,
    review_count: 38,
    payment_methods: ['MTN Mobile Money', 'Orange Money', 'Espèces'],
    delivery_regions: ['Centre', 'Littoral', 'Sud', 'Ouest'],
    min_order_fcfa: 15000,
    is_demo: true,
    products: [
      {
        id: 'p-1',
        name: 'Alevins Clarias gariepinus triés (10-15g)',
        category: 'Alevins',
        price_fcfa: 100,
        unit: 'sujet',
        description: 'Alevins vigoureux issus de géniteurs sélectionnés, vaccinés et habitués à l\'aliment extrudé.',
        in_stock: true,
      },
      {
        id: 'p-2',
        name: 'Géniteurs Clarias mûrs (1.5 - 2.5 kg)',
        category: 'Géniteurs',
        price_fcfa: 6000,
        unit: 'sujet',
        description: 'Mâles et femelles matures pour reproduction artificielle en écloserie.',
        in_stock: true,
      },
      {
        id: 'p-3',
        name: 'Bacs bâchés hors-sol galvanisés 2000L',
        category: 'Matériel',
        price_fcfa: 130000,
        unit: 'kit complet',
        description: 'Bâche PVC alimentaire 900g/m² avec armature acier anticorrosion et vanne de vidange 50mm.',
        in_stock: true,
      },
    ],
  },
  {
    id: 'sup-2',
    business_name: 'Provenderie Moderne du Littoral (PML)',
    owner_name: 'Mme Chantal Ewane',
    category: 'Aliments & Provendes',
    phone: '+237 699 12 34 56',
    whatsapp: '+237 699 12 34 56',
    region: 'Littoral',
    city: 'Douala (Logbessou)',
    address: 'Entrée campus IUT Logbessou, Douala',
    latitude: 4.0950,
    longitude: 9.7780,
    verified: true,
    rating: 4.8,
    review_count: 54,
    payment_methods: ['Orange Money', 'MTN Mobile Money', 'Virement'],
    delivery_regions: ['Littoral', 'Sud-Ouest', 'Centre', 'Ouest'],
    min_order_fcfa: 25000,
    is_demo: true,
    products: [
      {
        id: 'p-4',
        name: 'Aliment Extrudé Flottant 2mm (45% Protéines Brutes)',
        category: 'Aliment Poisson',
        price_fcfa: 18500,
        unit: 'sac de 15 kg',
        description: 'Aliment démarrage haute digestibilité à base de farine de poisson locale et tourteau de soja.',
        in_stock: true,
      },
      {
        id: 'p-5',
        name: 'Provende Croissance Volaille Chair',
        category: 'Aliment Volaille',
        price_fcfa: 21000,
        unit: 'sac de 50 kg',
        description: 'Formulation équilibrée avec prémix minéral et acides aminés essentiels.',
        in_stock: true,
      },
      {
        id: 'p-6',
        name: 'Farine de coquilles d\'huîtres de Mouanko (Calcium 38%)',
        category: 'Minéraux',
        price_fcfa: 6500,
        unit: 'sac de 25 kg',
        description: 'Indispensable pour l\'héliciculture (escargots) et la ponte des volailles.',
        in_stock: true,
      },
    ],
  },
  {
    id: 'sup-3',
    business_name: 'Hélico-Ferme & Semences des Hauts-Plateaux',
    owner_name: 'Ing. Paul Fotso',
    category: 'Semences & Intrants',
    phone: '+237 670 44 55 66',
    whatsapp: '+237 670 44 55 66',
    region: 'Ouest',
    city: 'Bafoussam',
    address: 'Marché B, axe Bafoussam - Foumbot',
    latitude: 5.4778,
    longitude: 10.4176,
    verified: true,
    rating: 4.9,
    review_count: 29,
    payment_methods: ['MTN Mobile Money', 'Orange Money', 'Espèces'],
    delivery_regions: ['Ouest', 'Nord-Ouest', 'Littoral', 'Centre'],
    min_order_fcfa: 10000,
    is_demo: true,
    products: [
      {
        id: 'p-7',
        name: 'Géniteurs Escargots Géants Archachatina (200-300g)',
        category: 'Héliciculture',
        price_fcfa: 800,
        unit: 'sujet',
        description: 'Géniteurs reproducteurs sains, coquille solide et forte prolificité.',
        in_stock: true,
      },
      {
        id: 'p-8',
        name: 'Semences hybrides Tomate Cobra F1 certifiée',
        category: 'Semences',
        price_fcfa: 12500,
        unit: 'boîte de 10g',
        description: 'Haute résistance au flétrissement bactérien (Ralstonia) et au TYLCV.',
        in_stock: true,
      },
      {
        id: 'p-9',
        name: 'Substrat terreau noir forestier enrichi',
        category: 'Substrats',
        price_fcfa: 4000,
        unit: 'sac de 50L',
        description: 'Terreau désinfecté thermiquement, idéal pour escargotières et pépinières maraîchères.',
        in_stock: true,
      },
    ],
  },
  {
    id: 'sup-4',
    business_name: 'Kribi Équipements & Pompage Solaire',
    owner_name: 'Marcelle Manga',
    category: 'Équipements & Matériel',
    phone: '+237 694 77 11 22',
    whatsapp: '+237 694 77 11 22',
    region: 'Sud',
    city: 'Kribi',
    address: 'Route des Chutes de la Lobé',
    latitude: 2.9370,
    longitude: 9.9100,
    verified: true,
    rating: 4.7,
    review_count: 22,
    payment_methods: ['Orange Money', 'MTN Mobile Money', 'Espèces'],
    delivery_regions: ['Sud', 'Centre', 'Littoral'],
    min_order_fcfa: 20000,
    is_demo: true,
    products: [
      {
        id: 'p-10',
        name: 'Kit motopompe solaire immergée 12V / 150W',
        category: 'Énergie & Eau',
        price_fcfa: 175000,
        unit: 'kit avec panneau',
        description: 'Idéal pour le renouvellement autonome d\'eau en pisciculture hors-sol.',
        in_stock: true,
      },
    ],
  },
];

export const DEMO_ARTICLES: ContributorArticle[] = [
  {
    id: 'art-1',
    title: 'Protocole anti-ammoniac et gestion de l\'eau pour Clarias à Yaoundé',
    author_name: 'Dr. Martin Kamga',
    author_title: 'Docteur Vétérinaire & Spécialiste Aquacole',
    category: 'Pisciculture',
    summary: 'Comment éviter l\'asphyxie nocturne des silures et stabiliser le pH entre 6.8 et 7.5 en saison des pluies.',
    content: `### 1. Le Danger de l'Ammoniac non-ionisé (NH3)
En élevage intensif en bac hors-sol au Cameroun, la décomposition des déjections et restes d'aliments génère de l'ammoniac. Dès que le pH dépasse 8.0 et la température 28°C, le NH3 devient mortel.

### 2. Protocole Quotidien Recommandé
- **Siphonage biquotidien** : Évacuer les fèces 30 minutes après le repas du matin et du soir.
- **Renouvellement partiel** : Changer 30% à 40% du volume d'eau chaque jour avec de l'eau décantée ou de puits.
- **Ajout de sel gemme non-iodé** : 1 à 2 kg de sel par m³ d'eau lors de chaque changement massif pour réguler la pression osmotique des branchies.

### 3. Signes d'Alerte
- Poissons venant piper l'air en surface en permanence.
- Branchies pâles ou recouvertes d'un mucus blanchâtre.
- Diminution brutale de l'appétit lors de la distribution.`,
    tags: ['Silure', 'Qualité de l\'eau', 'Ammoniac', 'Yaoundé', 'Bacs hors-sol'],
    upvotes: 142,
    status: 'verified',
    date_published: '2026-08-15',
    region: 'Centre',
    is_demo: true,
  },
  {
    id: 'art-2',
    title: 'Guide complet de ponte et incubation des escargots géants (Archachatina)',
    author_name: 'Ing. Paul Fotso',
    author_title: 'Agronome & Héliciculteur',
    category: 'Héliciculture',
    summary: 'Technique éprouvée pour obtenir plus de 90% de taux d\'éclosion des naissains en zone forestière humide.',
    content: `### 1. Conditions optimales de ponte
Les escargots géants du Cameroun (Archachatina marginata) s'accouplent principalement pendant les périodes humides.

### 2. Préparation des boîtes d'incubation
- Utiliser des bacs plastiques perforés de 30x20 cm.
- Remplir de 5 cm de terreau forestier préalablement passé au four ou ébouillanté pour éliminer les acariens et œufs de mouches.
- Humidifier le substrat (le terreau doit former une boule dans la main sans suinter d'eau).
- Enfouir les œufs à 2 cm de profondeur espacés de 2 cm.

### 3. Gestion jusqu'à l'éclosion
- Température ambiante idéale : 24°C - 27°C.
- Temps d'incubation : 28 à 35 jours.
- Dès l'éclosion, laisser les naissains consommer leur propre coquille pendant 48h avant de distribuer des feuilles tendres de papayer saupoudrées de calcium.`,
    tags: ['Escargots', 'Archachatina', 'Incubation', 'Reproduction', 'Ouest'],
    upvotes: 98,
    status: 'verified',
    date_published: '2026-08-10',
    region: 'Ouest',
    is_demo: true,
  },
  {
    id: 'art-3',
    title: 'Formulation d\'une provende économique pour poulet de chair à base de drêches de brasserie',
    author_name: 'Mme Chantal Ewane',
    author_title: 'Ingénieure en Nutrition Animale',
    category: 'Aviculture',
    summary: 'Réduire le coût de l\'aliment de 28% tout en maintenant un gain moyen quotidien (GMQ) supérieur à 45g.',
    content: `### 1. Valorisation des sous-produits locaux à Douala et Bafoussam
Le poste aliment représente 70% du budget de l'aviculteur camerounais. En incorporant des drêches de brasserie séchées et du tourteau de coton, vous abaissez le coût au kilo.

### 2. Recette pour 100 kg d'aliment finition (J22 à J45)
- **Maïs jaune concassé** : 52 kg
- **Tourteau de soja (48% PB)** : 18 kg
- **Drêches de brasserie séchées** : 12 kg
- **Farine de poisson de Kribi (60% PB)** : 8 kg
- **Son de blé tendre** : 6 kg
- **Coquilles d'huîtres broyées** : 2 kg
- **Prémix chair finition 2.5% + Lysine/Méthionine** : 2 kg

### 3. Précautions indispensables
- Vérifier que la drêche est parfaitement sèche pour éviter la prolifération d'aflatoxines nocives pour le foie du poussin.`,
    tags: ['Poulet de chair', 'Provende', 'Économie', 'Drêches', 'Littoral'],
    upvotes: 115,
    status: 'verified',
    date_published: '2026-08-04',
    region: 'Littoral',
    is_demo: true,
  },
  {
    id: 'art-4',
    title: 'Lutte intégrée contre le mildiou et la flétrissure bactérienne de la tomate à Foumbot',
    author_name: 'Dr. Joseph Ndoumbe',
    author_title: 'Phytopathologiste',
    category: 'Maraîchage',
    summary: 'Stratégie préventive sans surdosage chimique pour sécuriser vos récoltes de contre-saison.',
    content: `### 1. Choix variétal
En zone Ouest et Centre, optez impérativement pour des variétés tolérantes comme Cobra F1, Nadira F1 ou Mongal F1.

### 2. Mesures prophylactiques
- Paillage plastique ou paille de brousse pour éviter les éclaboussures de sol contenant les spores de champignons.
- Tuteurage rigoureux dès la 3ème semaine pour aérer le feuillage.
- Pulvérisation préventive de bouillie bordelaise ou fongicide cuprique tous les 10 jours en saison des pluies.

### 3. Traitement biologique d'appoint
- Purin de feuilles de neem (azadirachta indica) et décoction de piment pour repousser les mouches blanches et acariens.`,
    tags: ['Tomate', 'Maladies', 'Mildiou', 'Maraîchage', 'Foumbot'],
    upvotes: 76,
    status: 'verified',
    date_published: '2026-07-28',
    region: 'Ouest',
    is_demo: true,
  },
];

export const DEMO_FEED_POSTS: FeedPost[] = [
  {
    id: 'post-1',
    author_name: 'Ferme Avicole Espoir (Alain T.)',
    author_title: 'Éleveur à Obala (Centre)',
    category: 'Aviculture',
    title: 'Résultats de notre bande de 1 000 poulets Cobb 500 : Poids moyen 2.4 kg à J42 !',
    content: `Bonjour à tous les membres d'AgroGuide 237 ! Je partage avec vous la pesée finale de notre bande sortie hier à Obala.

📊 **Bilan technique :**
- Poussins d'un jour : 1 000 sujets (souche Cobb 500)
- Mortalité totale : 28 sujets (soit 2.8%, objectif atteint !)
- Poids vif moyen à J42 : 2.42 kg
- Indice de consommation (IC) : 1.72
- Coût de revient par sujet : 1 780 FCFA
- Prix de vente bord-ferme : 2 600 FCFA

💡 **Le secret qui a tout changé :**
L'installation d'abreuvoirs automatiques à tétines avec réducteur de pression et l'apport d'électrolytes dès les premières heures de forte chaleur. Merci aux conseils du Dr. Kamga sur la plateforme !`,
    likes_count: 34,
    comments_count: 8,
    shares_count: 5,
    is_liked: false,
    is_bookmarked: false,
    verified: true,
    source_type: 'community_post',
    date_published: '2026-08-27T14:30:00Z',
    is_demo: true,
    comments: [
      {
        id: 'c-1',
        author_name: 'Patrick B.',
        author_role: 'Éleveur débutant (Yaoundé)',
        content: 'Félicitations frère ! Tu as utilisé quelle marque de provende pour le démarrage ?',
        date_published: 'Il y a 3 heures',
      },
      {
        id: 'c-2',
        author_name: 'Alain T.',
        author_role: 'Auteur',
        content: 'J\'ai pris le démarrage chez PML à Douala et j\'ai fait ma propre formule finition à base de maïs local d\'Obala.',
        date_published: 'Il y a 2 heures',
      },
    ],
  },
  {
    id: 'post-2',
    author_name: 'AquaFerme Kribi (Stéphane M.)',
    author_title: 'Aquaculteur à Kribi (Sud)',
    category: 'Pisciculture',
    title: 'Première vidange de nos 4 bacs hors-sol : 1.8 tonne de Clarias récoltée !',
    content: `Superbe journée de pêche à Kribi ! Nos 4 bacs de 10m² chacun ont donné 1 840 kg de silures bien calibrés après 5 mois d'élevage.

Toute la production a été achetée directement au bord des bacs par les restaurateurs du débarcadère de Kribi et des braiseuses venues d'Edéa à 2 100 FCFA/kg.

Prochaine étape : installation de 4 bacs supplémentaires avec système solaire pour doubler la capacité d'ici décembre !`,
    likes_count: 52,
    comments_count: 12,
    shares_count: 9,
    is_liked: true,
    is_bookmarked: true,
    verified: true,
    source_type: 'community_post',
    date_published: '2026-08-26T09:15:00Z',
    is_demo: true,
    comments: [
      {
        id: 'c-3',
        author_name: 'Ing. Paul Fotso',
        author_role: 'Agronome',
        content: 'Bravo pour cette performance ! Pense à laisser reposer les bâches au soleil 3 jours avant la désinfection.',
        date_published: 'Hier',
      },
    ],
  },
  {
    id: 'post-3',
    author_name: 'AgriNews Cameroun',
    author_title: 'Observatoire des Marchés MINEPIA/MINADER',
    category: 'Maraîchage',
    title: 'Alerte Prix Marchés : Hausse de 35% du cageot de tomate au marché du Mfoundi',
    content: `📈 **Tendance hebdomadaire des denrées agricoles (Yaoundé & Douala) :**
- **Cageot de tomate Foumbot (gros modèle) :** 18 500 FCFA (+35% par rapport au mois dernier)
- **Sac de piment frais (50 kg) :** 42 000 FCFA
- **Poulet de chair vivant (2 kg) :** 2 700 - 3 000 FCFA
- **Silure frais (kg) :** 2 000 - 2 200 FCFA
- **Alévin Clarias (15g) :** 90 - 110 FCFA

La rareté relative de la tomate s'explique par les fortes pluies récentes dans le Noun. Excellente opportunité pour les producteurs sous abri ou en pépinière surélevée.`,
    likes_count: 41,
    comments_count: 6,
    shares_count: 14,
    is_liked: false,
    is_bookmarked: false,
    verified: true,
    source_type: 'market_alert',
    date_published: '2026-08-25T08:00:00Z',
    is_demo: true,
    comments: [],
  },
];

export const AI_DIAGNOSTIC_SUGGESTIONS = [
  {
    topic: 'Pisciculture : Silures aux branchies blanches ou piper en surface',
    query: 'Mes alevins de silure Clarias viennent piper l\'air à la surface du bac et leurs branchies semblent pâles. Que faire d\'urgence ?',
    icon: 'Fish',
  },
  {
    topic: 'Héliciculture : Coquilles fragiles et escargots inactifs',
    query: 'Mes escargots géants Archachatina ont la coquille fine qui casse facilement et refusent de s\'alimenter. Quel apport donner ?',
    icon: 'Shell',
  },
  {
    topic: 'Aviculture : Fientes blanches/jaunes chez les poulets de chair',
    query: 'Mes poulets de chair de 3 semaines ont des fientes blanchâtres pâteuses et respirent difficilement. Protocole vétérinaire ?',
    icon: 'Egg',
  },
  {
    topic: 'Maraîchage : Taches brunes et enroulement des feuilles de tomate',
    query: 'Mes plants de tomates présentent des taches nécrotiques circulaires brunes sur les feuilles basses. Est-ce l\'alternariose ou le mildiou ?',
    icon: 'Sprout',
  },
];

export const WEATHER_ALERTS = [
  {
    region: 'Centre & Sud (Bimodale)',
    season: 'Grande saison des pluies en approche',
    advisory: 'Nettoyer d\'urgence les bondes de trop-plein des bacs piscicoles et surélever les pépinières maraîchères.',
    temperature: '24°C - 28°C',
    humidity: '85%',
    icon: 'CloudRain',
  },
  {
    region: 'Ouest & Nord-Ouest (Hauts Plateaux)',
    season: 'Saison humide et fraîche',
    advisory: 'Chauffer les poussinières avec des radiants ou lampes infrarouges la nuit. Risque élevé de coccidiose.',
    temperature: '18°C - 23°C',
    humidity: '90%',
    icon: 'CloudSun',
  },
  {
    region: 'Littoral (Douala, Kribi, Limbé)',
    season: 'Forte humidité tropicale',
    advisory: 'Surveiller la ventilation des élevages et aérer l\'eau des poissons 24h/24.',
    temperature: '26°C - 31°C',
    humidity: '88%',
    icon: 'Droplets',
  },
  {
    region: 'Grand Nord (Garoua, Maroua)',
    season: 'Période de transition agricole',
    advisory: 'Vérifier les systèmes de goutte-à-goutte et pailler les cultures pour préserver l\'humidité du sol.',
    temperature: '30°C - 38°C',
    humidity: '45%',
    icon: 'Sun',
  },
];
