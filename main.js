document.addEventListener('DOMContentLoaded', () => {


    // --- Referencias a elementos del DOM ---
    const canvas = document.getElementById('starfield');
    const menuButton = document.getElementById('menu-button');
    const sidenav = document.getElementById('mySidenav');
    const closeBtn = document.getElementById('closebtn');
    const mainContent = document.getElementById('main-content');
    const navLinks = document.querySelectorAll('.sidenav a, header h1');

    // --- Variables globales y datos (simulados en JSON) ---
    let ctx = null;
    let stars = [];
    const numStars = 800;
    const starColors = ['#ADD8E6', '#FFFFFF', '#B0E0E6'];
    let planetsData = [];

    // ======================================================================================================
    // === LÓGICA DEL FONDO DE ESTRELLAS (ANIMACIÓN) ========================================================
    // ======================================================================================================

    /**
     * @param {number} num - Número de estrellas a generar.
     */
    const initStars = (num) => {
        if (!canvas || !ctx) return;
        stars = [];
        for (let i = 0; i < num; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2.5 + 0.5,
                speed: Math.random() * 0.5 + 0.1,
                color: starColors[Math.floor(Math.random() * starColors.length)]
            });
        }
    };

    const drawStars = () => {
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            star.x -= star.speed;
            if (star.x < 0) {
                star.x = canvas.width;
                star.y = Math.random() * canvas.height;
                star.color = starColors[Math.floor(Math.random() * starColors.length)];
            }
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.fill();
        });
    };

    const animate = () => {
        drawStars();
        requestAnimationFrame(animate);
    };

    const resizeCanvas = () => {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initStars(numStars);
    };

    // ======================================================================================================
    // === LÓGICA DEL MENÚ LATERAL (SIDEBAR) ================================================================
    // ======================================================================================================

    const openNav = () => {
        if (sidenav) sidenav.style.width = "250px";
        if (mainContent && window.innerWidth >= 768) mainContent.style.marginLeft = "250px";
    };

    const closeNav = () => {
        if (sidenav) sidenav.style.width = "0";
        if (mainContent && window.innerWidth >= 768) mainContent.style.marginLeft = "0";
    };

    // ======================================================================================================
    // === LÓGICA DEL SIMULADOR Y NAVEGACIÓN (SPA) ==========================================================
    // ======================================================================================================

    /**
     * Carga los datos de planetas desde el archivo JSON de forma asíncrona.
     * @returns {Promise<Array>} Un array de objetos con los datos de los planetas.
     */
    const fetchPlanetsData = async () => {
        try {
            const response = await fetch('./package.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Carga',
                text: `No se pudo cargar la base de datos de planetas. Detalle: ${error.message}`,
                background: '#0a0a2a',
                color: '#fff'
            });
            return []; // Retorna un array vacío si hay un error
        }
    };

    const calculateTravelTime = (distance, speed) => {
        return distance / speed;
    };

    const saveLastDistance = (distance) => {
        localStorage.setItem('lastTravelDistance', distance);
    };

    const getLastDistance = () => {
        return localStorage.getItem('lastTravelDistance');
    };

    // Vistas para el enrutamiento (HTML generado dinámicamente)
    const homeView = `
        <section class="view-section" id="home">
            <h2>Bienvenido a la Central de Viajes Estelares</h2>
            <p>Descubre los destinos más fascinantes del universo y utiliza nuestro simulador para planificar tu próxima aventura galáctica.</p>
            <p>Nuestra tecnología de vanguardia te permite calcular el tiempo de viaje a los planetas más lejanos, considerando la velocidad de tu nave y la distancia a recorrer. ¿Estás listo para explorar?</p>
        </section>
    `;

    const aboutView = `
        <section class="view-section" id="about">
            <h2>Acerca de Nosotros</h2>
            <p>Somos una empresa dedicada a la simulación de viajes interestelares, con la misión de acercar el cosmos a la imaginación de todos. Nuestro equipo de ingenieros y astrónomos virtuales trabaja para ofrecerte la experiencia más realista posible desde la comodidad de tu navegador.</p>
            <p>Con tecnología avanzada y datos precisos, nuestro simulador te brinda una ventana al universo. ¡Explora sin límites!</p>
        </section>
    `;
    
    // Función que genera la vista del simulador, incluyendo el formulario
    const simulatorView = (planets) => {
        const lastDistance = getLastDistance(); // Carga la última distancia guardada
        const optionsHtml = planets.map(planet => 
            `<option value="${planet.distance}">${planet.name} (${planet.distance} años luz)</option>`
        ).join('');
        
        return `
            <section class="view-section" id="simulator">
                <h2>Simulador de Viajes</h2>
                <form class="simulator-form" id="simulator-form">
                    <label for="planet-select">Selecciona un destino:</label>
                    <select id="planet-select">
                        ${optionsHtml}
                    </select>
                    
                    <label for="distance-input">O ingresa la distancia en años luz:</label>
                    <input type="number" id="distance-input" placeholder="Distancia en años luz" value="${lastDistance || ''}" min="0">
                    
                    <label for="speed-input">Velocidad de la nave (en % de la velocidad de la luz):</label>
                    <input type="number" id="speed-input" placeholder="Ej: 50 (50%)" value="50" min="1" max="100">
                    
                    <button type="submit">Calcular Viaje</button>
                </form>
                <div id="result-container" style="display:none;">
                    <h3>Resultado del Viaje</h3>
                    <p id="result-text"></p>
                </div>
            </section>
        `;
    };

    const handleSimulatorSubmit = (event) => {
        event.preventDefault();
        
        const planetSelect = document.getElementById('planet-select');
        const distanceInput = document.getElementById('distance-input');
        const speedInput = document.getElementById('speed-input');

        const distance = parseFloat(distanceInput.value) || parseFloat(planetSelect.value);
        const speedPercentage = parseFloat(speedInput.value);

        if (isNaN(distance) || isNaN(speedPercentage) || distance <= 0 || speedPercentage <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Datos Inválidos',
                text: 'Por favor, ingresa valores numéricos positivos para la distancia y la velocidad.',
                background: '#0a0a2a',
                color: '#fff'
            });
            return;
        }

        saveLastDistance(distance); // Guarda la última distancia

        const travelTimeYears = calculateTravelTime(distance, speedPercentage / 100);
        const resultContainer = document.getElementById('result-container');
        const resultText = document.getElementById('result-text');

        resultText.textContent = `El viaje duraría aproximadamente ${travelTimeYears.toFixed(2)} años terrestres.`;
        resultContainer.style.display = 'block';
    };

    const routes = {
        '#home': {
            template: homeView,
            onRender: () => {}
        },
        '#simulator': {
            template: () => simulatorView(planetsData),
            onRender: () => {
                const simulatorForm = document.getElementById('simulator-form');
                if (simulatorForm) {
                    simulatorForm.addEventListener('submit', handleSimulatorSubmit);
                }
                const planetSelect = document.getElementById('planet-select');
                if (planetSelect) {
                    const distanceInput = document.getElementById('distance-input');
                    planetSelect.addEventListener('change', (e) => {
                        if (e.target.value) {
                            distanceInput.value = ''; // Borra el input si se selecciona un planeta
                        }
                    });
                    distanceInput.addEventListener('input', (e) => {
                        if (e.target.value) {
                            planetSelect.value = ''; // Deselecciona el planeta si se ingresa una distancia manual
                        }
                    });
                }
            }
        },
        '#about': {
            template: aboutView,
            onRender: () => {}
        },
        '': {
            template: homeView,
            onRender: () => routes['#home'].onRender()
        }
    };

    const navigate = (hash) => {
        closeNav(); // Cierra el menú al navegar
        const route = routes[hash] || routes[''];
        mainContent.innerHTML = route.template();
        if (route.onRender) {
            route.onRender();
        }

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === hash) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

  // ======================================================================================================
// === INICIALIZACIÓN DE LA APLICACIÓN ==================================================================
// ======================================================================================================

const initApp = async () => {
    // 1. Cargar los datos de planetas antes de renderizar la vista del simulador
    planetsData = await fetchPlanetsData();
    
    // 2. Inicializar el canvas y la animación de estrellas
    if (canvas) {
        ctx = canvas.getContext('2d');
        resizeCanvas();
        animate();
    } else {
        Swal.fire({
            icon: 'error',
            title: '¡Oops!',
            text: "No se pudo cargar el fondo estelar. El elemento 'canvas' no se encontró en la página.",
            background: '#0a0a2a',
            color: '#fff'
        });
    }

    // 3. Manejar el enrutamiento de la SPA
    window.addEventListener('hashchange', () => navigate(window.location.hash));

    // A diferencia de la versión anterior, ahora solo seleccionamos los enlaces del menú lateral
    // para evitar el error con el h1.
    const menuLinks = document.querySelectorAll('.sidenav a');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = e.currentTarget.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault(); // Evita el comportamiento predeterminado del enlace
                window.location.hash = href; // Cambia el hash para la navegación
            }
        });
    });

    // 4. Configurar eventos de los botones del menú y resize
    if (menuButton) menuButton.addEventListener('click', openNav);
    if (closeBtn) closeBtn.addEventListener('click', closeNav);
    window.addEventListener('resize', resizeCanvas);
    
    // 5. Renderizar la vista inicial
    navigate(window.location.hash);
};

initApp();
});