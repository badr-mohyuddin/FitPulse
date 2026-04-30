import { Row, Col, Card } from 'react-bootstrap';

export default function StatsBar({ workouts }) {
  const totalWorkouts = workouts.length;

  const totalExercises = workouts.reduce((sum, w) => sum + w.exercises.length, 0);

  const totalVolume = workouts.reduce((sum, w) => {
    return sum + w.exercises.reduce((s, ex) => s + ((ex.weight || 0) * (ex.sets || 1) * (ex.reps || 1)), 0);
  }, 0);

  // Calculate streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let streak = 0;
  const sortedDates = [...new Set(
    workouts.map(w => {
      const d = new Date(w.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    })
  )].sort((a, b) => b - a);

  if (sortedDates.length > 0) {
    const checkDate = new Date(today);
    if (sortedDates[0] === today.getTime()) {
      streak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      if (sortedDates[0] === yesterday.getTime()) {
        streak = 1;
        checkDate.setDate(checkDate.getDate() - 2);
      }
    }

    if (streak > 0) {
      for (let i = 1; i < sortedDates.length; i++) {
        if (sortedDates[i] === checkDate.getTime()) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
  }

  const stats = [
    { value: totalWorkouts, label: 'Total Workouts', color: 'blue', icon: 'bi-lightning-charge-fill' },
    { value: totalExercises, label: 'Total Exercises', color: 'green', icon: 'bi-list-check' },
    { value: streak, label: 'Day Streak', color: 'orange', icon: 'bi-fire' },
    { value: totalVolume > 0 ? `${(totalVolume / 1000).toFixed(1)}k` : '0', label: 'Volume (kg)', color: 'purple', icon: 'bi-bar-chart-fill' },
  ];

  return (
    <Row className="g-2 mb-4">
      {stats.map((stat, i) => (
        <Col xs={6} md={3} key={i}>
          <Card className="stat-card h-100">
            <Card.Body className="text-center py-3">
              <i className={`bi ${stat.icon} d-block mb-1`} style={{ fontSize: '1.2rem', color: `var(--accent-${stat.color})`, opacity: 0.6 }}></i>
              <div className={`stat-value ${stat.color}`}>{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
