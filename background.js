console.log('DevDocs Simplifier: Background script loaded');

chrome.runtime.onInstalled.addListener(() => {
  console.log('DevDocs Simplifier: Creating context menus');
  
  chrome.contextMenus.create({
    id: 'simplify-eli5',
    title: '🎈 ELI5 (Explain Like I\'m 5)',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'simplify-tldr',
    title: '⚡ TLDR (Quick Summary)',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'simplify-code',
    title: '💻 Show Me Code Example',
    contexts: ['selection']
  });
  
  chrome.contextMenus.create({
    id: 'simplify-technical',
    title: '🔧 Technical Explanation',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log('DevDocs Simplifier: Menu clicked', info.menuItemId);
  
  if (!info.selectionText || !tab || !tab.id) {
    console.log('DevDocs Simplifier: Invalid selection or tab');
    return;
  }

  try {
    await chrome.tabs.sendMessage(tab.id, {
      action: info.menuItemId,
      text: info.selectionText
    });
    console.log('DevDocs Simplifier: Message sent successfully');
  } catch (error) {
    console.log('DevDocs Simplifier: Could not send message (page may be restricted)');
  }
});
