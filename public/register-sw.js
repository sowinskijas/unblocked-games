if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/uv/uv.sw.js', { scope: '/uv/service/' })
    .then(reg => {
      console.log('UV Service Worker registered', reg.scope);
    })
    .catch(err => console.error('SW registration failed:', err));
}
