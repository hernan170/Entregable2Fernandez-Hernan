document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const chatbotToggleBtn = document.getElementById('chatbot-toggle-btn');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotCloseBtn = document.getElementById('chatbot-close-btn');
    const chatbotMessages = document.getElementById('chatbot-messages');
    const chatbotForm = document.getElementById('chatbot-form');
    const chatbotInput = document.getElementById('chatbot-input');

    let botResponses = {};

    // Carga las respuestas del bot desde un archivo JSON
    const loadBotResponses = async () => {
        try {
            const response = await fetch('./responses.json');
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            botResponses = await response.json();
            console.log('Respuestas del bot cargadas:', botResponses);
        } catch (error) {
            console.error('No se pudieron cargar las respuestas del bot:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error de carga',
                text: 'No se pudieron cargar las respuestas del bot. Por favor, revisa el archivo responses.json.'
            });
        }
    };

    // Almacena la conversación en localStorage
    const saveConversation = (conversation) => {
        localStorage.setItem('chatbotConversation', JSON.stringify(conversation));
    };

    // Carga la conversación desde localStorage
    const loadConversation = () => {
        const savedConversation = localStorage.getItem('chatbotConversation');
        if (savedConversation) {
            return JSON.parse(savedConversation);
        }
        return [];
    };

    // Muestra un mensaje en la interfaz del chatbot
    const displayMessage = (text, sender) => {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = text;
        messageDiv.classList.add('chatbot-message', sender);
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        
        // Guarda la conversación después de cada mensaje
        const currentConversation = Array.from(chatbotMessages.children).map(el => ({
            text: el.textContent,
            sender: el.classList.contains('user') ? 'user' : 'bot'
        }));
        saveConversation(currentConversation);
    };

    // Obtiene una respuesta del bot
    const getBotResponse = (userMessage) => {
        const normalizedMessage = userMessage.toLowerCase().trim();
        const keywords = Object.keys(botResponses);
        for (const keyword of keywords) {
            if (normalizedMessage.includes(keyword)) {
                return botResponses[keyword];
            }
        }
        return botResponses.default || 'Lo siento, no entendí tu pregunta.';
    };

    // Maneja el envío del formulario del chatbot
    const handleChatbotFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = chatbotInput.value.trim();
        if (userMessage) {
            displayMessage(userMessage, 'user');
            const botResponse = getBotResponse(userMessage);
            setTimeout(() => {
                displayMessage(botResponse, 'bot');
            }, 500);
            chatbotInput.value = '';
        }
    };

    // Inicializa el chatbot
    const initChatbot = async () => {
        await loadBotResponses();
        const savedConversation = loadConversation();
        if (savedConversation.length > 0) {
            savedConversation.forEach(msg => displayMessage(msg.text, msg.sender));
        } else {
            displayMessage(botResponses.welcome || 'Hola, ¿en qué puedo ayudarte?', 'bot');
        }
    };

    // Eventos del ChatBot
    chatbotToggleBtn.addEventListener('click', () => {
        chatbotContainer.classList.toggle('open');
    });

    chatbotCloseBtn.addEventListener('click', () => {
        chatbotContainer.classList.remove('open');
    });

    chatbotForm.addEventListener('submit', handleChatbotFormSubmit);

    // Inicia la aplicación
    initChatbot();
});