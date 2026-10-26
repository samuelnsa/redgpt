// SuperNS - Claude-Style Interface JavaScript
// Developed by L'Araignée 🕷️

let attachedFiles = [];
let isProcessing = false;
let isThinkingEnabled = false;
let selectedModel = 'sonnet-4.5';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkApiConfig();
    updateSendButton();
});

// Auto-resize textarea
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 384) + 'px';
    updateSendButton();
}

// Update send button state
function updateSendButton() {
    const input = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendButton');
    const hasContent = input.value.trim() || attachedFiles.length > 0;
    sendBtn.disabled = isProcessing || !hasContent;
}

// Fill prompt suggestion
function fillPrompt(text) {
    const input = document.getElementById('messageInput');
    input.value = text + ' ';
    input.focus();
    autoResize(input);
    updateSendButton();
}

// Toggle thinking mode
function toggleThinking() {
    isThinkingEnabled = !isThinkingEnabled;
    const btn = document.getElementById('thinkingToggle');
    if (isThinkingEnabled) {
        btn.classList.add('bg-accent', 'text-bg-0');
        btn.classList.remove('text-text-400');
    } else {
        btn.classList.remove('bg-accent', 'text-bg-0');
        btn.classList.add('text-text-400');
    }
}

// Toggle model selector
function toggleModelSelector() {
    const dropdown = document.getElementById('modelDropdown');
    const arrow = document.getElementById('modelArrow');
    dropdown.classList.toggle('hidden');
    arrow.style.transform = dropdown.classList.contains('hidden') ? '' : 'rotate(180deg)';
}

// Select model
function selectModel(modelId, modelName) {
    selectedModel = modelId;
    document.getElementById('selectedModelName').textContent = modelName;
    toggleModelSelector();
}

// Send message
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message && attachedFiles.length === 0) return;
    if (isProcessing) return;
    
    // Hide welcome screen, show messages
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('messagesContainer').style.display = 'block';
    
    // Add user message
    addMessage('user', message, attachedFiles);
    
    // Clear input
    input.value = '';
    input.style.height = 'auto';
    attachedFiles = [];
    document.getElementById('attachedFilesPreview').classList.add('hidden');
    
    // Disable send
    isProcessing = true;
    updateSendButton();
    
    // Show typing
    const typingId = showTypingIndicator();
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message,
                model: selectedModel,
                thinking: isThinkingEnabled
            })
        });
        
        const data = await response.json();
        removeTypingIndicator(typingId);
        
        if (data.success) {
            addMessage('assistant', data.response);
        } else {
            addMessage('assistant', `❌ Erreur: ${data.error}`, true);
        }
    } catch (error) {
        removeTypingIndicator(typingId);
        addMessage('assistant', `❌ Erreur: ${error.message}`, true);
    }
    
    isProcessing = false;
    updateSendButton();
}

// Handle Enter key
function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Add message to chat
function addMessage(role, content, files = [], isError = false) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${role} flex gap-3`;
    
    const avatar = role === 'user' ? '👤' : '🕷️';
    const name = role === 'user' ? 'Vous' : 'SuperNS';
    
    let html = `
        <div class="message-avatar" style="width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-center; font-size: 18px; background: ${role === 'user' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)'}; color: white;">
            ${avatar}
        </div>
        <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 14px; color: var(--text-200); margin-bottom: 4px;">${name}</div>
            <div class="message-content" style="${isError ? 'color: #ef4444;' : ''}">${formatMessage(content)}</div>
        </div>
    `;
    
    messageDiv.innerHTML = html;
    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
}

// Format message
function formatMessage(text) {
    text = text.replace(/^\[SuperNS\]:?\s*/i, '');
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    text = text.replace(/\n/g, '<br>');
    return text;
}

// Show typing indicator
function showTypingIndicator() {
    const messagesDiv = document.getElementById('messages');
    const typingDiv = document.createElement('div');
    const id = 'typing-' + Date.now();
    typingDiv.id = id;
    typingDiv.className = 'message flex gap-3';
    
    typingDiv.innerHTML = `
        <div style="width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-center; font-size: 18px; background: linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%); color: white;">
            🕷️
        </div>
        <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 14px; color: var(--text-200); margin-bottom: 4px;">SuperNS</div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    
    messagesDiv.appendChild(typingDiv);
    scrollToBottom();
    return id;
}

// Remove typing indicator
function removeTypingIndicator(id) {
    const element = document.getElementById(id);
    if (element) element.remove();
}

// Scroll to bottom
function scrollToBottom() {
    const container = document.getElementById('messagesContainer');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

// Handle file selection
async function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    const preview = document.getElementById('attachedFilesPreview');
    
    for (const file of files) {
        if (file.size > 16 * 1024 * 1024) {
            alert(`Le fichier ${file.name} est trop volumineux (max 16MB)`);
            continue;
        }
        
        const fileData = {
            id: Math.random().toString(36).substr(2, 9),
            file: file,
            preview: null
        };
        
        // Create preview for images
        if (file.type.startsWith('image/')) {
            fileData.preview = URL.createObjectURL(file);
        }
        
        attachedFiles.push(fileData);
        addFilePreview(fileData);
    }
    
    if (attachedFiles.length > 0) {
        preview.classList.remove('hidden');
    }
    
    event.target.value = '';
    updateSendButton();
}

// Add file preview
function addFilePreview(fileData) {
    const container = document.getElementById('attachedFilesPreview');
    const card = document.createElement('div');
    card.className = 'file-preview-card';
    card.dataset.id = fileData.id;
    
    if (fileData.preview) {
        card.innerHTML = `
            <img src="${fileData.preview}" alt="${fileData.file.name}">
            <button class="remove-btn" onclick="removeFile('${fileData.id}')">
                <svg style="width: 12px; height: 12px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        `;
    } else {
        card.innerHTML = `
            <div style="padding: 12px; display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <svg style="width: 16px; height: 16px; color: var(--text-300);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <span style="font-size: 12px; font-weight: 500; color: var(--text-400);">${fileData.file.name.split('.').pop().toUpperCase()}</span>
                </div>
                <p style="font-size: 12px; color: var(--text-200); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${fileData.file.name}</p>
            </div>
            <button class="remove-btn" onclick="removeFile('${fileData.id}')">
                <svg style="width: 12px; height: 12px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        `;
    }
    
    container.appendChild(card);
}

// Remove file
function removeFile(id) {
    attachedFiles = attachedFiles.filter(f => f.id !== id);
    const card = document.querySelector(`.file-preview-card[data-id="${id}"]`);
    if (card) card.remove();
    
    if (attachedFiles.length === 0) {
        document.getElementById('attachedFilesPreview').classList.add('hidden');
    }
    
    updateSendButton();
}

// New chat
async function newChat() {
    try {
        await fetch('/api/clear', { method: 'POST' });
        
        document.getElementById('messages').innerHTML = '';
        document.getElementById('messagesContainer').style.display = 'none';
        document.getElementById('welcomeScreen').style.display = 'flex';
        attachedFiles = [];
        document.getElementById('attachedFilesPreview').classList.add('hidden');
        document.getElementById('messageInput').value = '';
    } catch (error) {
        console.error('Error clearing chat:', error);
    }
}

// Toggle settings modal
function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.toggle('hidden');
}

// Save settings
async function saveSettings() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    
    if (!apiKey) {
        alert('Veuillez entrer une clé API');
        return;
    }
    
    try {
        const response = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ api_key: apiKey })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('✅ Clé API enregistrée avec succès!');
            toggleSettings();
            document.getElementById('apiKeyInput').value = '';
        } else {
            alert(`❌ Erreur: ${data.error}`);
        }
    } catch (error) {
        alert(`❌ Erreur: ${error.message}`);
    }
}

// Check API config
async function checkApiConfig() {
    try {
        const response = await fetch('/api/config');
        const data = await response.json();
        
        if (!data.configured) {
            setTimeout(() => toggleSettings(), 1000);
        }
    } catch (error) {
        console.error('Error checking config:', error);
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    const modelBtn = document.getElementById('modelButton');
    const modelDropdown = document.getElementById('modelDropdown');
    const settingsModal = document.getElementById('settingsModal');
    
    if (modelBtn && !modelBtn.contains(e.target) && modelDropdown && !modelDropdown.contains(e.target)) {
        modelDropdown.classList.add('hidden');
        document.getElementById('modelArrow').style.transform = '';
    }
    
    if (e.target === settingsModal) {
        toggleSettings();
    }
});
