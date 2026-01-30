// pages/sale/OrderManagement.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    getAllOrdersForSale,
    updateOrderStatusForSale
} from "../../service/orderService";

function OrderManagement() {
    const navigate = useNavigate();

    // State for order list & pagination
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    // State for sorting
    const [sortBy, setSortBy] = useState("createdAt");
    const [direction, setDirection] = useState("desc");

    // State for UI feedback
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const statusOptions = ["", "PENDING", "PROCESSING", "SUCCESS", "FAILED", "CANCELLED"];

    // Load orders list
    const loadOrders = () => {
        setLoading(true);
        const params = {
            page,
            size: 5,
            sortBy,
            direction
        };
        if (keyword) params.keyword = keyword;
        if (statusFilter) params.status = statusFilter;

        getAllOrdersForSale(params)
            .then((res) => {
                const data = res.data.data;
                setOrders(data.content || []);
                setTotalPages(data.totalPages || 0);
                clearMessage();
            })
            .catch((err) => {
                showError(err.response?.data?.message || "Failed to load orders");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadOrders();
    }, [page, statusFilter, sortBy, direction]);

    // =============== Order Detail Handlers ===============

    // Navigate to order detail page
    const handleViewDetail = (orderId) => {
        navigate(`/sale/orders/${orderId}`);
    };

    // =============== Status Update Handlers ===============

    const handleUpdateStatus = async (orderId, newStatus) => {
        if (!window.confirm(`Are you sure you want to update this order status to ${newStatus}?`)) {
            return;
        }

        setLoading(true);
        try {
            await updateOrderStatusForSale(orderId, newStatus);
            showSuccess("Order status updated successfully");
            loadOrders();
        } catch (err) {
            showError(err.response?.data?.message || "Failed to update order status");
        } finally {
            setLoading(false);
        }
    };

    // =============== Utility Functions ===============

    // Show success message
    const showSuccess = (text) => {
        setMessage({ type: "success", text });
    };

    // Show error message
    const showError = (text) => {
        setMessage({ type: "danger", text });
    };

    // Clear message
    const clearMessage = () => {
        setMessage({ type: "", text: "" });
    };

    // Handle search
    const handleSearch = () => {
        setPage(0);
        loadOrders();
    };

    // Handle status filter change
    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setPage(0);
    };

    // Handle sort
    const handleSort = (column) => {
        if (sortBy === column) {
            // Toggle direction if same column
            setDirection(direction === "asc" ? "desc" : "asc");
        } else {
            // New column, default to ascending
            setSortBy(column);
            setDirection("asc");
        }
        setPage(0);
    };

    // Get sort icon
    const getSortIcon = (column) => {

        return <i className="fa-solid fa-sort" style={{ marginLeft: "0.5rem", color: "white" }}></i>;

    };

    // Format price
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
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // Get status badge class
    const getStatusBadgeClass = (status) => {
        switch (status?.toUpperCase()) {
            case "PENDING":
                return "bg-warning";
            case "PROCESSING":
                return "bg-info";
            case "SUCCESS":
                return "bg-success";
            case "FAILED":
                return "bg-danger";
            case "CANCELLED":
                return "bg-secondary";
            default:
                return "bg-secondary";
        }
    };

    // =============== JSX Render ===============

    return (
        <div className="container mt-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2 style={{ marginBottom: "0.5rem" }}>Order Management</h2>
                    <p style={{ color: "#7f8c8d" }}>View and manage customer orders</p>
                </div>
            </div>

            {/* Message Alert */}
            {message.text && (
                <div className={`alert alert-${message.type}`} role="alert">
                    {message.text}
                </div>
            )}

            {/* Search & Filter Bar */}
            <div className="card shadow" style={{ padding: "2rem", marginBottom: "2rem" }}>
                <div className="row">
                    <div className="col-md-5">
                        <div className="form-group">
                            <label>Search by customer info</label>
                            <input
                                className="form-control"
                                placeholder="Type customer email or username..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="form-group">
                            <label>Filter by status</label>
                            <select
                                className="form-control"
                                value={statusFilter}
                                onChange={handleStatusFilterChange}
                                disabled={loading}
                            >
                                <option value="">All Status</option>
                                {statusOptions.slice(1).map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="col-md-4" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleSearch}
                            disabled={loading}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div style={{ overflowX: "auto" }}>
                <table className="table table-bordered table-hover shadow">
                    <thead className="table-dark">
                        <tr>
                            <th
                                onClick={() => handleSort("orderId")}
                                style={{ cursor: "pointer", userSelect: "none" }}
                                title="Click to sort"
                            >
                                Order ID
                                {getSortIcon("orderId")}
                            </th>
                            <th>Customer</th>
                            <th>Email</th>
                            <th
                                onClick={() => handleSort("createdAt")}
                                style={{ cursor: "pointer", userSelect: "none" }}
                                title="Click to sort"
                            >
                                Order Date
                                {getSortIcon("createdAt")}
                            </th>
                            <th
                                onClick={() => handleSort("totalAmount")}
                                style={{ cursor: "pointer", userSelect: "none" }}
                                title="Click to sort"
                            >
                                Total Amount
                                {getSortIcon("totalAmount")}
                            </th>
                            <th
                                onClick={() => handleSort("paymentStatus")}
                                style={{ cursor: "pointer", userSelect: "none" }}
                                title="Click to sort"
                            >
                                Status
                                {getSortIcon("paymentStatus")}
                            </th>
                            <th width="200">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length > 0 ? (
                            orders.map((order, index) => (
                                <tr key={index}>
                                    <td>
                                        <strong>#{index + 1}</strong>
                                    </td>
                                    <td>{order.user?.userName || "-"}</td>
                                    <td>{order.user?.email || "-"}</td>
                                    <td>{formatDate(order.createdAt)}</td>
                                    <td>
                                        <strong style={{ color: "#e74c3c" }}>
                                            {formatPrice(order.totalAmount || 0)}
                                        </strong>
                                    </td>
                                    <td>
                                        <span className={`badge ${getStatusBadgeClass(order.paymentStatus)}`}>
                                            {order.paymentStatus || "UNKNOWN"}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
                                            <button
                                                className="btn btn-sm btn-info"
                                                onClick={() => handleViewDetail(order.orderId)}
                                                disabled={loading}
                                                title="View Details"
                                            >
                                                View
                                            </button>
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() => handleUpdateStatus(order.orderId, "SUCCESS")}
                                                disabled={loading || order.paymentStatus === "SUCCESS"}
                                                title="Mark as Success"
                                            >
                                                ✓ Success
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center" style={{ padding: "2rem" }}>
                                    {loading ? "Loading orders..." : "No orders found"}
                                </td>
                            </tr>
                        )}
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
                                    disabled={loading}
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

export default OrderManagement;
