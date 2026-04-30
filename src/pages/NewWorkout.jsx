import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Container, Card, Button, Form, Stack, Collapse, ProgressBar } from 'react-bootstrap';
import ExerciseForm from '../components/ExerciseForm';
import SetTracker from '../components/SetTracker';
import RestTimerInline from '../components/RestTimerInline';
import ExerciseReorder from '../components/ExerciseReorder';
import TimerDisplay from '../components/TimerDisplay';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTimer } from '../hooks/useTimer';
import { useCookies } from '../hooks/useCookies';

export default function NewWorkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get('template');

  const [templates] = useLocalStorage('fitpulse-templates', []);
  const [workouts, setWorkouts] = useLocalStorage('fitpulse-workouts', []);
  const [defaultRest] = useCookies('fitpulse-rest-time', 60);

  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restDuration, setRestDuration] = useState(defaultRest);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutFinished, setWorkoutFinished] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [showReorder, setShowReorder] = useState(false);

  const stopwatch = useTimer();

  // Load template if provided
  useEffect(() => {
    if (templateId) {
      const template = templates.find(t => t.id === parseInt(templateId));
      if (template) {
        setWorkoutName(template.name);
        setExercises(template.exercises.map(ex => ({
          ...ex,
          id: Date.now() + Math.random(),
          completedSets: 0,
          setsData: Array.from({ length: ex.sets }, () => ({
            reps: ex.reps,
            weight: ex.weight,
            completed: false,
          })),
        })));
        setWorkoutStarted(true);
        stopwatch.start();
      }
    }
  }, []); // Run once on mount

  const addExercise = (exercise) => {
    const guidedExercise = {
      ...exercise,
      restSeconds: exercise.restSeconds || defaultRest,
      completedSets: 0,
      setsData: Array.from({ length: exercise.sets || 1 }, () => ({
        reps: exercise.reps || 0,
        weight: exercise.weight || 0,
        completed: false,
      })),
    };
    setExercises(prev => [...prev, guidedExercise]);
    setShowExerciseForm(false);

    if (!workoutStarted) {
      setWorkoutStarted(true);
      stopwatch.start();
    }
  };

  const removeExercise = (id) => {
    const index = exercises.findIndex(ex => ex.id === id);
    if (index <= currentExerciseIndex) return; // Can't remove completed/current
    setExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const currentExercise = exercises[currentExerciseIndex];

  const handleUpdateSetData = useCallback((setIndex, data) => {
    setExercises(prev => prev.map((ex, i) => {
      if (i !== currentExerciseIndex) return ex;
      const newSetsData = [...ex.setsData];
      newSetsData[setIndex] = data;
      return { ...ex, setsData: newSetsData };
    }));
  }, [currentExerciseIndex]);

  const handleCompleteSet = useCallback(() => {
    const exercise = exercises[currentExerciseIndex];
    if (!exercise) return;

    const nextSetIndex = currentSetIndex + 1;

    if (nextSetIndex >= exercise.sets) {
      // All sets done for this exercise
      setExercises(prev => prev.map((ex, i) =>
        i === currentExerciseIndex ? { ...ex, completedSets: ex.sets } : ex
      ));

      const nextExerciseIndex = currentExerciseIndex + 1;
      if (nextExerciseIndex >= exercises.length) {
        // Workout complete!
        setWorkoutFinished(true);
        stopwatch.pause();
        return;
      }

      // Rest before next exercise
      setRestDuration(exercise.restSeconds || defaultRest);
      setIsResting(true);
    } else {
      // More sets left — rest then next set
      setRestDuration(exercise.restSeconds || defaultRest);
      setIsResting(true);
    }
  }, [currentExerciseIndex, currentSetIndex, exercises, defaultRest, stopwatch]);

  const handleRestFinish = useCallback(() => {
    setIsResting(false);
    const exercise = exercises[currentExerciseIndex];
    const nextSetIndex = currentSetIndex + 1;

    if (nextSetIndex >= exercise.sets) {
      // Move to next exercise
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSetIndex(0);
    } else {
      setCurrentSetIndex(nextSetIndex);
    }
  }, [currentExerciseIndex, currentSetIndex, exercises]);

  const handleSkipRest = useCallback(() => {
    handleRestFinish();
  }, [handleRestFinish]);

  const handleReorder = (newExercises) => {
    setExercises(newExercises);
  };

  const jumpToExercise = (index) => {
    if (index <= currentExerciseIndex) return;
    setCurrentExerciseIndex(index);
    setCurrentSetIndex(0);
  };

  const finishWorkout = () => {
    stopwatch.pause();
    const workout = {
      id: Date.now(),
      name: workoutName || `Workout ${workouts.length + 1}`,
      date: new Date().toISOString(),
      exercises: exercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        sets: ex.setsData?.filter(s => s.completed).length || ex.sets,
        reps: ex.reps,
        weight: ex.weight,
      })),
      duration: stopwatch.elapsed,
    };
    setWorkouts([...workouts, workout]);
    navigate('/history');
  };

  const discardWorkout = () => {
    if (exercises.length > 0 && !window.confirm('Discard this workout? All progress will be lost.')) {
      return;
    }
    stopwatch.reset();
    navigate('/');
  };

  // Calculate progress
  const totalSets = exercises.reduce((sum, ex) => sum + (ex.sets || 0), 0);
  const completedSets = exercises.reduce((sum, ex) => {
    return sum + (ex.setsData?.filter(s => s.completed).length || 0);
  }, 0);
  const progress = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <Container className="py-4 fade-in">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="fw-bold mb-1" style={{ letterSpacing: '-0.5px' }}>
          {templateId ? workoutName || 'Guided Workout' : 'New Workout'}
        </h1>
        <p className="text-secondary mb-0">
          {workoutFinished ? 'Workout complete! 🎉' :
           workoutStarted ? 'Follow along set by set' :
           'Add exercises and track your session'}
        </p>
      </div>

      {/* Workout Name */}
      {!templateId && (
        <Form.Control
          type="text"
          className="workout-name-input mb-3"
          placeholder="Workout name (e.g. Push Day)"
          value={workoutName}
          onChange={(e) => setWorkoutName(e.target.value)}
        />
      )}

      {/* Timer & Progress */}
      {workoutStarted && (
        <Card className="mb-3">
          <Card.Body className="py-3">
            <div className="guided-workout-header">
              <div className="guided-timer-compact">
                <i className="bi bi-stopwatch me-2" style={{ color: 'var(--accent-blue)' }}></i>
                <TimerDisplay time={stopwatch.elapsed} isRunning={stopwatch.isRunning} />
              </div>
              <div className="guided-progress-section">
                <div className="guided-progress-text">
                  {completedSets}/{totalSets} sets
                </div>
                <ProgressBar
                  now={progress}
                  variant="info"
                  className="guided-progress-bar"
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Workout Complete State */}
      {workoutFinished && (
        <Card className="mb-3 text-center card-glow">
          <Card.Body className="py-5">
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🏆</div>
            <h3 className="fw-bold mb-2">Workout Complete!</h3>
            <p className="text-secondary mb-4">
              You completed {completedSets} sets across {exercises.length} exercises
            </p>
            <Stack direction="horizontal" gap={2} className="justify-content-center">
              <Button variant="success" size="lg" onClick={finishWorkout}>
                <i className="bi bi-check-lg me-1"></i>Save Workout
              </Button>
              <Button variant="outline-secondary" onClick={discardWorkout}>
                Discard
              </Button>
            </Stack>
          </Card.Body>
        </Card>
      )}

      {/* Active Guided Workout */}
      {workoutStarted && !workoutFinished && currentExercise && (
        <>
          {/* Rest Timer */}
          {isResting ? (
            <Card className="mb-3 text-center">
              <Card.Body className="py-4">
                <RestTimerInline
                  seconds={restDuration}
                  onFinish={handleRestFinish}
                  onSkip={handleSkipRest}
                />
              </Card.Body>
            </Card>
          ) : (
            /* Set Tracker */
            <Card className="mb-3">
              <Card.Body className="py-4">
                <SetTracker
                  exercise={currentExercise}
                  currentSetIndex={currentSetIndex}
                  onCompleteSet={handleCompleteSet}
                  onUpdateSetData={handleUpdateSetData}
                />
              </Card.Body>
            </Card>
          )}
        </>
      )}

      {/* Exercise List / Sidebar */}
      {exercises.length > 0 && !workoutFinished && (
        <Card className="mb-3">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="text-uppercase text-secondary fw-bold small mb-0">
                <i className="bi bi-list-check me-2"></i>Exercises ({exercises.length})
              </h6>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={() => setShowReorder(true)}
              >
                <i className="bi bi-list-nested me-1"></i>Reorder
              </Button>
            </div>
            {exercises.map((ex, index) => {
              const isCompleted = index < currentExerciseIndex;
              const isCurrent = index === currentExerciseIndex;
              const completedSetCount = ex.setsData?.filter(s => s.completed).length || 0;

              return (
                <div
                  key={ex.id}
                  className={`guided-exercise-item ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
                  onClick={() => !isCompleted && !isCurrent && jumpToExercise(index)}
                >
                  <div className="guided-exercise-status">
                    {isCompleted ? (
                      <span className="guided-status-icon done">
                        <i className="bi bi-check-lg"></i>
                      </span>
                    ) : isCurrent ? (
                      <span className="guided-status-icon active">
                        <i className="bi bi-caret-right-fill"></i>
                      </span>
                    ) : (
                      <span className="guided-status-icon pending">{index + 1}</span>
                    )}
                  </div>
                  <div className="guided-exercise-info">
                    <div className={`guided-exercise-name ${isCompleted ? 'text-decoration-line-through text-secondary' : ''}`}>
                      {ex.name}
                    </div>
                    <div className="exercise-details">
                      <span>{completedSetCount}/{ex.sets} sets</span>
                      <span>{ex.reps} reps</span>
                      {ex.weight > 0 && <span>{ex.weight} kg</span>}
                    </div>
                  </div>
                  {!isCompleted && !isCurrent && (
                    <button
                      className="btn-icon sm text-danger"
                      onClick={(e) => { e.stopPropagation(); removeExercise(ex.id); }}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  )}
                </div>
              );
            })}
          </Card.Body>
        </Card>
      )}

      {/* Add Exercise (always available) */}
      {!workoutFinished && (
        <>
          <Button
            variant="outline-secondary"
            className="w-100 mb-3"
            onClick={() => setShowExerciseForm(!showExerciseForm)}
          >
            <i className={`bi ${showExerciseForm ? 'bi-chevron-up' : 'bi-plus-lg'} me-2`}></i>
            {showExerciseForm ? 'Hide Exercise Form' : 'Add Exercise'}
          </Button>
          <Collapse in={showExerciseForm}>
            <div>
              <ExerciseForm onAdd={addExercise} />
            </div>
          </Collapse>
        </>
      )}

      {/* Discard / Finish buttons */}
      {workoutStarted && !workoutFinished && exercises.length > 0 && (
        <Stack direction="horizontal" gap={2} className="justify-content-between mt-3">
          <Button variant="danger" onClick={discardWorkout}>
            <i className="bi bi-trash3 me-1"></i>Discard
          </Button>
          <Button variant="success" size="lg" onClick={finishWorkout}>
            <i className="bi bi-check-lg me-1"></i>Finish Early
          </Button>
        </Stack>
      )}

      {/* Exercise Reorder Panel */}
      <ExerciseReorder
        show={showReorder}
        onHide={() => setShowReorder(false)}
        exercises={exercises}
        onReorder={handleReorder}
        currentExerciseIndex={currentExerciseIndex}
      />
    </Container>
  );
}
