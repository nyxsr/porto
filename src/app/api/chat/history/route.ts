import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { convo } from '@/db/schemas/convo';
import { desc, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const sid = request.nextUrl.searchParams.get('sid');
  if (!sid) return new Response('Missing sid', { status: 400 });

  const messages = await db.query.convo.findMany({
    where: eq(convo.sid, sid),
    orderBy: [desc(convo.createdAt)],
  });

  if (!messages) {
    return NextResponse.json([]); // We pretend this as their first message
  }

  return NextResponse.json(messages);
}
