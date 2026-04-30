import { useState, useRef, useCallback, useEffect } from 'react';

export function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(0);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    startTimeRef.current = Date.now() - pausedTimeRef.current;
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 50);
  }, [isRunning]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    setIsRunning(false);
    pausedTimeRef.current = elapsed;
    clearInterval(intervalRef.current);
  }, [isRunning, elapsed]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setElapsed(0);
    pausedTimeRef.current = 0;
    clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return { elapsed, isRunning, start, pause, reset };
}

export function useCountdown(initialSeconds = 60) {
  const [remaining, setRemaining] = useState(initialSeconds * 1000);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef(null);
  const targetRef = useRef(null);

  const start = useCallback(() => {
    if (isRunning || remaining <= 0) return;
    setIsRunning(true);
    setIsFinished(false);
    targetRef.current = Date.now() + remaining;
    intervalRef.current = setInterval(() => {
      const left = targetRef.current - Date.now();
      if (left <= 0) {
        setRemaining(0);
        setIsRunning(false);
        setIsFinished(true);
        clearInterval(intervalRef.current);
        // Play beep sound
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
          osc.stop(ctx.currentTime + 0.5);
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
          }, 300);
        } catch (e) {
          // Audio not available
        }
      } else {
        setRemaining(left);
      }
    }, 50);
  }, [isRunning, remaining]);

  const pause = useCallback(() => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  }, []);

  const resetTimer = useCallback((seconds) => {
    setIsRunning(false);
    setIsFinished(false);
    setRemaining((seconds || initialSeconds) * 1000);
    clearInterval(intervalRef.current);
  }, [initialSeconds]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return { remaining, isRunning, isFinished, start, pause, reset: resetTimer };
}
