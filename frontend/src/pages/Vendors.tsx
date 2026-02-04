import React, { useEffect, useState } from "react";
import type { VendorType } from "../types/vendorType";
import { apiFetch } from "../services/api";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const Vendors = () => {
  const [vendors, setVendors] = useState<VendorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/vendors")
      .then(setVendors)
      .catch((err: unknown) => {
        if (err instanceof Error) setError(err.message);
        else setError("Failed to load vendors");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      {vendors.map((v) => (
        <div key={v.id} className="border p-4 rounded shadow">
          {v.logo && <img src={v.logo} alt={v.name} className="h-16 mb-2" />}
          <h2 className="text-xl font-bold">{v.name}</h2>
          <p className="text-sm">{v.description}</p>

          <Link
            to={`/vendors/${v.id}`}
            className="mt-2 inline-block text-blue-600"
          >
            View Plans →
          </Link>
        </div>
      ))}
    </div>
  );
};

export default Vendors;
