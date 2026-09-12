import { NextResponse } from 'next/server';
import { queryRagContext } from '@/lib/supabase/services/ragService';

// Vercel Serverless maximum execution duration (jusqu'à 60s)
export const maxDuration = 60;
export const dynamic = 'force-dynamic';

// ──────────────────────────────────────────────
// Détection de filière élevage
// ──────────────────────────────────────────────
const ELEVAGE_RE =
  /poulet|poussin|volaille|poule|pondeuse|coq|chair|avicol|coccidi|gumboro|newcastle|couvoir|litière|litiere|porc|porcelet|truie|verrat|porcherie|poisson|silure|clarias|tilapia|alevin|piscic|étang|etang|bac\s*hors|elevage|élevage/i;

// Mots interdits dans une réponse élevage (agronomie / cultures)
const CROP_TERMS_RE =
  /terrain\s*fertile|sol[s]?\s*arable|sol[s]?\s*bien\s*drain|engrais|NPK|semence[s]?\s*(végétale|améliorée|certifiée)?|irrigation|hectare[s]?\s*de\s*culture|culture[s]?\s*vivrière|culture\s*de\s*légume|maraîch|fumure\s*de\s*fond|labour|sarclage|billonnage/gi;

// ──────────────────────────────────────────────
// Fallback statique quand Ollama est KO
// ──────────────────────────────────────────────
function getSmartFallback(userPrompt: string, ragContextChunks: any[]): string {
  const lowerPrompt = userPrompt.toLowerCase();

  if (ragContextChunks && ragContextChunks.length > 0) {
    const topChunk = ragContextChunks[0];
    return `Analyse technique Agricx (Pertinence : ${(topChunk.similarity * 100).toFixed(0)}%) :\n\n${topChunk.content}\n\n• Recommandation : Respectez rigoureusement ces normes techniques et biosécuritaires pour maximiser la rentabilité de votre exploitation.`;
  }

  if (/poulet|volaille|poussin|chair|coccidiose|elevage|élevage/i.test(lowerPrompt)) {
    return `Guide Pratique Avicole — Poulets de chair au Cameroun :

1. Bâtiment & Litière : Bâtiment aéré orienté Est-Ouest, désinfection complète, litière en copeaux de bois secs (5 à 7 cm), densité de 10 à 12 sujets/m² en zone chaude.
2. Poussinière & Souches : Poussins d'un jour certifiés (Cobb 500 ou Ross 308), chauffage à 32-35°C la 1ère semaine.
3. Alimentation & Eau : Provende démarrage (21% PB), abreuvoirs propres avec eau fraîche et vitamines antistress.
4. Calendrier Sanitaire : Vaccins Newcastle et Gumboro (J7, J14), traitement préventif anti-coccidien (Amprolium à J10-J14). Abattage à 40-45 jours pour un poids de 2.0 à 2.5 kg.

Bonne réussite dans votre projet d'élevage avicole !`;
  }

  if (/silure|poisson|bac/i.test(lowerPrompt)) {
    return `Protocole Piscicole — Silure Clarias :

• Densité : 50 à 70 alevins/m³ en bac hors-sol avec renouvellement régulier d'eau.
• Alimentation : Granulés flottants à 40-45% PB. Calibrage bimensuel indispensable contre le cannibalisme.
• Conduite d'urgence (stress ou nitrites) : Renouveler 50% de l'eau, salage au gros sel non iodé à 1.5 kg/m³ et aération mécanique.`;
  }

  if (/mais|maïs|fertilisation/i.test(lowerPrompt)) {
    return `Recommandation Agricx — Culture du Maïs au Cameroun :

• Semences recommandées : Variétés améliorées IRAD (ex: CMS 8704 ou CHC 201).
• Fertilisation : 200 kg/ha de NPK 15-15-15 au semis, puis 100 kg/ha d'Urée au 30e jour.
• Densité : 50 000 à 62 500 plants/ha (80 cm x 40 cm, 2 grains par poquet).`;
  }

  return `Recommandation Agricx :

Pour optimiser votre exploitation agropastorale, veillez à la qualité de vos intrants, respectez les calendriers zootechniques et prophylactiques locaux, et suivez les conseils de nos spécialistes partenaires.`;
}

// ──────────────────────────────────────────────
// Construit un system prompt ultra-directif
// pour un modèle 2B, en pré-structurant la
// réponse à partir des chunks RAG
// ──────────────────────────────────────────────
function buildSystemPrompt(
  userPrompt: string,
  ragContextChunks: any[],
  isElevage: boolean
): string {
  let prompt =
    'Tu es Agricx IA, le conseiller agropastoral officiel du Cameroun. Réponds UNIQUEMENT en français.';

  // ─── Consignes anti-hallucination pour élevage ───
  if (isElevage) {
    prompt += `

RÈGLES ABSOLUES (toute violation = réponse rejetée) :
- La question porte sur l'ÉLEVAGE. Tu ne dois JAMAIS mentionner : sol arable, terrain fertile, terrain bien drainé, engrais, NPK, semences végétales, irrigation, sarclage, billonnage, hectares de culture, fumure de fond.
- Parle UNIQUEMENT de : bâtiment d'élevage, litière, poussins, souches de poulet, alimentation animale (provende), eau de boisson, calendrier vaccinal, biosécurité, densité de sujets, abattage, commercialisation.
- N'invente RIEN. Base ta réponse EXCLUSIVEMENT sur les données techniques fournies ci-dessous.`;
  }

  prompt += `

FORMAT DE RÉPONSE :
- 5 à 6 points numérotés, chacun de 1 à 2 phrases courtes.
- Termine par une phrase d'encouragement.
- Ne dépasse pas 250 mots.`;

  // ─── Injection du contexte RAG ───
  if (ragContextChunks && ragContextChunks.length > 0) {
    const contextParts = ragContextChunks
      .slice(0, 3)
      .map((c, i) => `[Source ${i + 1}] ${c.content}`)
      .join('\n\n');

    prompt += `

══════ DONNÉES TECHNIQUES VÉRIFIÉES ══════
${contextParts}
══════════════════════════════════════════

INSTRUCTION FINALE : Reformule FIDÈLEMENT ces données techniques ci-dessus pour répondre à la question de l'utilisateur. Ne rajoute AUCUNE information qui ne figure pas dans les données ci-dessus.`;
  }

  return prompt;
}

// ──────────────────────────────────────────────
// Filtre post-génération : supprime les termes
// agronomiques qui auraient pu passer dans une
// réponse élevage
// ──────────────────────────────────────────────
function sanitizeElevageOutput(text: string): string {
  return text.replace(CROP_TERMS_RE, '').replace(/\n{3,}/g, '\n\n').trim();
}

// ──────────────────────────────────────────────
// POST handler
// ──────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, category } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages requis' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage.text || lastMessage.content || '';
    const isElevage = ELEVAGE_RE.test(userPrompt);

    // 1. Récupération du contexte RAG depuis Supabase
    const ragContextChunks = await queryRagContext(userPrompt, category);

    // 2. System prompt ultra-directif
    const systemContext = buildSystemPrompt(userPrompt, ragContextChunks, isElevage);

    // 3. Appel au modèle sur Ollama
    const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
    const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma2:2b';

    // Ne garder que le dernier message user (pas d'historique assistant pollué)
    const formattedMessages = [
      { role: 'system', content: systemContext },
      { role: 'user', content: userPrompt },
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
            temperature: 0,        // Déterministe : même question = même réponse
            top_p: 0.9,
            num_ctx: 2048,          // Plus de place pour le contexte RAG
            num_predict: 400,       // Assez pour 5-6 points complets + conclusion
            repeat_penalty: 1.15,   // Évite les boucles et répétitions
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
            let fullText = '';
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
                    let token = parsed.message?.content;
                    if (token) {
                      // Filtre en temps réel pour élevage
                      if (isElevage) {
                        token = token.replace(CROP_TERMS_RE, '');
                      }
                      fullText += token;
                      controller.enqueue(encoder.encode(token));
                    }
                  } catch {
                    // Fragment JSON partiel
                  }
                }
              }
              // Traiter le reste du buffer
              if (buffer.trim()) {
                try {
                  const parsed = JSON.parse(buffer.trim());
                  let token = parsed.message?.content;
                  if (token) {
                    if (isElevage) {
                      token = token.replace(CROP_TERMS_RE, '');
                    }
                    controller.enqueue(encoder.encode(token));
                  }
                } catch { /* ignore */ }
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
      console.warn('Ollama inaccessible, utilisation du fallback RAG:', ollamaErr);
    }

    // 4. Fallback si Ollama est indisponible
    const fallbackText = getSmartFallback(userPrompt, ragContextChunks);
    return new Response(fallbackText, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err: unknown) {
    console.error('Erreur API Chat:', err);
    return NextResponse.json(
      { error: 'Erreur lors du traitement de la requête IA' },
      { status: 500 }
    );
  }
}
