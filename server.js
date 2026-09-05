const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const targetUrl = url.searchParams.get('url');

  // Главная страница с быстрыми ссылками
  if (!targetUrl) {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Grok Proxy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #1a1a1a; color: #fff;">
        <h1 style="color: #0070f3;"> Grok Proxy</h1>
        <p>Прокси для обхода блокировок</p>
        
        <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Быстрый доступ:</h3>
          <form action="/proxy" method="GET" style="display: flex; gap: 10px;">
            <input type="text" name="url" placeholder="https://grok.com" 
                   style="flex: 1; padding: 10px; border: 1px solid #333; border-radius: 4px; background: #1a1a1a; color: #fff;">
            <button type="submit" style="padding: 10px 20px; background: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer;">Открыть</button>
          </form>
        </div>

        <h3>Быстрые ссылки:</h3>
        <ul style="list-style: none; padding: 0;">
          <li style="margin: 10px 0;">
            <a href="/proxy?url=https://grok.com" 
               style="display: block; padding: 12px; background: #2a2a2a; color: #0070f3; text-decoration: none; border-radius: 6px; border: 1px solid #333;">
              🤖 Grok
            </a>
          </li>
          <li style="margin: 10px 0;">
            <a href="/proxy?url=https://chat.openai.com" 
               style="display: block; padding: 12px; background: #2a2a2a; color: #0070f3; text-decoration: none; border-radius: 6px; border: 1px solid #333;">
               ChatGPT
            </a>
          </li>
          <li style="margin: 10px 0;">
            <a href="/proxy?url=https://x.com" 
               style="display: block; padding: 12px; background: #2a2a2a; color: #0070f3; text-decoration: none; border-radius: 6px; border: 1px solid #333;">
              🐦 X (Twitter)
            </a>
          </li>
        </ul>

        <p style="margin-top: 30px; color: #888; font-size: 14px;">
          💡 Совет: сервер засыпает через 15 минут бездействия.<br>
          Первый запрос после сна займёт ~30-50 секунд.
        </p>
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
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Cache-Control': 'no-cache'
    }
  }, (proxyRes) => {
    console.log(`Статус: ${proxyRes.statusCode}`);
    
    // Копируем все заголовки кроме transfer-encoding
    Object.keys(proxyRes.headers).forEach(key => {
      if (key.toLowerCase() !== 'transfer-encoding' && 
          key.toLowerCase() !== 'content-encoding') {
        res.setHeader(key, proxyRes.headers[key]);
      }
    });

    res.writeHead(proxyRes.statusCode);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (error) => {
    console.error('Ошибка:', error.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: error.message,
      hint: 'Возможно, сайт блокирует прокси или требует авторизацию'
    }));
  });

  proxyReq.setTimeout(30000, () => {
    proxyReq.destroy();
    res.writeHead(504, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Превышено время ожидания' }));
  });

  proxyReq.end();
});

server.listen(PORT, () => {
  console.log(`Прокси запущен на порту ${PORT}`);
});const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

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
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    }
  }, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
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
