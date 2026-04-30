import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';

const navItems = [
  { to: '/', icon: 'bi-grid-1x2-fill', label: 'Dashboard' },
  { to: '/workout', icon: 'bi-lightning-charge-fill', label: 'Workout' },
  { to: '/templates', icon: 'bi-journal-bookmark-fill', label: 'Templates' },
  { to: '/history', icon: 'bi-clock-history', label: 'History' },
  { to: '/schedule', icon: 'bi-calendar3', label: 'Schedule' },
  { to: '/timer', icon: 'bi-stopwatch-fill', label: 'Timer' },
];

export default function AppNavbar() {
  return (
    <Navbar fixed="top" expand="lg" className="desktop-nav" data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          <i className="bi bi-heart-pulse-fill me-2" style={{ fontSize: '1.3rem' }}></i>
          FitPulse
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            {navItems.map(item => (
              <Nav.Link
                key={item.to}
                as={NavLink}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </Nav.Link>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
