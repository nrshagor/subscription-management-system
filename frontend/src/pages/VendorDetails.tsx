import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { VendorType } from "../types/vendorType";
import type { PlanType } from "../types/planType";
import { apiFetch } from "../services/api";

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorType | null>(null);
  const [plans, setPlans] = useState<PlanType[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<number | null>(null);

  useEffect(() => {
    apiFetch(`/vendors/${id}/plans`)
      .then((data) => {
        setVendor(data.vendor);
        setPlans(data.plans);
      })
      .catch((err: unknown) => {
        console.error("Failed to load vendor details:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Default vendor logo component
  const DefaultVendorLogo = ({ name }: { name: string }) => {
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 shadow-sm">
        <span className="text-xl font-bold text-white">{initials}</span>
      </div>
    );
  };

  // Default plan icon component
  const DefaultPlanIcon = ({ name }: { name: string }) => {
    const planType = name.toLowerCase();
    let icon = null;
    let gradient =
      "from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700";

    if (planType.includes("basic") || planType.includes("starter")) {
      icon = (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
      gradient =
        "from-green-500 to-green-600 dark:from-green-600 dark:to-green-700";
    } else if (planType.includes("pro") || planType.includes("premium")) {
      icon = (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      );
      gradient =
        "from-yellow-500 to-orange-600 dark:from-yellow-600 dark:to-orange-700";
    } else if (
      planType.includes("enterprise") ||
      planType.includes("business")
    ) {
      icon = (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      );
      gradient =
        "from-purple-500 to-pink-600 dark:from-purple-600 dark:to-pink-700";
    } else {
      icon = (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      );
    }

    return (
      <div
        className={`flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${gradient}`}
      >
        <div className="text-white">{icon}</div>
      </div>
    );
  };

  const purchasePlan = async (planId: number) => {
    try {
      setPurchasing(planId);
      setMessage("");
      await apiFetch("/subscribe", {
        method: "POST",
        body: JSON.stringify({ plan_id: planId }),
      });
      setMessage("Subscription purchased successfully!");

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage("");
        navigate("/dashboard");
      }, 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(`Error: ${err.message}`);
      } else {
        setMessage("Failed to purchase subscription");
      }
    } finally {
      setPurchasing(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading plans...
          </p>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            <svg
              className="w-10 h-10 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Vendor Not Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The vendor you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate("/vendors")}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 text-white font-medium rounded-lg transition-all duration-300"
          >
            Back to Vendors
          </button>
        </div>
      </div>
    );
  }

  // Sort plans by price (ascending)
  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* Vendor Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/vendors")}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-4 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Vendors
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 rounded-lg bg-white dark:bg-gray-800 p-2 shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                  {vendor.logo ? (
                    <img
                      src={vendor.logo}
                      alt={vendor.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Create a wrapper div for the default logo
                        const wrapper = document.createElement("div");
                        wrapper.className =
                          "flex items-center justify-center w-full h-full";

                        // Create the default logo element
                        const defaultLogo = document.createElement("div");
                        defaultLogo.className =
                          "flex items-center justify-center w-full h-full rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700";

                        // Create the initials span
                        const initialsSpan = document.createElement("span");
                        initialsSpan.className = "text-xl font-bold text-white";
                        initialsSpan.textContent = vendor.name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2);

                        // Assemble the structure
                        defaultLogo.appendChild(initialsSpan);
                        wrapper.appendChild(defaultLogo);

                        // Replace the img with the default logo
                        e.currentTarget.parentNode?.replaceChild(
                          wrapper,
                          e.currentTarget,
                        );
                      }}
                    />
                  ) : (
                    <DefaultVendorLogo name={vendor.name} />
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {vendor.name}
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
                {vendor.description}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                Available Plans
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {plans.length}
              </p>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("Error")
                ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
            }`}
          >
            <div className="flex items-center">
              {message.includes("Error") ? (
                <svg
                  className="w-5 h-5 text-red-500 dark:text-red-400 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-green-500 dark:text-green-400 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <p
                className={`font-medium ${
                  message.includes("Error")
                    ? "text-red-800 dark:text-red-300"
                    : "text-green-800 dark:text-green-300"
                }`}
              >
                {message}
              </p>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPlans.map((plan, index) => {
            const isPopular = index === Math.floor(sortedPlans.length / 2); // Middle plan is "popular"

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
                  isPopular
                    ? "ring-2 ring-blue-500 dark:ring-blue-400 scale-105"
                    : "border border-gray-200 dark:border-gray-700"
                } bg-white dark:bg-gray-800`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Plan Header with Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(plan.price)}
                        </span>
                        <span className="ml-2 text-gray-500 dark:text-gray-400">
                          /month
                        </span>
                      </div>
                    </div>
                    <DefaultPlanIcon name={plan.name} />
                  </div>

                  {/* Features List */}
                  {plan.features && plan.features.length > 0 && (
                    <div className="mb-8">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Features
                      </h4>
                      <ul className="space-y-2">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <svg
                              className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-gray-600 dark:text-gray-300">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Purchase Button */}
                  <button
                    onClick={() => purchasePlan(plan.id)}
                    disabled={purchasing === plan.id}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                      isPopular
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
                    } ${
                      purchasing === plan.id
                        ? "opacity-75 cursor-not-allowed"
                        : "transform hover:-translate-y-0.5"
                    }`}
                  >
                    {purchasing === plan.id ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        Subscribe Now
                        <svg
                          className="w-4 h-4 ml-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {plans.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Plans Available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              This vendor doesn't have any subscription plans at the moment.
            </p>
          </div>
        )}

        {/* Plan Comparison Helper */}
        {plans.length >= 2 && (
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Choose the Right Plan
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Compare plans to find the perfect fit for your needs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["Basic", "Standard", "Premium"].map((type, index) => {
                const matchingPlan = sortedPlans[index];
                return matchingPlan ? (
                  <div key={type} className="text-center">
                    <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                      {type}
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {matchingPlan.name}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {formatCurrency(matchingPlan.price)}/month
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDetails;
