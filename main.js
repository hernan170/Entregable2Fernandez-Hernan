document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias a elementos del DOM ---
    const canvas = document.getElementById('starfield');
    const menuButton = document.getElementById('menu-button');
    const sidenav = document.getElementById('mySidenav');
    const closeBtn = document.getElementById('closebtn');
    const mainContent = document.getElementById('main-content');

    // --- Lógica del Fondo de Estrellas ---
    let ctx = null; // Contexto del canvas
    let stars = []; // Array para almacenar las estrellas
    const numStars = 800; // Número de estrellas
    const starColors = ['#ADD8E6', '#FFFFFF', '#B0E0E6']; // Colores: Celeste, Blanco, Azul claro

    /**
     * Inicializa el array de estrellas con posiciones, tamaños, velocidades y colores aleatorios.
     * Se llama al inicio y cada vez que el canvas es redimensionado.
     */
    function initStars() {
        if (!canvas || !ctx) return; // Asegurarse de que el canvas y el contexto existan
        stars = []; // Limpia las estrellas existentes
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2.5 + 0.5, // Tamaño entre 0.5 y 3
                speed: Math.random() * 0.5 + 0.1, // Velocidad entre 0.1 y 0.6
                color: starColors[Math.floor(Math.random() * starColors.length)] // Asigna un color aleatorio de la lista
            });
        }
    }

    /**
     * Dibuja todas las estrellas en el canvas y actualiza sus posiciones.
     */
    function drawStars() {
        if (!canvas || !ctx) return; // Asegurarse de que el canvas y el contexto existan
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpia el frame anterior

        // BUCLE: Itera sobre cada estrella para dibujarla y actualizar su posición
        stars.forEach(star => {
            star.x -= star.speed; // Mueve la estrella hacia la izquierda
            // Si la estrella sale por el borde izquierdo, la teletransporta al borde derecho
            if (star.x < 0) {
                star.x = canvas.width; // Reaparece al lado derecho
                star.y = Math.random() * canvas.height; // Nueva posición Y aleatoria
                star.color = starColors[Math.floor(Math.random() * starColors.length)]; // Nuevo color aleatorio
            }

            // Dibuja la estrella como un círculo
            ctx.beginPath(); // Inicia un nuevo camino de dibujo
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2); // Dibuja un círculo
            ctx.fillStyle = star.color; // Aplica el color de la estrella
            ctx.fill(); // Rellena el círculo
        });
    }

    /**
     * La función principal de animación que se llama en cada frame.
     * Utiliza requestAnimationFrame para una animación fluida y optimizada.
     */
    function animate() {
        drawStars(); // Dibuja las estrellas y las mueve
        requestAnimationFrame(animate); // Solicita el siguiente frame de animación
    }

    /**
     * Ajusta las dimensiones del canvas para que coincidan con las de la ventana del navegador.
     * Luego, reinicializa las estrellas para que se distribuyan por el nuevo tamaño.
     */
    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars(); // Reinicializa las estrellas para que se adapten al nuevo tamaño
    }

    // --- Lógica del Menú Lateral (Sidenav) ---

    /**
     * Abre el menú lateral.
     * Modifica el ancho del menú y el margen del contenido principal.
     */
    function openNav() {
        if (sidenav) {
            sidenav.style.width = "250px"; // Ancho del menú abierto
        }
        // Empuja el contenido principal a la derecha solo en pantallas grandes
        if (mainContent && window.innerWidth >= 768) {
            mainContent.style.marginLeft = "250px";
        }
    }

    /**
     * Cierra el menú lateral.
     * Restablece el ancho del menú y el margen del contenido principal.
     */
    function closeNav() {
        if (sidenav) {
            sidenav.style.width = "0"; // Cierra el menú
        }
        // Regresa el contenido principal a su posición original
        if (mainContent && window.innerWidth >= 768) {
            mainContent.style.marginLeft = "0";
        }
    }

    // --- Event Listeners ---
    // Asegurarse de que los elementos existan antes de añadir listeners
    if (menuButton) {
        menuButton.addEventListener('click', openNav);
    }
    if (closeBtn) {
        closeBtn.addEventListener('click', closeNav);
    }

    // Event listener para redimensionamiento de ventana para el canvas
    window.addEventListener('resize', resizeCanvas);

    // --- Inicialización al cargar el DOM ---
    // Se ejecuta cuando el HTML está completamente cargado y parseado
    if (canvas) {
        ctx = canvas.getContext('2d'); // Obtener el contexto del canvas
        resizeCanvas(); // Establecer el tamaño inicial del canvas y las estrellas
        animate(); // Iniciar el bucle de animación
    } else {
        console.error("El elemento canvas con ID 'starfield' no se encontró en el DOM.");
    }
});