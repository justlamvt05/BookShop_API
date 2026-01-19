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
      <h3>👤 User Detail</h3>

      <div className="card shadow">
        <div className="card-body">

          {/* READ ONLY */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>User ID</label>
              <input className="form-control" value={user.userId} disabled />
            </div>

            <div className="col-md-6 mb-3">
              <label>Username</label>
              <input className="form-control" value={user.userName} disabled />
            </div>

            <div className="col-md-6 mb-3">
              <label>Phone</label>
              <input className="form-control" value={user.phone} disabled />
            </div>

            <div className="col-md-6 mb-3">
              <label>Address</label>
              <input className="form-control" value={user.address} disabled />
            </div>

            <div className="col-md-6 mb-3">
              <label>Date of Birth</label>
              <input
                type="date"
                className="form-control"
                value={user.dob}
                disabled
              />
            </div>

            <div className="col-md-6 mb-3">
              <label>Status</label>
              <input className="form-control" value={user.status} disabled />
            </div>
          </div>

          <hr />

          {/* EDITABLE */}
          <h5>Edit Information</h5>

          <div className="mb-3">
            <label>Email</label>
            <input
              name="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>First Name</label>
            <input
              name="firstName"
              className="form-control"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Last Name</label>
            <input
              name="lastName"
              className="form-control"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Role</label>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
            >
              <option value="ROLE_ADMIN">ADMIN</option>
              <option value="ROLE_SALE">SALE</option>
              <option value="ROLE_CUSTOMER">CUSTOMER</option>
            </select>
          </div>

          <div className="mb-3">
            <label>Password (optional)</label>
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

        <div className="card-footer text-end">
          <button
            className="btn btn-secondary me-2"
            onClick={() => navigate("/admin/users")}
          >
            Back
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
