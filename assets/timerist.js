(() => {
  const supportsSpeech = "speechSynthesis" in window;

  function pad2(n) { return String(n).padStart(2, "0"); }
  function formatMMSS(sec) {
    sec = Math.max(0, Math.floor(sec));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${pad2(m)}:${pad2(s)}`;
  }

  // Simple beep using WebAudio (no file needed)
  function beep() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 120);
    } catch (e) {
      // no-op
    }
  }

  function speak(text) {
    if (!supportsSpeech) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.0;
      u.pitch = 1.0;
      window.speechSynthesis.speak(u);
    } catch (e) {
      // no-op
    }
  }

  function parseConfig(el) {
    const raw = el.getAttribute("data-config") || "{}";
    try { return JSON.parse(raw); } catch { return {}; }
  }

  function initTimer(el) {
    const cfg = parseConfig(el);

    const $time = el.querySelector("[data-time]");
    const $status = el.querySelector("[data-status]");
    const $round = el.querySelector("[data-round]");
    const $rounds = el.querySelector("[data-rounds]");
    const $phase = el.querySelector("[data-phase]");
    const $total = el.querySelector("[data-total]");

    const btnStart = el.querySelector('[data-action="start"]');
    const btnPause = el.querySelector('[data-action="pause"]');
    const btnStop  = el.querySelector('[data-action="stop"]');
    const btnReset = el.querySelector('[data-action="reset"]');

    const type = (cfg.type || "tabata").toLowerCase();
    const beepsOn = !!cfg.beeps;
    const voiceOn = !!cfg.voice;

    const prep = Number(cfg.prep ?? 10);
    const work = Number(cfg.work ?? 20);
    const rest = Number(cfg.rest ?? 10);
    const rounds = Number(cfg.rounds ?? 8);
    const minutes = Number(cfg.minutes ?? 10);

    $rounds.textContent = String(rounds);

    let intervalId = null;
    let running = false;

    // State
    let mode = "ready";        // ready | running | paused | done
    let phase = "ready";       // prep | work | rest | countdown | emom | stopwatch | done
    let secondsLeft = 0;       // countdown within current phase (not for stopwatch)
    let elapsed = 0;           // stopwatch elapsed
    let currentRound = 0;
    let totalRemaining = 0;

    // A plan is a list of steps: {phase, seconds, round?}
    let plan = [];
    let idx = 0;

    function setButtons() {
      btnStart.disabled = running;
      btnPause.disabled = !running;
      btnStop.disabled = !running;
    }

    function computeTotalRemaining() {
      if (type === "stopwatch") return 0;
      let t = secondsLeft;
      for (let i = idx + 1; i < plan.length; i++) t += plan[i].seconds;
      return t;
    }

    function render() {
      $status.textContent = mode === "paused" ? "Paused" : (mode === "running" ? "Running" : "Ready");
      $phase.textContent = phase.toUpperCase();

      if (type === "stopwatch") {
        $time.textContent = formatMMSS(elapsed);
        $total.textContent = formatMMSS(elapsed);
      } else {
        $time.textContent = formatMMSS(secondsLeft);
        $total.textContent = totalRemaining ? formatMMSS(totalRemaining) : "--";
      }

      $round.textContent = String(currentRound);
      setButtons();
    }

    function announcePhase(nextPhase) {
      if (voiceOn) {
        if (nextPhase === "work") speak("Work");
        if (nextPhase === "rest") speak("Rest");
        if (nextPhase === "done") speak("Stop");
      }
    }

    function buildPlan() {
      if (type === "tabata" || type === "interval") {
        const steps = [];
        if (prep > 0) steps.push({ phase: "prep", seconds: prep });

        for (let r = 1; r <= rounds; r++) {
          steps.push({ phase: "work", seconds: work, round: r });
          if (r < rounds && rest > 0) steps.push({ phase: "rest", seconds: rest, round: r });
        }
        steps.push({ phase: "done", seconds: 0 });
        return steps;
      }

      if (type === "emom") {
        // Simple EMOM: total minutes; each minute is a "work window".
        // (You can later add a "target reps" and “remaining time in minute” UI.)
        const steps = [];
        if (prep > 0) steps.push({ phase: "prep", seconds: prep });

        for (let m = 1; m <= minutes; m++) {
          steps.push({ phase: "emom", seconds: 60, round: m });
        }
        steps.push({ phase: "done", seconds: 0 });
        return steps;
      }

      if (type === "countdown") {
        const steps = [];
        if (prep > 0) steps.push({ phase: "prep", seconds: prep });
        steps.push({ phase: "countdown", seconds: minutes * 60, round: 0 });
        steps.push({ phase: "done", seconds: 0 });
        return steps;
      }

      // custom placeholder: treat as interval for now
      const steps = [];
      if (prep > 0) steps.push({ phase: "prep", seconds: prep });
      steps.push({ phase: "work", seconds: work, round: 1 });
      steps.push({ phase: "done", seconds: 0 });
      return steps;
    }

    function loadStep(i) {
      idx = i;
      const step = plan[idx] || { phase: "done", seconds: 0 };
      phase = step.phase;
      secondsLeft = step.seconds;
      currentRound = step.round || 0;
      totalRemaining = computeTotalRemaining();
      announcePhase(phase);
      render();
    }

    function stopInternal(toReady = false) {
      running = false;
      mode = toReady ? "ready" : mode;
      if (intervalId) clearInterval(intervalId);
      intervalId = null;
      setButtons();
      render();
    }

    function resetInternal() {
      stopInternal(true);
      mode = "ready";
      elapsed = 0;
      plan = buildPlan();
      loadStep(0);
      if (type === "stopwatch") {
        phase = "stopwatch";
        secondsLeft = 0;
        currentRound = 0;
      }
      render();
    }

    function tick() {
      if (!running) return;

      if (type === "stopwatch") {
        elapsed += 1;
        mode = "running";
        phase = "stopwatch";
        render();
        return;
      }

      // 3-second warning (beep)
      if (beepsOn && secondsLeft === 3) {
        beep();
        beep();
        beep();
      }

      if (secondsLeft > 0) {
        secondsLeft -= 1;
        totalRemaining = Math.max(0, totalRemaining - 1);
        render();
        return;
      }

      // step finished
      if (phase === "done") {
        if (beepsOn) beep();
        announcePhase("done");
        mode = "ready";
        stopInternal(true);
        return;
      }

      // advance
      loadStep(Math.min(idx + 1, plan.length - 1));
    }

    function startInternal() {
      if (running) return;

      // If stopwatch: just run
      if (type === "stopwatch") {
        running = true;
        mode = "running";
        intervalId = setInterval(tick, 1000);
        render();
        return;
      }

      // If we were at done, reset to beginning
      if (phase === "done") {
        resetInternal();
      }

      running = true;
      mode = "running";
      intervalId = setInterval(tick, 1000);
      render();
    }

    function pauseInternal() {
      if (!running) return;
      running = false;
      mode = "paused";
      if (intervalId) clearInterval(intervalId);
      intervalId = null;
      render();
    }

    btnStart?.addEventListener("click", startInternal);
    btnPause?.addEventListener("click", pauseInternal);
    btnStop?.addEventListener("click", () => resetInternal()); // Stop returns to Ready
    btnReset?.addEventListener("click", resetInternal);

    // Init
    if (type === "stopwatch") {
      phase = "stopwatch";
    }
    resetInternal();
  }

  function boot() {
    document.querySelectorAll("[data-timerist]").forEach(initTimer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
