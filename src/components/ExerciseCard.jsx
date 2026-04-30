import { Button } from 'react-bootstrap';

export default function ExerciseCard({ exercise, onRemove }) {
  return (
    <div className="exercise-item">
      <div>
        <div className="exercise-name">{exercise.name}</div>
        <div className="exercise-details">
          {exercise.sets > 0 && <span>{exercise.sets} sets</span>}
          {exercise.reps > 0 && <span>{exercise.reps} reps</span>}
          {exercise.weight > 0 && <span>{exercise.weight} kg</span>}
        </div>
      </div>
      {onRemove && (
        <Button
          variant="link"
          className="text-secondary p-1"
          onClick={() => onRemove(exercise.id)}
          title="Remove exercise"
          style={{ fontSize: '1.1rem' }}
        >
          <i className="bi bi-x-lg"></i>
        </Button>
      )}
    </div>
  );
}
