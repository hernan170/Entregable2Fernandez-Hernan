document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a Elementos del DOM ---
    const welcomeSection = document.getElementById('welcomeSection');
    const userNmeInput = document.getElementById('userNameInput');
    const submitUserNameButton = document.getElementById('submitUserName');
    const welcomeMessageDisplay = document.getElementById('welcomeMessage');
    const talkingButtonSection = document.getElementById('talkingButtonSection');
    const talkingButton = document.getElementById('talkingButton');
    const phraseDisplay = document.getElementById('phraseDisplay');
    const pressCountDisplay = document.getElementById('pressCountDisplay');
    const resetCountButton = document.getElementById('resetCountButton');
    const appConsoleOutput = document.getElementById('appConsoleOutput');
    const btnClearConsole = document.getElementById('btnClearConsole');

// --- Constantes y Variables de Estado ---
const buttonPhrases = [
    "Hola, ¿cómo estás?",
    "¡Qué gusto verte!",
    "Este es un botón parlante.",
    "Que tengas un excelente día.",
    "¿Necesitas algo ?",
    "¡Volve pronto!"
];

const LOCAL_STORAGE_PRESS_COUNT_KEY = 'talkingButton_pressCount';
const LOCAL_STORAGE_USER_NAME_KEY = 'talkingButton_userName';
 
  let pressCount = 0; // Contador de veces que se ha presionado el botón
  let userName = '';    // Nombre del usuario

    // --- Funciones Auxiliares para Interacción con el DOM ---

    /**
     * Añade un mensaje a la "consola" simulada en el HTML.
     * También envía al console.log real del navegador.
     * @param {string} message - El mensaje a loguear (puede contener HTML básico).
     * @param {string} [type='info'] - Tipo de mensaje para estilizar (ej. 'info', 'warning', 'error').
     */
    function logToAppConsole(message, type = 'info') {
        const p = document.createElement('p');
        p.innerHTML = `<span class="text-${type}">[${new Date().toLocaleTimeString()}] ${message}</span>`;
        appConsoleOutput.appendChild(p);
        appConsoleOutput.scrollTop = appConsoleOutput.scrollHeight; // Auto-scroll al final
        // También loguea en la consola del navegador, eliminando etiquetas HTML para claridad
        console.log(`[${new Date().toLocaleTimeString()}] ${message.replace(/<\/?span[^>]*>/g, '').replace(/<\/?strong>/g, '')}`);
    }

    /**
     * Actualiza el contador de presiones en el DOM.
     */
    function updatePressCountDisplay() {
        pressCountDisplay.textContent = pressCount;
    }

    /**
     * Muestra u oculta el botón de reiniciar contador.
     * @param {boolean} show - True para mostrar, False para ocultar.
     */
    function toggleResetButton(show) {
        if (show) {
            resetCountButton.classList.remove('d-none');
        } else {
            resetCountButton.classList.add('d-none');
        }
    }

    // --- Funciones Principales de la Lógica ---

    /**

     * @returns {string} Una frase aleatoria.
     */
    function getRandomPhrase() {
        const randomIndex = Math.floor(Math.random() * buttonPhrases.length);
        return buttonPhrases[randomIndex];
    }

    /**
     * Función que se ejecuta al hacer clic en el botón parlante.
     * Gestiona la lógica de las frases, el contador y las interacciones.
     */
    function activateButton() {
        pressCount++; // Incrementa el contador
        updatePressCountDisplay(); // Actualiza el DOM

        const phraseToSay = getRandomPhrase(); // Obtiene una frase aleatoria
        phraseDisplay.textContent = phraseToSay; // Muestra la frase en el DOM

        logToAppConsole(`Botón presionado. Frase: "<strong>${phraseToSay}</strong>"`);
        logToAppConsole(`Veces presionado: ${pressCount}`);

        // Condicional: Si se presiona 3 veces, sugiere reiniciar
        if (pressCount === 3) {
            welcomeMessageDisplay.textContent = "¡Has presionado el botón 3 veces! ¿Quieres reiniciar el contador?";
            welcomeMessageDisplay.className = "alert alert-warning text-center";
            logToAppConsole("ADVERTENCIA: ¡Has presionado 3 veces! Sugerencia de reinicio.", 'warning');
            toggleResetButton(true); // Muestra el botón de reiniciar
        } else if (pressCount % 5 === 0) { // Condicional: Cada 5 interacciones (excepto la 3)
            logToAppConsole(`¡Llevas ${pressCount} interacciones! ¡Sigue así!`, 'warning');
            welcomeMessageDisplay.textContent = `¡Llevas ${pressCount} interacciones! ¡Sigue así!`;
            welcomeMessageDisplay.className = "alert alert-info text-center";
        } else {
            welcomeMessageDisplay.textContent = `¡Haz clic en el botón para que hable, ${userName || 'invitado'}!`;
            welcomeMessageDisplay.className = "alert alert-info text-center";
            toggleResetButton(false); // Oculta el botón de reiniciar si no es la 3ra vez
        }

        // BUCLE: Muestra todas las frases disponibles (ejemplo de iteración con bucle for)
        // Se ejecuta solo la primera vez que se presiona el botón
        if (pressCount === 1) { 
            logToAppConsole("--- Frases disponibles (ejemplo de iteración con bucle for) ---", 'secondary');
            for (let i = 0; i < buttonPhrases.length; i++) {
                logToAppConsole(`Frase #${i + 1}: ${buttonPhrases[i]}`, 'secondary');
            }
            logToAppConsole("-------------------------------------------------", 'secondary');
        }

        saveDataToLocalStorage(); // Guarda el contador en localStorage
    }


});