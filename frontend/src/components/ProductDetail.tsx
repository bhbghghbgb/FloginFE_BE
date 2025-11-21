import React, { useEffect, useState } from "react";
import { apiClient, type ProductResponse } from "../services/api";

interface ProductDetailProps {
  productId: number;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId }) => {
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await apiClient.getProductById(productId);
        setProduct(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div data-testid="error-message">{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div data-testid="product-detail">
      <h1 data-testid="product-name">{product.name}</h1>
      <p data-testid="product-price">Price: ${product.price}</p>
      <p data-testid="product-quantity">Quantity: {product.quantity}</p>
      <p data-testid="product-category">Category: {product.category}</p>
      <p data-testid="product-description">
        Description: {product.description}
      </p>
    </div>
  );
};
