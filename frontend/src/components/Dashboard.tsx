import { Link } from "react-router-dom";

export const Dashboard: React.FC = () => {
  return (
    <div data-testid="dashboard-page">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>

      <div className="dashboard-actions">
        <Link to="/products" data-testid="view-products-link">
          <button>View Products</button>
        </Link>
        <Link to="/products/create" data-testid="create-product-link">
          <button>Create New Product</button>
        </Link>
      </div>
    </div>
  );
};
