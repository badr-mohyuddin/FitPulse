import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button, Badge, Stack, Modal } from 'react-bootstrap';
import TemplateForm from '../components/TemplateForm';
import { useLocalStorage } from '../hooks/useLocalStorage';

export default function Templates() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useLocalStorage('fitpulse-templates', []);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const handleSave = (template) => {
    setTemplates(prev => {
      const existing = prev.findIndex(t => t.id === template.id);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = template;
        return updated;
      }
      return [...prev, template];
    });
    setEditingTemplate(null);
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
    setDeleteConfirm(null);
  };

  const handleStartWorkout = (template) => {
    navigate(`/workout?template=${template.id}`);
  };

  const handleNewTemplate = () => {
    setEditingTemplate(null);
    setShowForm(true);
  };

  return (
    <Container className="py-4 fade-in">
      {/* Header */}
      <Stack direction="horizontal" className="mb-4 flex-wrap gap-2">
        <div className="me-auto">
          <h1 className="fw-bold mb-1" style={{ letterSpacing: '-0.5px' }}>Templates</h1>
          <p className="text-secondary mb-0">
            {templates.length} workout template{templates.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        <Button variant="primary" onClick={handleNewTemplate}>
          <i className="bi bi-plus-lg me-1"></i>New Template
        </Button>
      </Stack>

      {/* Template Cards */}
      {templates.length > 0 ? (
        <div className="template-card-grid">
          {templates.map(template => (
            <Card key={template.id} className="template-card slide-up">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h5 className="fw-bold mb-1">{template.name}</h5>
                    <div className="d-flex gap-2 align-items-center">
                      <Badge bg="dark" className="border" style={{ borderColor: 'var(--border-subtle)' }}>
                        <i className="bi bi-list-check me-1"></i>
                        {template.exercises.length} exercise{template.exercises.length !== 1 ? 's' : ''}
                      </Badge>
                      <small className="text-secondary">
                        Updated {new Date(template.updatedAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>

                {/* Exercise Preview */}
                <div className="template-exercises-preview">
                  {template.exercises.slice(0, 4).map((ex, i) => (
                    <div key={i} className="template-exercise-preview-item">
                      <span className="template-preview-dot"></span>
                      <span className="template-preview-name">{ex.name}</span>
                      <span className="template-preview-info">
                        {ex.sets}×{ex.reps}
                        {ex.weight > 0 && ` · ${ex.weight}kg`}
                      </span>
                    </div>
                  ))}
                  {template.exercises.length > 4 && (
                    <div className="template-preview-more">
                      +{template.exercises.length - 4} more
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="template-card-actions">
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleStartWorkout(template)}
                  >
                    <i className="bi bi-play-fill me-1"></i>Start Workout
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleEdit(template)}
                  >
                    <i className="bi bi-pencil me-1"></i>Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteConfirm(template)}
                  >
                    <i className="bi bi-trash3"></i>
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center">
          <Card.Body className="py-5">
            <div className="empty-state">
              <i className="bi bi-journal-bookmark d-block"></i>
              <h4>No templates yet</h4>
              <p className="mb-3">Create reusable workout templates to get started quickly!</p>
              <Button variant="primary" size="lg" onClick={handleNewTemplate}>
                <i className="bi bi-plus-lg me-1"></i>Create Your First Template
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Template Form Modal */}
      <TemplateForm
        show={showForm}
        onHide={() => { setShowForm(false); setEditingTemplate(null); }}
        onSave={handleSave}
        template={editingTemplate}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        show={!!deleteConfirm}
        onHide={() => setDeleteConfirm(null)}
        centered
        data-bs-theme="dark"
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>"{deleteConfirm?.name}"</strong>?
          This cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setDeleteConfirm(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(deleteConfirm.id)}>
            <i className="bi bi-trash3 me-1"></i>Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
