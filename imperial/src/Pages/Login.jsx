import { useState } from 'react';
import { useNavigate,Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_BACKEND_URL

const Login = () => {
     const navigate = useNavigate();

  // ✅ If already logged in — redirect to admin
  const token = localStorage.getItem('token');
  if (token) return  <Navigate to="/admin" />;
  
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/plant/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.message || 'Invalid credentials');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      navigate('/admin');

    } catch (err) {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#162D24] to-[#1B4732] flex items-center justify-center px-6">

      {/* Card */}
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="dancing-script-true text-[#d1c4a1] text-6xl mb-2">
            The Imperial Garden
          </h1>
          <div className="w-16 h-px bg-[#d1c4a1]/30 mx-auto mt-4" />
          <p className="text-[#d1c4a1]/40 text-xs tracking-[0.4em] uppercase mt-4">
            Admin Portal
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-[#d1c4a1]/60 text-xs tracking-widest uppercase">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="admin@example.com"
              autoComplete="off"
              required
              className="bg-[#1a3d2b] border border-[#d1c4a1]/30 text-[#d1c4a1] placeholder:text-[#d1c4a1]/20 px-4 py-3 text-sm tracking-wide focus:outline-none focus:border-[#d1c4a1] rounded-sm w-full transition-colors"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-[#d1c4a1]/60 text-xs tracking-widest uppercase">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="bg-[#1a3d2b] border border-[#d1c4a1]/30 text-[#d1c4a1] placeholder:text-[#d1c4a1]/20 px-4 py-3 pr-12 text-sm tracking-wide focus:outline-none focus:border-[#d1c4a1] rounded-sm w-full transition-colors"
              />
              {/* Show/hide toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#d1c4a1]/40 hover:text-[#d1c4a1] transition-colors text-xs tracking-widest uppercase"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div className="border border-red-400/30 bg-red-400/10 px-4 py-3 rounded-sm">
              <p className="text-red-400 text-xs tracking-wide">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d1c4a1] text-[#162D24] py-4 text-sm tracking-widest uppercase font-medium hover:bg-[#c4b48e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#162D24" strokeWidth="2" strokeDasharray="40 20" strokeLinecap="round"/>
                </svg>
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>

        </form>

        {/* Divider */}
        <div className="w-full h-px bg-[#d1c4a1]/10 mt-12" />

        {/* Back to site */}
        <p className="text-center mt-6">
          <Link
            to="/"
            className="text-[#d1c4a1]/40 text-xs tracking-widest uppercase hover:text-[#d1c4a1]/70 transition-colors">
            ← Back to site
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;

