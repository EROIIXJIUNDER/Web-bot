// Elements
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// API endpoint
const API_URL = 'https://asmit-docs.onrender.com/Gpt';


function generateRandomString(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


function getUID() {
    let uid = localStorage.getItem('chatbotUID');
    if (!uid) {
        uid = generateRandomString(20); 
        localStorage.setItem('chatbotUID', uid);
    }
    return uid;
}


const UID = getUID();


function addMessage(message, isUser = false) {
    const messageElement = document.createElement('div');
    messageElement.className = `flex ${isUser ? 'justify-end' : 'justify-start'}`;

    const bubbleElement = document.createElement('div');
    bubbleElement.className = `max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
    } shadow-md`;
    bubbleElement.textContent = message;

    messageElement.appendChild(bubbleElement);
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}


async function sendMessage(message) {
    try {
        const response = await fetch(`${API_URL}?q=${encodeURIComponent(message)}&uid=${UID}`);
        if (!response.ok) {
            throw new Error('API request failed');
        }
        const text = await response.text(); 
        return text; 
    } catch (error) {
        console.error('Error:', error);
        return 'Sorry, there was an error processing your request.';
    }
}
sendButton.addEventListener('click', async () => {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message, true);
        userInput.value = '';

    
        const response = await sendMessage(message);
        addMessage(response);
    }
});


userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});
