import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AdminUserList from "./pages/admin/AdminUserList";
import AdminUserForm from "./pages/admin/AdminUserForm";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminUserAdd from "./pages/admin/AdminUserAdd";
import RegisterForm from "./pages/RegisterForm";
import ProductManagement from "./pages/sale/ProductManagement";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>HOME</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} />
        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="ROLE_ADMIN" />
          }
        >
          <Route path="users" element={<AdminUserList />} />
          <Route path="users/:id" element={<AdminUserForm />} />
          <Route path="users/new" element={<AdminUserAdd />} />
        </Route>

        {/* Protected Sale Routes */}
        <Route
          path="/sale"
          element={
            <ProtectedRoute role="ROLE_SALE" />
          }
        >
          <Route path="products" element={<ProductManagement />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
