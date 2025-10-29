console.log('🚀 DevDocs Simplifier: Content script loaded');

// AI-Powered Text Simplifier with Prompt API + Fallback
class TextSimplifier {
  constructor() {
    this.aiSession = null;
    this.useAI = false;
  }

  async initializeAI() {
    try {
      if (window.ai && window.ai.languageModel) {
        const capabilities = await window.ai.languageModel.capabilities();
        if (capabilities.available === 'readily') {
          this.aiSession = await window.ai.languageModel.create();
          this.useAI = true;
          console.log('✅ Using Chrome Prompt API');
          return true;
        }
      }
    } catch (e) {
      console.log('⚠️ Prompt API not available, using fallback');
    }
    return false;
  }

  async simplifyELI5(text) {
    if (!this.aiSession) await this.initializeAI();
    
    if (this.useAI) {
      try {
        const prompt = `Explain this technical concept in very simple language, like you're talking to a 5-year-old child. Use everyday analogies:\n\n${text}\n\nSimple explanation:`;
        return await this.aiSession.prompt(prompt);
      } catch (e) {
        console.log('AI failed, using fallback');
      }
    }
    
    // Fallback
    return `🎈 Simple Explanation:\n\n${text.replace(/function/gi, 'instruction').replace(/variable/gi, 'container').replace(/array/gi, 'list')}\n\n💡 Think of it like building with LEGO blocks!`;
  }

  async summarizeTLDR(text) {
    if (!this.aiSession) await this.initializeAI();
    
    if (this.useAI) {
      try {
        const prompt = `Provide a TLDR (Too Long Didn't Read) summary of this text. Be concise:\n\n${text}\n\nTLDR:`;
        return await this.aiSession.prompt(prompt);
      } catch (e) {
        console.log('AI failed, using fallback');
      }
    }
    
    // Fallback
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    return `⚡ TLDR:\n\n${sentences.slice(0, 2).join(' ')}`;
  }

  async generateCodeExample(text) {
    if (!this.aiSession) await this.initializeAI();
    
    if (this.useAI) {
      try {
        const prompt = `Create a practical JavaScript code example based on this concept:\n\n${text}\n\nCode:`;
        return await this.aiSession.prompt(prompt);
      } catch (e) {
        console.log('AI failed, using fallback');
      }
    }
    
    // Fallback
    return `💻 Code Example:\n\n// Example based on concept\nconst example = {\n  concept: "See documentation",\n  implementation: "Coming soon"\n};\n\nconsole.log(example);`;
  }

  async technicalExplanation(text) {
    if (!this.aiSession) await this.initializeAI();
    
    if (this.useAI) {
      try {
        const prompt = `Rewrite this technical text in clearer, more accessible language for developers:\n\n${text}\n\nClearer version:`;
        return await this.aiSession.prompt(prompt);
      } catch (e) {
        console.log('AI failed, using fallback');
      }
    }
    
    // Fallback
    return `🔧 Technical:\n\n${text}\n\n📖 This demonstrates the core concept in simpler terms.`;
  }
}

// Message Listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 DevDocs Simplifier: Message received', request.action);
  
  const { action, text } = request;
  
  if (!text || text.trim().length < 10) {
    showModal('⚠️ Selection Too Short', 'Please select at least 10 characters of text to simplify.', 'error');
    return true;
  }

  if (text.length > 5000) {
    showModal('⚠️ Selection Too Long', 'Please select less than 5000 characters. Try selecting a smaller section.', 'error');
    return true;
  }

  showLoadingModal();

  setTimeout(() => {
    try {
      let result;
      
      switch (action) {
        case 'simplify-eli5':
          result = simplifier.simplifyELI5(text);
          break;
        case 'simplify-tldr':
          result = simplifier.summarizeTLDR(text);
          break;
        case 'simplify-code':
          result = simplifier.generateCodeExample(text);
          break;
        case 'simplify-technical':
          result = simplifier.technicalExplanation(text);
          break;
        default:
          result = simplifier.technicalExplanation(text);
      }
      
      showModal(getTitle(action), result, 'success', action);
    } catch (error) {
      console.error('❌ DevDocs Simplifier: Error', error);
      showModal('❌ Error', 'Something went wrong processing your text. Please try again.', 'error');
    }
  }, 600);

  return true;
});

function getTitle(action) {
  const titles = {
    'simplify-eli5': '🎈 ELI5 Explanation',
    'simplify-tldr': '⚡ TLDR Summary',
    'simplify-code': '💻 Code Example',
    'simplify-technical': '🔧 Technical Explanation'
  };
  return titles[action] || '✨ Result';
}

function showLoadingModal() {
  removeModal();
  
  const modal = document.createElement('div');
  modal.id = 'devdocs-modal';
  modal.innerHTML = `
    <div class="devdocs-overlay"></div>
    <div class="devdocs-content devdocs-loading">
      <div class="devdocs-spinner"></div>
      <h3>Processing...</h3>
      <p>Simplifying your text</p>
    </div>
  `;
  
  document.body.appendChild(modal);
  addStyles();
}

function showModal(title, content, type, action) {
  removeModal();
  
  const isCode = action === 'simplify-code';
  const formattedContent = isCode 
    ? `<pre>${escapeHtml(content)}</pre>`
    : `<div class="devdocs-text">${escapeHtml(content).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</div>`;
  
  const modal = document.createElement('div');
  modal.id = 'devdocs-modal';
  modal.innerHTML = `
    <div class="devdocs-overlay"></div>
    <div class="devdocs-content ${type === 'error' ? 'devdocs-error' : ''}">
      <div class="devdocs-header">
        <h3>${title}</h3>
        <button class="devdocs-close">&times;</button>
      </div>
      <div class="devdocs-body">
        ${formattedContent}
      </div>
      <div class="devdocs-footer">
        <button class="devdocs-btn-copy">📋 Copy</button>
        <button class="devdocs-btn-close">Close</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  addStyles();
  
  const close = () => removeModal();
  modal.querySelector('.devdocs-overlay').onclick = close;
  modal.querySelector('.devdocs-close').onclick = close;
  modal.querySelector('.devdocs-btn-close').onclick = close;
  
  modal.querySelector('.devdocs-btn-copy').onclick = () => {
    navigator.clipboard.writeText(content).then(() => {
      const btn = modal.querySelector('.devdocs-btn-copy');
      btn.textContent = '✓ Copied!';
      btn.style.background = '#34a853';
      setTimeout(() => {
        btn.textContent = '📋 Copy';
        btn.style.background = '#1a73e8';
      }, 2000);
    });
  };
}

function removeModal() {
  const existing = document.getElementById('devdocs-modal');
  if (existing) existing.remove();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function addStyles() {
  if (document.getElementById('devdocs-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'devdocs-styles';
  style.textContent = `
    #devdocs-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 2147483647; display: flex; align-items: center; justify-content: center; font-family: -apple-system, system-ui, sans-serif; }
    .devdocs-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); }
    .devdocs-content { position: relative; background: white; border-radius: 16px; max-width: 700px; width: 90%; max-height: 80vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.5); }
    .devdocs-loading { max-width: 300px; padding: 40px; text-align: center; }
    .devdocs-spinner { width: 50px; height: 50px; border: 4px solid #e0e0e0; border-top-color: #1a73e8; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .devdocs-loading h3 { margin: 0 0 8px; color: #1a73e8; font-size: 20px; }
    .devdocs-loading p { margin: 0; color: #666; font-size: 14px; }
    .devdocs-header { padding: 24px; border-bottom: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; }
    .devdocs-header h3 { margin: 0; color: #1a73e8; font-size: 22px; font-weight: 600; }
    .devdocs-close { background: none; border: none; font-size: 28px; color: #999; cursor: pointer; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
    .devdocs-close:hover { background: #f0f0f0; }
    .devdocs-body { padding: 24px; overflow-y: auto; flex: 1; }
    .devdocs-text { line-height: 1.7; font-size: 15px; color: #333; white-space: pre-wrap; }
    .devdocs-body pre { background: #f5f5f5; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: 'Monaco', 'Courier New', monospace; font-size: 13px; line-height: 1.5; color: #333; }
    .devdocs-footer { padding: 20px 24px; border-top: 1px solid #e0e0e0; display: flex; gap: 12px; justify-content: flex-end; }
    .devdocs-btn-copy, .devdocs-btn-close { padding: 12px 24px; border: none; border-radius: 8px; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
    .devdocs-btn-copy { background: #1a73e8; color: white; }
    .devdocs-btn-copy:hover { background: #1557b0; }
    .devdocs-btn-close { background: #f0f0f0; color: #333; }
    .devdocs-btn-close:hover { background: #e0e0e0; }
    .devdocs-error .devdocs-header h3 { color: #d93025; }
    .devdocs-error .devdocs-body { background: #fce8e6; }
  `;
  document.head.appendChild(style);
}

console.log('✅ DevDocs Simplifier: Ready!');
