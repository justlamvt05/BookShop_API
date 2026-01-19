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
        <h2>👑 Admin - User Management</h2>
      </div>

      {/* Search & Filter */}
      <div className="row mb-3">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="🔍 Search username / email"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">-- All Status --</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>

        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
        <div className="col-md-3 d-flex">
          <button className="btn btn-success me-3" onClick={handleExport}>
            📤 Export Excel
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => navigate(`/admin/users/new`)}
          >
            ➕ Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="table table-bordered table-hover shadow">
        <thead className="table-dark">
          <tr>
            <th>Username</th>
            <th>FirstName</th>
            <th>LastName</th>
            <th>DOB</th>
            <th>Address</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th width="120">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.userId}>
              <td>{u.userName}</td>
              <td>{u.firstName}</td>
              <td>{u.lastName}</td>
              <td>{u.dob}</td>
              <td>{u.address}</td>
              <td>{u.email}</td>
              <td>
                <span className="badge bg-primary">{u.role.name}</span>
              </td>
              <td>
                <span
                  className={`badge ${u.status === "ACTIVE" ? "bg-success" : "bg-danger"
                    }`}
                >
                  {u.status}
                </span>
              </td>
              <td>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleToggle(u.userId)}
                  >
                    Toggle
                  </button>

                  <button
                    className="btn btn-sm btn-info"
                    onClick={() => handleDetails(u.userId)}
                  >
                    Details
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination numbers */}
      <nav>
        <ul className="pagination justify-content-center">
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
    </div>
  );
}

export default AdminUserList;