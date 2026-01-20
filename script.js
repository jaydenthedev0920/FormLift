// ===== FORMLIFT JAVASCRIPT =====

// Configuration
const API_URL = 'https://formlift-engine.YOUR-USERNAME.workers.dev'; // REPLACE WITH YOUR CLOUDFLARE WORKER URL

// Supabase Configuration
const SUPABASE_URL = 'https://nmmqfieeguldqouynhze.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbXFmaWVlZ3VsZHFvdXluaHplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4NzE4OTksImV4cCI6MjA4NDQ0Nzg5OX0.Mn7HgqcY05lgSTCGOuzwS5ba_dc11mgA-zKfZF2oEbI';

// Initialize Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Current user
let currentUser = null;

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
        <div class="user-menu">
            <button class="user-button" onclick="toggleUserMenu()">
                ${currentUser.email.split('@')[0]} ▼
            </button>
            <div class="user-dropdown" id="userDropdown">
                <div class="user-dropdown-item">${currentUser.email}</div>
                <div class="user-dropdown-item" onclick="handleLogout()">Sign Out</div>
            </div>
        </div>
    `;
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

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert('Login failed: ' + error.message);
    } else {
        closeAuthModal();
        alert('Welcome back!');
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

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        alert('Signup failed: ' + error.message);
    } else {
        alert('Account created! Please check your email to verify your account.');
        switchToLogin();
    }
}

async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        alert('Logout failed: ' + error.message);
    } else {
        alert('Logged out successfully');
    }
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
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
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
const uploadArea = document.getElementById('uploadArea');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => uploadArea.classList.add('dragover'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    uploadArea.addEventListener(eventName, () => uploadArea.classList.remove('dragover'), false);
});

uploadArea.addEventListener('drop', handleDrop, false);

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
    initAuth();
    updateHistoryDisplay();
    
    // Load stats from localStorage
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    document.getElementById('workoutCount').textContent = history.length;
});
