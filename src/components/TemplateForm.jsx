import { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Stack, Dropdown } from 'react-bootstrap';

const exerciseTypes = [
  'Bench Press', 'Squat', 'Deadlift', 'Overhead Press',
  'Barbell Row', 'Pull-ups', 'Bicep Curls', 'Tricep Dips',
  'Lunges', 'Leg Press', 'Lat Pulldown', 'Cable Fly',
  'Plank', 'Crunches', 'Running', 'Cycling', 'Custom'
];

const emptyExercise = () => ({
  id: Date.now() + Math.random(),
  name: '',
  customName: '',
  sets: 3,
  reps: 10,
  weight: 0,
  restSeconds: 90,
});

export default function TemplateForm({ show, onHide, onSave, template }) {
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    if (template) {
      setName(template.name);
      setExercises(template.exercises.map(ex => ({
        ...ex,
        customName: exerciseTypes.includes(ex.name) ? '' : ex.name,
        name: exerciseTypes.includes(ex.name) ? ex.name : 'Custom',
      })));
    } else {
      setName('');
      setExercises([emptyExercise()]);
    }
  }, [template, show]);

  const addExercise = () => {
    setExercises(prev => [...prev, emptyExercise()]);
  };

  const removeExercise = (id) => {
    setExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const updateExercise = (id, field, value) => {
    setExercises(prev => prev.map(ex =>
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const moveExercise = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= exercises.length) return;
    const updated = [...exercises];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setExercises(updated);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    const validExercises = exercises
      .filter(ex => ex.name)
      .map(ex => ({
        id: ex.id,
        name: ex.name === 'Custom' ? ex.customName : ex.name,
        sets: parseInt(ex.sets) || 3,
        reps: parseInt(ex.reps) || 10,
        weight: parseFloat(ex.weight) || 0,
        restSeconds: parseInt(ex.restSeconds) || 90,
      }))
      .filter(ex => ex.name);
    
    if (validExercises.length === 0) return;

    onSave({
      id: template?.id || Date.now(),
      name: name.trim(),
      exercises: validExercises,
      createdAt: template?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered data-bs-theme="dark" className="template-form-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-journal-bookmark me-2"></i>
          {template ? 'Edit Template' : 'New Template'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-4">
          <Form.Label>Template Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="e.g. Push Day, Upper Body, Leg Day..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="workout-name-input"
          />
        </Form.Group>

        <h6 className="text-uppercase text-secondary fw-bold small mb-3">
          <i className="bi bi-list-check me-2"></i>Exercises ({exercises.length})
        </h6>

        <div className="template-exercise-list">
          {exercises.map((ex, index) => (
            <div key={ex.id} className="template-exercise-item slide-up">
              <div className="template-exercise-header">
                <span className="template-exercise-number">{index + 1}</span>
                <div className="template-exercise-actions">
                  <button
                    className="btn-icon"
                    onClick={() => moveExercise(index, -1)}
                    disabled={index === 0}
                    title="Move up"
                  >
                    <i className="bi bi-chevron-up"></i>
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => moveExercise(index, 1)}
                    disabled={index === exercises.length - 1}
                    title="Move down"
                  >
                    <i className="bi bi-chevron-down"></i>
                  </button>
                  {exercises.length > 1 && (
                    <button
                      className="btn-icon text-danger"
                      onClick={() => removeExercise(ex.id)}
                      title="Remove"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  )}
                </div>
              </div>
              <Row className="g-2">
                <Col xs={12} md={4}>
                  <Form.Label>Exercise</Form.Label>
                  <Dropdown className="bs-dropdown-full">
                    <Dropdown.Toggle variant="outline-secondary" className="w-100 bs-dropdown-toggle">
                      {ex.name || 'Select exercise...'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="bs-dropdown-menu w-100">
                      {exerciseTypes.map(type => (
                        <Dropdown.Item
                          key={type}
                          onClick={() => updateExercise(ex.id, 'name', type)}
                          active={ex.name === type}
                        >
                          {type}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
                {ex.name === 'Custom' && (
                  <Col xs={12} md={8}>
                    <Form.Label>Custom Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Exercise name..."
                      value={ex.customName}
                      onChange={(e) => updateExercise(ex.id, 'customName', e.target.value)}
                    />
                  </Col>
                )}
                <Col xs={3} md={2}>
                  <Form.Label>Sets</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={ex.sets}
                    onChange={(e) => updateExercise(ex.id, 'sets', e.target.value)}
                  />
                </Col>
                <Col xs={3} md={2}>
                  <Form.Label>Reps</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={ex.reps}
                    onChange={(e) => updateExercise(ex.id, 'reps', e.target.value)}
                  />
                </Col>
                <Col xs={3} md={2}>
                  <Form.Label>Weight</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.5"
                    value={ex.weight}
                    onChange={(e) => updateExercise(ex.id, 'weight', e.target.value)}
                  />
                </Col>
                <Col xs={3} md={2}>
                  <Form.Label>Rest (s)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={ex.restSeconds}
                    onChange={(e) => updateExercise(ex.id, 'restSeconds', e.target.value)}
                  />
                </Col>
              </Row>
            </div>
          ))}
        </div>

        <Button variant="outline-secondary" className="w-100 mt-3" onClick={addExercise}>
          <i className="bi bi-plus-lg me-2"></i>Add Exercise
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSave}>
          <i className="bi bi-check-lg me-1"></i>
          {template ? 'Save Changes' : 'Create Template'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
