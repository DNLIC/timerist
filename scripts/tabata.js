// Tabata Timer (20 seconds work, 10 seconds rest, 8 rounds)
let currentTime = 0;
let interval = null;
let isRunning = false;
let isWorkPhase = true;
let currentRound = 1;
let workTime = 20;
let restTime = 10;
let totalRounds = 8;

const display = document.getElementById('display');
const phaseLabel = document.getElementById('phaseLabel');
const roundDisplay = document.getElementById('round');
const totalRoundsDisplay = document.getElementById('totalRounds');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const workSecondsInput = document.getElementById('workSeconds');
const restSecondsInput = document.getElementById('restSeconds');
const roundsInput = document.getElementById('rounds');

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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
        workTime = parseInt(workSecondsInput.value);
        restTime = parseInt(restSecondsInput.value);
        totalRounds = parseInt(roundsInput.value);
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
    clearInterval(interval);
    isRunning = false;
    workTime = parseInt(workSecondsInput.value);
    restTime = parseInt(restSecondsInput.value);
    totalRounds = parseInt(roundsInput.value);
    currentTime = workTime;
    currentRound = 1;
    isWorkPhase = true;
    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    enableInputs();
    document.body.classList.remove('timer-running');
}

function disableInputs() {
    workSecondsInput.disabled = true;
    restSecondsInput.disabled = true;
    roundsInput.disabled = true;
}

function enableInputs() {
    workSecondsInput.disabled = false;
    restSecondsInput.disabled = false;
    roundsInput.disabled = false;
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
currentTime = workTime;
updateDisplay();

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

[workSecondsInput, restSecondsInput, roundsInput].forEach(input => {
    input.addEventListener('input', () => {
        if (!isRunning) {
            resetTimer();
        }
    });
});

