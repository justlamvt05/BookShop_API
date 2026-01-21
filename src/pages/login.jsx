import { useState } from "react";
import { login } from "../service/authService";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await login(username, password);
      const { token, roles } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", roles);

      if (roles === "ROLE_ADMIN") navigate("/admin/users");
      else if (roles === "ROLE_SALE") navigate("/sale/products");
      else navigate("/user");

    } catch(err) {
      console.log(err.response.data.message); 
      setError(err.response.data.message);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow p-4" style={{ width: 400 }}>
        <h3 className="text-center mb-3">🔐 Login</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            className="form-control mb-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn btn-primary w-100">
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <span>Don’t have an account? </span>
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
