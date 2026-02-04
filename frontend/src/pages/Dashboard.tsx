import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

type Subscription = {
  id: number;
  status: string;
  plan: {
    id: number;
    name: string;
    price: number;
    vendor: {
      name: string;
    };
  };
};

const Dashboard = () => {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/my-subscriptions")
      .then(setSubs)
      .catch((err: unknown) => {
        console.error("Failed to load subscriptions:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const upgradePlan = async (subId: number, newPlanId: number) => {
    try {
      setMessage("");
      await apiFetch("/upgrade", {
        method: "POST",
        body: JSON.stringify({
          subscription_id: subId,
          new_plan_id: newPlanId,
        }),
      });
      setMessage("Subscription upgraded successfully!");

      // Refresh subscriptions
      const updated = await apiFetch("/my-subscriptions");
      setSubs(updated);

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(`Error: ${err.message}`);
      } else {
        setMessage("Failed to upgrade subscription");
      }
    }
  };

  // Helper function to get status badge style
  const getStatusBadgeStyle = (status: string) => {
    const baseStyles = "px-3 py-1 rounded-full text-xs font-semibold";

    switch (status.toLowerCase()) {
      case "active":
        return `${baseStyles} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case "pending":
        return `${baseStyles} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      case "cancelled":
        return `${baseStyles} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      case "expired":
        return `${baseStyles} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300`;
      default:
        return `${baseStyles} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading subscriptions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Subscriptions
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage and upgrade your current service subscriptions
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Subscriptions
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {subs.length}
              </p>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${message.includes("Error") ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" : "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"}`}
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
                className={`font-medium ${message.includes("Error") ? "text-red-800 dark:text-red-300" : "text-green-800 dark:text-green-300"}`}
              >
                {message}
              </p>
            </div>
          </div>
        )}

        {/* Subscriptions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {subs.map((subscription) => (
            <div
              key={subscription.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden group"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {subscription.plan.vendor.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {subscription.plan.name}
                    </p>
                  </div>
                  <span className={getStatusBadgeStyle(subscription.status)}>
                    {subscription.status}
                  </span>
                </div>

                {/* Plan Details */}
                <div className="mb-6">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Price
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatCurrency(subscription.plan.price)}
                      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        /month
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">
                      Plan ID
                    </span>
                    <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                      #{subscription.plan.id}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subscription ID
                    </span>
                    <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                      #{subscription.id}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-end">
                  <button
                    onClick={() =>
                      upgradePlan(subscription.id, subscription.plan.id + 1)
                    }
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 dark:from-yellow-600 dark:to-orange-600 dark:hover:from-yellow-700 dark:hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg"
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
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    Upgrade Plan
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {subs.length === 0 && !loading && (
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
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Active Subscriptions
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
              You don't have any subscriptions yet. Browse vendors to subscribe
              to a plan.
            </p>
            <a
              href="/vendors"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Browse Vendors
            </a>
          </div>
        )}

        {/* Summary Stats */}
        {subs.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Subscription Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800 mr-4">
                    <svg
                      className="w-6 h-6 text-blue-600 dark:text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Active Plans
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {
                        subs.filter((s) => s.status.toLowerCase() === "active")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800 mr-4">
                    <svg
                      className="w-6 h-6 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Monthly Total
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(
                        subs.reduce((total, sub) => total + sub.plan.price, 0),
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-800 mr-4">
                    <svg
                      className="w-6 h-6 text-purple-600 dark:text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Vendors
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {new Set(subs.map((sub) => sub.plan.vendor.name)).size}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
