const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://iwxlicuixlfiobyfgvdi.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGxpY3VpeGxmaW9ieWZndmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDI0NTIsImV4cCI6MjA4ODU3ODQ1Mn0.lNy4pe3wU_Os-8pnagBQowbL5MhmbwV8V-zFwYLVNeo'
);

const GUIDES = [
  {
    title: "Guide Pratique MINEPIA — Élevage du Silure Clarias au Cameroun",
    category: "Pisciculture",
    source: "MINEPIA / Direction des Pêches et de l'Aquaculture",
    chunks: [
      {
        content: `PISCICULTURE EN BACS ET ÉTANGS DU SILURE (CLARIAS GARIEPINUS) AU CAMEROUN :
1. Infrastructures d'élevage :
- Bacs hors-sol (béton, bâchés ou fûts plastiques alimentaires de 1000L) ou étangs en dérivation.
- Densité de mise en charge : 50 à 70 alevins par m³ en bac intensif avec renouvellement quotidien d'eau, ou 10 à 15 poissons/m² en étang de terre.
- Renouvellement de l'eau : 30% à 50% du volume tous les 2 jours en bac pour éliminer les déjections et ammoniac. Eau de forage ou de puits dégazée (proscrire l'eau javellisée du robinet sans aération préalable).
2. Alimentation et calibrage :
- Granulés extrudés flottants : Taux de protéines de 45% (stade alevin 1-10g), 40% (croissance 10-150g), 35-38% (finition 150g-1kg).
- Calibrage obligatoire tous les 15 jours : Le Clarias est hautement cannibale ; trier les sujets par classe de taille pour éviter les pertes.
- Cycle de production : 5 à 6 mois pour atteindre un poids marchand de 800g à 1.2 kg.`,
        category: "Pisciculture",
        metadata: { subtopic: "silure_clarias_bac" },
      },
    ],
  },
  {
    title: "Guide Pratique MINEPIA — Conduite d'Élevage Porcin au Cameroun",
    category: "Porciculture",
    source: "MINEPIA / Fiches Zootechniques Porcines",
    chunks: [
      {
        content: `CONDUITE D'UNE PORCHERIE MODERNE AU CAMEROUN :
1. Bâtiment et hygiène :
- Loges séparées sur sol en ciment rugueux avec pente de 3% vers un caniveau d'évacuation des lisiers.
- Surface : 1.5 m² par porc en engraissement, 5 m² pour une truie avec porcelets.
- Clôture et sas de biosécurité indispensables contre la Peste Porcine Africaine (PPA) : désinfection pédiluve obligatoire à l'entrée.
2. Alimentation et engraissement :
- Formulations locales équilibrées : Maïs concassé (50%), Son de blé/riz (25%), Tourteau de coton ou soja (15%), Farine de sang ou poisson (5%), CMV porc (5%).
- Ration : Porcelet sevré (0.5 à 1 kg/jour), Engraissement (1.5 à 2.5 kg/jour), Truie gestante (2.5 à 3 kg/jour).
- Durée d'engraissement : 6 à 7 mois pour un poids d'abattage de 80 à 100 kg.`,
        category: "Porciculture",
        metadata: { subtopic: "porcherie_ppa_alimentation" },
      },
    ],
  },
];

async function ingest() {
  console.log("Ingestion des guides Pisciculture et Porciculture...");
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
      console.log(`  -> ${chunks.length} chunks insérés.`);
    }
  }
}

ingest();
