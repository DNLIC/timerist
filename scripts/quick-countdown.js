// Quick Countdown Timer - Preset buttons for quick selection
let currentTime = 0;
let totalSeconds = 0;
let interval = null;
let isRunning = false;

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const quickResetBtn = document.getElementById('quickResetBtn');
const presetButtons = document.querySelectorAll('.preset-btn[data-seconds]');
const manualMinutesInput = document.getElementById('manualMinutes');
const manualSecondsInput = document.getElementById('manualSeconds');
const manualStartBtn = document.getElementById('manualStartBtn');

// Format time as MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Update display
function updateDisplay() {
    display.textContent = formatTime(currentTime);
    
    // Add running class for styling
    if (isRunning) {
        document.body.classList.add('timer-running');
    } else {
        document.body.classList.remove('timer-running');
    }
}

// Start timer
function startTimer() {
    if (currentTime <= 0) return;
    
    isRunning = true;
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    pauseBtn.disabled = false;
    
    interval = setInterval(() => {
        currentTime--;
        updateDisplay();
        
        if (currentTime <= 0) {
            stopTimer();
            // Play sound if available
            playSound();
        }
    }, 1000);
}

// Pause timer
function pauseTimer() {
    isRunning = false;
    clearInterval(interval);
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    startBtn.textContent = 'Resume';
}

// Stop timer
function stopTimer() {
    isRunning = false;
    clearInterval(interval);
    interval = null;
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'none';
    resetBtn.style.display = 'inline-block';
    currentTime = 0;
    updateDisplay();
}

// Reset timer
function resetTimer() {
    stopTimer();
    currentTime = 0;
    totalSeconds = 0;
    updateDisplay();
    startBtn.textContent = 'Start';
    resetBtn.style.display = 'none';
}

// Set time from preset button
function setTime(seconds) {
    if (isRunning) return; // Don't allow changing time while running
    
    totalSeconds = seconds;
    currentTime = seconds;
    updateDisplay();
    
    // Automatically start the countdown
    startTimer();
}

// Set time from manual input
function setTimeFromManual() {
    if (isRunning) return; // Don't allow changing time while running
    
    const minutes = parseInt(manualMinutesInput.value) || 0;
    const seconds = parseInt(manualSecondsInput.value) || 0;
    const total = (minutes * 60) + seconds;
    
    if (total <= 0) {
        alert('Please enter a time greater than 0');
        return;
    }
    
    totalSeconds = total;
    currentTime = total;
    updateDisplay();
    
    // Automatically start the countdown
    startTimer();
}

// Play sound when timer completes
function playSound() {
    // Create a simple beep sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
quickResetBtn.addEventListener('click', resetTimer);

// Preset button listeners
presetButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const seconds = parseInt(this.getAttribute('data-seconds'));
        setTime(seconds);
    });
});

// Manual start button listener
manualStartBtn.addEventListener('click', setTimeFromManual);

// Allow Enter key to start manual time
manualMinutesInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        setTimeFromManual();
    }
});

manualSecondsInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        setTimeFromManual();
    }
});

// Initialize
updateDisplay();
