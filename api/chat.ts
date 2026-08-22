import https from 'https';
import { GoogleGenerativeAI } from '@google/generative-ai';

export interface DataSource {
  documentId?: string;
  documentName: string;
  page?: number;
  row?: number;
  section?: string;
}

function requestGeminiChat(apiKey: string, modelName: string, payload: any): Promise<string> {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const req = https.request(
      {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (d) => {
          body += d;
        });
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const data = JSON.parse(body);
              const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
              resolve(text);
            } catch (e) {
              reject(e);
            }
          } else {
            reject(new Error(`Gemini API returned status ${res.statusCode}: ${body}`));
          }
        });
      }
    );

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
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

    const systemInstruction =
      "You are a financial analyst assistant. You have access to the following extracted financial data and computed metrics from the user's uploaded documents. Answer the user's question using ONLY the data provided below. For every claim, cite the source document name and row/page. If the answer cannot be determined, say so. Never use general knowledge. Use RM for Malaysian Ringgit. Be concise.";

    const userPrompt = `System: ${systemInstruction}\n\nQuestion: ${question}\n\nWorkspace Financial Context:\n${JSON.stringify(
      context || {},
      null,
      2
    )}`;

    // Try available flash models with gemini-3.7-flash as primary
    const candidateModels = [
      'gemini-3.7-flash',
      'gemini-3.6-flash',
      'gemini-flash-latest',
      'gemini-1.5-flash',
    ];

    let answer = '';
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        answer = await requestGeminiChat(apiKey, modelName, {
          contents: [{ parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.2,
          },
        });
        if (answer) break;
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!answer) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-3.7-flash',
          systemInstruction,
        });
        const result = await model.generateContent(userPrompt);
        const response = await result.response;
        answer = response.text();
      } catch (err) {
        lastError = err;
      }
    }

    if (!answer && lastError) {
      throw lastError;
    }

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
