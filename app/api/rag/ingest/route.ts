import { NextResponse } from 'next/server';
import { ingestRagDocument } from '@/lib/supabase/services/ragService';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, source, chunks } = body;

    if (!title || !category || !chunks || !Array.isArray(chunks)) {
      return NextResponse.json(
        { error: 'Paramètres manquants (title, category, chunks requis)' },
        { status: 400 }
      );
    }

    const result = await ingestRagDocument(title, category, source || 'Import Manuel', chunks);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `${chunks.length} chunks RAG ingérés avec succès.`,
      documentId: result.documentId,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Erreur ingestion RAG';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
