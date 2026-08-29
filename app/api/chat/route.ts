import { NextResponse } from 'next/server';
import { queryRagContext } from '@/lib/supabase/services/ragService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, category } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages requis' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.text || '';

    // Retrieve relevant RAG knowledge chunks from Supabase pgvector / knowledge base
    const ragContextChunks = await queryRagContext(userPrompt, category);

    // Formulate structured response based on user prompt and RAG context
    const lowerPrompt = userPrompt.toLowerCase();
    let responseText = '';

    if (ragContextChunks && ragContextChunks.length > 0) {
      const topChunk = ragContextChunks[0];
      responseText = `Analyse basée sur la base de connaissances Agricx (Pertinence : ${(topChunk.similarity * 100).toFixed(0)}%) :\n\n${topChunk.content}\n\n• Conseil pratique : Veillez au respect des posologies locales et appliquez les mesures préventives sans délai.`;
    } else if (lowerPrompt.includes('silure') || lowerPrompt.includes('poisson')) {
      responseText =
        "Protocole Piscicole — Silure Clarias :\n\n• Diagnostic : Stress asphyxique ou montée de nitrites.\n• Conduite à tenir :\n1. Renouveler 50% de l'eau avec de l'eau propre non chlorée.\n2. Arrêter le nourrissage pendant 24h.\n3. Salage au gros sel non iodé à 1.5 kg/m³ d'eau.\n4. Oxygéner par cascade ou bulleur.";
    } else if (lowerPrompt.includes('poulet') || lowerPrompt.includes('coccidiose')) {
      responseText =
        "Protocole Avicole — Poulets de chair :\n\n• Diagnostic : Suspicion de Coccidiose.\n• Conduite à tenir :\n1. Isoler les sujets abattus.\n2. Administrer Amprolium 20% ou Toltrazuril dans l'eau de boisson pendant 3 à 5 jours.\n3. Remplacer la litière souillée par des copeaux secs désinfectés.\n4. Administrer des vitamines A, D3, E, K post-traitement.";
    } else {
      responseText =
        "Recommandation Agricx :\n\nPour ce type de pathologie ou de questionnement zootechnique, nous vous recommandons de contrôler la qualité de vos intrants et les paramètres d'élevage. N'hésitez pas à consulter un vétérinaire partenaire via l'annuaire.";
    }

    return NextResponse.json({
      text: responseText,
      ragSources: ragContextChunks.map((c) => ({
        id: c.id,
        category: c.category,
        similarity: c.similarity,
      })),
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    });
  } catch (err: unknown) {
    console.error('Erreur API Chat:', err);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la requête IA' },
      { status: 500 }
    );
  }
}
