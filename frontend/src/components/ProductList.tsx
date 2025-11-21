import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiClient, type ProductResponse } from "../services/api";

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getProducts({
          name: searchTerm || undefined,
          category: categoryFilter || undefined,
        });
        setProducts(response.data.content);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, categoryFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the useEffect dependency
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div data-testid="error-message">{error}</div>;

  return (
    <div data-testid="product-list-page">
      <div className="page-header">
        <h1>Products</h1>
        <Link to="/products/create" data-testid="create-product">
          <button>Create New Product</button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="product-filters">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="search-input"
          />
        </form>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          data-testid="category-filter"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Books">Books</option>
          <option value="Clothing">Clothing</option>
        </select>
      </div>

      {/* Product List */}
      <div className="product-list" data-testid="product-list">
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="product-item"
              data-testid={`product-${product.id}`}
            >
              <h3>{product.name}</h3>
              <p>Price: ${product.price}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Category: {product.category}</p>

              <div className="product-actions">
                <Link
                  to={`/products/${product.id}`}
                  data-testid={`view-product-${product.id}`}
                >
                  <button>View</button>
                </Link>
                <Link
                  to={`/products/edit/${product.id}`}
                  data-testid={`edit-product-${product.id}`}
                >
                  <button>Edit</button>
                </Link>
                <button
                  onClick={async () => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this product?"
                      )
                    ) {
                      try {
                        await apiClient.deleteProduct(product.id);
                        setProducts(
                          products.filter((p) => p.id !== product.id)
                        );
                      } catch (error) {
                        alert("Failed to delete product");
                      }
                    }
                  }}
                  data-testid={`delete-product-${product.id}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
