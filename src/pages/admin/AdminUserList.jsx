// pages/admin/AdminUserList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUsers,
  toggleUser,
  exportUsers,
  getUserDetail
} from "../../service/adminService";

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const loadUsers = () => {
    const params = {
      page,
      size: 5
    };
    if (keyword) {
      params.keyword = keyword;
    }
    if (status) {
      params.status = status;
    }

    getUsers(params)
      .then(res => {
        const data = res.data.data;
        setUsers(data.content);
        setTotalPages(data.totalPages);
      })
      .catch(err => console.error(err));
  };
  const handleDetails = (userId) => {
    navigate(`/admin/users/${userId}`);
  };
  useEffect(() => {
    loadUsers();
  }, [page]);

  const handleSearch = () => {
    setPage(0);
    loadUsers();
  };

  const handleToggle = (userId) => {
    toggleUser(userId).then(() => loadUsers());
  };

  const handleExport = () => {
    exportUsers().then(res => {
      const url = window.URL.createObjectURL(
        new Blob([res.data])
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users.xlsx");
      document.body.appendChild(link);
      link.click();
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <div>
          <h2 style={{ marginBottom: "0.5rem" }}>User Management</h2>
          <p style={{ color: "#7f8c8d" }}>Manage all system users and permissions</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="card shadow" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <div className="row">
          <div className="col-md-4">
            <div className="form-group">
              <label>Search by username or email</label>
              <input
                className="form-control"
                placeholder="Type here..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-3">
            <div className="form-group">
              <label>Filter by status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div className="col-md-2" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <button className="btn btn-primary" onClick={handleSearch}>
              Search
            </button>
          </div>
          
          <div className="col-md-3" style={{ display: "flex", gap: "1rem", justifyContent: "flex-end", flexDirection: "column" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn btn-success" onClick={handleExport} style={{ flex: 1 }}>
                Export Excel
              </button>

              <button
                className="btn btn-primary"
                onClick={() => navigate(`/admin/users/new`)}
                style={{ flex: 1 }}
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="table table-bordered table-hover shadow">
          <thead className="table-dark">
            <tr>
              <th>Username</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th width="150">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.userId}>
                <td>
                  <strong>{u.userName}</strong>
                </td>
                <td>{u.firstName}</td>
                <td>{u.lastName}</td>
                <td>{u.email}</td>
                <td>
                  <span className="badge bg-primary">{u.role.name}</span>
                </td>
                <td>
                  <span
                    className={`badge ${u.status === "ACTIVE" ? "bg-success" : "bg-danger"}`}
                  >
                    {u.status}
                  </span>
                </td>
                <td>
                  <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleToggle(u.userId)}
                      title="Toggle Status"
                    >
                      Toggle
                    </button>

                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => handleDetails(u.userId)}
                      title="View Details"
                    >
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }).map((_, i) => (
              <li
                key={i}
                className={`page-item ${i === page ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export default AdminUserList;