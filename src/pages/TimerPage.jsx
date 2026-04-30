import { useState } from 'react';
import { Container, Card, Button, Form, Stack, Row, Col } from 'react-bootstrap';
import TimerDisplay from '../components/TimerDisplay';
import { useTimer, useCountdown } from '../hooks/useTimer';
import { useCookies } from '../hooks/useCookies';

export default function TimerPage() {
  const [mode, setMode] = useState('stopwatch');
  const [defaultRest, setDefaultRest] = useCookies('fitpulse-rest-time', 60);
  const [customInput, setCustomInput] = useState('');

  const stopwatch = useTimer();
  const countdown = useCountdown(defaultRest);

  const handlePreset = (seconds) => {
    setDefaultRest(seconds);
    countdown.reset(seconds);
  };

  const handleCustom = () => {
    const seconds = parseInt(customInput);
    if (seconds > 0) {
      setDefaultRest(seconds);
      countdown.reset(seconds);
      setCustomInput('');
    }
  };

  return (
    <Container className="py-4 fade-in">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="fw-bold mb-1" style={{ letterSpacing: '-0.5px' }}>Timer</h1>
        <p className="text-secondary mb-0">Track your workout time or set rest intervals</p>
      </div>

      <div className="d-flex flex-column align-items-center">
        {/* Mode Toggle */}
        <div className="timer-mode-toggle" style={{ maxWidth: '320px', width: '100%' }}>
          <button
            className={`timer-mode-btn ${mode === 'stopwatch' ? 'active' : ''}`}
            onClick={() => setMode('stopwatch')}
          >
            <i className="bi bi-stopwatch me-1"></i>
            Stopwatch
          </button>
          <button
            className={`timer-mode-btn ${mode === 'countdown' ? 'active' : ''}`}
            onClick={() => setMode('countdown')}
          >
            <i className="bi bi-hourglass-split me-1"></i>
            Countdown
          </button>
        </div>

        {/* Timer Display */}
        <Card style={{ width: '100%', maxWidth: '480px' }}>
          <Card.Body className="text-center py-5">
            {mode === 'stopwatch' ? (
              <>
                <TimerDisplay time={stopwatch.elapsed} isRunning={stopwatch.isRunning} />
                <Stack direction="horizontal" gap={2} className="justify-content-center mt-4 flex-wrap">
                  {!stopwatch.isRunning ? (
                    <Button variant="success" size="lg" onClick={stopwatch.start}>
                      <i className="bi bi-play-fill"></i>
                      {stopwatch.elapsed > 0 ? 'Resume' : 'Start'}
                    </Button>
                  ) : (
                    <Button variant="outline-secondary" size="lg" onClick={stopwatch.pause}>
                      <i className="bi bi-pause-fill"></i>
                      Pause
                    </Button>
                  )}
                  <Button variant="outline-secondary" size="lg" onClick={stopwatch.reset}>
                    <i className="bi bi-arrow-counterclockwise"></i>
                    Reset
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                <TimerDisplay
                  time={countdown.remaining}
                  isRunning={countdown.isRunning}
                  isFinished={countdown.isFinished}
                />

                {/* Presets */}
                <div className="d-flex gap-2 justify-content-center flex-wrap my-4">
                  {[30, 45, 60, 90, 120, 180].map(sec => (
                    <button
                      key={sec}
                      className={`preset-btn ${defaultRest === sec ? 'active' : ''}`}
                      onClick={() => handlePreset(sec)}
                    >
                      {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                    </button>
                  ))}
                </div>

                {/* Custom Input */}
                <Stack direction="horizontal" gap={2} className="justify-content-center mb-4">
                  <Form.Control
                    type="number"
                    placeholder="Custom (sec)"
                    value={customInput}
                    onChange={(e) => setCustomInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCustom()}
                    min="1"
                    style={{ maxWidth: '140px' }}
                  />
                  <Button variant="outline-secondary" onClick={handleCustom}>Set</Button>
                </Stack>

                {/* Controls */}
                <Stack direction="horizontal" gap={2} className="justify-content-center flex-wrap">
                  {!countdown.isRunning && !countdown.isFinished ? (
                    <Button variant="success" size="lg" onClick={countdown.start}>
                      <i className="bi bi-play-fill"></i>
                      Start
                    </Button>
                  ) : countdown.isRunning ? (
                    <Button variant="outline-secondary" size="lg" onClick={countdown.pause}>
                      <i className="bi bi-pause-fill"></i>
                      Pause
                    </Button>
                  ) : null}
                  <Button variant="outline-secondary" size="lg" onClick={() => countdown.reset(defaultRest)}>
                    <i className="bi bi-arrow-counterclockwise"></i>
                    Reset
                  </Button>
                </Stack>
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
