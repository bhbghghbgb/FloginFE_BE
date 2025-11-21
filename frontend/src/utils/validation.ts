export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateUsername = (username: string): ValidationResult => {
  const errors: string[] = [];

  if (!username || username.trim() === "") {
    errors.push("Username is required");
  } else {
    if (username.length < 3)
      errors.push("Username must be at least 3 characters");
    if (username.length > 20)
      errors.push("Username must be less than 20 characters");
    if (!/^[a-zA-Z0-9_]+$/.test(username))
      errors.push(
        "Username can only contain letters, numbers, and underscores"
      );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePassword = (password: string): ValidationResult => {
  const errors: string[] = [];

  if (!password || password.trim() === "") {
    errors.push("Password is required");
  } else {
    if (password.length < 6)
      errors.push("Password must be at least 6 characters");
    if (password.length > 50)
      errors.push("Password must be less than 50 characters");
    if (!/[a-zA-Z]/.test(password))
      errors.push("Password must contain at least one letter");
    if (!/\d/.test(password))
      errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export interface ProductFormData {
  name: string;
  price: number | string;
  quantity: number | string;
  description: string;
  category: string;
}

export const validateProduct = (product: ProductFormData): ValidationResult => {
  const errors: string[] = [];

  // Name validation
  if (!product.name || product.name.trim() === "") {
    errors.push("Product name is required");
  } else {
    if (product.name.length < 3)
      errors.push("Product name must be at least 3 characters");
    if (product.name.length > 100)
      errors.push("Product name must be less than 100 characters");
  }

  // Price validation
  const price = Number(product.price);
  if (isNaN(price)) {
    errors.push("Price must be a valid number");
  } else {
    if (price < 1) errors.push("Price must be greater than 0");
    if (price > 999999999) errors.push("Price must be less than 999,999,999");
  }

  // Quantity validation
  const quantity = Number(product.quantity);
  if (isNaN(quantity)) {
    errors.push("Quantity must be a valid number");
  } else {
    if (quantity < 0) errors.push("Quantity must be 0 or greater");
    if (quantity > 99999) errors.push("Quantity must be less than 99,999");
  }

  // Description validation
  if (product.description && product.description.length > 500) {
    errors.push("Description must be less than 500 characters");
  }

  // Category validation
  if (!product.category || product.category.trim() === "") {
    errors.push("Category is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
