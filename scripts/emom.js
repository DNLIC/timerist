// EMOM Timer (Every Minute On the Minute)
let currentTime = 0;
let interval = null;
let isRunning = false;
let currentMinute = 1;
let totalMinutes = 10;

const display = document.getElementById('display');
const minuteDisplay = document.getElementById('minute');
const totalMinutesDisplay = document.getElementById('totalMinutes');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const minutesInput = document.getElementById('minutes');

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateDisplay() {
    display.textContent = formatTime(currentTime);
    minuteDisplay.textContent = currentMinute;
    totalMinutesDisplay.textContent = totalMinutes;
}

function startTimer() {
    if (currentTime === 0 && currentMinute === 1) {
        totalMinutes = parseInt(minutesInput.value);
        currentTime = 0;
        currentMinute = 1;
    }
    
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    minutesInput.disabled = true;
    document.body.classList.add('timer-running');
    
    interval = setInterval(() => {
        currentTime++;
        updateDisplay();
        
        // Every 60 seconds, reset to 0 and increment minute
        if (currentTime >= 60) {
            playSound();
            currentTime = 0;
            currentMinute++;
            
            if (currentMinute > totalMinutes) {
                // Finished all minutes
                clearInterval(interval);
                isRunning = false;
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                document.body.classList.remove('timer-running');
                playSound();
                return;
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
    totalMinutes = parseInt(minutesInput.value);
    currentTime = 0;
    currentMinute = 1;
    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    minutesInput.disabled = false;
    document.body.classList.remove('timer-running');
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
updateDisplay();

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

minutesInput.addEventListener('input', () => {
    if (!isRunning) {
        resetTimer();
    }
});

