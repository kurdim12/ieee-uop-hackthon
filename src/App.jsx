import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Submit from './pages/Submit.jsx';
import Login from './pages/Login.jsx';
import JudgeDashboard from './pages/JudgeDashboard.jsx';
import ScoreTeam from './pages/ScoreTeam.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import Admin from './pages/Admin.jsx';
import RequireJudge from './components/RequireJudge.jsx';
import RequireAdmin from './components/RequireAdmin.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/submit" element={<Submit />} />
      <Route path="/register" element={<Navigate to="/submit" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/judge"
        element={
          <RequireJudge>
            <JudgeDashboard />
          </RequireJudge>
        }
      />
      <Route
        path="/judge/:teamId"
        element={
          <RequireJudge>
            <ScoreTeam />
          </RequireJudge>
        }
      />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <Admin />
          </RequireAdmin>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
