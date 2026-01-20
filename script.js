// ===== FORMLIFT MAIN SCRIPT =====

document.addEventListener('DOMContentLoaded', () => {
    initSplash();
    initNavigation();
    initAuthModals();
    initUserMenu();
    initVideoUpload();
    initPRTracker();
});

/* ===== SPLASH SCREEN ===== */

function initSplash() {
    const splashScreen = document.getElementById('splashScreen');
    const mainAppContent = document.getElementById('mainAppContent');
    const particlesContainer = document.getElementById('splashParticles');
    const logoText = document.getElementById('logoText');

    if (!splashScreen || !mainAppContent) {
        console.warn('Splash or main app container missing');
        return;
    }

    // Initial state: show splash, hide app
    splashScreen.style.display = 'flex';
    splashScreen.classList.remove('splash-hidden');
    mainAppContent.style.display = 'none';
    mainAppContent.classList.add('app-hidden');

    console.log('Starting FormLift splash sequence');

    // Particle burst after rings complete (~2.6s)
    setTimeout(() => {
        if (!particlesContainer) return;
        console.log('Creating splash particles');

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
        console.log('Showing FormLift logo text');
        if (logoText) {
            logoText.classList.add('show');
        }
    }, 2800);

    // Hide splash, show app
    setTimeout(() => {
        console.log('Transitioning from splash to app');
        splashScreen.classList.add('splash-hidden');

        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainAppContent.style.display = 'block';
            mainAppContent.classList.remove('app-hidden');
            mainAppContent.classList.add('app-visible');
        }, 800);
    }, 5200);
}

/* ===== NAVIGATION / SECTIONS ===== */

function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content');

    if (!navButtons.length || !sections.length) return;

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            if (!targetId) return;

            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            sections.forEach(sec => {
                if (sec.id === targetId) {
                    sec.classList.add('active');
                } else {
                    sec.classList.remove('active');
                }
            });

            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

/* ===== AUTH MODALS ===== */

function initAuthModals() {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const closeButtons = document.querySelectorAll('.modal .close');

    function openModal(modal) {
        if (!modal) return;
        modal.classList.add('active');
    }

    function closeModal(modal) {
        if (!modal) return;
        modal.classList.remove('active');
    }

    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => openModal(loginModal));
    }

    if (signupBtn && signupModal) {
        signupBtn.addEventListener('click', () => openModal(signupModal));
    }

    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });

    [loginModal, signupModal].forEach(modal => {
        if (!modal) return;
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
}

/* ===== USER MENU ===== */

function initUserMenu() {
    const userButton = document.getElementById('userMenuButton');
    const dropdown = document.querySelector('.user-dropdown');

    if (!userButton || !dropdown) return;

    userButton.addEventListener('click', () => {
        dropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!userButton.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
}

/* ===== VIDEO UPLOAD ===== */

function initVideoUpload() {
    const uploadArea = document.getElementById('videoUploadArea');
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

/* ===== PR TRACKER ===== */

function initPRTracker() {
    const prForm = document.getElementById('prForm');
    const prList = document.getElementById('prList');

    if (!prForm || !prList) return;

    prForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const exerciseInput = prForm.querySelector('input[name="exercise"]');
        const weightInput = prForm.querySelector('input[name="weight"]');
        const repsInput = prForm.querySelector('input[name="reps"]');

        if (!exerciseInput || !weightInput || !repsInput) return;

        const exercise = exerciseInput.value.trim();
        const weight = weightInput.value.trim();
        const reps = repsInput.value.trim();

        if (!exercise || !weight || !reps) return;

        const item = document.createElement('div');
        item.className = 'pr-item';

        const info = document.createElement('div');
        info.className = 'pr-info';

        const title = document.createElement('div');
        title.className = 'pr-exercise';
        title.textContent = exercise;

        const stats = document.createElement('div');
        stats.className = 'pr-stats';
        stats.textContent = `${weight} lbs × ${reps} reps`;

        const date = document.createElement('div');
        date.className = 'pr-date';
        date.textContent = new Date().toLocaleDateString();

        info.appendChild(title);
        info.appendChild(stats);
        info.appendChild(date);

        const delBtn = document.createElement('button');
        delBtn.className = 'pr-delete';
        delBtn.textContent = 'Delete';
        delBtn.addEventListener('click', () => {
            prList.removeChild(item);
        });

        item.appendChild(info);
        item.appendChild(delBtn);
        prList.prepend(item);

        exerciseInput.value = '';
        weightInput.value = '';
        repsInput.value = '';
    });
}
