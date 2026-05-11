const express = require('express');
const { createBareServer } = require('@tomphttp/bare-server-node');
const path = require('path');
const http = require('http');

const app = express();
const bareServer = createBareServer('/bare/');
const PORT = process.env.PORT || 3000;

// Keep-alive ping endpoint
app.get('/ping', (req, res) => res.send('pong'));

// Fallback for /uv/service/* — SW not active yet, register SW and reload once
app.get('/uv/service/*', (req, res) => {
  res.send(`<!DOCTYPE html><html><head>
    <title>Loading proxy...</title>
    <style>body{background:#0d0d0d;color:#fff;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;gap:16px;margin:0}
    .spinner{width:48px;height:48px;border:5px solid #333;border-top-color:#e94560;border-radius:50%;animation:spin 0.8s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}</style>
  </head><body>
    <div class="spinner"></div>
    <p>Setting up proxy, one moment...</p>
    <script>
      sessionStorage.removeItem('uvRetried');
      {
        navigator.serviceWorker.register('/uv/sw.js', { scope: '/uv/service/' })
          .then(() => navigator.serviceWorker.ready)
          .then(() => setTimeout(() => location.reload(), 500))
          .catch(err => { document.querySelector('p').textContent = 'Error: ' + err.message; });
      }
    </script>
  </body></html>`);
});

// Serve Ultraviolet static files
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer((req, res) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on('upgrade', (req, socket, head) => {
  if (bareServer.shouldRoute(req)) {
    bareServer.routeUpgrade(req, socket, head);
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
