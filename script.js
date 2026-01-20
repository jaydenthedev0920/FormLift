// ===== FORMLIFT MAIN SCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    const mainAppContent = document.getElementById('mainAppContent');
    if (mainAppContent) {
        mainAppContent.style.display = 'none';
        mainAppContent.classList.add('app-hidden');
    }

    initSplash();
    initNavTouchHack();
    initAuthModal();
    initVideoUpload();
});

/* ============================================================
   AUTH GATE — FIXED FOR iOS PWA
   ============================================================ */

function enforceAuthGate() {
    let user = localStorage.getItem('formliftUser');

    // iOS PWA returns "null" (string) instead of null
    if (user === "null" || user === "" || user === undefined || user === null) {
        user = null;
    }

    const authModal = document.getElementById('authModal');

    if (!user) {
        openAuthModal();

        // Disable navigation until logged in
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.disabled = true;
            btn.style.opacity = "0.4";
        });
    } else {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.disabled = false;
            btn.style.opacity = "1";
        });
    }
}

/* ============================================================
   SPLASH SCREEN — FIXED TIMING + NO POPPING
   ============================================================ */

function initSplash() {
    const splashScreen = document.getElementById('splashScreen');
    const mainAppContent = document.getElementById('mainAppContent');
    const particlesContainer = document.getElementById('splashParticles');
    const logoText = document.getElementById('logoText');

    if (!splashScreen || !mainAppContent) return;

    splashScreen.style.display = 'flex';
    splashScreen.classList.remove('splash-hidden');

    // Delay ring animation start slightly to avoid "pop"
    setTimeout(() => {
        document.querySelector('.rings-container').style.opacity = "1";
        document.querySelector('.rings-container').style.transform = "scale(0.5)";
    }, 50);

    // Particle burst after rings complete (~2.6s)
    setTimeout(() => {
        if (!particlesContainer) return;

        particlesContainer.innerHTML = '';
        const count = 24;
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'splash-particle';
            const angle = (i / count) * Math.PI * 2;
            const distance = 120 + Math.random() * 50;
            particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
            particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
            particle.style.left = '50%';
            particle.style.top = '50%';
            particlesContainer.appendChild(particle);
        }
    }, 2600);

    // Show logo text AFTER rings finish
    setTimeout(() => {
        if (logoText) {
            logoText.classList.add('show');
        }
    }, 3000);

    // Hide splash, show app
    setTimeout(() => {
        splashScreen.classList.add('splash-hidden');

        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainAppContent.style.display = 'block';
            mainAppContent.classList.remove('app-hidden');
            mainAppContent.classList.add('app-visible');

            // iOS PWA safety: ensure clicks are enabled
            document.body.style.pointerEvents = 'auto';

            // AUTH CHECK MUST RUN HERE FOR IOS PWA
            enforceAuthGate();

        }, 800);
    }, 5500);
}

/* ============================================================
   NAVIGATION — iOS PWA TOUCH FIX
   ============================================================ */

function initNavTouchHack() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('touchstart', () => {}, { passive: true });
    });
}

// Called from HTML onclick="showSection('home')"
function showSection(sectionKey) {
    const map = {
        home: 'home-section',
        workout: 'workout-section',
        formcheck: 'formcheck-section',
        history: 'history-section'
    };

    const targetId = map[sectionKey];
    if (!targetId) return;

    const sections = document.querySelectorAll('.content');
    sections.forEach(sec => {
        sec.classList.toggle('active', sec.id === targetId);
    });

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));

    navButtons.forEach(btn => {
        const text = btn.textContent.trim().toLowerCase();
        if (
            (sectionKey === 'home' && text === 'home') ||
            (sectionKey === 'workout' && text === 'workout') ||
            (sectionKey === 'formcheck' && text === 'form check') ||
            (sectionKey === 'history' && text === 'history')
        ) {
            btn.classList.add('active');
        }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================
   AUTH MODAL — WITH UNDERLINE FIX
   ============================================================ */

function initAuthModal() {
    const authModal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (!authModal) return;

    // Underline hover/click for auth links
    document.querySelectorAll('.switch-auth a').forEach(link => {
        link.style.cursor = "pointer";
        link.addEventListener('mouseenter', () => link.style.textDecoration = "underline");
        link.addEventListener('mouseleave', () => link.style.textDecoration = "none");
        link.addEventListener('touchstart', () => link.style.textDecoration = "underline", { passive: true });
    });

    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) closeAuthModal();
    });
}

function openAuthModal() {
    const authModal = document.getElementById('authModal');
    if (!authModal) return;
    authModal.classList.add('active');
}

function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    if (!authModal) return;
    authModal.classList.remove('active');
}

function switchToSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

function switchToLogin() {
    document.getElementById('signupForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!email || !password) {
        alert('Enter email and password');
        return;
    }

    localStorage.setItem('formliftUser', email);
    closeAuthModal();
    enforceAuthGate();
}

function handleSignup() {
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const confirm = document.getElementById('signupPasswordConfirm').value.trim();

    if (!email || !password || !confirm) {
        alert('Fill out all fields');
        return;
    }

    if (password !== confirm) {
        alert('Passwords do not match');
        return;
    }

    localStorage.setItem('formliftUser', email);
    closeAuthModal();
    enforceAuthGate();
}

/* ============================================================
   VIDEO UPLOAD
   ============================================================ */

function initVideoUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('videoInput');
    const videoPreview = document.getElementById('videoPreview');

    if (!uploadArea || !fileInput || !videoPreview) return;

    function handleFiles(files) {
        const file = files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        videoPreview.src = url;
        videoPreview.style.display = 'block';
    }

    uploadArea.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
    });
}

/* ============================================================
   WORKOUT GENERATOR (STUB)
   ============================================================ */

function generateWorkout() {
    const focus = document.getElementById('workoutFocus').value;
    const time = document.getElementById('workoutTime').value;
    const level = document.getElementById('experienceLevel').value;
    const equipment = document.getElementById('equipment').value;
    const result = document.getElementById('workoutResult');

    result.innerHTML = `
        <div class="exercise">
            <div class="exercise-name">${focus.toUpperCase()} Session</div>
            <div class="exercise-details">
                ${time} min • ${level} • ${equipment}
            </div>
        </div>
    `;

    const countEl = document.getElementById('workoutCount');
    countEl.textContent = parseInt(countEl.textContent) + 1;
}
