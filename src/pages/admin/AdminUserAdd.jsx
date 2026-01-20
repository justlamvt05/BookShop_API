import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../service/adminService";

function AdminUserAdd() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    userName: "",
    password: "",
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    role: "ROLE_CUSTOMER"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUser(form);
      alert("✅ Add user successfully");
      
    } catch (err) {
      const msg = err.response?.data?.message || "Add user failed";
      alert(msg);
    }
  };

  return (
    <div className="container mt-4">
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "0.5rem" }}>Add New User</h2>
        <p style={{ color: "#7f8c8d" }}>Create a new user account</p>
      </div>

      <form className="card shadow" onSubmit={handleSubmit}>
        <div className="card-body">

          <div className="form-group">
            <label>Username</label>
            <input 
              className="form-control"
              name="userName"
              placeholder="Enter username"
              value={form.userName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input 
              className="form-control"
              name="email"
              placeholder="Enter email address"
              value={form.email}
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
                  value={form.firstName}
                  onChange={handleChange}
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
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input 
              className="form-control"
              name="phone"
              placeholder="Enter phone number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              className="form-control"
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select
              className="form-select"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="ROLE_ADMIN">Admin</option>
              <option value="ROLE_SALE">Sale</option>
              <option value="ROLE_CUSTOMER">Customer</option>
            </select>
          </div>

        </div>

        <div className="card-footer text-end" style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/admin/users")}
          >
            Cancel
          </button>
          <button className="btn btn-success" type="submit">
            Create User
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminUserAdd;
