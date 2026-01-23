import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AdminUserList from "./pages/admin/AdminUserList";
import AdminUserForm from "./pages/admin/AdminUserForm";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminUserAdd from "./pages/admin/AdminUserAdd";
import RegisterForm from "./pages/RegisterForm";
import ProductManagement from "./pages/sale/ProductManagement";
import Profile from "./pages/user/Profile";
import MyOrders from "./pages/user/MyOrders";
import Cart from "./pages/user/Cart";
import ProductList from "./pages/shop/ProductList";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">
        <Header />
        <main className="app-main">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<ProductList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/shop" element={<ProductList />} />

            {/* Protected User Routes */}
            <Route
              path="/user"
              element={
                <ProtectedRoute role="ROLE_CUSTOMER" />
              }
            >
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<MyOrders />} />
              <Route path="cart" element={<Cart />} />
            </Route>

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
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
