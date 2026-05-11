if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/uv/uv.sw.js', { scope: '/uv/service/' })
    .then(() => console.log('UV Service Worker registered'))
    .catch(err => console.error('SW registration failed:', err));
}

function uvGo(url) {
  if (!url.startsWith('http')) url = 'https://' + url;
  location.href = '/uv/service/' + __uv$config.encodeUrl(url);
}
