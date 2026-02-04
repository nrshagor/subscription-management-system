import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ProductType } from "../types/product";
import { apiFetch } from "../services/api";

const Products = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/products")
      .then((data) => {
        setProducts(data.products);
        setIsPremiumUser(data.is_premium_user);
      })
      .catch((err: unknown) => {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to load products");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-4">Loading products...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      {!isPremiumUser && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 rounded">
          <p className="font-semibold text-yellow-700">
            You are viewing free products only.
          </p>
          <Link
            to="/vendors"
            className="inline-block mt-2 bg-blue-600 text-white px-3 py-1 rounded"
          >
            Upgrade to Premium
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className={`border p-4 rounded shadow ${
              p.is_premium ? "bg-gray-100" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-sm">{p.description}</p>

            {p.is_premium && (
              <span className="inline-block mt-2 text-xs bg-purple-600 text-white px-2 py-1 rounded">
                Premium
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
