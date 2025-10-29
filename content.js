console.log('🚀 DevDocs Simplifier: Content script loaded');

// Enhanced Text Simplification Engine
class TextSimplifier {
  simplifyELI5(text) {
    // More aggressive simplification
    let simplified = text;
    
    // Replace technical terms with simple explanations
    const replacements = {
      'JavaScript': 'a computer language that makes websites interactive',
      'programming language': 'way to give instructions to computers',
      'interpreted': 'read and run immediately',
      'just-in-time compiled': 'prepared super fast right before running',
      'first-class functions': 'code blocks you can pass around like toys',
      'scripting language': 'simple programming language',
      'non-browser environments': 'programs that aren\'t websites',
      'prototype-based': 'built by copying and modifying examples',
      'garbage-collected': 'automatically cleans up unused stuff',
      'dynamic language': 'flexible and changes as it runs',
      'imperative': 'giving step-by-step orders',
      'functional': 'using small reusable pieces',
      'object-oriented': 'organizing code like real-world objects',
      'function': 'a mini-program that does one specific job',
      'variable': 'a labeled box to store information',
      'array': 'a numbered list of items',
      'object': 'a container with named sections',
      'loop': 'repeating an action multiple times',
      'condition': 'a yes-or-no question the computer checks',
      'parameter': 'information you give to a function',
      'argument': 'a value you pass in',
      'return': 'give back an answer',
      'method': 'a special skill an object has',
      'property': 'a characteristic or feature',
      'API': 'a way for different programs to talk',
      'callback': 'code that runs later',
      'promise': 'something that will complete eventually',
      'async': 'happening at different times',
      'await': 'wait for something to finish',
      'syntax': 'grammar rules for code',
      'string': 'text like words or sentences',
      'boolean': 'true or false',
      'integer': 'a whole number like 5',
      'float': 'a decimal number like 3.14',
      'null': 'intentionally empty',
      'undefined': 'doesn\'t exist yet',
      'class': 'a blueprint for creating things',
      'constructor': 'setup instructions',
      'inheritance': 'getting traits from parents',
      'DOM': 'the structure of a webpage',
      'event': 'something that happens (like a click)',
      'listener': 'code waiting for something to happen'
    };
    
    // Apply replacements (case-insensitive for better matching)
    for (const [technical, simple] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${technical}\\b`, 'gi');
      simplified = simplified.replace(regex, `**${simple}**`);
    }
    
    // Extract first sentence as key point
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    const keyPoint = sentences[0]?.trim() || text.substring(0, 100);
    
    return `🎈 Explained Like You're 5:\n\nImagine you're learning about toys and games! Here's what this means in super simple words:\n\n${simplified}\n\n💡 The Big Idea:\n${keyPoint}\n\nThink of it like building with LEGO blocks - each piece does something simple, but together they make something amazing!`;
  }
  
  summarizeTLDR(text) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    
    // Smarter sentence extraction
    const keywords = [
      'important', 'key', 'main', 'essential', 'must', 'should', 
      'allows', 'enables', 'provides', 'used', 'creates', 'helps',
      'designed', 'purpose', 'goal', 'feature', 'benefit'
    ];
    
    const scored = sentences.map((s, i) => {
      let score = i === 0 ? 10 : 0; // First sentence bonus
      const lower = s.toLowerCase();
      keywords.forEach(kw => {
        if (lower.includes(kw)) score += 2;
      });
      return { sentence: s.trim(), score };
    });
    
    // Get top 3 sentences
    const important = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(x => x.sentence);
    
    const wordCount = text.split(/\s+/).length;
    
    return `⚡ TLDR (Too Long; Didn't Read):\n\n${important.join(' ')}\n\n📊 Summary Stats:\n• Original: ${wordCount} words\n• Reduced to: ~${important.join(' ').split(/\s+/).length} words\n• Time saved: ${Math.round(wordCount / 200)} minutes of reading\n\n📌 Bottom Line:\n${important[0]}`;
  }
  
  generateCodeExample(text) {
    const lower = text.toLowerCase();
    let code = '';
    let explanation = '';
    
    if (lower.includes('array') || lower.includes('list') || lower.includes('map')) {
      explanation = 'Working with Arrays (lists of items):';
      code = `// Creating an array\nconst fruits = ['apple', 'banana', 'orange'];\n\n// Loop through each item\nfruits.forEach(fruit => {\n  console.log(\`I like \${fruit}\`);\n});\n\n// Transform array (make uppercase)\nconst loudFruits = fruits.map(f => f.toUpperCase());\n// Result: ['APPLE', 'BANANA', 'ORANGE']\n\n// Filter array (only long names)\nconst longNames = fruits.filter(f => f.length > 5);\n// Result: ['banana', 'orange']\n\n// Get total count\nconsole.log(\`We have \${fruits.length} fruits\`);`;
    } else if (lower.includes('function') || lower.includes('method')) {
      explanation = 'Creating and Using Functions:';
      code = `// Simple function\nfunction greet(name) {\n  return \`Hello, \${name}!\`;\n}\n\nconsole.log(greet('World')); // "Hello, World!"\n\n// Arrow function (modern style)\nconst add = (a, b) => a + b;\nconsole.log(add(5, 3)); // 8\n\n// Function with multiple parameters\nfunction calculatePrice(item, quantity, discount = 0) {\n  const total = item * quantity;\n  return total - (total * discount);\n}\n\nconsole.log(calculatePrice(10, 3, 0.1)); // $27`;
    } else if (lower.includes('object') || lower.includes('class')) {
      explanation = 'Working with Objects:';
      code = `// Creating an object\nconst person = {\n  name: 'Alice',\n  age: 30,\n  job: 'Developer',\n  greet() {\n    return \`Hi, I'm \${this.name}!\`;\n  }\n};\n\n// Accessing properties\nconsole.log(person.name); // "Alice"\nconsole.log(person.greet()); // "Hi, I'm Alice!"\n\n// Adding new properties\nperson.email = 'alice@example.com';\n\n// Modern class syntax\nclass User {\n  constructor(name, age) {\n    this.name = name;\n    this.age = age;\n  }\n  \n  introduce() {\n    return \`I'm \${this.name}, \${this.age} years old\`;\n  }\n}\n\nconst user = new User('Bob', 25);\nconsole.log(user.introduce());`;
    } else if (lower.includes('async

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
