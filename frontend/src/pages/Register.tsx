import React, { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate, Link } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Key,
} from "lucide-react";
import { useTheme } from "../context/useTheme";

const Register = () => {
  const { register } = useAuth();
  const { dark } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    // Password validation
    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      await register(
        form.name,
        form.email,
        form.password,
        form.password_confirmation,
      );
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (password: string) => {
    setForm({ ...form, password });
    // Simple password strength calculation
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  };

  const getStrengthColor = () => {
    if (passwordStrength < 50) return "bg-red-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 75) return "Medium";
    return "Strong";
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center ${dark ? "bg-gradient-to-br from-gray-900 to-gray-950" : "bg-gradient-to-br from-indigo-50 to-purple-50"} p-4 transition-colors duration-300`}
    >
      <div className="relative w-full max-w-lg">
        {/* Decorative elements */}
        <div className="absolute -top-10 -left-10 w-60 h-60 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-gradient-to-br from-blue-400/20 to-cyan-500/20 rounded-full blur-3xl" />

        <div
          className={`relative backdrop-blur-sm ${dark ? "bg-gray-900/80 border-gray-800" : "bg-white/90 border-gray-200"} rounded-2xl shadow-2xl border overflow-hidden transition-colors duration-300`}
        >
          {/* Header */}
          <div
            className={`p-8 text-center ${dark ? "bg-gradient-to-r from-purple-900/50 to-blue-900/50" : "bg-gradient-to-r from-purple-600 to-blue-600"}`}
          >
            <div className="flex justify-center mb-4">
              <div
                className={`p-3 rounded-full ${dark ? "bg-gray-800/50" : "bg-white/20"} backdrop-blur-sm animate-pulse-slow`}
              >
                <UserPlus
                  className={`h-8 w-8 ${dark ? "text-purple-400" : "text-white"}`}
                />
              </div>
            </div>
            <h1
              className={`text-3xl font-bold ${dark ? "text-white" : "text-white"} mb-2`}
            >
              Create Account
            </h1>
            <p className={`${dark ? "text-gray-300" : "text-purple-100"}`}>
              Join our community today
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="m-6 animate-fadeIn">
              <div
                className={`flex items-center gap-3 p-4 rounded-xl ${dark ? "bg-red-500/10 border border-red-500/30" : "bg-red-50 border border-red-200"}`}
              >
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div className="flex-1">
                  <p
                    className={`font-medium ${dark ? "text-red-400" : "text-red-600"}`}
                  >
                    Registration Error
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
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 animate-bounce" />
                <div className="flex-1">
                  <p
                    className={`font-medium ${dark ? "text-green-400" : "text-green-600"}`}
                  >
                    Registration Successful!
                  </p>
                  <p
                    className={`text-sm mt-1 ${dark ? "text-green-300" : "text-green-500"}`}
                  >
                    Welcome aboard! Redirecting to dashboard...
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label
                className={`flex items-center gap-2 text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}
              >
                <User className="h-4 w-4" />
                Full Name
              </label>
              <div
                className={`relative group ${dark ? "bg-gray-800/50" : "bg-gray-50"} rounded-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-purple-500/30`}
              >
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={`w-full px-4 py-4 pl-12 ${dark ? "text-white bg-gray-800/50 focus:bg-gray-800/80" : "text-gray-900 bg-gray-50 focus:bg-white"} rounded-xl border-0 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 placeholder-gray-500`}
                  placeholder="John Doe"
                  required
                />
                <User
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${dark ? "text-gray-400 group-focus-within:text-purple-400" : "text-gray-500 group-focus-within:text-purple-500"} transition-colors duration-200`}
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label
                className={`flex items-center gap-2 text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}
              >
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <div
                className={`relative group ${dark ? "bg-gray-800/50" : "bg-gray-50"} rounded-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-purple-500/30`}
              >
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={`w-full px-4 py-4 pl-12 ${dark ? "text-white bg-gray-800/50 focus:bg-gray-800/80" : "text-gray-900 bg-gray-50 focus:bg-white"} rounded-xl border-0 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 placeholder-gray-500`}
                  placeholder="you@example.com"
                  required
                />
                <Mail
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${dark ? "text-gray-400 group-focus-within:text-purple-400" : "text-gray-500 group-focus-within:text-purple-500"} transition-colors duration-200`}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label
                className={`flex items-center gap-2 text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}
              >
                <Key className="h-4 w-4" />
                Password
              </label>
              <div
                className={`relative group ${dark ? "bg-gray-800/50" : "bg-gray-50"} rounded-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-purple-500/30`}
              >
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`w-full px-4 py-4 pl-12 pr-12 ${dark ? "text-white bg-gray-800/50 focus:bg-gray-800/80" : "text-gray-900 bg-gray-50 focus:bg-white"} rounded-xl border-0 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 placeholder-gray-500`}
                  placeholder="Create a strong password"
                  required
                />
                <Lock
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${dark ? "text-gray-400 group-focus-within:text-purple-400" : "text-gray-500 group-focus-within:text-purple-500"} transition-colors duration-200`}
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

              {/* Password Strength Meter */}
              {form.password && (
                <div className="space-y-1 animate-fadeIn">
                  <div className="flex justify-between text-xs">
                    <span className={dark ? "text-gray-400" : "text-gray-600"}>
                      Password strength
                    </span>
                    <span
                      className={`font-medium ${
                        passwordStrength < 50
                          ? "text-red-500"
                          : passwordStrength < 75
                            ? "text-yellow-500"
                            : "text-green-500"
                      }`}
                    >
                      {getStrengthText()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getStrengthColor()} transition-all duration-300 ease-out`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <ul
                    className={`text-xs ${dark ? "text-gray-400" : "text-gray-600"} grid grid-cols-2 gap-1 mt-2`}
                  >
                    <li className="flex items-center gap-1">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${form.password.length >= 6 ? "bg-green-500" : "bg-gray-400"}`}
                      />
                      At least 6 characters
                    </li>
                    <li className="flex items-center gap-1">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(form.password) ? "bg-green-500" : "bg-gray-400"}`}
                      />
                      Uppercase letter
                    </li>
                    <li className="flex items-center gap-1">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${/[0-9]/.test(form.password) ? "bg-green-500" : "bg-gray-400"}`}
                      />
                      Number
                    </li>
                    <li className="flex items-center gap-1">
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${/[^A-Za-z0-9]/.test(form.password) ? "bg-green-500" : "bg-gray-400"}`}
                      />
                      Special character
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label
                className={`flex items-center gap-2 text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}
              >
                <ShieldCheck className="h-4 w-4" />
                Confirm Password
              </label>
              <div
                className={`relative group ${dark ? "bg-gray-800/50" : "bg-gray-50"} rounded-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-purple-500/30`}
              >
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.password_confirmation}
                  onChange={(e) =>
                    setForm({ ...form, password_confirmation: e.target.value })
                  }
                  className={`w-full px-4 py-4 pl-12 pr-12 ${dark ? "text-white bg-gray-800/50 focus:bg-gray-800/80" : "text-gray-900 bg-gray-50 focus:bg-white"} rounded-xl border-0 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 placeholder-gray-500`}
                  placeholder="Confirm your password"
                  required
                />
                <Lock
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 ${dark ? "text-gray-400 group-focus-within:text-purple-400" : "text-gray-500 group-focus-within:text-purple-500"} transition-colors duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-1 ${dark ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700"} transition-colors duration-200`}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password Match Indicator */}
              {form.password_confirmation && (
                <div className="flex items-center gap-2 animate-fadeIn">
                  {form.password === form.password_confirmation ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span
                        className={`text-xs ${dark ? "text-green-400" : "text-green-600"}`}
                      >
                        Passwords match
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span
                        className={`text-xs ${dark ? "text-red-400" : "text-red-600"}`}
                      >
                        Passwords do not match
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full group relative overflow-hidden py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${loading ? "opacity-90 cursor-not-allowed" : "hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"} ${dark ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" : "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"} text-white shadow-lg`}
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                    <span>Create Account</span>
                  </>
                )}
              </div>

              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {success && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center"></div>
              )}
            </button>

            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
              <p
                className={`text-sm ${dark ? "text-gray-400" : "text-gray-600"}`}
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="group inline-flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold hover:underline transition-all duration-200"
                >
                  Login here
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
