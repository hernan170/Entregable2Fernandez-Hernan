document.addEventListener('DOMContentLoaded', async () => {

    // === Referencias y Variables ===
    const [canvas, menuButton, sidenav, closeBtn, mainContent] = 
        ['starfield', 'menu-button', 'mySidenav', 'closebtn', 'main-content']
        .map(id => document.getElementById(id));
    const navLinks = document.querySelectorAll('.sidenav a');

    let ctx = null;
    let stars = [];
    const numStars = 800;
    const starColors = ['#ADD8E6', '#1c1313ff', '#B0E0E6'];
    let planetsData = [];

    // === Lógica del Fondo de Estrellas ===
    const initStars = num => {
        if (!canvas || !ctx) return;
        stars = Array.from({ length: num }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2.5 + 0.5,
            speed: Math.random() * 0.5 + 0.1,
            color: starColors[Math.floor(Math.random() * starColors.length)]
        }));
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
        requestAnimationFrame(drawStars);
    };

    const resizeCanvas = () => {
        if (!canvas) return;
        [canvas.width, canvas.height] = [window.innerWidth, window.innerHeight];
        initStars(numStars);
    };

    // === Lógica del Menú Lateral ===
    const toggleNav = (isOpen) => {
        const width = isOpen ? "250px" : "0";
        const marginLeft = (isOpen && window.innerWidth >= 768) ? "250px" : "0";
        
        if (sidenav) sidenav.style.width = width;
        if (mainContent && window.innerWidth >= 768) mainContent.style.marginLeft = marginLeft;
    };

    // === Lógica del Simulador ===
    const fetchPlanetsData = async () => {
        try {
            const response = await fetch('./mainpackage.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Carga',
                text: `No se pudo cargar la base de datos de planetas. Detalle: ${error.message}`,
                background: '#0a0a2a',
                color: '#fff'
            });
            return [];
        }
    };
    
    const calculateTravelTime = (distance, speed) => distance / speed;
    const saveLastDistance = distance => localStorage.setItem('lastTravelDistance', distance);
    const getLastDistance = () => localStorage.getItem('lastTravelDistance');

    const handleSimulatorSubmit = (event) => {
        event.preventDefault();
        const [planetSelect, distanceInput, speedInput] = 
            ['planet-select', 'distance-input', 'speed-input'].map(id => document.getElementById(id));
        
        const distance = parseFloat(distanceInput.value) || parseFloat(planetSelect.value);
        const speedPercentage = parseFloat(speedInput.value);

        if (isNaN(distance) || distance <= 0 || isNaN(speedPercentage) || speedPercentage <= 0) {
            return Swal.fire({
                icon: 'warning',
                title: 'Datos Inválidos',
                text: 'Por favor, ingrese valores numéricos positivos.',
                background: '#0a0a2a',
                color: '#fff'
            });
        }

        saveLastDistance(distance);
        const travelTimeYears = calculateTravelTime(distance, speedPercentage / 100);
        
        const resultContainer = document.getElementById('result-container');
        const resultText = document.getElementById('result-text');
        
        resultText.textContent = `El viaje duraría aproximadamente ${travelTimeYears.toFixed(2)} años terrestres.`;
        resultContainer.style.display = 'block';
    };

    // === Vistas Dinámicas ===
    const homeView = `
        <section class="view-section" id="home">
            <h2>Bienvenido a la Central de Viajes Estelares</h2>
            <p>Descubre los destinos más fascinantes del universo y utiliza nuestro simulador para planificar tu próxima aventura galáctica.</p>
        </section>
    `;
    const aboutView = `
        <section class="view-section" id="about">
            <h2>Acerca de Nosotros</h2>
            <p>Somos una empresa dedicada a la simulación de viajes interestelares.</p>
        </section>
    `;
    const simulatorView = (planets) => {
        const lastDistance = getLastDistance();
        const optionsHtml = planets.map(p => `<option value="${p.distance}">${p.name} (${p.distance} años luz)</option>`).join('');
        return `
            <section class="view-section" id="simulator">
                <h2>Simulador de Viajes</h2>
                <form class="simulator-form" id="simulator-form">
                    <label for="planet-select">Selecciona un destino:</label>
                    <select id="planet-select">${optionsHtml}</select>
                    <label for="distance-input">O ingresa la distancia:</label>
                    <input type="number" id="distance-input" placeholder="Distancia en años luz" value="${lastDistance || ''}" min="0">
                    <label for="speed-input">Velocidad de la nave (% de la luz):</label>
                    <input type="number" id="speed-input" placeholder="Ej: 50" value="50" min="1" max="100">
                    <button type="submit">Calcular Viaje</button>
                </form>
                <div id="result-container" style="display:none;">
                    <h3>Resultado del Viaje</h3>
                    <p id="result-text"></p>
                </div>
            </section>
        `;
    };

    const routes = {
        '#home': { template: () => homeView },
        '#simulator': {
            template: () => simulatorView(planetsData),
            onRender: () => {
                const form = document.getElementById('simulator-form');
                if (form) form.addEventListener('submit', handleSimulatorSubmit);
            }
        },
        '#about': { template: () => aboutView },
        '': { template: () => homeView }
    };

    const navigate = (hash) => {
        toggleNav(false);
        const route = routes[hash] || routes[''];
        mainContent.innerHTML = route.template();
        if (route.onRender) route.onRender();
    };

    // === Inicialización ===
    planetsData = await fetchPlanetsData();
    if (canvas) {
        ctx = canvas.getContext('2d');
        resizeCanvas();
        drawStars();
    } else {
        Swal.fire({
            icon: 'error',
            title: '¡Oops!',
            text: "No se pudo cargar el fondo estelar.",
            background: '#0a0a2a',
            color: '#fff'
        });
    }

    window.addEventListener('hashchange', () => navigate(window.location.hash));
    menuButton?.addEventListener('click', () => toggleNav(true));
    closeBtn?.addEventListener('click', () => toggleNav(false));
    window.addEventListener('resize', resizeCanvas);
    navLinks.forEach(link => link.addEventListener('click', e => {
        e.preventDefault();
        window.location.hash = e.currentTarget.getAttribute('href');
    }));

    navigate(window.location.hash || '#home');
});