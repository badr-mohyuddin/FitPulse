export function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export default function TimerDisplay({ time, isRunning, isFinished }) {
  const className = `timer-display ${isRunning ? 'running' : ''} ${isFinished ? 'finished' : ''} ${!isRunning && !isFinished && time > 0 ? 'paused' : ''}`;

  return (
    <div className={className}>
      {formatTime(time)}
    </div>
  );
}
