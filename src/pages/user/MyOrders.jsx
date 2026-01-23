// pages/user/MyOrders.jsx
import { useEffect, useState } from "react";
import { getMyOrders } from "../../service/userService";

function MyOrders() {
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  // Fetch orders from API
  const loadOrders = () => {
    setLoading(true);
    getMyOrders()
      .then((res) => {
        const data = res.data.data;
        setOrders(Array.isArray(data) ? data : []);
        clearMessage();
      })
      .catch((err) => {
        showError(err.response?.data?.message || "Failed to load orders");
      })
      .finally(() => setLoading(false));
  };

  // Show error message
  const showError = (text) => {
    setMessage({ type: "danger", text });
  };

  // Clear message
  const clearMessage = () => {
    setMessage({ type: "", text: "" });
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "bg-warning";
      case "CONFIRMED":
        return "bg-info";
      case "SHIPPED":
        return "bg-primary";
      case "DELIVERED":
        return "bg-success";
      case "CANCELLED":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  // Format price to Vietnamese currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
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

  return (
    <div className="container mt-4 mb-5">
      {/* Header */}
      <div className="mb-4">
        <h2 style={{ marginBottom: "0.5rem" }}>My Orders</h2>
        <p style={{ color: "#7f8c8d" }}>
          View and track all your orders
        </p>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert alert-${message.type}`} role="alert">
          {message.text}
        </div>
      )}

      {/* Orders Table */}
      {orders.length > 0 ? (
        <div style={{ overflowX: "auto" }}>
          <table className="table table-bordered table-hover shadow">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Items</th>
                <th>Total Price</th>
                <th>Status</th>
                <th width="150">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.orderId}>
                  {/* Order ID */}
                  <td>
                    <strong>#{order.orderId || "-"}</strong>
                  </td>

                  {/* Order Date */}
                  <td>
                    {formatDate(order.orderDate)}
                  </td>

                  {/* Items Count */}
                  <td>
                    <span className="badge bg-secondary">
                      {order.items?.length || 0} item(s)
                    </span>
                  </td>

                  {/* Total Price */}
                  <td>
                    <strong style={{ color: "#e74c3c" }}>
                      {formatPrice(order.totalPrice || 0)}
                    </strong>
                  </td>

                  {/* Status */}
                  <td>
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status || "UNKNOWN"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                      <button
                        className="btn btn-sm btn-info"
                        title="View Details"
                      >
                        View
                      </button>
                      {order.status?.toUpperCase() === "PENDING" && (
                        <button
                          className="btn btn-sm btn-danger"
                          title="Cancel Order"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Empty State */
        <div className="card shadow">
          <div className="card-body text-center py-5">
            <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>📦</p>
            <h5>No Orders Yet</h5>
            <p style={{ color: "#7f8c8d", marginBottom: "1.5rem" }}>
              You haven't placed any orders yet. Start shopping now!
            </p>
            <a href="/" className="btn btn-primary">
              Continue Shopping
            </a>
          </div>
        </div>
      )}

      {/* Order Summary Card */}
      {orders.length > 0 && (
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card shadow">
              <div className="card-body text-center">
                <h6 style={{ color: "#7f8c8d" }}>Total Orders</h6>
                <h3 style={{ color: "#3498db", margin: "0.5rem 0" }}>
                  {orders.length}
                </h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow">
              <div className="card-body text-center">
                <h6 style={{ color: "#7f8c8d" }}>Total Spent</h6>
                <h3 style={{ color: "#27ae60", margin: "0.5rem 0" }}>
                  {formatPrice(
                    orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
                  )}
                </h3>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow">
              <div className="card-body text-center">
                <h6 style={{ color: "#7f8c8d" }}>Pending Orders</h6>
                <h3 style={{ color: "#f39c12", margin: "0.5rem 0" }}>
                  {orders.filter(o => o.status?.toUpperCase() === "PENDING").length}
                </h3>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrders;
