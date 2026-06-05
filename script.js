/* ════════════════════════════════════════════════════════
   CRISTHIAN CASTRO – PORTFOLIO PERSONAL
   script.js  |  Animaciones, partículas y efectos
   ════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   1. SISTEMA DE PARTÍCULAS EN CANVAS
   Genera puntos flotantes y líneas conectoras
   con temática tecnológica (fondo del sitio)
   ───────────────────────────────────────── */
(function initParticles() {
  const canvas  = document.getElementById('particles-canvas');
  const ctx     = canvas.getContext('2d');

  // Configuración de partículas
  const CONFIG = {
    count:        80,          // Cantidad de partículas
    color:        '#00d4ff',   // Color neón
    lineColor:    'rgba(0, 212, 255, 0.08)',  // Color de conexión
    maxDist:      140,         // Distancia máxima para dibujar línea
    speed:        0.4,         // Velocidad de movimiento
    minSize:      1,
    maxSize:      2.5,
    opacity:      0.45,
  };

  let particles = [];
  let W, H;

  /** Ajusta el canvas al tamaño de la ventana */
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  /** Crea una partícula con posición y velocidad aleatoria */
  function createParticle() {
    return {
      x:   Math.random() * W,
      y:   Math.random() * H,
      vx:  (Math.random() - 0.5) * CONFIG.speed,
      vy:  (Math.random() - 0.5) * CONFIG.speed,
      r:   CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize),
    };
  }

  /** Inicializa el arreglo de partículas */
  function initParticlesArr() {
    particles = [];
    for (let i = 0; i < CONFIG.count; i++) {
      particles.push(createParticle());
    }
  }

  /** Loop principal de animación */
  function animate() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      // Mover partícula
      p.x += p.vx;
      p.y += p.vy;

      // Rebotar en los bordes
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Dibujar punto
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 212, 255, ${CONFIG.opacity})`;
      ctx.fill();

      // Dibujar líneas entre partículas cercanas
      for (let j = i + 1; j < particles.length; j++) {
        const q    = particles[j];
        const dx   = p.x - q.x;
        const dy   = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONFIG.maxDist) {
          // Opacidad proporcional a la cercanía
          const alpha = (1 - dist / CONFIG.maxDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(animate);
  }

  // Arrancar sistema de partículas
  resize();
  initParticlesArr();
  animate();
  window.addEventListener('resize', () => { resize(); initParticlesArr(); });
})();


/* ─────────────────────────────────────────
   2. NAVBAR: scroll + menú hamburguesa
   ───────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const toggle    = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');
  const links     = document.querySelectorAll('.nav-link');

  // Agrega clase 'scrolled' al hacer scroll
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    highlightActiveSection();
  });

  // Abrir/cerrar menú en móviles
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Cerrar menú al hacer clic en un link
  links.forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  /** Resalta el link de la sección actualmente visible */
  function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY  = window.scrollY + 100;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-link[href="#${id}"]`);

      if (!link) return;

      if (scrollY >= top && scrollY < top + height) {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }
})();


/* ─────────────────────────────────────────
   3. EFECTO TYPEWRITER (texto animado)
   Muestra distintos roles del desarrollador
   ───────────────────────────────────────── */
(function initTypewriter() {
  const el      = document.getElementById('typewriter-text');
  const phrases = [
    'Estudiante de Sistemas',
    'Futuro Desarrollador',
    'Apasionado por el Código',
    'Programador en Formación',
  ];

  let phraseIndex  = 0;
  let charIndex    = 0;
  let isDeleting   = false;
  const SPEED_TYPE = 90;   // ms por carácter al escribir
  const SPEED_DEL  = 45;   // ms por carácter al borrar
  const PAUSE      = 2000; // ms de pausa al completar

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? SPEED_DEL : SPEED_TYPE;

    if (!isDeleting && charIndex === current.length) {
      // Terminó de escribir → pausa
      delay = PAUSE;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Terminó de borrar → siguiente frase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }

    setTimeout(type, delay);
  }

  type();
})();


/* ─────────────────────────────────────────
   4. SCROLL REVEAL – aparición de elementos
   ───────────────────────────────────────── */
(function initScrollReveal() {
  // Agrega la clase 'reveal' a todos los elementos que deben animarse
  const targets = [
    '.glass-card',
    '.hobby-card',
    '.timeline-item',
    '.contact-card',
    '.hero-content > *',
  ];

  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add('reveal');
    });
  });

  // Observador de visibilidad
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Solo anima una vez
      }
    });
  }, {
    threshold: 0.12,  // 12% visible para activar
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────
   5. BARRAS DE HABILIDADES ANIMADAS
   Se activan cuando entran al viewport
   ───────────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const width  = target.getAttribute('data-width');
        target.style.width = width + '%';
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  fills.forEach(fill => observer.observe(fill));
})();


/* ─────────────────────────────────────────
   6. EFECTO PARALLAX SUAVE en el hero
   La foto se mueve ligeramente al mover el mouse
   ───────────────────────────────────────── */
(function initParallax() {
  const wrapper = document.querySelector('.hero-photo-wrapper');
  if (!wrapper) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx; // -1 a 1
    const dy = (e.clientY - cy) / cy; // -1 a 1

    const moveX = dx * 10;
    const moveY = dy * 10;

    wrapper.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  // Volver al centro al salir del área
  document.addEventListener('mouseleave', () => {
    wrapper.style.transform = 'translate(0, 0)';
  });

  wrapper.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
})();


/* ─────────────────────────────────────────
   7. SMOOTH SCROLL personalizado
   Compensa el alto del navbar fijo
   ───────────────────────────────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      const navH   = document.getElementById('navbar').offsetHeight;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH - 10;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ─────────────────────────────────────────
   8. CONTADOR ANIMADO en chips de estadística
   (Listo para futuro uso si agregas números)
   ───────────────────────────────────────── */
function animateCounter(el, from, to, duration) {
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(from + (to - from) * progress);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}


/* ─────────────────────────────────────────
   9. EFECTO HOVER 3D en tarjetas
   Inclina la tarjeta según la posición del mouse
   ───────────────────────────────────────── */
(function initCard3D() {
  document.querySelectorAll('.hobby-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);

      card.style.transform = `
        translateY(-6px)
        rotateX(${-dy * 6}deg)
        rotateY(${dx * 6}deg)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });

    card.style.transition = 'transform 0.2s ease, box-shadow 0.3s ease, border-color 0.3s ease';
    card.style.transformStyle = 'preserve-3d';
  });
})();


/* ─────────────────────────────────────────
   10. LOG DE CONSOLA (marca personal)
   ───────────────────────────────────────── */
console.log('%c⚡ Cristhian Castro – Portfolio', 'color:#00d4ff;font-size:1.2rem;font-weight:bold;');
console.log('%cDesarrollado con HTML5 · CSS3 · JavaScript', 'color:#6a8ab0;font-size:0.9rem;');
