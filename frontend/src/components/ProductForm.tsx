import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  apiClient,
  type ProductRequest,
  type ProductResponse,
} from "../services/api";
import { type ProductFormData, validateProduct } from "../utils/validation";

export const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: "",
    quantity: "",
    description: "",
    category: "",
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const isEditing = !!id;

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await apiClient.getProductById(Number(id));
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
          setErrors(["Failed to load product"]);
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors([]);
    setSuccessMessage("");

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
      let response: { data: ProductResponse };
      if (isEditing) {
        response = await apiClient.updateProduct(Number(id), productRequest);
        setSuccessMessage(
          `Product updated successfully!: ${JSON.stringify(response)}`
        );
      } else {
        response = await apiClient.createProduct(productRequest);
        setSuccessMessage(
          `Product created successfully!: ${JSON.stringify(response)}`
        );
      }

      // Redirect after success
      setTimeout(() => {
        navigate("/products");
      }, 2000);
    } catch (error: any) {
      setErrors([
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "create"} product`,
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/products");
  };

  return (
    <div data-testid="product-form-page">
      <h1>{isEditing ? "Edit Product" : "Create Product"}</h1>

      {successMessage && (
        <div className="success-message" data-testid="success-message">
          {successMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="product-form"
        data-testid="product-form"
      >
        {errors.length > 0 && (
          <ul className="error-list" data-testid="form-errors">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}

        <div className="form-group">
          <label htmlFor="name">Product Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            data-testid="product-name-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            data-testid="product-price-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity *</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            data-testid="product-quantity-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            data-testid="product-category-input"
          >
            <option value="">Select a category</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Clothing">Clothing</option>
            <option value="Home">Home</option>
            <option value="Sports">Sports</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            data-testid="product-description-input"
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            data-testid="submit-product"
          >
            {isSubmitting
              ? "Saving..."
              : isEditing
              ? "Update Product"
              : "Create Product"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            data-testid="cancel-product"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
