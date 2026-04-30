import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import StatsBar from '../components/StatsBar';
import WorkoutCard from '../components/WorkoutCard';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Dashboard() {
  const navigate = useNavigate();
  const [workouts] = useLocalStorage('fitpulse-workouts', []);
  const [templates] = useLocalStorage('fitpulse-templates', []);
  const [routine] = useLocalStorage('fitpulse-routine', null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayWorkouts = workouts.filter(w => {
    const d = new Date(w.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === today.getTime();
  });

  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  // Get today's scheduled templates from routine
  const getTodayScheduled = () => {
    if (!routine) return [];
    const templateIds = [];

    if (routine.type === 'weekly') {
      const dayOfWeek = today.getDay();
      templateIds.push(...(routine.weekly[dayOfWeek] || []));
    } else if (routine.type === 'cycle') {
      const startDate = new Date(routine.cycle.startDate);
      startDate.setHours(0, 0, 0, 0);
      const diffTime = today.getTime() - startDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      if (routine.cycle.days.length > 0) {
        const cycleIndex = ((diffDays % routine.cycle.days.length) + routine.cycle.days.length) % routine.cycle.days.length;
        templateIds.push(...(routine.cycle.days[cycleIndex]?.templateIds || []));
      }
    }

    return templateIds
      .map(id => templates.find(t => t.id === id))
      .filter(Boolean);
  };

  const todayScheduled = getTodayScheduled();

  return (
    <Container className="py-4 fade-in">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="fw-bold mb-1" style={{ letterSpacing: '-0.5px' }}>Dashboard</h1>
        <p className="text-secondary mb-0">
          {todayWorkouts.length > 0
            ? `You've crushed ${todayWorkouts.length} workout${todayWorkouts.length > 1 ? 's' : ''} today! 💪`
            : "Ready to get after it? Let's go! 🔥"
          }
        </p>
      </div>

      {/* Today's Workout */}
      {todayScheduled.length > 0 ? (
        <Card className="mb-4 card-glow today-workout-card">
          <Card.Body className="py-4">
            <h6 className="text-uppercase text-secondary fw-bold small mb-3">
              <i className="bi bi-calendar-check me-2" style={{ color: 'var(--accent-green)' }}></i>
              Today's Workout
            </h6>
            {todayScheduled.map((template, i) => (
              <div key={i} className="today-scheduled-item">
                <div>
                  <div className="fw-bold">{template.name}</div>
                  <div className="exercise-details">
                    <span>{template.exercises.length} exercises</span>
                    <span>{template.exercises.reduce((s, e) => s + e.sets, 0)} total sets</span>
                  </div>
                </div>
                <Button
                  variant="success"
                  onClick={() => navigate(`/workout?template=${template.id}`)}
                >
                  <i className="bi bi-play-fill me-1"></i>Start
                </Button>
              </div>
            ))}
            <div className="mt-3">
              <Link to="/templates" className="text-secondary small">
                <i className="bi bi-arrow-right me-1"></i>Or pick a different workout
              </Link>
            </div>
          </Card.Body>
        </Card>
      ) : routine ? (
        <Card className="mb-4">
          <Card.Body className="py-3">
            <div className="d-flex align-items-center gap-3">
              <i className="bi bi-moon-stars" style={{ fontSize: '1.5rem', color: 'var(--accent-purple)', opacity: 0.6 }}></i>
              <div>
                <div className="fw-semibold">Rest Day</div>
                <small className="text-secondary">No workout scheduled today</small>
              </div>
              <Button variant="outline-secondary" size="sm" className="ms-auto" as={Link} to="/workout">
                Workout Anyway
              </Button>
            </div>
          </Card.Body>
        </Card>
      ) : null}

      {/* Stats */}
      <StatsBar workouts={workouts} />

      {/* Quick Actions */}
      <Row className="g-3 mb-4">
        <Col xs={6} lg={3}>
          <Card as={Link} to="/workout" className="quick-action-card h-100 text-decoration-none">
            <Card.Body className="py-4">
              <div className="quick-action-icon blue">
                <i className="bi bi-plus-lg"></i>
              </div>
              <div className="fw-semibold text-light">New Workout</div>
              <small className="text-secondary">Start tracking</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} lg={3}>
          <Card as={Link} to="/templates" className="quick-action-card h-100 text-decoration-none">
            <Card.Body className="py-4">
              <div className="quick-action-icon green">
                <i className="bi bi-journal-bookmark"></i>
              </div>
              <div className="fw-semibold text-light">Templates</div>
              <small className="text-secondary">Saved workouts</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} lg={3}>
          <Card as={Link} to="/schedule" className="quick-action-card h-100 text-decoration-none">
            <Card.Body className="py-4">
              <div className="quick-action-icon purple">
                <i className="bi bi-calendar3"></i>
              </div>
              <div className="fw-semibold text-light">Schedule</div>
              <small className="text-secondary">Plan your week</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} lg={3}>
          <Card as={Link} to="/timer" className="quick-action-card h-100 text-decoration-none">
            <Card.Body className="py-4">
              <div className="quick-action-icon orange">
                <i className="bi bi-stopwatch"></i>
              </div>
              <div className="fw-semibold text-light">Timer</div>
              <small className="text-secondary">Stopwatch & rest</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Workouts */}
      {recentWorkouts.length > 0 && (
        <div>
          <h6 className="text-uppercase text-secondary fw-bold small mb-3">
            <i className="bi bi-clock-history me-2"></i>Recent Workouts
          </h6>
          {recentWorkouts.map(workout => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {workouts.length === 0 && !routine && (
        <Card className="text-center">
          <Card.Body className="py-5">
            <div className="empty-state">
              <i className="bi bi-lightning-charge d-block"></i>
              <h4>No workouts yet</h4>
              <p className="mb-3">Start your fitness journey by logging your first workout!</p>
              <Button as={Link} to="/workout" variant="primary" size="lg">
                <i className="bi bi-plus-lg"></i>
                Start First Workout
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
