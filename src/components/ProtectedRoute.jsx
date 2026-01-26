import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    return decoded.exp < now;
  } catch (e) {
    return true;
  }
};
const ProtectedRoute = ({ role, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Chưa đăng nhập
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check role
  const rolesToCheck = allowedRoles || (role ? [role] : []);

  if (rolesToCheck.length > 0) {
    const hasPermission = rolesToCheck.includes(userRole);

    if (!hasPermission) {
      return <Navigate to="/403" replace />;
    }
  }

  if (isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
