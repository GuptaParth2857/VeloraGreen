document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.tabs.sendMessage(tab.id, { type: 'GET_PAGE_DATA' }, (response) => {
    const data = response || { url: tab.url, pageSize: 0, requests: 0 };

    const url = new URL(data.url);
    const hostname = url.hostname;

    // Calculate eco score based on page data
    const totalMB = (data.pageSize || 0) / (1024 * 1024);
    const co2Grams = totalMB * 0.5; // ~0.5g CO2 per MB
    let score, grade, description;

    if (co2Grams < 0.1) { score = 'A'; grade = 'grade-A'; description = 'Excellent! Very low carbon impact.'; }
    else if (co2Grams < 0.5) { score = 'B'; grade = 'grade-B'; description = 'Good. Below average carbon impact.'; }
    else if (co2Grams < 1.5) { score = 'C'; grade = 'grade-C'; description = 'Average carbon impact for the web.'; }
    else if (co2Grams < 3) { score = 'D'; grade = 'grade-D'; description = 'High carbon impact. Could be optimized.'; }
    else { score = 'F'; grade = 'grade-F'; description = 'Very high carbon impact. Needs improvement.'; }

    document.getElementById('scoreDisplay').textContent = score;
    document.getElementById('scoreDisplay').className = `score ${grade}`;
    document.getElementById('scoreDescription').textContent = description;
    document.getElementById('pageSize').textContent = `${totalMB.toFixed(2)} MB`;
    document.getElementById('requests').textContent = `${data.requests || 0}`;
    document.getElementById('dataTransfer').textContent = `${totalMB.toFixed(2)} MB`;
    document.getElementById('co2PerVisit').textContent = `${co2Grams.toFixed(4)} g`;

    const tips = [
      'Consider using dark mode on this site to save energy on OLED screens.',
      'Enable ad blockers to reduce page size and carbon emissions.',
      'Bookmark frequently visited pages instead of loading them fresh.',
      'Use text-only or reader mode when possible to reduce data usage.',
      'Switch to a green hosting provider for websites you manage.',
      'Compress images and use modern formats like WebP or AVIF.',
    ];
    document.getElementById('tipText').textContent = tips[Math.floor(Math.random() * tips.length)];
  });
});
