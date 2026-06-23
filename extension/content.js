chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_PAGE_DATA') {
    const resources = performance.getEntriesByType('resource');
    const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
    const totalRequests = resources.length;

    const greenHosting = checkGreenHosting();
    const imageOptimization = checkImageOptimization();
    const cachingScore = checkCaching();

    sendResponse({
      url: window.location.href,
      pageSize: totalSize,
      requests: totalRequests,
      dataTransfer: totalSize,
      greenHosting,
      imageOptimization,
      cachingScore,
    });
  }
});

function checkGreenHosting() {
  const greenProviders = ['green', 'eco', 'solar', 'wind', 'renewable'];
  const serverHeader = document.querySelector('meta[name="generator"]')?.getAttribute('content') || '';
  return greenProviders.some(p => serverHeader.toLowerCase().includes(p)) ? 10 : 0;
}

function checkImageOptimization() {
  const images = document.querySelectorAll('img');
  let score = 0;
  images.forEach((img) => {
    if (img.loading === 'lazy') score += 1;
    if (img.srcSet || img.sizes) score += 1;
    if (img.width && img.height) score += 1;
  });
  return images.length > 0 ? Math.round((score / (images.length * 3)) * 100) : 0;
}

function checkCaching() {
  const resources = performance.getEntriesByType('resource');
  const cached = resources.filter(r => r.transferSize === 0 || r.duration < 5);
  return resources.length > 0 ? Math.round((cached.length / resources.length) * 100) : 0;
}
