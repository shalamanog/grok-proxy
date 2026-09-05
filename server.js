const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>Grok Proxy</title></head>
      <body style="font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #1a1a1a; color: #fff;">
        <h1>🚀 Grok Proxy</h1>
        <p>Используй: <code>/proxy?url=https://grok.com</code></p>
        <h3>Быстрые ссылки:</h3>
        <ul>
          <li><a href="/proxy?url=https://grok.com" style="color: #0070f3;">Grok</a></li>
          <li><a href="/proxy?url=https://chat.openai.com" style="color: #0070f3;">ChatGPT</a></li>
          <li><a href="/proxy?url=https://x.com" style="color: #0070f3;">X (Twitter)</a></li>
        </ul>
      </body>
      </html>
    `);
    return;
  }

  console.log(`Проксируем: ${targetUrl}`);
  const lib = targetUrl.startsWith('https') ? https : http;

  const proxyReq = lib.request(targetUrl, {
    method: req.method,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,ru;q=0.8',
      'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'cache-control': 'no-cache',
      'pragma': 'no-cache'
    }
  }, (proxyRes) => {
    Object.keys(proxyRes.headers).forEach(key => {
      if (key.toLowerCase() !== 'transfer-encoding' && key.toLowerCase() !== 'content-encoding') {
        res.setHeader(key, proxyRes.headers[key]);
      }
    });
    res.writeHead(proxyRes.statusCode);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (error) => {
    console.error('Ошибка:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  });

  proxyReq.end();
});

server.listen(PORT, () => {
  console.log(`Прокси запущен на порту ${PORT}`);
});
