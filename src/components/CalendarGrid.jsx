import { useState } from 'react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarGrid({ year, month, onDayClick, renderDay }) {
  const [currentYear, setCurrentYear] = useState(year || new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(month ?? new Date().getMonth());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const startOffset = firstDay.getDay();
  const totalDays = lastDay.getDate();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  const cells = [];
  // Empty cells before first day
  for (let i = 0; i < startOffset; i++) {
    cells.push(<div key={`empty-${i}`} className="calendar-cell empty"></div>);
  }
  // Day cells
  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(currentYear, currentMonth, day);
    date.setHours(0, 0, 0, 0);
    const isToday = date.getTime() === today.getTime();
    const dayContent = renderDay?.(date, day);

    cells.push(
      <div
        key={day}
        className={`calendar-cell ${isToday ? 'today' : ''}`}
        onClick={() => onDayClick?.(date)}
      >
        <span className="calendar-day-number">{day}</span>
        <div className="calendar-day-content">
          {dayContent}
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-grid-wrapper">
      <div className="calendar-header">
        <button className="btn-icon" onClick={prevMonth}>
          <i className="bi bi-chevron-left"></i>
        </button>
        <div className="calendar-title" onClick={goToToday}>
          {MONTH_NAMES[currentMonth]} {currentYear}
        </div>
        <button className="btn-icon" onClick={nextMonth}>
          <i className="bi bi-chevron-right"></i>
        </button>
      </div>
      <div className="calendar-weekdays">
        {DAYS.map(d => (
          <div key={d} className="calendar-weekday">{d}</div>
        ))}
      </div>
      <div className="calendar-grid">
        {cells}
      </div>
    </div>
  );
}
