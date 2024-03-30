chrome.runtime.sendMessage({ type: 'getTabCount' }, (response) => {
    if (response && response.tabCount !== undefined) {
      const tabCountElement = document.getElementById('tabCount');
      tabCountElement.textContent = `Tab count: ${response.tabCount}`;
    } else {
      console.error('Failed to get tab count from background script.');
    }
  });