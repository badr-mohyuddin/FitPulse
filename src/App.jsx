import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import MobileNav from './components/MobileNav';
import Dashboard from './pages/Dashboard';
import NewWorkout from './pages/NewWorkout';
import Templates from './pages/Templates';
import History from './pages/History';
import Schedule from './pages/Schedule';
import TimerPage from './pages/TimerPage';

export default function App() {
  return (
    <BrowserRouter>
      <div data-bs-theme="dark">
        <AppNavbar />
        <main className="page-wrapper">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workout" element={<NewWorkout />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/history" element={<History />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/timer" element={<TimerPage />} />
          </Routes>
        </main>
        <MobileNav />
      </div>
    </BrowserRouter>
  );
}
