import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import type { ProductType } from "../types/product";
import { apiFetch } from "../services/api";
import { Loader2, ShieldCheck, AlertCircle, Lock, Unlock } from "lucide-react";

// API Response Type

const Products: React.FC = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchProducts = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError("");

      const data = await apiFetch("/products");
      setProducts(data.products);
      setIsPremiumUser(data.is_premium_user);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load products. Please try again later.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter products based on user premium status
  const filteredProducts = isPremiumUser
    ? products
    : products.filter((product) => !product.is_premium);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 dark:text-blue-400" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 dark:text-red-300">
                Unable to load products
              </h3>
              <p className="mt-2 text-red-700 dark:text-red-400">{error}</p>
              <button
                onClick={() => fetchProducts()}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No products available
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            There are currently no products to display.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isPremiumUser
              ? "Access all premium and free products"
              : "Browse our collection of free products"}
          </p>
        </div>

        {/* Premium Upgrade Banner */}
        {!isPremiumUser && (
          <div className="mb-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                  <Lock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">
                    Upgrade to Premium
                  </h3>
                  <p className="text-yellow-700 dark:text-yellow-400 mt-1">
                    Unlock {products.filter((p) => p.is_premium).length} premium
                    products
                  </p>
                </div>
              </div>
              <Link
                to="/vendors"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all transform hover:scale-105"
              >
                <Unlock className="w-4 h-4" />
                Upgrade Now
              </Link>
            </div>
          </div>
        )}

        {/* Products Count */}
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Showing {filteredProducts.length} of {products.length} products
          </span>
          {isPremiumUser && (
            <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Premium Member</span>
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-lg ${
                product.is_premium
                  ? "border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-900"
                  : "border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800"
              }`}
            >
              {/* Premium Badge */}
              {product.is_premium == true ? (
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold rounded-full">
                    <ShieldCheck className="w-3 h-3" />
                    Premium
                  </span>
                </div>
              ) : (
                <div className="absolute top-4 right-4 z-10"></div>
              )}

              {/* Product Image Placeholder */}
              <div
                className={`h-48 overflow-hidden ${
                  product.is_premium
                    ? "bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30"
                    : "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
                }`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span
                    className={`text-4xl font-bold ${
                      product.is_premium
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`}
                  >
                    {product.name.charAt(0)}
                  </span>
                </div>
              </div>

              {/* Product Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      product.is_premium
                        ? "text-purple-600 dark:text-purple-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {product.is_premium ? "Premium Access" : "Free"}
                  </span>

                  <button className="px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-blue-600 hover:bg-blue-700 text-white">
                    View Details
                  </button>
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Premium Products Locked Message */}
        {!isPremiumUser && products.some((p) => p.is_premium) && (
          <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
              <Lock className="w-4 h-4" />
              <p className="text-sm">
                {products.filter((p) => p.is_premium).length} premium products
                are locked.
                <Link
                  to="/vendors"
                  className="ml-1 text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Upgrade to unlock
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
