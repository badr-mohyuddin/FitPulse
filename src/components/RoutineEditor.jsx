import { useState } from 'react';
import { Form, Button, Row, Col, Card, Dropdown } from 'react-bootstrap';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function RoutineEditor({ routine, templates, onSave }) {
  const [type, setType] = useState(routine?.type || 'weekly');
  const [weekly, setWeekly] = useState(routine?.weekly || {
    0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: []
  });
  const [cycleDays, setCycleDays] = useState(routine?.cycle?.days || [
    { label: 'Day 1', templateIds: [] },
    { label: 'Day 2', templateIds: [] },
    { label: 'Rest', templateIds: [] },
  ]);
  const [cycleStartDate, setCycleStartDate] = useState(
    routine?.cycle?.startDate || new Date().toISOString().split('T')[0]
  );

  const handleWeeklyChange = (dayIndex, templateId) => {
    setWeekly(prev => ({
      ...prev,
      [dayIndex]: prev[dayIndex]?.includes(templateId)
        ? prev[dayIndex].filter(id => id !== templateId)
        : [...(prev[dayIndex] || []), templateId]
    }));
  };

  const handleWeeklySelect = (dayIndex, templateId) => {
    if (!templateId) {
      setWeekly(prev => ({ ...prev, [dayIndex]: [] }));
    } else {
      const tid = parseInt(templateId);
      setWeekly(prev => ({
        ...prev,
        [dayIndex]: prev[dayIndex]?.includes(tid)
          ? prev[dayIndex]
          : [...(prev[dayIndex] || []), tid]
      }));
    }
  };

  const addCycleDay = () => {
    setCycleDays(prev => [
      ...prev,
      { label: `Day ${prev.length + 1}`, templateIds: [] }
    ]);
  };

  const removeCycleDay = (index) => {
    setCycleDays(prev => prev.filter((_, i) => i !== index));
  };

  const updateCycleDayLabel = (index, label) => {
    setCycleDays(prev => prev.map((d, i) => i === index ? { ...d, label } : d));
  };

  const updateCycleDayTemplate = (index, templateId) => {
    setCycleDays(prev => prev.map((d, i) => {
      if (i !== index) return d;
      if (!templateId) return { ...d, templateIds: [] };
      const tid = parseInt(templateId);
      return {
        ...d,
        templateIds: d.templateIds.includes(tid)
          ? d.templateIds
          : [...d.templateIds, tid]
      };
    }));
  };

  const removeCycleDayTemplate = (dayIndex, templateId) => {
    setCycleDays(prev => prev.map((d, i) => {
      if (i !== dayIndex) return d;
      return { ...d, templateIds: d.templateIds.filter(id => id !== templateId) };
    }));
  };

  const handleSave = () => {
    onSave({
      type,
      weekly,
      cycle: {
        days: cycleDays,
        startDate: cycleStartDate,
      }
    });
  };

  const getTemplateName = (id) => {
    return templates.find(t => t.id === id)?.name || 'Unknown';
  };

  return (
    <div className="routine-editor">
      {/* Mode Toggle */}
      <div className="timer-mode-toggle mb-4" style={{ maxWidth: '320px' }}>
        <button
          className={`timer-mode-btn ${type === 'weekly' ? 'active' : ''}`}
          onClick={() => setType('weekly')}
        >
          <i className="bi bi-calendar-week me-1"></i>Weekly
        </button>
        <button
          className={`timer-mode-btn ${type === 'cycle' ? 'active' : ''}`}
          onClick={() => setType('cycle')}
        >
          <i className="bi bi-arrow-repeat me-1"></i>Cycle
        </button>
      </div>

      {type === 'weekly' ? (
        <div className="routine-weekly-grid">
          {WEEKDAYS.map((day, i) => (
            <Card key={i} className="routine-day-card d-flex justify-content-center">
              <Card.Body>
                <div className="routine-day-label">{SHORT_DAYS[i]}</div>
                <div className="routine-day-full">{day}</div>
                <Dropdown className="mt-2 mb-2 bs-dropdown-full" style={{ overflow: 'visible' }}>
                  <Dropdown.Toggle variant="outline-secondary" size="sm" className="w-100 bs-dropdown-toggle">
                    <i className="bi bi-plus-lg me-1"></i>Add template
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="bs-dropdown-menu bs-dropdown-menu-routine" renderOnMount>
                    {templates.map(t => (
                      <Dropdown.Item
                        key={t.id}
                        onClick={() => handleWeeklySelect(i, t.id)}
                      >
                        {t.name}
                      </Dropdown.Item>
                    ))}
                    {templates.length === 0 && (
                      <Dropdown.Item disabled>No templates available</Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
                <div className="routine-day-templates">
                  {(weekly[i] || []).map(tid => (
                    <span key={tid} className="routine-template-pill">
                      {getTemplateName(tid)}
                      <button onClick={() => handleWeeklyChange(i, tid)}>
                        <i className="bi bi-x"></i>
                      </button>
                    </span>
                  ))}
                  {(!weekly[i] || weekly[i].length === 0) && (
                    <span className="routine-rest-label">Rest Day</span>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <div className="routine-cycle-editor">
          <div className="mb-3">
            <Form.Label>Cycle Start Date</Form.Label>
            <Form.Control
              type="date"
              value={cycleStartDate}
              onChange={(e) => setCycleStartDate(e.target.value)}
              style={{ maxWidth: '220px' }}
            />
          </div>

          <div className="cycle-days-list">
            {cycleDays.map((day, index) => (
              <div key={index} className="cycle-day-item slide-up">
                <div className="cycle-day-header">
                  <Form.Control
                    type="text"
                    value={day.label}
                    onChange={(e) => updateCycleDayLabel(index, e.target.value)}
                    className="cycle-day-name-input"
                    placeholder="Day name..."
                  />
                  <button
                    className="btn-icon text-danger"
                    onClick={() => removeCycleDay(index)}
                    disabled={cycleDays.length <= 1}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>
                <Dropdown className="mb-2 bs-dropdown-full">
                  <Dropdown.Toggle variant="outline-secondary" size="sm" className="w-100 bs-dropdown-toggle">
                    <i className="bi bi-plus-lg me-1"></i>Add template
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="bs-dropdown-menu bs-dropdown-menu-routine" popperConfig={{ strategy: 'fixed' }} renderOnMount>
                    {templates.map(t => (
                      <Dropdown.Item
                        key={t.id}
                        onClick={() => updateCycleDayTemplate(index, t.id)}
                      >
                        {t.name}
                      </Dropdown.Item>
                    ))}
                    {templates.length === 0 && (
                      <Dropdown.Item disabled>No templates available</Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
                <div className="routine-day-templates">
                  {day.templateIds.map(tid => (
                    <span key={tid} className="routine-template-pill">
                      {getTemplateName(tid)}
                      <button onClick={() => removeCycleDayTemplate(index, tid)}>
                        <i className="bi bi-x"></i>
                      </button>
                    </span>
                  ))}
                  {day.templateIds.length === 0 && (
                    <span className="routine-rest-label">Rest Day</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline-secondary" className="w-100 mt-3" onClick={addCycleDay}>
            <i className="bi bi-plus-lg me-2"></i>Add Day to Cycle
          </Button>
        </div>
      )}

      <Button variant="primary" className="w-100 mt-4" onClick={handleSave}>
        <i className="bi bi-check-lg me-2"></i>Save Routine
      </Button>
    </div>
  );
}
