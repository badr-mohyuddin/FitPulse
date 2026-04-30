import { useState } from 'react';
import { Card, Form, Row, Col, Button, Dropdown } from 'react-bootstrap';

const exerciseTypes = [
  'Bench Press', 'Squat', 'Deadlift', 'Overhead Press',
  'Barbell Row', 'Pull-ups', 'Bicep Curls', 'Tricep Dips',
  'Lunges', 'Leg Press', 'Lat Pulldown', 'Cable Fly',
  'Plank', 'Crunches', 'Running', 'Cycling', 'Custom'
];

export default function ExerciseForm({ onAdd }) {
  const [name, setName] = useState('');
  const [customName, setCustomName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const exerciseName = name === 'Custom' ? customName : name;
    if (!exerciseName) return;

    onAdd({
      id: Date.now(),
      name: exerciseName,
      sets: parseInt(sets) || 0,
      reps: parseInt(reps) || 0,
      weight: parseFloat(weight) || 0,
    });

    setName('');
    setCustomName('');
    setSets('');
    setReps('');
    setWeight('');
  };

  return (
    <Card className="mb-3 slide-up">
      <Card.Body>
        <h6 className="text-uppercase text-secondary fw-bold small mb-3">
          <i className="bi bi-plus-circle me-2"></i>Add Exercise
        </h6>
        <Form onSubmit={handleSubmit}>
          <Row className="g-2 mb-2">
            <Col xs={12} md={3}>
              <Form.Label>Exercise</Form.Label>
              <Dropdown className="bs-dropdown-full">
                <Dropdown.Toggle variant="outline-secondary" className="w-100 bs-dropdown-toggle">
                  {name || 'Select exercise...'}
                </Dropdown.Toggle>
                <Dropdown.Menu className="bs-dropdown-menu w-100">
                  {exerciseTypes.map(type => (
                    <Dropdown.Item key={type} onClick={() => setName(type)} active={name === type}>
                      {type}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Col>
            <Col xs={4} md={3}>
              <Form.Label>Sets</Form.Label>
              <Form.Control
                type="number"
                placeholder="3"
                min="0"
                value={sets}
                onChange={(e) => setSets(e.target.value)}
              />
            </Col>
            <Col xs={4} md={3}>
              <Form.Label>Reps</Form.Label>
              <Form.Control
                type="number"
                placeholder="10"
                min="0"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
              />
            </Col>
            <Col xs={4} md={3}>
              <Form.Label>Weight (kg)</Form.Label>
              <Form.Control
                type="number"
                placeholder="0"
                min="0"
                step="0.5"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </Col>
          </Row>
          {name === 'Custom' && (
            <Form.Group className="mb-2">
              <Form.Label>Exercise Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter exercise name..."
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
              />
            </Form.Group>
          )}
          <Button type="submit" variant="primary" className="w-100">
            <i className="bi bi-plus-lg"></i>
            Add Exercise
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
