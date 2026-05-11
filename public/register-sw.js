if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/uv/sw.js', { scope: '/uv/service/' })
    .then(reg => {
      console.log('UV SW registered');
      // If there's a new SW waiting, activate it immediately
      if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing;
        newSW.addEventListener('statechange', () => {
          if (newSW.state === 'installed') newSW.postMessage({ type: 'SKIP_WAITING' });
        });
      });
    })
    .catch(err => console.error('SW failed:', err));
}
