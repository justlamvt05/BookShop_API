// pages/shop/ProductList.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProductsPage, searchProducts } from "../../service/shopService";
import { addToCart } from "../../service/cartService";
import "./ProductList.css";

function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  // Filter states
  const [searchName, setSearchName] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [isFiltered, setIsFiltered] = useState(false);

  // Format price to Vietnamese currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND"
    }).format(price);
  };
  const showSuccess = (text) => {
    setMessage({ type: "success", text });
  };
  const showError = (text) => {
    setMessage({ type: "danger", text });
  };
  // Format image URL - handle missing protocol
  const formatImageUrl = (imageUrl) => {
    if (!imageUrl) return "https://via.placeholder.com/250x350?text=No+Image";
    if (imageUrl.startsWith("http")) return imageUrl;
    return `http://localhost:8080/api${imageUrl}`;
  };

  // Fetch products for current page
  const loadProductsPage = async (pageNum, useFilter = isFiltered) => {
    setIsLoading(true);
    setError("");
    try {
      let response;
      if (useFilter) {
        // Use search with filters
        response = await searchProducts({
          page: pageNum,
          size: 9,
          name: searchName || undefined,
          minPrice: minPrice ? parseInt(minPrice) : undefined,
          maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
          sortBy: sortBy !== "default" ? sortBy : undefined
        });
      } else {
        // Use default pagination
        response = await getProductsPage(pageNum, 9);
      }
      const { content, totalPages: total } = response.data;

      setProducts(content);
      setTotalPages(total);
      setCurrentPage(pageNum);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial products on mount
  useEffect(() => {
    loadProductsPage(0);
  }, []);

  // Handle filter application
  const handleFilter = () => {
    setIsFiltered(true);
    setCurrentPage(0);
    loadProductsPage(0, true);
  };

  // Handle filter reset
  const handleReset = () => {
    setSearchName("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("default");
    setIsFiltered(false);
    setCurrentPage(0);
    loadProductsPage(0, false);
  };

  // Handle page change
  const handlePageChange = (pageNum) => {
    if (pageNum >= 0 && pageNum < totalPages) {
      loadProductsPage(pageNum);
    }
  };

  // Handle add to cart - check authentication and role
  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Check if user is logged in and has ROLE_CUSTOMER
    if (!token || role !== "ROLE_CUSTOMER") {
      navigate("/login");
      return;
    }

    setAddingToCart(product.productId);
    setError("");
    setSuccessMessage("");

    try {
      await addToCart(product.productId, 1);
      showSuccess(`"${product.name}" added to cart!`);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add item to cart. Please try again.");
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div className="shop-container">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {/* Message Alert */}
      {message.text && (
        <div className={`alert alert-${message.type}`} role="alert">
          {message.text}
        </div>
      )}
      {/* Filter Section */}
      <div className="filter-section">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by product name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFilter();
              }
            }}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="filter-input price-input"
          />
          <input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="filter-input price-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="default">Sort by: Default</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>
        </div>

        <div className="filter-actions">
          <button className="btn btn-primary" onClick={handleFilter}>
            Apply Filter
          </button>
          <button className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {products.map((product) => (
          <div key={product.productId} className="product-card">
            {/* Product Image */}
            <div className="product-image-wrapper">
              <img
                src={formatImageUrl(product.imageUrl)}
                alt={product.name}
                className="product-image"
              />
            </div>

            {/* Product Info */}
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>

              <p className="product-category">{product.categoryName}</p>

              <p className="product-price">{formatPrice(product.price)}</p>

              {/* Add to Cart Button */}
              <button className="btn btn-primary btn-add-cart" style={{ width: "100%" }} onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading products...</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 0 && !isLoading && (
        <nav>
          <ul className="pagination">
            {Array.from({ length: totalPages }).map((_, i) => (
              <li
                key={i}
                className={`page-item ${i === currentPage ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(i)}
                >
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Empty state */}
      {products.length === 0 && !isLoading && (
        <div className="empty-state">
          <p>No products found</p>
        </div>
      )}
    </div>
  );
}

export default ProductList;
