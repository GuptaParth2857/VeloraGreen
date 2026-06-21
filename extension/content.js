chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_PAGE_DATA') {
    const resources = performance.getEntriesByType('resource');
    const totalSize = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
    const totalRequests = resources.length;

    sendResponse({
      url: window.location.href,
      pageSize: totalSize,
      requests: totalRequests,
      dataTransfer: totalSize,
    });
  }
});

// Calculate estimated CO2 for the page
function calculateEcoScore() {
  const resources = performance.getEntriesByType('resource');
  const totalMB = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0) / (1024 * 1024);
  return totalMB * 0.5; // grams of CO2
}
