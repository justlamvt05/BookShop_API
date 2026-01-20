import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserDetail, updateUser } from "../../service/adminService";

function AdminUserForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    password: ""
  });

  useEffect(() => {
    getUserDetail(id)
      .then(res => {
        const u = res.data.data;

        setUser(u);

        setForm({
          email: u.email,
          firstName: u.firstName,
          lastName: u.lastName,
          role: u.role.name,
          password: ""
        });
      })
      .catch(() => navigate("/admin/users"));
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      await updateUser(id, form);
      alert("User updated successfully");
    } catch (err) {
      const msg = err.response?.data?.message || "Update failed";
      alert(msg);
    }
  };
  if (!user) return null;

  return (
    <div className="container mt-4">
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ marginBottom: "0.5rem" }}>User Details</h2>
        <p style={{ color: "#7f8c8d" }}>View and edit user information</p>
      </div>

      <div className="card shadow">
        <div className="card-body">
          {/* READ ONLY SECTION */}
          <div style={{ marginBottom: "2rem" }}>
            <h5 style={{ marginBottom: "1.5rem", color: "#2c3e50" }}>User Information</h5>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>User ID</label>
                  <input className="form-control" value={user.userId} disabled />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Username</label>
                  <input className="form-control" value={user.userName} disabled />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-control" value={user.phone} disabled />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Address</label>
                  <input className="form-control" value={user.address} disabled />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    className="form-control"
                    value={user.dob}
                    disabled
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label>Status</label>
                  <input 
                    className="form-control" 
                    value={user.status} 
                    disabled 
                  />
                </div>
              </div>
            </div>
          </div>

          <hr style={{ margin: "2rem 0", borderColor: "#e0e0e0" }} />

          {/* EDITABLE SECTION */}
          <div>
            <h5 style={{ marginBottom: "1.5rem", color: "#2c3e50" }}>Edit Information</h5>

            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                className="form-control"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>First Name</label>
              <input
                name="firstName"
                className="form-control"
                value={form.firstName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                name="lastName"
                className="form-control"
                value={form.lastName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                className="form-select"
                value={form.role}
                onChange={handleChange}
              >
                <option value="ROLE_ADMIN">Admin</option>
                <option value="ROLE_SALE">Sale</option>
                <option value="ROLE_CUSTOMER">Customer</option>
              </select>
            </div>

            <div className="form-group">
              <label>Password (Optional)</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                placeholder="Leave blank to keep old password"
              />
            </div>
          </div>
        </div>

        <div className="card-footer text-end" style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/admin/users")}
          >
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminUserForm;
