import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import logoBlack from '../../assets/logo/logoBlack.png';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ✅ Redirect if already logged in
  if (token && role) {
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "sales") return <Navigate to="/sales-dashboard" replace />;
    if (role === "hr") return <Navigate to="/hr/dashboard" replace />;
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Both fields are required.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);

        if (data.role === "admin") navigate("/admin", { replace: true });
        else if (data.role === "sales") navigate("/sales-dashboard", { replace: true });
        else if (data.role === "hr") navigate("/hr", { replace: true });
      } else {
        setError(data.error || 'Login failed. Check your credentials.');
      }
    } catch {
      setError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e6f4ea] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Decorative background */}
      <div className="absolute -right-20 -bottom-20 w-96 h-96 border border-green-100 rounded-full pointer-events-none"></div>
      <div className="absolute -right-10 -bottom-10 w-96 h-96 border border-green-50 rounded-full pointer-events-none"></div>

      <div className="bg-white rounded-[24px] shadow-sm p-10 w-full max-w-[440px] z-10">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img src={logoBlack} loading='lazy' className='h-[55px] w-[260px]' alt="" />
          </div>
          <h1 className="text-[1.75rem] font-serif text-[#1a3a2a] mb-2">Login Panel</h1>
          <p className="text-gray-500 text-sm">Sign in to continue</p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[0.7rem] font-bold tracking-widest uppercase text-[#438e64]">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="admin@gmail.com"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#438e64]"
            />
          </div>

          {/* Password */}
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
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#438e64]"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2B8C44] hover:bg-[#367552] text-white py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>

        {/* 🔥 Register Button */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Don't have an account?</p>
          <button
            onClick={() => navigate("/register")}
            className="text-[#2B8C44] font-semibold hover:underline"
          >
            Register Now
          </button>
        </div>

        {/* Back to website */}
        <div className="mt-6 text-center">
          <a href="/" className="text-gray-400 hover:text-gray-500 text-sm flex items-center justify-center gap-1">
            <span>←</span> Back to website
          </a>
        </div>

      </div>
    </div>
  );
};

export default Login;