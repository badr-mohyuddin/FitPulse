import { useState } from 'react';
import { Container, Button, ButtonGroup, Stack } from 'react-bootstrap';
import WorkoutCard from '../components/WorkoutCard';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function History() {
  const [workouts, setWorkouts] = useLocalStorage('fitpulse-workouts', []);
  const [filter, setFilter] = useState('all');

  const deleteWorkout = (id) => {
    if (!window.confirm('Delete this workout?')) return;
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  const clearAll = () => {
    if (!window.confirm('Delete ALL workout history? This cannot be undone.')) return;
    setWorkouts([]);
  };

  // Filter workouts
  const now = new Date();
  const filteredWorkouts = [...workouts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter(w => {
      if (filter === 'all') return true;
      const d = new Date(w.date);
      const diffDays = (now - d) / (1000 * 60 * 60 * 24);
      if (filter === 'week') return diffDays <= 7;
      if (filter === 'month') return diffDays <= 30;
      return true;
    });

  const filters = [
    { key: 'all', label: 'All Time' },
    { key: 'week', label: 'This Week' },
    { key: 'month', label: 'This Month' },
  ];

  return (
    <Container className="py-4 fade-in">
      {/* Header */}
      <Stack direction="horizontal" className="mb-4 flex-wrap gap-2">
        <div className="me-auto">
          <h1 className="fw-bold mb-1" style={{ letterSpacing: '-0.5px' }}>History</h1>
          <p className="text-secondary mb-0">
            {workouts.length} total workout{workouts.length !== 1 ? 's' : ''} logged
          </p>
        </div>
        {workouts.length > 0 && (
          <Button variant="danger" size="sm" onClick={clearAll}>
            <i className="bi bi-trash3 me-1"></i>Clear All
          </Button>
        )}
      </Stack>

      {/* Filters */}
      <div className="d-flex gap-2 mb-4 flex-wrap">
        {filters.map(f => (
          <button
            key={f.key}
            className={`preset-btn ${filter === f.key ? 'active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Workout list */}
      {filteredWorkouts.length > 0 ? (
        filteredWorkouts.map(workout => (
          <WorkoutCard key={workout.id} workout={workout} onDelete={deleteWorkout} />
        ))
      ) : (
        <div className="empty-state card">
          <div className="card-body py-5">
            <i className="bi bi-clock-history d-block"></i>
            <h4>{workouts.length === 0 ? 'No workouts yet' : 'No workouts in this period'}</h4>
            <p>{workouts.length === 0 ? 'Complete your first workout to see it here!' : 'Try adjusting the filter.'}</p>
          </div>
        </div>
      )}
    </Container>
  );
}
