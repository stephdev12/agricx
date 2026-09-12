const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://iwxlicuixlfiobyfgvdi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGxpY3VpeGxmaW9ieWZndmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDI0NTIsImV4cCI6MjA4ODU3ODQ1Mn0.lNy4pe3wU_Os-8pnagBQowbL5MhmbwV8V-zFwYLVNeo'
);

const GUIDES = [
  {
    title: "Guide Pratique MINEPIA — Élevage du Poulet de Chair au Cameroun",
    category: "Aviculture",
    source: "MINEPIA / Synthèse Technique Avicole Cameroun",
    chunks: [
      {
        content: `GUIDE DÉMARRAGE ÉLEVAGE POULET DE CHAIR AU CAMEROUN :
1. Préparation du bâtiment et biosécurité :
- Bâtiment orienté Est-Ouest pour limiter l'insolation directe et favoriser la ventilation naturelle.
- Désinfection complète du sol et murs à la chaux vive ou crésyl 10 jours avant l'arrivée des poussins.
- Litière : Copeaux de bois blancs dépoussiérés (épaisseur 5 à 7 cm). Ne jamais utiliser de sciure fine ou de copeaux de bois traités.
- Densité recommandée : 10 à 12 sujets par m² en zone chaude (Littoral, Centre, Sud) et 12 à 14 sujets/m² dans les Hauts-Plateaux (Ouest, Nord-Ouest).
- Poussinnière chauffée : Garde d'élevage ronde, radiant ou lampes chauffantes avec température de 32-35°C à J1, réduite de 2°C chaque semaine jusqu'à 24°C.`,
        category: "Aviculture",
        metadata: { subtopic: "batiment_biosecurite_densite" },
      },
      {
        content: `CHOIX DES POUSSINS ET CONDUITE DE L'ALIMENTATION DU POULET DE CHAIR :
- Souches recommandées au Cameroun : Cobb 500 ou Ross 308 (croissance rapide, bonne conformation musculaire et résistance).
- Approvisionnement : Acheter exclusivement auprès d'accouveurs et distributeurs agréés (ex: SPC, Belgocam, Provenderies certifiées).
- Phases alimentaires pour 100 kg :
  * Démarrage (J1 à J21) : 21% à 22% Protéines Brutes (PB) — Consommation env. 800g à 1kg par sujet.
  * Croissance (J22 à J35) : 19% à 20% PB — Consommation env. 1.5kg par sujet.
  * Finition (J36 à J42/45) : 17% à 18% PB — Consommation env. 1.2kg à 1.5kg par sujet.
- Abreuvement : Eau propre, tempérée, non chlorée à volonté. Ratio : 2 litres d'eau pour 1 kg d'aliment consommé.`,
        category: "Aviculture",
        metadata: { subtopic: "souches_alimentation" },
      },
      {
        content: `CALENDRIER VACCINAL ET PROPHYLAXIE AVICOLE (POULETS DE CHAIR AU CAMEROUN) :
- Jour 1 (au couvoir) : Vaccin Newcastle (souche Hitchner B1 ou VG/GA) + Bronchite infectieuse (H120).
- Jour 1 à Jour 3 : Eau d'accueil sucrée (30g sucre/litre) + Complexe anti-stress Polyvitamines (A, D3, E, K).
- Jour 7 : Premier vaccin Gumboro (souche intermédiaire) dans l'eau de boisson avec lait écrémé protecteur.
- Jour 10 à 14 : Traitement préventif anti-coccidien (Amprolium ou Toltrazuril) pendant 3 à 5 jours consécutifs.
- Jour 14 à 16 : Rappel vaccin Gumboro dans l'eau de boisson.
- Jour 21 : Rappel vaccin Newcastle (souche La Sota) + Complexe vitaminé post-vaccinal.
- Période d'abattage : 40 à 45 jours d'âge pour un poids vif de 2.0 kg à 2.5 kg. Respecter un délai d'attente sans antibiotique de 5 jours avant la vente.`,
        category: "Aviculture",
        metadata: { subtopic: "vaccination_prophylaxie_calendrier" },
      },
    ],
  },
  {
    title: "Guide Pratique MINEPIA — Élevage de Poules Pondeuses au Cameroun",
    category: "Aviculture",
    source: "MINEPIA / Fiches Techniques Avicoles",
    chunks: [
      {
        content: `ÉLEVAGE DE POULES PONDEUSES D'ŒUFS DE TABLE AU CAMEROUN :
- Souches recommandées : Isa Brown, Lohmann Brown, Novogen Brown (excellente ponte de 300 à 320 œufs par poule par an).
- Étapes d'élevage :
  1. Période poussinière (0 à 8 semaines) : Chauffage soigné, aliment démarrage poulette (20% PB).
  2. Période poulette (8 à 18 semaines) : Aliment poulette (15-16% PB), contrôle hebdomadaire du poids corporel pour éviter l'engraissement.
  3. Période de ponte (18 à 72+ semaines) : Entrée en ponte à 18-20 semaines, pic de ponte vers 28-30 semaines (taux > 90%).
- Alimentation ponte : Provende riche en calcium (17% PB et 3.5% à 4.0% de calcium à base de coquilles d'huîtres ou carbonate) pour garantir une coquille d'œuf solide et sans casse.
- Nids et pondoirs : 1 pondoir pour 4 à 5 poules avec paille propre, collecte des œufs 3 fois par jour.`,
        category: "Aviculture",
        metadata: { subtopic: "poules_pondeuses_production" },
      },
    ],
  },
];

async function ingest() {
  console.log("Ingestion des guides d'aviculture enrichis...");
  for (const doc of GUIDES) {
    const { data: newDoc, error: docErr } = await supabase
      .from('rag_knowledge_documents')
      .insert({
        title: doc.title,
        category: doc.category,
        source: doc.source,
      })
      .select('id')
      .single();

    if (docErr || !newDoc) {
      console.error('Doc error:', docErr);
      continue;
    }

    console.log(`Document créé [${newDoc.id}] : ${doc.title}`);

    const chunks = doc.chunks.map((c, i) => ({
      document_id: newDoc.id,
      content: c.content,
      category: c.category,
      chunk_index: i + 1,
      metadata: c.metadata,
    }));

    const { error: chunkErr } = await supabase.from('rag_knowledge_chunks').insert(chunks);
    if (chunkErr) {
      console.error('Chunk error:', chunkErr);
    } else {
      console.log(`  -> ${chunks.length} chunks insérés avec succès.`);
    }
  }
}

ingest();
