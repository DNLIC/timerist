// Stopwatch
let elapsedTime = 0;
let interval = null;
let isRunning = false;

const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateDisplay() {
    display.textContent = formatTime(elapsedTime);
}

function startTimer() {
    isRunning = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    document.body.classList.add('timer-running');
    
    interval = setInterval(() => {
        elapsedTime++;
        updateDisplay();
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
    elapsedTime = 0;
    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    document.body.classList.remove('timer-running');
}

// Initialize
updateDisplay();

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

