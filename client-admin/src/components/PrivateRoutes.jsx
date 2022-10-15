import { Navigate, Outlet,useLocation } from 'react-router-dom';
import { useAdminAuthContext } from '../context/AdminAuthContext';

const PrivateRoutes = () => {
  const location = useLocation();
  const { isAuthenticated } = useAdminAuthContext();

  if (isAuthenticated === undefined) {
    return null; // or loading indicator/spinner/etc
  }

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/admin/login" replace state={{ from: location }} />;
}
export default PrivateRoutes