// ===== FORMLIFT JAVASCRIPT =====

// Configuration
const API_URL = 'formlift-engine.jtho09200920.workers.dev'; // REPLACE WITH YOUR CLOUDFLARE WORKER URL

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
    
    resultDiv.innerHTML = '<div class="loading"><div class="spinner"></div><p>Analyzing your form with AI...</p></div>';

    // Simulate AI analysis (replace with actual API call when backend is ready)
    setTimeout(() => {
        const feedback = generateFormFeedback(exercise);
        displayFormFeedback(feedback);
        
        // Update stats
        const count = parseInt(document.getElementById('formCheckCount').textContent);
        document.getElementById('formCheckCount').textContent = count + 1;
    }, 3000);
}

function generateFormFeedback(exercise) {
    // Sample feedback (will be replaced with real AI analysis)
    const feedbackOptions = {
        squat: {
            score: Math.floor(Math.random() * 20) + 75,
            feedback: [
                { type: 'success', text: 'Good depth achieved - hitting parallel or below' },
                { type: 'success', text: 'Neutral spine maintained throughout the movement' },
                { type: 'warning', text: 'Slight knee valgus on ascent - focus on pushing knees out' },
                { type: 'info', text: 'Consider a slightly wider stance for better stability' }
            ]
        },
        deadlift: {
            score: Math.floor(Math.random() * 20) + 75,
            feedback: [
                { type: 'success', text: 'Excellent hip hinge pattern' },
                { type: 'warning', text: 'Bar drifts slightly forward - keep it closer to shins' },
                { type: 'success', text: 'Strong lockout position' },
                { type: 'info', text: 'Try engaging lats more before the pull' }
            ]
        },
        bench: {
            score: Math.floor(Math.random() * 20) + 75,
            feedback: [
                { type: 'success', text: 'Good bar path - straight vertical line' },
                { type: 'success', text: 'Proper scapular retraction' },
                { type: 'warning', text: 'Elbows flaring slightly - tuck them to 45 degrees' },
                { type: 'info', text: 'Leg drive could be stronger - push through heels' }
            ]
        },
        overhead: {
            score: Math.floor(Math.random() * 20) + 75,
            feedback: [
                { type: 'success', text: 'Bar path is vertical - excellent' },
                { type: 'warning', text: 'Slight lower back arch - engage core more' },
                { type: 'success', text: 'Good lockout overhead' },
                { type: 'info', text: 'Try moving head through after bar passes' }
            ]
        },
        row: {
            score: Math.floor(Math.random() * 20) + 75,
            feedback: [
                { type: 'success', text: 'Good torso angle maintained' },
                { type: 'success', text: 'Pulling to correct position (lower chest)' },
                { type: 'warning', text: 'Using some momentum - slow down the eccentric' },
                { type: 'info', text: 'Retract scapula at the top of each rep' }
            ]
        }
    };

    return feedbackOptions[exercise] || feedbackOptions.squat;
}

function displayFormFeedback(feedback) {
    const scoreColor = feedback.score >= 85 ? 'var(--success)' : 
                      feedback.score >= 70 ? 'var(--warning)' : 'var(--error)';
    
    const html = `
        <h3>Analysis Complete</h3>
        <div style="text-align: center; margin: 32px 0;">
            <div style="font-size: 72px; font-weight: 900; color: ${scoreColor};">
                ${feedback.score}
            </div>
            <div style="color: var(--text-secondary); font-size: 18px; margin-top: 8px;">Form Score</div>
        </div>
        ${feedback.feedback.map(f => `
            <div class="feedback ${f.type === 'warning' ? 'warning' : f.type === 'error' ? 'error' : ''}">
                <div class="feedback-title">
                    ${f.type === 'success' ? '✓' : f.type === 'warning' ? '⚠' : 'ℹ'} 
                    ${f.text}
                </div>
            </div>
        `).join('')}
        <button class="btn" style="margin-top: 24px;" onclick="document.getElementById('videoInput').click()">
            Upload Another Video
        </button>
    `;
    
    document.getElementById('formCheckResult').innerHTML = html;
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
    updateHistoryDisplay();
    
    // Load stats from localStorage
    const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
    document.getElementById('workoutCount').textContent = history.length;
});

