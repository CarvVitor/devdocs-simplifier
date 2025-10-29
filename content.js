console.log('🚀 DevDocs Simplifier: Content script loaded');

// Text Simplification Engine
class TextSimplifier {
  simplifyELI5(text) {
    const replacements = {
      'function': 'a special instruction that does something',
      'variable': 'a box that holds information',
      'array': 'a numbered list of things',
      'object': 'a container with labeled sections',
      'loop': 'doing something over and over',
      'condition': 'checking if something is true or false',
      'parameter': 'information you give to something',
      'argument': 'information you give to something',
      'return': 'give back a result',
      'method': 'a special ability something has',
      'property': 'a feature or characteristic',
      'API': 'a way for programs to talk to each other',
      'callback': 'something that happens later',
      'promise': 'something that will finish in the future',
      'async': 'happening at different times',
      'syntax': 'the rules for writing code correctly',
      'string': 'text or words',
      'boolean': 'true or false',
      'integer': 'a whole number',
      'float': 'a decimal number'
    };
    
    let simplified = text;
    for (const [tech, simple] of Object.entries(replacements)) {
      const regex = new RegExp(`\\b${tech}\\b`, 'gi');
      simplified = simplified.replace(regex, simple);
    }
    
    const firstSentence = text.match(/[^.!?]+[.!?]+/)?.[0] || text.substring(0, 100);
    
    return `🎈 Explained Like You're 5:\n\n${simplified}\n\n💡 Simple Summary:\nThink of it like this: ${firstSentence.trim()} - but using things you already understand!`;
  }
  
  summarizeTLDR(text) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const keywords = ['important', 'key', 'main', 'primary', 'essential', 'must', 'should', 'allows', 'enables', 'provides', 'used', 'creates'];
    
    const important = [];
    if (sentences[0]) important.push(sentences[0].trim());
    
    for (let i = 1; i < sentences.length && important.length < 3; i++) {
      const sentence = sentences[i].toLowerCase();
      if (keywords.some(kw => sentence.includes(kw))) {
        important.push(sentences[i].trim());
      }
    }
    
    const keyPoint = sentences[0]?.trim() || text.substring(0, 150);
    
    return `⚡ TLDR (Too Long; Didn't Read):\n\n${important.join(' ')}\n\n📌 Bottom Line:\n${keyPoint}`;
  }
  
  generateCodeExample(text) {
    const lower = text.toLowerCase();
    let code = '// Example based on the concept\n\n';
    
    if (lower.includes('array') || lower.includes('list') || lower.includes('map')) {
      code += `// Working with Arrays\nconst numbers = [1, 2, 3, 4, 5];\n\n// Iterate through array\nnumbers.forEach(num => {\n  console.log(num);\n});\n\n// Transform array\nconst doubled = numbers.map(num => num * 2);\nconsole.log(doubled); // [2, 4, 6, 8, 10]\n\n// Filter array\nconst evens = numbers.filter(num => num % 2 === 0);\nconsole.log(evens); // [2, 4]`;
    } else if (lower.includes('function') || lower.includes('method')) {
      code += `// Defining a Function\nfunction calculateTotal(price, quantity) {\n  return price * quantity;\n}\n\n// Using the function\nconst total = calculateTotal(10, 3);\nconsole.log(total); // 30\n\n// Arrow function version\nconst calculate = (price, qty) => price * qty;\nconsole.log(calculate(10, 3)); // 30`;
    } else if (lower.includes('object') || lower.includes('class')) {
      code += `// Creating an Object\nconst user = {\n  name: 'Alice',\n  age: 30,\n  greet() {\n    return \`Hello, I'm \${this.name}!\`;\n  }\n};\n\n// Using the object\nconsole.log(user.name); // "Alice"\nconsole.log(user.greet()); // "Hello, I'm Alice!"\n\n// Adding properties\nuser.email = 'alice@example.com';`;
    } else if (lower.includes('async') || lower.includes('promise') || lower.includes('await')) {
      code += `// Async/Await Example\nasync function fetchData() {\n  try {\n    const response = await fetch('https://api.example.com/data');\n    const data = await response.json();\n    console.log(data);\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n  }\n}\n\n// Using the async function\nfetchData().then(data => {\n  console.log('Received:', data);\n});`;
    } else {
      const topic = text.substring(0, 50).trim();
      code += `// ${topic}\n\n// Example implementation\nconst example = {\n  description: "${topic}",\n  usage: "Refer to documentation for details"\n};\n\nconsole.log(example);\n\n// TODO: Add your specific implementation here`;
    }
    
    return `💻 Code Example:\n\n${code}`;
  }
  
  technicalExplanation(text) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const keyPoint = sentences[0]?.trim() || text.substring(0, 150);
    
    let usage = 'handle common development tasks';
    const lower = text.toLowerCase();
    if (lower.includes('data') || lower.includes('state')) usage = 'manage application data and state';
    else if (lower.includes('event') || lower.includes('click')) usage = 'handle user interactions and events';
    else if (lower.includes('async') || lower.includes('promise')) usage = 'handle asynchronous operations';
    else if (lower.includes('component')) usage = 'build modular user interfaces';
    else if (lower.includes('api')) usage = 'interact with external services';
    
    return `🔧 Technical Explanation:\n\n📖 Core Concept:\n${keyPoint}\n\n💡 In Practice:\nThis is commonly used in modern development to ${usage}. It provides a structured approach to solving problems efficiently.\n\n🎯 Key Takeaway:\n${sentences.slice(0, 2).join(' ')}`;
  }
}

const simplifier = new TextSimplifier();

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
