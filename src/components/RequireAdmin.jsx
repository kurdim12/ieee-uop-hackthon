import { Navigate, useLocation } from 'react-router-dom';
import { getAdmin } from '../lib/auth.js';

export default function RequireAdmin({ children }) {
  const admin = getAdmin();
  const location = useLocation();
  if (!admin) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
