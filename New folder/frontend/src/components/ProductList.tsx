import React, { useEffect, useState } from "react";
import { apiClient, type ProductResponse } from "../services/api";

export const ProductList: React.FC = () => {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getProducts();
        setProducts(response.data.content);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div data-testid="error-message">{error}</div>;

  return (
    <div data-testid="product-list">
      {products.map((product) => (
        <div key={product.id} data-testid={`product-${product.id}`}>
          <h3>{product.name}</h3>
          <p>Price: ${product.price}</p>
          <p>Quantity: {product.quantity}</p>
          <p>Category: {product.category}</p>
        </div>
      ))}
    </div>
  );
};
