import { FinancialItem, ProjectSimulation, Supplier, TimelineStep } from '../supabase/types';

interface SimulationParams {
  domain: string;
  region: string;
  city: string;
  budgetFcfa: number;
  spaceSqm: number;
  waterSource?: string;
  experienceLevel?: string;
  nearbySuppliers?: Supplier[];
}

export function computeProjectSimulation({
  domain,
  region,
  city,
  budgetFcfa,
  spaceSqm,
  waterSource = 'Puits / Forage',
  experienceLevel = 'Débutant',
  nearbySuppliers = [],
}: SimulationParams): ProjectSimulation {
  const financialBreakdown: FinancialItem[] = [];
  const timeline: TimelineStep[] = [];
  const keyRecommendations: string[] = [];

  let totalCapex = 0;
  let totalOpex = 0;
  let estimatedTurnover = 0;
  let productionCycleMonths = 5;
  let projectTitle = '';
  let executiveSummary = '';

  const waterBonus = waterSource.includes('Forage') || waterSource.includes('Puits') ? 5 : 0;
  const experiencePenalty = experienceLevel === 'Débutant' ? -5 : 0;
  let feasibilityScore = Math.min(95, Math.max(65, 85 + waterBonus + experiencePenalty));

  if (domain === 'Pisciculture') {
    projectTitle = `Ferme Piscicole Hors-Sol Silure (Clarias) - ${city} (${region})`;
    productionCycleMonths = 5;

    // Calcul dimensionnement bacs et alevins
    const numTanks = Math.max(1, Math.floor(spaceSqm / 10));
    const fishPerTank = 500;
    const totalFish = numTanks * fishPerTank;

    // CAPEX
    const tankCost = numTanks * 125000;
    const plumbingCost = numTanks * 35000;
    const airPumpCost = 45000;
    const testKitCost = 15000;
    const shelterCost = numTanks * 25000;

    financialBreakdown.push(
      {
        item_name: `Bacs bâchés / Hors-sol (${numTanks} unité${numTanks > 1 ? 's' : ''} de 2m x 1m x 1m)`,
        category: 'CAPEX',
        unit_cost_fcfa: 125000,
        quantity: numTanks,
        total_fcfa: tankCost,
        notes: 'Bâche PVC alimentaire armée + structure acier galvanisé antirouille',
      },
      {
        item_name: 'Système de tuyauterie PVC & évacuation rapide',
        category: 'CAPEX',
        unit_cost_fcfa: 35000,
        quantity: numTanks,
        total_fcfa: plumbingCost,
        notes: 'Vannes de vidange 50mm et coudes d\'évacuation des boues',
      },
      {
        item_name: 'Kit aérateur / Surpresseur d\'oxygène à bulles',
        category: 'CAPEX',
        unit_cost_fcfa: 45000,
        quantity: 1,
        total_fcfa: airPumpCost,
        notes: 'Indispensable pour maintenir un taux d\'O2 dissous > 5 mg/L',
      },
      {
        item_name: 'Kits d\'analyse eau (pH mètre, thermomètre, réactifs ammoniac)',
        category: 'CAPEX',
        unit_cost_fcfa: 15000,
        quantity: 1,
        total_fcfa: testKitCost,
        notes: 'Contrôle biquotidien du pH (6.5 - 8.0) et température (26 - 30°C)',
      },
      {
        item_name: 'Ombrière & filet anti-oiseaux / prédateurs',
        category: 'CAPEX',
        unit_cost_fcfa: 25000,
        quantity: numTanks,
        total_fcfa: shelterCost,
        notes: 'Protection contre le soleil direct et les rapaces',
      }
    );

    // OPEX
    const alevinCost = totalFish * 100;
    const feedCost = totalFish * 550; // Granulés extrudés Skretting / Gouessant + provende locale
    const probioticCost = 25000;
    const vitaminsCost = 15000;
    const electricityCost = 35000;

    financialBreakdown.push(
      {
        item_name: `Alevins de Clarias gariepinus triés (${totalFish} sujets de 10-15g)`,
        category: 'OPEX',
        unit_cost_fcfa: 100,
        quantity: totalFish,
        total_fcfa: alevinCost,
        notes: 'Sélectionner des alevins vigoureux sans blessures ni branchies pâles',
      },
      {
        item_name: `Aliments extrudés flottants & finition (${Math.round(totalFish * 1.1)} kg)`,
        category: 'OPEX',
        unit_cost_fcfa: 550,
        quantity: totalFish,
        total_fcfa: feedCost,
        notes: 'Transition progressive du 2mm (45% PB) au 6mm puis provende locale (38% PB)',
      },
      {
        item_name: 'Probiotiques pour eau & sel gemme de désinfection',
        category: 'OPEX',
        unit_cost_fcfa: 25000,
        quantity: 1,
        total_fcfa: probioticCost,
        notes: 'Prévention des mycoses et réduction des odeurs d\'ammoniac',
      },
      {
        item_name: 'Vitamines anti-stress & hépatoprotecteurs',
        category: 'OPEX',
        unit_cost_fcfa: 15000,
        quantity: 1,
        total_fcfa: vitaminsCost,
        notes: 'Administration lors des changements d\'eau et tris mensuels',
      },
      {
        item_name: 'Consommables & énergie (pompage eau)',
        category: 'OPEX',
        unit_cost_fcfa: 35000,
        quantity: 1,
        total_fcfa: electricityCost,
        notes: 'Électricité ou carburant groupe motopompe pour renouvellement d\'eau',
      }
    );

    // Timeline
    timeline.push(
      {
        phase: 'Phase 1 : Installation & Mise en eau',
        period: 'Semaine 1 à 2',
        title: 'Montage des bacs et cyclage biologique',
        description:
          'Nettoyage au sel marin, remplissage des bacs, mise en marche de l\'aération et stabilisation des paramètres bactériologiques.',
        checklist: [
          'Monter la structure métallique et vérifier le niveau du sol',
          'Rincer la bâche à l\'eau salée sans détergent chimique',
          'Vérifier le débit du puits / forage et le système de trop-plein',
          'Mesurer le pH de l\'eau (cible : 7.0 - 7.5)',
        ],
      },
      {
        phase: 'Phase 2 : Empoissonnement & Démarrage',
        period: 'Semaine 3 à 6',
        title: 'Acclimatation des alevins et rationnement initial',
        description:
          'Flottage des sachets d\'alevins pendant 20 minutes avant libération. Alimentation 4 fois par jour en micro-granulés 1.5mm.',
        checklist: [
          'Acclimater la température de l\'eau avant introduction',
          'Nourrir au 2mm (45% protéines) à volonté contrôlée',
          'Nettoyer le fond des bacs tous les 2 jours par siphonage',
          'Noter les mortalités éventuelles sur le cahier d\'élevage',
        ],
      },
      {
        phase: 'Phase 3 : Croissance & Calibrage (Tri)',
        period: 'Mois 2 à 4',
        title: 'Séparation par taille pour éviter le cannibalisme',
        description:
          'Effectuer un tri strict tous les 25 jours pour isoler les "shooters" (gros silures agressifs) des sujets plus lents.',
        checklist: [
          'Trier les poissons en 3 calibres (Petits, Moyens, Gros)',
          'Augmenter le diamètre d\'aliment (3mm puis 4.5mm)',
          'Introduire 20% de provende locale économique enrichie',
          'Renouveler 40% du volume d\'eau quotidiennement',
        ],
      },
      {
        phase: 'Phase 4 : Finition & Vente aux grossistes',
        period: 'Mois 5',
        title: 'Pesée marchande et commercialisation',
        description:
          'Atteinte du poids cible (800g à 1.2kg). Vente directe aux braiseuses, poissonneries et restaurants de Yaoundé/Douala.',
        checklist: [
          'Mettre les poissons à jeun 24h avant la vente',
          'Négocier le prix bord-bassin (1 800 à 2 200 FCFA/kg)',
          'Livrer vivants en bacs aérés ou abattre sur commande',
          'Désinfecter et assécher les bacs avant le cycle suivant',
        ],
      }
    );

    // Business Output
    const survivalRate = 0.88;
    const finalFishCount = totalFish * survivalRate;
    const averageWeightKg = 0.95;
    const totalHarvestKg = finalFishCount * averageWeightKg;
    const pricePerKgFcfa = 2000; // Prix moyen Cameroun
    estimatedTurnover = Math.round(totalHarvestKg * pricePerKgFcfa);

    keyRecommendations.push(
      'Installez impérativement un système de trop-plein pour éviter le débordement lors des fortes pluies.',
      'Ne négligez jamais le tri mensuel : le Clarias non trié pratique le cannibalisme sur les plus petits.',
      'Négociez des contrats d\'enlèvement réguliers avec 2 ou 3 rôtisseries / braiseuses de votre quartier.'
    );
  } else if (domain === 'Héliciculture') {
    projectTitle = `Élevage Intensif d'Escargots Géants (Archachatina marginata) - ${city}`;
    productionCycleMonths = 8;

    const numBoxes = Math.max(2, Math.floor(spaceSqm / 5));
    const breedersCount = numBoxes * 50;

    financialBreakdown.push(
      {
        item_name: `Escargotières en bois imputrescible / parpaings (${numBoxes} unités)`,
        category: 'CAPEX',
        unit_cost_fcfa: 45000,
        quantity: numBoxes,
        total_fcfa: numBoxes * 45000,
        notes: 'Grillage moustiquaire inox et système anti-fuite huileux',
      },
      {
        item_name: 'Système de brumisation manuelle / pulvérisateurs pro',
        category: 'CAPEX',
        unit_cost_fcfa: 20000,
        quantity: 1,
        total_fcfa: 20000,
        notes: 'Maintien d\'une hygrométrie constante de 80-90%',
      },
      {
        item_name: `Géniteurs Archachatina marginata (${breedersCount} reproducteurs adultes)`,
        category: 'OPEX',
        unit_cost_fcfa: 800,
        quantity: breedersCount,
        total_fcfa: breedersCount * 800,
        notes: 'Sujets matures de 150-250g avec coquille intacte',
      },
      {
        item_name: 'Substrat terreau forestier traité & calcaire / poudre de coquille',
        category: 'OPEX',
        unit_cost_fcfa: 35000,
        quantity: 1,
        total_fcfa: 35000,
        notes: 'Apport de carbonate de calcium pour la solidité de la coquille',
      },
      {
        item_name: 'Complément alimentaire farine de maïs, soja et fruits locaux',
        category: 'OPEX',
        unit_cost_fcfa: 45000,
        quantity: 1,
        total_fcfa: 45000,
        notes: 'Papaye, feuilles de manioc douces, pastèque et farine enrichie',
      }
    );

    timeline.push(
      {
        phase: 'Phase 1 : Aménagement de l\'escargotière',
        period: 'Semaine 1 à 3',
        title: 'Préparation du substrat et sécurisation des enclos',
        description: 'Désinfection thermique de la terre noire, pose de moustiquaires et barrières anti-fourmis.',
        checklist: [
          'Traiter la terre végétale contre les parasites et acariens',
          'Vérifier l\'étanchéité des fermetures et joints d\'aération',
          'Installer les abreuvoirs plats pour éviter les noyades',
        ],
      },
      {
        phase: 'Phase 2 : Introduction des géniteurs & Ponte',
        period: 'Mois 2 à 3',
        title: 'Accouplement et collecte des œufs',
        description: 'Brumisation crépusculaire quotidienne, ponte dans le substrat meuble et transfert en couveuse.',
        checklist: [
          'Maintenir une humidité nocturne de 85%',
          'Rechercher les pontes délicatement chaque matin',
          'Transférer les œufs en boîte d\'incubation sur lit humide',
        ],
      },
      {
        phase: 'Phase 3 : Éclosion & Élevage des naissains',
        period: 'Mois 4 à 7',
        title: 'Nourrissage intensif riche en calcium',
        description: 'Alimentation des jeunes escargots avec pâtées enrichies en poudre de coquille d\'huître.',
        checklist: [
          'Distribuer les feuilles tendres et la farine calcaire',
          'Nettoyer les fèces pour éviter les fermentations toxiques',
          'Contrôler la croissance et la dureté de la coquille',
        ],
      },
      {
        phase: 'Phase 4 : Récolte marchande & Commercialisation',
        period: 'Mois 8',
        title: 'Vente aux restaurants et hôtels',
        description: 'Triage des escargots de 200-350g. Vente vivante ou décoquillée sous vide.',
        checklist: [
          'Faire jeûner les escargots 48h avec son de maïs',
          'Conditionner en sacs aérés de 50 unités',
          'Vendre entre 500 et 800 FCFA l\'unité sur le marché local',
        ],
      }
    );

    const offspringPerBreeder = 18;
    const totalHarvestSnails = breedersCount * offspringPerBreeder;
    estimatedTurnover = Math.round(totalHarvestSnails * 600);

    keyRecommendations.push(
      'Les fourmis sont le prédateur numéro 1 : installez des douves d\'eau huilée autour des pieds des parcs.',
      'Un manque de calcium entraîne le cannibalisme de coquille : saupoudrez toujours de la craie ou coquille d\'œuf broyée.',
      'Ne mouillez jamais les escargots avec une eau javellisée ou chlorée non dégazée.'
    );
  } else {
    // Autres filières (Aviculture, Maraîchage, Cuniculture, etc.)
    projectTitle = `Projet Agro-Pastoral ${domain} Optimisé - ${city}`;
    productionCycleMonths = domain === 'Aviculture' ? 1.5 : domain === 'Maraîchage' ? 3 : 4;

    const baseCapex = Math.round(budgetFcfa * 0.45);
    const baseOpex = Math.round(budgetFcfa * 0.45);

    financialBreakdown.push(
      {
        item_name: `Aménagements techniques et bâtiments (${domain})`,
        category: 'CAPEX',
        unit_cost_fcfa: baseCapex,
        quantity: 1,
        total_fcfa: baseCapex,
        notes: 'Infrastructures durables adaptées au climat local',
      },
      {
        item_name: 'Intrants de démarrage, sujets / semences certifiées',
        category: 'OPEX',
        unit_cost_fcfa: Math.round(baseOpex * 0.4),
        quantity: 1,
        total_fcfa: Math.round(baseOpex * 0.4),
        notes: 'Approvisionnement auprès de distributeurs agréés MINADER / MINEPIA',
      },
      {
        item_name: 'Alimentation / Engrais organiques & Traitements préventifs',
        category: 'OPEX',
        unit_cost_fcfa: Math.round(baseOpex * 0.6),
        quantity: 1,
        total_fcfa: Math.round(baseOpex * 0.6),
        notes: 'Formulation locale pour réduire le coût de revient',
      }
    );

    timeline.push(
      {
        phase: 'Phase 1 : Préparation & Achat matériel',
        period: 'Semaine 1 à 2',
        title: 'Mise en place de l\'atelier de production',
        description: 'Désinfection, mise en place des équipements et vérification des sources d\'eau.',
        checklist: ['Nettoyer le site', 'Installer l\'ombrage et l\'aération', 'Sécuriser le stockage des intrants'],
      },
      {
        phase: 'Phase 2 : Lancement du cycle',
        period: 'Semaine 3 à 6',
        title: 'Conduite technique et suivi sanitaire rigoureux',
        description: 'Application stricte du calendrier de prophylaxie et contrôle quotidien des paramètres.',
        checklist: ['Pesées de contrôle', 'Ajustement des rations', 'Tenue rigoureuse du registre d\'exploitation'],
      },
      {
        phase: 'Phase 3 : Récolte et vente',
        period: `Mois ${productionCycleMonths}`,
        title: 'Valorisation marchande sur les marchés de proximité',
        description: 'Vente directe pour maximiser la marge nette sans intermédiaires abusifs.',
        checklist: ['Conditionnement soigné', 'Distribution aux clients pré-commandés', 'Bilan financier de clôture'],
      }
    );

    estimatedTurnover = Math.round(budgetFcfa * 1.55);
    keyRecommendations.push(
      'Tenir un registre journalier des entrées et sorties pour un suivi précis de la trésorerie.',
      'S\'approvisionner chez des fournisseurs locaux vérifiés pour réduire les frais de transport.',
      'Anticiper la commercialisation dès le milieu du cycle de production.'
    );
  }

  totalCapex = financialBreakdown
    .filter((f) => f.category === 'CAPEX')
    .reduce((acc, cur) => acc + cur.total_fcfa, 0);

  totalOpex = financialBreakdown
    .filter((f) => f.category === 'OPEX')
    .reduce((acc, cur) => acc + cur.total_fcfa, 0);

  const totalInvestment = totalCapex + totalOpex;
  const reserveFund = Math.round(totalInvestment * 0.1);
  const netProfit = Math.max(0, estimatedTurnover - totalOpex);
  const roiPercentage =
    totalInvestment > 0
      ? Math.round(((netProfit) / totalInvestment) * 1000) / 10
      : 45.0;

  let feasibilityStatus = 'Faisabilité Très Élevée';
  if (feasibilityScore < 75) feasibilityStatus = 'Faisabilité Modérée (Suivi Recommandé)';
  else if (feasibilityScore < 85) feasibilityStatus = 'Faisabilité Bonne';

  executiveSummary = `Pour un investissement initial de ${new Intl.NumberFormat('fr-FR').format(
    totalInvestment
  )} FCFA à ${city} (${region}), ce projet en ${domain} présente un potentiel de chiffre d'affaires estimé à ${new Intl.NumberFormat(
    'fr-FR'
  ).format(estimatedTurnover)} FCFA sur un cycle de ${productionCycleMonths} mois, soit un ROI prévisionnel de ${roiPercentage}%.`;

  return {
    domain,
    project_title: projectTitle,
    region,
    city,
    feasibility_score: feasibilityScore,
    feasibility_status: feasibilityStatus,
    executive_summary: executiveSummary,
    total_budget_requested_fcfa: budgetFcfa,
    total_capex_fcfa: totalCapex,
    total_opex_fcfa: totalOpex,
    total_investment_fcfa: totalInvestment,
    reserve_fund_fcfa: reserveFund,
    estimated_turnover_fcfa: estimatedTurnover,
    net_profit_fcfa: netProfit,
    roi_percentage: roiPercentage,
    production_cycle_months: productionCycleMonths,
    financial_breakdown: financialBreakdown,
    timeline: timeline,
    key_recommendations: keyRecommendations,
    nearby_suppliers: nearbySuppliers.slice(0, 3),
  };
}
