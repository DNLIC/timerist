// Quick Countdown Timer - Preset buttons for quick selection
let currentTime = 0;
let totalSeconds = 0;
let interval = null;
let isRunning = false;

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const quickResetBtn = document.getElementById('quickResetBtn');
const presetButtons = document.querySelectorAll('.preset-btn[data-seconds]');
const manualTimeInput = document.getElementById('manualTime');
const manualStartBtn = document.getElementById('manualStartBtn');
const manualDecreaseBtn = document.getElementById('manualDecreaseBtn');
const manualIncreaseBtn = document.getElementById('manualIncreaseBtn');

// Format time as MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Parse MM:SS format to seconds
function parseTime(timeString) {
    const parts = timeString.split(':');
    if (parts.length !== 2) return 0;
    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    return (minutes * 60) + seconds;
}

// Format time for input field (MM:SS)
function formatTimeInput(seconds) {
    return formatTime(seconds);
}

// Validate and format time input
function validateTimeInput(input) {
    let value = input.value.replace(/[^0-9:]/g, ''); // Remove non-numeric except colon
    
    // Auto-format as user types
    if (value.length === 1 && /[0-9]/.test(value)) {
        value = '00:0' + value;
    } else if (value.length === 2 && /[0-9]{2}/.test(value)) {
        value = '00:' + value;
    } else if (value.length === 3 && /[0-9]:[0-9]/.test(value)) {
        value = '0' + value;
    } else if (value.length === 4 && /[0-9]{2}[0-9]{2}/.test(value)) {
        value = value.substring(0, 2) + ':' + value.substring(2);
    }
    
    // Ensure MM:SS format
    if (value.match(/^[0-9]{1,2}:[0-9]{1,2}$/)) {
        const parts = value.split(':');
        const mins = parts[0].padStart(2, '0');
        const secs = parts[1].padStart(2, '0');
        value = mins + ':' + secs;
    }
    
    input.value = value;
    return value;
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
    stopBtn.style.display = 'inline-block';
    resetBtn.style.display = 'none';
    
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
    startBtn.textContent = 'Resume';
    pauseBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    resetBtn.style.display = 'inline-block';
}

// Stop timer
function stopTimer() {
    isRunning = false;
    clearInterval(interval);
    interval = null;
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'none';
    stopBtn.style.display = 'none';
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
    startBtn.style.display = 'inline-block';
    pauseBtn.style.display = 'none';
    stopBtn.style.display = 'none';
    resetBtn.style.display = 'none';
}

// Set time from preset button
function setTime(seconds) {
    if (isRunning) return; // Don't allow changing time while running
    
    // Update the manual entry field so user can adjust with +/- buttons
    manualTimeInput.value = formatTimeInput(seconds);
    
    // Update the display to show the selected time
    totalSeconds = seconds;
    currentTime = seconds;
    updateDisplay();
    
    // Show start button when time is set
    if (currentTime > 0) {
        startBtn.style.display = 'inline-block';
        startBtn.textContent = 'Start';
        pauseBtn.style.display = 'none';
        stopBtn.style.display = 'none';
        resetBtn.style.display = 'none';
    }
    
    // Don't auto-start - let user adjust with +/- buttons if needed, then click Start
}

// Set time from manual input
function setTimeFromManual() {
    if (isRunning) return; // Don't allow changing time while running
    
    const total = parseTime(manualTimeInput.value);
    
    if (total <= 0) {
        alert('Please enter a time greater than 0');
        return;
    }
    
    totalSeconds = total;
    currentTime = total;
    updateDisplay();
    
    // Show start button
    startBtn.style.display = 'inline-block';
    startBtn.textContent = 'Start';
    pauseBtn.style.display = 'none';
    stopBtn.style.display = 'none';
    resetBtn.style.display = 'none';
    
    // Automatically start the countdown
    startTimer();
}

// Adjust time by 5 seconds
function adjustManualTime(increment) {
    if (isRunning) return;
    
    const currentSeconds = parseTime(manualTimeInput.value);
    const newSeconds = Math.max(0, currentSeconds + (increment ? 5 : -5));
    manualTimeInput.value = formatTimeInput(newSeconds);
    
    // Update display and show start button if time > 0
    totalSeconds = newSeconds;
    currentTime = newSeconds;
    updateDisplay();
    
    if (currentTime > 0) {
        startBtn.style.display = 'inline-block';
        startBtn.textContent = 'Start';
        pauseBtn.style.display = 'none';
        stopBtn.style.display = 'none';
        resetBtn.style.display = 'none';
    } else {
        startBtn.style.display = 'none';
        pauseBtn.style.display = 'none';
        stopBtn.style.display = 'none';
        resetBtn.style.display = 'none';
    }
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
stopBtn.addEventListener('click', stopTimer);
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

// Time adjustment buttons
manualDecreaseBtn.addEventListener('click', () => adjustManualTime(false));
manualIncreaseBtn.addEventListener('click', () => adjustManualTime(true));

// Allow Enter key to start manual time
manualTimeInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        setTimeFromManual();
    }
});

// Input validation and formatting
manualTimeInput.addEventListener('input', function() {
    validateTimeInput(this);
});

// Initialize
updateDisplay();
// Hide start button initially since time is 0
startBtn.style.display = 'none';
