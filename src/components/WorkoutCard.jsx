import { Card, Button, Badge } from 'react-bootstrap';
import { formatTime } from './TimerDisplay';

export default function WorkoutCard({ workout, onDelete }) {
  const date = new Date(workout.date);
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalSets = workout.exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0);
  const totalWeight = workout.exercises.reduce((sum, ex) => sum + ((ex.weight || 0) * (ex.sets || 1) * (ex.reps || 1)), 0);

  return (
    <Card className="mb-3 slide-up">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <div>
            <h6 className="fw-bold mb-0">{workout.name || 'Workout'}</h6>
            <small className="text-secondary">{formattedDate} · {formattedTime}</small>
          </div>
          {onDelete && (
            <Button variant="danger" size="sm" onClick={() => onDelete(workout.id)}>
              <i className="bi bi-trash3 me-1"></i>Delete
            </Button>
          )}
        </div>

        <div className="d-flex gap-3 mb-3 flex-wrap">
          <span className="workout-meta-item">
            <i className="bi bi-lightning-charge"></i>
            {workout.exercises.length} exercises
          </span>
          <span className="workout-meta-item">
            <i className="bi bi-layers"></i>
            {totalSets} sets
          </span>
          {workout.duration > 0 && (
            <span className="workout-meta-item">
              <i className="bi bi-clock"></i>
              {formatTime(workout.duration)}
            </span>
          )}
          {totalWeight > 0 && (
            <span className="workout-meta-item">
              <i className="bi bi-bar-chart-fill"></i>
              {Math.round(totalWeight).toLocaleString()} kg
            </span>
          )}
        </div>

        {/* Exercise list */}
        {workout.exercises.map(ex => (
          <div key={ex.id} className="exercise-item">
            <div>
              <div className="exercise-name">{ex.name}</div>
              <div className="exercise-details">
                {ex.sets > 0 && <span>{ex.sets} sets</span>}
                {ex.reps > 0 && <span>{ex.reps} reps</span>}
                {ex.weight > 0 && <span>{ex.weight} kg</span>}
              </div>
            </div>
            {ex.weight > 0 && (
              <Badge bg="dark" className="border" style={{ borderColor: 'var(--border-subtle)' }}>
                {((ex.weight || 0) * (ex.sets || 1) * (ex.reps || 1)).toLocaleString()} kg
              </Badge>
            )}
          </div>
        ))}
      </Card.Body>
    </Card>
  );
}
