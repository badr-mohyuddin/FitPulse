import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', icon: 'bi-grid-1x2-fill', label: 'Home' },
  { to: '/workout', icon: 'bi-lightning-charge-fill', label: 'Workout' },
  { to: '/templates', icon: 'bi-journal-bookmark-fill', label: 'Templates' },
  { to: '/schedule', icon: 'bi-calendar3', label: 'Schedule' },
  { to: '/timer', icon: 'bi-stopwatch-fill', label: 'Timer' },
];

export default function MobileNav() {
  return (
    <nav className="mobile-bottom-nav">
      {navItems.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          <i className={`bi ${item.icon}`}></i>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
