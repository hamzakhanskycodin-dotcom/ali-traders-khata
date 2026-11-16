export default async function handler(req, res) {
  const path = req.query.path || '';
  const queryParams = new URLSearchParams();
  for (const [key, val] of Object.entries(req.query)) {
    if (key !== 'path') queryParams.append(key, val);
  }
  const qs = queryParams.toString();
  const targetUrl = `https://supabase.co{path}${qs ? '?' + qs : ''}`;

  try {
    const headers = {};
    for (const [k, v] of Object.entries(req.headers)) {
      if (!['host', 'connection', 'content-length'].includes(k.toLowerCase())) {
        headers[k] = v;
      }
    }

    const fetchOptions = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      fetchOptions.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const response = await fetch(targetUrl, fetchOptions);
    const data = await response.text();

    res.status(response.status);
    const contentType = response.headers.get('content-type');
    if (contentType) res.setHeader('Content-Type', contentType);
    return res.send(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
