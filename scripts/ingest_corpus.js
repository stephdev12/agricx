const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://iwxlicuixlfiobyfgvdi.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3eGxpY3VpeGxmaW9ieWZndmRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMDI0NTIsImV4cCI6MjA4ODU3ODQ1Mn0.lNy4pe3wU_Os-8pnagBQowbL5MhmbwV8V-zFwYLVNeo';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const THEME_MAPPING = {
  fiche_technique: 'Fiches Techniques',
  sante_animale: 'Santé Animale',
  calendrier_agricole: 'Calendrier Agricole',
  intrants_semences: 'Semences & Intrants',
  prix_marche: 'Prix & Marchés',
  projet_programme: 'Projets & Programmes',
  reglementation: 'Réglementation',
  procedure_administrative: 'Procédures Administratives',
  formation: 'Formation Agricole',
};

function chunkText(text, maxChunkLen = 1200, overlap = 150) {
  if (!text) return [];

  let cleaned = text
    .replace(/REPUBLIQUE DU CAMEROUN[^\n]*Paix[^\n]*/gi, '')
    .replace(/REPUBLIC OF CAMEROON[^\n]*Peace[^\n]*/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const paragraphs = cleaned.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 20);

  const chunks = [];
  let currentChunk = '';

  for (const para of paragraphs) {
    if ((currentChunk + '\n\n' + para).length <= maxChunkLen) {
      currentChunk = currentChunk ? currentChunk + '\n\n' + para : para;
    } else {
      if (currentChunk.length >= 200) {
        chunks.push(currentChunk);
      }
      if (para.length > maxChunkLen) {
        let start = 0;
        while (start < para.length) {
          const end = Math.min(start + maxChunkLen, para.length);
          const slice = para.slice(start, end).trim();
          if (slice.length >= 100) {
            chunks.push(slice);
          }
          start += maxChunkLen - overlap;
        }
        currentChunk = '';
      } else {
        currentChunk = para;
      }
    }
  }

  if (currentChunk.trim().length >= 150) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
}

async function main() {
  const jsonlPath = path.resolve(__dirname, '../../ai_training/document/documents.jsonl');
  if (!fs.existsSync(jsonlPath)) {
    console.error('Fichier introuvable:', jsonlPath);
    process.exit(1);
  }

  console.log('🚀 Démarrage de l\'ingestion RAG MINADER / MINEPIA dans Supabase...');
  console.log('Fichier source :', jsonlPath);

  const fileStream = fs.createReadStream(jsonlPath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let docsProcessed = 0;
  let docsIngested = 0;
  let totalChunksIngested = 0;

  for await (const line of rl) {
    docsProcessed++;
    if (!line.trim()) continue;

    let d;
    try {
      d = JSON.parse(line);
    } catch {
      continue;
    }

    const targetCategory = THEME_MAPPING[d.theme];
    if (!targetCategory) {
      continue;
    }

    if (!d.text || d.text.trim().length < 100) {
      continue;
    }

    const title = d.title || d.doc_id || 'Document Agricole';
    const source = d.source === 'minepia' ? 'MINEPIA Cameroun' : 'MINADER Cameroun';

    let chunks = chunkText(d.text);
    if (chunks.length === 0) continue;

    if (chunks.length > 40) {
      chunks = chunks.slice(0, 40);
    }

    try {
      const { data: docRecord, error: docError } = await supabase
        .from('rag_knowledge_documents')
        .insert([
          {
            title: title.slice(0, 250),
            category: targetCategory,
            source,
            file_url: d.url || null,
            metadata: {
              doc_id: d.doc_id,
              lang: d.lang,
              filieres: d.filieres,
              theme: d.theme,
            },
          },
        ])
        .select('id')
        .single();

      if (docError || !docRecord) {
        console.warn('Doc Erreur:', docError?.message);
        continue;
      }

      const chunkRows = chunks.map((content, idx) => ({
        document_id: docRecord.id,
        content,
        category: targetCategory,
        chunk_index: idx + 1,
        metadata: {
          doc_id: d.doc_id,
          title: title.slice(0, 200),
          url: d.url || null,
        },
      }));

      for (let i = 0; i < chunkRows.length; i += 25) {
        const batch = chunkRows.slice(i, i + 25);
        const { error: chunkError } = await supabase
          .from('rag_knowledge_chunks')
          .insert(batch);

        if (chunkError) {
          console.warn('Chunk Erreur batch:', chunkError.message);
        }
      }

      docsIngested++;
      totalChunksIngested += chunks.length;

      if (docsIngested % 10 === 0 || docsIngested <= 5) {
        console.log('✅ [' + docsIngested + '] Ingéré: "' + title.slice(0, 45) + '..." (' + chunks.length + ' chunks) | Catégorie: ' + targetCategory);
      }
    } catch (err) {
      console.warn('Exception Doc:', err.message);
    }
  }

  console.log('\n================================================');
  console.log('   INGESTION RAG MINADER / MINEPIA TERMINÉE !');
  console.log('================================================');
  console.log('   Documents ingérés dans Supabase : ' + docsIngested);
  console.log('   Chunks de connaissances créés   : ' + totalChunksIngested);
  console.log('   Le Conseiller IA dispose désormais de données officielles camerounaises !');
}

main().catch(console.error);
