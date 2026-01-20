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
    enforceAuthGate();
});

/* ===== AUTH GATE ===== */
/* If no "formliftUser" in localStorage → force auth modal open */

function enforceAuthGate() {
    const user = localStorage.getItem('formliftUser');
    const authModal = document.getElementById('authModal');

    if (!user && authModal) {
        openAuthModal();
    }
}

/* ===== SPLASH SCREEN ===== */

function initSplash() {
    const splashScreen = document.getElementById('splashScreen');
    const mainAppContent = document.getElementById('mainAppContent');
    const particlesContainer = document.getElementById('splashParticles');
    const logoText = document.getElementById('logoText');

    if (!splashScreen || !mainAppContent) return;

    splashScreen.style.display = 'flex';
    splashScreen.classList.remove('splash-hidden');

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

    // Show logo text
    setTimeout(() => {
        if (logoText) {
            logoText.classList.add('show');
        }
    }, 2800);

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
        }, 800);
    }, 5200);
}

/* ===== NAVIGATION (INLINE HANDLERS + iOS TOUCH FIX) ===== */

function initNavTouchHack() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        // iOS PWA: ensure element is treated as interactive
        btn.addEventListener('touchstart', () => {}, { passive: true });
    });
}

// Called from HTML: onclick="showSection('home')" etc.
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
        if (sec.id === targetId) {
            sec.classList.add('active');
        } else {
            sec.classList.remove('active');
        }
    });

    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));

    // Match by text content
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

/* ===== AUTH MODAL LOGIC ===== */

function initAuthModal() {
    const authModal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (!authModal) return;

    // Close on background click
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            closeAuthModal();
        }
    });

    // Ensure forms exist
    if (loginForm && signupForm) {
        // nothing extra here yet
    }
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

// Switch between login and signup views
function switchToSignup() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    if (!loginForm || !signupForm) return;

    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
}

function switchToLogin() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    if (!loginForm || !signupForm) return;

    signupForm.style.display = 'none';
    loginForm.style.display = 'block';
}

// Fake login/signup handlers (replace with Supabase later)
function handleLogin() {
    const email = document.getElementById('loginEmail')?.value.trim();
    const password = document.getElementById('loginPassword')?.value.trim();

    if (!email || !password) {
        alert('Enter email and password');
        return;
    }

    // TODO: replace with real Supabase auth
    localStorage.setItem('formliftUser', email);
    closeAuthModal();
}

function handleSignup() {
    const email = document.getElementById('signupEmail')?.value.trim();
    const password = document.getElementById('signupPassword')?.value.trim();
    const confirm = document.getElementById('signupPasswordConfirm')?.value.trim();

    if (!email || !password || !confirm) {
        alert('Fill out all fields');
        return;
    }

    if (password !== confirm) {
        alert('Passwords do not match');
        return;
    }

    // TODO: replace with real Supabase auth
    localStorage.setItem('formliftUser', email);
    closeAuthModal();
}

/* ===== VIDEO UPLOAD ===== */

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

    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

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
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });
}

/* ===== WORKOUT GENERATOR (STUB) ===== */

function generateWorkout() {
    const focus = document.getElementById('workoutFocus')?.value || 'fullbody';
    const time = document.getElementById('workoutTime')?.value || '60';
    const level = document.getElementById('experienceLevel')?.value || 'intermediate';
    const equipment = document.getElementById('equipment')?.value || 'full';
    const result = document.getElementById('workoutResult');

    if (!result) return;

    // Placeholder content — you can wire AI later
    result.innerHTML = `
        <div class="exercise">
            <div class="exercise-name">${focus.toUpperCase()} Session</div>
            <div class="exercise-details">
                ${time} min • ${level} • ${equipment.replace(/(^\w)/, c => c.toUpperCase())}
            </div>
        </div>
    `;

    const countEl = document.getElementById('workoutCount');
    if (countEl) {
        const current = parseInt(countEl.textContent || '0', 10) || 0;
        countEl.textContent = current + 1;
    }
}
