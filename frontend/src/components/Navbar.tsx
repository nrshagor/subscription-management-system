import { NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useTheme } from "../context/useTheme";
import {
  Store,
  LayoutDashboard,
  Package,
  LogOut,
  LogIn,
  ChevronRight,
  User,
  Moon,
  Sun,
  Home,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-white/20 dark:bg-gray-700/50 text-white px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2.5 transition-all duration-300 shadow-inner"
      : "text-black dark:text-gray-200  hover:dark:text-white hover:bg-black/10 hover:dark:bg-white/10 dark:hover:bg-gray-700/30 px-4 py-2.5 rounded-lg flex items-center gap-2.5 transition-all duration-300";

  return (
    <nav className="bg-gradient-to-r from-gray-100 to-gray-100 dark:from-gray-900 dark:to-gray-950 text-white shadow-xl border-b border-gray-300/50 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <NavLink to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Home className="h-5 w-5" />
              </div>
              <div className="hidden md:block">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  VendorHub
                </span>
                <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300" />
              </div>
            </NavLink>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/vendors" className={linkClass}>
              <Store className="h-4 w-4" />
              Vendors
              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </NavLink>

            <NavLink to="/dashboard" className={linkClass}>
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </NavLink>

            <NavLink to="/products" className={linkClass}>
              <Package className="h-4 w-4" />
              Products
              <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </NavLink>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggle}
              className="group relative p-2 rounded-full bg-gray-700/50 dark:bg-gray-800/50 hover:bg-gray-600/50 dark:hover:bg-gray-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
              aria-label="Toggle theme"
            >
              <div className="relative h-5 w-5">
                <Sun
                  className={`h-5 w-5 text-yellow-400 transition-all duration-500 ${dark ? "opacity-0 rotate-90" : "opacity-100 rotate-0"}`}
                />
                <Moon
                  className={`absolute top-0 left-0 h-5 w-5 text-blue-300 transition-all duration-500 ${dark ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"}`}
                />
              </div>
            </button>

            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-gray-800/30 dark:bg-gray-900/50 px-3 py-2 rounded-full border border-gray-700/50 dark:border-gray-700">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{user.name || "User"}</div>
                    <div className="text-xs text-gray-400">Logged in</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="group flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20 active:scale-95"
                >
                  <LogOut className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <NavLink
                to="/login"
                className="group flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-4 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
              >
                <LogIn className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                <span>Login</span>
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700/50 mt-2 animate-fadeIn">
            <div className="space-y-2">
              <NavLink
                to="/vendors"
                className={({ isActive }) =>
                  `flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? " text-black dark:text-white bg-white/10 dark:bg-gray-800"
                      : "text-black dark:text-white hover:bg-gray-700/50"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <Store className="h-5 w-5" />
                  <span>Vendors</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </NavLink>

              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? " text-black dark:text-white bg-white/10 dark:bg-gray-800"
                      : " text-black dark:text-white hover:bg-gray-700/50"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </NavLink>

              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-black dark:text-white bg-white/10 dark:bg-gray-800"
                      : "text-black dark:text-white hover:bg-gray-700/50"
                  }`
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <Package className="h-5 w-5" />
                  <span>Products</span>
                </div>
                <ChevronRight className="h-4 w-4" />
              </NavLink>

              <div className="flex items-center justify-between p-3">
                <div className="flex items-center space-x-3 text-black dark:text-white">
                  {dark ? (
                    <Moon className="h-5 w-5 text-blue-300" />
                  ) : (
                    <Sun className="h-5 w-5 text-yellow-400" />
                  )}
                  <span>Dark Mode</span>
                </div>
                <button
                  onClick={toggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    dark ? "bg-blue-600" : "bg-gray-400"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                      dark ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {user ? (
                <>
                  <div className="p-3 bg-gray-800/30 dark:bg-gray-900/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name || "User"}</div>
                        <div className="text-sm text-gray-400">Logged in</div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 p-3 rounded-lg font-semibold transition-all duration-300"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 p-3 rounded-lg font-semibold transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
