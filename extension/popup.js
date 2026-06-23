document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_DATA' }, async (response) => {
    const data = response || { url: tab.url, pageSize: 0, requests: 0 };

    const totalMB = (data.pageSize || 0) / (1024 * 1024);
    const baseCO2 = totalMB * 0.5;
    const hostingBonus = (data.greenHosting || 0) * 0.01;
    const imageBonus = (data.imageOptimization || 0) * 0.01;
    const cachingBonus = (data.cachingScore || 0) * 0.01;
    const efficiency = 1 - hostingBonus - imageBonus * 0.3 - cachingBonus * 0.2;
    const co2Grams = Math.max(0, baseCO2 * Math.max(0.3, efficiency));

    let score, grade, description;
    if (co2Grams < 0.1) { score = 'A+'; grade = 'grade-A'; description = 'Excellent! Very low carbon impact.'; }
    else if (co2Grams < 0.3) { score = 'A'; grade = 'grade-A'; description = 'Great! Below average carbon impact.'; }
    else if (co2Grams < 0.8) { score = 'B'; grade = 'grade-B'; description = 'Good. Moderate carbon impact.'; }
    else if (co2Grams < 1.5) { score = 'C'; grade = 'grade-C'; description = 'Average carbon impact for the web.'; }
    else if (co2Grams < 3) { score = 'D'; grade = 'grade-D'; description = 'High carbon impact. Could be optimized.'; }
    else { score = 'F'; grade = 'grade-F'; description = 'Very high carbon impact. Needs improvement.'; }

    chrome.runtime.sendMessage({
      type: 'SAVE_SCORE',
      url: data.url,
      score,
      co2Grams,
    });

    showResult(score, grade, description, totalMB, data.requests || 0, co2Grams, data);
  });
});

function showResult(score, grade, description, totalMB, requests, co2Grams, data) {
  document.getElementById('scoreDisplay').textContent = score;
  document.getElementById('scoreDisplay').className = `score ${grade}`;
  document.getElementById('scoreDescription').textContent = description;
  document.getElementById('pageSize').textContent = `${totalMB.toFixed(2)} MB`;
  document.getElementById('requests').textContent = `${requests}`;
  document.getElementById('dataTransfer').textContent = `${totalMB.toFixed(2)} MB`;
  document.getElementById('co2PerVisit').textContent = `${co2Grams.toFixed(4)} g`;

  const efficiencyDetails = [];
  if (data.greenHosting > 0) efficiencyDetails.push('🌱 Green hosting detected');
  if (data.imageOptimization > 50) efficiencyDetails.push('🖼️ Images optimized');
  else if (data.imageOptimization > 0) efficiencyDetails.push('⚠️ Images could be better optimized');
  if (data.cachingScore > 50) efficiencyDetails.push('💾 Good caching detected');

  const detailsEl = document.getElementById('efficiencyDetails');
  if (efficiencyDetails.length > 0) {
    detailsEl.innerHTML = efficiencyDetails.join('<br>');
    detailsEl.style.display = 'block';
  }

  const tips = [
    'Consider using dark mode on this site to save energy on OLED screens.',
    'Enable ad blockers to reduce page size and carbon emissions.',
    'Bookmark frequently visited pages instead of loading them fresh.',
    'Use text-only or reader mode when possible to reduce data usage.',
    'Switch to a green hosting provider for websites you manage.',
    'Compress images and use modern formats like WebP or AVIF.',
    'Use lazy loading for images below the fold.',
    'Implement browser caching to reduce repeat visit data transfer.',
  ];
  document.getElementById('tipText').textContent = tips[Math.floor(Math.random() * tips.length)];
}
