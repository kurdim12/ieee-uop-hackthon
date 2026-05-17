import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import JudgeDashboard from './pages/JudgeDashboard.jsx';
import ScoreTeam from './pages/ScoreTeam.jsx';
import Leaderboard from './pages/Leaderboard.jsx';
import RequireJudge from './components/RequireJudge.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
