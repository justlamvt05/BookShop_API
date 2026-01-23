// pages/user/Cart.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeFromCart } from "../../service/cartService";
import "./Cart.css";

function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [updatingItemId, setUpdatingItemId] = useState(null);

    // Format price to Vietnamese currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND"
        }).format(price);
    };

    // Format image URL - handle missing protocol
    const formatImageUrl = (imageUrl) => {
        if (!imageUrl) return "https://via.placeholder.com/100x100?text=No+Image";
        if (imageUrl.startsWith("http")) return imageUrl;
        return `http://localhost:8080/api${imageUrl}`;
    };

    // Fetch cart data
    const fetchCart = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await getCart();
            const responseData = response.data;

            // Handle API response structure: { status, message, data: { items: [...] } }
            let items = [];
            if (responseData && responseData.data && Array.isArray(responseData.data.items)) {
                items = responseData.data.items;
            } else if (responseData && Array.isArray(responseData.items)) {
                items = responseData.items;
            } else if (Array.isArray(responseData)) {
                items = responseData;
            } else {
                console.log("Cart API response:", responseData);
                items = [];
            }

            setCartItems(items);
        } catch (err) {
            console.error("Error fetching cart:", err);
            if (err.response?.status === 401) {
                navigate("/login");
                return;
            }
            setError("Failed to load cart. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    // Load cart on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token || role !== "ROLE_CUSTOMER") {
            navigate("/login");
            return;
        }

        fetchCart();
    }, [navigate]);

    // Handle quantity update
    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 0) return;

        setUpdatingItemId(productId);
        setError("");

        try {
            if (newQuantity === 0) {
                // Remove item if quantity is 0
                await removeFromCart(productId);
            } else {
                await updateCartItem(productId, newQuantity);
            }
            await fetchCart();
        } catch (err) {
            console.error("Error updating cart:", err);
            setError("Failed to update cart. Please try again.");
        } finally {
            setUpdatingItemId(null);
        }
    };

    // Handle remove item
    const handleRemoveItem = async (productId) => {
        setUpdatingItemId(productId);
        setError("");

        try {
            await removeFromCart(productId);
            await fetchCart();
        } catch (err) {
            console.error("Error removing item:", err);
            setError("Failed to remove item. Please try again.");
        } finally {
            setUpdatingItemId(null);
        }
    };

    // Calculate totals
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    // Handle checkout
    const handleCheckout = () => {
        // TODO: Implement checkout logic
        navigate("/checkout");
    };

    // Handle back to shop
    const handleBackToShop = () => {
        navigate("/");
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="cart-container">
                <div className="loading-container">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Loading cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <div className="cart-header">
                <h1>Shopping Cart</h1>
                <button className="btn btn-secondary" onClick={handleBackToShop}>
                    ← Continue Shopping
                </button>
            </div>

            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any items to your cart yet.</p>
                    <button className="btn btn-primary" onClick={handleBackToShop}>
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="cart-content">
                    {/* Cart Items List */}
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.cartItemId} className="cart-item">
                                {/* Product Image */}
                                <div className="cart-item-image">
                                    <img
                                        src={formatImageUrl(item.product.imageUrl)}
                                        alt={item.product.name}
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="cart-item-details" style={{ marginLeft: "20px" }}>
                                    <h3 className="cart-item-name">{item.product.name}</h3>
                                    <p className="cart-item-price">
                                        {formatPrice(item.product.price)}
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="cart-item-quantity" style={{ marginLeft: "20px" }}>
                                    <button
                                        className="qty-btn"
                                        onClick={() =>
                                            handleUpdateQuantity(item.product.productId, item.quantity - 1)
                                        }
                                        disabled={updatingItemId === item.product.productId}
                                    >
                                        −
                                    </button>
                                    <span className="qty-value">{item.quantity}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() =>
                                            handleUpdateQuantity(item.product.productId, item.quantity + 1)
                                        }
                                        disabled={updatingItemId === item.product.productId}
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Subtotal */}
                                <div className="cart-item-subtotal">
                                    <span className="subtotal-label">Subtotal:</span>
                                    <span className="subtotal-value">
                                        {formatPrice(item.product.price * item.quantity)}
                                    </span>
                                </div>

                                {/* Remove Button */}
                                <button
                                    className="btn-remove"
                                    onClick={() => handleRemoveItem(item.product.productId)}
                                    disabled={updatingItemId === item.product.productId}
                                    title="Remove item"
                                >
                                    {updatingItemId === item.product.productId ? "..." : "✕"}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Cart Summary */}
                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <div className="summary-row">
                            <span>Total Items:</span>
                            <span>{totalItems}</span>
                        </div>
                        <div className="summary-row summary-total">
                            <span>Total Price:</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>
                        <button
                            className="btn btn-primary btn-checkout"
                            onClick={handleCheckout}
                            disabled={cartItems.length === 0}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
