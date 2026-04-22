import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import logoBlack from '../../assets/logo/logoBlack.png';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Register = () => {
  const navigate = useNavigate();
  // Updated state to include all schema fields
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: '' // Requires "sales", "hr", or "admin"
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const currentRole = localStorage.getItem("role");

  // If already logged in, redirect based on role
  if (token && currentRole) {
    if (currentRole === "admin") return <Navigate to="/admin" replace />;
    if (currentRole === "sales") return <Navigate to="/sales-dashboard" replace />;
    if (currentRole === "hr") return <Navigate to="/hr/dashboard" replace />;
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required schema fields
    if (!form.name || !form.email || !form.password || !form.role) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      // Assuming your backend route for creating a user is /api/auth/register
      const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      
      if (res.ok && data.token) {
        // Auto-login after registration
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        
        // Redirect based on role
        if (data.role === "admin") navigate("/admin", { replace: true });
        else if (data.role === "sales") navigate("/sales-dashboard", { replace: true });
        else if (data.role === "hr") navigate("/hr", { replace: true });
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch {
      setError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e6f4ea] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Decorative background circles */}
      <div className="absolute -right-20 -bottom-20 w-96 h-96 border border-green-100 rounded-full pointer-events-none"></div>
      <div className="absolute -right-10 -bottom-10 w-96 h-96 border border-green-50 rounded-full pointer-events-none"></div>

      <div className="bg-white rounded-[24px] shadow-sm p-10 w-full max-w-[440px] z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src={logoBlack} loading='lazy' className='h-[55px] w-[260px]' alt="Logo" />
          </div>
          <h1 className="text-[1.75rem] font-serif text-[#1a3a2a] mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm">Register a new system user</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="text-[0.7rem] font-bold tracking-widest uppercase text-[#438e64]">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#438e64] transition-colors"
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[0.7rem] font-bold tracking-widest uppercase text-[#438e64]">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="user@example.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#438e64] transition-colors"
            />
          </div>

          {/* Role Dropdown */}
          <div className="space-y-2">
            <label className="text-[0.7rem] font-bold tracking-widest uppercase text-[#438e64]">
              Assign Role
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:border-[#438e64] transition-colors appearance-none"
            >
              <option value="" disabled>Select a role...</option>
              <option value="sales">Sales</option>
              <option value="hr">HR</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-[0.7rem] font-bold tracking-widest uppercase text-[#438e64]">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:border-[#438e64] transition-colors"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2B8C44] hover:bg-[#367552] text-white py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 mt-2"
          >
            {loading ? 'Processing...' : 'Register User'}
            {!loading && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="/login" className="text-gray-400 hover:text-[#438e64] text-sm transition-colors flex items-center justify-center gap-1">
            <span>←</span> Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;