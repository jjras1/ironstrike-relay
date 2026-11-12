const UPSTREAM_NONCE = 'https://emcneill.com/ironstrike/api/nonce.php';
export const config = { runtime: 'edge' };

export default async function handler() {
  const out = { relay: 'ok', upstream: null, note: 'attest relay for the ironstrike client' };
  try {
    const upstream = await fetch(UPSTREAM_NONCE, { headers: { Accept: 'application/json' } });
    const text = await upstream.text();
    out.upstream = { status: upstream.status, body: text.slice(0, 200) };
  } catch (err) { out.upstream = { error: err.message }; }
  return new Response(JSON.stringify(out, null, 2), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
}
