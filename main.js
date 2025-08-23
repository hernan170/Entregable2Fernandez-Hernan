document.addEventListener('DOMContentLoaded', async () => {

    // === Referencias y Constantes ===
    const [canvas, menuButton, sidenav, closeBtn, mainContent] =
        ['starfield', 'menu-button', 'mySidenav', 'closeBtn', 'main-content']
        .map(id => document.getElementById(id));

    let ctx = null;
    let stars = [];
    let planetsData = [];

    // === Lógica del Fondo Estelar ===
    const initStars = num => {
        if (!canvas || !ctx) return;
        stars = Array.from({ length: num }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2.5 + 0.5,
            speed: Math.random() * 0.5 + 0.1,
            color: ['#ADD8E6', '#FFFFFF', '#B0E0E6'][Math.floor(Math.random() * 3)]
        }));
    };

    const drawStars = () => {
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            star.x -= star.speed;
            if (star.x < 0) star.x = canvas.width;
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
        initStars(800);
    };

    // === Lógica del Menú y Navegación ===
    const toggleNav = isOpen => {
        const width = isOpen ? "250px" : "0";
        if (sidenav) sidenav.style.width = width;
    };

    const fetchPlanetsData = async () => {
        try {
            const response = await fetch('mainpackage.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            Swal.fire({ icon: 'error', title: 'Error', text: `No se pudo cargar: ${error.message}` });
            return [];
        }
    };

    const views = {
        '#home': `
            <section id="home" class="view-section">
                <h2>Bienvenido a la Central de Viajes Estelares</h2>
                <p>Descubre destinos y planifica tu próxima aventura galáctica.</p>
            </section>`,
        '#about': `
            <section id="about" class="view-section">
                <h2>Acerca de Nosotros</h2>
                <p>Empresa dedicada a la simulación de viajes interestelares.</p>
            </section>`
    };

    const renderSimulator = (planets) => {
        const lastDistance = localStorage.getItem('lastTravelDistance') || '';
        const lastSpeed = localStorage.getItem('lastTravelSpeed') || '50';
        const options = planets.map(p => `<option value="${p.distance}">${p.name} (${p.distance} años luz)</option>`).join('');
        mainContent.innerHTML = `
            <section id="simulator" class="view-section">
                <h2>Simulador de Viajes</h2>
                <form id="simulator-form" class="simulator-form">
                    <label>Selecciona un destino:</label>
                    <select id="planet-select" class="form-control">
                        <option value="">-- O elige una opción --</option>
                        ${options}
                    </select>
                    <label>O ingresa la distancia (años luz):</label>
                    <input type="number" id="distance-input" class="form-control" value="${lastDistance}" min="0">
                    <label>Velocidad de la nave (% de la luz):</label>
                    <input type="number" id="speed-input" class="form-control" value="${lastSpeed}" min="1" max="100">
                    <button type="submit">Calcular Viaje</button>
                </form>
                <div id="result-container" class="result-container" style="display:none;">
                    <h3>Resultado del Viaje</h3>
                    <p id="result-text"></p>
                </div>
            </section>
        `;
        const form = document.getElementById('simulator-form');
        const planetSelect = document.getElementById('planet-select');
        const distanceInput = document.getElementById('distance-input');

        // Lógica para que los dos inputs no sean simultáneos
        planetSelect.addEventListener('change', () => {
            if (planetSelect.value) {
                distanceInput.disabled = true;
                distanceInput.value = '';
            } else {
                distanceInput.disabled = false;
            }
        });
        distanceInput.addEventListener('input', () => {
            if (distanceInput.value) {
                planetSelect.disabled = true;
                planetSelect.value = '';
            } else {
                planetSelect.disabled = false;
            }
        });
        
        if (form) form.addEventListener('submit', handleSimulatorSubmit);
    };

    const handleSimulatorSubmit = event => {
        event.preventDefault();
        const [planetSelect, distanceInput, speedInput] =
            ['planet-select', 'distance-input', 'speed-input'].map(id => document.getElementById(id));
        
        const selectedDistance = planetSelect.value ? parseFloat(planetSelect.value) : null;
        const enteredDistance = distanceInput.value ? parseFloat(distanceInput.value) : null;
        
        const distance = selectedDistance || enteredDistance;
        const speed = parseFloat(speedInput.value) / 100;

        if (isNaN(distance) || distance <= 0 || isNaN(speed) || speed <= 0 || speed > 1) {
            Swal.fire({ 
                icon: 'warning', 
                title: 'Datos Inválidos', 
                text: 'Por favor, ingrese valores numéricos y positivos. La velocidad debe ser entre 1 y 100.' 
            });
            return;
        }

        localStorage.setItem('lastTravelDistance', distance);
        localStorage.setItem('lastTravelSpeed', speedInput.value);
        
        const travelTime = (distance / speed).toFixed(2);
        
        const [resultContainer, resultText] =
            ['result-container', 'result-text'].map(id => document.getElementById(id));
        
        resultText.textContent = `El viaje duraría aproximadamente ${travelTime} años terrestres.`;
        resultContainer.style.display = 'block';
    };

    const navigate = hash => {
        toggleNav(false);
        if (hash === '#simulator') {
            renderSimulator(planetsData);
        } else {
            mainContent.innerHTML = views[hash] || views['#home'];
        }
    };

    // === Inicialización de la Aplicación ===
    const initApp = async () => {
        planetsData = await fetchPlanetsData();
        if (canvas) {
            ctx = canvas.getContext('2d');
            resizeCanvas();
            drawStars();
        } else {
            Swal.fire({ icon: 'error', title: '¡Oops!', text: "El canvas no se encontró." });
        }
        
        window.addEventListener('hashchange', () => navigate(window.location.hash));
        menuButton?.addEventListener('click', () => toggleNav(true));
        closeBtn?.addEventListener('click', () => toggleNav(false));
        window.addEventListener('resize', resizeCanvas);
        document.querySelectorAll('.sidenav a').forEach(link =>
            link.addEventListener('click', e => {
                e.preventDefault();
                window.location.hash = e.currentTarget.getAttribute('href');
            })
        );
        navigate(window.location.hash || '#home');
    };

    initApp();
});