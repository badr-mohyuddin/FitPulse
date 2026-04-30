import { Offcanvas, Button, Stack } from 'react-bootstrap';

export default function ExerciseReorder({ show, onHide, exercises, onReorder, currentExerciseIndex }) {
  const moveExercise = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= exercises.length) return;
    // Don't allow moving completed/current exercises
    if (index <= currentExerciseIndex || newIndex <= currentExerciseIndex) return;
    const updated = [...exercises];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onReorder(updated);
  };

  const removeExercise = (index) => {
    if (index <= currentExerciseIndex) return;
    const updated = exercises.filter((_, i) => i !== index);
    onReorder(updated);
  };

  return (
    <Offcanvas show={show} onHide={onHide} placement="end" data-bs-theme="dark" className="reorder-offcanvas">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          <i className="bi bi-list-nested me-2"></i>Exercise Order
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="reorder-list">
          {exercises.map((ex, index) => {
            const isCompleted = index < currentExerciseIndex;
            const isCurrent = index === currentExerciseIndex;
            const isUpcoming = index > currentExerciseIndex;

            return (
              <div
                key={ex.id}
                className={`reorder-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
              >
                <div className="reorder-item-left">
                  <span className={`reorder-status ${isCompleted ? 'done' : isCurrent ? 'active' : 'pending'}`}>
                    {isCompleted ? <i className="bi bi-check-lg"></i> :
                     isCurrent ? <i className="bi bi-caret-right-fill"></i> :
                     <span>{index + 1}</span>}
                  </span>
                  <div>
                    <div className="reorder-exercise-name">{ex.name}</div>
                    <div className="reorder-exercise-meta">
                      {ex.sets} sets × {ex.reps} reps
                      {ex.weight > 0 && ` · ${ex.weight} kg`}
                    </div>
                  </div>
                </div>
                {isUpcoming && (
                  <div className="reorder-item-actions">
                    <button
                      className="btn-icon sm"
                      onClick={() => moveExercise(index, -1)}
                      disabled={index === currentExerciseIndex + 1}
                      title="Move up"
                    >
                      <i className="bi bi-chevron-up"></i>
                    </button>
                    <button
                      className="btn-icon sm"
                      onClick={() => moveExercise(index, 1)}
                      disabled={index === exercises.length - 1}
                      title="Move down"
                    >
                      <i className="bi bi-chevron-down"></i>
                    </button>
                    <button
                      className="btn-icon sm text-danger"
                      onClick={() => removeExercise(index)}
                      title="Remove"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}
