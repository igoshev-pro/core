import { headers } from 'next/headers';

export async function GET() {
  const h = headers();
  const projectId = h.get('x-project-id')!;
  const mode = h.get('x-project-mode')!;

  const res = await fetch(`https://api.igoshev.pro/users`, {
    headers: {
      'x-project-id': projectId,
      'x-project-mode': mode,
    },
    cache: 'no-store',
  });

  return new Response(res.body, { status: res.status });
}