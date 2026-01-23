// pages/sale/ProductManagement.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createProduct,
  updateProduct,
  getProducts,
  uploadSingleImage,
  uploadMultipleImages,
  getProductImages,
  deleteProductImage,
  exportProductPdf,
  toggleProductStatus
} from "../../service/saleService";

function ProductManagement() {
  const navigate = useNavigate();

  // State for product list & pagination
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");

  // State for product form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: ""
  });
  const [formErrors, setFormErrors] = useState({});

  // State for image management
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [singleFile, setSingleFile] = useState(null);
  const [isMainImage, setIsMainImage] = useState(false);
  const [multipleFiles, setMultipleFiles] = useState([]);

  // State for UI feedback
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Load products list
  const loadProducts = () => {
    setLoading(true);
    const params = { page, size: 5 };
    if (keyword) params.keyword = keyword;

    getProducts(params)
      .then((res) => {
        const data = res.data.data;
        setProducts(data.content);
        setTotalPages(data.totalPages);
        clearMessage();
      })
      .catch((err) => {
        showError(err.response?.data?.message || "Failed to load products");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, [page]);

  // =============== Product Form Handlers ===============

  // Validate product form
  const validateProductForm = () => {
    const errors = {};

    if (!productForm.name.trim()) {
      errors.name = "Product name is required";
    }
    if (!productForm.price || Number(productForm.price) <= 0) {
      errors.price = "Price must be greater than 0";
    }
    if (productForm.quantity < 0) {
      errors.quantity = "Quantity cannot be negative";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle product form input change
  const handleProductFormChange = (e) => {
    const { name, value } = e.target;
    setProductForm((prev) => ({ ...prev, [name]: value }));
  };

  // Reset product form
  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      quantity: ""
    });
    setFormErrors({});
    setEditingId(null);
  };

  // Open form for creating new product
  const handleNewProduct = () => {
    resetProductForm();
    setShowForm(true);
  };

  // Open form for editing product
  const handleEditProduct = (product) => {
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      quantity: product.quantity
    });
    setEditingId(product.productId);
    setShowForm(true);
  };

  // Toggle product status
  const handleToggleStatus = async (productId) => {
    setLoading(true);
    try {
      await toggleProductStatus(productId);
      showSuccess("Product status updated successfully");
      loadProducts();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to toggle product status");
    } finally {
      setLoading(false);
    }
  };

  // Create or update product
  const handleCreateOrUpdateProduct = async (e) => {
    e.preventDefault();

    if (!validateProductForm()) {
      return;
    }

    setLoading(true);
    try {
      const data = {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        quantity: Number(productForm.quantity)
      };

      if (editingId) {
        // Update existing product
        await updateProduct(editingId, data);
        showSuccess("Product updated successfully");
      } else {
        // Create new product
        await createProduct(data);
        showSuccess("Product created successfully");
      }

      setShowForm(false);
      resetProductForm();
      setPage(0);
      loadProducts();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  // =============== Image Management Handlers ===============

  // Load images for a product
  const loadProductImages = async (productId) => {
    try {
      const res = await getProductImages(productId);
      setProductImages(res.data.data || []);
    } catch (err) {
      showError("Failed to load images");
    }
  };

  // Open image modal for product
  const handleOpenImageModal = (productId) => {
    setSelectedProductId(productId);
    setShowImageModal(true);
    loadProductImages(productId);
  };

  // Close image modal
  const handleCloseImageModal = () => {
    setShowImageModal(false);
    setSelectedProductId(null);
    setSingleFile(null);
    setIsMainImage(false);
    setMultipleFiles([]);
  };

  // Handle single file selection
  const handleSingleFileChange = (e) => {
    setSingleFile(e.target.files[0] || null);
  };

  // Handle multiple file selection
  const handleMultipleFilesChange = (e) => {
    setMultipleFiles(Array.from(e.target.files));
  };

  // Upload single image
  const handleUploadSingleImage = async (e) => {
    e.preventDefault();

    if (!singleFile) {
      showError("Please select an image file");
      return;
    }

    setLoading(true);
    try {
      await uploadSingleImage(selectedProductId, singleFile, isMainImage);
      showSuccess("Image uploaded successfully");
      setSingleFile(null);
      setIsMainImage(false);
      loadProductImages(selectedProductId);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  // Upload multiple images
  const handleUploadMultipleImages = async (e) => {
    e.preventDefault();

    if (multipleFiles.length === 0) {
      showError("Please select at least one image file");
      return;
    }

    setLoading(true);
    try {
      await uploadMultipleImages(selectedProductId, multipleFiles);
      showSuccess("Images uploaded successfully");
      setMultipleFiles([]);
      loadProductImages(selectedProductId);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to upload images");
    } finally {
      setLoading(false);
    }
  };

  // Delete image
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    setLoading(true);
    try {
      await deleteProductImage(imageId);
      showSuccess("Image deleted successfully");
      loadProductImages(selectedProductId);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete image");
    } finally {
      setLoading(false);
    }
  };

  // Export products to PDF
  const handleExportPdf = async () => {
    setLoading(true);
    try {
      const response = await exportProductPdf();

      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `products_${new Date().toISOString().slice(0, 10)}.pdf`);
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showSuccess("PDF exported successfully");
    } catch (err) {
      showError(err.response?.data?.message || "Failed to export PDF");
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
    loadProducts();
  };

  // =============== JSX Render ===============

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 style={{ marginBottom: "0.5rem" }}>Product Management</h2>
          <p style={{ color: "#7f8c8d" }}>Create, update, and manage product inventory</p>
        </div>
        <button
          className="btn btn-success"
          onClick={handleExportPdf}
          disabled={loading || products.length === 0}
          title="Export products to PDF"
        >
          📥 Export PDF
        </button>
      </div>

      {/* Message Alert */}
      {message.text && (
        <div className={`alert alert-${message.type}`} role="alert">
          {message.text}
        </div>
      )}

      {/* Search Bar */}
      <div className="card shadow" style={{ padding: "2rem", marginBottom: "2rem" }}>
        <div className="row">
          <div className="col-md-9">
            <div className="form-group">
              <label>Search by product name</label>
              <input
                className="form-control"
                placeholder="Type product name..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-3" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                className="btn btn-primary"
                onClick={handleSearch}
                style={{ flex: 1 }}
                disabled={loading}
              >
                Search
              </button>

              <button
                className="btn btn-success"
                onClick={handleNewProduct}
                style={{ flex: 1 }}
                disabled={loading}
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div className="card shadow" style={{ width: "90%", maxWidth: "600px" }}>
            <div className="card-header">
              <h3 style={{ margin: 0 }}>
                {editingId ? "Edit Product" : "Create New Product"}
              </h3>
            </div>

            <form onSubmit={handleCreateOrUpdateProduct}>
              <div className="card-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
                {/* Product Name */}
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                    name="name"
                    placeholder="Enter product name"
                    value={productForm.name}
                    onChange={handleProductFormChange}
                  />
                  {formErrors.name && (
                    <div className="invalid-feedback d-block">{formErrors.name}</div>
                  )}
                </div>

                {/* Description */}
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    name="description"
                    placeholder="Enter product description"
                    value={productForm.description}
                    onChange={handleProductFormChange}
                    rows="4"
                  />
                </div>

                {/* Price & Quantity Row */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Price *</label>
                      <input
                        className={`form-control ${formErrors.price ? "is-invalid" : ""}`}
                        type="number"
                        name="price"
                        placeholder="0.00"
                        step="0.01"
                        value={productForm.price}
                        onChange={handleProductFormChange}
                      />
                      {formErrors.price && (
                        <div className="invalid-feedback d-block">{formErrors.price}</div>
                      )}
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Quantity *</label>
                      <input
                        className={`form-control ${formErrors.quantity ? "is-invalid" : ""}`}
                        type="number"
                        name="quantity"
                        placeholder="0"
                        value={productForm.quantity}
                        onChange={handleProductFormChange}
                      />
                      {formErrors.quantity && (
                        <div className="invalid-feedback d-block">{formErrors.quantity}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-footer" style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {editingId ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="table table-bordered table-hover shadow">
          <thead className="table-dark">
            <tr>
              <th>Product Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
              <th width="250">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product.productId}>
                  <td>
                    <strong>{product.name}</strong>
                  </td>
                  <td>{product.description ? product.description.substring(0, 50) + "..." : "-"}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.quantity}</td>
                  <td>
                    <span className={`badge ${product.status === "ACTIVE" ? "bg-success" : "bg-danger"}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex align-items-center" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
                      <button
                        className="btn btn-sm btn-info"
                        onClick={() => handleEditProduct(product)}
                        disabled={loading}
                        title="Edit"
                      >
                        Edit
                      </button>

                      <button
                        className={`btn btn-sm ${product.status === "ACTIVE" ? "btn-warning" : "btn-success"}`}
                        onClick={() => handleToggleStatus(product.productId)}
                        disabled={loading}
                        title={product.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      >
                        {product.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      </button>

                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleOpenImageModal(product.productId)}
                        disabled={loading}
                        title="Manage Images"
                      >
                        Images
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center" style={{ padding: "2rem" }}>
                  No products found
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

      {/* Image Management Modal */}
      {showImageModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1001,
          overflowY: "auto"
        }}>
          <div className="card shadow" style={{ width: "90%", maxWidth: "700px", margin: "2rem 0" }}>
            <div className="card-header">
              <h3 style={{ margin: 0 }}>Manage Product Images</h3>
            </div>

            <div className="card-body" style={{ maxHeight: "70vh", overflowY: "auto" }}>
              {/* Upload Single Image */}
              <div style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid #e0e0e0" }}>
                <h5 style={{ marginBottom: "1rem" }}>Upload Single Image</h5>

                <form onSubmit={handleUploadSingleImage}>
                  <div className="form-group">
                    <label>Select Image File</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleSingleFileChange}
                    />
                  </div>

                  <div className="form-group">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isMainCheckbox"
                        checked={isMainImage}
                        onChange={(e) => setIsMainImage(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="isMainCheckbox">
                        Set as main image
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !singleFile}
                  >
                    Upload Image
                  </button>
                </form>
              </div>

              {/* Upload Multiple Images */}
              <div style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid #e0e0e0" }}>
                <h5 style={{ marginBottom: "1rem" }}>Upload Multiple Images</h5>

                <form onSubmit={handleUploadMultipleImages}>
                  <div className="form-group">
                    <label>Select Image Files</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      multiple
                      onChange={handleMultipleFilesChange}
                    />
                    <small style={{ color: "#7f8c8d" }}>
                      {multipleFiles.length} file(s) selected
                    </small>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || multipleFiles.length === 0}
                  >
                    Upload Multiple Images
                  </button>
                </form>
              </div>

              {/* Display Product Images */}
              <div>
                <h5 style={{ marginBottom: "1rem" }}>Product Images ({productImages.length})</h5>

                {productImages.length > 0 ? (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                    gap: "1rem"
                  }}>
                    {productImages.map((image) => {
                      // Build image URL from uploads folder
                      // Image object should contain: imageId, imagePath or fileName
                      const imageUrl = `http://localhost:8api/api${image.url}`;

                      return (
                        <div
                          key={image.imageId}
                          style={{
                            border: image.isMain ? "3px solid #27ae60" : "1px solid #e0e0e0",
                            borderRadius: "8px",
                            overflow: "hidden",
                            textAlign: "center",
                            backgroundColor: "#f8f9fa"
                          }}
                        >
                          <div style={{ position: "relative", paddingBottom: "100%" }}>
                            <img
                              src={`http://localhost:8080/api${image.url}`}
                              alt="Product"
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover"
                              }}
                              onError={(e) => {
                                e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150'%3E%3Crect fill='%23e0e0e0' width='150' height='150'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%237f8c8d'%3EImage Not Found%3C/text%3E%3C/svg%3E";
                              }}
                            />

                          </div>

                          {image.isMain && (
                            <div style={{
                              backgroundColor: "#27ae60",
                              color: "white",
                              padding: "0.25rem",
                              fontSize: "0.75rem",
                              fontWeight: "600"
                            }}>
                              MAIN
                            </div>
                          )}

                          <button
                            className="btn btn-sm btn-danger w-100"
                            onClick={() => handleDeleteImage(image.imageId)}
                            disabled={loading}
                            style={{ borderRadius: 0 }}
                          >
                            Delete
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p style={{ color: "#7f8c8d", textAlign: "center" }}>
                    No images uploaded yet
                  </p>
                )}
              </div>
            </div>

            <div className="card-footer">
              <button
                className="btn btn-secondary"
                onClick={handleCloseImageModal}
                disabled={loading}
                style={{ width: "100%" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
