const UPSTREAM = 'https://emcneill.com/ironstrike/api/nonce.php';
export const config = { runtime: 'edge' };

export default async function handler(request) {
  try {
    const upstream = await fetch(UPSTREAM, { headers: { Accept: 'application/json' } });
    const text = await upstream.text();
    console.log(`[nonce] upstream ${upstream.status}: ${text.slice(0, 200)}`);
    return new Response(text, { status: upstream.status, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('[nonce] upstream failed:', err);
    return new Response(JSON.stringify({ ok: false, reason: `upstream failed: ${err.message}` }), {
      status: 502, headers: { 'Content-Type': 'application/json' },
    });
  }
}
