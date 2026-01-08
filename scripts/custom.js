// Custom Timer with multiple phases
let phases = [];
let currentPhaseIndex = 0;
let currentTime = 0;
let interval = null;
let isRunning = false;
let phaseCount = 3;

const display = document.getElementById('display');
const phaseLabel = document.getElementById('phaseLabel');
const phaseDisplay = document.getElementById('phase');
const totalPhasesDisplay = document.getElementById('totalPhases');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const phaseCountInput = document.getElementById('phaseCount');
const updatePhasesBtn = document.getElementById('updatePhases');
const phasesContainer = document.getElementById('phasesContainer');

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateDisplay() {
    if (phases.length === 0) return;
    
    display.textContent = formatTime(currentTime);
    phaseLabel.textContent = `Phase ${currentPhaseIndex + 1}`;
    phaseDisplay.textContent = currentPhaseIndex + 1;
    totalPhasesDisplay.textContent = phases.length;
}

function generatePhases() {
    phasesContainer.innerHTML = '';
    phases = [];
    
    for (let i = 0; i < phaseCount; i++) {
        const phaseDiv = document.createElement('div');
        phaseDiv.className = 'setting-group';
        phaseDiv.innerHTML = `
            <label for="phase${i}Name">Phase ${i + 1} Name</label>
            <input type="text" id="phase${i}Name" value="Phase ${i + 1}" />
            <label for="phase${i}Minutes" style="margin-top: 10px;">Minutes</label>
            <input type="number" id="phase${i}Minutes" min="0" max="99" value="${i === 0 ? 1 : 0}" />
            <label for="phase${i}Seconds" style="margin-top: 10px;">Seconds</label>
            <input type="number" id="phase${i}Seconds" min="0" max="59" value="0" />
        `;
        phasesContainer.appendChild(phaseDiv);
        
        phases.push({
            name: `Phase ${i + 1}`,
            minutes: i === 0 ? 1 : 0,
            seconds: 0
        });
    }
    
    loadPhases();
    updateDisplay();
}

function loadPhases() {
    phases = [];
    for (let i = 0; i < phaseCount; i++) {
        const nameInput = document.getElementById(`phase${i}Name`);
        const minutesInput = document.getElementById(`phase${i}Minutes`);
        const secondsInput = document.getElementById(`phase${i}Seconds`);
        
        if (nameInput && minutesInput && secondsInput) {
            phases.push({
                name: nameInput.value || `Phase ${i + 1}`,
                minutes: parseInt(minutesInput.value) || 0,
                seconds: parseInt(secondsInput.value) || 0
            });
        }
    }
}

function startTimer() {
    if (phases.length === 0) {
        loadPhases();
    }
    
    if (phases.length === 0 || currentTime === 0) {
        loadPhases();
        currentPhaseIndex = 0;
        const phase = phases[currentPhaseIndex];
        if (phase) {
            currentTime = phase.minutes * 60 + phase.seconds;
        } else {
            return;
        }
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
            
            // Move to next phase
            currentPhaseIndex++;
            
            if (currentPhaseIndex >= phases.length) {
                // Finished all phases
                clearInterval(interval);
                isRunning = false;
                startBtn.disabled = false;
                pauseBtn.disabled = true;
                document.body.classList.remove('timer-running');
                playSound();
                return;
            }
            
            const phase = phases[currentPhaseIndex];
            currentTime = phase.minutes * 60 + phase.seconds;
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
    loadPhases();
    currentPhaseIndex = 0;
    const phase = phases[currentPhaseIndex];
    if (phase) {
        currentTime = phase.minutes * 60 + phase.seconds;
    } else {
        currentTime = 0;
    }
    updateDisplay();
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    enableInputs();
    document.body.classList.remove('timer-running');
}

function disableInputs() {
    phaseCountInput.disabled = true;
    for (let i = 0; i < phaseCount; i++) {
        const nameInput = document.getElementById(`phase${i}Name`);
        const minutesInput = document.getElementById(`phase${i}Minutes`);
        const secondsInput = document.getElementById(`phase${i}Seconds`);
        if (nameInput) nameInput.disabled = true;
        if (minutesInput) minutesInput.disabled = true;
        if (secondsInput) secondsInput.disabled = true;
    }
}

function enableInputs() {
    phaseCountInput.disabled = false;
    for (let i = 0; i < phaseCount; i++) {
        const nameInput = document.getElementById(`phase${i}Name`);
        const minutesInput = document.getElementById(`phase${i}Minutes`);
        const secondsInput = document.getElementById(`phase${i}Seconds`);
        if (nameInput) nameInput.disabled = false;
        if (minutesInput) minutesInput.disabled = false;
        if (secondsInput) secondsInput.disabled = false;
    }
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
generatePhases();

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

updatePhasesBtn.addEventListener('click', () => {
    if (!isRunning) {
        phaseCount = parseInt(phaseCountInput.value) || 3;
        generatePhases();
        resetTimer();
    }
});

