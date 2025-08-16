import { db } from '@/db';
import { convo } from '@/db/schemas/convo';
import { useQuery } from '@tanstack/react-query';
import { asc, eq } from 'drizzle-orm';

export const useConversation = (sid: string) => {
  return useQuery({
    queryKey: ['conversation', sid],
    queryFn: async () => {
      const messages = await db.query.convo.findMany({
        where: eq(convo.sid, sid),
        orderBy: [asc(convo.createdAt)],
      });

      if (!messages) {
        return [];
      }

      return messages;
    },
  });
};
