chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.local.set({
      totalPagesScanned: 0,
      totalCO2Saved: 0,
      ecoScoreHistory: [],
      settings: { showBadge: true, darkMode: false },
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SAVE_SCORE') {
    chrome.storage.local.get(['ecoScoreHistory', 'totalPagesScanned'], (data) => {
      const history = data.ecoScoreHistory || [];
      history.push({
        url: request.url,
        score: request.score,
        co2Grams: request.co2Grams,
        timestamp: Date.now(),
      });
      const recent = history.slice(-100);
      chrome.storage.local.set({
        ecoScoreHistory: recent,
        totalPagesScanned: (data.totalPagesScanned || 0) + 1,
      });
    });
  }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_DATA' });
});
