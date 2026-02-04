import React, { useEffect, useState } from "react";
import type { VendorType } from "../types/vendorType";
import { apiFetch } from "../services/api";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const Vendors = () => {
  const [vendors, setVendors] = useState<VendorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Default placeholder image component
  const DefaultLogo = ({ name }: { name: string }) => {
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="flex items-center justify-center w-full h-24 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-lg">
        <span className="text-2xl font-bold text-white">{initials}</span>
      </div>
    );
  };

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
  if (error)
    return <p className="p-6 text-red-500 dark:text-red-400">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Vendors
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover our trusted service providers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 group"
            >
              {/* Vendor Logo Section */}
              <div className="p-6 pb-0">
                <div className="flex items-center justify-center h-24 mb-4">
                  {vendor.logo ? (
                    <img
                      src={vendor.logo}
                      alt={vendor.name}
                      className="max-h-full max-w-full object-contain rounded-lg bg-gray-100 dark:bg-gray-700 p-2"
                      onError={(e) => {
                        // If image fails to load, replace with default
                        e.currentTarget.style.display = "none";
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = "";
                          const defaultLogo = document.createElement("div");
                          defaultLogo.className =
                            "flex items-center justify-center w-full h-24 bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 rounded-lg";
                          defaultLogo.innerHTML = `<span class="text-2xl font-bold text-white">${vendor.name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}</span>`;
                          parent.appendChild(defaultLogo);
                        }
                      }}
                    />
                  ) : (
                    <DefaultLogo name={vendor.name} />
                  )}
                </div>
              </div>

              {/* Vendor Content */}
              <div className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {vendor.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {vendor.description}
                  </p>
                </div>

                {/* View Plans Button */}
                <Link
                  to={`/vendors/${vendor.id}`}
                  className="inline-flex items-center justify-center w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg group/btn"
                >
                  View Plans
                  <svg
                    className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {vendors.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <div className="flex items-center justify-center w-24 h-24 mx-auto bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full">
                <svg
                  className="w-12 h-12 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Vendors Available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Check back later for new service providers
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendors;
