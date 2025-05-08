import { db } from '@/db';
import { auth } from '@/lib/auth/auth';

export async function GET(req: Request) {
  const session = await auth.api.getSession({
    query: {
      disableCookieCache: true,
    },
    headers: req.headers, // pass the headers
  });

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { user } = session;

  const auditLogs = await db.auditLog.findMany({
    where: {
      userId: user.id,
    },
  });

  const formattedAuditLogs = auditLogs.map((log) => ({
    ...log,
    createdAt: log.createdAt.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }),
  }));

  return new Response(JSON.stringify(formattedAuditLogs));
}
