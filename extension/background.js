chrome.runtime.onInstalled.addListener(() => {
  console.log('VeloraGreen EcoScore extension installed!');
});

chrome.action.onClicked.addListener((tab) => {
  chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_DATA' });
});
