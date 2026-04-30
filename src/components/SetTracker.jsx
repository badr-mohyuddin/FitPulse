import { useState, useEffect, useCallback } from 'react';

export default function SetTracker({
  exercise,
  currentSetIndex,
  onCompleteSet,
  onUpdateSetData,
}) {
  const [actualReps, setActualReps] = useState(exercise.reps);
  const [actualWeight, setActualWeight] = useState(exercise.weight);

  useEffect(() => {
    const setData = exercise.setsData?.[currentSetIndex];
    setActualReps(setData?.reps ?? exercise.reps);
    setActualWeight(setData?.weight ?? exercise.weight);
  }, [exercise, currentSetIndex]);

  const handleComplete = useCallback(() => {
    onUpdateSetData(currentSetIndex, {
      reps: parseInt(actualReps) || 0,
      weight: parseFloat(actualWeight) || 0,
      completed: true,
    });
    onCompleteSet();
  }, [actualReps, actualWeight, currentSetIndex, onCompleteSet, onUpdateSetData]);

  const completedCount = exercise.setsData?.filter(s => s.completed).length || 0;

  return (
    <div className="set-tracker">
      <div className="set-tracker-exercise-name">{exercise.name}</div>
      <div className="set-tracker-counter">
        Set {currentSetIndex + 1} <span className="set-tracker-of">of</span> {exercise.sets}
      </div>

      {/* Progress dots */}
      <div className="set-progress-dots">
        {Array.from({ length: exercise.sets }, (_, i) => (
          <div
            key={i}
            className={`set-dot ${
              i < completedCount ? 'completed' :
              i === currentSetIndex ? 'current' : 'upcoming'
            }`}
          >
            {i < completedCount ? (
              <i className="bi bi-check-lg"></i>
            ) : (
              i + 1
            )}
          </div>
        ))}
      </div>

      {/* Editable reps and weight */}
      <div className="set-tracker-inputs">
        <div className="set-input-group">
          <label className="set-input-label">Reps</label>
          <div className="set-input-control">
            <button
              className="set-input-btn"
              onClick={() => setActualReps(Math.max(0, parseInt(actualReps) - 1))}
            >
              <i className="bi bi-dash"></i>
            </button>
            <input
              type="number"
              className="set-input-value"
              value={actualReps}
              onChange={(e) => setActualReps(e.target.value)}
              min="0"
            />
            <button
              className="set-input-btn"
              onClick={() => setActualReps(parseInt(actualReps) + 1)}
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>
        </div>

        <div className="set-input-divider">×</div>

        <div className="set-input-group">
          <label className="set-input-label">Weight (kg)</label>
          <div className="set-input-control">
            <button
              className="set-input-btn"
              onClick={() => setActualWeight(Math.max(0, parseFloat(actualWeight) - 2.5))}
            >
              <i className="bi bi-dash"></i>
            </button>
            <input
              type="number"
              className="set-input-value"
              value={actualWeight}
              onChange={(e) => setActualWeight(e.target.value)}
              min="0"
              step="0.5"
            />
            <button
              className="set-input-btn"
              onClick={() => setActualWeight(parseFloat(actualWeight) + 2.5)}
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>
        </div>
      </div>

      <button className="btn-complete-set" onClick={handleComplete}>
        <i className="bi bi-check-circle-fill me-2"></i>
        Complete Set
      </button>
    </div>
  );
}
