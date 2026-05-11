const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (the games site)
app.use(express.static(path.join(__dirname, 'public')));

// Proxy /veck/* -> https://veck.io/*
app.use('/veck', createProxyMiddleware({
  target: 'https://veck.io',
  changeOrigin: true,
  pathRewrite: { '^/veck': '' },
  secure: false,
  on: {
    proxyRes(proxyRes) {
      // Remove headers that block embedding
      delete proxyRes.headers['x-frame-options'];
      delete proxyRes.headers['content-security-policy'];
      delete proxyRes.headers['content-security-policy-report-only'];
    }
  }
}));

// Proxy /veck-files/* -> https://files.veck.io/*
app.use('/veck-files', createProxyMiddleware({
  target: 'https://files.veck.io',
  changeOrigin: true,
  pathRewrite: { '^/veck-files': '' },
  secure: false,
  on: {
    proxyRes(proxyRes) {
      delete proxyRes.headers['x-frame-options'];
      delete proxyRes.headers['content-security-policy'];
    }
  }
}));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
