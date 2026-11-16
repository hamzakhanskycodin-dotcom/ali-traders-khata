export default async function handler(req, res) {
  const path = Array.isArray(req.query.path) ? req.query.path.join('/') : (req.query.path || '');
  const queryParams = new URLSearchParams();
  for (const [key, val] of Object.entries(req.query)) {
    if (key !== 'path') queryParams.append(key, val);
  }
  const qs = queryParams.toString();
  const targetUrl = 'https://tzkjogakzxozqhwybpxz.supabase.co/' + path + (qs ? '?' + qs : '');

  try {
    const headers = {
      'Content-Type': req.headers['content-type'] || 'application/json',
    };
    if (req.headers['apikey']) headers['apikey'] = req.headers['apikey'];
    if (req.headers['authorization']) headers['authorization'] = req.headers['authorization'];
    if (req.headers['prefer']) headers['prefer'] = req.headers['prefer'];

    const fetchOptions = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body !== undefined) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();

    res.status(response.status);
    const contentType = response.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);
    return res.send(data);
  } catch (err) {
    return res.status(500).json({ error: err.message, cause: err.cause?.message || '' });
  }
}
