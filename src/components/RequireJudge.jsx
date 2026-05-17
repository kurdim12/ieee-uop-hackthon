import { Navigate, useLocation } from 'react-router-dom';
import { getJudge } from '../lib/auth.js';

export default function RequireJudge({ children }) {
  const judge = getJudge();
  const location = useLocation();
  if (!judge) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
