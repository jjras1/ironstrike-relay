const UPSTREAM = 'https://emcneill.com/ironstrike/api/attest.php';
export const config = { runtime: 'edge' };

export default async function handler(request) {
  if (request.method !== 'POST') return json(405, { ok: false, reason: 'POST only' });

  let body = '';
  try { body = await request.text(); } catch (err) { console.error('[attest] body:', err); }
  console.log(`[attest] ${body.length} bytes  head=${body.slice(0, 48)}`);
  if (!body) return json(400, { ok: false, reason: 'empty body' });

  try {
    const upstream = await fetch(UPSTREAM, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const text = await upstream.text();
    console.log(`[attest] upstream ${upstream.status}: ${text.slice(0, 400)}`);
    return new Response(text, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[attest] upstream failed:', err);
    return json(502, { ok: false, reason: `upstream failed: ${err.message}` });
  }
}

function json(status, obj) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
