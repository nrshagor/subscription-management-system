import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  AlertCircle,
  CheckCircle,
  Sparkles,
  Shield,
  ArrowRight,
} from "lucide-react";
import { useTheme } from "../context/useTheme";

const Login = () => {
  const { login } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("admin@mail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      await login(email, password);
      setSuccess(true);
      // Add a slight delay for visual feedback
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${dark ? "bg-gradient-to-br from-gray-900 to-gray-950" : "bg-gradient-to-br from-blue-50 to-gray-100"} p-4 transition-colors duration-300`}
    >
      <div className="relative w-full max-w-md">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl" />

        <div
          className={`relative backdrop-blur-sm ${dark ? "bg-gray-900/80 border-gray-800" : "bg-white/90 border-gray-200"} rounded-2xl shadow-2xl border overflow-hidden transition-colors duration-300`}
        >
          <div
            className={`p-8 text-center ${dark ? "bg-gradient-to-r from-gray-800 to-gray-900" : "bg-gradient-to-r from-blue-500 to-purple-600"}`}
          >
            <div className="flex justify-center mb-4">
              <div
                className={`p-3 rounded-full ${dark ? "bg-gray-800/50" : "bg-white/20"} backdrop-blur-sm`}
              >
                <Shield
                  className={`h-8 w-8 ${dark ? "text-blue-400" : "text-white"}`}
                />
              </div>
            </div>
            <h1
              className={`text-3xl font-bold ${dark ? "text-white" : "text-white"} mb-2`}
            >
              Welcome Back
            </h1>
            <p className={`${dark ? "text-gray-300" : "text-blue-100"}`}>
              Sign in to your account
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="m-6 animate-fadeIn">
              <div
                className={`flex items-center gap-3 p-4 rounded-xl ${dark ? "bg-red-500/10 border border-red-500/30" : "bg-red-50 border border-red-200"}`}
              >
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <p
                    className={`font-medium ${dark ? "text-red-400" : "text-red-600"}`}
                  >
                    Authentication Failed
                  </p>
                  <p
                    className={`text-sm mt-1 ${dark ? "text-red-300" : "text-red-500"}`}
                  >
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="m-6 animate-fadeIn">
              <div
                className={`flex items-center gap-3 p-4 rounded-xl ${dark ? "bg-green-500/10 border border-green-500/30" : "bg-green-50 border border-green-200"}`}
              >
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <div>
                  <p
                    className={`font-medium ${dark ? "text-green-400" : "text-green-600"}`}
                  >
                    Login Successful!
                  </p>
                  <p
                    className={`text-sm mt-1 ${dark ? "text-green-300" : "text-green-500"}`}
                  >
                    Redirecting to dashboard...
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label
                className={`flex items-center gap-2 text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}
              >
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <div
                className={`relative group ${dark ? "bg-gray-800/50" : "bg-gray-50"} rounded-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:bg-transparent`}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-4 pl-12 ${dark ? "text-white bg-gray-800/50 focus:bg-gray-800/80" : "text-gray-900 bg-gray-50 focus:bg-white"} rounded-xl border-0 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 placeholder-gray-500`}
                  placeholder="you@example.com"
                  required
                />
                <Mail
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${dark ? "text-gray-400 group-focus-within:text-blue-400" : "text-gray-500 group-focus-within:text-blue-500"} transition-colors duration-200`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                className={`flex items-center gap-2 text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}
              >
                <Lock className="h-4 w-4" />
                Password
              </label>
              <div
                className={`relative group ${dark ? "bg-gray-800/50" : "bg-gray-50"} rounded-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:bg-transparent`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-4 pl-12 pr-12 ${dark ? "text-white bg-gray-800/50 focus:bg-gray-800/80" : "text-gray-900 bg-gray-50 focus:bg-white"} rounded-xl border-0 focus:ring-2 focus:ring-blue-500/30 transition-all duration-200 placeholder-gray-500`}
                  placeholder="Enter your password"
                  required
                />
                <Lock
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${dark ? "text-gray-400 group-focus-within:text-blue-400" : "text-gray-500 group-focus-within:text-blue-500"} transition-colors duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 ${dark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"} transition-colors duration-200`}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full group relative overflow-hidden py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${loading ? "opacity-90 cursor-not-allowed" : "hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"} ${dark ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"} text-white shadow-lg`}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    <span>Sign In</span>
                  </>
                )}
              </div>

              {/* Button shine effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Success indicator */}
              {success && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center"></div>
              )}
            </button>

            {/* Demo credentials hint */}
            <div
              className={`text-center p-4 rounded-xl ${dark ? "bg-gray-800/30" : "bg-blue-50/50"} border ${dark ? "border-gray-700" : "border-blue-100"}`}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-yellow-500" />
                <p
                  className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Demo Credentials
                </p>
              </div>
              <div
                className={`grid grid-cols-2 gap-2 text-xs ${dark ? "text-gray-400" : "text-gray-600"}`}
              >
                <div className="text-left">
                  <span className="font-medium">Email:</span> admin@mail.com
                </div>
                <div className="text-right">
                  <span className="font-medium">Password:</span> demo123
                </div>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
              <p
                className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}
              >
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="group inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold hover:underline transition-all duration-200"
                >
                  Sign in here
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div
          className={`mt-8 text-center ${dark ? "text-gray-500" : "text-gray-600"}`}
        >
          <p className="text-sm">
            By signing in, you agree to our{" "}
            <a href="#" className="hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
          </p>
          <p className="text-xs mt-2">
            © {new Date().getFullYear()} VendorHub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
