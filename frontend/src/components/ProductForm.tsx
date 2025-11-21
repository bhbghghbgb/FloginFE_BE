import React, { useEffect, useState } from "react";
import {
  apiClient,
  type ProductRequest,
  type ProductResponse,
} from "../services/api";
import { validateProduct, type ProductFormData } from "../utils/validation";

interface ProductFormProps {
  productId?: number;
  onSuccess?: (product: ProductResponse) => void;
  onCancel?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  productId,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    quantity: "",
    description: "",
    category: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productId) {
      // Fetch product details and set form data
      const fetchProduct = async () => {
        try {
          const response = await apiClient.getProductById(productId);
          const product = response.data;
          setFormData({
            name: product.name,
            price: product.price.toString(),
            quantity: product.quantity.toString(),
            description: product.description || "",
            category: product.category,
          });
        } catch (error) {
          console.error("Failed to fetch product", error);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);

    const validation = validateProduct(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    const productRequest: ProductRequest = {
      name: formData.name,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      description: formData.description,
      category: formData.category,
    };

    try {
      let response;
      if (productId) {
        response = await apiClient.updateProduct(productId, productRequest);
      } else {
        response = await apiClient.createProduct(productRequest);
      }
      onSuccess?.(response.data);
    } catch (error: any) {
      setErrors([error.response?.data?.message || "Failed to save product"]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="product-form">
      {errors.length > 0 && (
        <ul data-testid="form-errors">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      )}
      <div>
        <label htmlFor="name">Product Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          data-testid="product-name-input"
        />
      </div>
      <div>
        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          data-testid="product-price-input"
        />
      </div>
      <div>
        <label htmlFor="quantity">Quantity</label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          data-testid="product-quantity-input"
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          data-testid="product-description-input"
        />
      </div>
      <div>
        <label htmlFor="category">Category</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          data-testid="product-category-input"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        data-testid="submit-product"
      >
        {isSubmitting ? "Saving..." : "Save Product"}
      </button>
      {onCancel && (
        <button type="button" onClick={onCancel} data-testid="cancel-product">
          Cancel
        </button>
      )}
    </form>
  );
};
