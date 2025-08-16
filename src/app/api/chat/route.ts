import { NextRequest } from 'next/server';
import { db } from '@/db';
import { convo, type Convo } from '@/db/schemas/convo';
import { asc, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

import { detectIntroductionInquiry, detectSkillsInquiry } from '@/lib/chat-utils';
import { embedBatch } from '@/lib/embedding';
import { openai } from '@/lib/openai';
import { searchByEmbedding, type KBHit } from '@/lib/retrieve';

export const runtime = 'edge';

const MODEL = 'gpt-4o-mini';

function buildSystemInstruction(allowFallback: boolean): string {
  return [
    `You are Sahrul's friendly assistant that will introduce Sahrul to users.`,
    'Your target audience is HR managers and people who want to know about Sahrul.',
    'Answer using ONLY the Knowledge Context below.',
    'If the context contains relevant information, provide a complete answer and append [source: <meta.source>] for specific passages.',
    allowFallback
      ? 'If any document allows general fallback, you MAY add general knowledge—but prefer the context.'
      : 'Do NOT use outside knowledge for factual claims about Sahrul.',
    `When the context doesn't contain the answer for questions about Sahrul:
     - Be friendly and conversational
     - You can make light, playful comments or jokes if appropriate
     - Always acknowledge you don't have the specific information
     - Suggest asking Sahrul directly
     - Use a casual, warm tone with emojis when fitting

     Example responses for out-of-scope questions:
     - "Haha, that's an interesting question! I'd guess Sahrul might [playful speculation], but honestly I don't have the real answer to that. You should ask him directly! 😄"
     - "That sounds like something only Sahrul would know for sure! I don't have that information in my knowledge base. Why don't you ask him? 😊"
     - "Good question! I can tell you about his [mention relevant skills/experience from context if any], but for that specific detail, you'd need to ask Sahrul himself! 🤔"`,
  ].join(' ');
}

function buildKnowledgeContext(
  docs: Array<{ title: string; slug: string; content: string; source: string }>,
): string {
  if (!docs.length) return '(no relevant knowledge found)';
  return docs
    .map((d) => `### ${d.title} (slug: ${d.slug})(source: ${d.source})\n${d.content.trim()}`)
    .join('\n\n---\n\n');
}

export const POST = async (req: NextRequest): Promise<Response> => {
  const body = await req.json();
  const { sid, message } = body;

  if (!sid || !message) {
    return new Response(JSON.stringify({ error: 'Missing sid or message' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Save user message to database
  await db.insert(convo).values({
    sid,
    role: 'user',
    content: message,
    meta: {},
  });

  // Now stream the assistant response - create a new request with sessionId in query params
  const url = new URL(req.url);
  url.searchParams.set('sessionId', sid);
  const streamReq = new NextRequest(url.toString());
  return GET(streamReq);
};

export const GET = async (req: NextRequest): Promise<Response> => {
  const { searchParams } = new URL(req.url);
  const sid = searchParams.get('sessionId') ?? nanoid();

  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (event: string, data: unknown): void => {
        controller.enqueue(enc.encode(`event: ${event}\n`));
        controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      const ping = (): void => controller.enqueue(enc.encode(`: ping\n\n`));
      const hb = setInterval(ping, 20000);

      try {
        // 1) Load conversation history
        const history: Convo[] = await db.query.convo.findMany({
          where: eq(convo.sid, sid),
          orderBy: [asc(convo.createdAt)],
          limit: 15,
        });
        const last: Convo | undefined = history[history.length - 1];

        // Only reply if last message is from user
        if (!last || last.role !== 'user') {
          send('idle', {});
          clearInterval(hb);
          controller.close();
          return;
        }

        // Check if user is asking about Introduction
        const isIntroductionInquiry = detectIntroductionInquiry(last.content);
        const isSkills = detectSkillsInquiry(last.content);

        // Send introduction event immediately if detected
        if (isIntroductionInquiry) {
          send('introduction', { type: 'introduction' });
        }

        // 2) Retrieve knowledge
        let hits: KBHit[] = [];

        try {
          const [qVec] = await embedBatch([last.content]);
          hits = await searchByEmbedding(qVec, {
            k: 5,
            minScore: 0.2,
            lang: 'en',
          });
        } catch (error) {
          console.warn(
            'Vector search failed in stream, continuing without knowledge context:',
            error,
          );
          // Continue without RAG if embeddings are not available
        }

        const allowFallback: boolean = hits.some((h) => h.meta?.allowGeneralFallback === true);
        const knowledgeBlock: string = buildKnowledgeContext(
          hits.map((h) => ({
            title: h.title,
            slug: h.slug,
            content: h.content,
            source: (h.meta?.source as string) || 'Base Knowledge',
          })),
        );

        // 3) Build messages
        const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
          { role: 'system', content: buildSystemInstruction(allowFallback) },
          { role: 'system', content: `# Knowledge Context\n${knowledgeBlock}` },
          ...history.map((m) => ({
            role: m.role as 'system' | 'user' | 'assistant',
            content: m.content,
          })),
        ];

        send('session', { sessionId: sid });

        // 4) Stream model response
        const completion = await openai.chat.completions.create({
          model: MODEL,
          messages,
          stream: true,
          temperature: 0.3,
        });

        let full = '';
        for await (const part of completion) {
          const delta: string = part.choices[0]?.delta?.content ?? '';
          if (delta) {
            full += delta;
            send('chunk', { type: 'chunk', content: delta });
          }
        }

        // 5) Save assistant reply with sources and introduction type if applicable
        const assistantMeta: Record<string, unknown> = {
          model: MODEL,
          sources: hits.map((h) => ({
            slug: h.slug,
            title: h.title,
            score: h.sim,
          })),
          timestamp: new Date().toISOString(),
          tokenEstimate: full.length,
        };

        // Add types array based on detected inquiries
        const types: string[] = [];
        if (isIntroductionInquiry) {
          types.push('INTRODUCE');
        }
        if (isSkills) {
          types.push('SKILLS');
        }
        if (types.length > 0) {
          assistantMeta.type = types;
        }

        await db.insert(convo).values({
          sid,
          role: 'assistant',
          content: full,
          meta: assistantMeta,
        });

        send('complete', { type: 'complete', content: full });
      } catch (err) {
        if (err instanceof Error) {
          send('error', { message: err.message });
        } else {
          send('error', { message: 'Unknown error' });
        }
      } finally {
        clearInterval(hb);
        controller.close();
      }
    },
  });

  return new Response(stream, { headers });
};
