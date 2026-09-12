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
    const userPrompt = lastMessage.text || lastMessage.content || '';

    // 1. Récupération du contexte RAG depuis Supabase
    const ragContextChunks = await queryRagContext(userPrompt, category);

    // 2. Préparation du contexte système Agricx avec injection RAG
    let systemContext =
      "Tu es Agricx IA, l'assistant agropastoral expert du Cameroun (cultures vivrières, rente, élevage, santé animale et gestion financière en FCFA). Réponds toujours en français clair, précis, bienveillant et structuré.";

    if (ragContextChunks && ragContextChunks.length > 0) {
      const topContext = ragContextChunks
        .slice(0, 3)
        .map((c) => c.content)
        .join('\n---\n');
      systemContext += `\n\nVoici des données officielles et techniques vérifiées issues de la base de connaissances Agricx à utiliser si pertinent :\n${topContext}`;
    }

    // 3. Appel au modèle finetuné sur Ollama (AWS EC2)
    const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
    const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'agricx';

    let responseText = '';

    try {
      // Formatage de l'historique pour Ollama
      const formattedMessages = [
        { role: 'system', content: systemContext },
        ...messages.map((m) => ({
          role: m.sender === 'user' || m.role === 'user' ? 'user' : 'assistant',
          content: m.text || m.content || '',
        })),
      ];

      const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages: formattedMessages,
          stream: false,
          options: {
            temperature: 0.2,
            top_p: 0.9,
          },
        }),
        signal: AbortSignal.timeout(20000), // Timeout de 20s
      });

      if (ollamaRes.ok) {
        const ollamaData = await ollamaRes.json();
        responseText = ollamaData.message?.content?.trim() || '';
      } else {
        console.warn(`Ollama HTTP ${ollamaRes.status} sur ${OLLAMA_URL}, activation du fallback local.`);
      }
    } catch (ollamaErr) {
      console.warn('Ollama EC2 inaccessible ou timeout, utilisation du fallback RAG:', ollamaErr);
    }

    // 4. Fallback intelligent si le serveur IA est indisponible
    if (!responseText) {
      const lowerPrompt = userPrompt.toLowerCase();
      if (ragContextChunks && ragContextChunks.length > 0) {
        const topChunk = ragContextChunks[0];
        responseText = `Analyse basée sur la base de connaissances Agricx (Pertinence : ${(topChunk.similarity * 100).toFixed(0)}%) :\n\n${topChunk.content}\n\n• Conseil pratique : Veillez au respect des posologies locales et appliquez les mesures préventives sans délai.`;
      } else if (lowerPrompt.includes('silure') || lowerPrompt.includes('poisson') || lowerPrompt.includes('bac')) {
        responseText =
          "Protocole Piscicole — Silure Clarias :\n\n• Diagnostic : Stress asphyxique ou montée de nitrites.\n• Conduite à tenir :\n1. Renouveler 50% de l'eau avec de l'eau propre non chlorée.\n2. Arrêter le nourrissage pendant 24h.\n3. Salage au gros sel non iodé à 1.5 kg/m³ d'eau.\n4. Oxygéner par cascade ou bulleur.";
      } else if (lowerPrompt.includes('poulet') || lowerPrompt.includes('coccidiose') || lowerPrompt.includes('fiente')) {
        responseText =
          "Protocole Avicole — Poulets de chair :\n\n• Diagnostic : Suspicion de Coccidiose.\n• Conduite à tenir :\n1. Isoler les sujets abattus.\n2. Administrer Amprolium 20% ou Toltrazuril dans l'eau de boisson pendant 3 à 5 jours.\n3. Remplacer la litière souillée par des copeaux secs désinfectés.\n4. Administrer des vitamines A, D3, E, K post-traitement.";
      } else if (lowerPrompt.includes('mais') || lowerPrompt.includes('maïs') || lowerPrompt.includes('fertilisation')) {
        responseText =
          "Recommandation Agricx — Culture du Maïs au Cameroun :\n\n• Semences recommandées : Variétés améliorées IRAD (ex: CMS 8704 ou CHC 201).\n• Fertilisation : 200 kg/ha de NPK 15-15-15 au semis, puis 100 kg/ha d'Urée au 30e jour.\n• Densité : 50 000 à 62 500 plants/ha (80 cm x 40 cm, 2 grains par poquet).";
      } else {
        responseText =
          "Recommandation Agricx :\n\nPour optimiser votre exploitation agropastorale, veillez à la qualité de vos semences et intrants, et respectez les calendriers de traitement locaux. N'hésitez pas à consulter un expert partenaire via l'annuaire.";
      }
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

