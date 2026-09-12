import { NextResponse } from 'next/server';
import { queryRagContext } from '@/lib/supabase/services/ragService';

// Vercel Serverless maximum execution duration (jusqu'à 60s)
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

function getSmartFallback(userPrompt: string, ragContextChunks: any[]): string {
  const lowerPrompt = userPrompt.toLowerCase();
  if (ragContextChunks && ragContextChunks.length > 0) {
    const topChunk = ragContextChunks[0];
    return `Analyse basée sur la base de connaissances Agricx (Pertinence : ${(topChunk.similarity * 100).toFixed(0)}%) :\n\n${topChunk.content}\n\n• Conseil pratique : Veillez au respect des posologies locales et appliquez les mesures préventives sans délai.`;
  }
  if (lowerPrompt.includes('silure') || lowerPrompt.includes('poisson') || lowerPrompt.includes('bac')) {
    return "Protocole Piscicole — Silure Clarias :\n\n• Diagnostic : Stress asphyxique ou montée de nitrites.\n• Conduite à tenir :\n1. Renouveler 50% de l'eau avec de l'eau propre non chlorée.\n2. Arrêter le nourrissage pendant 24h.\n3. Salage au gros sel non iodé à 1.5 kg/m³ d'eau.\n4. Oxygéner par cascade ou bulleur.";
  }
  if (lowerPrompt.includes('poulet') || lowerPrompt.includes('coccidiose') || lowerPrompt.includes('fiente')) {
    return "Protocole Avicole — Poulets de chair :\n\n• Diagnostic : Suspicion de Coccidiose.\n• Conduite à tenir :\n1. Isoler les sujets abattus.\n2. Administrer Amprolium 20% ou Toltrazuril dans l'eau de boisson pendant 3 à 5 jours.\n3. Remplacer la litière souillée par des copeaux secs désinfectés.\n4. Administrer des vitamines A, D3, E, K post-traitement.";
  }
  if (lowerPrompt.includes('mais') || lowerPrompt.includes('maïs') || lowerPrompt.includes('fertilisation')) {
    return "Recommandation Agricx — Culture du Maïs au Cameroun :\n\n• Semences recommandées : Variétés améliorées IRAD (ex: CMS 8704 ou CHC 201).\n• Fertilisation : 200 kg/ha de NPK 15-15-15 au semis, puis 100 kg/ha d'Urée au 30e jour.\n• Densité : 50 000 à 62 500 plants/ha (80 cm x 40 cm, 2 grains par poquet).";
  }
  return "Recommandation Agricx :\n\nPour optimiser votre exploitation agropastorale, veillez à la qualité de vos semences et intrants, et respectez les calendriers de traitement locaux. N'hésitez pas à consulter un expert partenaire via l'annuaire.";
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
      "Tu es Agricx IA, l'assistant agropastoral expert du Cameroun (cultures vivrières, de rente, élevage, santé animale et gestion financière en FCFA). Réponds toujours en français de manière complète, détaillée et bien structurée (diagnostic, étapes concrètes, posologies et recommandations préventives adaptées au climat et aux réalités du Cameroun).";

    if (ragContextChunks && ragContextChunks.length > 0) {
      const topContext = ragContextChunks
        .slice(0, 2)
        .map((c) => c.content)
        .join('\n---\n');
      systemContext += `\n\nDonnées vérifiées issues de la base Agricx :\n${topContext}`;
    }

    // 3. Appel au modèle finetuné sur Ollama en mode STREAMING
    const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
    const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'agricx';

    const formattedMessages = [
      { role: 'system', content: systemContext },
      ...messages.slice(-4).map((m) => ({
        role: m.sender === 'user' || m.role === 'user' ? 'user' : 'assistant',
        content: m.text || m.content || '',
      })),
    ];

    try {
      const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          messages: formattedMessages,
          stream: true,
          keep_alive: '24h',
          options: {
            temperature: 0.3,
            top_p: 0.9,
            num_ctx: 2048,
            num_predict: 450, // Permet des réponses complètes et détaillées sans risque de timeout
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

