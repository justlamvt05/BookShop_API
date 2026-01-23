// pages/user/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile } from "../../service/userService";

function Profile() {
  const navigate = useNavigate();

  // Get user role from localStorage
  const role = localStorage.getItem("role");

  // State management
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Form state for editing
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    password: "",
    confirmPassword: ""
  });

  const [formErrors, setFormErrors] = useState({});

  // Handle back navigation based on role
  const handleBack = () => {
    if (role === "ROLE_SALE") {
      navigate("/sale/products");
    } else if (role === "ROLE_ADMIN") {
      navigate("/admin/users");
    } else {
      navigate(-1); // Fallback to previous page
    }
  };

  // Load profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Fetch profile data from API
  const loadProfile = () => {
    setLoading(true);
    getMyProfile()
      .then((res) => {
        const data = res.data.data;
        setProfile(data);
        // Initialize form with profile data
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          password: "",
          confirmPassword: ""
        });
        setIsEditing(false);
        clearMessage();
      })
      .catch((err) => {
        showError(err.response?.data?.message || "Failed to load profile");
      })
      .finally(() => setLoading(false));
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      errors.lastName = "Last name is required";
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    }

    // Password validation (only if password is provided)
    if (formData.password) {
      if (formData.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    updateMyProfile(formData)
      .then((res) => {
        const data = res.data.data;
        setProfile(data);
        setIsEditing(false);
        showSuccess("Profile updated successfully");
      })
      .catch((err) => {
        showError(err.response?.data?.message || "Failed to update profile");
      })
      .finally(() => setSubmitting(false));
  };

  // Show success message
  const showSuccess = (text) => {
    setMessage({ type: "success", text });
    setTimeout(() => clearMessage(), 3000);
  };

  // Show error message
  const showError = (text) => {
    setMessage({ type: "danger", text });
  };

  // Clear message
  const clearMessage = () => {
    setMessage({ type: "", text: "" });
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // No profile state
  if (!profile && !isEditing) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          Profile not found. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      {/* Header */}
      <div className="mb-4">

        <h2 style={{ marginBottom: "0.5rem" }}>My Profile</h2>
        <p style={{ color: "#7f8c8d" }}>Manage your personal information</p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert alert-${message.type}`} role="alert">
          {message.text}
        </div>
      )}

      <div className="row">
        {/* Left Column - Profile Info */}
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ margin: 0 }}>
                {isEditing ? "Edit Profile" : "Profile Information"}
              </h4>
              {!isEditing && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="card-body">
              {isEditing ? (
                /* Edit Form */
                <form onSubmit={handleSubmit}>
                  {/* First Name */}
                  <div className="form-group mb-3">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.firstName ? "is-invalid" : ""}`}
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter first name"
                    />
                    {formErrors.firstName && (
                      <div className="invalid-feedback d-block">
                        {formErrors.firstName}
                      </div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="form-group mb-3">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.lastName ? "is-invalid" : ""}`}
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter last name"
                    />
                    {formErrors.lastName && (
                      <div className="invalid-feedback d-block">
                        {formErrors.lastName}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="form-group mb-3">
                    <label className="form-label">Email *</label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email"
                    />
                    {formErrors.email && (
                      <div className="invalid-feedback d-block">
                        {formErrors.email}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="form-group mb-3">
                    <label className="form-label">Phone Number *</label>
                    <input
                      type="tel"
                      className={`form-control ${formErrors.phone ? "is-invalid" : ""}`}
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                    {formErrors.phone && (
                      <div className="invalid-feedback d-block">
                        {formErrors.phone}
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="form-group mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter address"
                    />
                  </div>

                  {/* Password Change Section */}
                  <hr className="my-4" />
                  <h5 className="mb-3">Change Password (Optional)</h5>

                  {/* New Password */}
                  <div className="form-group mb-3">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      className={`form-control ${formErrors.password ? "is-invalid" : ""}`}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter new password (leave blank to keep current)"
                    />
                    {formErrors.password && (
                      <div className="invalid-feedback d-block">
                        {formErrors.password}
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className={`form-control ${formErrors.confirmPassword ? "is-invalid" : ""}`}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm new password"
                    />
                    {formErrors.confirmPassword && (
                      <div className="invalid-feedback d-block">
                        {formErrors.confirmPassword}
                      </div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setFormErrors({});
                      }}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* Display Profile */
                <div>
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p style={{ color: "#7f8c8d", marginBottom: "0.25rem" }}>First Name</p>
                      <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>
                        {profile.firstName || "-"}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p style={{ color: "#7f8c8d", marginBottom: "0.25rem" }}>Last Name</p>
                      <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>
                        {profile.lastName || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <p style={{ color: "#7f8c8d", marginBottom: "0.25rem" }}>Email</p>
                      <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>
                        {profile.email || "-"}
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p style={{ color: "#7f8c8d", marginBottom: "0.25rem" }}>Phone</p>
                      <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>
                        {profile.phone || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-12">
                      <p style={{ color: "#7f8c8d", marginBottom: "0.25rem" }}>Address</p>
                      <p style={{ fontSize: "1.1rem", fontWeight: "500" }}>
                        {profile.address || "-"}
                      </p>
                    </div>
                  </div>


                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Account Summary */}
        <div className="col-lg-4">
          <div className="card shadow mb-3">
            <div className="card-header">
              <h5 style={{ margin: 0 }}>Account Summary</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <p style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>Username</p>
                <p style={{ fontWeight: "500", fontSize: "1.1rem" }}>
                  {profile.userName || "-"}
                </p>
              </div>

              <div className="mb-3">
                <p style={{ color: "#7f8c8d", fontSize: "0.9rem" }}>Account Status</p>
                <p style={{ fontWeight: "500", fontSize: "1.1rem" }}>
                  <span
                    className={`badge ${profile.status === "ACTIVE" ? "bg-success" : "bg-warning"
                      }`}
                  >
                    {profile.status || "ACTIVE"}
                  </span>
                </p>
              </div>
            </div>
          </div>
          {role !== "ROLE_ADMIN" && role !== "ROLE_SALE" && (
            <div className="card shadow">
              <div className="card-header">
                <h5 style={{ margin: 0 }}>Quick Actions</h5>
              </div>
              <div className="card-body">
                <a href="/user/orders" className="btn btn-outline-primary w-100 mb-2">
                  View My Orders
                </a>
              </div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
            <button
              className="btn btn-outline-secondary mb-3"
              onClick={handleBack}
            >
              ← Back
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
