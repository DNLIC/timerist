// Countdown Timer
let timeLeft = 0;
let interval = null;
let isRunning = false;

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateDisplay() {
    display.textContent = formatTime(timeLeft);
}

function startTimer() {
    if (timeLeft <= 0) {
        timeLeft = parseInt(minutesInput.value) * 60 + parseInt(secondsInput.value);
        if (timeLeft <= 0) return;
    }
    
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    minutesInput.disabled = true;
    secondsInput.disabled = true;
    document.body.classList.add('timer-running');
    
    interval = setInterval(() => {
        timeLeft--;
        updateDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(interval);
            isRunning = false;
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            document.body.classList.remove('timer-running');
            playSound();
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
    timeLeft = parseInt(minutesInput.value) * 60 + parseInt(secondsInput.value);
    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    minutesInput.disabled = false;
    secondsInput.disabled = false;
    document.body.classList.remove('timer-running');
}

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

// Initialize
updateDisplay();

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

minutesInput.addEventListener('input', () => {
    if (!isRunning) {
        timeLeft = parseInt(minutesInput.value) * 60 + parseInt(secondsInput.value);
        updateDisplay();
    }
});

secondsInput.addEventListener('input', () => {
    if (!isRunning) {
        timeLeft = parseInt(minutesInput.value) * 60 + parseInt(secondsInput.value);
        updateDisplay();
    }
});

