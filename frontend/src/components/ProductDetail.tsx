import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { apiClient, type ProductResponse } from "../services/api";

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Product ID is required");
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getProductById(Number(id));
        setProduct(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (!product || !id) return;

    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await apiClient.deleteProduct(Number(id));
        navigate("/products");
      } catch (error: any) {
        alert(error.response?.data?.message || "Failed to delete product");
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div data-testid="error-message">{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div data-testid="product-detail-page">
      <div className="page-header">
        <h1 data-testid="product-name">{product.name}</h1>
        <div className="action-buttons">
          <Link to={`/products/edit/${product.id}`} data-testid="edit-product">
            <button>Edit Product</button>
          </Link>
          <button
            onClick={handleDelete}
            data-testid="delete-product"
            className="delete-button"
          >
            Delete Product
          </button>
          <Link to="/products" data-testid="back-to-products">
            <button>Back to Products</button>
          </Link>
        </div>
      </div>

      <div className="product-detail" data-testid="product-detail">
        <div className="detail-row">
          <strong>Price:</strong>
          <span data-testid="product-price">${product.price}</span>
        </div>
        <div className="detail-row">
          <strong>Quantity:</strong>
          <span data-testid="product-quantity">{product.quantity}</span>
        </div>
        <div className="detail-row">
          <strong>Category:</strong>
          <span data-testid="product-category">{product.category}</span>
        </div>
        <div className="detail-row">
          <strong>Description:</strong>
          <span data-testid="product-description">
            {product.description || "No description"}
          </span>
        </div>
        <div className="detail-row">
          <strong>Status:</strong>
          <span data-testid="product-status">
            {product.active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
};
