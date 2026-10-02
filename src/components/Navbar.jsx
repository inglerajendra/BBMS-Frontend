import axios from "axios";
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, LayoutDashboard, Users, FileText, TrendingDown } from "lucide-react";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
          isActive 
            ? "bg-indigo-50 text-indigo-700 shadow-sm" 
            : "text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
        }`}
      >
        <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-gray-400"}`} />
        {children}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex-shrink-0 flex items-center group">
            {/* Kept the original logo image */}
            <img src="/colored-logo.png" alt="Logo" className="h-16 group-hover:opacity-90 transition-opacity" />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-2">
            {user && (
              <>
                <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
                <NavLink to="/customers" icon={Users}>Customers</NavLink>
                <NavLink to="/invoices" icon={FileText}>Invoices</NavLink>
                <NavLink to="/expenses" icon={TrendingDown}>Expenses</NavLink>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="text-sm font-bold text-gray-800">{user.name}</span>
                  <span className="text-xs text-gray-500 font-medium">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 rounded-xl px-4 py-2 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all shadow-sm font-semibold text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link 
                  to="/login" 
                  className="px-5 py-2 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-xl transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-sm hover:shadow transition-all"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
