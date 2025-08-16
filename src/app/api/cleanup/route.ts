import { NextResponse } from 'next/server';
import { db } from '@/db';
import { convo } from '@/db/schemas/convo';
import { inArray, lt } from 'drizzle-orm';

export const runtime = 'edge';

function isAuthorized(req: Request) {
  const header = req.headers.get('x-cron-key');
  return header && header === process.env.CRON_SECRET;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const BATCH_SIZE = 5000; // rows per pass
  const MAX_PASSES = 10; // safety cap to keep function short
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

  let total = 0;

  try {
    for (let pass = 0; pass < MAX_PASSES; pass++) {
      // 1) Select a batch of IDs to delete
      const toDelete = await db
        .select({ id: convo.id, sid: convo.sid })
        .from(convo)
        .where(lt(convo.createdAt, cutoff))
        .limit(BATCH_SIZE);

      if (toDelete.length === 0) break;

      const distinctSids = [...new Set(toDelete.map((c) => c.sid))];

      console.log(distinctSids);

      // 2) Delete that batch by SIDs
      const deleteResult = await db.delete(convo).where(inArray(convo.sid, distinctSids));

      total += deleteResult.rowCount;

      // If we got fewer than a full batch, nothing big remains
      if (toDelete.length < BATCH_SIZE) break;
    }

    return NextResponse.json({
      ok: true,
      deleted: total,
      cutoff: cutoff.toISOString(),
    });
  } catch (err) {
    console.error('Purge error:', err);
    return NextResponse.json({ ok: false, error: 'Internal error' }, { status: 500 });
  }
}
