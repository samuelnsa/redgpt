// SuperNS - Minimal Dark Futuristic Interface
// Developed by L'Araignée 🕷️

let attachedFiles = [];
let isProcessing = false;
let conversations = [];
let currentConversationId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadConversations();
    checkApiConfig();
    updateSendButton();
});

// Load conversations from localStorage
function loadConversations() {
    const saved = localStorage.getItem('superns_conversations');
    if (saved) {
        conversations = JSON.parse(saved);
        renderConversations();
    }
}

// Save conversations to localStorage
function saveConversations() {
    localStorage.setItem('superns_conversations', JSON.stringify(conversations));
}

// Render conversations list
function renderConversations() {
    const list = document.getElementById('conversationsList');
    list.innerHTML = '';
    
    conversations.slice().reverse().forEach(conv => {
        const item = document.createElement('div');
        item.className = 'conversation-item' + (conv.id === currentConversationId ? ' active' : '');
        item.onclick = () => loadConversation(conv.id);
        
        // Get first message as title
        const title = conv.messages.length > 0 
            ? conv.messages[0].content.substring(0, 30) + '...'
            : 'Nouvelle conversation';
        
        item.textContent = title;
        list.appendChild(item);
    });
}

// Load a conversation
function loadConversation(convId) {
    const conv = conversations.find(c => c.id === convId);
    if (!conv) return;
    
    currentConversationId = convId;
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    
    conv.messages.forEach(msg => {
        addMessageToDOM(msg.role, msg.content, msg.id);
    });
    
    document.getElementById('welcomeMessage')?.remove();
    renderConversations();
    scrollToBottom();
}

// Create new conversation
function createConversation() {
    const conv = {
        id: Date.now().toString(),
        created: new Date().toISOString(),
        messages: []
    };
    conversations.push(conv);
    currentConversationId = conv.id;
    saveConversations();
    return conv;
}

// Get or create current conversation
function getCurrentConversation() {
    if (!currentConversationId) {
        return createConversation();
    }
    return conversations.find(c => c.id === currentConversationId) || createConversation();
}

// Auto-resize textarea
function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    updateSendButton();
}

// Update send button state
function updateSendButton() {
    const input = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendButton');
    const hasContent = input.value.trim() || attachedFiles.length > 0;
    sendBtn.disabled = isProcessing || !hasContent;
}

// Send message
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message && attachedFiles.length === 0) return;
    if (isProcessing) return;
    
    // Remove welcome message
    document.getElementById('welcomeMessage')?.remove();
    
    // Get or create conversation
    const conv = getCurrentConversation();
    
    // Add user message
    const userMsgId = Date.now().toString();
    const userMsg = { id: userMsgId, role: 'user', content: message };
    conv.messages.push(userMsg);
    addMessageToDOM('user', message, userMsgId);
    
    // Clear input
    input.value = '';
    input.style.height = 'auto';
    attachedFiles = [];
    document.getElementById('attachedFilesPreview').classList.add('hidden');
    
    // Save conversation
    saveConversations();
    renderConversations();
    
    // Disable send
    isProcessing = true;
    updateSendButton();
    
    // Show typing
    const typingId = showTypingIndicator();
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        removeTypingIndicator(typingId);
        
        if (data.success) {
            const assistantMsgId = Date.now().toString();
            const assistantMsg = { id: assistantMsgId, role: 'assistant', content: data.response };
            conv.messages.push(assistantMsg);
            addMessageToDOM('assistant', data.response, assistantMsgId);
            saveConversations();
            renderConversations();
        } else {
            addMessageToDOM('assistant', `❌ Erreur: ${data.error}`, null, true);
        }
    } catch (error) {
        removeTypingIndicator(typingId);
        addMessageToDOM('assistant', `❌ Erreur: ${error.message}`, null, true);
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

// Add message to DOM
function addMessageToDOM(role, content, messageId = null, isError = false) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    if (messageId) messageDiv.dataset.messageId = messageId;
    
    const avatar = role === 'user' ? '👤' : '🕷️';
    const name = role === 'user' ? 'Vous' : 'SuperNS';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">${avatar}</div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-name">${name}</span>
                <div class="message-actions">
                    <button class="btn-message-action" onclick="copyMessage('${messageId || ''}')" title="Copier">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                        </svg>
                    </button>
                    ${role === 'user' ? `
                    <button class="btn-message-action" onclick="editMessage('${messageId}')" title="Éditer">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                    </button>
                    ` : ''}
                </div>
            </div>
            <div class="message-text" data-content="${messageId || ''}">${formatMessage(content, isError)}</div>
        </div>
    `;
    
    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
}

// Format message
function formatMessage(text, isError = false) {
    if (isError) return `<span style="color: #ff4444;">${text}</span>`;
    
    text = text.replace(/^\[SuperNS\]:?\s*/i, '');
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    text = text.replace(/\n/g, '<br>');
    return text;
}

// Copy message
function copyMessage(messageId) {
    const conv = getCurrentConversation();
    const msg = conv.messages.find(m => m.id === messageId);
    if (!msg) return;
    
    navigator.clipboard.writeText(msg.content).then(() => {
        // Show feedback
        const btn = event.target.closest('button');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 1000);
    });
}

// Edit message
function editMessage(messageId) {
    const conv = getCurrentConversation();
    const msgIndex = conv.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;
    
    const msg = conv.messages[msgIndex];
    const input = document.getElementById('messageInput');
    
    // Put message in input
    input.value = msg.content;
    autoResize(input);
    input.focus();
    
    // Remove this message and all after it
    conv.messages = conv.messages.slice(0, msgIndex);
    saveConversations();
    
    // Re-render messages
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = '';
    conv.messages.forEach(m => addMessageToDOM(m.role, m.content, m.id));
    
    renderConversations();
}

// Show typing indicator
function showTypingIndicator() {
    const messagesDiv = document.getElementById('messages');
    const typingDiv = document.createElement('div');
    const id = 'typing-' + Date.now();
    typingDiv.id = id;
    typingDiv.className = 'message assistant';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">🕷️</div>
        <div class="message-content">
            <div class="message-header">
                <span class="message-name">SuperNS</span>
            </div>
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
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 100);
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
            <button class="btn-remove" onclick="removeFile('${fileData.id}')">
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        `;
    } else {
        card.innerHTML = `
            <div class="file-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
            </div>
            <button class="btn-remove" onclick="removeFile('${fileData.id}')">
                <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
function newChat() {
    currentConversationId = null;
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = `
        <div class="welcome-message" id="welcomeMessage">
            <div class="welcome-icon">
                <svg viewBox="0 0 200 200" class="welcome-svg">
                    <defs>
                        <linearGradient id="welcome-gradient">
                            <stop offset="0%" stop-color="#00ff88"/>
                            <stop offset="100%" stop-color="#00d4ff"/>
                        </linearGradient>
                    </defs>
                    <circle cx="100" cy="100" r="25" fill="url(#welcome-gradient)" opacity="0.9"/>
                    <path d="M 75 90 Q 40 70, 20 60" stroke="url(#welcome-gradient)" stroke-width="3" fill="none" opacity="0.7"/>
                    <path d="M 75 100 Q 30 100, 10 100" stroke="url(#welcome-gradient)" stroke-width="3" fill="none" opacity="0.7"/>
                    <path d="M 75 110 Q 40 130, 20 140" stroke="url(#welcome-gradient)" stroke-width="3" fill="none" opacity="0.7"/>
                    <path d="M 125 90 Q 160 70, 180 60" stroke="url(#welcome-gradient)" stroke-width="3" fill="none" opacity="0.7"/>
                    <path d="M 125 100 Q 170 100, 190 100" stroke="url(#welcome-gradient)" stroke-width="3" fill="none" opacity="0.7"/>
                    <path d="M 125 110 Q 160 130, 180 140" stroke="url(#welcome-gradient)" stroke-width="3" fill="none" opacity="0.7"/>
                    <circle cx="100" cy="100" r="35" fill="url(#welcome-gradient)" opacity="0.1"/>
                </svg>
            </div>
            <h1 class="welcome-title">SuperNS Intelligence</h1>
            <p class="welcome-subtitle">Assistant IA sans restrictions • Développé par L'Araignée</p>
        </div>
    `;
    
    attachedFiles = [];
    document.getElementById('attachedFilesPreview').classList.add('hidden');
    document.getElementById('messageInput').value = '';
    renderConversations();
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
