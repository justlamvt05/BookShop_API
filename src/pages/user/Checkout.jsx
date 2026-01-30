// pages/user/Checkout.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../../service/userService";
import { getCart } from "../../service/cartService";
import { createOrder } from "../../service/orderService";

function Checkout() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    // Format price to Vietnamese currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(price);
    };

    // Format image URL
    const formatImageUrl = (imageUrl) => {
        if (!imageUrl) return "https://via.placeholder.com/80x80?text=No+Image";
        if (imageUrl.startsWith("http")) return imageUrl;
        return `http://localhost:8080/api${imageUrl}`;
    };

    // Load profile and cart data
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "ROLE_CUSTOMER") {
            navigate("/login");
            return;
        }

        loadCheckoutData();
    }, [navigate]);

    const loadCheckoutData = async () => {
        setIsLoading(true);
        setError("");

        try {
            // Fetch profile and cart in parallel
            const [profileResponse, cartResponse] = await Promise.all([
                getMyProfile(),
                getCart()
            ]);

            // Set profile data
            setProfile(profileResponse.data.data);

            // Set cart data
            let items = [];
            const cartData = cartResponse.data;
            if (cartData && cartData.data && Array.isArray(cartData.data.items)) {
                items = cartData.data.items;
            } else if (cartData && Array.isArray(cartData.items)) {
                items = cartData.items;
            } else if (Array.isArray(cartData)) {
                items = cartData;
            }

            setCartItems(items);

            // Redirect if cart is empty
            if (items.length === 0) {
                navigate("/cart");
            }
        } catch (err) {
            console.error("Error loading checkout data:", err);
            if (err.response?.status === 401) {
                navigate("/login");
                return;
            }
            setError("Failed to load checkout data. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate totals
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    // Handle order submission
    const handlePlaceOrder = async () => {
        if (!profile) {
            setError("Profile information is required");
            return;
        }

        // Validate required profile fields
        if (!profile.firstName || !profile.lastName || !profile.phone || !profile.address) {
            setError("Please complete your profile information before placing an order");
            navigate("/user/profile");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            // Prepare order data matching backend CreateOrderRequest format
            // Transform cart items to OrderItemRequest[] format
            const orderData = {
                items: cartItems.map(item => ({
                    productId: item.product.productId,
                    quantity: item.quantity
                }))
            };

            // Create order
            const response = await createOrder(orderData);

            // Redirect to order confirmation or orders page
            if (response.data && response.data.data) {
                navigate(`/user/orders`);
            }
        } catch (err) {
            console.error("Error placing order:", err);
            setError(err.response?.data?.message || "Failed to place order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="container mt-4">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3">Loading checkout...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4 mb-5">
            {/* Header */}
            <div className="mb-4">
                <h2>Checkout</h2>
                <p style={{ color: "#7f8c8d" }}>Review your order and shipping information</p>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            <div className="row">
                {/* Left Column - Shipping Information */}
                <div className="col-lg-7">
                    <div className="card shadow mb-4">
                        <div className="card-header">
                            <h4 style={{ margin: 0 }}>Shipping Information</h4>
                        </div>
                        <div className="card-body">
                            {profile ? (
                                <div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <p style={{ color: "#7f8c8d", marginBottom: "0.25rem", fontSize: "0.9rem" }}>
                                                First Name
                                            </p>
                                            <p style={{ fontSize: "1.05rem", fontWeight: "500" }}>
                                                {profile.firstName || "-"}
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <p style={{ color: "#7f8c8d", marginBottom: "0.25rem", fontSize: "0.9rem" }}>
                                                Last Name
                                            </p>
                                            <p style={{ fontSize: "1.05rem", fontWeight: "500" }}>
                                                {profile.lastName || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <p style={{ color: "#7f8c8d", marginBottom: "0.25rem", fontSize: "0.9rem" }}>
                                                Email
                                            </p>
                                            <p style={{ fontSize: "1.05rem", fontWeight: "500" }}>
                                                {profile.email || "-"}
                                            </p>
                                        </div>
                                        <div className="col-md-6">
                                            <p style={{ color: "#7f8c8d", marginBottom: "0.25rem", fontSize: "0.9rem" }}>
                                                Phone
                                            </p>
                                            <p style={{ fontSize: "1.05rem", fontWeight: "500" }}>
                                                {profile.phone || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-12">
                                            <p style={{ color: "#7f8c8d", marginBottom: "0.25rem", fontSize: "0.9rem" }}>
                                                Shipping Address
                                            </p>
                                            <p style={{ fontSize: "1.05rem", fontWeight: "500" }}>
                                                {profile.address || "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {(!profile.firstName || !profile.lastName || !profile.phone || !profile.address) && (
                                        <div className="alert alert-warning" role="alert">
                                            <strong>Incomplete Profile!</strong> Please update your profile with complete information before placing an order.
                                            <button
                                                className="btn btn-sm btn-warning ms-3"
                                                onClick={() => navigate("/user/profile")}
                                            >
                                                Update Profile
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="alert alert-warning" role="alert">
                                    Profile information not available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="card shadow">
                        <div className="card-header">
                            <h4 style={{ margin: 0 }}>Order Items ({totalItems})</h4>
                        </div>
                        <div className="card-body">
                            {cartItems.length === 0 ? (
                                <p className="text-muted">No items in cart</p>
                            ) : (
                                <div>
                                    {cartItems.map((item) => (
                                        <div
                                            key={item.cartItemId}
                                            className="d-flex align-items-center mb-3 pb-3"
                                            style={{ borderBottom: "1px solid #e9ecef" }}
                                        >
                                            <img
                                                src={formatImageUrl(item.product.imageUrl)}
                                                alt={item.product.name}
                                                style={{
                                                    width: "80px",
                                                    height: "80px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px"
                                                }}
                                            />
                                            <div className="flex-grow-1 ms-3">
                                                <h6 style={{ marginBottom: "0.25rem" }}>{item.product.name}</h6>
                                                <p style={{ color: "#7f8c8d", marginBottom: "0.25rem", fontSize: "0.9rem" }}>
                                                    {formatPrice(item.product.price)} × {item.quantity}
                                                </p>
                                            </div>
                                            <div>
                                                <strong style={{ fontSize: "1.1rem" }}>
                                                    {formatPrice(item.product.price * item.quantity)}
                                                </strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Order Summary */}
                <div className="col-lg-5">
                    <div className="card shadow sticky-top" style={{ top: "20px" }}>
                        <div className="card-header">
                            <h4 style={{ margin: 0 }}>Order Summary</h4>
                        </div>
                        <div className="card-body">
                            <div className="d-flex justify-content-between mb-3">
                                <span style={{ color: "#7f8c8d" }}>Total Items:</span>
                                <span style={{ fontWeight: "500" }}>{totalItems}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span style={{ color: "#7f8c8d" }}>Subtotal:</span>
                                <span style={{ fontWeight: "500" }}>{formatPrice(totalPrice)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span style={{ color: "#7f8c8d" }}>Shipping:</span>
                                <span style={{ fontWeight: "500", color: "#28a745" }}>Free</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-4">
                                <span style={{ fontSize: "1.2rem", fontWeight: "600" }}>Total:</span>
                                <span style={{ fontSize: "1.3rem", fontWeight: "700", color: "#007bff" }}>
                                    {formatPrice(totalPrice)}
                                </span>
                            </div>

                            <button
                                className="btn btn-primary w-100 mb-3"
                                onClick={handlePlaceOrder}
                                disabled={isSubmitting || cartItems.length === 0 || !profile?.firstName || !profile?.lastName || !profile?.phone || !profile?.address}
                                style={{ padding: "12px", fontSize: "1.1rem" }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Placing Order...
                                    </>
                                ) : (
                                    "Place Order"
                                )}
                            </button>

                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => navigate("/user/cart")}
                                disabled={isSubmitting}
                            >
                                ← Back to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
