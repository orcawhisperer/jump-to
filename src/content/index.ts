// This script runs in the context of web pages
// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  try {
    switch (message.type) {
      case 'PAGE_INFO':
        // Get current page information
        sendResponse({
          title: document.title,
          url: window.location.href,
          favicon: getFavicon()
        });
        break;

      default:
        console.log('Unknown message type:', message.type);
    }
  } catch (error) {
    console.error('Error in content script:', error);
    sendResponse({ error: 'Failed to process message' });
  }

  // Return true to indicate we'll send a response asynchronously
  return true;
});

// Helper function to get favicon URL
function getFavicon(): string {
  // Try to get favicon from link tags
  const links = document.getElementsByTagName('link');
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    if (link.rel.includes('icon') || link.rel.includes('shortcut')) {
      return link.href;
    }
  }

  // Fallback to default favicon location
  return `${window.location.origin}/favicon.ico`;
}
