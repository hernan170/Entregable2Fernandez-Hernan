document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a Elementos del DOM ---
    const welcomeSection = document.getElementById('welcomeSection');
    const userNameInput = document.getElementById('userNameInput');
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
        "¿Necesitas algo?",
        "¡Vuelve pronto!"
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
     * Selecciona una frase aleatoria del array `buttonPhrases`.
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

    /**
     * Reinicia el contador de presiones.
     */
    function resetPressCount() {
        pressCount = 0;
        updatePressCountDisplay();
        saveDataToLocalStorage();
        phraseDisplay.textContent = "Contador reiniciado. ¡Hazme hablar de nuevo!";
        welcomeMessageDisplay.textContent = "¡Contador reiniciado! ¡Empieza de nuevo!";
        welcomeMessageDisplay.className = "alert alert-success text-center";
        logToAppConsole("Contador de interacciones reiniciado.", 'success');
        toggleResetButton(false); // Oculta el botón de reiniciar
    }

    /**
     * Gestiona la entrada del nombre de usuario.
     */
    function handleUserNameSubmit() {
        const inputName = userNameInput.value.trim();
        if (inputName) {
            userName = inputName;
            localStorage.setItem(LOCAL_STORAGE_USER_NAME_KEY, userName);
            welcomeMessageDisplay.textContent = `¡Hola, ${userName}! Haz clic en el botón para que hable.`;
            welcomeMessageDisplay.className = "alert alert-success text-center";
            logToAppConsole(`Usuario: <strong>${userName}</strong> ha iniciado la aplicación.`);
            
            // Oculta la sección de bienvenida y muestra la del botón
            welcomeSection.classList.add('d-none');
            talkingButtonSection.classList.remove('d-none');
        } else {
            welcomeMessageDisplay.textContent = "Por favor, ingresa un nombre válido.";
            welcomeMessageDisplay.className = "alert alert-warning text-center";
            logToAppConsole("ADVERTENCIA: Intento de inicio de sesión con nombre vacío.", 'warning');
        }
    }

    /**
     * Limpia el contenido de la consola de la aplicación.
     */
    function clearAppConsole() {
        appConsoleOutput.innerHTML = '<p><strong>Registro de Actividad:</strong></p>';
        logToAppConsole('Registro de actividad limpiado.', 'secondary');
    }

    // --- Gestión de LocalStorage ---

    /**
     * Carga el contador de presiones y el nombre de usuario desde localStorage.
     */
    function loadDataFromLocalStorage() {
        const storedCount = localStorage.getItem(LOCAL_STORAGE_PRESS_COUNT_KEY);
        const storedUserName = localStorage.getItem(LOCAL_STORAGE_USER_NAME_KEY);

        if (storedCount !== null) {
            pressCount = parseInt(storedCount);
            logToAppConsole(`Contador de presiones cargado desde LocalStorage: ${pressCount}.`);
        } else {
            logToAppConsole('Contador de presiones no encontrado en LocalStorage. Iniciando en 0.');
        }

        if (storedUserName) {
            userName = storedUserName;
            logToAppConsole(`Nombre de usuario cargado desde LocalStorage: <strong>${userName}</strong>.`);
            // Si el nombre ya está, saltamos la sección de bienvenida
            welcomeSection.classList.add('d-none');
            talkingButtonSection.classList.remove('d-none');
            welcomeMessageDisplay.textContent = `¡Bienvenido de nuevo, ${userName}! Haz clic en el botón.`;
            welcomeMessageDisplay.className = "alert alert-success text-center";
        } else {
            logToAppConsole('Nombre de usuario no encontrado en LocalStorage. Pidiendo nombre.');
            welcomeSection.classList.remove('d-none'); // Asegura que la sección de bienvenida esté visible
            talkingButtonSection.classList.add('d-none'); // Asegura que la sección del botón esté oculta
        }
        updatePressCountDisplay(); // Actualiza el display del contador al cargar
    }

    /**
     * Guarda el contador de presiones y el nombre de usuario en localStorage.
     */
    function saveDataToLocalStorage() {
        localStorage.setItem(LOCAL_STORAGE_PRESS_COUNT_KEY, pressCount.toString());
        // El nombre de usuario ya se guarda al enviarlo
        logToAppConsole('Datos guardados en LocalStorage.', 'info');
    }

    // --- Event Listeners ---
    submitUserNameButton.addEventListener('click', handleUserNameSubmit);
    userNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserNameSubmit();
        }
    });
    talkingButton.addEventListener('click', activateButton);
    resetCountButton.addEventListener('click', resetPressCount);
    btnClearConsole.addEventListener('click', clearAppConsole);

    // --- Inicialización de la Aplicación ---
    loadDataFromLocalStorage(); // Carga los datos al iniciar
    logToAppConsole("Aplicación 'Simulador de Botón Parlante' cargada y lista.");
});