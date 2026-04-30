import { useState, useEffect, useRef, useCallback } from 'react';

export default function RestTimerInline({ seconds, onFinish, onSkip }) {
  const [remaining, setRemaining] = useState(seconds * 1000);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef(null);
  const targetRef = useRef(Date.now() + seconds * 1000);
  const totalMs = seconds * 1000;

  useEffect(() => {
    targetRef.current = Date.now() + seconds * 1000;
    setRemaining(seconds * 1000);
    setIsRunning(true);
  }, [seconds]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      const left = targetRef.current - Date.now();
      if (left <= 0) {
        setRemaining(0);
        setIsRunning(false);
        clearInterval(intervalRef.current);
        // Play beep
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 880;
          osc.type = 'sine';
          gain.gain.value = 0.3;
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
          setTimeout(() => {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.frequency.value = 1100;
            osc2.type = 'sine';
            gain2.gain.value = 0.3;
            osc2.start();
            osc2.stop(ctx.currentTime + 0.3);
          }, 250);
        } catch (e) { /* no audio */ }
        setTimeout(() => onFinish?.(), 800);
      } else {
        setRemaining(left);
      }
    }, 50);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, onFinish]);

  const progress = 1 - remaining / totalMs;
  const displaySeconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(displaySeconds / 60);
  const secs = displaySeconds % 60;

  // SVG circle values
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="rest-timer-inline">
      <div className="rest-timer-label">Rest Timer</div>
      <div className="rest-timer-ring-container">
        <svg width="180" height="180" viewBox="0 0 180 180">
          {/* Background circle */}
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="90" cy="90" r={radius}
            fill="none"
            stroke="var(--accent-blue)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 90 90)"
            className="rest-timer-progress-ring"
          />
        </svg>
        <div className="rest-timer-time">
          {minutes > 0 ? `${minutes}:${String(secs).padStart(2, '0')}` : secs}
          {minutes === 0 && <span className="rest-timer-unit">s</span>}
        </div>
      </div>
      <button className="btn-skip-rest" onClick={onSkip}>
        <i className="bi bi-skip-forward-fill me-2"></i>Skip Rest
      </button>
    </div>
  );
}
