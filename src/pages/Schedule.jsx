import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Modal } from 'react-bootstrap';
import CalendarGrid from '../components/CalendarGrid';
import RoutineEditor from '../components/RoutineEditor';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Schedule() {
  const navigate = useNavigate();
  const [templates] = useLocalStorage('fitpulse-templates', []);
  const [routine, setRoutine] = useLocalStorage('fitpulse-routine', null);
  const [workouts] = useLocalStorage('fitpulse-workouts', []);
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDayModal, setShowDayModal] = useState(false);

  const getScheduledTemplates = (date) => {
    if (!routine) return [];
    const templateIds = [];

    if (routine.type === 'weekly') {
      const dayOfWeek = date.getDay();
      templateIds.push(...(routine.weekly[dayOfWeek] || []));
    } else if (routine.type === 'cycle') {
      const startDate = new Date(routine.cycle.startDate);
      startDate.setHours(0, 0, 0, 0);
      const diffTime = date.getTime() - startDate.getTime();
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

  const getCompletedWorkouts = (date) => {
    return workouts.filter(w => {
      const d = new Date(w.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === date.getTime();
    });
  };

  const handleDayClick = (date) => {
    setSelectedDay(date);
    setShowDayModal(true);
  };

  const handleSaveRoutine = (newRoutine) => {
    setRoutine(newRoutine);
    setActiveTab('calendar');
  };

  const handleStartWorkout = (template) => {
    navigate(`/workout?template=${template.id}`);
    setShowDayModal(false);
  };

  const renderDayContent = (date) => {
    const scheduled = getScheduledTemplates(date);
    const completed = getCompletedWorkouts(date);

    return (
      <>
        {scheduled.map((t, i) => (
          <div key={i} className="calendar-scheduled-pill">
            {t.name}
          </div>
        ))}
        {completed.length > 0 && (
          <div className="calendar-completed-badge">
            <i className="bi bi-check-circle-fill"></i>
          </div>
        )}
      </>
    );
  };

  const selectedScheduled = selectedDay ? getScheduledTemplates(selectedDay) : [];
  const selectedCompleted = selectedDay ? getCompletedWorkouts(selectedDay) : [];

  return (
    <Container className="py-4 fade-in">
      {/* Header */}
      <div className="mb-4">
        <h1 className="fw-bold mb-1" style={{ letterSpacing: '-0.5px' }}>Schedule</h1>
        <p className="text-secondary mb-0">Plan your workout routine and track your calendar</p>
      </div>

      {/* Tab Toggle */}
      <div className="timer-mode-toggle mb-4" style={{ maxWidth: '320px' }}>
        <button
          className={`timer-mode-btn ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <i className="bi bi-calendar3 me-1"></i>Calendar
        </button>
        <button
          className={`timer-mode-btn ${activeTab === 'routine' ? 'active' : ''}`}
          onClick={() => setActiveTab('routine')}
        >
          <i className="bi bi-gear me-1"></i>Routine
        </button>
      </div>

      {activeTab === 'calendar' ? (
        <Card>
          <Card.Body>
            {routine ? (
              <CalendarGrid
                onDayClick={handleDayClick}
                renderDay={renderDayContent}
              />
            ) : (
              <div className="empty-state">
                <i className="bi bi-calendar3 d-block"></i>
                <h4>No routine set up</h4>
                <p className="mb-3">Set up a weekly or cycle routine to see your schedule</p>
                <Button variant="primary" onClick={() => setActiveTab('routine')}>
                  <i className="bi bi-gear me-1"></i>Set Up Routine
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      ) : (
        <Card>
          <Card.Body>
            {templates.length > 0 ? (
              <RoutineEditor
                routine={routine}
                templates={templates}
                onSave={handleSaveRoutine}
              />
            ) : (
              <div className="empty-state">
                <i className="bi bi-journal-bookmark d-block"></i>
                <h4>No templates found</h4>
                <p className="mb-3">Create workout templates first, then assign them to your routine</p>
                <Button variant="primary" onClick={() => navigate('/templates')}>
                  <i className="bi bi-plus-lg me-1"></i>Create Templates
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* Day Detail Modal */}
      <Modal
        show={showDayModal}
        onHide={() => setShowDayModal(false)}
        centered
        data-bs-theme="dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-calendar-event me-2"></i>
            {selectedDay?.toLocaleDateString('en-US', {
              weekday: 'long', month: 'long', day: 'numeric'
            })}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedScheduled.length > 0 ? (
            <>
              <h6 className="text-uppercase text-secondary fw-bold small mb-3">
                <i className="bi bi-clipboard-check me-2"></i>Scheduled
              </h6>
              {selectedScheduled.map((template, i) => (
                <div key={i} className="exercise-item mb-2">
                  <div>
                    <div className="exercise-name">{template.name}</div>
                    <div className="exercise-details">
                      <span>{template.exercises.length} exercises</span>
                    </div>
                  </div>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleStartWorkout(template)}
                  >
                    <i className="bi bi-play-fill me-1"></i>Start
                  </Button>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center text-secondary py-3">
              <i className="bi bi-moon-stars d-block mb-2" style={{ fontSize: '2rem', opacity: 0.3 }}></i>
              <p>No workout scheduled for this day</p>
            </div>
          )}

          {selectedCompleted.length > 0 && (
            <>
              <hr style={{ borderColor: 'var(--border-subtle)' }} />
              <h6 className="text-uppercase text-secondary fw-bold small mb-3">
                <i className="bi bi-check-circle me-2" style={{ color: 'var(--accent-green)' }}></i>Completed
              </h6>
              {selectedCompleted.map(w => (
                <div key={w.id} className="exercise-item mb-2">
                  <div>
                    <div className="exercise-name">{w.name}</div>
                    <div className="exercise-details">
                      <span>{w.exercises.length} exercises</span>
                    </div>
                  </div>
                  <i className="bi bi-check-circle-fill" style={{ color: 'var(--accent-green)' }}></i>
                </div>
              ))}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => {
            setShowDayModal(false);
            navigate('/workout');
          }}>
            <i className="bi bi-plus-lg me-1"></i>Freeform Workout
          </Button>
          <Button variant="outline-secondary" onClick={() => {
            setShowDayModal(false);
            navigate('/templates');
          }}>
            <i className="bi bi-journal-bookmark me-1"></i>Pick Template
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
