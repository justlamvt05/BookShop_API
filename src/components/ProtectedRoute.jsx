import { Navigate, Outlet } from "react-router-dom";

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

  return <Outlet />;
};

export default ProtectedRoute;
