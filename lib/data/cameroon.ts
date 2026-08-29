export interface CameroonCity {
  name: string;
  region: string;
  latitude: number;
  longitude: number;
}

export interface AgroZone {
  name: string;
  regions: string[];
  climate: string;
  characteristics: string;
  bestSectors: string[];
}

export const CAMEROON_REGIONS: Record<string, string> = {
  'Centre': 'Yaoundé',
  'Littoral': 'Douala',
  'Ouest': 'Bafoussam',
  'Sud': 'Ebolowa',
  'Sud-Ouest': 'Buéa',
  'Nord-Ouest': 'Bamenda',
  'Adamaoua': 'Ngaoundéré',
  'Nord': 'Garoua',
  'Extrême-Nord': 'Maroua',
  'Est': 'Bertoua',
};

export const CAMEROON_CITIES: CameroonCity[] = [
  // Centre
  { name: 'Yaoundé', region: 'Centre', latitude: 3.8480, longitude: 11.5021 },
  { name: 'Yaoundé (Mendong)', region: 'Centre', latitude: 3.8290, longitude: 11.4810 },
  { name: 'Yaoundé (Simbock)', region: 'Centre', latitude: 3.8050, longitude: 11.4620 },
  { name: 'Yaoundé (Soa)', region: 'Centre', latitude: 3.9650, longitude: 11.5980 },
  { name: 'Obala', region: 'Centre', latitude: 4.1667, longitude: 11.5333 },
  { name: 'Mbalmayo', region: 'Centre', latitude: 3.5167, longitude: 11.5000 },
  { name: 'Bafia', region: 'Centre', latitude: 4.7500, longitude: 11.2333 },
  { name: 'Nanga-Eboko', region: 'Centre', latitude: 4.6833, longitude: 12.3667 },

  // Littoral
  { name: 'Douala', region: 'Littoral', latitude: 4.0511, longitude: 9.7679 },
  { name: 'Douala (Bonabéri)', region: 'Littoral', latitude: 4.0810, longitude: 9.6720 },
  { name: 'Douala (Logbessou)', region: 'Littoral', latitude: 4.0950, longitude: 9.7780 },
  { name: 'Douala (Kotto)', region: 'Littoral', latitude: 4.0720, longitude: 9.7540 },
  { name: 'Edéa', region: 'Littoral', latitude: 3.8000, longitude: 10.1333 },
  { name: 'Nkongsamba', region: 'Littoral', latitude: 4.9547, longitude: 9.9404 },
  { name: 'Loum', region: 'Littoral', latitude: 4.7167, longitude: 9.7333 },

  // Ouest
  { name: 'Bafoussam', region: 'Ouest', latitude: 5.4778, longitude: 10.4176 },
  { name: 'Dschang', region: 'Ouest', latitude: 5.4500, longitude: 10.0667 },
  { name: 'Foumbot', region: 'Ouest', latitude: 5.5000, longitude: 10.6333 },
  { name: 'Foumban', region: 'Ouest', latitude: 5.7167, longitude: 10.9000 },
  { name: 'Mbouda', region: 'Ouest', latitude: 5.6333, longitude: 10.2500 },
  { name: 'Bandjoun', region: 'Ouest', latitude: 5.3700, longitude: 10.4100 },
  { name: 'Bangangté', region: 'Ouest', latitude: 5.1400, longitude: 10.5200 },

  // Sud
  { name: 'Kribi', region: 'Sud', latitude: 2.9370, longitude: 9.9100 },
  { name: 'Ebolowa', region: 'Sud', latitude: 2.9000, longitude: 11.1500 },
  { name: 'Sangmélima', region: 'Sud', latitude: 2.9333, longitude: 11.9833 },
  { name: 'Ambam', region: 'Sud', latitude: 2.3833, longitude: 11.2833 },

  // Sud-Ouest
  { name: 'Buéa', region: 'Sud-Ouest', latitude: 4.1527, longitude: 9.2410 },
  { name: 'Limbé', region: 'Sud-Ouest', latitude: 4.0186, longitude: 9.2149 },
  { name: 'Kumba', region: 'Sud-Ouest', latitude: 4.6363, longitude: 9.4469 },

  // Nord-Ouest
  { name: 'Bamenda', region: 'Nord-Ouest', latitude: 5.9597, longitude: 10.1459 },
  { name: 'Ndop', region: 'Nord-Ouest', latitude: 6.0333, longitude: 10.4500 },
  { name: 'Kumbo', region: 'Nord-Ouest', latitude: 6.2000, longitude: 10.6667 },

  // Adamaoua
  { name: 'Ngaoundéré', region: 'Adamaoua', latitude: 7.3167, longitude: 13.5833 },
  { name: 'Meiganga', region: 'Adamaoua', latitude: 6.5167, longitude: 14.2944 },
  { name: 'Tibati', region: 'Adamaoua', latitude: 6.4667, longitude: 12.6167 },

  // Nord
  { name: 'Garoua', region: 'Nord', latitude: 9.3017, longitude: 13.3921 },
  { name: 'Guider', region: 'Nord', latitude: 9.9333, longitude: 13.9500 },
  { name: 'Pitoa', region: 'Nord', latitude: 9.3833, longitude: 13.5167 },

  // Extrême-Nord
  { name: 'Maroua', region: 'Extrême-Nord', latitude: 10.5956, longitude: 14.3247 },
  { name: 'Kousséri', region: 'Extrême-Nord', latitude: 12.0769, longitude: 15.0306 },
  { name: 'Maga', region: 'Extrême-Nord', latitude: 10.5100, longitude: 14.9400 },
  { name: 'Yagoua', region: 'Extrême-Nord', latitude: 10.3400, longitude: 15.2300 },

  // Est
  { name: 'Bertoua', region: 'Est', latitude: 4.5772, longitude: 13.6846 },
  { name: 'Batouri', region: 'Est', latitude: 4.4333, longitude: 14.3667 },
  { name: 'Abong-Mbang', region: 'Est', latitude: 3.9833, longitude: 13.1833 },
];

export const AGRO_DOMAINS = [
  {
    id: 'Pisciculture',
    name: 'Pisciculture hors-sol & étang',
    shortName: 'Pisciculture',
    specie: 'Clarias gariepinus (Silure) & Tilapia',
    icon: 'Fish',
    color: 'from-blue-600 to-cyan-500',
    cycleMonths: 5,
    minBudgetFcfa: 350000,
    estimatedRoi: '42% - 55%',
    description: 'Élevage intensif en bacs hors-sol ou étangs. Très forte demande urbaine à Yaoundé et Douala (marché Sandaga & Mfoundi).',
  },
  {
    id: 'Héliciculture',
    name: 'Héliciculture (Escargots géants)',
    shortName: 'Héliciculture',
    specie: 'Archachatina marginata',
    icon: 'Shell',
    color: 'from-amber-600 to-orange-500',
    cycleMonths: 8,
    minBudgetFcfa: 200000,
    estimatedRoi: '65% - 85%',
    description: 'Filière à haute valeur ajoutée et faible investissement initial. Alimentation économique à base de papaye, feuilles et calcaire local.',
  },
  {
    id: 'Aviculture',
    name: 'Aviculture (Poulet de chair & Pondeuses)',
    shortName: 'Aviculture',
    specie: 'Cobb 500 & Goliath',
    icon: 'Egg',
    color: 'from-emerald-600 to-teal-500',
    cycleMonths: 1.5,
    minBudgetFcfa: 450000,
    estimatedRoi: '25% - 35%',
    description: 'Rotation ultra-rapide (45 jours pour les poulets de chair). Marché garanti lors des fêtes et circuits de rôtisseries locales.',
  },
  {
    id: 'Cuniculture',
    name: 'Cuniculture (Lapins de chair)',
    shortName: 'Cuniculture',
    specie: 'Géant des Flandres & Néo-Zélandais',
    icon: 'Feather',
    color: 'from-purple-600 to-pink-500',
    cycleMonths: 3.5,
    minBudgetFcfa: 250000,
    estimatedRoi: '50% - 70%',
    description: 'Prolificité exceptionnelle et viande blanche diététique très prisée dans les restaurants gastronomiques de Douala et Yaoundé.',
  },
  {
    id: 'Maraîchage',
    name: 'Maraîchage intensif (Tomate, Piment, Poivron)',
    shortName: 'Maraîchage',
    specie: 'Tomate Cobra F1, Piment Bec d\'oiseau',
    icon: 'Sprout',
    color: 'from-green-600 to-lime-500',
    cycleMonths: 3,
    minBudgetFcfa: 300000,
    estimatedRoi: '45% - 60%',
    description: 'Culture sous abri ou plein champ avec goutte-à-goutte. Forte volatilité des prix permettant des marges exceptionnelles en contre-saison.',
  },
  {
    id: 'Porciculture',
    name: 'Porciculture (Élevage porcin)',
    shortName: 'Porciculture',
    specie: 'Large White & Landrace',
    icon: 'Wheat',
    color: 'from-rose-600 to-red-500',
    cycleMonths: 6,
    minBudgetFcfa: 600000,
    estimatedRoi: '35% - 48%',
    description: 'Filière reine dans les régions du Centre, Littoral et Ouest. Valorisation efficace des drêches de brasserie et sons locaux.',
  },
  {
    id: 'Apiculture',
    name: 'Apiculture moderne (Miel & Cire d\'abeille)',
    shortName: 'Apiculture',
    specie: 'Apis mellifera adansonii',
    icon: 'Sparkles',
    color: 'from-yellow-600 to-amber-500',
    cycleMonths: 6,
    minBudgetFcfa: 180000,
    estimatedRoi: '70% - 90%',
    description: 'Production de miel biologique (ruches kényanes et Dadant). Très prisé dans les hauts plateaux de l\'Ouest et la savane de l\'Adamaoua.',
  },
];

export const CAMEROON_AGRO_ZONES: AgroZone[] = [
  {
    name: 'Zone I : Soudano-Sahélienne',
    regions: ['Extrême-Nord', 'Nord'],
    climate: 'Chaud et sec, pluviométrie faible (400 - 900 mm)',
    characteristics: 'Sols sablo-argileux, forte évaporation, crucialité de l\'irrigation et forages solaires.',
    bestSectors: ['Aviculture locale (Goliath)', 'Apiculture', 'Oignon & Maraîchage irrigué'],
  },
  {
    name: 'Zone II : Hautes Savanes Guinéennes',
    regions: ['Adamaoua'],
    climate: 'Tempéré d\'altitude, pluviométrie moyenne (1500 mm)',
    characteristics: 'Plateaux d\'altitude, excellents pâturages, conditions idéales pour le miel et le maïs.',
    bestSectors: ['Apiculture de montagne', 'Cuniculture', 'Bovins & Maraîchage'],
  },
  {
    name: 'Zone III : Hauts Plateaux de l\'Ouest',
    regions: ['Ouest', 'Nord-Ouest'],
    climate: 'Frais d\'altitude (1500 - 2000 m), sols volcaniques fertiles',
    characteristics: 'Forte densité agricole, bassin principal de production avicole et maraîchère du pays.',
    bestSectors: ['Aviculture intensive', 'Maraîchage (Tomate, Pomme de terre)', 'Porciculture'],
  },
  {
    name: 'Zone IV : Forêt Humide Monomodale',
    regions: ['Littoral', 'Sud-Ouest'],
    climate: 'Très pluvieux (2000 - 4000 mm), humidité constante (> 85%)',
    characteristics: 'Proximité des ports et grands marchés, accès facile aux sous-produits de meunerie et poissonnerie.',
    bestSectors: ['Pisciculture hors-sol', 'Héliciculture géante', 'Poulet de chair'],
  },
  {
    name: 'Zone V : Forêt Humide Bimodale',
    regions: ['Centre', 'Sud', 'Est'],
    climate: '4 saisons (2 saisons des pluies, 2 saisons sèches), 1600 mm',
    characteristics: 'Températures douces (24-27°C), abondance de cours d\'eau, réseau dense de provenderies.',
    bestSectors: ['Pisciculture (Silure Clarias)', 'Héliciculture', 'Porciculture', 'Maraîchage périurbain'],
  },
];

export function getCoordinates(city: string, region: string): { lat: number; lon: number } {
  const match = CAMEROON_CITIES.find(
    (c) => c.name.toLowerCase() === city.toLowerCase() || (c.region === region && c.name.includes(city))
  );
  if (match) return { lat: match.latitude, lon: match.longitude };

  const capitalName = CAMEROON_REGIONS[region];
  if (capitalName) {
    const capMatch = CAMEROON_CITIES.find((c) => c.name === capitalName);
    if (capMatch) return { lat: capMatch.latitude, lon: capMatch.longitude };
  }

  // Yaoundé fallback
  return { lat: 3.8480, lon: 11.5021 };
}
