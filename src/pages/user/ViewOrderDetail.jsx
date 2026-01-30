// pages/user/ViewOrderDetail.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "../../service/orderService";

function ViewOrderDetail() {
    const navigate = useNavigate();
    const { orderId } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    // Load order details
    useEffect(() => {
        if (orderId) {
            loadOrderDetail();
        }
    }, [orderId]);

    const loadOrderDetail = async () => {
        setLoading(true);
        try {
            const res = await getOrderById(orderId);
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
                    <button className="btn btn-primary" onClick={() => navigate("/user/orders")}>
                        Back to My Orders
                    </button>
                </div>
            </div>
        );
    }

    // Check if order is pending (show QR code for payment)
    const isPending = order.paymentStatus?.toUpperCase() === "PENDING";

    return (
        <div className="container mt-4" style={{ maxWidth: "1200px" }}>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 style={{ marginBottom: "0.5rem" }}>
                        <i className="fa-solid fa-receipt me-2"></i>
                        Order Details
                    </h2>
                    <p style={{ color: "#7f8c8d", margin: 0 }}>
                        Order ID: <strong>#{order.orderId}</strong>
                    </p>
                </div>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/user/orders")}
                    disabled={loading}
                >
                    <i className="fa-solid fa-arrow-left me-2"></i>
                    Back to My Orders
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
                        Order Information
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

            {/* QR Code Section - Only show for PENDING orders */}
            {isPending && (
                <div className="card shadow mb-4">
                    <div className="card-header bg-success text-white">
                        <h5 className="mb-0">
                            <i className="fa-solid fa-qrcode me-2"></i>
                            Payment Information
                        </h5>
                    </div>
                    <div className="card-body text-center">
                        <div className="alert alert-info mb-3">
                            <i className="fa-solid fa-info-circle me-2"></i>
                            Please complete your payment to process this order
                        </div>
                        {order.qrCodeUrl ? (
                            <div className="p-4 bg-light rounded">
                                <p className="mb-2"><strong>QR Code for Payment:</strong></p>
                                <div className="d-flex justify-content-center my-3">
                                    <img
                                        src={order.qrCodeUrl}
                                        alt="QR Code for Payment"
                                        style={{ maxWidth: "300px", width: "100%" }}
                                        className="border rounded"
                                    />
                                </div>
                                <small className="text-muted d-block text-center">
                                    Scan this QR code with your banking app to complete the payment
                                </small>
                            </div>
                        ) : (
                            <p className="text-muted">Payment information is being generated...</p>
                        )}
                    </div>
                </div>
            )}

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
                                        <th>Product Name</th>
                                        <th>Category</th>
                                        <th className="text-end">Unit Price</th>
                                        <th className="text-center">Quantity</th>
                                        <th className="text-end">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.orderItems.map((item, index) => (
                                        <tr key={item.orderItemId}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <strong>{item.product?.name || "-"}</strong>
                                                <br />
                                                <small className="text-muted">
                                                    {item.product?.description || ""}
                                                </small>
                                            </td>
                                            <td>
                                                <span className="badge bg-secondary">
                                                    {item.product?.category?.name || "-"}
                                                </span>
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
                                        <td colSpan="4"></td>
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
                        <i className="fa-solid fa-chart-simple me-2"></i>
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

export default ViewOrderDetail;
