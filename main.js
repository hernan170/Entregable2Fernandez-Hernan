
const talkingButton = document.getElementById('talkingButton');

const buttonPhrases = [
    "Hola, ¿cómo estás?",
    "¡Qué gusto verte!",
    "Este es un botón parlante.",
    "Que tengas un excelente día.",
    "¿Necesitas algo ?",
    "¡Volve pronto!"
];

let pressCount = 0;

function getRandomPhrase() {
    const randomIndex = Math.floor(Math.random() * buttonPhrases.length);
    return buttonPhrases[randomIndex];
}

function activateButton() {
    pressCount++;

    const phraseToSay = getRandomPhrase(); 

    alert(phraseToSay);

    console.log(`Botón presionado. Frase: "${phraseToSay}"`);
    console.log(`Veces presionado: ${pressCount}`);

    if (pressCount === 3) {
        const resetConfirmed = confirm("¡Has presionado el botón 3 veces! ¿Quieres reiniciar el contador?");
        if (resetConfirmed) {
            pressCount = 0; 
            alert("¡Contador reiniciado!");
            console.log("El contador de interacciones ha sido reiniciado.");
        }
    } else if (pressCount % 5 === 0) {
        
        console.warn("¡Llevas " + pressCount + " interacciones! ¡Sigue así!");
    }

    if (pressCount === 1) { 
        console.log("\n--- Frases disponibles (ejemplo de iteración) ---");
        for (let i = 0; i < buttonPhrases.length; i++) {
            console.log(`Frase #${i + 1}: ${buttonPhrases[i]}`);
        }
        console.log("-------------------------------------------------");
    }
}

talkingButton.addEventListener('click', activateButton);

const userName = prompt("¡Bienvenido al simulador de botón parlante! ¿Cuál es tu nombre?");
if (userName) {
    alert(`¡Hola, ${userName}! Haz clic en el botón para que hable.`);
    console.log(`Usuario: ${userName} ha iniciado la aplicación.`);
} else {
    alert("¡Hola! Haz clic en el botón para que hable.");
    console.log("Usuario anónimo ha iniciado la aplicación.");
}


console.log("Simulador de Botón Parlante cargado y listo.");