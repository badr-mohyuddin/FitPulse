import { NavLink } from 'react-router-dom';

const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const WorkoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h11"/><path d="M6.5 17.5h11"/>
    <path d="M4 6.5V10a1 1 0 001 1h1.5V6.5H4z"/><path d="M4 17.5V14a1 1 0 011-1h1.5v4.5H4z"/>
    <path d="M20 6.5V10a1 1 0 01-1 1h-1.5V6.5H20z"/><path d="M20 17.5V14a1 1 0 00-1-1h-1.5v4.5H20z"/>
    <line x1="12" y1="6.5" x2="12" y2="17.5"/>
  </svg>
);

const HistoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><polyline points="12,7 12,12 15,15"/>
  </svg>
);

const TimerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/>
    <path d="M5 3L2 6"/><path d="M22 6l-3-3"/><line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="10" y1="1" x2="14" y2="1"/>
  </svg>
);

const navItems = [
  { to: '/', icon: <DashboardIcon />, label: 'Dashboard' },
  { to: '/workout', icon: <WorkoutIcon />, label: 'Workout' },
  { to: '/history', icon: <HistoryIcon />, label: 'History' },
  { to: '/timer', icon: <TimerIcon />, label: 'Timer' },
];

export default function Navigation() {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="16" cy="16" r="12"/>
            <path d="M10 16h12"/><path d="M16 10v12"/>
          </svg>
          <h1>FitPulse</h1>
        </div>
        <nav>
          <ul className="nav-links">
            {navItems.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="bottom-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `bottom-nav-link ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
