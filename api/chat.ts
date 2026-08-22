import { GoogleGenerativeAI } from '@google/generative-ai';

export interface DataSource {
  documentId?: string;
  documentName: string;
  page?: number;
  row?: number;
  section?: string;
}

function extractSourcesFromContext(context: any, answerText: string): DataSource[] {
  const allSources: DataSource[] = [];

  const addSource = (src: any) => {
    if (!src || !src.documentName) return;
    const exists = allSources.some(
      (s) =>
        s.documentName === src.documentName &&
        s.page === src.page &&
        s.row === src.row &&
        s.section === src.section
    );
    if (!exists) {
      allSources.push({
        documentId: src.documentId || 'doc-ref',
        documentName: src.documentName,
        page: src.page !== undefined ? Number(src.page) : undefined,
        row: src.row !== undefined ? Number(src.row) : undefined,
        section: src.section || undefined,
      });
    }
  };

  if (!context || typeof context !== 'object') {
    return [];
  }

  // 1. Traverse metrics inputs
  if (Array.isArray(context.metrics)) {
    for (const m of context.metrics) {
      if (Array.isArray(m.inputs)) {
        for (const input of m.inputs) {
          if (input?.source) addSource(input.source);
        }
      }
    }
  }

  // 2. Traverse risks evidence
  if (Array.isArray(context.risks)) {
    for (const r of context.risks) {
      if (Array.isArray(r.evidence)) {
        for (const ev of r.evidence) {
          addSource(ev);
        }
      }
    }
  }

  // 3. Traverse documents and extracted data
  if (Array.isArray(context.documents)) {
    for (const doc of context.documents) {
      if (doc.extractedData) {
        for (const secKey of Object.keys(doc.extractedData)) {
          const section = doc.extractedData[secKey];
          if (section && typeof section === 'object') {
            for (const fieldKey of Object.keys(section)) {
              const field = section[fieldKey];
              if (field && field.source) {
                addSource(field.source);
              }
            }
          }
        }
      }
      if (!allSources.some((s) => s.documentName === doc.name)) {
        addSource({
          documentId: doc.id,
          documentName: doc.name,
        });
      }
    }
  }

  // Match sources cited in answer text
  const lowerAnswer = answerText.toLowerCase();
  const matchedSources = allSources.filter((s) => {
    const docMatched = s.documentName && lowerAnswer.includes(s.documentName.toLowerCase());
    const cleanDocName = s.documentName ? s.documentName.replace(/\.[^/.]+$/, '').toLowerCase() : '';
    const cleanMatched = cleanDocName && lowerAnswer.includes(cleanDocName);
    return docMatched || cleanMatched;
  });

  return matchedSources.length > 0 ? matchedSources : allSources.slice(0, 3);
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json({
      answer: 'AI not configured.',
      sources: [],
    });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const { question, context } = body || {};

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction:
        "You are a financial analyst assistant. You have access to the following extracted financial data and computed metrics from the user's uploaded documents. Answer the user's question using ONLY the data provided below. For every claim, cite the source document name and row/page. If the answer cannot be determined, say so. Never use general knowledge. Use RM for Malaysian Ringgit. Be concise.",
    });

    const userPrompt = `Question: ${question}\n\nWorkspace Financial Context:\n${JSON.stringify(
      context || {},
      null,
      2
    )}`;

    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    const answer = response.text();

    const sources = extractSourcesFromContext(context, answer);

    return res.status(200).json({
      answer,
      sources,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: 'AI generation failed',
      message: error?.message || 'Unable to connect to AI service.',
    });
  }
}
