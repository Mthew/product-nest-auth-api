import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";

export const AuthDemo = () => {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    isAdmin,
    isSeller,
    loginWithCredentials,
    logout,
    clearError,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginWithCredentials(email, password);
      setEmail("");
      setPassword("");
    } catch (error) {
      // Error is already handled by the store
      console.error("Login failed:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated && user) {
    return (
      <div className="p-4 border rounded">
        <h2 className="text-xl font-bold mb-4">Welcome, {user.email}!</h2>
        <div className="mb-4">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Is Admin:</strong> {isAdmin ? "Yes" : "No"}
          </p>
          <p>
            <strong>Is Seller:</strong> {isSeller ? "Yes" : "No"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {isLoading ? "Logging out..." : "Logout"}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button
            onClick={clearError}
            className="ml-2 text-sm underline hover:no-underline"
          >
            Clear
          </button>
        </div>
      )}

      <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
        <p className="text-sm mb-2">
          <strong>Demo Credentials:</strong>
        </p>
        <p className="text-sm">Admin: admin@example.com / admin123</p>
        <p className="text-sm">Seller: seller@example.com / seller123</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};
