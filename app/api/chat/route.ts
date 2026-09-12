import { NextResponse } from 'next/server';
import { queryRagContext } from '@/lib/supabase/services/ragService';

// Vercel Serverless maximum execution duration (jusqu'à 60s)
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

function getSmartFallback(userPrompt: string, ragContextChunks: any[]): string {
  const lowerPrompt = userPrompt.toLowerCase();
  if (ragContextChunks && ragContextChunks.length > 0) {
    const topChunk = ragContextChunks[0];
    return `Analyse technique Agricx (Pertinence : ${(topChunk.similarity * 100).toFixed(0)}%) :\n\n${topChunk.content}\n\n• Recommandation : Respectez rigoureusement ces normes techniques et biosécuritaires pour maximiser la rentabilité de votre exploitation.`;
  }
  if (lowerPrompt.includes('poulet') || lowerPrompt.includes('volaille') || lowerPrompt.includes('poussin') || lowerPrompt.includes('chair') || lowerPrompt.includes('coccidiose') || lowerPrompt.includes('elevage')) {
    return "Guide Pratique Avicole — Poulets de chair au Cameroun :\n\n1. Bâtiment & Litière : Bâtiment aéré orienté Est-Ouest, désinfection complète, litière en copeaux de bois secs (5 à 7 cm), densité de 10 à 12 sujets/m² en zone chaude.\n2. Poussinière & Souches : Poussins d'un jour certifiés (Cobb 500 ou Ross 308), chauffage à 32-35°C la 1ère semaine.\n3. Alimentation & Eau : Provende démarrage (21% PB), abreuvoirs propres avec eau fraîche et vitamines antistress.\n4. Calendrier Sanitaire : Vaccins Newcastle et Gumboro (J7, J14), traitement préventif anti-coccidien (Amprolium à J10-J14). Abattage à 40-45 jours pour un poids de 2.0 à 2.5 kg.\n\nBonne réussite dans votre projet d'élevage avicole !";
  }
  if (lowerPrompt.includes('silure') || lowerPrompt.includes('poisson') || lowerPrompt.includes('bac')) {
    return "Protocole Piscicole — Silure Clarias :\n\n• Densité : 50 à 70 alevins/m³ en bac hors-sol avec renouvellement régulier d'eau.\n• Alimentation : Granulés flottants à 40-45% PB. Calibrage bimensuel indispensable contre le cannibalisme.\n• Conduite d'urgence (stress ou nitrites) : Renouveler 50% de l'eau, salage au gros sel non iodé à 1.5 kg/m³ et aération mécanique.";
  }
  if (lowerPrompt.includes('mais') || lowerPrompt.includes('maïs') || lowerPrompt.includes('fertilisation')) {
    return "Recommandation Agricx — Culture du Maïs au Cameroun :\n\n• Semences recommandées : Variétés améliorées IRAD (ex: CMS 8704 ou CHC 201).\n• Fertilisation : 200 kg/ha de NPK 15-15-15 au semis, puis 100 kg/ha d'Urée au 30e jour.\n• Densité : 50 000 à 62 500 plants/ha (80 cm x 40 cm, 2 grains par poquet).";
  }
  return "Recommandation Agricx :\n\nPour optimiser votre exploitation agropastorale, veillez à la qualité de vos intrants, respectez les calendriers zootechniques et prophylactiques locaux, et suivez les conseils de nos spécialistes partenaires.";
}

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

    // 2. Préparation du contexte système Agricx
    let systemContext =
      "Tu es Agricx IA, l'assistant agropastoral expert du Cameroun. Réponds en français avec précision, clarté et professionnalisme.";

    systemContext += `\n\nCONSIGNES IMPORTANTES :
1. Respecte STRICTEMENT la filière concernée par la question. Si la question concerne l'élevage (poulets, porcs, poissons), il est FORMELLEMENT INTERDIT de mentionner des sols, légumes, cultures, engrais NPK, semences végétales ou irrigation.
2. Structure ta réponse en points concrets numérotés (1 à 2 phrases courtes par point).
3. Conclus TOUJOURS par une brève phrase d'encouragement avant d'arrêter ta génération.
4. Reste concis et va directement à l'essentiel pour que la réponse soit complète sans être interrompue.`;

    if (ragContextChunks && ragContextChunks.length > 0) {
      const topContext = ragContextChunks
        .slice(0, 2)
        .map((c) => c.content)
        .join('\n---\n');
      systemContext += `\n\nDonnées techniques Agricx vérifiées (à reformuler fidèlement selon la filière) :\n${topContext}`;
    }

    // 3. Appel au modèle sur Ollama en mode STREAMING
    const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
    const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma2:2b';

    const isElevageQuery = /poulet|poussin|volaille|poule|chair|elevage|élevage|porc|poisson|silure/i.test(userPrompt);

    const formattedMessages = [
      { role: 'system', content: systemContext },
      ...messages.slice(-4).map((m) => {
        let content = m.text || m.content || '';
        // Éviter que les hallucinations passées stockées dans l'historique du navigateur ne polluent le prompt
        if ((m.sender !== 'user' && m.role !== 'user') && isElevageQuery) {
          content = content
            .replace(/terrain fertile[^.\n]*/gi, '')
            .replace(/engrais[^.\n]*/gi, '')
            .replace(/semence[^.\n]*/gi, '')
            .replace(/culture de [^.\n]*/gi, '')
            .replace(/irrigation[^.\n]*/gi, '');
        }
        return {
          role: m.sender === 'user' || m.role === 'user' ? 'user' : 'assistant',
          content,
        };
      }),
    ];

    try {
      const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Connection': 'close',
        },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages: formattedMessages,
          stream: true,
          keep_alive: '24h',
          options: {
            temperature: 0.15,
            top_p: 0.9,
            num_ctx: 1024,
            num_predict: 280, // Permet de générer les 5 points complets et la phrase de conclusion
          },
        }),
      });

      if (ollamaRes.ok && ollamaRes.body) {
        const reader = ollamaRes.body.getReader();
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const stream = new ReadableStream({
          async start(controller) {
            let buffer = '';
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';
                for (const line of lines) {
                  const trimmed = line.trim();
                  if (!trimmed) continue;
                  try {
                    const parsed = JSON.parse(trimmed);
                    const token = parsed.message?.content;
                    if (token) {
                      controller.enqueue(encoder.encode(token));
                    }
                  } catch {
                    // Ignorer les fragments JSON partiels
                  }
                }
              }
              if (buffer.trim()) {
                try {
                  const parsed = JSON.parse(buffer.trim());
                  const token = parsed.message?.content;
                  if (token) {
                    controller.enqueue(encoder.encode(token));
                  }
                } catch {}
              }
            } catch (err) {
              controller.error(err);
            } finally {
              controller.close();
            }
          },
        });

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
          },
        });
      }
    } catch (ollamaErr) {
      console.warn('Ollama streaming inaccessible, utilisation du fallback RAG:', ollamaErr);
    }

    // 4. Fallback intelligent si le serveur IA est indisponible
    const fallbackText = getSmartFallback(userPrompt, ragContextChunks);
    return new Response(fallbackText, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (err: unknown) {
    console.error('Erreur API Chat:', err);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la requête IA' },
      { status: 500 }
    );
  }
}

