// Interval Timer
let currentTime = 0;
let interval = null;
let isRunning = false;
let isWorkPhase = true;
let currentRound = 1;
let workTime = 0;
let restTime = 0;
let totalRounds = 5;

const display = document.getElementById('display');
const phaseLabel = document.getElementById('phaseLabel');
const roundDisplay = document.getElementById('round');
const totalRoundsDisplay = document.getElementById('totalRounds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const workTimeInput = document.getElementById('workTime');
const restTimeInput = document.getElementById('restTime');
const roundsInput = document.getElementById('rounds');
const presetButtons = document.querySelectorAll('.preset-btn');
const workDecreaseBtn = document.getElementById('workDecreaseBtn');
const workIncreaseBtn = document.getElementById('workIncreaseBtn');
const restDecreaseBtn = document.getElementById('restDecreaseBtn');
const restIncreaseBtn = document.getElementById('restIncreaseBtn');
const clearBtn = document.getElementById('clearBtn');
const roundsDecreaseBtn = document.getElementById('roundsDecreaseBtn');
const roundsIncreaseBtn = document.getElementById('roundsIncreaseBtn');

// Parse MM:SS format to seconds
function parseTime(timeString) {
    const parts = timeString.split(':');
    if (parts.length !== 2) return 0;
    const minutes = parseInt(parts[0]) || 0;
    const seconds = parseInt(parts[1]) || 0;
    return (minutes * 60) + seconds;
}

// Format seconds to MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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

function updateDisplay() {
    display.textContent = formatTime(currentTime);
    phaseLabel.textContent = isWorkPhase ? 'Work' : 'Rest';
    roundDisplay.textContent = currentRound;
    totalRoundsDisplay.textContent = totalRounds;
    
    if (isWorkPhase) {
        phaseLabel.style.color = 'hsl(var(--primary))';
    } else {
        phaseLabel.style.color = 'hsl(var(--secondary))';
    }
}

function startTimer() {
    if (workTime === 0 && restTime === 0) {
        workTime = parseTime(workTimeInput.value);
        restTime = parseTime(restTimeInput.value);
        totalRounds = parseInt(roundsInput.value) || 5;
        currentTime = workTime;
        currentRound = 1;
        isWorkPhase = true;
    }
    
    if (currentTime <= 0) return;
    
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    disableInputs();
    document.body.classList.add('timer-running');
    
    interval = setInterval(() => {
        currentTime--;
        updateDisplay();
        
        if (currentTime <= 0) {
            playSound();
            
            if (isWorkPhase) {
                // Switch to rest
                isWorkPhase = false;
                currentTime = restTime;
            } else {
                // Switch to work, next round
                isWorkPhase = true;
                currentRound++;
                currentTime = workTime;
                
                if (currentRound > totalRounds) {
                    // Finished all rounds
                    clearInterval(interval);
                    isRunning = false;
                    startBtn.disabled = false;
                    pauseBtn.disabled = true;
                    document.body.classList.remove('timer-running');
                    playSound();
                    return;
                }
            }
            updateDisplay();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(interval);
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    document.body.classList.remove('timer-running');
}

function resetTimer() {
    // Stop the timer
    clearInterval(interval);
    interval = null;
    isRunning = false;
    
    // Get current values from inputs
    workTime = parseTime(workTimeInput.value);
    restTime = parseTime(restTimeInput.value);
    totalRounds = parseInt(roundsInput.value) || 5;
    
    // Reset to work phase, round 1
    currentTime = workTime;
    currentRound = 1;
    isWorkPhase = true;
    
    // Update display immediately
    updateDisplay();
    
    // Enable/disable buttons
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    enableInputs();
    document.body.classList.remove('timer-running');
    updatePresetButtonStates();
}

// Clear all settings - zero out everything
function clearTimer() {
    // Stop the timer first
    clearInterval(interval);
    interval = null;
    isRunning = false;
    
    // Zero out all values
    workTimeInput.value = '00:00';
    restTimeInput.value = '00:00';
    roundsInput.value = '0';
    
    // Reset timer state to zero
    workTime = 0;
    restTime = 0;
    totalRounds = 0;
    currentTime = 0;
    currentRound = 1;
    isWorkPhase = true;
    
    // Update display
    updateDisplay();
    
    // Enable/disable buttons
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    enableInputs();
    document.body.classList.remove('timer-running');
    updatePresetButtonStates();
}

// Adjust time by 5 seconds
function adjustTime(input, increment) {
    if (isRunning) return;
    
    const currentSeconds = parseTime(input.value);
    const newSeconds = Math.max(0, currentSeconds + (increment ? 5 : -5));
    input.value = formatTimeInput(newSeconds);
    
    // Trigger input event to update timer
    input.dispatchEvent(new Event('input'));
}

// Set time from preset button (work or rest)
function setTimeFromPreset(type, seconds) {
    if (isRunning) return; // Don't allow changing while running
    
    if (type === 'work') {
        workTimeInput.value = formatTimeInput(seconds);
        workTime = seconds;
    } else if (type === 'rest') {
        restTimeInput.value = formatTimeInput(seconds);
        restTime = seconds;
    }
    
    updatePresetButtonStates();
    
    // Reset timer to reflect new time
    if (!isRunning) {
        resetTimer();
    }
}

// Update which preset buttons are active
function updatePresetButtonStates() {
    const currentWorkSeconds = parseTime(workTimeInput.value);
    const currentRestSeconds = parseTime(restTimeInput.value);
    
    presetButtons.forEach(btn => {
        const btnType = btn.getAttribute('data-type');
        const btnSeconds = parseInt(btn.getAttribute('data-seconds'));
        const currentSeconds = btnType === 'work' ? currentWorkSeconds : currentRestSeconds;
        
        if (btnSeconds === currentSeconds) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

function disableInputs() {
    workTimeInput.disabled = true;
    restTimeInput.disabled = true;
    roundsInput.disabled = true;
    workDecreaseBtn.disabled = true;
    workIncreaseBtn.disabled = true;
    restDecreaseBtn.disabled = true;
    restIncreaseBtn.disabled = true;
    roundsDecreaseBtn.disabled = true;
    roundsIncreaseBtn.disabled = true;
    presetButtons.forEach(btn => btn.disabled = true);
}

function enableInputs() {
    workTimeInput.disabled = false;
    restTimeInput.disabled = false;
    roundsInput.disabled = false;
    workDecreaseBtn.disabled = false;
    workIncreaseBtn.disabled = false;
    restDecreaseBtn.disabled = false;
    restIncreaseBtn.disabled = false;
    roundsDecreaseBtn.disabled = false;
    roundsIncreaseBtn.disabled = false;
    presetButtons.forEach(btn => btn.disabled = false);
}

function playSound() {
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

// Initialize
workTime = parseTime(workTimeInput.value);
restTime = parseTime(restTimeInput.value);
currentTime = workTime;
updateDisplay();

// Event listeners
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);
clearBtn.addEventListener('click', clearTimer);

// Time adjustment buttons
workDecreaseBtn.addEventListener('click', () => adjustTime(workTimeInput, false));
workIncreaseBtn.addEventListener('click', () => adjustTime(workTimeInput, true));
restDecreaseBtn.addEventListener('click', () => adjustTime(restTimeInput, false));
restIncreaseBtn.addEventListener('click', () => adjustTime(restTimeInput, true));

// Rounds adjustment buttons
roundsDecreaseBtn.addEventListener('click', () => {
    if (isRunning) return;
    let rounds = parseInt(roundsInput.value) || 0;
    rounds = Math.max(0, rounds - 1);
    roundsInput.value = rounds;
    if (!isRunning) {
        resetTimer();
    }
});

roundsIncreaseBtn.addEventListener('click', () => {
    if (isRunning) return;
    let rounds = parseInt(roundsInput.value) || 0;
    rounds = Math.min(99, rounds + 1);
    roundsInput.value = rounds;
    if (!isRunning) {
        resetTimer();
    }
});

// Input validation and updates
workTimeInput.addEventListener('input', function() {
    validateTimeInput(this);
    if (!isRunning) {
        resetTimer();
        updatePresetButtonStates();
    }
});

restTimeInput.addEventListener('input', function() {
    validateTimeInput(this);
    if (!isRunning) {
        resetTimer();
        updatePresetButtonStates();
    }
});

roundsInput.addEventListener('input', function() {
    if (!isRunning) {
        resetTimer();
    }
});

// Preset button listeners (work and rest)
presetButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const type = this.getAttribute('data-type');
        const seconds = parseInt(this.getAttribute('data-seconds'));
        setTimeFromPreset(type, seconds);
    });
});

// Initialize preset button states
updatePresetButtonStates();
