export default async function handler(req, res) {
  const URL = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'GET') {
    const response = await fetch(`${URL}/get/ali_traders_khata`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const json = await response.json();
    const parsed = json.result ? JSON.parse(json.result) : null;
    return res.status(200).json(parsed);
  }

  if (req.method === 'POST' || req.method === 'PUT') {
    const bodyStr = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    await fetch(`${URL}/set/ali_traders_khata`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: bodyStr,
    });
    return res.status(200).json({ ok: true });
  }
}
