// pages/sale/OrderDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderDetailForSale, updateOrderStatusForSale } from "../../service/orderService";

function OrderDetail() {
    const navigate = useNavigate();
    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const statusOptions = ["PENDING", "PROCESSING", "SUCCESS", "FAILED", "CANCELLED"];

    // Load order details
    useEffect(() => {
        if (orderId) {
            loadOrderDetail();
        }
    }, [orderId]);

    const loadOrderDetail = async () => {
        setLoading(true);
        try {
            const res = await getOrderDetailForSale(orderId);
            if (res.data.status) {
                setOrder(res.data.data);
                clearMessage();
            } else {
                showError(res.data.message || "Failed to load order details");
            }
        } catch (err) {
            showError(err.response?.data?.message || "Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!window.confirm(`Are you sure you want to update this order status to ${newStatus}?`)) {
            return;
        }

        setLoading(true);
        try {
            const res = await updateOrderStatusForSale(orderId, newStatus);
            if (res.data.status) {
                showSuccess("Order status updated successfully");
                loadOrderDetail(); // Reload to get updated data
            } else {
                showError(res.data.message || "Failed to update order status");
            }
        } catch (err) {
            showError(err.response?.data?.message || "Failed to update order status");
        } finally {
            setLoading(false);
        }
    };

    const showSuccess = (text) => {
        setMessage({ type: "success", text });
        setTimeout(() => clearMessage(), 3000);
    };

    const showError = (text) => {
        setMessage({ type: "danger", text });
    };

    const clearMessage = () => {
        setMessage({ type: "", text: "" });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(price);
    };

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

    const getStatusBadgeClass = (status) => {
        switch (status?.toUpperCase()) {
            case "PENDING":
                return "bg-warning text-dark";
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

    if (loading && !order) {
        return (
            <div className="container mt-4">
                <div className="text-center" style={{ padding: "3rem" }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mt-4">
                <div className="alert alert-warning">
                    <h4>Order not found</h4>
                    <p>The requested order could not be found or you don't have permission to view it.</p>
                    <button className="btn btn-primary" onClick={() => navigate("/sale/orders-list")}>
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4" style={{ maxWidth: "1200px" }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{ marginBottom: "0.5rem" }}>
                        <i className="fa-solid fa-file-invoice me-2"></i>
                        Order Details
                    </h2>
                    <p style={{ color: "#7f8c8d", margin: 0 }}>
                        Order ID: <strong>#{order.orderId}</strong> | Sale Code: <strong>{order.code}</strong>
                    </p>
                </div>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/sale/orders-list")}
                    disabled={loading}
                >
                    <i className="fa-solid fa-arrow-left me-2"></i>
                    Back to Orders
                </button>
            </div>

            {/* Message Alert */}
            {message.text && (
                <div className={`alert alert-${message.type}`} role="alert">
                    {message.text}
                </div>
            )}

            {/* Order Status Card */}
            <div className="card shadow mb-4">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">
                        <i className="fa-solid fa-info-circle me-2"></i>
                        Order Status
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <p className="mb-2"><strong>Payment Status:</strong></p>
                            <span className={`badge ${getStatusBadgeClass(order.paymentStatus)} fs-6`}>
                                {order.paymentStatus || "UNKNOWN"}
                            </span>
                        </div>
                        <div className="col-md-4">
                            <p className="mb-2"><strong>Order Date:</strong></p>
                            <p>{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="col-md-4">
                            <p className="mb-2"><strong>Total Amount:</strong></p>
                            <h4 style={{ color: "#e74c3c", margin: 0 }}>
                                {formatPrice(order.totalAmount || 0)}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                {/* Customer Information */}
                <div className="col-lg-6 mb-4">
                    <div className="card shadow h-100">
                        <div className="card-header bg-info text-white">
                            <h5 className="mb-0">
                                <i className="fa-solid fa-user me-2"></i>
                                Customer Information
                            </h5>
                        </div>
                        <div className="card-body">
                            {order.user ? (
                                <div>
                                    <div className="mb-3">
                                        <label className="text-muted small">Username</label>
                                        <p className="mb-0"><strong>{order.user.userName}</strong></p>
                                    </div>
                                    <div className="mb-3">
                                        <label className="text-muted small">Full Name</label>
                                        <p className="mb-0">
                                            <strong>{order.user.firstName} {order.user.lastName}</strong>
                                        </p>
                                    </div>
                                    <div className="mb-3">
                                        <label className="text-muted small">Email</label>
                                        <p className="mb-0">
                                            <i className="fa-solid fa-envelope me-2 text-primary"></i>
                                            {order.user.email}
                                        </p>
                                    </div>
                                    <div className="mb-3">
                                        <label className="text-muted small">Phone</label>
                                        <p className="mb-0">
                                            <i className="fa-solid fa-phone me-2 text-success"></i>
                                            {order.user.phone || "-"}
                                        </p>
                                    </div>
                                    <div className="mb-3">
                                        <label className="text-muted small">Address</label>
                                        <p className="mb-0">
                                            <i className="fa-solid fa-location-dot me-2 text-danger"></i>
                                            {order.user.address || "-"}
                                        </p>
                                    </div>
                                    <div className="mb-0">
                                        <label className="text-muted small">Date of Birth</label>
                                        <p className="mb-0">{order.user.dob || "-"}</p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted">No customer information available</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* QR Code & Actions */}
                <div className="col-lg-6 mb-4">
                    <div className="card shadow h-100">
                        <div className="card-header bg-success text-white">
                            <h4 className="mb-0">
                                Update Order Status
                            </h4>
                        </div>
                        <div className="card-body text-center">

                            <div style={{ marginTop: "40px", marginBottom: "50px" }}>
                                <h5><strong>Order Status:</strong> {order.paymentStatus}</h5>
                            </div>
                            <div className="d-flex flex-column gap-2">
                                {statusOptions.map((status) => (
                                    <button
                                        key={status}
                                        className={`btn ${order.paymentStatus === status
                                            ? "btn-secondary"
                                            : "btn-outline-primary"
                                            }`}
                                        onClick={() => handleUpdateStatus(status)}
                                        disabled={loading || order.paymentStatus === status}
                                    >
                                        {order.paymentStatus === status && (
                                            <i className="fa-solid fa-check me-2"></i>
                                        )}
                                        {status}
                                    </button>
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="card shadow mb-4">
                <div className="card-header bg-dark text-white">
                    <h5 className="mb-0">
                        <i className="fa-solid fa-shopping-cart me-2"></i>
                        Order Items
                    </h5>
                </div>
                <div className="card-body">
                    {order.orderItems && order.orderItems.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead className="table-light">
                                    <tr>
                                        <th>#</th>
                                        <th>Product ID</th>
                                        <th>Product Name</th>
                                        <th>Category</th>
                                        <th>Description</th>
                                        <th className="text-end">Unit Price</th>
                                        <th className="text-center">Quantity</th>
                                        <th className="text-end">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.orderItems.map((item, index) => (
                                        <tr key={item.orderItemId}>
                                            <td>{index + 1}</td>
                                            <td><code>{item.product?.productId || "-"}</code></td>
                                            <td>
                                                <strong>{item.product?.name || "-"}</strong>
                                            </td>
                                            <td>
                                                <span className="badge bg-secondary">
                                                    {item.product?.category?.name || "-"}
                                                </span>
                                            </td>
                                            <td>
                                                <small className="text-muted">
                                                    {item.product?.description || "-"}
                                                </small>
                                            </td>
                                            <td className="text-end">
                                                {formatPrice(item.price || 0)}
                                            </td>
                                            <td className="text-center">
                                                <span className="badge bg-primary">
                                                    {item.quantity || 0}
                                                </span>
                                            </td>
                                            <td className="text-end">
                                                <strong style={{ color: "#e74c3c" }}>
                                                    {formatPrice((item.price || 0) * (item.quantity || 0))}
                                                </strong>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="table-light">
                                    <tr>
                                        <td colSpan="6"></td>
                                        <td className="text-center">
                                            <strong>Total:</strong>
                                        </td>
                                        <td className="text-end">
                                            <h5 style={{ color: "#e74c3c", margin: 0 }}>
                                                {formatPrice(order.totalAmount || 0)}
                                            </h5>
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ) : (
                        <p className="text-muted text-center mb-0">No items in this order</p>
                    )}
                </div>
            </div>

            {/* Summary Card */}
            <div className="card shadow mb-4">
                <div className="card-header bg-warning text-dark">
                    <h5 className="mb-0">
                        <i className="fa-solid fa-receipt me-2"></i>
                        Order Summary
                    </h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <p className="text-muted mb-2">Total Items</p>
                                <h3 className="mb-0">{order.orderItems?.length || 0}</h3>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <p className="text-muted mb-2">Total Quantity</p>
                                <h3 className="mb-0">
                                    {order.orderItems?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0}
                                </h3>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="text-center p-3 bg-light rounded">
                                <p className="text-muted mb-2">Total Amount</p>
                                <h3 className="mb-0" style={{ color: "#e74c3c" }}>
                                    {formatPrice(order.totalAmount || 0)}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;
