// SuperNS Web Interface - JavaScript
// Developed by L'Araignée 🕷️

let attachedFiles = [];
let isProcessing = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkApiConfig();
    autoResizeTextarea();
});

// Check if API is configured
async function checkApiConfig() {
    try {
        const response = await fetch('/api/config');
        const data = await response.json();
        
        if (!data.configured) {
            setTimeout(() => {
                toggleSettings();
            }, 1000);
        }
    } catch (error) {
        console.error('Error checking config:', error);
    }
}

// Send message
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message || isProcessing) return;
    
    // Hide welcome screen
    document.getElementById('welcomeScreen').style.display = 'none';
    
    // Add user message
    addMessage('user', message);
    
    // Clear input
    input.value = '';
    input.style.height = 'auto';
    
    // Disable send button
    isProcessing = true;
    updateSendButton();
    
    // Show typing indicator
    const typingId = showTypingIndicator();
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator(typingId);
        
        if (data.success) {
            addMessage('assistant', data.response);
        } else {
            addMessage('assistant', `❌ Erreur: ${data.error}`, true);
        }
    } catch (error) {
        removeTypingIndicator(typingId);
        addMessage('assistant', `❌ Erreur de connexion: ${error.message}`, true);
    }
    
    // Enable send button
    isProcessing = false;
    updateSendButton();
}

// Add message to chat
function addMessage(role, content, isError = false) {
    const messagesDiv = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    
    const avatar = role === 'user' ? '👤' : '🕷️';
    const name = role === 'user' ? 'Vous' : 'SuperNS';
    const avatarClass = role === 'user' ? 'user-avatar' : 'assistant-avatar';
    
    // Format content (basic markdown support)
    const formattedContent = formatMessage(content);
    
    messageDiv.innerHTML = `
        <div class="message-header">
            <div class="message-avatar ${avatarClass}">${avatar}</div>
            <div class="message-name">${name}</div>
        </div>
        <div class="message-content ${isError ? 'error' : ''}">${formattedContent}</div>
    `;
    
    messagesDiv.appendChild(messageDiv);
    scrollToBottom();
}

// Format message (basic markdown)
function formatMessage(text) {
    // Remove [SuperNS] prefix if present
    text = text.replace(/^\[SuperNS\]:?\s*/i, '');
    
    // Code blocks
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
    
    // Inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Bold
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    
    // Line breaks
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

// Show typing indicator
function showTypingIndicator() {
    const messagesDiv = document.getElementById('messages');
    const typingDiv = document.createElement('div');
    const id = 'typing-' + Date.now();
    typingDiv.id = id;
    typingDiv.className = 'message';
    
    typingDiv.innerHTML = `
        <div class="message-header">
            <div class="message-avatar assistant-avatar">🕷️</div>
            <div class="message-name">SuperNS</div>
        </div>
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    messagesDiv.appendChild(typingDiv);
    scrollToBottom();
    
    return id;
}

// Remove typing indicator
function removeTypingIndicator(id) {
    const element = document.getElementById(id);
    if (element) {
        element.remove();
    }
}

// Handle file selection
async function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    
    for (const file of files) {
        if (file.size > 16 * 1024 * 1024) {
            alert(`Le fichier ${file.name} est trop volumineux (max 16MB)`);
            continue;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                attachedFiles.push({
                    name: file.name,
                    content: data.content
                });
                displayAttachedFiles();
            } else {
                alert(`Erreur lors de l'upload de ${file.name}: ${data.error}`);
            }
        } catch (error) {
            alert(`Erreur: ${error.message}`);
        }
    }
    
    // Reset file input
    event.target.value = '';
}

// Display attached files
function displayAttachedFiles() {
    const container = document.getElementById('attachedFiles');
    container.innerHTML = '';
    
    attachedFiles.forEach((file, index) => {
        const fileDiv = document.createElement('div');
        fileDiv.className = 'attached-file';
        fileDiv.innerHTML = `
            <span>📎 ${file.name}</span>
            <button onclick="removeFile(${index})">×</button>
        `;
        container.appendChild(fileDiv);
    });
}

// Remove attached file
function removeFile(index) {
    attachedFiles.splice(index, 1);
    displayAttachedFiles();
}

// New chat
async function newChat() {
    try {
        await fetch('/api/clear', { method: 'POST' });
        
        document.getElementById('messages').innerHTML = '';
        document.getElementById('welcomeScreen').style.display = 'block';
        attachedFiles = [];
        displayAttachedFiles();
    } catch (error) {
        console.error('Error clearing chat:', error);
    }
}

// Toggle settings modal
function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.classList.toggle('active');
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
            headers: {
                'Content-Type': 'application/json',
            },
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

// Handle Enter key
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Auto-resize textarea
function autoResizeTextarea() {
    const textarea = document.getElementById('messageInput');
    
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 200) + 'px';
        updateSendButton();
    });
}

// Update send button state
function updateSendButton() {
    const sendBtn = document.getElementById('sendBtn');
    const input = document.getElementById('messageInput');
    
    sendBtn.disabled = isProcessing || !input.value.trim();
}

// Scroll to bottom
function scrollToBottom() {
    const container = document.getElementById('chatContainer');
    container.scrollTop = container.scrollHeight;
}

// Close modal on outside click
document.addEventListener('click', (event) => {
    const modal = document.getElementById('settingsModal');
    if (event.target === modal) {
        toggleSettings();
    }
});
