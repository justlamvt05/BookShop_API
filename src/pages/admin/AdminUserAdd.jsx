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
      <h3>➕ Add User</h3>

      <form className="card shadow" onSubmit={handleSubmit}>
        <div className="card-body">

          <input className="form-control mb-2"
            name="userName"
            placeholder="Username"
            value={form.userName}
            onChange={handleChange}
            required
          />

          <input className="form-control mb-2"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input className="form-control mb-2"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input className="form-control mb-2"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <input className="form-control mb-2"
            name="firstName"
            placeholder="First name"
            value={form.firstName}
            onChange={handleChange}
          />

          <input className="form-control mb-2"
            name="lastName"
            placeholder="Last name"
            value={form.lastName}
            onChange={handleChange}
          />

          <select
            className="form-select"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="ROLE_ADMIN">Admin</option>
            <option value="ROLE_SALE">Sale</option>
            <option value="ROLE_CUSTOMER">CUSTOMER</option>
          </select>

        </div>

        <div className="card-footer text-end">
          <button
            type="button"
            className="btn btn-secondary me-2"
            onClick={() => navigate("/admin/users")}
          >
            Cancel
          </button>
          <button className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminUserAdd;
