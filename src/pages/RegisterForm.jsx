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
    } catch(err) {
      console.log(err.response.data.message); 
      setError(err.response.data.message);
    }
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow p-4" style={{ width: 500 }}>
        <h3 className="text-center mb-3">📝 Register</h3>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input className="form-control mb-2" name="username" placeholder="Username" onChange={handleChange} required />
          <input className="form-control mb-2" type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input className="form-control mb-2" type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />
          <input className="form-control mb-2" name="email" placeholder="Email" onChange={handleChange} required />
          <input className="form-control mb-2" name="firstName" placeholder="First Name" onChange={handleChange} required />
          <input className="form-control mb-2" name="lastName" placeholder="Last Name" onChange={handleChange} required />
          <input className="form-control mb-2" name="phoneNumber" placeholder="Phone (10 digits)" onChange={handleChange} required />
          <input className="form-control mb-3" name="address" placeholder="Address" onChange={handleChange} />

          <button className="btn btn-success w-100">
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          <Link to="/login">← Back to Login</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
