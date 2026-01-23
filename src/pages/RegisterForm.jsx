import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../service/authService";

function RegisterForm() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await register(form);
      alert("✅ Register success");
      navigate("/login");
    } catch (err) {
      console.log(err.response.data.message);
      setError(err.response.data.message);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      padding: "2rem 0"
    }}>
      <div className="card shadow" style={{
        maxWidth: "500px",
        width: "100%",
        margin: "0 1rem"
      }}>
        <div className="card-body">
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <h2 style={{ marginBottom: "0.5rem" }}>Register</h2>
            <p style={{ color: "#7f8c8d", fontSize: "0.95rem" }}>
              Create a new account
            </p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                className="form-control"
                name="username"
                placeholder="Enter your username"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                className="form-control"
                name="email"
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    className="form-control"
                    name="firstName"
                    placeholder="First name"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    className="form-control"
                    name="lastName"
                    placeholder="Last name"
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                className="form-control"
                type="password"
                name="password"
                placeholder="Enter password"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                className="form-control"
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                className="form-control"
                name="phoneNumber"
                placeholder="10 digits"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                className="form-control"
                name="address"
                placeholder="Enter address"
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-success w-100" style={{ padding: "0.75rem", marginTop: "1rem" }}>
              Register
            </button>
          </form>
        </div>

        <div className="card-footer text-center" style={{ borderTop: "1px solid #e0e0e0" }}>
          <span style={{ color: "#7f8c8d" }}>Already have an account? </span>
          <Link to="/login" style={{
            color: "#3498db",
            textDecoration: "none",
            fontWeight: "600"
          }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
