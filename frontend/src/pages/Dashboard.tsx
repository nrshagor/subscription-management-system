import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import {
  TrendingUp,
  Package,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Calendar,
  ArrowUpRight,
  RefreshCw,
  Shield,
  Zap,
  Star,
  MoreVertical,
  Eye,
  Download,
  Users,
  DollarSign,
} from "lucide-react";
import { useTheme } from "../context/useTheme";

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
  const { dark } = useTheme();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [upgradingId, setUpgradingId] = useState<number | null>(null);
  const [stats, setStats] = useState({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    totalMonthlyCost: 0,
    vendors: 0,
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    if (subs.length > 0) {
      const activeSubs = subs.filter((s) => s.status === "active").length;
      const totalCost = subs.reduce((sum, s) => sum + s.plan.price, 0);
      const uniqueVendors = new Set(subs.map((s) => s.plan.vendor.name)).size;

      setStats({
        totalSubscriptions: subs.length,
        activeSubscriptions: activeSubs,
        totalMonthlyCost: totalCost,
        vendors: uniqueVendors,
      });
    }
  }, [subs]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/my-subscriptions");
      setSubs(data);
    } catch {
      setMessage("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  const upgradePlan = async (subId: number, newPlanId: number) => {
    try {
      setUpgradingId(subId);
      setMessage("");
      await apiFetch("/upgrade", {
        method: "POST",
        body: JSON.stringify({
          subscription_id: subId,
          new_plan_id: newPlanId,
        }),
      });
      setMessage("✨ Subscription upgraded successfully!");
      const updated = await apiFetch("/my-subscriptions");
      setSubs(updated);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else {
        setMessage("Upgrade failed. Please try again.");
      }
    } finally {
      setUpgradingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-500/20 text-green-600 dark:text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400";
      case "cancelled":
        return "bg-red-500/20 text-red-600 dark:text-red-400";
      case "expired":
        return "bg-gray-500/20 text-gray-600 dark:text-gray-400";
      default:
        return "bg-blue-500/20 text-blue-600 dark:text-blue-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div
      className={`min-h-screen ${dark ? "bg-gray-950" : "bg-gray-50"} transition-colors duration-300`}
    >
      {/* Header */}
      <div
        className={`border-b ${dark ? "border-gray-800" : "border-gray-200"}`}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className={`mt-2 ${dark ? "text-gray-400" : "text-gray-600"}`}>
                Manage your subscriptions and billing
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchSubscriptions}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${dark ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"} border ${dark ? "border-gray-700" : "border-gray-200"} transition-colors duration-200`}
              >
                <RefreshCw
                  className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                <Zap className="h-4 w-4" />
                Add Subscription
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className={`p-6 rounded-2xl ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Total Subscriptions
                </p>
                <p className="text-2xl font-bold mt-2">
                  {stats.totalSubscriptions}
                </p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-500">+2 this month</span>
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Active Subscriptions
                </p>
                <p className="text-2xl font-bold mt-2">
                  {stats.activeSubscriptions}
                </p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div
              className={`text-sm mt-4 ${dark ? "text-gray-400" : "text-gray-600"}`}
            >
              {(
                (stats.activeSubscriptions / stats.totalSubscriptions) * 100 ||
                0
              ).toFixed(0)}
              % active rate
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Monthly Cost
                </p>
                <p className="text-2xl font-bold mt-2">
                  {formatPrice(stats.totalMonthlyCost)}
                </p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/10">
                <DollarSign className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <div
              className={`text-sm mt-4 ${dark ? "text-gray-400" : "text-gray-600"}`}
            >
              / month
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border shadow-sm`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Vendors
                </p>
                <p className="text-2xl font-bold mt-2">{stats.vendors}</p>
              </div>
              <div className="p-3 rounded-full bg-orange-500/10">
                <Users className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <div
              className={`text-sm mt-4 ${dark ? "text-gray-400" : "text-gray-600"}`}
            >
              Active vendors
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.includes("success")
                ? "bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400"
                : "bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400"
            }`}
          >
            {message.includes("success") ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message}</span>
            <button
              onClick={() => setMessage("")}
              className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>
        )}

        {/* Subscriptions Section */}
        <div
          className={`rounded-2xl ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border shadow-sm overflow-hidden`}
        >
          <div
            className={`p-6 border-b ${dark ? "border-gray-800" : "border-gray-200"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  My Subscriptions
                </h2>
                <p
                  className={`mt-1 text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Manage and upgrade your subscription plans
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`px-3 py-1.5 text-sm rounded-lg ${dark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"} transition-colors duration-200`}
                >
                  Filter
                </button>
                <button
                  className={`px-3 py-1.5 text-sm rounded-lg ${dark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"} transition-colors duration-200`}
                >
                  Sort
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400 mb-4" />
                <p className={dark ? "text-gray-400" : "text-gray-600"}>
                  Loading subscriptions...
                </p>
              </div>
            ) : subs.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">
                  No subscriptions yet
                </h3>
                <p className={dark ? "text-gray-400" : "text-gray-600"}>
                  Get started by adding your first subscription
                </p>
                <button className="mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
                  Add Subscription
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {subs.map((s) => (
                  <div
                    key={s.id}
                    className={`group relative p-6 rounded-xl border ${dark ? "border-gray-800 hover:border-gray-700 bg-gray-900/50" : "border-gray-200 hover:border-gray-300 bg-white"} transition-all duration-300 hover:shadow-lg`}
                  >
                    {/* Vendor Badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">
                            {s.plan.vendor.name}
                          </h3>
                          <p
                            className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}
                          >
                            Subscription #{s.id}
                          </p>
                        </div>
                      </div>
                      <button
                        className={`p-2 rounded-lg ${dark ? "hover:bg-gray-800" : "hover:bg-gray-100"} transition-colors duration-200`}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Plan Details */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{s.plan.name}</p>
                          <p className="text-2xl font-bold mt-1">
                            {formatPrice(s.plan.price)}
                          </p>
                          <p
                            className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}
                          >
                            per month
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(s.status)}`}
                        >
                          {getStatusIcon(s.status)}
                          {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-4 border-t dark:border-gray-800 border-gray-200">
                        <button
                          onClick={() => upgradePlan(s.id, s.plan.id + 1)}
                          disabled={upgradingId === s.id}
                          className="group/upgrade flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium hover:shadow-lg hover:shadow-yellow-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                          {upgradingId === s.id ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              Upgrading...
                            </>
                          ) : (
                            <>
                              <ArrowUpRight className="h-4 w-4 group-hover/upgrade:translate-x-0.5 group-hover/upgrade:-translate-y-0.5 transition-transform" />
                              Upgrade Plan
                            </>
                          )}
                        </button>
                        <button
                          className={`p-3 rounded-lg border ${dark ? "border-gray-700 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-50"} transition-colors duration-200`}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className={`p-3 rounded-lg border ${dark ? "border-gray-700 hover:bg-gray-800" : "border-gray-300 hover:bg-gray-50"} transition-colors duration-200`}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Additional Info */}
                      <div
                        className={`flex items-center justify-between text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>Next billing: Next month</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>Popular Plan</span>
                        </div>
                      </div>
                    </div>

                    {/* Upgrade Badge */}
                    <div className="absolute -top-2 -right-2">
                      <div className="px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold animate-pulse-slow">
                        UPGRADE AVAILABLE
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={`p-6 rounded-2xl ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border shadow-sm`}
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </h3>
            <p
              className={`text-sm mb-4 ${dark ? "text-gray-400" : "text-gray-600"}`}
            >
              Update your payment information
            </p>
            <button
              className={`w-full py-2 rounded-lg ${dark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"} transition-colors duration-200`}
            >
              Manage Payments
            </button>
          </div>

          <div
            className={`p-6 rounded-2xl ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border shadow-sm`}
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Subscription Health
            </h3>
            <p
              className={`text-sm mb-4 ${dark ? "text-gray-400" : "text-gray-600"}`}
            >
              {stats.activeSubscriptions} out of {stats.totalSubscriptions}{" "}
              active
            </p>
            <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                style={{
                  width: `${(stats.activeSubscriptions / stats.totalSubscriptions) * 100 || 0}%`,
                }}
              />
            </div>
          </div>

          <div
            className={`p-6 rounded-2xl ${dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border shadow-sm`}
          >
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Spending Overview
            </h3>
            <p className="text-2xl font-bold mb-2">
              {formatPrice(stats.totalMonthlyCost)}
            </p>
            <p
              className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}
            >
              Monthly recurring charges
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
