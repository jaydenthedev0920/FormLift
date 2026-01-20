async function handleLogout() {
    showLoading();
    
    const { error// ===== FORMLIFT JAVASCRIPT =====

// Configuration
const API_URL = 'https://formlift-engine.jtho09200920.workers.dev';

// Supabase Configuration
const SUPABASE_URL = 'https://nmmqfieeguldqouynhze.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbXFmaWVlZ3VsZHFvdXluaHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NzE4OTksImV4cCI6MjA4NDQ0Nzg5OX0.Mn7HgqcY05lgSTCGOuzwS5ba_dc11mgA-zKfZF2oEbI';

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Current user
let currentUser = null;

// ===== SPLASH SCREEN =====
function initSplash() {
    const splashScreen = document.getElementById('splashScreen');
    const mainAppContent = document.getElementById('mainAppContent');
    const particlesContainer = document.getElementById('splashParticles');
    const logoText = document.getElementById('logoText');
    
    console.log('Splash init started - Rings animation');
    console.log('Logo text element:', logoText);
    
    // Make sure splash is visible
    if (splashScreen) {
        splashScreen.style.display = 'flex';
        splashScreen.classList.remove('splash-hidden');
    }
    
    // Make sure main app is hidden
    if (mainAppContent) {
        mainAppContent.classList.add('app-hidden');
        mainAppContent.classList.remove('app-visible');
    }
    
    // Create particle burst when rings complete (at 2.5s)
    setTimeout(() => {
        if (particlesContainer) {
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'splash-particle';
                const angle = (i / 20) * Math.PI * 2;
                const distance = 100 + Math.random() * 60;
                particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
                particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
                particle.style.left = '50%';
                particle.style.top = '50%';
                particlesContainer.appendChild(particle);
            }
        }
    }, 2500);

    // Show text after rings complete
    if (logoText) {
        setTimeout(() => {
            console.log('Text animation starting - adding draw class');
            logoText.classList.add('draw');
            console.log('Draw class added');
        }, 2800);
        
        // Fallback
        setTimeout(() => {
            console.log('Forcing text visibility');
            logoText.style.opacity = '1';
        }, 3200);
    }

    // Hide splash and show main app
    setTimeout(() => {
        console.log('Hiding splash');
        if (splashScreen) {
            splashScreen.classList.add('splash-hidden');
        }
        
        setTimeout(() => {
            console.log('Showing main app');
            if (splashScreen) {
                splashScreen.style.display = 'none';
            }
            if (mainAppContent) {
                mainAppContent.classList.remove('app-hidden');
                mainAppContent.classList.add('app-visible');
            }
        }, 800);
    }, 5000);
}

// ===== AUTH FUNCTIONS =====
async function initAuth() {
    // Check if user is already logged in
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        currentUser = session.user;
        updateUIForLoggedInUser();
    } else {
        updateUIForLoggedOutUser();
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
            currentUser = session.user;
            updateUIForLoggedInUser();
        } else {
            currentUser = null;
            updateUIForLoggedOutUser();
        }
    });
}

function updateUIForLoggedInUser() {
    const nav = document.getElementById('mainNav');
    nav.innerHTML = `
        <button class="nav-btn active" onclick="showSection('home')">Home</button>
        <button class="nav-btn" onclick="showSection('workout')">Workout</button>
        <button class="nav-btn" onclick="showSection('formcheck')">Form Check</button>
        <button class="nav-btn" onclick="showSection('history')">History</button>
        <button class="nav-btn" onclick="showSection('prs')">PRs</button>
        <div class="user-menu">
            <button class="user-button" onclick="toggleUserMenu()">
                ${currentUser.email.split('@')[0]} ▼
            </button>
            <div class="user-dropdown" id="userDropdown">
                <div class="user-dropdown-item" onclick="showSection('profile')">${currentUser.email}</div>
                <div class="user-dropdown-item" onclick="showSection('profile')">Settings</div>
                <div class="user-dropdown-item" onclick="handleLogout()">Sign Out</div>
            </div>
        </div>
    `;
    
    // Update profile page with user info
    updateProfilePage();
    
    // Load user's PRs
    loadPRs();
}

function updateUIForLoggedOutUser() {
    const nav = document.getElementById('mainNav');
    nav.innerHTML = `
        <button class="nav-btn" onclick="openAuthModal()">Sign In</button>
    `;
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('active');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu')) {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.classList.remove('active');
    }
});

function openAuthModal() {
    document.getElementById('authModal').classList.add('active');
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function switchToSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
}

function switchToLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
}

async function handleLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Show loading
    showLoading();

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    hideLoading();

    if (error) {
        alert('Login failed: ' + error.message);
    } else {
        closeAuthModal();
    }
}

async function handleSignup() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const passwordConfirm = document.getElementById('signupPasswordConfirm').value;

    if (!email || !password || !passwordConfirm) {
        alert('Please fill in all fields');
        return;
    }

    if (password !== passwordConfirm) {
        alert('Passwords do not match');
        return;
    }

    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }

    // Show loading
    showLoading();

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    hideLoading();

    if (error) {
        alert('Signup failed: ' + error.message);
    } else {
        alert('Account created successfully! You can now sign in.');
        switchToLogin();
        // Clear signup form
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPassword').value = '';
        document.getElementById('signupPasswordConfirm').value = '';
    }
}

async function handleLogout() {
    showLoading();
    
    const { error } = await supabase.auth.signOut();
    
    hideLoading();
    
    if (error) {
        alert('Logout failed: ' + error.message);
    }
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('authModal');
    if (event.target === modal) {
        closeAuthModal();
    }
}

// ===== NAVIGATION =====
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    
    // Show selected section
    document.getElementById(`${section}-section`).classList.add('active');
    event.target.classList.add('active');
}

// ===== WORKOUT GENERATOR =====
async function generateWorkout() {
    const focus = document.getElementById('workoutFocus').value;
    const time = document.getElementById('workoutTime').value;
    const level = document.getElementById('experienceLevel').value;
    const equipment = document.getElementById('equipment').value;

    const resultDiv = document.getElementById('workoutResult');
    resultDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Generating your personalized workout...</p></div>';

    try {
        const response = await fetch(`${API_URL}/workout/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ focus, time, level, equipment })
        });

        const data = await response.json();

        if (data.success) {
            displayWorkout(data.workout);
            
            // Update stats
            const count = parseInt(document.getElementById('workoutCount').textContent);
            document.getElementById('workoutCount').textContent = count + 1;
            
            // Save to history
            saveWorkoutToHistory(data.workout);
        } else {
            resultDiv.innerHTML = `<p style="color: var(--error); text-align: center; padding: 40px;">Error: ${data.error}</p>`;
        }
    } catch (error) {
        console.error('Workout generation error:', error);
        resultDiv.innerHTML = `<p style="color: var(--error); text-align: center; padding: 40px;">Failed to connect to server. Please try again.</p>`;
    }
}

function displayWorkout(workout) {
    const html = `
        <h3>${workout.name} - ${workout.time} minutes</h3>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">Level: ${capitalize(workout.level)}</p>
        ${workout.exercises.map(ex => `
            <div class="exercise">
                <div class="exercise-name">${ex.name}</div>
                <div class="exercise-details">${ex.sets} sets × ${ex.reps} reps • Rest: ${ex.rest}</div>
            </div>
        `).join('')}
        <div style="background: var(--bg-dark); padding: 20px; border-radius: 12px; margin-top: 24px; border-left: 4px solid var(--accent-secondary);">
            <strong style="color: var(--accent-secondary);">Notes:</strong><br>
            <span style="color: var(--text-secondary);">${workout.notes}</span>
        </div>
        <button class="btn" style="margin-top: 24px;" onclick="generateWorkout()">Generate Another Workout</button>
    `;
    
    document.getElementById('workoutResult').innerHTML = html;
}

// ===== WORKOUT HISTORY =====
function saveWorkoutToHistory(workout) {
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    history.unshift(workout);
    localStorage.setItem('workoutHistory', JSON.stringify(history.slice(0, 20))); // Keep last 20
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const historyDiv = document.getElementById('historyList');
    
    if (history.length === 0) {
        historyDiv.innerHTML = '<p class="empty-state">No workouts yet. Generate your first workout!</p>';
        return;
    }
    
    historyDiv.innerHTML = history.map((w, index) => `
        <div class="exercise" style="cursor: pointer;" onclick='showWorkoutDetails(${index})'>
            <div class="exercise-name">${w.name}</div>
            <div class="exercise-details">${formatDate(w.date)} • ${w.time} min • ${capitalize(w.level)} • ${w.exercises.length} exercises</div>
        </div>
    `).join('');
}

function showWorkoutDetails(index) {
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    const workout = history[index];
    
    if (!workout) return;
    
    // Switch to workout section and display the workout
    showSection('workout');
    displayWorkout(workout);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
}

// ===== FORM CHECK =====
function handleVideoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
        alert('File too large. Maximum size is 50MB.');
        return;
    }

    const previewDiv = document.getElementById('videoPreview');
    const videoURL = URL.createObjectURL(file);
    
    previewDiv.innerHTML = `
        <video controls src="${videoURL}"></video>
        <button class="btn" onclick="analyzeForm()">Analyze My Form</button>
    `;
}

async function analyzeForm() {
    const exercise = document.getElementById('exerciseType').value;
    const resultDiv = document.getElementById('formCheckResult');
    
    resultDiv.innerHTML = `
        <div style="background: var(--bg-dark); padding: 40px; border-radius: 12px; text-align: center; border: 2px dashed var(--border);">
            <div style="font-size: 48px; margin-bottom: 16px;">🚧</div>
            <h3 style="margin-bottom: 12px;">Form Check Coming Soon</h3>
            <p style="color: var(--text-secondary);">
                AI video analysis is currently in development. This feature will analyze your lifting form 
                and provide detailed feedback on technique, safety, and areas for improvement.
            </p>
            <p style="color: var(--text-muted); margin-top: 16px; font-size: 14px;">
                For now, focus on generating awesome workouts! 💪
            </p>
        </div>
    `;
}

// ===== DRAG AND DROP FOR VIDEO =====
document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('uploadArea');
    
    if (uploadArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'), false);
        });

        uploadArea.addEventListener('drop', handleDrop, false);
    }
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    document.getElementById('videoInput').files = files;
    handleVideoUpload({ target: { files: files } });
}

// ===== UTILITIES =====
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ===== INITIALIZE APP =====
document.addEventListener('DOMContentLoaded', () => {
    console.log('App loading...');
    
    // Check if this is a page refresh (performance.navigation is deprecated but works)
    // Or use newer API: performance.getEntriesByType('navigation')[0].type
    const perfData = performance.getEntriesByType('navigation')[0];
    const isRefresh = perfData && perfData.type === 'reload';
    
    if (!isRefresh) {
        // New tab/window - show splash
        initSplash();
        
        // Initialize auth and app after splash completes
        setTimeout(() => {
            console.log('Initializing auth...');
            initAuth();
            updateHistoryDisplay();
            
            // Load stats from localStorage
            const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
            const workoutCountEl = document.getElementById('workoutCount');
            if (workoutCountEl) {
                workoutCountEl.textContent = history.length;
            }
            
            loadSettings();
        }, 5000); // Must match splash timeout
    } else {
        // Page refresh - skip splash
        const splashScreen = document.getElementById('splashScreen');
        const mainAppContent = document.getElementById('mainAppContent');
        
        if (splashScreen) {
            splashScreen.style.display = 'none';
        }
        if (mainAppContent) {
            mainAppContent.classList.remove('app-hidden');
            mainAppContent.classList.add('app-visible');
        }
        
        // Initialize immediately
        initAuth();
        updateHistoryDisplay();
        
        const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
        const workoutCountEl = document.getElementById('workoutCount');
        if (workoutCountEl) {
            workoutCountEl.textContent = history.length;
        }
        
        loadSettings();
    }
});

// ===== PR TRACKER =====
function addPR() {
    const exercise = document.getElementById('prExercise').value;
    const weight = document.getElementById('prWeight').value;
    const reps = document.getElementById('prReps').value;

    if (!weight || !reps) {
        alert('Please enter both weight and reps');
        return;
    }

    const prs = JSON.parse(localStorage.getItem('prs') || '[]');
    
    const newPR = {
        id: Date.now(),
        exercise: exercise,
        weight: parseInt(weight),
        reps: parseInt(reps),
        date: new Date().toISOString()
    };

    prs.unshift(newPR);
    localStorage.setItem('prs', JSON.stringify(prs));

    // Clear inputs
    document.getElementById('prWeight').value = '';
    document.getElementById('prReps').value = '';

    // Update display
    displayPRs();
    
    // Update stats
    const prCount = document.getElementById('prCount');
    if (prCount) prCount.textContent = prs.length;
}

function loadPRs() {
    displayPRs();
    const prs = JSON.parse(localStorage.getItem('prs') || '[]');
    const prCount = document.getElementById('prCount');
    if (prCount) prCount.textContent = prs.length;
}

function displayPRs() {
    const prs = JSON.parse(localStorage.getItem('prs') || '[]');
    const prList = document.getElementById('prList');

    if (prs.length === 0) {
        prList.innerHTML = '<p class="empty-state">No PRs logged yet. Add your first personal record!</p>';
        return;
    }

    prList.innerHTML = prs.map(pr => `
        <div class="pr-item">
            <div class="pr-info">
                <div class="pr-exercise">${capitalize(pr.exercise)}</div>
                <div class="pr-stats">${pr.weight} lbs × ${pr.reps} rep${pr.reps > 1 ? 's' : ''}</div>
                <div class="pr-date">${formatDate(pr.date)}</div>
            </div>
            <button class="pr-delete" onclick="deletePR(${pr.id})">Delete</button>
        </div>
    `).join('');
}

function deletePR(id) {
    if (!confirm('Delete this PR?')) return;
    
    const prs = JSON.parse(localStorage.getItem('prs') || '[]');
    const filtered = prs.filter(pr => pr.id !== id);
    localStorage.setItem('prs', JSON.stringify(filtered));
    
    displayPRs();
    
    // Update stats
    const prCount = document.getElementById('prCount');
    if (prCount) prCount.textContent = filtered.length;
}

// ===== PROFILE & SETTINGS =====
function updateProfilePage() {
    if (!currentUser) return;
    
    document.getElementById('profileEmail').textContent = currentUser.email;
    
    const joinDate = new Date(currentUser.created_at);
    document.getElementById('profileJoinDate').textContent = joinDate.toLocaleDateString();
}

function saveSettings() {
    const settings = {
        goal: document.getElementById('settingsGoal').value,
        level: document.getElementById('settingsLevel').value,
        days: document.getElementById('settingsDays').value
    };
    
    localStorage.setItem('userSettings', JSON.stringify(settings));
    alert('Settings saved!');
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('userSettings') || '{}');
    
    if (settings.goal) document.getElementById('settingsGoal').value = settings.goal;
    if (settings.level) document.getElementById('settingsLevel').value = settings.level;
    if (settings.days) document.getElementById('settingsDays').value = settings.days;
}

function clearAllData() {
    if (!confirm('Are you sure? This will delete ALL your workouts, PRs, and settings. This cannot be undone!')) {
        return;
    }
    
    if (!confirm('Really sure? This is permanent!')) {
        return;
    }
    
    localStorage.clear();
    alert('All data cleared!');
    location.reload();
}
